#!/usr/bin/env node

import { readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

import { ensureDir, parseArgv, pathExists, readJson, readText, writeJson, writeText } from './cli-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'

const STATUS_VALUES = new Set(['planned', 'in_progress', 'validated', 'failed', 'analyzed', 'accepted', 'abandoned'])
main()

function main() {
  if (!process.argv[1]?.endsWith('experiment-store.mjs')) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'status'] = args.positionals
  const cwd = String(args.getFlag('--cwd', process.cwd()))

  if (command === 'create') {
    const title = String(args.getFlag('--title', 'Untitled experiment'))
    const request = String(args.getFlag('--request', title))
    const result = createExperiment({ cwd, title, request })
    console.log(JSON.stringify(result, null, 2))
    return
  }

  if (command === 'append-change') {
    const result = appendChange({
      cwd,
      experimentId: String(args.getFlag('--experiment-id', '')),
      summary: String(args.getFlag('--summary', 'Change recorded.')),
      files: args.getList('--file'),
    })
    console.log(JSON.stringify(result, null, 2))
    return
  }

  if (command === 'add-run') {
    const result = addRun({
      cwd,
      experimentId: String(args.getFlag('--experiment-id', '')),
      kind: String(args.getFlag('--kind', 'manual-check')),
      command: String(args.getFlag('--command', '')),
      metrics: args.getList('--metric'),
      status: String(args.getFlag('--status', 'completed')),
    })
    console.log(JSON.stringify(result, null, 2))
    return
  }

  if (command === 'add-evidence') {
    const result = addEvidence({
      cwd,
      experimentId: String(args.getFlag('--experiment-id', '')),
      kind: String(args.getFlag('--kind', 'manual-check')),
      status: String(args.getFlag('--status', 'unknown')),
      summary: String(args.getFlag('--summary', 'Evidence recorded.')),
      path: String(args.getFlag('--path', '')),
    })
    console.log(JSON.stringify(result, null, 2))
    return
  }

  if (command === 'analyze') {
    const result = analyzeExperiment({
      cwd,
      experimentId: String(args.getFlag('--experiment-id', '')),
      summary: String(args.getFlag('--summary', 'Analysis recorded.')),
      decision: String(args.getFlag('--decision', 'follow-up')),
    })
    console.log(JSON.stringify(result, null, 2))
    return
  }

  if (command === 'status') {
    console.log(JSON.stringify(readExperimentStatus(cwd), null, 2))
    return
  }

  throw new Error(`Unknown experiment-store command: ${command}`)
}

export function createExperiment({ cwd = process.cwd(), title, request = '', now = new Date(), profile = 'ml-development' }) {
  const paths = getExperimentPaths(cwd)
  ensureExperimentRoots(paths)
  const id = nextExperimentId(paths, title, now)
  const experimentDir = join(paths.experimentsRoot, id)
  ensureDir(experimentDir)

  const metadata = {
    schemaVersion: 1,
    id,
    title,
    status: 'in_progress',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    profile,
    activeStage: profile,
    route: '~build',
    tags: ['experiment'],
    hypotheses: {
      primary: request || title,
      secondary: [],
    },
    lineage: {
      parent: null,
      relation: 'baseline',
    },
    scope: {
      code: [],
      config: [],
      data: [],
    },
    config: {
      files: [],
      overrides: [],
    },
    params: {},
    metrics: {
      primary: null,
      secondary: [],
    },
    tracking: {
      provider: 'none',
      project: null,
      runIds: [],
      urls: [],
    },
    hydra: {
      configPath: null,
      overrides: [],
      outputDir: null,
    },
    artifacts: [],
  }

  writeText(join(experimentDir, 'experiment.yaml'), serializeYaml(metadata))
  writeText(join(experimentDir, 'README.md'), renderExperimentReadme(metadata))
  writeText(join(experimentDir, 'changes.md'), `# Changes\n\n- ${formatTimestamp(now)} Created experiment from request: ${request || title}\n`)
  writeText(join(experimentDir, 'runs.md'), '# Runs\n')
  writeText(join(experimentDir, 'evidence.md'), '# Evidence\n')
  writeText(join(experimentDir, 'analysis.md'), renderAnalysisTemplate())
  writeJson(join(experimentDir, 'artifacts.json'), { experimentId: id, artifacts: [] })

  writeActiveState(paths, { activeExperiment: id, activeProfile: profile, updatedAt: now.toISOString() })
  refreshIndex(paths)
  refreshRecent(paths, id, now)
  return { id, path: relative(cwd, experimentDir).replace(/\\/g, '/') }
}

