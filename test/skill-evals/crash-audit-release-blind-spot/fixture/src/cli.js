"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { normalizeConfig } = require("./config");

const input = process.argv[2];
if (!input) {
  throw new Error("usage: node src/cli.js <config-path>");
}

const source = path.resolve(process.cwd(), input);
const normalized = normalizeConfig(JSON.parse(fs.readFileSync(source, "utf8")));
process.stdout.write(`${JSON.stringify(normalized)}\n`);
