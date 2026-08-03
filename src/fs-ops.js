const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

function ensureParent(targetPath) {
  // Purpose: ensure a target's parent directory exists; Input: target path; Output: none; Side effects: creates directories recursively.
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
}

function sameRealPath(left, right) {
  // Purpose: compare two paths by resolved identity; Input: two paths; Output: true when both resolve to the same node.
  try {
    return fs.realpathSync(left) === fs.realpathSync(right);
  } catch {
    return false;
  }
}

function installSkillLink(sourceDir, targetDir) {
  // Purpose: install one managed Skill symlink; Input: source and target directories; Output: none; Side effects: creates or replaces the target link.
  ensureParent(targetDir);
  if (fs.existsSync(targetDir)) {
    if (fs.lstatSync(targetDir).isSymbolicLink() && sameRealPath(targetDir, sourceDir)) {
      return "updated";
    }
    return "skipped";
  }
  const type = process.platform === "win32" ? "junction" : "dir";
  fs.symlinkSync(sourceDir, targetDir, type);
  return "installed";
}

function copyDir(sourceDir, targetDir) {
  // Purpose: copy a Skill directory recursively; Input: source and target directories; Output: none; Side effects: creates target files.
  fs.cpSync(sourceDir, targetDir, {
    recursive: true,
    dereference: false,
    errorOnExist: false,
  });
}

function readOwnershipMarker(markerPath) {
  // Purpose: read a managed-target ownership marker when valid; Input: marker path; Output: parsed metadata or null; Side effects: reads filesystem.
  try {
    return JSON.parse(fs.readFileSync(markerPath, "utf8"));
  } catch {
    return null;
  }
}

