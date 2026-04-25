#!/usr/bin/env node

import { homedir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureDir, parseArgv, pathExists, readText, writeText } from '../cli-utils.mjs'
import { resolveProjectStorage } from '../project-storage.mjs'

export const DEFAULT_PREFERENCES = {
  schemaVersion: 1,
  profile: {
    education: 'Computer Science PhD',
    role: 'researcher',
    researchAreas: [],
  },
  publicationTargets: {
    conferences: [],
    journals: [],
    defaultStandard: 'top-tier ML/NLP conference',
  },
  researchFocus: [],
  reviewFocus: [],
  technicalPreferences: {
    preferredLibraries: [],
  },
  writingStyle: {},
  interactionPreferences: {},
  preferenceEvolution: {
    enabled: true,
    autoApply: false,
    evidenceRequired: true,
  },
}

const LIST_MERGE_PATHS = new Set([
  'profile.researchAreas',
  'publicationTargets.conferences',
  'publicationTargets.journals',
  'researchFocus',
  'reviewFocus',
  'technicalPreferences.preferredLibraries',
])

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'show'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command === 'show') {
    console.log(JSON.stringify(readPreferenceShowModel({ cwd, initializeProject: true }), null, 2))
    return
  }
  if (command === 'paths') {
    console.log(JSON.stringify(getPreferencePaths(cwd), null, 2))
    return
  }
  if (command === 'suggest') {
    console.log(JSON.stringify(suggestPreferenceCandidate({
      cwd,
      summary: String(args.getFlag('--summary', '')).trim(),
      evidence: args.getList('--evidence').join('\n'),
      targetScope: String(args.getFlag('--target-scope', 'project')).trim(),
      path: String(args.getFlag('--path', '')).trim(),
      value: String(args.getFlag('--value', '')).trim(),
    }), null, 2))
    return
  }
  throw new Error(`Unknown preferences-store command: ${command}`)
}

export function getPreferencePaths(cwd = process.cwd(), runtime = null) {
  const storage = resolveProjectStorage(cwd)
  const projectRoot = join(storage.rootPath, 'preferences')
  const globalRoot = join(runtime?.scholarHome ? resolve(runtime.scholarHome) : resolveGlobalScholarHome(), 'preferences')
  return {
    cwd,
    storage,
    projectRoot,
    projectFile: join(projectRoot, 'user-preferences.yaml'),
    projectCandidatesRoot: join(projectRoot, 'candidates'),
    globalRoot,
    globalFile: join(globalRoot, 'user-preferences.yaml'),
    projectPreferencesRoot: projectRoot,
    projectPreferencesPath: join(projectRoot, 'user-preferences.yaml'),
    globalPreferencesRoot: globalRoot,
    globalPreferencesPath: join(globalRoot, 'user-preferences.yaml'),
  }
}

export function ensureProjectPreferences(cwdOrOptions = process.cwd()) {
  const cwd = typeof cwdOrOptions === 'string' ? cwdOrOptions : (cwdOrOptions.cwd || process.cwd())
  const runtime = typeof cwdOrOptions === 'string' ? null : (cwdOrOptions.runtime || null)
  const paths = getPreferencePaths(cwd, runtime)
  ensureDir(paths.projectRoot)
  ensureDir(paths.projectCandidatesRoot)
  if (!pathExists(paths.projectFile)) writeUserPreferences(paths.projectFile, DEFAULT_PREFERENCES)
  const globalPreferences = readUserPreferences(paths.globalFile)
  const projectPreferences = readUserPreferences(paths.projectFile)
  const globalMerge = mergePreferences(DEFAULT_PREFERENCES, globalPreferences, {
    baseSource: 'built-in',
    overlaySource: 'global',
  })
  const projectMerge = mergePreferences(globalMerge.preferences, projectPreferences, {
    baseSources: globalMerge.sources,
    overlaySource: 'project',
  })
  return {
    ...paths,
    paths,
    created: pathExists(paths.projectFile),
    globalPreferences,
    projectPreferences,
    preferences: projectMerge.preferences,
    effectivePreferences: projectMerge.preferences,
    sources: projectMerge.sources,
  }
}

export function readProjectPreferences(cwd = process.cwd(), options = {}) {
  const paths = options.initialize ? ensureProjectPreferences(cwd) : getPreferencePaths(cwd)
  return readUserPreferences(paths.projectFile)
}

export function readGlobalPreferences(cwd = process.cwd()) {
  return readUserPreferences(getPreferencePaths(cwd).globalFile)
}

export function readUserPreferences(filePath) {
  const text = readText(filePath, '')
  if (!text.trim()) return {}
  return parseYaml(text)
}

