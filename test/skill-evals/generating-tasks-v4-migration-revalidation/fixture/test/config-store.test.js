const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { readConfig, writeConfig } = require("../src/config-store");

const ROOT = path.resolve(__dirname, "..");

test("compatibility reader normalizes legacy and JSON profiles", () => {
  assert.deepEqual(readConfig(path.join(ROOT, "config/profiles/east.properties")), {
    version: 2,
    endpoint: "https://east.internal.example",
    retries: 4,
  });
  assert.deepEqual(readConfig(path.join(ROOT, "config/profiles/west.json")), {
    version: 2,
    endpoint: "https://west.internal.example",
    retries: 2,
  });
});

test("writer emits JSON v2 by default", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "config-format-"));
  const target = path.join(directory, "profile.json");
  writeConfig(target, { endpoint: "https://new.example", retries: 3 });
  assert.deepEqual(JSON.parse(fs.readFileSync(target, "utf8")), {
    version: 2,
    endpoint: "https://new.example",
    retries: 3,
  });
});

test("legacy writer remains available during the dual-read window", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "config-format-"));
  const target = path.join(directory, "profile.properties");
  writeConfig(
    target,
    { endpoint: "https://rollback.example", retries: 1 },
    { legacyOutput: true }
  );
  assert.equal(
    fs.readFileSync(target, "utf8"),
    "endpoint=https://rollback.example\nretries=1\n"
  );
});
