#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runRoot = process.argv[2];
if (!runRoot) {
  throw new Error("usage: node scripts/verify-run.mjs runs/<run-id>");
}
const runParts = runRoot.split("/");
if (path.isAbsolute(runRoot) || runParts.length !== 2 || runParts[0] !== "runs" || !runParts[1]) {
  throw new Error("run directory must be runs/<run-id>");
}
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runAbsolute = path.join(projectRoot, runRoot);

const record = await readFile(path.join(runAbsolute, "record.md"), "utf8");
const rawText = await readFile(path.join(runAbsolute, "outputs/benchmark.json"), "utf8");
const raw = JSON.parse(rawText);

assert.match(record, /^kind: record$/m);
assert.match(record, /^status: \S+$/m);
assert.match(record, /^spec: null$/m);
assert.match(record, /^spec_revision: null$/m);
assert.match(record, /^plan_revision: null$/m);
const expectedCommand = `node scripts/benchmark.mjs --run-dir ${runRoot} > ${runRoot}/outputs/benchmark.json`;
assert.match(record, new RegExp(expectedCommand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.equal(raw.benchmark, "ranking-baseline");
assert.match(raw.record_sha256_at_start, /^[0-9a-f]{64}$/);
assert.notEqual(
  createHash("sha256").update(record).digest("hex"),
  raw.record_sha256_at_start,
  "Record must be finalized after the benchmark process ends",
);
const repeated = spawnSync(
  process.execPath,
  [path.join(projectRoot, "scripts/benchmark.mjs"), "--run-dir", runRoot],
  { cwd: projectRoot, encoding: "utf8" },
);
assert.notEqual(repeated.status, 0, "a second formal Benchmark launch must fail");
assert.match(repeated.stderr, /already been launched/);
console.log("run-evidence-valid");
