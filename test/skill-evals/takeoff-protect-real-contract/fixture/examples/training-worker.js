"use strict";

const fs = require("node:fs");
const { loadModelConfig } = require("../src");

function trainingRequest(path) {
  const stored = JSON.parse(fs.readFileSync(path, "utf8"));
  const config = loadModelConfig(stored);
  return { model: config.model, tokenBudget: config.limits.maxTokens };
}

if (require.main === module) {
  process.stdout.write(`${JSON.stringify(trainingRequest(process.argv[2]))}\n`);
}

module.exports = { trainingRequest };
