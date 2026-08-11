#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parsePolicy } from "../src/policy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const text = await readFile(path.join(root, "fixtures", "policy.json"), "utf8");
const { ruleCount } = parsePolicy(text);
process.stdout.write(`policy-parse-valid rules=${ruleCount}\n`);
