#!/usr/bin/env node

import { readdirSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureDir, parseArgv, pathExists, readJson, readText, writeJson, writeText } from './cli-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'
import { readRuntimeState, updateRuntimeStatusState } from './runtime-state.mjs'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'status'] = args.positionals
  const cwd = String(args.getFlag('--cwd', process.cwd()))

  if (['init-project', 'add-run', 'add-hypothesis'].includes(command)) {
    throw new Error(`${command} was removed. Use scripts/experiment-store.mjs so research state derives from experiment packages.`)
  }

  if (command === 'status' || command === 'summary' || command === 'refresh') {
    const result = refreshResearchView(cwd)
    console.log(JSON.stringify(result, null, 2))
    return
  }

  throw new Error(`Unknown research-store command: ${command}`)
}

export function refreshResearchView(cwd = process.cwd()) {
  const paths = getResearchViewPaths(cwd)
  ensureDir(paths.researchRoot)
  const status = buildResearchStatus(paths)
  writeJson(paths.statusPath, status)
  writeText(paths.summaryPath, renderResearchSummary(status, paths))
  updateRuntimeStatusState(cwd, { research: status }, new Date())
  return status
}

export function readResearchStatus(cwd = process.cwd()) {
  return refreshResearchView(cwd)
}

function getResearchViewPaths(cwd) {
  const storage = resolveProjectStorage(cwd)
  return {
    cwd,
    storage,
    recordRoot: storage.rootPath,
    experimentsRoot: join(storage.rootPath, 'experiments'),
    activePath: join(storage.rootPath, 'state', 'active.json'),
    recentPath: join(storage.rootPath, 'state', 'recent.json'),
    researchRoot: join(storage.rootPath, 'research'),
    summaryPath: join(storage.rootPath, 'research', 'summary.md'),
    statusPath: join(storage.rootPath, 'research', 'status.json'),
  }
}

function buildResearchStatus(paths) {
  const runtime = readRuntimeState(paths.cwd)
  const activeState = readJson(paths.activePath, {})
  const recentState = readJson(paths.recentPath, { experiments: [] })
  const experiments = listExperimentDirs(paths.experimentsRoot).map((dir) => readExperimentPackage(dir))
  const countsByStatus = experiments.reduce((acc, experiment) => {
    acc[experiment.status] = (acc[experiment.status] || 0) + 1
    return acc
  }, {})

  return {
    schemaVersion: 1,
    source: 'experiment-packages',
    root: paths.recordRoot,
    activeExperiment: runtime.experiment.activeExperiment || activeState.activeExperiment || null,
    activeProfile: runtime.profile.activeProfile || runtime.experiment.activeProfile || activeState.activeProfile || null,
    totalExperiments: experiments.length,
    countsByStatus,
    recentExperiments: normalizeRecentExperiments(runtime.experiment.recentExperiments || recentState.experiments, experiments),
    experiments,
  }
}

function listExperimentDirs(experimentsRoot) {
  if (!pathExists(experimentsRoot)) return []
  return readdirSync(experimentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('EXP-'))
    .map((entry) => join(experimentsRoot, entry.name))
    .sort()
    .reverse()
}

function readExperimentPackage(dir) {
  const metadata = parseSimpleYaml(readText(join(dir, 'experiment.yaml')))
  const id = metadata.id || basename(dir)
  return {
    id,
    title: metadata.title || id,
    status: metadata.status || 'unknown',
    profile: metadata.profile || '',
    activeStage: metadata.activeStage || '',
    route: metadata.route || '',
    createdAt: metadata.createdAt || '',
    updatedAt: metadata.updatedAt || '',
    hypothesis: readPrimaryHypothesis(metadata, readText(join(dir, 'README.md'))),
    changeCount: countMarkdownListItems(join(dir, 'changes.md')),
    runCount: countMarkdownListItems(join(dir, 'runs.md')),
    evidenceCount: countMarkdownListItems(join(dir, 'evidence.md')),
    artifactCount: readArtifactsCount(join(dir, 'artifacts.json')),
    analysisEntries: countMarkdownHeadings(join(dir, 'analysis.md'), 2),
    files: {
      readme: 'README.md',
      metadata: 'experiment.yaml',
      changes: 'changes.md',
      runs: 'runs.md',
      evidence: 'evidence.md',
      analysis: 'analysis.md',
      artifacts: 'artifacts.json',
    },
  }
}

