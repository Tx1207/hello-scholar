import { join, relative, resolve } from 'node:path'

import { ensureDir, readJson, writeJson } from './cli-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'

export function getWorkflowStateRoot(cwd) {
  const normalizedCwd = resolve(cwd)
  const storage = resolveProjectStorage(normalizedCwd)
  const stateRoot = join(storage.rootPath, 'state')
  ensureDir(stateRoot)
  return {
    cwd: normalizedCwd,
    storage,
    stateRoot,
  }
}

export function readWorkflowState(cwd, fileName) {
  const { stateRoot } = getWorkflowStateRoot(cwd)
  return readJson(join(stateRoot, fileName), null)
}

export function writeWorkflowState(cwd, fileName, payload) {
  const { cwd: normalizedCwd, stateRoot } = getWorkflowStateRoot(cwd)
  const filePath = join(stateRoot, fileName)
  const nextPayload = {
    ...payload,
    updatedAt: String(payload.updatedAt || new Date().toISOString()),
  }
  writeJson(filePath, nextPayload)
  return {
    ok: true,
    filePath,
    relativePath: relative(normalizedCwd, filePath).replace(/\\/g, '/'),
    payload: nextPayload,
  }
}
