import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

function parseFrontmatter(fileContent: string) {
  const { data, content } = matter(fileContent);
  const metadata: Metadata = {
    title: String(data.title ?? ""),
    publishedAt: toDateString(data.publishedAt),
    summary: toOptionalString(data.summary),
    image: toOptionalString(data.image),
    type: String(data.type ?? ""),
    draft: toBoolean(data.draft),
    isbn: toOptionalString(data.isbn),
    rating:
      data.rating === undefined || data.rating === null || data.rating === ""
        ? undefined
        : data.rating,
  };

  return {
    metadata,
    content: content.trim(),
  };
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir): Post[] {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getPosts() {
  return getMDXData(path.join(process.cwd(), "app", "blog", "posts")).filter(
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