function normalizeRecentExperiments(recentEntries, experiments) {
  const byId = new Map(experiments.map((experiment) => [experiment.id, experiment]))
  const seen = new Set()
  const recent = []
  for (const entry of Array.isArray(recentEntries) ? recentEntries : []) {
    const id = String(entry?.id || '').trim()
    if (!id || seen.has(id) || !byId.has(id)) continue
    seen.add(id)
    recent.push({ id, updatedAt: entry.updatedAt || byId.get(id).updatedAt || '' })
  }
  for (const experiment of experiments) {
    if (recent.length >= 10) break
    if (seen.has(experiment.id)) continue
    seen.add(experiment.id)
    recent.push({ id: experiment.id, updatedAt: experiment.updatedAt || '' })
  }
  return recent
}

function renderResearchSummary(status, paths) {
  const lines = [
    '# Research Summary',
    '',
    'Generated from experiment packages. Do not edit this file as source of truth.',
    '',
    `- Source: ${relative(paths.cwd, paths.experimentsRoot).replace(/\\/g, '/') || paths.experimentsRoot}`,
    `- Active experiment: ${status.activeExperiment || 'N/A'}`,
    `- Active profile: ${status.activeProfile || 'N/A'}`,
    `- Total experiments: ${status.totalExperiments}`,
    `- Status counts: ${formatStatusCounts(status.countsByStatus)}`,
    '',
    '## Recent Experiments',
    '',
    ...renderRecent(status),
    '',
    '## Experiment Packages',
    '',
    ...renderExperimentRows(status.experiments),
    '',
  ]
  return `${lines.join('\n').trimEnd()}\n`
}

function renderRecent(status) {
  if (status.recentExperiments.length === 0) return ['- N/A']
  const byId = new Map(status.experiments.map((experiment) => [experiment.id, experiment]))
  return status.recentExperiments.map((entry) => {
    const experiment = byId.get(entry.id)
    const title = experiment?.title || entry.id
    const statusText = experiment?.status || 'unknown'
    return `- ${entry.id} | ${statusText} | ${title}`
  })
}

function renderExperimentRows(experiments) {
  if (experiments.length === 0) return ['- N/A']
  return experiments.map((experiment) => [
    `- ${experiment.id}`,
    `status=${experiment.status}`,
    `runs=${experiment.runCount}`,
    `evidence=${experiment.evidenceCount}`,
    `artifacts=${experiment.artifactCount}`,
    `title=${experiment.title}`,
  ].join(' | '))
}

function formatStatusCounts(counts) {
  const entries = Object.entries(counts).sort(([left], [right]) => left.localeCompare(right))
  return entries.length > 0 ? entries.map(([status, count]) => `${status}=${count}`).join(', ') : 'N/A'
}

function readPrimaryHypothesis(metadata, readmeText) {
  if (metadata['hypotheses.primary']) return metadata['hypotheses.primary']
  const match = readmeText.match(/## Hypothesis\n\n([\s\S]*?)(\n## |$)/)
  return match ? match[1].trim() : ''
}

function countMarkdownListItems(filePath) {
  return readText(filePath)
    .split('\n')
    .filter((line) => /^-\s+/.test(line.trim()))
    .length
}

function countMarkdownHeadings(filePath, level) {
  const prefix = `${'#'.repeat(level)} `
  return readText(filePath)
    .split('\n')
    .filter((line) => line.startsWith(prefix))
    .length
}

function readArtifactsCount(filePath) {
  const value = readJson(filePath, { artifacts: [] })
  return Array.isArray(value?.artifacts) ? value.artifacts.length : 0
}

function parseSimpleYaml(text) {
  const result = {}
  const stack = [{ indent: -1, path: [] }]
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#') || line.trim().startsWith('- ')) continue
    const match = line.match(/^(\s*)([A-Za-z0-9_-]+):(?:\s*(.*))?$/)
    if (!match) continue
    const indent = match[1].length
    const key = match[2]
    const rawValue = match[3] ?? ''
    while (stack.length > 1 && stack.at(-1).indent >= indent) stack.pop()
    const path = [...stack.at(-1).path, key]
    const value = parseYamlScalar(rawValue)
    if (rawValue.trim() === '') {
      stack.push({ indent, path })
    } else {
      result[path.join('.')] = value
      result[key] = result[key] ?? value
    }
  }
  return result
}

function parseYamlScalar(value) {
  const trimmed = String(value || '').trim()
  if (trimmed === 'null') return null
  if (trimmed === '[]') return []
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    try {
      return JSON.parse(trimmed)
    } catch {
      return trimmed.slice(1, -1)
    }
  }
  return trimmed
}
