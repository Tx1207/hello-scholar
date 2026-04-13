import { readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureDir, pathExists, readText, writeText } from './cli-utils.mjs'
import {
  extractSections,
  formatDate,
  mergeUnique,
  nextChangeId,
  parseBulletLines,
  parseFrontmatter,
  parseTimestampedEntries,
  renderBullets,
  renderFileBullets,
  renderTimestampedEntries,
  serializeFrontmatter,
  slugify,
  stripBackticks,
  uniqueFileName,
} from './change-tracker-utils.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))
export const SECTION_NAMES = [
  'User Requests',
  'Intent Summary',
  'Affected Files',
  'Actual Changes',
  'Verification',
  'Result',
  'Next Step',
]

export function getPaths(cwd) {
  const recordRoot = join(cwd, 'hello-scholar')
  return {
    cwd,
    recordRoot,
    changesRoot: join(recordRoot, 'changes'),
    archiveRoot: join(recordRoot, 'changes', 'archive'),
    stateRoot: join(recordRoot, 'state'),
    indexPath: join(recordRoot, 'changes', 'INDEX.md'),
    statePath: join(recordRoot, 'state', 'STATE.md'),
  }
}

export function ensureTrackingRoots(paths) {
  ensureDir(paths.changesRoot)
  ensureDir(paths.archiveRoot)
  ensureDir(paths.stateRoot)
}

export function loadWorkspace(paths) {
  return {
    records: readRecords(paths),
    state: readState(paths.statePath),
  }
}

export function readRecords(paths) {
  if (!pathExists(paths.changesRoot)) return []
  const records = []
  for (const entry of readdirSync(paths.changesRoot)) {
    const filePath = join(paths.changesRoot, entry)
    if (entry === 'INDEX.md' || entry === 'archive' || !entry.endsWith('.md')) continue
    if (!statSync(filePath).isFile()) continue
    records.push(parseRecord(readText(filePath), filePath, paths.cwd))
  }
  return records.sort((left, right) => right.meta.updated.localeCompare(left.meta.updated))
}

export function readState(statePath) {
  if (!pathExists(statePath)) return {}
  return parseFrontmatter(readText(statePath)).meta
}

