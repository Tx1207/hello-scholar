import { resolve } from 'node:path'

export const EMPTY_SECTION_LINE = '- 暂无记录'
export const ACTIVE_STATUSES = new Set(['active', 'planned', 'in_progress'])
export const NEW_TASK_PATTERNS = /(新任务|另一个|另外一个|另一个问题|separate|new task|new issue)/i
export const CONTINUE_PATTERNS = /(继续|补充|顺便|再补|接着|继续做|continue|follow up|refine|extend)/i

export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: {}, body: text }
  const meta = {}
  const lines = match[1].split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/)
    if (!keyMatch) continue
    const [, key, inlineValue = ''] = keyMatch
    if (!inlineValue) {
      const items = []
      while (index + 1 < lines.length && /^\s*-\s+/.test(lines[index + 1])) {
        index += 1
        items.push(lines[index].replace(/^\s*-\s+/, '').trim())
      }
      meta[key] = items
      continue
    }
    meta[key] = inlineValue.trim()
  }
  return { meta, body: text.slice(match[0].length) }
}

export function serializeFrontmatter(meta) {
  const lines = ['---']
  for (const [key, value] of Object.entries(meta)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`)
      for (const item of value) {
        lines.push(`  - ${item}`)
      }
      continue
    }
    lines.push(`${key}: ${value}`)
  }
  lines.push('---')
  return lines.join('\n')
}

export function extractSections(body, sectionNames) {
  const matches = [...body.matchAll(/^##\s+(.+)$/gm)]
  const sections = new Map()
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index]
    const start = current.index + current[0].length
    const end = index + 1 < matches.length ? matches[index + 1].index : body.length
    sections.set(current[1].trim(), body.slice(start, end).trim())
  }
  for (const name of sectionNames) {
    if (!sections.has(name)) sections.set(name, '')
  }
  return sections
}

export function parseTimestampedEntries(content) {
  const matches = [...content.matchAll(/^###\s+(.+)$/gm)]
  if (matches.length === 0) return []
  const entries = []
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index]
    const start = current.index + current[0].length
    const end = index + 1 < matches.length ? matches[index + 1].index : content.length
    const items = parseBulletLines(content.slice(start, end))
    if (items.length > 0) {
      entries.push({ timestamp: current[1].trim(), items })
    }
  }
  return entries
}

export function parseBulletLines(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
    .filter((line) => line !== '暂无记录')
}

export function renderTimestampedEntries(entries) {
  if (entries.length === 0) return EMPTY_SECTION_LINE
  return entries.map((entry) => [`### ${entry.timestamp}`, '', ...entry.items.map((item) => `- ${item}`)].join('\n')).join('\n\n')
}

export function renderBullets(items) {
  if (items.length === 0) return EMPTY_SECTION_LINE
  return items.map((item) => `- ${item}`).join('\n')
}

export function renderFileBullets(files) {
  if (files.length === 0) return EMPTY_SECTION_LINE
  return files.map((file) => `- \`${file}\``).join('\n')
}

export function appendTimestampedItems(entries, timestamp, items) {
  if (items.length === 0) return entries
  return [...entries, { timestamp, items }]
}

export function splitLines(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*-\s+/, '').trim())
    .filter(Boolean)
}

export function normalizeFiles(cwd, files) {
  return mergeUnique([], files.map((file) => {
    const trimmed = String(file || '').trim()
    if (!trimmed) return ''
    const absolute = resolve(cwd, trimmed)
    return absolute.slice(cwd.length + 1).replace(/\\/g, '/')
  }).filter(Boolean))
}

export function normalizeTitle(rawTitle, fallbackText) {
  const title = String(rawTitle || '').trim() || splitLines(fallbackText)[0] || 'Untitled change'
  return title.length > 72 ? `${title.slice(0, 69)}...` : title
}

export function nextChangeId(records, now) {
  const stamp = formatDate(now).replaceAll('-', '')
  const todays = records.filter((record) => record.id.startsWith(`change-${stamp}`)).length + 1
  return `change-${stamp}-${String(todays).padStart(3, '0')}`
}

export function uniqueFileName(records, proposedName) {
  if (!records.some((record) => record.filePath.endsWith(proposedName))) return proposedName
  const ext = proposedName.endsWith('.md') ? '.md' : ''
  const base = ext ? proposedName.slice(0, -ext.length) : proposedName
  let counter = 2
  while (records.some((record) => record.filePath.endsWith(`${base}-${counter}${ext}`))) {
    counter += 1
  }
  return `${base}-${counter}${ext}`
}

export function slugify(text) {
  const ascii = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return ascii || ''
}

export function computeTitleScore(left, right) {
  const leftKey = normalizeComparable(left)
  const rightKey = normalizeComparable(right)
  if (!leftKey || !rightKey) return 0
  if (leftKey.includes(rightKey) || rightKey.includes(leftKey)) return 3
  const overlap = jaccard(makeBigrams(leftKey), makeBigrams(rightKey))
  if (overlap >= 0.45) return 3
  if (overlap >= 0.25) return 2
  if (overlap >= 0.12) return 1
  return 0
}

export function computeFileScore(existingFiles, newFiles) {
  if (existingFiles.length === 0 || newFiles.length === 0) return 0
  const overlap = jaccard(new Set(existingFiles), new Set(newFiles))
  if (overlap >= 0.67) return 3
  if (overlap >= 0.34) return 2
  if (overlap > 0) return 1
  return 0
}

export function isRecent(updatedAt, now) {
  const updated = new Date(updatedAt)
  return Number.isFinite(updated.valueOf()) && now.valueOf() - updated.valueOf() <= 72 * 60 * 60 * 1000
}

export function isActiveStatus(status) {
  return ACTIVE_STATUSES.has(String(status || '').trim())
}

export function mergeUnique(current, additions) {
  return [...new Set([...current, ...additions].filter(Boolean))]
}

export function compactList(items) {
  return items.filter(Boolean)
}

export function formatDate(value) {
  return value.toISOString().slice(0, 10)
}

export function formatLocalTime(value) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  const hour = String(value.getHours()).padStart(2, '0')
  const minute = String(value.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

export function stripBackticks(value) {
  return value.replace(/^`|`$/g, '')
}

export function requireText(value, message) {
  const text = String(value || '').trim()
  if (!text) throw new Error(message)
  return text
}

export function buildResult(action, decision, record, notes) {
  return {
    ok: true,
    action,
    decision,
    change: {
      id: record.id,
      title: record.title,
      file: record.file || record.filePath || '',
      status: record.meta?.status || 'active',
    },
    notes,
  }
}

export function createPlaceholderResult() {
  return {
    id: 'none',
    title: 'No active change',
    file: '',
    meta: {
      status: 'none',
    },
  }
}

function normalizeComparable(value) {
  return String(value || '').toLowerCase().replace(/[\s`'".,!?，。！？、:：;；()[\]{}<>/_-]+/g, '')
}

function makeBigrams(text) {
  if (text.length < 2) return new Set([text])
  const values = new Set()
  for (let index = 0; index < text.length - 1; index += 1) {
    values.add(text.slice(index, index + 2))
  }
  return values
}

function jaccard(left, right) {
  const intersection = [...left].filter((item) => right.has(item)).length
  const union = new Set([...left, ...right]).size
  return union === 0 ? 0 : intersection / union
}
