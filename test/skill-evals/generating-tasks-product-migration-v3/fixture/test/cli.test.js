const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const ROOT = path.resolve(__dirname, "..");
const CLI = path.join(ROOT, "src/cli.js");

function run(args) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

test("show exposes one canonical shape for a legacy profile", () => {
  const result = run(["show", "config/profiles/east.properties"]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    version: 2,
    endpoint: "https://east.internal.example",
    retries: 4,
  });
});

test("legacy output flag still invokes the old writer", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "config-format-cli-"));
  const target = path.join(directory, "legacy.properties");
  const result = run([
    "write",
    target,
    "--endpoint",
    "https://legacy.example",
    "--retries",
    "5",
    "--legacy-output",
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    fs.readFileSync(target, "utf8"),
    "endpoint=https://legacy.example\nretries=5\n"
  );
});
