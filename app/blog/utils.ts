import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_VAULT_DIR = path.join(process.cwd(), "content", "blog");
const IGNORED_VAULT_DIRECTORIES = new Set([
  ".obsidian",
  "Attachments",
  "Templates",
]);
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);
const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);
const ATTACHMENTS_DIRECTORY = "Attachments";
const PUBLIC_BLOG_IMAGE_PREFIX = "/blog-images";

export type Post = {
  metadata: Metadata;
  slug: string;
  content: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary?: string;
  image?: string;
  type: string;
  draft: boolean;
  isbn?: string;
  rating?: string | number;
  aliases?: string[];
};

type PostSource = Post & {
  sourcePath: string;
};

function toOptionalString(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return String(value);
}

function toDateString(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return String(value ?? "");
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => toOptionalString(item))
      .filter((item): item is string => Boolean(item));
  }

  const item = toOptionalString(value);
  return item ? [item] : [];
}

function toPosixPath(value: string) {
  return value.replace(/\\/g, "/");
}

function stripMarkdownExtension(value: string) {
  return value.replace(/\.(md|mdx|markdown)$/i, "");
}

function isExternalHref(href: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");
}

function isImagePath(value: string) {
  return IMAGE_EXTENSIONS.has(path.posix.extname(value).toLowerCase());
}

function encodePublicPath(value: string) {
  return encodeURI(value).replace(/#/g, "%23");
}

function normalizeVaultReference(value: string, sourceDirectory = "") {
  const normalizedValue = toPosixPath(value.trim()).replace(/^<|>$/g, "");

  if (normalizedValue.startsWith("./") || normalizedValue.startsWith("../")) {
    return path.posix.normalize(path.posix.join(sourceDirectory, normalizedValue));
  }

  return path.posix.normalize(normalizedValue);
}

function getAttachmentPath(value: string, sourceDirectory = "") {
  const normalizedValue = normalizeVaultReference(value, sourceDirectory);
  const parts = normalizedValue.split("/").filter(Boolean);
  const attachmentIndex = parts.findIndex(
    (part) => part === ATTACHMENTS_DIRECTORY,
  );

  if (attachmentIndex >= 0 && attachmentIndex < parts.length - 1) {
    return parts.slice(attachmentIndex + 1).join("/");
  }

  if (isImagePath(normalizedValue) && !normalizedValue.includes("/")) {
    return path.posix.basename(normalizedValue);
  }

  return "";
}

function normalizeImagePath(value: string | undefined, sourceDirectory = "") {
  if (!value) {
    return undefined;
  }

  if (
    value.startsWith(`${PUBLIC_BLOG_IMAGE_PREFIX}/`) ||
    value.startsWith("/")
  ) {
    return value;
  }

  if (isExternalHref(value) || value.startsWith("#")) {
    return value;
  }

  const attachmentPath = getAttachmentPath(value, sourceDirectory);
  if (!attachmentPath) {
    return value;
  }

  return encodePublicPath(`${PUBLIC_BLOG_IMAGE_PREFIX}/${attachmentPath}`);
}

function splitHash(value: string) {
  const [target, ...hashParts] = value.split("#");
  return {
    target,
    hash: hashParts.length > 0 ? hashParts.join("#") : "",
  };
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

function normalizePostLookupKey(value: string) {
  const { target } = splitHash(value);
  const normalized = stripMarkdownExtension(toPosixPath(target))
    .trim()
    .replace(/^\/+/, "")
    .replace(/^\.\//, "");

  return normalized.toLowerCase();
}

function getWikiLinkParts(value: string) {
  const [target, ...labelParts] = value.split("|");
  const label = labelParts.join("|").trim();

  return {
    target: target.trim(),
    label: label || undefined,
  };
}

function getWikiLabel(target: string, label?: string) {
  if (label && !/^\d+(x\d+)?$/i.test(label)) {
    return label;
  }

  const { target: targetWithoutHash, hash } = splitHash(target);
  const displayTarget = hash || targetWithoutHash;
  return stripMarkdownExtension(path.posix.basename(displayTarget)).trim();
}

function escapeMarkdownLabel(value: string) {
  return value.replace(/([[\]])/g, "\\$1");
}

function resolvePostHref(
  target: string,
  sourceDirectory: string,
  postLookup: Map<string, string>,
) {
  if (!target) {
    return "";
  }

  if (target.startsWith("#")) {
    return `#${slugify(target.slice(1))}`;
  }

  if (target.startsWith("/") || isExternalHref(target)) {
    return target;
  }

  const { target: targetWithoutHash, hash } = splitHash(target);
  const candidates = [targetWithoutHash];

  if (targetWithoutHash.startsWith("./") || targetWithoutHash.startsWith("../")) {
    candidates.push(
      path.posix.normalize(path.posix.join(sourceDirectory, targetWithoutHash)),
    );
  }

  for (const candidate of candidates) {
    const slug = postLookup.get(normalizePostLookupKey(candidate));
    if (slug) {
      return `/blog/${slug}${hash ? `#${slugify(hash)}` : ""}`;
    }
  }

  return "";
}

function normalizeMarkdownHref(
  href: string,
  sourceDirectory: string,
  postLookup: Map<string, string>,
) {
  const trimmed = href.trim();

  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("/")) {
    return trimmed;
  }

  if (isExternalHref(trimmed)) {
    return trimmed;
  }

  const imagePath = normalizeImagePath(trimmed, sourceDirectory);
  if (imagePath && imagePath !== trimmed) {
    return imagePath;
  }

  if (/\.(md|mdx|markdown)(#.*)?$/i.test(trimmed)) {
    return resolvePostHref(trimmed, sourceDirectory, postLookup) || trimmed;
  }

  return trimmed;
}

function transformMarkdownOutsideCodeBlocks(
  content: string,
  transform: (segment: string) => string,
) {
  return content
    .split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g)
    .map((segment) =>
      segment.startsWith("```") || segment.startsWith("~~~")
        ? segment
        : transform(segment),
    )
    .join("");
}

function normalizeObsidianMarkdown(
  content: string,
  sourceDirectory: string,
  postLookup: Map<string, string>,
) {
  return transformMarkdownOutsideCodeBlocks(content, (segment) =>
    segment
      .replace(/!\[\[([^\]]+)\]\]/g, (match, rawTarget) => {
        const { target, label } = getWikiLinkParts(rawTarget);
        const imagePath = normalizeImagePath(target, sourceDirectory);

        if (!imagePath || imagePath === target) {
          return match;
        }

        const alt = getWikiLabel(target, label);
        return `![${escapeMarkdownLabel(alt)}](${imagePath})`;
      })
      .replace(/\[\[([^\]]+)\]\]/g, (match, rawTarget) => {
        const { target, label } = getWikiLinkParts(rawTarget);
        const href = resolvePostHref(target, sourceDirectory, postLookup);
        const text = getWikiLabel(target, label);

        if (!href) {
          return text || match;
        }

        return `[${escapeMarkdownLabel(text)}](${href})`;
      })
      .replace(/!\[([^\]]*)\]\(([^)\n]+)\)/g, (_match, alt, href) => {
        return `![${alt}](${normalizeImagePath(href, sourceDirectory) ?? href})`;
      })
      .replace(
        /(^|[^!])\[([^\]\n]+)\]\(([^)\n]+)\)/g,
        (_match, prefix, label, href) => {
          return `${prefix}[${label}](${normalizeMarkdownHref(
            href,
            sourceDirectory,
            postLookup,
          )})`;
        },
      ),
  );
}

