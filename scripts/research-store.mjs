import { readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureDir, parseArgv, pathExists, readJson, writeJson, writeText } from './cli-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'
import { renderBullets } from './change-tracker-utils.mjs'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'status'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  let result
  if (command === 'init-project') result = initProject(cwd, args)
  else if (command === 'add-run') result = addRun(cwd, args)
  else if (command === 'add-hypothesis') result = addHypothesis(cwd, args)
  else if (command === 'status') result = readResearchStatus(cwd)
  else throw new Error(`Unknown research-store command: ${command}`)
  console.log(JSON.stringify(result, null, 2))
}

export function initProject(cwd, args) {
  const paths = getResearchPaths(cwd)
  ensureResearchDirs(paths)
  const now = new Date().toISOString()
  const project = {
    title: String(args.getFlag('--title', '')).trim() || 'Untitled research project',
    question: String(args.getFlag('--question', '')).trim() || '',
    dataset: String(args.getFlag('--dataset', '')).trim() || '',
    evaluation: String(args.getFlag('--evaluation', '')).trim() || '',
    status: String(args.getFlag('--status', 'active')).trim() || 'active',
    createdAt: now,
    updatedAt: now,
  }
  const current = {
    currentRunId: '',
    referenceRunId: '',
    currentHypothesisId: '',
    updatedAt: now,
  }
  writeJson(paths.projectPath, project)
  writeJson(paths.currentPath, current)
  refreshDerivedFiles(paths)
  return { ok: true, project }
}

export function addRun(cwd, args) {
  const paths = getResearchPaths(cwd)
  ensureResearchDirs(paths)
  const project = readJson(paths.projectPath, null)
  if (!project) throw new Error('Initialize the research project first.')
  const current = readJson(paths.currentPath, {
    currentRunId: '',
    referenceRunId: '',
    currentHypothesisId: '',
  })
  const runId = requireFlag(args, '--run-id')
  const now = new Date().toISOString()
  const run = {
    runId,
    summary: String(args.getFlag('--summary', '')).trim(),
    status: String(args.getFlag('--status', 'candidate')).trim() || 'candidate',
    isReference: args.hasFlag('--reference'),
    dataset: String(args.getFlag('--dataset', project.dataset || '')).trim() || '',
    evaluation: String(args.getFlag('--evaluation', project.evaluation || '')).trim() || '',
    mainVariable: String(args.getFlag('--main-variable', '')).trim() || '',
    allowedFiles: args.getList('--allowed-file'),
    metrics: parseMetrics(args.getList('--metric')),
    createdAt: now,
  }
  writeJson(join(paths.runsRoot, `${runId}.json`), run)
  current.currentRunId = runId
  if (run.isReference) current.referenceRunId = runId
  current.updatedAt = now
  writeJson(paths.currentPath, current)
  refreshDerivedFiles(paths)
  return { ok: true, runId }
}

export function addHypothesis(cwd, args) {
  const paths = getResearchPaths(cwd)
  ensureResearchDirs(paths)
  const project = readJson(paths.projectPath, null)
  if (!project) throw new Error('Initialize the research project first.')
  const current = readJson(paths.currentPath, null)
  if (!current) throw new Error('Missing current research state.')
  const referenceRunId = String(args.getFlag('--reference-run', current.referenceRunId || '')).trim()
  if (!referenceRunId) throw new Error('A hypothesis requires a reference run.')
  const referencePath = join(paths.runsRoot, `${referenceRunId}.json`)
  if (!pathExists(referencePath)) throw new Error(`Reference run not found: ${referenceRunId}`)
  const mainVariable = String(args.getFlag('--main-variable', '')).trim()
  if (!mainVariable) throw new Error('A hypothesis must change exactly one main variable.')
  const dataset = String(args.getFlag('--dataset', project.dataset || '')).trim()
  const evaluation = String(args.getFlag('--evaluation', project.evaluation || '')).trim()
  if (!dataset || !evaluation) throw new Error('dataset and evaluation must be set before creating a hypothesis.')
  const hypothesisId = requireFlag(args, '--hypothesis-id')
  const now = new Date().toISOString()
  const hypothesis = {
    hypothesisId,
    claim: requireFlag(args, '--claim'),
    referenceRunId,
    mainVariable,
    dataset,
    evaluation,
    allowedFiles: args.getList('--allowed-file'),
    createdAt: now,
  }
  writeJson(join(paths.hypothesesRoot, `${hypothesisId}.json`), hypothesis)
  current.currentHypothesisId = hypothesisId
  current.updatedAt = now
  writeJson(paths.currentPath, current)
  refreshDerivedFiles(paths)
  return { ok: true, hypothesisId }
}

