const fs = require("node:fs");
const path = require("node:path");
const { hashValue, lstatPath } = require("./fs-ops");

// One block serves both tools: it ignores only paths that hello-scholar's layout introduces,
// so Run Records and configs stay trackable while large artifacts and raw logs stay out of Git.
// Common names such as data/ or tmp/ are left to the project because they may already be tracked.
const GITIGNORE_BEGIN = "# HELLO-SCHOLAR:BEGIN";
const GITIGNORE_END = "# HELLO-SCHOLAR:END";
const GITIGNORE_LINES = [
  "# Large research outputs and raw Run logs; Run Records stay tracked.",
  "/artifacts/",
  "/runs/*/logs/",
];

function gitignorePath(projectRoot) {
  return path.join(projectRoot, ".gitignore");
}

function gitignoreBlock(newline = "\n") {
  return [GITIGNORE_BEGIN, ...GITIGNORE_LINES, GITIGNORE_END].join(newline);
}

function findBlock(text) {
  // Purpose: locate the managed block; Input: file text; Output: { start, end, block } when markers are unique and ordered, "malformed" when not, or null when absent.
  const beginCount = text.split(GITIGNORE_BEGIN).length - 1;
  const endCount = text.split(GITIGNORE_END).length - 1;
  if (beginCount === 0 && endCount === 0) {
    return null;
  }
  const start = text.indexOf(GITIGNORE_BEGIN);
  const endIndex = text.indexOf(GITIGNORE_END);
  if (beginCount !== 1 || endCount !== 1 || endIndex < start) {
    return "malformed";
  }
  const end = endIndex + GITIGNORE_END.length;
  return { start, end, block: text.slice(start, end) };
}

function newlineOf(text) {
  return text.includes("\r\n") ? "\r\n" : "\n";
}

function inspectGitignore(projectRoot) {
  // Purpose: classify the project .gitignore without writing; Output: absent, managed-clean, managed-conflict (approvable), or unowned.
  const targetPath = gitignorePath(projectRoot);
  const stat = lstatPath(targetPath);
  if (!stat) {
    return { state: "absent", targetPath, existingText: "", exists: false };
  }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    return { state: "unowned", targetPath, reason: "gitignore target is not a regular file" };
  }
  const existingText = fs.readFileSync(targetPath, "utf8");
  const found = findBlock(existingText);
  if (found === null) {
    return { state: "absent", targetPath, existingText };
  }
  if (found === "malformed") {
    return { state: "unowned", targetPath, existingText, reason: "gitignore markers are incomplete or malformed" };
  }
  if (found.block === gitignoreBlock(newlineOf(existingText))) {
    return { state: "managed-clean", targetPath, existingText };
  }
  return {
    state: "managed-conflict",
    targetPath,
    existingText,
    actualDigest: hashValue(found.block),
    reason: "gitignore block differs from the current template",
  };
}

function writeGitignore(inspected) {
  // Purpose: create, append, or replace the managed block; Output: "created", "updated", or "unchanged"; Side effects: writes .gitignore.
  if (inspected.state === "managed-clean") {
    return "unchanged";
  }
  const text = inspected.existingText || "";
  const newline = text ? newlineOf(text) : "\n";
  const block = gitignoreBlock(newline);
  const found = findBlock(text);
  let nextText;
  if (found && found !== "malformed") {
    nextText = `${text.slice(0, found.start)}${block}${text.slice(found.end)}`;
  } else if (text === "") {
    nextText = `${block}${newline}`;
  } else {
    const separator = text.endsWith(newline) ? newline : `${newline}${newline}`;
    nextText = `${text}${separator}${block}${newline}`;
  }
  fs.writeFileSync(inspected.targetPath, nextText, "utf8");
  return inspected.exists === false ? "created" : "updated";
}

function removeGitignoreBlock(projectRoot) {
  // Purpose: remove an unchanged managed block; Output: "removed" or "skipped"; modified or foreign content is preserved.
  const inspected = inspectGitignore(projectRoot);
  if (inspected.state !== "managed-clean") {
    return "skipped";
  }
  const text = inspected.existingText;
  const found = findBlock(text);
  const newline = newlineOf(text);
  let before = text.slice(0, found.start);
  let after = text.slice(found.end);
  if (after.startsWith(newline)) {
    after = after.slice(newline.length);
  }
  if (after === "" && before.endsWith(`${newline}${newline}`)) {
    before = before.slice(0, -newline.length);
  }
  const nextText = `${before}${after}`;
  if (nextText === "") {
    fs.unlinkSync(inspected.targetPath);
  } else {
    fs.writeFileSync(inspected.targetPath, nextText, "utf8");
  }
  return "removed";
}

module.exports = {
  GITIGNORE_BEGIN,
  GITIGNORE_END,
  GITIGNORE_LINES,
  gitignoreBlock,
  inspectGitignore,
  removeGitignoreBlock,
  writeGitignore,
};
