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
    conferences: ['NeurIPS', 'ICML', 'ICLR', 'KDD', 'ACL', 'AAAI'],
    journals: ['Nature', 'Science', 'Cell', 'PNAS'],
    defaultStandard: 'top-tier ML/NLP conference',
  },
  researchFocus: [
    'academic writing quality and logical coherence',
    'whether experimental design supports the claim',
    'baseline, ablation, failure case, and statistical significance coverage',
    'code simplicity, model efficiency, training stability, and reproducibility',
    'clear separation of conceptual novelty, technical novelty, and empirical insight',
  ],
  reviewFocus: [
    'novelty',
    'technical correctness',
    'empirical evidence',
    'writing clarity',
    'honest limitations',
  ],
  technicalPreferences: {
    preferredLibraries: ['uv', 'Hydra', 'OmegaConf', 'PyTorch', 'Transformers Trainer'],
  },
  writingStyle: {
    defaultLanguage: 'Chinese for user-facing replies; preserve English technical terms',
    academicEnglish: 'natural, precise, restrained; avoid AI-like, marketing, or exaggerated tone',
    chineseStyle: 'concise, direct, structured; avoid vague encouragement and redundant synonyms',
    technicalDocs: 'state goals, constraints, behavior, verification, and boundaries clearly',
  },
  interactionPreferences: {
    discussionBeforePromptChanges: true,
    defaultImplementationBoundary: 'analyze and clarify by default; implement when the user explicitly asks to implement, directly change, continue landing, or write files',
    promptModificationBoundary: 'treat AGENTS.md, SKILL.md, agent prompts, and workflow rules as high-impact prompt changes; propose a plan before editing unless the user explicitly asked to write',
  },
  preferenceEvolution: {
    enabled: true,
    autoApply: false,
    evidenceRequired: true,
  },
}

const PROMPT_PREFERENCE_PATHS = [
  'profile.role',
  'profile.education',
  'profile.researchAreas',
  'publicationTargets.defaultStandard',
  'publicationTargets.conferences',
  'publicationTargets.journals',
  'researchFocus',
  'reviewFocus',
  'technicalPreferences.preferredLibraries',
  'writingStyle.defaultLanguage',
  'writingStyle.academicEnglish',
  'writingStyle.chineseStyle',
  'writingStyle.technicalDocs',
  'interactionPreferences.discussionBeforePromptChanges',
  'interactionPreferences.defaultImplementationBoundary',
  'interactionPreferences.promptModificationBoundary',
]

const PROMPT_PREFERENCE_LABELS = {
  'profile.role': 'Role',
  'profile.education': 'Education',
  'profile.researchAreas': 'Research Areas',
  'publicationTargets.defaultStandard': 'Default Standard',
  'publicationTargets.conferences': 'Target Conferences',
  'publicationTargets.journals': 'Target Journals',
  researchFocus: 'Research Focus',
  reviewFocus: 'Review Focus',
  'technicalPreferences.preferredLibraries': 'Technical Preferences',
  'writingStyle.defaultLanguage': 'Default Language',
  'writingStyle.academicEnglish': 'Academic English Style',
  'writingStyle.chineseStyle': 'Chinese Style',
  'writingStyle.technicalDocs': 'Technical Docs Style',
  'interactionPreferences.discussionBeforePromptChanges': 'Discuss Before Prompt Changes',
  'interactionPreferences.defaultImplementationBoundary': 'Implementation Boundary',
  'interactionPreferences.promptModificationBoundary': 'Prompt Modification Boundary',
}

const LIST_MERGE_PATHS = new Set([
  'profile.researchAreas',
  'publicationTargets.conferences',
  'publicationTargets.journals',
  'researchFocus',
  'reviewFocus',
  'technicalPreferences.preferredLibraries',
])


const ALLOWED_PREFERENCE_ROOTS = new Set([
  'profile',
  'publicationTargets',
  'researchFocus',
  'reviewFocus',
  'technicalPreferences',
  'writingStyle',
  'interactionPreferences',
  'preferenceEvolution',
])