export function readResearchStatus(cwd) {
  const paths = getResearchPaths(cwd)
  ensureResearchDirs(paths)
  refreshDerivedFiles(paths)
  return {
    project: readJson(paths.projectPath, null),
    current: readJson(paths.currentPath, null),
    runs: readRecords(paths.runsRoot),
    hypotheses: readRecords(paths.hypothesesRoot),
  }
}

function getResearchPaths(cwd) {
  const storage = resolveProjectStorage(cwd)
  const root = join(storage.rootPath, 'research')
  return {
    storage,
    root,
    projectPath: join(root, 'project.json'),
    currentPath: join(root, 'current.json'),
    runsRoot: join(root, 'runs'),
    hypothesesRoot: join(root, 'hypotheses'),
    summaryPath: join(root, 'summary.md'),
    journalPath: join(root, 'journal.md'),
  }
}

function ensureResearchDirs(paths) {
  ensureDir(paths.root)
  ensureDir(paths.runsRoot)
  ensureDir(paths.hypothesesRoot)
}

function refreshDerivedFiles(paths) {
  const project = readJson(paths.projectPath, null)
  const current = readJson(paths.currentPath, null)
  const runs = readRecords(paths.runsRoot)
  const hypotheses = readRecords(paths.hypothesesRoot)
  writeText(paths.summaryPath, buildSummary(project, current, runs, hypotheses))
  writeText(paths.journalPath, buildJournal(project, runs, hypotheses))
}

function buildSummary(project, current, runs, hypotheses) {
  return [
    '# Research Summary',
    '',
    `- Project: ${project?.title || 'N/A'}`,
    `- Question: ${project?.question || 'N/A'}`,
    `- Status: ${project?.status || 'N/A'}`,
    `- Current run: ${current?.currentRunId || 'N/A'}`,
    `- Reference run: ${current?.referenceRunId || 'N/A'}`,
    `- Current hypothesis: ${current?.currentHypothesisId || 'N/A'}`,
    '',
    '## Runs',
    '',
    renderBullets(runs.map((run) => `${run.runId} | ${run.status} | ${run.summary || 'N/A'}`)),
    '',
    '## Hypotheses',
    '',
    renderBullets(hypotheses.map((entry) => `${entry.hypothesisId} | ${entry.mainVariable} | ref=${entry.referenceRunId}`)),
    '',
  ].join('\n')
}

function buildJournal(project, runs, hypotheses) {
  const events = [
    ...(project ? [{ type: 'project', createdAt: project.createdAt, label: `Initialize project: ${project.title}` }] : []),
    ...runs.map((run) => ({ type: 'run', createdAt: run.createdAt, label: `Run ${run.runId}: ${run.summary || run.status}` })),
    ...hypotheses.map((entry) => ({
      type: 'hypothesis',
      createdAt: entry.createdAt,
      label: `Hypothesis ${entry.hypothesisId}: change ${entry.mainVariable} from ${entry.referenceRunId}`,
    })),
  ].sort((left, right) => String(left.createdAt).localeCompare(String(right.createdAt)))
  return [
    '# Research Journal',
    '',
    ...events.map((event) => `- ${event.createdAt} | ${event.type} | ${event.label}`),
    '',
  ].join('\n')
}

function readRecords(root) {
  if (!pathExists(root)) return []
  return readdirSync(root)
    .filter((entry) => entry.endsWith('.json'))
    .sort()
    .map((entry) => readJson(join(root, entry), null))
    .filter(Boolean)
}

function parseMetrics(items) {
  return items.reduce((acc, item) => {
    const [key, value] = String(item).split('=', 2)
    if (key && value !== undefined) acc[key.trim()] = value.trim()
    return acc
  }, {})
}

function requireFlag(args, name) {
  const value = String(args.getFlag(name, '')).trim()
  if (!value) throw new Error(`${name} is required`)
  return value
}
