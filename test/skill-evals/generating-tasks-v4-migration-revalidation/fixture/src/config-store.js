const fs = require("node:fs");
const path = require("node:path");

const legacyCodec = require("../vendor/legacy-properties-codec");
const { writeLegacyConfig } = require("./legacy-writer");

function canonicalConfig(value) {
  if (typeof value.endpoint !== "string" || value.endpoint.trim() === "") {
    throw new Error("endpoint must be a non-empty string");
  }
  const retries = Number(value.retries);
  if (!Number.isInteger(retries) || retries < 0) {
    throw new Error("retries must be a non-negative integer");
  }
  return { version: 2, endpoint: value.endpoint, retries };
}

function readConfig(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  if (path.extname(filePath) === ".json") {
    const parsed = JSON.parse(text);
    if (parsed.version !== 2) {
      throw new Error("JSON config must use version 2");
    }
    return canonicalConfig(parsed);
  }
  if (path.extname(filePath) === ".properties") {
    return canonicalConfig(legacyCodec.parse(text));
  }
  throw new Error(`unsupported config extension: ${path.extname(filePath)}`);
}

function writeConfig(filePath, config, options = {}) {
  const canonical = canonicalConfig(config);
  const content = options.legacyOutput
    ? writeLegacyConfig(canonical)
    : JSON.stringify(canonical, null, 2) + "\n";
  fs.writeFileSync(filePath, content, "utf8");
}

module.exports = { readConfig, writeConfig };
