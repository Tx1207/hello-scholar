function parse(text) {
  const values = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) {
      continue;
    }
    const separator = line.indexOf("=");
    if (separator < 1) {
      throw new Error(`invalid legacy property: ${rawLine}`);
    }
    const key = line.slice(0, separator).trim();
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      throw new Error(`duplicate legacy property: ${key}`);
    }
    values[key] = line.slice(separator + 1).trim();
  }
  return values;
}

function stringify(values) {
  return Object.entries(values)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("\n") + "\n";
}

module.exports = { parse, stringify };