const HIGH_IMPACT_PREFERENCE_PATHS = new Set([
  'profile.education',
  'profile.role',
  'publicationTargets.conferences',
  'publicationTargets.journals',
  'publicationTargets.defaultStandard',
  'interactionPreferences.defaultImplementationBoundary',
  'interactionPreferences.promptModificationBoundary',
  'preferenceEvolution.enabled',
  'preferenceEvolution.autoApply',
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
  if (command === 'apply') {
    console.log(JSON.stringify(applyPreferenceCandidate({ cwd, args }), null, 2))
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

export function readEffectivePreferences({ cwd = process.cwd(), runtime = null, initializeProject = false, sessionPreferences = {} } = {}) {
  const paths = initializeProject ? ensureProjectPreferences({ cwd, runtime }) : getPreferencePaths(cwd, runtime)
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

export function applyPreferenceCandidate({ cwd = process.cwd(), args, now = new Date() } = {}) {
  const candidateId = String(args.getFlag('--candidate-id', '')).trim()
  if (!candidateId) throw new Error('--candidate-id is required')
  if (!args.hasFlag('--approve')) throw new Error('preference apply requires --approve')
  const userRequest = String(args.getFlag('--user-request', '')).trim()
  if (!userRequest) {
    throw new Error('preference apply requires --user-request to prove the user explicitly asked AI to apply this candidate')
  }

  const paths = ensureProjectPreferences(cwd)
  const candidateRoot = join(paths.projectCandidatesRoot, candidateId)
  const patchPath = join(candidateRoot, 'patch.yaml')
  if (!pathExists(patchPath)) throw new Error(`Preference candidate patch is missing: ${patchPath}`)

  const patch = readPreferencePatch(patchPath)
  validatePreferencePatchForApply(patch, args)

  const targetFile = patch.targetScope === 'global' ? paths.globalFile : paths.projectFile
  ensureDir(dirname(targetFile))
  const before = readUserPreferences(targetFile)
  const merged = mergePreferences(before, patch.changes, {
    baseSource: patch.targetScope,
    overlaySource: `candidate:${candidateId}`,
  }).preferences
  writeUserPreferences(targetFile, merged)

  const changedPaths = collectPreferenceLeafPaths(patch.changes)
  const appliedAt = now.toISOString()
  const decisionText = renderAppliedPreferenceDecision({
    candidateId,
    patch,
    userRequest,
    targetFile,
    changedPaths,
    before,
    after: merged,
    appliedAt,
  })
  writeText(join(candidateRoot, 'decision.md'), decisionText)

  return {
    ok: true,
    action: 'apply',
    candidateId,
    targetScope: patch.targetScope,
    targetFile,
    userRequest,
    changedPaths,
    before: Object.fromEntries(changedPaths.map((pathKey) => [pathKey, readPathValue(before, pathKey)])),
    after: Object.fromEntries(changedPaths.map((pathKey) => [pathKey, readPathValue(merged, pathKey)])),
    decisionFile: relative(cwd, join(candidateRoot, 'decision.md')).replace(/\\/g, '/'),
  }
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

export function formatPreferencesPromptSection(result, options = {}) {
  const prefs = result.preferences || result.effectivePreferences || result
  const sources = result.sources || {}
  const maxItems = Number.isInteger(options.maxItems) ? options.maxItems : 8
  const includeSources = options.includeSources !== false
  const sourceLayers = summarizeSourceLayers(sources)
  const rows = PROMPT_PREFERENCE_PATHS
    .map((pathKey) => formatPromptPreferenceRow({ prefs, sources, pathKey, maxItems, includeSources }))
    .filter(Boolean)

  return [
    '## 当前有效用户偏好',
    '',
    '> 本节由 hello-scholar 根据 preference YAML 渲染；事实源为 project/global `user-preferences.yaml`。',
    '',
    `- Source Layers: ${sourceLayers.length > 0 ? sourceLayers.join(', ') : 'built-in'}`,
    ...rows,
  ].join('\n')
}

function formatPromptPreferenceRow({ prefs, sources, pathKey, maxItems, includeSources }) {
  const value = readPathValue(prefs, pathKey)
  if (value === undefined || value === null) return ''
  const formatted = formatPromptPreferenceValue(value, maxItems)
  if (!formatted) return ''
  const label = PROMPT_PREFERENCE_LABELS[pathKey] || pathKey
  const source = includeSources ? ` (${sources[pathKey] || sources[pathKey.split('.')[0]] || 'built-in'})` : ''
  return `- ${label}: ${formatted}${source}`
}

function formatPromptPreferenceValue(value, maxItems) {
  if (Array.isArray(value)) return formatPromptList(value, maxItems)
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (isPlainObject(value)) {
    const entries = Object.entries(value)
      .filter(([, entry]) => entry !== undefined && entry !== null && entry !== '')
      .slice(0, maxItems)
      .map(([key, entry]) => `${key}=${formatPromptPreferenceValue(entry, maxItems)}`)
    if (entries.length === 0) return ''
    const suffix = Object.keys(value).length > maxItems ? `, ...(+${Object.keys(value).length - maxItems} more)` : ''
    return `${entries.join('; ')}${suffix}`
  }
  return String(value).trim()
}

function formatPromptList(values, maxItems) {
  const normalized = values.map((value) => String(value).trim()).filter(Boolean)
  if (normalized.length === 0) return ''
  const visible = normalized.slice(0, maxItems)
  const suffix = normalized.length > maxItems ? `, ...(+${normalized.length - maxItems} more)` : ''
  return `${visible.join(', ')}${suffix}`
}

function summarizeSourceLayers(sources = {}) {
  const values = [...new Set(Object.values(sources)
    .flatMap((source) => String(source || '').split('+'))
    .filter(Boolean))]
  const order = ['built-in', 'global', 'project', 'current-session']
  return values.sort((left, right) => {
    const leftIndex = order.includes(left) ? order.indexOf(left) : order.length
    const rightIndex = order.includes(right) ? order.indexOf(right) : order.length
    if (leftIndex !== rightIndex) return leftIndex - rightIndex
    return left.localeCompare(right)
  })
}

function validatePreferencePatchForApply(patch, args) {
  if (patch.type !== 'preference') throw new Error(`Unsupported preference patch type: ${patch.type}`)
  const changedPaths = collectPreferenceLeafPaths(patch.changes)
  if (changedPaths.length === 0) throw new Error('Preference patch has no changes')
  for (const pathKey of changedPaths) {
    const root = pathKey.split('.')[0]
    if (!ALLOWED_PREFERENCE_ROOTS.has(root)) {
      throw new Error(`Preference patch path is not allowed: ${pathKey}`)
    }
  }
  if (readPathValue(patch.changes, 'preferenceEvolution.autoApply') === true) {
    throw new Error('Preference evolution cannot enable autoApply through a candidate')
  }
  const highImpactPaths = changedPaths.filter((pathKey) => isHighImpactPreferencePath(pathKey))
  if (highImpactPaths.length > 0 && !args.hasFlag('--confirm-high-impact')) {
    throw new Error(`High-impact preference paths require --confirm-high-impact: ${highImpactPaths.join(', ')}`)
  }
  if (patch.targetScope === 'global' && !args.hasFlag('--confirm-global')) {
    throw new Error('Global preference apply requires --confirm-global')
  }
}

function isHighImpactPreferencePath(pathKey) {
  if (HIGH_IMPACT_PREFERENCE_PATHS.has(pathKey)) return true
  if (pathKey.startsWith('writingStyle.strong')) return true
  if (pathKey.startsWith('writingStyle.constraints')) return true
  return false
}

function collectPreferenceLeafPaths(value, prefix = '') {
  if (!isPlainObject(value)) return prefix ? [prefix] : []
  const entries = Object.entries(value)
  if (entries.length === 0) return prefix ? [prefix] : []
  return entries.flatMap(([key, entry]) => collectPreferenceLeafPaths(entry, prefix ? `${prefix}.${key}` : key))
}

function readPathValue(value, pathKey) {
  const parts = String(pathKey || '').split('.').filter(Boolean)
  let cursor = value
  for (const part of parts) {
    if (!isPlainObject(cursor) && !Array.isArray(cursor)) return undefined
    cursor = cursor?.[part]
    if (cursor === undefined) return undefined
  }
  return cursor
}

function renderAppliedPreferenceDecision({ candidateId, patch, userRequest, targetFile, changedPaths, before, after, appliedAt }) {
  const rows = changedPaths.map((pathKey) => [
    `### ${pathKey}`,
    '',
    '- Before:',
    '',
    fencedYaml(readPathValue(before, pathKey)),
    '',
    '- After:',
    '',
    fencedYaml(readPathValue(after, pathKey)),
  ].join('\n'))
  return [
    '# Preference Candidate Decision',
    '',
    `- Candidate: \`${candidateId}\``,
    '- Status: `accepted`',
    `- Scope: \`${patch.targetScope}\``,
    `- Target File: \`${targetFile}\``,
    `- Applied At: \`${appliedAt}\``,
    '',
    '## User-Initiated Request',
    '',
    userRequest,
    '',
    '## Applied Changes',
    '',
    rows.join('\n\n'),
    '',
  ].join('\n')
}

function fencedYaml(value) {
  const text = value === undefined ? '(unset)' : serializeYaml(value).trimEnd()
  return ['```yaml', text, '```'].join('\n')
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