export function writeUserPreferences(filePath, preferences) {
  writeText(filePath, serializeYaml(normalizeObject(preferences)))
}

export function readEffectivePreferences({ cwd = process.cwd(), initializeProject = false, sessionPreferences = {} } = {}) {
  const paths = initializeProject ? ensureProjectPreferences(cwd) : getPreferencePaths(cwd)
  const globalPreferences = readUserPreferences(paths.globalFile)
  const projectPreferences = readUserPreferences(paths.projectFile)
  const globalMerge = mergePreferences(DEFAULT_PREFERENCES, globalPreferences, {
    baseSource: 'built-in',
    overlaySource: 'global',
  })
  const projectMerge = mergePreferences(globalMerge.preferences, projectPreferences, {
    baseSources: globalMerge.sources,
    overlaySource: 'project',
  })
  const sessionMerge = mergePreferences(projectMerge.preferences, sessionPreferences, {
    baseSources: projectMerge.sources,
    overlaySource: 'current-session',
  })
  return {
    preferences: sessionMerge.preferences,
    effectivePreferences: sessionMerge.preferences,
    sources: sessionMerge.sources,
    layers: {
      builtIn: DEFAULT_PREFERENCES,
      global: globalPreferences,
      project: projectPreferences,
      currentSession: sessionPreferences,
    },
    paths,
  }
}

export function readPreferenceShowModel(options = {}) {
  const effective = readEffectivePreferences(options)
  return {
    preferences: effective.preferences,
    effectivePreferences: effective.preferences,
    sources: effective.sources,
    files: {
      project: effective.paths.projectFile,
      global: effective.paths.globalFile,
    },
  }
}

export function mergePreferences(basePreferences = {}, overlayPreferences = {}, options = {}) {
  const base = clone(normalizeObject(basePreferences))
  const overlay = clone(normalizeObject(overlayPreferences))
  const sources = { ...(options.baseSources || createSourceMap(base, options.baseSource || 'built-in')) }
  const preferences = mergeNode(base, overlay, sources, '', options.overlaySource || 'overlay')
  return { preferences, effectivePreferences: preferences, sources }
}

export function readPreferencePatch(filePath) {
  return normalizePreferencePatch(parseYaml(readText(filePath, '')))
}

export function writePreferencePatch(filePath, patch) {
  writeText(filePath, serializeYaml(normalizePreferencePatch(patch)))
}

export function createPreferencePatch({ candidateId, targetScope = 'project', targetFile = '', changes = {} }) {
  return normalizePreferencePatch({ candidateId, type: 'preference', targetScope, targetFile, changes })
}

export function writePreferenceCandidate({ cwd = process.cwd(), candidateId, patch, proposal = '', evidence = '', decision = 'pending' }) {
  const paths = getPreferencePaths(cwd)
  ensureDir(paths.projectCandidatesRoot)
  const id = candidateId || patch?.candidateId || nextPreferenceCandidateId(paths)
  const candidateRoot = join(paths.projectCandidatesRoot, id)
  ensureDir(candidateRoot)
  writeText(join(candidateRoot, 'proposal.md'), renderPreferenceTemplate('proposal', id, proposal))
  writeText(join(candidateRoot, 'evidence.md'), renderPreferenceTemplate('evidence', id, evidence))
  writePreferencePatch(join(candidateRoot, 'patch.yaml'), { ...patch, candidateId: id })
  writeText(join(candidateRoot, 'decision.md'), renderPreferenceTemplate('decision', id, decision))
  return {
    id,
    root: candidateRoot,
    files: {
      proposal: relative(cwd, join(candidateRoot, 'proposal.md')).replace(/\\/g, '/'),
      evidence: relative(cwd, join(candidateRoot, 'evidence.md')).replace(/\\/g, '/'),
      patch: relative(cwd, join(candidateRoot, 'patch.yaml')).replace(/\\/g, '/'),
      decision: relative(cwd, join(candidateRoot, 'decision.md')).replace(/\\/g, '/'),
    },
  }
}

