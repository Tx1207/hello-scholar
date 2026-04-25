import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseArgv, pathExists, readJson } from './cli-utils.mjs'
import { addEvidence } from './experiment-store.mjs'
import { resolveProjectStorage } from './project-storage.mjs'
import { readRuntimeState } from './runtime-state.mjs'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'record'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command === 'record') {
    console.log(JSON.stringify(recordEvidence(cwd, args), null, 2))
    return
  }
  if (command === 'status') {
    console.log(JSON.stringify(readEvidenceBundle(cwd, readEvidenceTarget(cwd, args)), null, 2))
    return
  }
  throw new Error(`Unknown evidence-store command: ${command}`)
}

export function recordEvidence(cwd, args) {
  const explicitExperimentId = String(args.getFlag('--experiment-id', '')).trim()
  const explicitTargetId = String(args.getFlag('--target-id', '')).trim()
  const activeExperimentId = readRuntimeState(cwd).experiment.activeExperiment || ''
  const experimentId = explicitExperimentId || (!explicitTargetId ? String(activeExperimentId).trim() : '')
  if (experimentId) {
    const result = addEvidence({
      cwd,
      experimentId,
      kind: String(args.getFlag('--kind', 'manual')).trim() || 'manual',
      status: String(args.getFlag('--status', 'pass')).trim() || 'pass',
      summary: String(args.getFlag('--summary', '')).trim(),
      path: String(args.getFlag('--path', '')).trim(),
      now: new Date(String(args.getFlag('--at', new Date().toISOString())).trim()),
    })
    return {
      ok: true,
      scope: 'experiment',
      targetId: experimentId,
      experimentId: result.experimentId,
      file: result.file,
    }
  }

  if (explicitTargetId) {
    throw new Error('Legacy top-level evidence targets are no longer write targets. Use --experiment-id or record against the active experiment.')
  }
  throw new Error('No active experiment found. Use --experiment-id to record experiment evidence.')
}

export function readEvidenceBundle(cwd, targetId) {
  if (targetId?.startsWith('EXP-')) {
    const experimentBundle = readExperimentEvidenceBundle(cwd, targetId)
    if (experimentBundle) return experimentBundle
  }

  return {
    targetId,
    updatedAt: '',
    entries: [],
  }
}

export function readEvidenceTarget(cwd, args) {
  const experimentId = String(args.getFlag('--experiment-id', '')).trim()
  if (experimentId) return experimentId
  const targetId = String(args.getFlag('--target-id', '')).trim()
  if (targetId?.startsWith('EXP-')) return targetId
  if (targetId) throw new Error('Legacy top-level evidence targets are no longer readable delivery targets. Use --experiment-id.')
  const activeExperimentId = readRuntimeState(cwd).experiment.activeExperiment || ''
  if (activeExperimentId) return activeExperimentId
  throw new Error('--experiment-id is required when no active experiment exists')
}

function readExperimentEvidenceBundle(cwd, experimentId) {
  const storage = resolveProjectStorage(cwd)
  const root = join(storage.rootPath, 'experiments', experimentId)
  const artifactsPath = join(root, 'artifacts.json')
  if (!pathExists(artifactsPath)) return null
  const artifacts = readJson(artifactsPath, { artifacts: [] })
  const entries = (artifacts.artifacts || [])
    .filter((entry) => entry.type || entry.summary || entry.recordedAt)
    .map((entry, index) => ({
      id: `${experimentId}-${index + 1}`,
      timestamp: entry.recordedAt || '',
      kind: entry.type || 'experiment-evidence',
      status: entry.status || 'unknown',
      summary: entry.summary || '',
      command: entry.command || '',
      files: entry.path ? [entry.path] : [],
      notes: [],
    }))
  return {
    targetId: experimentId,
    updatedAt: entries.at(-1)?.timestamp || '',
    entries,
  }
}
