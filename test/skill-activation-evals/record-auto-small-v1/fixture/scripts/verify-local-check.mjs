#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const status = () =>
  execFileSync("git", ["status", "--porcelain=v1"], {
    cwd: root,
    encoding: "utf8",
  });

assert.equal(status(), "", "fixture must be clean before verification");
const completed = spawnSync(process.execPath, [path.join(root, "scripts", "check-policy.mjs")], {
  cwd: root,
  encoding: "utf8",
});
assert.equal(completed.status, 0, completed.stderr);
assert.match(completed.stdout, /^policy-parse-valid rules=2\n$/);
assert.equal(status(), "", "the local parse check must not write project files");
process.stdout.write("local-check-valid\n");