export function suggestPreferenceCandidate({
  cwd = process.cwd(),
  summary,
  evidence = '',
  targetScope = 'project',
  path = '',
  value = '',
  now = new Date(),
} = {}) {
  const paths = ensureProjectPreferences(cwd)
  const cleanSummary = String(summary || '').trim()
  if (!cleanSummary) throw new Error('--summary is required')
  const cleanPath = String(path || '').trim()
  if (!cleanPath) throw new Error('--path is required')
  const scope = targetScope === 'global' ? 'global' : 'project'
  const targetFile = scope === 'global' ? paths.globalFile : paths.projectFile
  const candidateId = nextPreferenceCandidateId(paths, now, slugifyPreference(cleanPath))
  const changes = setPathValue({}, cleanPath, parsePreferenceValue(value || cleanSummary))
  const patch = createPreferencePatch({
    candidateId,
    targetScope: scope,
    targetFile,
    changes,
  })
  return writePreferenceCandidate({
    cwd,
    candidateId,
    patch,
    proposal: [
      cleanSummary,
      '',
      `Target scope: \`${scope}\``,
      `Target path: \`${cleanPath}\``,
      '',
      'This is a candidate only. Do not apply it unless the user confirms.',
    ].join('\n'),
    evidence: String(evidence || '').trim() || 'Generated from closeout, wrap-up, ~evolve, or explicit user preference feedback.',
    decision: 'pending',
  })
}

export function formatEffectivePreferences(result) {
  const prefs = result.preferences || result.effectivePreferences || result
  const sources = result.sources || {}
  return [
    'hello-scholar Preferences',
    '',
    `- Role: ${prefs.profile?.role || ''} (${sources['profile.role'] || 'built-in'})`,
    `- Education: ${prefs.profile?.education || '(unset)'} (${sources['profile.education'] || 'built-in'})`,
    `- Default Standard: ${prefs.publicationTargets?.defaultStandard || ''} (${sources['publicationTargets.defaultStandard'] || 'built-in'})`,
    `- Research Focus: ${formatList(prefs.researchFocus)} (${sources.researchFocus || 'built-in'})`,
    `- Review Focus: ${formatList(prefs.reviewFocus)} (${sources.reviewFocus || 'built-in'})`,
    `- Preferred Libraries: ${formatList(prefs.technicalPreferences?.preferredLibraries)} (${sources['technicalPreferences.preferredLibraries'] || 'built-in'})`,
    `- Preference Evolution: ${prefs.preferenceEvolution?.enabled === false ? 'disabled' : 'enabled'}`,
  ].join('\n')
}

function mergeNode(baseValue, overlayValue, sources, pathKey, overlaySource) {
  if (overlayValue === undefined) return baseValue
  const listOverride = readListOverride(overlayValue)
  if (listOverride) {
    sources[pathKey] = overlaySource
    return uniqueList(listOverride.values)
  }
  if (Array.isArray(baseValue) || Array.isArray(overlayValue)) {
    sources[pathKey] = mergeSource(sources[pathKey], overlaySource)
    if (LIST_MERGE_PATHS.has(pathKey)) return uniqueList([...(Array.isArray(baseValue) ? baseValue : []), ...(Array.isArray(overlayValue) ? overlayValue : [])])
    return Array.isArray(overlayValue) ? uniqueList(overlayValue) : baseValue
  }
  if (isPlainObject(baseValue) && isPlainObject(overlayValue)) {
    const next = { ...baseValue }
    for (const [key, value] of Object.entries(overlayValue)) {
      const childPath = pathKey ? `${pathKey}.${key}` : key
      next[key] = mergeNode(next[key], value, sources, childPath, overlaySource)
    }
    return next
  }
  sources[pathKey] = overlaySource
  return overlayValue
}

function readListOverride(value) {
  if (!isPlainObject(value)) return null
  if (value.mode === 'override') return { values: normalizeList(value.values) }
  if (Object.hasOwn(value, 'override')) return { values: normalizeList(value.override) }
  return null
}

function createSourceMap(value, source, prefix = '', out = {}) {
  if (Array.isArray(value) || !isPlainObject(value)) {
    if (prefix) out[prefix] = source
    return out
  }
  for (const [key, entry] of Object.entries(value)) createSourceMap(entry, source, prefix ? `${prefix}.${key}` : key, out)
  return out
}

function mergeSource(left, right) {
  if (!left || left === right) return right
  return [...new Set(`${left}+${right}`.split('+').filter(Boolean))].join('+')
}

function normalizePreferencePatch(patch) {
  const normalized = normalizeObject(patch)
  return {
    candidateId: String(normalized.candidateId || '').trim(),
    type: String(normalized.type || 'preference').trim() || 'preference',
    targetScope: normalized.targetScope === 'global' ? 'global' : 'project',
    targetFile: String(normalized.targetFile || '').trim(),
    changes: normalizeObject(normalized.changes),
  }
}

function resolveGlobalScholarHome() {
  if (process.env.HELLO_SCHOLAR_HOME) return resolve(process.env.HELLO_SCHOLAR_HOME)
  const codexHome = process.env.CODEX_HOME || join(homedir(), '.codex')
  const hostHome = process.env.HELLO_SCHOLAR_HOST_HOME || dirname(codexHome)
  return resolve(hostHome, 'plugins', 'hello-scholar', '.hello-scholar')
}

