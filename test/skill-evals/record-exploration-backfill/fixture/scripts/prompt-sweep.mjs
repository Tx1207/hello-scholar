#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, open, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { scoreThreshold } from "../src/router.mjs";


const root = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const outputIndex = args.indexOf("--output-dir");
const outputValue = outputIndex >= 0 ? args[outputIndex + 1] : null;
const dataset = JSON.parse(await readFile(path.join(root, "cases", "prompt-cases.json"), "utf8"));

if (!Array.isArray(dataset.cases) || dataset.cases.length !== 6 || !Array.isArray(dataset.thresholds)) {
  throw new Error("the fixed sweep requires six cases and a threshold list");
}
if (dryRun) {
  process.stdout.write(`${JSON.stringify({ dry_run: "valid", cases: 6, thresholds: dataset.thresholds.length })}\n`);
  process.exit(0);
}
if (outputValue !== ".experiment-output") {
  throw new Error("use the fixed --output-dir .experiment-output");
}

const topLevel = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const gitDir = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-dir"], { encoding: "utf8" }).trim();
const commonDir = execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], { encoding: "utf8" }).trim();
if (path.resolve(topLevel) !== path.resolve(root) || path.resolve(gitDir) === path.resolve(commonDir)) {
  throw new Error("the sweep must run at the root of a linked disposable worktree");
}

let recordPresent = false;
try {
  const runEntries = await readdir(path.join(root, "runs"), { withFileTypes: true });
  for (const entry of runEntries) {
    if (entry.isDirectory()) {
      try {
        await readFile(path.join(root, "runs", entry.name, "record.md"));
        recordPresent = true;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (recordPresent) {
  throw new Error("this qualified exploration must demonstrate launch before Record backfill");
}

const command = "node scripts/prompt-sweep.mjs --output-dir .experiment-output";
const startedAt = new Date().toISOString();
const runsRoot = path.join(root, "runs");
await mkdir(runsRoot, { recursive: true });
let sentinelHandle;
try {
  sentinelHandle = await open(
    path.join(runsRoot, ".prompt-routing-threshold-sweep.launched"),
    "wx"
  );
  await sentinelHandle.writeFile(`${JSON.stringify({ command, started_at: startedAt })}\n`, "utf8");
} catch (error) {
  if (error.code === "EEXIST") {
    throw new Error("the bounded prompt-routing sweep has already been launched");
  }
  throw error;
} finally {
  await sentinelHandle?.close();
}

const scores = dataset.thresholds.map((threshold) => scoreThreshold(dataset.cases, threshold));
const best = [...scores].sort((left, right) =>
  right.accuracy - left.accuracy || left.threshold - right.threshold
)[0];
const sweep = {
  experiment: "prompt-routing-threshold-sweep",
  case_count: dataset.cases.length,
  scores,
  best_threshold: best.threshold,
  best_accuracy: best.accuracy,
};
const sweepBytes = `${JSON.stringify(sweep, null, 2)}\n`;
const outputDir = path.join(root, outputValue);
await mkdir(outputDir, { recursive: false });
await writeFile(path.join(outputDir, "sweep.json"), sweepBytes, "utf8");
await writeFile(path.join(outputDir, "launch.json"), `${JSON.stringify({
  command,
  started_at: startedAt,
  linked_worktree_at_start: true,
  record_present_at_start: false,
  comparison_count: dataset.cases.length * dataset.thresholds.length,
  output_sha256: createHash("sha256").update(sweepBytes).digest("hex"),
}, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ best_threshold: best.threshold, best_accuracy: best.accuracy })}\n`);
