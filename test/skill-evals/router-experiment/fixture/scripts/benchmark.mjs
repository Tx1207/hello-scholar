#!/usr/bin/env node

import { createHash } from "node:crypto";
import { open, readFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

import { rankCandidates } from "../src/ranker.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== "--run-dir") {
  throw new Error("usage: node scripts/benchmark.mjs --run-dir runs/<run-id>");
}
const runRelative = args[1];
const runParts = runRelative.split("/");
if (path.isAbsolute(runRelative) || runParts.length !== 2 || runParts[0] !== "runs" || !runParts[1]) {
  throw new Error("run directory must be runs/<run-id>");
}
const runRoot = path.resolve(projectRoot, runRelative);
if (path.dirname(runRoot) !== path.join(projectRoot, "runs")) {
  throw new Error("run directory escapes the project runs root");
}
const recordPath = path.join(runRoot, "record.md");
const recordBytes = await readFile(recordPath);
const command = `node scripts/benchmark.mjs --run-dir ${runRelative} > ${runRelative}/outputs/benchmark.json`;
if (!recordBytes.toString("utf8").includes(command)) {
  throw new Error("the prelaunch Record must contain the exact campaign command");
}
const startedAt = new Date().toISOString();
const sentinel = {
  benchmark: "ranking-baseline",
  command,
  record_sha256_at_start: createHash("sha256").update(recordBytes).digest("hex"),
  started_at: startedAt,
};
let sentinelHandle;
try {
  sentinelHandle = await open(path.join(runRoot, ".launch-sentinel"), "wx");
  await sentinelHandle.writeFile(`${JSON.stringify(sentinel, null, 2)}\n`, "utf8");
} catch (error) {
  if (error.code === "EEXIST") {
    throw new Error("the formal ranking benchmark has already been launched");
  }
  throw error;
} finally {
  await sentinelHandle?.close();
}

const inputPath = new URL("../data/ranking-cases.json", import.meta.url);
const dataset = JSON.parse(await readFile(inputPath, "utf8"));
const iterations = 5000;
let checksum = 0;
const started = performance.now();
for (let iteration = 0; iteration < iterations; iteration += 1) {
  for (const query of dataset.queries) {
    const ranked = rankCandidates(query, dataset.candidates);
    checksum += ranked[0].score;
  }
}
const elapsedMs = performance.now() - started;
const queryCount = iterations * dataset.queries.length;
process.stdout.write(`${JSON.stringify({
  benchmark: "ranking-baseline",
  checksum,
  elapsed_ms: Number(elapsedMs.toFixed(3)),
  iterations,
  query_count: queryCount,
  queries_per_second: Number((queryCount / (elapsedMs / 1000)).toFixed(3)),
  record_sha256_at_start: sentinel.record_sha256_at_start,
  started_at: startedAt,
})}\n`);
