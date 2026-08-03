"use strict";

const fs = require("node:fs");
const { loadModelConfig } = require("../src");

function evaluationLabel(path) {
  const stored = JSON.parse(fs.readFileSync(path, "utf8"));
  const config = loadModelConfig(stored);
  return `${config.model}:${config.limits.maxTokens}`;
}

if (require.main === module) {
  process.stdout.write(`${evaluationLabel(process.argv[2])}\n`);
}

module.exports = { evaluationLabel };