export function appendChange({ cwd = process.cwd(), experimentId = '', summary, files = [], now = new Date() }) {
  const resolved = resolveExperiment(cwd, experimentId)
  const fileText = files.length > 0 ? ` Files: ${files.map((file) => `\`${file}\``).join(', ')}.` : ''
  appendLine(join(resolved.dir, 'changes.md'), `- ${formatTimestamp(now)} ${summary}${fileText}`)
  touchExperiment(resolved.dir, now)
  refreshIndex(resolved.paths)
  return { experimentId: resolved.id, file: relative(cwd, join(resolved.dir, 'changes.md')).replace(/\\/g, '/') }
}

export function addRun({ cwd = process.cwd(), experimentId = '', kind = 'manual-check', command = '', metrics = [], status = 'completed', now = new Date() }) {
  const resolved = resolveExperiment(cwd, experimentId)
  const runId = `RUN-${formatIdTimestamp(now)}-${slugify(kind) || 'run'}`
  const metricText = metrics.length > 0 ? ` Metrics: ${metrics.join(', ')}.` : ''
  const commandText = command ? ` Command: \`${command}\`.` : ''
  appendLine(join(resolved.dir, 'runs.md'), `- ${formatTimestamp(now)} \`${runId}\` ${kind} ${status}.${commandText}${metricText}`)
  touchExperiment(resolved.dir, now)
  refreshIndex(resolved.paths)
  return { experimentId: resolved.id, runId }
}

export function addEvidence({ cwd = process.cwd(), experimentId = '', kind = 'manual-check', status = 'unknown', summary, path = '', now = new Date() }) {
  const resolved = resolveExperiment(cwd, experimentId)
  const pathText = path ? ` Path: \`${path}\`.` : ''
  appendLine(join(resolved.dir, 'evidence.md'), `- ${formatTimestamp(now)} ${kind} ${status}: ${summary}${pathText}`)
  if (path) {
    const artifactsPath = join(resolved.dir, 'artifacts.json')
    const current = readJson(artifactsPath, { experimentId: resolved.id, artifacts: [] })
    current.artifacts.push({ type: kind, path, summary, status, recordedAt: now.toISOString() })
    writeJson(artifactsPath, current)
  }
  touchExperiment(resolved.dir, now)
  refreshIndex(resolved.paths)
  return { experimentId: resolved.id, file: relative(cwd, join(resolved.dir, 'evidence.md')).replace(/\\/g, '/') }
}

export function analyzeExperiment({ cwd = process.cwd(), experimentId = '', summary, decision = 'follow-up', now = new Date() }) {
  const resolved = resolveExperiment(cwd, experimentId)
  appendLine(join(resolved.dir, 'analysis.md'), `\n## ${formatTimestamp(now)}\n\n- Summary: ${summary}\n- Decision: ${decision}\n`)
  updateExperimentStatus(resolved.dir, 'analyzed', now)
  refreshIndex(resolved.paths)
  return { experimentId: resolved.id, decision }
}

export function readExperimentStatus(cwd = process.cwd()) {
  const paths = getExperimentPaths(cwd)
  const active = readJson(paths.activePath, {})
  const experiments = listExperimentIds(paths)
  return {
    root: paths.recordRoot,
    activeExperiment: active.activeExperiment || null,
    experiments,
  }
}

function getExperimentPaths(cwd) {
  const storage = resolveProjectStorage(cwd)
  const recordRoot = storage.rootPath
  return {
    cwd,
    storage,
    recordRoot,
    experimentsRoot: join(recordRoot, 'experiments'),
    indexPath: join(recordRoot, 'experiments', 'INDEX.md'),
    stateRoot: join(recordRoot, 'state'),
    activePath: join(recordRoot, 'state', 'active.json'),
    recentPath: join(recordRoot, 'state', 'recent.json'),
  }
}

function ensureExperimentRoots(paths) {
  ensureDir(paths.experimentsRoot)
  ensureDir(paths.stateRoot)
}

