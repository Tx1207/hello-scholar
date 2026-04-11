import { join } from 'node:path'

import { readText, removePath, writeText } from './cli-utils.mjs'

export const PROJECT_ACTIVE_START = '<!-- SCHOLARAGENTS ACTIVE START -->'
export const PROJECT_ACTIVE_END = '<!-- SCHOLARAGENTS ACTIVE END -->'

const SOURCE_PROMPT_FILE = 'AGENTS.md'

const LIFECYCLE_STEPS = [
  {
    label: '1. 研究构思',
    bundleIds: ['research-core'],
    skillIds: ['research-ideation'],
    agentIds: ['literature-reviewer'],
  },
  {
    label: '2. ML 项目开发',
    bundleIds: ['dev-core'],
    skillIds: ['architecture-design'],
    agentIds: ['code-reviewer'],
  },
  {
    label: '3. 实验分析',
    bundleIds: ['research-core'],
    skillIds: ['results-analysis', 'results-report'],
  },
  {
    label: '4. 论文写作',
    bundleIds: ['writing-core'],
    skillIds: ['ml-paper-writing'],
    agentIds: ['paper-miner'],
  },
  {
    label: '5. 论文自审',
    bundleIds: ['writing-core'],
    skillIds: ['paper-self-review'],
  },
  {
    label: '6. 投稿与 Rebuttal',
    bundleIds: ['writing-core'],
    skillIds: ['review-response'],
    agentIds: ['rebuttal-writer'],
  },
  {
    label: '7. 录用后处理',
    bundleIds: ['writing-core'],
    skillIds: ['post-acceptance'],
  },
]

const SUPPORT_WORKFLOWS = [
  {
    label: 'Zotero 集成',
    bundleIds: ['research-core', 'obsidian-core'],
    bundleMode: 'any',
  },
  {
    label: '知识提取',
    bundleIds: ['research-core', 'writing-core'],
    bundleMode: 'any',
    agentIds: ['paper-miner', 'kaggle-miner'],
  },
  {
    label: 'Obsidian 知识库',
    bundleIds: ['obsidian-core'],
    bundleMode: 'any',
    skillIds: ['obsidian-project-memory'],
  },
  {
    label: '技能进化',
    bundleIds: ['meta-builder'],
    bundleMode: 'any',
    skillIds: ['skill-development', 'skill-quality-reviewer', 'skill-improver'],
  },
]

