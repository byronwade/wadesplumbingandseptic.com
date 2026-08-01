import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export const repositoryRoot = resolve(import.meta.dirname, "..");

export function git(args) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    encoding: "utf8",
  }).trim();
}

export function workingTreeHash() {
  const status = git(["status", "--porcelain=v1", "--untracked-files=all"])
    .split("\n")
    .filter(Boolean)
    .sort()
    .join("\n");
  return createHash("sha256").update(status, "utf8").digest("hex");
}

export function npmExecutable() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

export function runCommand({ name, args, cwd = repositoryRoot }) {
  const startedAt = new Date().toISOString();
  const started = performance.now();
  const result = spawnSync(name, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
  const durationMs = Math.round(performance.now() - started);
  return {
    command: [name, ...args].join(" "),
    started_at: startedAt,
    duration_ms: durationMs,
    exit_code: result.status ?? 1,
    status: result.status === 0 ? "PASSED" : "FAILED",
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error ? String(result.error.message ?? result.error) : null,
  };
}

export function toolVersions() {
  const value = (name, args) => {
    try {
      return execFileSync(name, args, {
        cwd: repositoryRoot,
        encoding: "utf8",
      }).trim();
    } catch {
      return "unavailable";
    }
  };
  return {
    node: process.version,
    npm: value(npmExecutable(), ["--version"]),
    git: value("git", ["--version"]),
  };
}

export function writeJson(path, value) {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function writeText(path, value) {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, value, "utf8");
}

export function latestVerificationResult() {
  const pointer = resolve(
    repositoryRoot,
    "artifacts",
    "verification",
    "latest.json",
  );
  return JSON.parse(readFileSync(pointer, "utf8"));
}
