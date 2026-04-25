import { dirname, join } from 'node:path'

import { ensureDir, readJson, writeJson } from './cli-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'

export const RUNTIME_STATE_SCHEMA_VERSION = 1

export function getRuntimeStatePath(cwd = process.cwd()) {
  const storage = resolveProjectStorage(cwd)
  return join(storage.rootPath, 'state', 'runtime.json')
}

export function readRuntimeState(cwd = process.cwd()) {
  return normalizeRuntimeState(readJson(getRuntimeStatePath(cwd), null))
}

export function writeRuntimeState(cwd = process.cwd(), patch = {}, now = new Date()) {
  const runtimePath = getRuntimeStatePath(cwd)
  ensureDir(dirname(runtimePath))
  const current = readRuntimeState(cwd)
  const next = normalizeRuntimeState(mergeRuntimeState(current, patch, now))
  writeJson(runtimePath, next)
  return next
}

export function updateRuntimeExperimentState(cwd, patch = {}, now = new Date()) {
  return writeRuntimeState(cwd, { experiment: patch }, now)
}

export function updateRuntimeChangeState(cwd, patch = {}, now = new Date()) {
  return writeRuntimeState(cwd, { change: patch }, now)
}

export function updateRuntimeProfileState(cwd, patch = {}, now = new Date()) {
  return writeRuntimeState(cwd, { profile: patch }, now)
}

export function updateRuntimeStatusState(cwd, patch = {}, now = new Date()) {
  return writeRuntimeState(cwd, { status: patch }, now)
}

function normalizeRuntimeState(value) {
  const state = value && typeof value === 'object' ? value : {}
  return {
    schemaVersion: Number(state.schemaVersion || RUNTIME_STATE_SCHEMA_VERSION),
    updatedAt: String(state.updatedAt || ''),
    experiment: normalizeObject(state.experiment),
    change: normalizeObject(state.change),
    profile: normalizeObject(state.profile),
    status: normalizeObject(state.status),
  }
}

function mergeRuntimeState(current, patch, now) {
  return {
    ...current,
    ...patch,
    schemaVersion: RUNTIME_STATE_SCHEMA_VERSION,
    updatedAt: now.toISOString(),
    experiment: { ...current.experiment, ...normalizeObject(patch.experiment) },
    change: { ...current.change, ...normalizeObject(patch.change) },
    profile: { ...current.profile, ...normalizeObject(patch.profile) },
    status: { ...current.status, ...normalizeObject(patch.status) },
  }
}

function normalizeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}