export function renderManagedBootstrapPrompt({ runtime, selection, mode }) {
  const template = readText(join(runtime.pkgRoot, SOURCE_PROMPT_FILE))
    .replace(/\r\n/g, '\n')
    .trimEnd()
  if (!template) {
    throw new Error(`Prompt source is missing: ${join(runtime.pkgRoot, SOURCE_PROMPT_FILE)}`)
  }

  const workflowSection = extractTopLevelSection(template, '## 核心工作流')
  const skillSection = extractTopLevelSection(template, '## 技能目录（55 skills）')

  let prompt = template
    .replace(/^# Codex Scholar 配置/m, '# ScholarAGENTS 配置')
    .replace(/\*\*Codex Scholar\*\*/g, '**ScholarAGENTS**')

  prompt = replaceListBlock(prompt, '**配置路径**:', buildOverviewPathLines(mode))
  prompt = replaceTopLevelSection(
    prompt,
    '## 核心工作流',
    renderWorkflowSection(workflowSection, selection, mode),
  )
  prompt = replaceTopLevelSection(
    prompt,
    '## 技能目录（55 skills）',
    renderSkillCatalogSection(skillSection, selection, mode),
  )
  if (mode === 'global') {
    prompt = replaceListBlock(prompt, '### 配置文件路径', buildGlobalCliPathLines())
  }

  return prompt.trimEnd()
}

export function writeProjectActivationPrompt({ runtime, selection, mode, cwd = process.cwd() }) {
  const projectStateRoot = join(cwd, '.scholaragents')
  const hostActivePromptPath = join(runtime.codexHome, 'scholaragents-active-prompt.md')
  const projectActivePromptPath = join(projectStateRoot, 'active-prompt.md')
  const activePromptPath = mode === 'global' ? hostActivePromptPath : projectActivePromptPath
  const otherActivePromptPath = mode === 'global' ? projectActivePromptPath : hostActivePromptPath
  const prompt = renderManagedBootstrapPrompt({ runtime, selection, mode })

  writeText(activePromptPath, `${prompt}\n`)
  removePath(otherActivePromptPath)

  return {
    activePromptPath,
  }
}

function renderWorkflowSection(sourceSection, selection, mode) {
  const body = stripTopLevelHeading(sourceSection)
  const lines = [
    '## 核心工作流',
    '',
    '### 当前激活覆盖',
    `- 当前模式：\`${mode}\``,
    '- 当前项目激活文件：项目根 `.scholaragents/modules.json`',
    `- 当前 bundles：${formatCodeList(selection.bundles)}`,
    `- 当前 skills：${selection.skills.length}`,
    `- 当前 agents：${selection.agents.length}`,
    '- 热加载原则：下方原始工作流定义继续保留，但只有当前已激活的 bundle / skill / agent 可以直接假定可用。',
    '',
    '#### 研究生命周期状态',
    ...LIFECYCLE_STEPS.map((step) => `- ${step.label}：${describeRequirementStatus(step, selection)}`),
    '',
    '#### 支撑工作流状态',
    ...SUPPORT_WORKFLOWS.map((workflow) => `- ${workflow.label}：${describeRequirementStatus(workflow, selection)}`),
    '',
    body,
  ]

  return lines.join('\n').trimEnd()
}

function renderSkillCatalogSection(sourceSection, selection, mode) {
  const body = stripTopLevelHeading(sourceSection)
  const lines = [
    '## 技能目录（55 skills）',
    '',
    '### 当前激活覆盖',
    `- 当前模式：\`${mode}\``,
    `- 当前 bundles：${formatCodeList(selection.bundles)}`,
    `- 当前 skills：${selection.skills.length}`,
    `- 当前 agents：${selection.agents.length}`,
    '- 说明：目录结构保持原样；每个 skill 条目后的“当前”状态对应本项目当前激活集；遵循热加载原则。',
    '',
    annotateSkillCatalog(body, selection),
  ]

  return lines.join('\n').trimEnd()
}

function annotateSkillCatalog(sectionBody, selection) {
  const activeSkills = new Set(selection.skills)
  return sectionBody
    .split('\n')
    .map((line) => {
      const match = line.match(/^-\s+\*\*(.+?)\*\*:\s*(.+)$/)
      if (!match) return line

      const skillIds = match[1]
        .split('/')
        .map((value) => value.trim())
        .filter(Boolean)

      if (skillIds.length === 0) return line
      return `${line} ${formatSkillStatus(skillIds, activeSkills)}`
    })
    .join('\n')
    .trimEnd()
}

function buildOverviewPathLines(mode) {
  if (mode === 'global') {
    return [
      '- 全局状态目录：`~/.codex/.scholaragents/`',
      '- 全局提示入口：`~/.codex/AGENTS.md` 中的 ScholarAGENTS 受管块',
      '- 全局插件源：`~/plugins/scholaragents/`',
      '- 全局插件缓存：`~/.codex/plugins/cache/local-plugins/scholaragents/local/`',
      '- 项目覆盖清单（若存在则优先）：项目根 `.scholaragents/modules.json`',
    ]
  }

  return [
    '- 项目激活清单：项目根 `.scholaragents/modules.json`',
    '- 项目 Skill 目录：项目根 `.scholaragents/skills/`',
    '- 项目 Agent 目录：项目根 `.scholaragents/agents/`',
    '- 项目提示入口：项目根 `AGENTS.md` 中的 ScholarAGENTS 受管块',
  ]
}

function buildGlobalCliPathLines() {
  return [
    '- 主配置：`~/.codex/config.toml`',
    '- 全局状态目录：`~/.codex/.scholaragents/`',
    '- Global 插件源：`~/plugins/scholaragents/`',
    '- Global 插件缓存：`~/.codex/plugins/cache/local-plugins/scholaragents/local/`',
    '- Agent 配置由 `~/.codex/config.toml` 中的 `[agents.*]` 指向 `~/plugins/scholaragents/agents/<name>/config.toml`',
    '- 若项目根存在 `.scholaragents/modules.json`，当前仓库优先读取项目激活清单，再回退到 global。',
  ]
}

function describeRequirementStatus(requirement, selection) {
  const skillIds = requirement.skillIds || []
  const agentIds = requirement.agentIds || []
  const bundleIds = requirement.bundleIds || []
  const activeModuleIds = [
    ...skillIds.filter((id) => selection.skills.includes(id)),
    ...agentIds.filter((id) => selection.agents.includes(id)),
  ]
  const totalModuleCount = skillIds.length + agentIds.length

  if (totalModuleCount > 0) {
    if (activeModuleIds.length === totalModuleCount) return '已激活'
    if (activeModuleIds.length > 0) return `部分激活：${formatCodeList(activeModuleIds)}`
  }

  if (bundleIds.length === 0) return '未激活'

  const bundleMode = requirement.bundleMode || 'all'
  const bundleActive = bundleMode === 'any'
    ? bundleIds.some((id) => selection.bundles.includes(id))
    : bundleIds.every((id) => selection.bundles.includes(id))

  if (bundleActive) return '已激活'
  return `未激活，需要 ${formatCodeList(bundleIds)}`
}

function formatSkillStatus(skillIds, activeSkills) {
  const activeIds = skillIds.filter((id) => activeSkills.has(id))
  if (activeIds.length === skillIds.length) return '（当前：已激活）'
  if (activeIds.length === 0) return '（当前：未激活）'
  return `（当前：部分激活：${formatCodeList(activeIds)}）`
}

function formatCodeList(values) {
  return values.length > 0
    ? values.map((value) => `\`${value}\``).join('、')
    : '(none)'
}

function extractTopLevelSection(text, heading) {
  const bounds = findTopLevelSectionBounds(text, heading)
  if (!bounds) return heading
  return text.slice(bounds.start, bounds.end).trimEnd()
}

function replaceTopLevelSection(text, heading, replacement) {
  const bounds = findTopLevelSectionBounds(text, heading)
  if (!bounds) return text

  const before = text.slice(0, bounds.start).trimEnd()
  const after = text.slice(bounds.end).trimStart()
  return [before, replacement.trimEnd(), after].filter(Boolean).join('\n\n')
}

function stripTopLevelHeading(sectionText) {
  const lines = sectionText.split('\n')
  return lines.slice(1).join('\n').trim()
}

function findTopLevelSectionBounds(text, heading) {
  const headingPattern = new RegExp(`^${escapeRegex(heading)}$`, 'm')
  const headingMatch = headingPattern.exec(text)
  if (!headingMatch) return null

  const start = headingMatch.index
  const afterHeading = start + headingMatch[0].length
  const rest = text.slice(afterHeading)
  const nextHeadingMatch = /\n## /m.exec(rest)
  const end = nextHeadingMatch ? afterHeading + nextHeadingMatch.index + 1 : text.length
  return { start, end }
}

function replaceListBlock(text, headingLine, listLines) {
  const pattern = new RegExp(`^${escapeRegex(headingLine)}\\n(?:- .*\\n)+`, 'm')
  const replacement = `${headingLine}\n${listLines.join('\n')}\n`
  return pattern.test(text) ? text.replace(pattern, replacement) : text
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
