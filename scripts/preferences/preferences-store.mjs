#!/usr/bin/env node

import { homedir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureDir, parseArgv, pathExists, readText, writeText } from '../cli-utils.mjs'
import { resolveProjectStorage } from '../project-storage.mjs'

export const DEFAULT_PREFERENCES = {
  schemaVersion: 1,
  profile: {
    education: '默认用户具备计算机科学 PhD 或同等科研训练。',
    role: '研究者',
    researchAreas: [],
  },
  publicationTargets: {
    conferences: ['NeurIPS', 'ICML', 'ICLR', 'KDD', 'ACL', 'AAAI'],
    journals: ['Nature', 'Science', 'Cell', 'PNAS'],
    defaultStandard: '默认关注 claim 是否被实验支撑、baseline / ablation 是否充分、limitation 是否诚实。',
  },
  researchFocus: [
    '学术写作质量、逻辑连贯性、自然表达。',
    '实验设计能否支撑 claim。',
    'baseline、ablation、failure case、statistical significance 是否充分。',
    '代码简洁性、模型效率、训练稳定性和可复现性。',
    '方法贡献应清楚区分 conceptual novelty、technical novelty 或 empirical insight。',
  ],
  reviewFocus: [
    '写作、自审和实验分析默认以顶会 reviewer 视角审视 novelty、technical correctness、empirical evidence 和 writing clarity。',
  ],
  technicalPreferences: {
    preferredLibraries: ['uv', 'Hydra', 'OmegaConf', 'PyTorch', 'Transformers Trainer'],
    rules: [
      'Python 包管理优先 `uv`；已有项目使用 `conda` 时遵循项目现状。',
      '配置管理优先 Hydra + OmegaConf。',
      '模型训练优先兼容 PyTorch、Transformers Trainer 或项目已有训练框架。',
      'Git 提交信息优先 Conventional Commits。',
      '实验记录优先保存 config、seed、环境、数据版本、metrics 和 artifact 路径。',
    ],
  },
  writingStyle: {
    defaultLanguage: '用户可见回复默认中文，专业名词、会议名、方法名、代码符号保留英文。',
    academicEnglish: '论文相关英文写作追求自然、准确、克制，不写明显 AI 腔、营销腔或夸张表达。',
    chineseStyle: '中文说明简洁、直接、结构清楚；不堆砌同义词，不写空泛鼓励。',
    technicalDocs: '技术文档优先写清目标、约束、行为、验证和边界。',
  },
  interactionPreferences: {
    discussionBeforePromptChanges: true,
    discussionBeforePromptChangesRule: '用户提问、质疑、讨论方案、评估 prompt 或规则时，默认先澄清和分析，不直接改文件。',
    defaultImplementationBoundary: '用户明确说“实现”“直接改”“继续落地”“写入”时，进入实施。',
    promptModificationBoundary: '对 `AGENTS.md`、`SKILL.md`、agent prompt、workflow 规则的修改视为高影响 prompt 变更；除非用户已明确要求写入，否则先给方案再改。',
  },
  preferenceEvolution: {
    enabled: true,
    autoApply: false,
    evidenceRequired: true,
  },
}

const LEGACY_DEFAULT_VALUE_REPLACEMENTS = {
  'Computer Science PhD': DEFAULT_PREFERENCES.profile.education,
  researcher: DEFAULT_PREFERENCES.profile.role,
  'top-tier ML/NLP conference': DEFAULT_PREFERENCES.publicationTargets.defaultStandard,
  'academic writing quality and logical coherence': DEFAULT_PREFERENCES.researchFocus[0],
  'whether experimental design supports the claim': DEFAULT_PREFERENCES.researchFocus[1],
  'baseline, ablation, failure case, and statistical significance coverage': DEFAULT_PREFERENCES.researchFocus[2],
  'code simplicity, model efficiency, training stability, and reproducibility': DEFAULT_PREFERENCES.researchFocus[3],
  'clear separation of conceptual novelty, technical novelty, and empirical insight': DEFAULT_PREFERENCES.researchFocus[4],
  'Chinese for user-facing replies; preserve English technical terms': DEFAULT_PREFERENCES.writingStyle.defaultLanguage,
  'natural, precise, restrained; avoid AI-like, marketing, or exaggerated tone': DEFAULT_PREFERENCES.writingStyle.academicEnglish,
  'concise, direct, structured; avoid vague encouragement and redundant synonyms': DEFAULT_PREFERENCES.writingStyle.chineseStyle,
  'state goals, constraints, behavior, verification, and boundaries clearly': DEFAULT_PREFERENCES.writingStyle.technicalDocs,
  'analyze and clarify by default; implement when the user explicitly asks to implement, directly change, continue landing, or write files': DEFAULT_PREFERENCES.interactionPreferences.defaultImplementationBoundary,
  'treat AGENTS.md, SKILL.md, agent prompts, and workflow rules as high-impact prompt changes; propose a plan before editing unless the user explicitly asked to write': DEFAULT_PREFERENCES.interactionPreferences.promptModificationBoundary,
}

