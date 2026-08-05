import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_INDEXES = [
  "hello-scholar/specs/INDEX.md",
  "hello-scholar/specs/run-navigation/INDEX.md",
  "runs/INDEX.md",
];

function snapshotFile(filePath) {
  // Purpose: fingerprint one regular file's bytes and metadata; Input: absolute file path; Output: SHA-256, mode, and nanosecond-mtime text; Errors: propagates filesystem failures.
  const stats = fs.statSync(filePath, { bigint: true });
  const sha256 = createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  return `${sha256}:${stats.mode}:${stats.mtimeNs}`;
}

function hashTree(rootPath) {
  // Purpose: capture deterministic project file bytes and metadata; Input: absolute project root; Output: relative-path to file-state map; Errors: rejects links and non-file nodes.
  const hashes = new Map();
  const pending = [rootPath];
  while (pending.length > 0) {
    const directory = pending.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Error(`link is not allowed in Fixture verification: ${absolutePath}`);
      }
      if (entry.isDirectory()) {
        pending.push(absolutePath);
      } else if (entry.isFile()) {
        hashes.set(path.relative(rootPath, absolutePath).split(path.sep).join("/"), snapshotFile(absolutePath));
      } else {
        throw new Error(`special filesystem node is not allowed: ${absolutePath}`);
      }
    }
  }
  return new Map([...hashes].sort(([left], [right]) => left.localeCompare(right)));
}

function changedPaths(before, after) {
  // Purpose: identify every byte-level tree change; Input: before and after hash maps; Output: sorted changed relative paths.
  const paths = new Set([...before.keys(), ...after.keys()]);
  return [...paths]
    .filter((relativePath) => before.get(relativePath) !== after.get(relativePath))
    .sort();
}

function runDocsSync(cliPath, projectRoot) {
  // Purpose: invoke the real hello-scholar sync command; Input: absolute CLI and project paths; Output: captured stdout; Errors: asserts a successful command; Side effects: rewrites generated Indexes in the temporary project.
  const result = spawnSync(process.execPath, [cliPath, "docs", "sync"], {
    cwd: projectRoot,
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function main() {
  // Purpose: prove first-sync scope and second-sync idempotence; Input: absolute hello-scholar CLI argv; Output: verification summary; Errors: asserts contract violations; Side effects: creates and removes one temporary Fixture copy.
  const cliPath = process.argv[2];
  assert.ok(cliPath && path.isAbsolute(cliPath), "pass the absolute hello-scholar CLI path");
  assert.ok(fs.statSync(cliPath).isFile(), `CLI is not a file: ${cliPath}`);

  const scriptPath = fileURLToPath(import.meta.url);
  const fixtureRoot = path.resolve(path.dirname(scriptPath), "..");
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hello-scholar-index-eval-"));
  const projectRoot = path.join(temporaryRoot, "project");

  try {
    fs.cpSync(fixtureRoot, projectRoot, { recursive: true });
    const baseTree = hashTree(projectRoot);
    const firstOutput = runDocsSync(cliPath, projectRoot);
    const firstTree = hashTree(projectRoot);
    assert.deepEqual(changedPaths(baseTree, firstTree), EXPECTED_INDEXES);
    assert.match(firstOutput, /docs sync: written 3, deleted 0, errors 0,/);

    const secondOutput = runDocsSync(cliPath, projectRoot);
    const secondTree = hashTree(projectRoot);
    assert.deepEqual(changedPaths(firstTree, secondTree), []);
    assert.match(secondOutput, /docs sync: written 0, deleted 0, errors 0,/);

    process.stdout.write(JSON.stringify({
      firstSyncChanged: EXPECTED_INDEXES,
      secondSyncChanged: [],
    }) + "\n");
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

main();
