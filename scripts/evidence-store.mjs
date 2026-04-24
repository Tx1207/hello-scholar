import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureDir, parseArgv, pathExists, readJson, readText, writeJson, writeText } from './cli-utils.mjs'
import { addEvidence } from './experiment-store.mjs'
import { resolveProjectStorage } from './project-storage.mjs'
import { splitLines } from './change-tracker-utils.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))

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
    console.log(JSON.stringify(readEvidenceBundle(cwd, String(args.getFlag('--target-id', '')).trim()), null, 2))
    return
  }
  throw new Error(`Unknown evidence-store command: ${command}`)
}

export function recordEvidence(cwd, args) {
  const experimentId = String(args.getFlag('--experiment-id', '')).trim()
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

  const targetId = String(args.getFlag('--target-id', '')).trim()
  if (!targetId) throw new Error('--target-id is required')
  const storage = resolveProjectStorage(cwd)
  const root = join(storage.rootPath, 'evidence', targetId)
  ensureDir(root)
  const bundle = readEvidenceBundle(cwd, targetId)
  const timestamp = String(args.getFlag('--at', new Date().toISOString())).trim()
  const entry = {
    id: `${Date.now()}-${bundle.entries.length + 1}`,
    timestamp,
    kind: String(args.getFlag('--kind', 'manual')).trim() || 'manual',
    status: String(args.getFlag('--status', 'pass')).trim() || 'pass',
    summary: String(args.getFlag('--summary', '')).trim(),
    command: String(args.getFlag('--command', '')).trim(),
    files: args.getList('--file'),
    notes: splitLines(args.getFlag('--notes', '')).concat(args.getList('--note')),
  }
  bundle.entries.push(entry)
  bundle.updatedAt = timestamp
  writeJson(join(root, 'index.json'), bundle)
  writeSummary(root, bundle)
  return {
    ok: true,
    targetId,
    entryId: entry.id,
    count: bundle.entries.length,
  }
}

export function readEvidenceBundle(cwd, targetId) {
  if (targetId?.startsWith('EXP-')) {
    const experimentBundle = readExperimentEvidenceBundle(cwd, targetId)
    if (experimentBundle) return experimentBundle
  }

  const storage = resolveProjectStorage(cwd)
  const root = join(storage.rootPath, 'evidence', targetId)
  const stored = pathExists(join(root, 'index.json'))
    ? readJson(join(root, 'index.json'), null)
    : null
  return stored || {
    targetId,
    updatedAt: '',
    entries: [],
  }
}

function readExperimentEvidenceBundle(cwd, experimentId) {
  const storage = resolveProjectStorage(cwd)
  const root = join(storage.rootPath, 'experiments', experimentId)
  const artifactsPath = join(root, 'artifacts.json')
  if (!pathExists(artifactsPath)) return null
  const artifacts = readJson(artifactsPath, { artifacts: [] })
  return {
    targetId: experimentId,
    updatedAt: '',
    entries: (artifacts.artifacts || [])
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
      })),
  }
}

function writeSummary(root, bundle) {
  const templatePath = join(pkgRoot, 'templates', 'evidence-summary.md')
  const fallback = [
    '# Evidence Summary: {{target_id}}',
    '',
    '- Updated: `{{updated_at}}`',
    '- Entries: `{{entry_count}}`',
    '',
    '## Evidence',
    '',
    '{{entries}}',
  ].join('\n')
  const template = readText(templatePath, fallback)
  const entries = bundle.entries.length > 0
    ? bundle.entries.map((entry) => [
      `### ${entry.timestamp} | ${entry.kind} | ${entry.status}`,
      `- Summary: ${entry.summary || 'N/A'}`,
      `- Command: ${entry.command || 'N/A'}`,
      `- Files: ${entry.files.length > 0 ? entry.files.join(', ') : 'N/A'}`,
      ...(entry.notes.length > 0 ? entry.notes.map((note) => `- Note: ${note}`) : []),
    ].join('\n')).join('\n\n')
    : '- 暂无证据'
  const rendered = template
    .replaceAll('{{target_id}}', bundle.targetId)
    .replaceAll('{{updated_at}}', bundle.updatedAt || 'N/A')
    .replaceAll('{{entry_count}}', String(bundle.entries.length))
    .replaceAll('{{entries}}', entries)
  writeText(join(root, 'README.md'), `${rendered.trimEnd()}\n`)
}