function nextPreferenceCandidateId(paths, now = new Date(), slug = 'preference') {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '').replace('T', '-')
  let suffix = 1
  const cleanSlug = slug || 'preference'
  let id = `PREF-${stamp}-${cleanSlug}`
  while (pathExists(join(paths.projectCandidatesRoot, id))) id = `PREF-${stamp}-${cleanSlug}-${++suffix}`
  return id
}

function setPathValue(target, pathKey, value) {
  const parts = String(pathKey || '').split('.').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) throw new Error('preference path is empty')
  let cursor = target
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index]
    cursor[part] = isPlainObject(cursor[part]) ? cursor[part] : {}
    cursor = cursor[part]
  }
  cursor[parts.at(-1)] = value
  return target
}

function parsePreferenceValue(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  if (text.includes('\n')) return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (text.includes(',') && !text.includes('，')) return text.split(',').map((line) => line.trim()).filter(Boolean)
  return parseScalar(text)
}

function slugifyPreference(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'preference'
}

function renderPreferenceTemplate(kind, candidateId, body) {
  const title = kind[0].toUpperCase() + kind.slice(1)
  return `# Preference Candidate ${title}\n\n- Candidate: \`${candidateId}\`\n\n${String(body || '').trim() || 'Pending.'}\n`
}

function parseYaml(text) {
  const lines = String(text || '').split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#'))
  const root = {}
  const stack = [{ indent: -1, value: root }]
  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index]
    const indent = raw.match(/^ */)?.[0].length || 0
    const trimmed = raw.trim()
    while (stack.length > 1 && indent <= stack.at(-1).indent) stack.pop()
    const parent = stack.at(-1).value
    if (trimmed.startsWith('- ')) {
      if (!Array.isArray(parent)) throw new Error(`Invalid YAML list item without list parent: ${trimmed}`)
      parent.push(parseScalar(trimmed.slice(2).trim()))
      continue
    }
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) throw new Error(`Invalid YAML line: ${trimmed}`)
    const key = trimmed.slice(0, colonIndex).trim()
    const rawValue = trimmed.slice(colonIndex + 1).trim()
    if (!isPlainObject(parent)) throw new Error(`Invalid YAML mapping under list: ${trimmed}`)
    if (rawValue) {
      parent[key] = parseScalar(rawValue)
      continue
    }
    const nextTrimmed = (lines[index + 1] || '').trim()
    const nextValue = nextTrimmed.startsWith('- ') ? [] : {}
    parent[key] = nextValue
    stack.push({ indent, value: nextValue })
  }
  return root
}

function parseScalar(value) {
  if (value === '[]') return []
  if (value === '{}') return {}
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null') return null
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    try {
      return JSON.parse(value)
    } catch {
      return value.slice(1, -1)
    }
  }
  if (value.startsWith('[') || value.startsWith('{')) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
  return value
}

function serializeYaml(value, indent = 0) {
  return `${serializeYamlValue(value, indent).trimEnd()}\n`
}

function serializeYamlValue(value, indent = 0) {
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return value.map((entry) => `${' '.repeat(indent)}- ${serializeScalar(entry)}`).join('\n')
  }
  if (isPlainObject(value)) {
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    return entries.map(([key, entry]) => {
      if (Array.isArray(entry)) {
        const serialized = serializeYamlValue(entry, indent + 2)
        return `${' '.repeat(indent)}${key}: ${serialized === '[]' ? '[]' : `\n${serialized}`}`
      }
      if (isPlainObject(entry)) {
        const serialized = serializeYamlValue(entry, indent + 2)
        return `${' '.repeat(indent)}${key}: ${serialized === '{}' ? '{}' : `\n${serialized}`}`
      }
      return `${' '.repeat(indent)}${key}: ${serializeScalar(entry)}`
    }).join('\n')
  }
  return serializeScalar(value)
}

function serializeScalar(value) {
  if (value === null) return 'null'
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'string' && value.length === 0) return '""'
  if (typeof value === 'string' && /^[A-Za-z0-9_./:@+-]+$/.test(value)) return value
  return JSON.stringify(value)
}

function formatList(values) {
  return Array.isArray(values) && values.length > 0 ? values.join(', ') : '(none)'
}

function normalizeObject(value) {
  return isPlainObject(value) ? value : {}
}

function normalizeList(value) {
  return Array.isArray(value) ? value : []
}

function uniqueList(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))]
}

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? {}))
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
