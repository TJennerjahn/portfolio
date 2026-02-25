import fs from "node:fs";
import path from "node:path";
import { gql, GraphQLClient } from "graphql-request";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const POSTS_DIR = path.join(process.cwd(), "app", "blog", "posts");
const OUTPUT_FILE = path.join(
  process.cwd(),
  "app",
  "blog",
  "reviews",
  "book-data.generated.json",
);
const COVERS_DIR = path.join(process.cwd(), "public", "review-covers");
const COVERS_PUBLIC_PREFIX = "/review-covers";
const HARDCOVER_ENDPOINT = "https://api.hardcover.app/v1/graphql";
const SHOULD_FAIL_BUILD = process.env.VERCEL_ENV === "production";

const BOOK_QUERY = gql`
  query Book($isbn: String!) {
    editions(
      where: { isbn_13: { _eq: $isbn } }
      limit: 1
      order_by: { users_count: desc }
    ) {
      title
      pages
      isbn_13
      book {
        description
      }
      image {
        url
      }
      contributions {
        author {
          name
        }
      }
    }
  }
`;

const EMPTY_BOOK_DATA = {
  title: "",
  imageUrl: "",
  description: "",
  pageCount: "",
  isbn_13: "",
  authors: [],
};

const CONTENT_TYPE_EXTENSION_MAP = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

function parseFrontmatter(fileContent) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) {
    return {};
  }

  const frontMatterLines = match[1].trim().split("\n");
  const metadata = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    if (!key || valueArr.length === 0) {
      return;
    }

    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1");
    metadata[key.trim()] = value;
  });

  return metadata;
}

function getReviewPosts() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => {
      const filePath = path.join(POSTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const metadata = parseFrontmatter(fileContent);
      return {
        slug: path.basename(file, ".mdx"),
        type: metadata.type,
        isbn: metadata.isbn ? String(metadata.isbn).trim() : "",
      };
    })
    .filter((post) => post.type === "Review" && Boolean(post.isbn));
}

function readExistingData() {
  if (!fs.existsSync(OUTPUT_FILE)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(OUTPUT_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeOutput(data) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(data, null, 2)}\n`);
}

function isLocalCoverPath(imageUrl) {
  return (
    typeof imageUrl === "string" && imageUrl.startsWith(`${COVERS_PUBLIC_PREFIX}/`)
  );
}

function getAbsolutePathForPublicFile(publicPath) {
  return path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

function getExistingLocalCoverPath(imageUrl) {
  if (!isLocalCoverPath(imageUrl)) {
    return "";
  }

  const absolutePath = getAbsolutePathForPublicFile(imageUrl);
  if (!fs.existsSync(absolutePath)) {
    return "";
  }

  return imageUrl;
}

function getExtensionFromContentType(contentType) {
  if (!contentType) {
    return "";
  }

  const normalized = String(contentType).split(";")[0].trim().toLowerCase();
  return CONTENT_TYPE_EXTENSION_MAP[normalized] || "";
}

function getExtensionFromUrl(imageUrl) {
  try {
    const parsed = new URL(imageUrl);
    const ext = path.extname(parsed.pathname).toLowerCase();
    if (ext) {
      return ext;
    }
  } catch {
    // Ignore malformed URL and fall back to default extension.
  }

  return "";
}

function getSafeSlug(slug) {
  return String(slug).replace(/[^a-zA-Z0-9_-]/g, "-");
}

async function downloadCoverImage(imageUrl, slug) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed with status ${response.status}`);
  }

  const ext =
    getExtensionFromContentType(response.headers.get("content-type")) ||
    getExtensionFromUrl(imageUrl) ||
    ".jpg";
  const fileName = `${getSafeSlug(slug)}${ext}`;
  const absolutePath = path.join(COVERS_DIR, fileName);
  const bytes = Buffer.from(await response.arrayBuffer());

  fs.mkdirSync(COVERS_DIR, { recursive: true });
  fs.writeFileSync(absolutePath, bytes);

  return `${COVERS_PUBLIC_PREFIX}/${fileName}`;
}

async function localizeCoverImages(output, reviews, existingData) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });

  const expectedFiles = new Set();
  let downloadFailures = 0;

  for (const review of reviews) {
    const slug = review.slug;
    const current = output[slug] || getFallbackBookData(review.isbn, null);
    const imageUrl = current.imageUrl || existingData[slug]?.imageUrl || "";
    const fallbackLocalCover = getExistingLocalCoverPath(
      existingData[slug]?.imageUrl,
    );

    if (!imageUrl) {
      current.imageUrl = fallbackLocalCover;
      output[slug] = current;
      if (current.imageUrl) {
        expectedFiles.add(path.basename(current.imageUrl));
      }
      continue;
    }

    if (isLocalCoverPath(imageUrl)) {
      const localPath = getExistingLocalCoverPath(imageUrl) || fallbackLocalCover;
      current.imageUrl = localPath;
      output[slug] = current;
      if (current.imageUrl) {
        expectedFiles.add(path.basename(current.imageUrl));
      }
      continue;
    }

    try {
      const localPath = await downloadCoverImage(imageUrl, slug);
      current.imageUrl = localPath;
      output[slug] = current;
      expectedFiles.add(path.basename(localPath));
    } catch (error) {
      downloadFailures += 1;
      current.imageUrl = fallbackLocalCover;
      output[slug] = current;
      if (current.imageUrl) {
        expectedFiles.add(path.basename(current.imageUrl));
      }
      console.warn(
        `[generate:book-data] Failed to download cover for ${slug}: ${error?.message || "unknown error"}.`,
      );
    }
  }

  if (fs.existsSync(COVERS_DIR)) {
    const existingFiles = fs.readdirSync(COVERS_DIR);
    for (const file of existingFiles) {
      if (!expectedFiles.has(file)) {
        fs.unlinkSync(path.join(COVERS_DIR, file));
      }
    }
  }

  return downloadFailures;
}

