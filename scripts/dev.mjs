import { spawn } from "node:child_process";
import path from "node:path";

const isWindows = process.platform === "win32";
const nextBin = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  isWindows ? "next.cmd" : "next",
);

const processes = [
  spawn(process.execPath, ["scripts/sync-blog-assets.mjs", "--watch"], {
    detached: !isWindows,
    stdio: "inherit",
  }),
  spawn(nextBin, ["dev"], {
    detached: !isWindows,
    stdio: "inherit",
  }),
];

let isShuttingDown = false;

function shutdown(exitCode = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  for (const child of processes) {
    stopChild(child);
  }

  setTimeout(() => process.exit(exitCode), 100);
}

function stopChild(child) {
  if (child.killed) {
    return;
  }

  try {
    if (!isWindows && child.pid) {
      process.kill(-child.pid, "SIGTERM");
      return;
    }
  } catch {
    // Fall through to direct child termination.
  }

  child.kill("SIGTERM");
}

for (const child of processes) {
  child.on("exit", (code, signal) => {
    if (isShuttingDown) {
      return;
    }

    if (signal) {
      shutdown(1);
      return;
    }

    shutdown(code ?? 0);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