function resolveExperiment(cwd, experimentId) {
  const paths = getExperimentPaths(cwd)
  ensureExperimentRoots(paths)
  const id = experimentId || readJson(paths.activePath, {})?.activeExperiment
  if (!id) throw new Error('No experiment id provided and no active experiment found.')
  const dir = join(paths.experimentsRoot, id)
  if (!pathExists(dir)) throw new Error(`Experiment not found: ${id}`)
  return { paths, id, dir }
}

function nextExperimentId(paths, title, now) {
  const base = `EXP-${formatIdTimestamp(now)}-${slugify(title) || 'experiment'}`
  let id = base
  let suffix = 2
  while (pathExists(join(paths.experimentsRoot, id))) {
    id = `${base}-${suffix}`
    suffix += 1
  }
  return id
}

function refreshIndex(paths) {
  ensureExperimentRoots(paths)
  const ids = listExperimentIds(paths)
  const lines = ['# hello-scholar Experiment Index', '', ...ids.map((id) => `- [${id}](${id}/README.md)`)]
  writeText(paths.indexPath, `${lines.join('\n').trimEnd()}\n`)
}

function refreshRecent(paths, id, now) {
  const current = readJson(paths.recentPath, { experiments: [] })
  const experiments = [{ id, updatedAt: now.toISOString() }, ...(current.experiments || []).filter((entry) => entry.id !== id)].slice(0, 10)
  writeJson(paths.recentPath, { experiments })
}

function writeActiveState(paths, next) {
  const current = readJson(paths.activePath, {})
  writeJson(paths.activePath, { ...current, ...next })
}

function listExperimentIds(paths) {
  try {
    return readdirSync(paths.experimentsRoot).filter((entry) => entry.startsWith('EXP-')).sort().reverse()
  } catch {
    return []
  }
}

function touchExperiment(experimentDir, now) {
  const metadataPath = join(experimentDir, 'experiment.yaml')
  const text = readText(metadataPath)
  writeText(metadataPath, text.replace(/^updatedAt:.*$/m, `updatedAt: ${now.toISOString()}`))
}

function updateExperimentStatus(experimentDir, status, now) {
  if (!STATUS_VALUES.has(status)) throw new Error(`Invalid experiment status: ${status}`)
  const metadataPath = join(experimentDir, 'experiment.yaml')
  const text = readText(metadataPath)
    .replace(/^status:.*$/m, `status: ${status}`)
    .replace(/^updatedAt:.*$/m, `updatedAt: ${now.toISOString()}`)
  writeText(metadataPath, text)
}

function appendLine(filePath, line) {
  const current = readText(filePath, '')
  writeText(filePath, `${current.trimEnd()}\n${line}\n`)
}

function renderExperimentReadme(metadata) {
  return `# ${metadata.id}\n\n## Goal\n\n${metadata.title}\n\n## Hypothesis\n\n${metadata.hypotheses.primary}\n\n## Changes\n\nPending.\n\n## Validation\n\nPending.\n\n## Results\n\nPending.\n\n## Conclusion\n\nPending.\n\n## Next Steps\n\nPending.\n`
}

function renderAnalysisTemplate() {
  return '# Analysis\n\n## Result Summary\n\n## Hypothesis Check\n\n## Comparison To Baseline\n\n## Failure Analysis\n\n## Decision\n\n## Follow-up Experiments\n'
}

function serializeYaml(value, indent = 0) {
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return value.map((entry) => `${' '.repeat(indent)}- ${serializeYamlScalar(entry, indent + 2)}`).join('\n')
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([key, entry]) => {
      if (entry && typeof entry === 'object') {
        const serialized = serializeYaml(entry, indent + 2)
        return `${' '.repeat(indent)}${key}: ${serialized === '[]' ? '[]' : `\n${serialized}`}`
      }
      return `${' '.repeat(indent)}${key}: ${serializeYamlScalar(entry, indent)}`
    }).join('\n')
  }
  return serializeYamlScalar(value, indent)
}

function serializeYamlScalar(value) {
  if (value === null) return 'null'
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'string' && value.length === 0) return '""'
  if (typeof value === 'string' && /^[A-Za-z0-9_./:@+-]+$/.test(value)) return value
  return JSON.stringify(value)
}

function formatTimestamp(date) {
  return date.toISOString()
}

function formatIdTimestamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '').replace('T', '-')
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}