const LIST_MERGE_PATHS = new Set([
  'profile.researchAreas',
  'publicationTargets.conferences',
  'publicationTargets.journals',
  'researchFocus',
  'reviewFocus',
  'technicalPreferences.preferredLibraries',
  'technicalPreferences.rules',
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
  const globalPreferences = readMigratedUserPreferences(paths.globalFile)
  const projectPreferences = readMigratedUserPreferences(paths.projectFile, { persist: true })
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

function readMigratedUserPreferences(filePath, { persist = false } = {}) {
  const preferences = readUserPreferences(filePath)
  const migrated = migrateLegacyPreferenceDefaults(preferences)
  if (persist && migrated.changed) writeUserPreferences(filePath, migrated.preferences)
  return migrated.preferences
}

export function writeUserPreferences(filePath, preferences) {
  writeText(filePath, serializeYaml(normalizeObject(preferences)))
}

export function readEffectivePreferences({ cwd = process.cwd(), runtime = null, initializeProject = false, sessionPreferences = {} } = {}) {
  const paths = initializeProject ? ensureProjectPreferences({ cwd, runtime }) : getPreferencePaths(cwd, runtime)
  const globalPreferences = readMigratedUserPreferences(paths.globalFile)
  const projectPreferences = readMigratedUserPreferences(paths.projectFile)
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
  const sourceLayers = summarizeSourceLayers(sources)

  return [
    '## 用户偏好',
    '',
    '> 本节由 hello-scholar 根据 preference YAML 渲染；事实源为 project/global `user-preferences.yaml`。',
    `> 当前来源层：${formatSourceLayersForPrompt(sourceLayers)}。`,
    '',
    ...renderAcademicBackgroundPreferences(prefs),
    '',
    ...renderPublicationTargetPreferences(prefs),
    '',
    ...renderResearchFocusPreferences(prefs),
    '',
    ...renderTechnicalPreferencePrompt(prefs),
    '',
    ...renderWritingStylePreferences(prefs),
    '',
    ...renderInteractionPreferences(prefs),
  ].join('\n')
}

function renderAcademicBackgroundPreferences(prefs) {
  const education = cleanPreferenceText(prefs.profile?.education)
  const role = cleanPreferenceText(prefs.profile?.role)
  const researchAreas = normalizeList(prefs.profile?.researchAreas)
  const conferences = normalizeList(prefs.publicationTargets?.conferences)
  const reviewerFocus = normalizeList(prefs.reviewFocus)

  const lines = ['### 学术背景', '']
  if (education) lines.push(`- ${formatPreferenceSentence(education)}`)
  if (role && !['研究者', 'researcher'].includes(role)) lines.push(`- ${formatPreferenceSentence(role)}`)
  if (conferences.length > 0) {
    lines.push(`- 可以使用 ${formatChineseList(conferences)} 风格的技术表达，不需要解释基础 ML 概念。`)
  }
  lines.push(...reviewerFocus.map((item) => `- ${formatPreferenceSentence(item)}`))
  if (researchAreas.length > 0) lines.push(`- 研究方向默认关注：${formatChineseList(researchAreas)}。`)
  return lines
}

function renderPublicationTargetPreferences(prefs) {
  const conferences = normalizeList(prefs.publicationTargets?.conferences)
  const journals = normalizeList(prefs.publicationTargets?.journals)
  const defaultStandard = cleanPreferenceText(prefs.publicationTargets?.defaultStandard)

  const lines = ['### 投稿目标', '']
  if (conferences.length > 0) lines.push(`- 顶会：${formatChineseList(conferences)}。`)
  if (journals.length > 0) lines.push(`- 高影响期刊：${formatChineseList(journals)}。`)
  if (defaultStandard) lines.push(`- ${formatPreferenceSentence(defaultStandard)}`)
  return lines
}

function renderResearchFocusPreferences(prefs) {
  const focus = normalizeList(prefs.researchFocus)
  return [
    '### 研究关注点',
    '',
    ...focus.map((item) => `- ${formatPreferenceSentence(item)}`),
  ]
}

function renderTechnicalPreferencePrompt(prefs) {
  const libraries = normalizeList(prefs.technicalPreferences?.preferredLibraries)
  const rules = normalizeList(prefs.technicalPreferences?.rules)
  const knownLibraries = new Set(DEFAULT_PREFERENCES.technicalPreferences.preferredLibraries)
  const lines = ['### 技术栈偏好', '']

  if (rules.length > 0) {
    lines.push(...rules.map((item) => `- ${formatPreferenceSentence(item)}`))
  } else {
    lines.push(...renderLegacyTechnicalPreferenceRules(libraries))
  }

  const extraLibraries = libraries.filter((item) => !knownLibraries.has(item))
  if (extraLibraries.length > 0) lines.push(`- 其他技术偏好：${formatChineseList(extraLibraries)}。`)
  return lines
}

function renderWritingStylePreferences(prefs) {
  const entries = [
    [prefs.writingStyle?.defaultLanguage, '用户可见回复语言偏好'],
    [prefs.writingStyle?.academicEnglish, '论文相关英文写作风格'],
    [prefs.writingStyle?.chineseStyle, '中文说明风格'],
    [prefs.writingStyle?.technicalDocs, '技术文档风格'],
  ]

  return [
    '### 文字风格',
    '',
    ...entries
      .map(([value, label]) => cleanPreferenceText(value)
        ? `- ${formatPreferenceSentence(value, label)}`
        : '')
      .filter(Boolean),
  ]
}

function renderInteractionPreferences(prefs) {
  const lines = ['### 交互偏好', '']
  if (prefs.interactionPreferences?.discussionBeforePromptChanges === true) {
    const discussionRule = prefs.interactionPreferences?.discussionBeforePromptChangesRule
      || DEFAULT_PREFERENCES.interactionPreferences.discussionBeforePromptChangesRule
    lines.push(`- ${formatPreferenceSentence(discussionRule)}`)
  } else if (prefs.interactionPreferences?.discussionBeforePromptChanges === false) {
    lines.push('- 用户提问、质疑、讨论方案、评估 prompt 或规则时，不强制先输出方案。')
  }

  const implementationBoundary = cleanPreferenceText(prefs.interactionPreferences?.defaultImplementationBoundary)
  if (implementationBoundary) {
    lines.push(`- ${formatPreferenceSentence(implementationBoundary)}`)
  }

  const promptBoundary = cleanPreferenceText(prefs.interactionPreferences?.promptModificationBoundary)
  if (promptBoundary) {
    lines.push(`- ${formatPreferenceSentence(promptBoundary)}`)
  }

  return lines
}

function formatSourceLayersForPrompt(sourceLayers) {
  return (sourceLayers.length > 0 ? sourceLayers : ['built-in']).join('、')
}

function renderLegacyTechnicalPreferenceRules(libraries) {
  const rules = []
  if (libraries.includes('uv')) {
    rules.push('Python 包管理优先 `uv`；已有项目使用 `conda` 时遵循项目现状。')
  }
  const configLibraries = libraries.filter((item) => ['Hydra', 'OmegaConf'].includes(item))
  if (configLibraries.length > 0) rules.push(`配置管理优先 ${formatPreferencePair(configLibraries)}。`)
  const trainingLibraries = libraries.filter((item) => ['PyTorch', 'Transformers Trainer'].includes(item))
  if (trainingLibraries.length > 0) {
    rules.push(`模型训练优先兼容 ${formatChineseList(trainingLibraries)} 或项目已有训练框架。`)
  }
  rules.push('Git 提交信息优先 Conventional Commits。')
  rules.push('实验记录优先保存 config、seed、环境、数据版本、metrics 和 artifact 路径。')
  return rules.map((item) => `- ${formatPreferenceSentence(item)}`)
}

function formatPreferencePair(values) {
  if (values.length === 2 && values.includes('Hydra') && values.includes('OmegaConf')) return 'Hydra + OmegaConf'
  return formatChineseList(values)
}

function formatChineseList(values) {
  return normalizeList(values).map((value) => String(value).trim()).filter(Boolean).join('、')
}

function formatPreferenceSentence(value, label = '') {
  const text = cleanPreferenceText(value)
  if (!text) return ''
  if (/[。！？.!?]$/.test(text)) return text
  if (label && !containsCjk(text)) return `${label}：${text}。`
  return /[。！？.!?]$/.test(text) ? text : `${text}。`
}

function cleanPreferenceText(value) {
  return String(value ?? '').trim()
}

function containsCjk(value) {
  return /[\u3400-\u9fff]/.test(String(value || ''))
}

function migrateLegacyPreferenceDefaults(preferences) {
  const source = normalizeObject(preferences)
  const migrated = migrateLegacyNode(source, '')
  return {
    preferences: migrated.value,
    changed: migrated.changed,
  }
}

function migrateLegacyNode(value, pathKey) {
  if (Array.isArray(value)) {
    if (pathKey === 'reviewFocus' && isLegacyDefaultReviewFocus(value)) {
      return { value: [...DEFAULT_PREFERENCES.reviewFocus], changed: true }
    }

    let changed = false
    const items = value.map((entry) => {
      const migrated = migrateLegacyNode(entry, pathKey)
      changed = changed || migrated.changed
      return migrated.value
    })
    return { value: items, changed }
  }

  if (isPlainObject(value)) {
    let changed = false
    const entries = Object.entries(value).map(([key, entry]) => {
      const childPath = pathKey ? `${pathKey}.${key}` : key
      const migrated = migrateLegacyNode(entry, childPath)
      changed = changed || migrated.changed
      return [key, migrated.value]
    })
    return { value: Object.fromEntries(entries), changed }
  }

  if (typeof value === 'string' && Object.hasOwn(LEGACY_DEFAULT_VALUE_REPLACEMENTS, value)) {
    return { value: LEGACY_DEFAULT_VALUE_REPLACEMENTS[value], changed: true }
  }

  return { value, changed: false }
}

function isLegacyDefaultReviewFocus(values) {
  const legacy = ['novelty', 'technical correctness', 'empirical evidence', 'writing clarity', 'honest limitations']
  const normalized = values.map((value) => String(value).trim())
  return legacy.length === normalized.length && legacy.every((value, index) => normalized[index] === value)
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