function normalizeToken(rawToken) {
  if (!rawToken) {
    return null;
  }

  const trimmed = String(rawToken).trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/^Bearer\s+/i, "").trim();
}

function getFallbackBookData(isbn, existingBookData) {
  if (existingBookData) {
    return existingBookData;
  }

  return {
    ...EMPTY_BOOK_DATA,
    isbn_13: String(isbn || ""),
  };
}

function isAuthError(error) {
  const status = error?.response?.status;
  if (status === 401 || status === 403) {
    return true;
  }

  const message = getGraphqlErrorMessage(error).toLowerCase();
  return (
    message.includes("401") ||
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("authentication") ||
    message.includes("access denied")
  );
}

function getGraphqlErrorMessage(error) {
  if (Array.isArray(error?.response?.errors) && error.response.errors.length > 0) {
    const first = error.response.errors[0];
    if (first?.message) {
      return String(first.message);
    }
  }

  if (error?.message) {
    return String(error.message);
  }

  return "Unknown error";
}

async function fetchBookByIsbn(client, isbn) {
  const data = await client.request(BOOK_QUERY, { isbn });

  if (!data?.editions || data.editions.length === 0) {
    return {
      ...EMPTY_BOOK_DATA,
      isbn_13: String(isbn),
    };
  }

  const edition = data.editions[0];
  const authors = Array.isArray(edition.contributions)
    ? edition.contributions
        .filter((contribution) => contribution?.author?.name)
        .map((contribution) => String(contribution.author.name))
    : [];

  return {
    title: String(edition.title || ""),
    imageUrl: String(edition.image?.url || ""),
    description: String(edition.book?.description || ""),
    pageCount: edition.pages ? String(edition.pages) : "",
    isbn_13: String(edition.isbn_13 || isbn),
    authors,
  };
}

async function main() {
  const reviews = getReviewPosts();
  const existingData = readExistingData();
  const token = normalizeToken(process.env.HARDCOVER_BEARER_TOKEN);
  const output = {};

  if (!token) {
    console.warn(
      "[generate:book-data] HARDCOVER_BEARER_TOKEN is missing. Reusing cached review metadata.",
    );
    for (const review of reviews) {
      output[review.slug] = getFallbackBookData(
        review.isbn,
        existingData[review.slug],
      );
    }

    await localizeCoverImages(output, reviews, existingData);

    writeOutput(output);
    const withCovers = Object.values(output).filter(
      (book) => Boolean(book.imageUrl),
    ).length;
    console.log(
      `[generate:book-data] Wrote ${Object.keys(output).length} review entries (${withCovers} with local cover images).`,
    );

    if (SHOULD_FAIL_BUILD) {
      throw new Error(
        "[generate:book-data] Missing HARDCOVER_BEARER_TOKEN for production build.",
      );
    }

    return;
  }

  const client = new GraphQLClient(HARDCOVER_ENDPOINT, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  let authFailed = false;
  let fetchFailures = 0;

  for (const review of reviews) {
    if (authFailed) {
      output[review.slug] = getFallbackBookData(
        review.isbn,
        existingData[review.slug],
      );
      continue;
    }

    try {
      output[review.slug] = await fetchBookByIsbn(client, review.isbn);
    } catch (error) {
      fetchFailures += 1;
      if (isAuthError(error)) {
        authFailed = true;
        console.warn(
          "[generate:book-data] Hardcover auth failed (401). Check HARDCOVER_BEARER_TOKEN in Vercel.",
        );
      } else {
        const status = error?.response?.status;
        const message = getGraphqlErrorMessage(error);
        console.warn(
          `[generate:book-data] Failed to fetch ISBN ${review.isbn} (status: ${status ?? "unknown"}): ${message}. Using cached data if available.`,
        );
      }

      output[review.slug] = getFallbackBookData(
        review.isbn,
        existingData[review.slug],
      );
    }
  }

  const downloadFailures = await localizeCoverImages(output, reviews, existingData);

  writeOutput(output);

  const withCovers = Object.values(output).filter(
    (book) => Boolean(book.imageUrl),
  ).length;

  console.log(
    `[generate:book-data] Wrote ${Object.keys(output).length} review entries (${withCovers} with local cover images).`,
  );

  if (authFailed && SHOULD_FAIL_BUILD) {
    throw new Error(
      "[generate:book-data] Hardcover authentication failed during production build.",
    );
  }

  const missingCovers = reviews.filter(
    (review) => !output[review.slug]?.imageUrl,
  ).length;

  if (
    SHOULD_FAIL_BUILD &&
    missingCovers > 0 &&
    (fetchFailures > 0 || downloadFailures > 0)
  ) {
    throw new Error(
      `[generate:book-data] ${fetchFailures} Hardcover fetches failed, ${downloadFailures} cover downloads failed, and ${missingCovers}/${reviews.length} reviews are missing covers.`,
    );
  }
}

main().catch((error) => {
  console.error(
    "[generate:book-data] Unexpected failure. Keeping existing review metadata if present.",
    error,
  );

  const existingData = readExistingData();
  writeOutput(existingData);

  if (SHOULD_FAIL_BUILD) {
    process.exitCode = 1;
  }
});
