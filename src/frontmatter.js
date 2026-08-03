class FrontMatterError extends Error {
  constructor(sourcePath, lineNumber, message) {
    // Purpose: create a source-aware parse error; Input: path, line, and message; Output: initialized FrontMatterError.
    super(`${sourcePath}:${lineNumber}: ${message}`);
    this.name = "FrontMatterError";
    this.sourcePath = sourcePath;
    this.lineNumber = lineNumber;
  }
}

function fail(sourcePath, lineNumber, message) {
  // Purpose: stop parsing with location context; Input: path, line, and message; Output: none; Errors: always throws FrontMatterError.
  throw new FrontMatterError(sourcePath, lineNumber, message);
}

function parseDoubleQuoted(value, sourcePath, lineNumber) {
  // Purpose: decode one restricted double-quoted scalar; Input: raw scalar and location; Output: decoded string; Errors: invalid quoting or JSON escape.
  if (!value.endsWith('"') || value.length === 1) {
    fail(sourcePath, lineNumber, "unclosed double quote");
  }

  try {
    return JSON.parse(value);
  } catch {
    fail(sourcePath, lineNumber, "invalid double-quoted string");
  }
}

function parseSingleQuoted(value, sourcePath, lineNumber) {
  // Purpose: decode one YAML-style single-quoted scalar; Input: raw scalar and location; Output: decoded string; Errors: invalid quoting.
  if (!value.endsWith("'") || value.length === 1) {
    fail(sourcePath, lineNumber, "unclosed single quote");
  }

  const inner = value.slice(1, -1);
  let result = "";
  for (let index = 0; index < inner.length; index += 1) {
    if (inner[index] !== "'") {
      result += inner[index];
      continue;
    }
    if (inner[index + 1] !== "'") {
      fail(sourcePath, lineNumber, "invalid single-quoted string");
    }
    result += "'";
    index += 1;
  }
  return result;
}

function splitArrayItems(content, sourcePath, lineNumber) {
  // Purpose: split a flat array without losing quoted commas; Input: array body and location; Output: trimmed scalar items; Errors: nesting or malformed quotes.
  const items = [];
  let start = 0;
  let quote = null;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (quote === '"') {
      if (character === "\\") {
        index += 1;
      } else if (character === '"') {
        quote = null;
      }
      continue;
    }

    if (quote === "'") {
      if (character === "'" && content[index + 1] === "'") {
        index += 1;
      } else if (character === "'") {
        quote = null;
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "[" || character === "]" || character === "{" || character === "}") {
      fail(sourcePath, lineNumber, "nested arrays and objects are not supported");
    } else if (character === ",") {
      items.push(content.slice(start, index).trim());
      start = index + 1;
    }
  }

  if (quote !== null) {
    fail(sourcePath, lineNumber, `unclosed ${quote === '"' ? "double" : "single"} quote`);
  }

  items.push(content.slice(start).trim());
  if (items.some((item) => item === "")) {
    fail(sourcePath, lineNumber, "empty array item");
  }
  return items;
}

function parseScalar(rawValue, sourcePath = "<input>", lineNumber = 1) {
  // Purpose: parse one value in the supported Front Matter subset; Input: raw value and location; Output: scalar or flat array; Errors: unsupported or malformed syntax.
  const value = rawValue.trim();

  if (value === "") {
    return "";
  }
  if (/^[|>]/.test(value)) {
    fail(sourcePath, lineNumber, "multiline values are not supported");
  }
  if (/^[&*!]/.test(value)) {
    fail(sourcePath, lineNumber, "anchors, aliases, and tags are not supported");
  }
  if (value.startsWith("{")) {
    fail(sourcePath, lineNumber, "objects are not supported");
  }
  if (value.startsWith('"')) {
    return parseDoubleQuoted(value, sourcePath, lineNumber);
  }
  if (value.startsWith("'")) {
    return parseSingleQuoted(value, sourcePath, lineNumber);
  }
  if (value.startsWith("[")) {
    if (!value.endsWith("]")) {
      fail(sourcePath, lineNumber, "unclosed array");
    }
    const content = value.slice(1, -1).trim();
    if (content === "") {
      return [];
    }
    return splitArrayItems(content, sourcePath, lineNumber).map((item) =>
      parseScalar(item, sourcePath, lineNumber)
    );
  }
  if (value.includes("[") || value.includes("]")) {
    fail(sourcePath, lineNumber, "invalid array value");
  }
  if (/^-?\d+$/.test(value)) {
    const number = Number(value);
    if (!Number.isSafeInteger(number)) {
      fail(sourcePath, lineNumber, "integer is outside the safe range");
    }
    return number;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value === "null") {
    return null;
  }
  return value;
}

function readLine(text, offset) {
  // Purpose: read one LF/CRLF-neutral logical line; Input: document text and byte offset; Output: content, next offset, and ending flag.
  const newline = text.indexOf("\n", offset);
  if (newline === -1) {
    return { content: text.slice(offset), nextOffset: text.length, hasEnding: false };
  }

  const contentEnd = newline > offset && text[newline - 1] === "\r" ? newline - 1 : newline;
  return {
    content: text.slice(offset, contentEnd),
    nextOffset: newline + 1,
    hasEnding: true,
  };
}

function parseFrontMatter(text, sourcePath = "<input>") {
  // Purpose: parse a complete restricted Front Matter block; Input: Markdown text and source label; Output: attributes and body; Errors: FrontMatterError on invalid input.
  if (typeof text !== "string") {
    fail(sourcePath, 1, "document must be a string");
  }

  const opening = readLine(text, 0);
  if (opening.content !== "---") {
    fail(sourcePath, 1, "missing opening front matter boundary");
  }

  const attributes = {};
  let offset = opening.nextOffset;
  let lineNumber = 2;

  while (offset < text.length) {
    const line = readLine(text, offset);
    if (line.content === "---") {
      return {
        attributes,
        body: text.slice(line.nextOffset),
      };
    }

    if (line.content.trim() !== "") {
      const separator = line.content.indexOf(":");
      if (separator === -1) {
        fail(sourcePath, lineNumber, "metadata entry must contain a colon");
      }

      const key = line.content.slice(0, separator);
      if (!/^[A-Za-z_][A-Za-z0-9_-]*$/.test(key)) {
        fail(sourcePath, lineNumber, `invalid metadata key ${JSON.stringify(key)}`);
      }
      if (Object.prototype.hasOwnProperty.call(attributes, key)) {
        fail(sourcePath, lineNumber, `duplicate metadata key ${JSON.stringify(key)}`);
      }

      Object.defineProperty(attributes, key, {
        value: parseScalar(line.content.slice(separator + 1), sourcePath, lineNumber),
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }

    offset = line.nextOffset;
    lineNumber += 1;
    if (!line.hasEnding) {
      break;
    }
  }

  fail(sourcePath, lineNumber, "missing closing front matter boundary");
}

module.exports = {
  FrontMatterError,
  parseFrontMatter,
  parseScalar,
};
