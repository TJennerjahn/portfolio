import fs from "node:fs";
import path from "node:path";

const SOURCE_DIR = path.join(process.cwd(), "content", "blog", "Attachments");
const TARGET_DIR = path.join(process.cwd(), "public", "blog-images");
const SHOULD_WATCH = process.argv.includes("--watch");

function getFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFiles(entryPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function copyIfChanged(source, target) {
  if (fs.existsSync(target)) {
    const sourceStat = fs.statSync(source);
    const targetStat = fs.statSync(target);

    if (
      sourceStat.size === targetStat.size &&
      sourceStat.mtimeMs <= targetStat.mtimeMs
    ) {
      return false;
    }
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return true;
}

function main() {
  syncAttachments();

  if (SHOULD_WATCH) {
    watchAttachments();
  }
}

function syncAttachments() {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  let copied = 0;

  for (const source of getFiles(SOURCE_DIR)) {
    const relativePath = path.relative(SOURCE_DIR, source);
    const target = path.join(TARGET_DIR, relativePath);

    if (copyIfChanged(source, target)) {
      copied += 1;
    }
  }

  console.log(`[sync:blog-assets] Synced ${copied} attachment files.`);
}

function watchAttachments() {
  fs.mkdirSync(SOURCE_DIR, { recursive: true });

  let syncTimeout;
  const queueSync = () => {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncAttachments, 100);
  };

  try {
    fs.watch(SOURCE_DIR, { recursive: true }, queueSync);
  } catch {
    fs.watch(SOURCE_DIR, queueSync);
  }

  console.log(`[sync:blog-assets] Watching ${SOURCE_DIR}.`);
}

main();
