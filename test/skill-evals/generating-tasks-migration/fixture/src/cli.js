#!/usr/bin/env node

const { readConfig, writeConfig } = require("./config-store");

function usage() {
  return [
    "Usage:",
    "  config-format show <path>",
    "  config-format write <path> --endpoint <url> --retries <count> [--legacy-output]",
  ].join("\n");
}

function parseWriteArgs(args) {
  const values = { legacyOutput: false };
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === "--legacy-output") {
      values.legacyOutput = true;
    } else if (token === "--endpoint" || token === "--retries") {
      if (index + 1 >= args.length) {
        throw new Error(`${token} requires a value`);
      }
      values[token.slice(2)] = args[index + 1];
      index += 1;
    } else {
      throw new Error(`unknown option: ${token}`);
    }
  }
  if (values.endpoint === undefined || values.retries === undefined) {
    throw new Error("write requires --endpoint and --retries");
  }
  return values;
}

function main(argv) {
  const [command, filePath, ...rest] = argv;
  if (command === "show" && filePath && rest.length === 0) {
    process.stdout.write(JSON.stringify(readConfig(filePath)) + "\n");
    return;
  }
  if (command === "write" && filePath) {
    const values = parseWriteArgs(rest);
    writeConfig(filePath, values, { legacyOutput: values.legacyOutput });
    return;
  }
  throw new Error(usage());
}

try {
  main(process.argv.slice(2));
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