export function parseRecord(text, filePath, cwd) {
  const { meta, body } = parseFrontmatter(text)
  const sections = extractSections(body, SECTION_NAMES)
  const titleMatch = body.match(/^#\s+Change:\s*(.+)$/m)
  const title = String(meta.title || titleMatch?.[1] || 'Untitled change').trim()
  const affectedFiles = meta.affected_files?.length > 0
    ? meta.affected_files
    : parseBulletLines(sections.get('Affected Files') || '').map(stripBackticks)
  return {
    id: String(meta.id || ''),
    title,
    slug: String(meta.slug || ''),
    filePath,
    file: relative(cwd, filePath).replace(/\\/g, '/'),
    meta: {
      id: String(meta.id || ''),
      title,
      slug: String(meta.slug || ''),
      status: String(meta.status || 'active'),
      created: String(meta.created || new Date().toISOString()),
      updated: String(meta.updated || new Date().toISOString()),
      route: String(meta.route || '~auto'),
      tier: String(meta.tier || 'T1'),
      decision: String(meta.decision || 'new-topic'),
      affected_files: affectedFiles,
    },
    userRequests: parseTimestampedEntries(sections.get('User Requests') || ''),
    intentSummary: parseBulletLines(sections.get('Intent Summary') || ''),
    actualChanges: parseTimestampedEntries(sections.get('Actual Changes') || ''),
    verification: parseBulletLines(sections.get('Verification') || ''),
    result: parseBulletLines(sections.get('Result') || ''),
    nextStep: parseBulletLines(sections.get('Next Step') || ''),
  }
}

export function createRecord(existingRecords, title, files, now) {
  const id = nextChangeId(existingRecords, now)
  const slug = slugify(title) || id
  const fileName = uniqueFileName(existingRecords, `${formatDate(now)}-${slug}.md`)
  return {
    id,
    title,
    slug,
    filePath: '',
    file: '',
    meta: {
      id,
      title,
      slug,
      status: 'active',
      created: now.toISOString(),
      updated: now.toISOString(),
      route: '~auto',
      tier: 'T1',
      decision: 'new-topic',
      affected_files: files,
    },
    userRequests: [],
    intentSummary: [],
    actualChanges: [],
    verification: [],
    result: [],
    nextStep: [],
    pendingFileName: fileName,
  }
}

export function getActiveRecord(workspace, isActiveStatus) {
  const preferredId = String(workspace.state.active_change_id || '')
  if (preferredId) {
    const matched = workspace.records.find((record) => record.id === preferredId && isActiveStatus(record.meta.status))
    if (matched) return matched
  }
  return workspace.records.find((record) => isActiveStatus(record.meta.status)) || null
}

export function writeRecord(paths, record) {
  const targetPath = record.filePath || join(paths.changesRoot, record.pendingFileName || `${record.id}.md`)
  record.filePath = targetPath
  record.file = relative(paths.cwd, targetPath).replace(/\\/g, '/')
  record.meta.id = record.id
  record.meta.title = record.title
  record.meta.slug = record.slug
  record.meta.affected_files = mergeUnique([], record.meta.affected_files || [])
  const text = renderTemplate('change-record.md', {
    frontmatter: serializeFrontmatter(record.meta),
    title: record.title,
    user_requests: renderTimestampedEntries(record.userRequests),
    intent_summary: renderBullets(record.intentSummary),
    affected_files: renderFileBullets(record.meta.affected_files),
    actual_changes: renderTimestampedEntries(record.actualChanges),
    verification: renderBullets(record.verification),
    result: renderBullets(record.result),
    next_step: renderBullets(record.nextStep),
  }, [
    '{{frontmatter}}',
    '# Change: {{title}}',
    '',
    '## User Requests',
    '',
    '{{user_requests}}',
    '',
    '## Intent Summary',
    '',
    '{{intent_summary}}',
    '',
    '## Affected Files',
    '',
    '{{affected_files}}',
    '',
    '## Actual Changes',
    '',
    '{{actual_changes}}',
    '',
    '## Verification',
    '',
    '{{verification}}',
    '',
    '## Result',
    '',
    '{{result}}',
    '',
    '## Next Step',
    '',
    '{{next_step}}',
  ].join('\n'))
  writeText(targetPath, `${text.trimEnd()}\n`)
}

export function writeIndexAndState(paths, workspace, activeId, isActiveStatus) {
  const records = readRecords(paths)
  const activeRecord = activeId
    ? records.find((record) => record.id === activeId) || getActiveRecord({ records, state: workspace.state }, isActiveStatus)
    : getActiveRecord({ records, state: workspace.state }, isActiveStatus)
  const refreshedAt = new Date().toISOString()

  const indexText = renderTemplate('change-index.md', {
    refreshed_at: refreshedAt,
    active_change: activeRecord ? `[${activeRecord.title}](${relative(paths.changesRoot, activeRecord.filePath).replace(/\\/g, '/')})` : 'None',
    active_status: activeRecord?.meta.status || 'none',
    open_changes: renderIndexEntries(records.filter((record) => isActiveStatus(record.meta.status)), paths.indexPath),
    recent_changes: renderIndexEntries(records, paths.indexPath),
  }, [
    '# hello-scholar Change Index',
    '',
    '- Refreshed: `{{refreshed_at}}`',
    '- Active change: {{active_change}}',
    '- Active status: `{{active_status}}`',
    '',
    '## Open Changes',
    '',
    '{{open_changes}}',
    '',
    '## Recent Changes',
    '',
    '{{recent_changes}}',
  ].join('\n'))
  writeText(paths.indexPath, `${indexText.trimEnd()}\n`)

  const stateText = renderTemplate('state.md', {
    frontmatter: serializeFrontmatter({
      active_change_id: activeRecord?.id || '',
      active_change_file: activeRecord ? relative(paths.cwd, activeRecord.filePath).replace(/\\/g, '/') : '',
      route: activeRecord?.meta.route || '~auto',
      tier: activeRecord?.meta.tier || 'T1',
      updated: refreshedAt,
    }),
    active_title: activeRecord?.title || 'None',
    active_file: activeRecord?.file || 'None',
    route: activeRecord?.meta.route || '~auto',
    tier: activeRecord?.meta.tier || 'T1',
    updated: refreshedAt,
    recent_changes: renderIndexEntries(records.slice(0, 5), paths.statePath),
  }, [
    '{{frontmatter}}',
    '# hello-scholar State',
    '',
    '- Active change: {{active_title}}',
    '- Change file: `{{active_file}}`',
    '- Route: `{{route}}`',
    '- Tier: `{{tier}}`',
    '- Updated: `{{updated}}`',
    '',
    '## Recent Changes',
    '',
    '{{recent_changes}}',
  ].join('\n'))
  writeText(paths.statePath, `${stateText.trimEnd()}\n`)
}

function renderIndexEntries(records, originPath) {
  if (records.length === 0) return '- 暂无记录'
  return records.map((record) => {
    const target = relative(dirname(originPath), record.filePath).replace(/\\/g, '/')
    return `- [${record.title}](${target}) | \`${record.meta.status}\` | \`${record.meta.route}\` | \`${record.meta.tier}\` | \`${record.meta.updated}\``
  }).join('\n')
}

function renderTemplate(templateName, values, fallback) {
  const templatePath = join(pkgRoot, 'templates', templateName)
  const source = readText(templatePath, fallback)
  return Object.entries(values).reduce(
    (current, [key, value]) => current.replaceAll(`{{${key}}}`, value),
    source,
  )
}