function parseFrontmatter(fileContent: string, filePath: string) {
  const { data, content } = matter(fileContent);
  const sourcePath = toPosixPath(path.relative(BLOG_VAULT_DIR, filePath));
  const sourceDirectory = path.posix.dirname(sourcePath);
  const metadata: Metadata = {
    title: String(data.title ?? ""),
    publishedAt: toDateString(data.publishedAt),
    summary: toOptionalString(data.summary),
    image: normalizeImagePath(toOptionalString(data.image), sourceDirectory),
    type: String(data.type ?? ""),
    draft: toBoolean(data.draft),
    isbn: toOptionalString(data.isbn),
    rating:
      data.rating === undefined || data.rating === null || data.rating === ""
        ? undefined
        : data.rating,
    aliases: toStringArray(data.aliases),
  };
  const slug = toOptionalString(data.slug) || path.basename(filePath, path.extname(filePath));

  return {
    metadata,
    slug,
    content: content.trim(),
    sourcePath,
  };
}

function getMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_VAULT_DIRECTORIES.has(entry.name)) {
        files.push(...getMarkdownFiles(entryPath));
      }
      continue;
    }

    if (MARKDOWN_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function readMarkdownFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent, filePath);
}

function buildPostLookup(posts: PostSource[]) {
  const lookup = new Map<string, string>();

  posts.forEach((post) => {
    const basename = path.posix.basename(
      post.sourcePath,
      path.posix.extname(post.sourcePath),
    );
    const withoutExtension = stripMarkdownExtension(post.sourcePath);
    const keys = [
      post.slug,
      post.metadata.title,
      basename,
      withoutExtension,
      ...toStringArray(post.metadata.aliases),
    ];

    keys.forEach((key) => {
      const normalized = normalizePostLookupKey(key);
      if (normalized && !lookup.has(normalized)) {
        lookup.set(normalized, post.slug);
      }
    });
  });

  return lookup;
}

function getMarkdownData(dir): Post[] {
  const posts = getMarkdownFiles(dir).map((file) => readMarkdownFile(file));
  const postLookup = buildPostLookup(posts);

  return posts.map((post) => ({
    metadata: post.metadata,
    slug: post.slug,
    content: normalizeObsidianMarkdown(
      post.content,
      path.posix.dirname(post.sourcePath),
      postLookup,
    ),
  }));
}

export function getPosts() {
  return getMarkdownData(BLOG_VAULT_DIR).filter(
    (post) => !post.metadata.draft && Boolean(post.metadata.publishedAt.trim()),
  );
}

function stripMarkdown(content: string) {
  return content
    .replace(/^import\s.+$/gm, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function trimExcerpt(text: string, maxLength = 180) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}…`;
}

export function getPostDescription(post: Post) {
  if (post.metadata.summary?.trim()) {
    return post.metadata.summary.trim();
  }

  return trimExcerpt(stripMarkdown(post.content));
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
