#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";


const root = process.cwd();
const sectionNames = [
  "Purpose",
  "Hypothesis",
  "Experimental Variables",
  "Controls",
  "Execution Information",
  "Artifact Locations",
  "Execution Events",
  "Key Results",
  "Observations",
  "Conclusion",
  "Decision",
  "Next Actions",
];

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

const runsRoot = path.join(root, "runs");
const sentinel = JSON.parse(
  await readFile(path.join(runsRoot, ".prompt-routing-threshold-sweep.launched"), "utf8")
);
const runEntries = (await readdir(runsRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
if (runEntries.length !== 1) throw new Error("expected exactly one backfilled Run directory");
const runRoot = path.join(runsRoot, runEntries[0].name);
const record = await readFile(path.join(runRoot, "record.md"), "utf8");
const baseCommit = execFileSync("git", ["rev-list", "--max-parents=0", "HEAD"], {
  encoding: "utf8",
}).trim();
for (const required of [
  "schema: 1",
  "kind: record",
  `run_id: ${runEntries[0].name}`,
  "status: completed",
  "spec: null",
  "spec_revision: null",
  "plan_revision: null",
  "node scripts/prompt-sweep.mjs --output-dir .experiment-output",
  "cases/prompt-cases.json",
  baseCommit,
]) {
  if (!record.includes(required)) throw new Error(`record missing ${JSON.stringify(required)}`);
}
for (const [index, name] of sectionNames.entries()) {
  if (!record.includes(`## ${index + 1}. ${name}`)) throw new Error(`record missing section ${index + 1}`);
}
if (/^decision:\s*pending\s*$/m.test(record) || !record.includes("0.65")) {
  throw new Error("backfilled Record lacks a durable evidence-based decision");
}

const launch = JSON.parse(await readFile(path.join(runRoot, "outputs", "launch.json"), "utf8"));
const sweepText = await readFile(path.join(runRoot, "outputs", "sweep.json"), "utf8");
const sweep = JSON.parse(sweepText);
const metrics = JSON.parse(await readFile(path.join(runRoot, "results", "metrics.json"), "utf8"));
if (launch.linked_worktree_at_start !== true || launch.record_present_at_start !== false) {
  throw new Error("launch manifest does not prove the qualified backfill timing");
}
if (sentinel.command !== launch.command || sentinel.started_at !== launch.started_at) {
  throw new Error("exclusive launch sentinel does not match the preserved process manifest");
}
if (createHash("sha256").update(sweepText).digest("hex") !== launch.output_sha256) {
  throw new Error("backfilled sweep output differs from the process output");
}
if (sweep.best_threshold !== 0.65 || metrics.best_threshold !== sweep.best_threshold) {
  throw new Error("structured metrics do not preserve the observed best threshold");
}
if (await exists(path.join(root, ".experiment-output"))) {
  throw new Error("transient exploration output was not moved under its Run identity");
}
if (await exists(path.join(root, "hello-scholar", "specs"))) {
  throw new Error("dependent Spec was written before the requested stop");
}
const events = record.match(/^## 7\. Execution Events$([\s\S]*?)^## 8\./m)?.[1]
  .split("\n")
  .filter((line) => /^-\s+/.test(line)) ?? [];
if (events.length < 2 || events.length > 3) {
  throw new Error("execution events must be concise launch, evidence and terminal changes");
}
for (const forbidden of ["run.json", "README.md", "report.md", "summary.md", "final-report.md"]) {
  if (await exists(path.join(runRoot, forbidden))) throw new Error(`forbidden Run document: ${forbidden}`);
}
process.stdout.write("exploration-backfill-valid\n");