function installSkillCopy(sourceDir, targetDir, metadata) {
  // Purpose: install a managed Skill copy with ownership metadata; Input: source, target, and marker metadata; Output: none; Side effects: replaces target files.
  if (fs.existsSync(targetDir)) {
    const marker = path.join(targetDir, ".hello-scholar-install.json");
    if (!fs.existsSync(marker)) {
      return "skipped";
    }
    const existingMetadata = readOwnershipMarker(marker);
    if (!existingMetadata || existingMetadata.tool !== metadata.tool) {
      return "skipped";
    }
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  copyDir(sourceDir, targetDir);
  fs.writeFileSync(
    path.join(targetDir, ".hello-scholar-install.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8"
  );
  return "installed";
}

function uninstallSkillTarget(targetDir, sourceDir, tool) {
  // Purpose: remove only a provably owned Skill target; Input: target, expected source, and tool; Output: removal status; Side effects: may delete owned link or copy.
  if (!fs.existsSync(targetDir)) {
    return "skipped";
  }

  const stat = fs.lstatSync(targetDir);
  if (stat.isSymbolicLink()) {
    if (sameRealPath(targetDir, sourceDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      return "removed";
    }
    return "skipped";
  }

  const marker = path.join(targetDir, ".hello-scholar-install.json");
  if (!fs.existsSync(marker)) {
    return "skipped";
  }
  const metadata = readOwnershipMarker(marker);
  if (metadata && metadata.tool === tool) {
    fs.rmSync(targetDir, { recursive: true, force: true });
    return "removed";
  }
  return "skipped";
}

function lstatIfPresent(fileSystem, targetPath) {
  // Purpose: inspect an optional filesystem node without following links; Input: filesystem adapter and path; Output: lstat or null; Errors: propagates non-ENOENT failures.
  try {
    return fileSystem.lstatSync(targetPath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function resolveBatchTarget(projectRoot, relativePath) {
  // Purpose: resolve a validated batch-relative path inside a project; Input: project root and relative path; Output: absolute path; Errors: rejects absolute or escaping paths.
  if (
    typeof relativePath !== "string"
    || relativePath === ""
    || relativePath.includes("\\")
    || path.posix.isAbsolute(relativePath)
    || relativePath.split("/").includes("..")
  ) {
    throw new Error(`invalid batch path: ${String(relativePath)}`);
  }
  const absolutePath = path.resolve(projectRoot, ...relativePath.split("/"));
  const relative = path.relative(projectRoot, absolutePath);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`batch path escapes project root: ${relativePath}`);
  }
  return absolutePath;
}

function inspectBatchTarget(fileSystem, projectRoot, relativePath) {
  // Purpose: validate an atomic-batch target and its ancestors; Input: adapter, root, and relative path; Output: absolute path and optional stat; Errors: rejects links and non-files.
  try {
    const absolutePath = resolveBatchTarget(projectRoot, relativePath);
    const segments = relativePath.split("/");
    let current = projectRoot;
    const rootStat = fileSystem.lstatSync(projectRoot);
    if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
      throw new Error("unsafe batch root");
    }
    for (const segment of segments.slice(0, -1)) {
      current = path.join(current, segment);
      const stat = fileSystem.lstatSync(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) {
        throw new Error("unsafe parent path");
      }
    }
    const stat = lstatIfPresent(fileSystem, absolutePath);
    if (stat && (stat.isSymbolicLink() || !stat.isFile())) {
      throw new Error("unsafe target path");
    }
    return { absolutePath, stat };
  } catch (error) {
    const suffix = error && error.code ? ` (${error.code})` : "";
    throw new Error(`${relativePath}: cannot prepare batch target${suffix}`);
  }
}

function createExclusiveFile(fileSystem, directory, suffix, makeToken) {
  // Purpose: reserve a collision-free temporary or backup file; Input: adapter, directory, suffix, and token factory; Output: path and descriptor; Side effects: creates an exclusive file.
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const candidate = path.join(
      directory,
      `.hello-scholar-index-${makeToken()}.${suffix}`
    );
    try {
      const descriptor = fileSystem.openSync(candidate, "wx", 0o666);
      return { path: candidate, descriptor };
    } catch (error) {
      if (error && error.code === "EEXIST") {
        continue;
      }
      throw error;
    }
  }
  throw new Error("could not allocate an exclusive batch file name");
}

function closeQuietly(fileSystem, descriptor) {
  // Purpose: close a best-effort descriptor during cleanup; Input: adapter and optional descriptor; Output: none; Side effects: closes descriptor and suppresses cleanup errors.
  if (descriptor === null || descriptor === undefined) {
    return;
  }
  try {
    fileSystem.closeSync(descriptor);
  } catch {
    // The original operation error remains the useful failure.
  }
}

function unlinkQuietly(fileSystem, targetPath) {
  // Purpose: remove an optional cleanup file; Input: adapter and optional path; Output: none; Side effects: unlinks file and suppresses cleanup errors.
  if (!targetPath) {
    return;
  }
  try {
    fileSystem.unlinkSync(targetPath);
  } catch (error) {
    if (!error || error.code !== "ENOENT") {
      throw error;
    }
  }
}

function applyAtomicFileBatch({
  projectRoot,
  writes,
  deletes,
  fileSystem = fs,
  makeToken = randomUUID,
}) {
  // Purpose: commit multiple file replacements/deletions with rollback; Input: root, write/delete sets, and adapters; Output: none; Side effects: atomically mutates target files; Errors: restores old bytes then rethrows.
  const rootPath = path.resolve(projectRoot);
  const writePaths = writes.map((item) => item.relativePath);
  const allPaths = [...writePaths, ...deletes];
  if (new Set(allPaths).size !== allPaths.length) {
    throw new Error("batch paths must be unique across writes and deletes");
  }

  const preparedWrites = writes.map((item) => ({
    ...item,
    ...inspectBatchTarget(fileSystem, rootPath, item.relativePath),
    tempPath: null,
    backupPath: null,
    originalContent: null,
  }));
  const preparedDeletes = deletes.map((relativePath) => ({
    relativePath,
    ...inspectBatchTarget(fileSystem, rootPath, relativePath),
    backupPath: null,
    originalContent: null,
  }));
  const applied = [];
  let currentPath = allPaths[0] || "<empty>";

  try {
    for (const item of preparedWrites) {
      currentPath = item.relativePath;
      const temporary = createExclusiveFile(
        fileSystem,
        path.dirname(item.absolutePath),
        "tmp",
        makeToken
      );
      item.tempPath = temporary.path;
      try {
        fileSystem.writeFileSync(temporary.descriptor, item.content, "utf8");
        fileSystem.fsyncSync(temporary.descriptor);
      } finally {
        closeQuietly(fileSystem, temporary.descriptor);
      }
    }

    for (const item of [...preparedWrites, ...preparedDeletes]) {
      if (!item.stat) {
        continue;
      }
      currentPath = item.relativePath;
      const backup = createExclusiveFile(
        fileSystem,
        path.dirname(item.absolutePath),
        "bak",
        makeToken
      );
      item.backupPath = backup.path;
      try {
        item.originalContent = fileSystem.readFileSync(item.absolutePath);
        fileSystem.writeFileSync(
          backup.descriptor,
          item.originalContent
        );
        if (typeof fileSystem.fchmodSync === "function") {
          fileSystem.fchmodSync(backup.descriptor, item.stat.mode & 0o777);
        }
        fileSystem.fsyncSync(backup.descriptor);
      } finally {
        closeQuietly(fileSystem, backup.descriptor);
      }
    }

    for (const item of preparedWrites) {
      currentPath = item.relativePath;
      fileSystem.renameSync(item.tempPath, item.absolutePath);
      item.tempPath = null;
      applied.push({ type: "write", item });
    }
    for (const item of preparedDeletes) {
      currentPath = item.relativePath;
      if (item.stat) {
        fileSystem.unlinkSync(item.absolutePath);
        applied.push({ type: "delete", item });
      }
    }
    for (const item of [...preparedWrites, ...preparedDeletes]) {
      currentPath = item.relativePath;
      unlinkQuietly(fileSystem, item.tempPath);
      item.tempPath = null;
      unlinkQuietly(fileSystem, item.backupPath);
      item.backupPath = null;
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const operation of [...applied].reverse()) {
      const { item } = operation;
      try {
        const current = lstatIfPresent(fileSystem, item.absolutePath);
        if (current) {
          fileSystem.unlinkSync(item.absolutePath);
        }
        if (item.backupPath && lstatIfPresent(fileSystem, item.backupPath)) {
          fileSystem.renameSync(item.backupPath, item.absolutePath);
          item.backupPath = null;
        } else if (item.stat) {
          fileSystem.writeFileSync(item.absolutePath, item.originalContent, {
            flag: "wx",
            mode: item.stat.mode & 0o777,
          });
        }
      } catch (rollbackError) {
        rollbackErrors.push(`${item.relativePath}: ${rollbackError.message}`);
      }
    }
    for (const item of [...preparedWrites, ...preparedDeletes]) {
      try {
        unlinkQuietly(fileSystem, item.tempPath);
        unlinkQuietly(fileSystem, item.backupPath);
      } catch (cleanupError) {
        rollbackErrors.push(`${item.relativePath}: ${cleanupError.message}`);
      }
    }
    const rollbackSuffix = rollbackErrors.length === 0
      ? ""
      : `; rollback errors: ${rollbackErrors.join("; ")}`;
    throw new Error(`${currentPath}: ${error.message}${rollbackSuffix}`, { cause: error });
  }
}

module.exports = {
  applyAtomicFileBatch,
  installSkillCopy,
  installSkillLink,
  uninstallSkillTarget,
};
