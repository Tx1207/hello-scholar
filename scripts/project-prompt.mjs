import { join } from 'node:path'

import { readText, removePath, writeText } from './cli-utils.mjs'
import { formatPreferencesPromptSection, readEffectivePreferences } from './preferences/preferences-store.mjs'

export const PROJECT_ACTIVE_START = '<!-- HELLO_SCHOLAR ACTIVE START -->'
export const PROJECT_ACTIVE_END = '<!-- HELLO_SCHOLAR ACTIVE END -->'

const SOURCE_PROMPT_FILE = 'AGENTS.md'

const LIFECYCLE_STEPS = [
  {
    label: '1. 研究构思',
    profileId: 'research-ideation',
  },
  {
    label: '2. ML 项目开发',
    profileId: 'ml-development',
  },
  {
    label: '3. 论文写作',
    profileId: 'paper-writing',
  },
  {
    label: '4. 论文自审',
    profileId: 'paper-self-review',
  },
  {
    label: '5. 投稿与 Rebuttal',
    profileId: 'submission-rebuttal',
  },
  {
    label: '6. 录用后处理',
    profileId: 'post-acceptance',
  },
]

const SUPPORT_WORKFLOWS = [
  {
    label: 'Zotero 集成',
    profileIds: ['zotero-integration'],
    skillIds: ['zotero-obsidian-bridge'],
    agentIds: ['literature-reviewer-obsidian'],
  },
  {
    label: '知识提取',
    profileIds: ['knowledge-extraction'],
    agentIds: ['paper-miner', 'kaggle-miner'],
  },
  {
    label: 'Obsidian 知识库',
    profileIds: ['obsidian-memory'],
    skillIds: ['obsidian-project-memory'],
  },
  {
    label: '技能进化',
    profileIds: ['skill-evolution'],
    skillIds: ['skill-development', 'skill-quality-reviewer', 'skill-improver'],
  },
]

export function renderManagedBootstrapPrompt({ runtime, catalog = null, selection, mode, cwd = process.cwd() }) {
  const template = readText(join(runtime.pkgRoot, SOURCE_PROMPT_FILE))
    .replace(/\r\n/g, '\n')
    .trimEnd()
  if (!template) {
    throw new Error(`Prompt source is missing: ${join(runtime.pkgRoot, SOURCE_PROMPT_FILE)}`)
  }

  const workflowSection = extractTopLevelSection(template, '## 统一执行流程')
  const skillSection = extractTopLevelSection(template, '## 技能分层')

  let prompt = template
    .replace(/^# hello-scholar 配置/m, '# hello-scholar')
    .replace(/\*\*hello-scholar\*\*/g, '**hello-scholar**')

  prompt = replaceListBlock(prompt, '**配置路径**:', buildOverviewPathLines(mode))
  prompt = replaceTopLevelSection(
    prompt,
    '## 统一执行流程',
    renderWorkflowSection(workflowSection, selection, mode),
  )
  prompt = replaceTopLevelSection(
    prompt,
    '## 技能分层',
    renderSkillCatalogSection(skillSection, selection, mode, catalog),
  )
  prompt = insertCurrentProfileSection(prompt, selection, mode)
  prompt = insertEffectivePreferencesSection(prompt, { cwd, runtime })
  if (mode === 'global') {
    prompt = replaceListBlock(prompt, '### 配置文件路径', buildGlobalCliPathLines())
  }

  return prompt.trimEnd()
}

export function writeProjectActivationPrompt({ runtime, catalog = null, selection, mode, cwd = process.cwd() }) {
  const projectStateRoot = join(cwd, '.hello-scholar')
  const hostActivePromptPath = join(runtime.codexHome, 'hello-scholar-active-prompt.md')
  const projectActivePromptPath = join(projectStateRoot, 'active-prompt.md')
  const activePromptPath = mode === 'global' ? hostActivePromptPath : projectActivePromptPath
  const otherActivePromptPath = mode === 'global' ? projectActivePromptPath : hostActivePromptPath
  const prompt = renderManagedBootstrapPrompt({ runtime, catalog, selection, mode, cwd })

  writeText(activePromptPath, `${prompt}\n`)
  removePath(otherActivePromptPath)

  return {
    activePromptPath,
  }
}

function insertEffectivePreferencesSection(prompt, { cwd, runtime }) {
  const section = formatPreferencesPromptSection(readEffectivePreferences({ cwd, runtime, initializeProject: true }))
  return replaceTopLevelSection(prompt, '## 用户偏好', section)
}

function renderWorkflowSection(sourceSection, selection, mode) {
  const body = stripTopLevelHeading(sourceSection)
  const lines = [
    '## 统一执行流程',
    '',
    '### 当前激活 Profile',
    `- 当前模式：\`${mode}\``,
    `- Base profile：\`${selection.baseProfile || 'ml-development'}\``,
    `- Active profiles：${formatCodeList(selection.activeProfiles || [selection.activeProfile || 'ml-development'])}`,
    '- 当前项目激活文件：项目根 `.hello-scholar/modules.json`',
    `- 当前 skills：${selection.skills.length}`,
    `- 当前 agents：${selection.agents.length}`,
    '- 热加载原则：下方原始工作流定义继续保留，但只有当前已激活的 profile / skill / agent 可以直接假定可用。',
    '',
    '#### 研究生命周期状态',
    ...LIFECYCLE_STEPS.map((step) => `- ${step.label}：${describeLifecycleStatus(step, selection)}`),
    '',
    '#### 支撑工作流状态',
    ...SUPPORT_WORKFLOWS.map((workflow) => `- ${workflow.label}：${describeRequirementStatus(workflow, selection)}`),
    '',
    body,
  ]

  return lines.join('\n').trimEnd()
}

function renderSkillCatalogSection(sourceSection, selection, mode, catalog) {
  const body = stripTopLevelHeading(sourceSection)
  const dynamicSkillSection = renderDynamicSkillSection(selection, catalog)
  const lines = [
    '## 技能分层',
    '',
    '### 当前激活 Skills / Agents',
    `- 当前模式：\`${mode}\``,
    `- Base profile：\`${selection.baseProfile || 'ml-development'}\``,
    `- Active profiles：${formatCodeList(selection.activeProfiles || [selection.activeProfile || 'ml-development'])}`,
    `- 当前 skills：${selection.skills.length}`,
    `- 当前 agents：${selection.agents.length}`,
    '- 说明：目录结构保持原样；每个 skill 条目后的“当前”状态对应本项目当前激活集；遵循热加载原则。',
    '',
    annotateSkillCatalog(body, selection),
    dynamicSkillSection ? '' : null,
    dynamicSkillSection,
  ]

  return lines.filter(Boolean).join('\n').trimEnd()
}

function insertCurrentProfileSection(prompt, selection, mode) {
  if (prompt.includes('## 当前激活 Profile')) return prompt
  const section = [
    '## 当前激活 Profile',
    '',
    `- Mode: \`${mode}\``,
    `- Base profile: \`${selection.baseProfile || 'ml-development'}\``,
    `- Active profiles: ${formatCodeList(selection.activeProfiles || [selection.activeProfile || 'ml-development'])}`,
    `- Skills: ${selection.skills.length}`,
    `- Agents: ${selection.agents.length}`,
  ].join('\n')
  const firstSection = /\n## /m.exec(prompt)
  if (!firstSection) return `${prompt.trimEnd()}\n\n${section}`
  return `${prompt.slice(0, firstSection.index).trimEnd()}\n\n${section}\n\n${prompt.slice(firstSection.index + 1).trimStart()}`
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
      '- 全局共享状态目录：`~/plugins/hello-scholar/.hello-scholar/`',
      '- 用户 Overlay Skill 目录：`~/plugins/hello-scholar/.hello-scholar/overlays/skills/`',
      '- 全局提示入口：`~/.codex/AGENTS.md` 中的 hello-scholar 受管块',
      '- 全局插件源：`~/plugins/hello-scholar/`',
      '- 全局插件缓存：`~/.codex/plugins/cache/local-plugins/hello-scholar/local/`',
      '- 项目覆盖清单（若存在则优先）：项目根 `.hello-scholar/modules.json`',
    ]
  }

  return [
    '- 项目激活清单：项目根 `.hello-scholar/modules.json`',
    '- 项目 Skill 目录：项目根 `.hello-scholar/skills/`',
    '- 项目 Agent 目录：项目根 `.hello-scholar/agents/`',
    '- 用户 Overlay Skill 目录：`~/plugins/hello-scholar/.hello-scholar/overlays/skills/`',
    '- 项目提示入口：项目根 `AGENTS.md` 中的 hello-scholar 受管块',
  ]
}

function buildGlobalCliPathLines() {
  return [
    '- 主配置：`~/.codex/config.toml`',
    '- 全局共享状态目录：`~/plugins/hello-scholar/.hello-scholar/`',
    '- Global 插件源：`~/plugins/hello-scholar/`',
    '- Global 插件缓存：`~/.codex/plugins/cache/local-plugins/hello-scholar/local/`',
    '- Agent 配置由 `~/.codex/config.toml` 中的 `[agents.*]` 指向 `~/plugins/hello-scholar/agents/<name>/config.toml`',
    '- 若项目根存在 `.hello-scholar/modules.json`，当前仓库优先读取项目激活清单，再回退到 global。',
  ]
}

function describeRequirementStatus(requirement, selection) {
  const activeProfiles = getActiveProfileSet(selection)
  const profileIds = requirement.profileIds || []
  const activeProfileIds = profileIds.filter((id) => activeProfiles.has(id))
  const skillIds = requirement.skillIds || []
  const agentIds = requirement.agentIds || []
  const activeModuleIds = [
    ...skillIds.filter((id) => selection.skills.includes(id)),
    ...agentIds.filter((id) => selection.agents.includes(id)),
  ]
  const totalModuleCount = skillIds.length + agentIds.length

  if (profileIds.length > 0 && activeProfileIds.length === profileIds.length) return '已激活'

  if (totalModuleCount > 0) {
    if (activeModuleIds.length === totalModuleCount) return '已激活'
    if (activeModuleIds.length > 0 || activeProfileIds.length > 0) {
      return `部分激活：${formatCodeList([...activeProfileIds, ...activeModuleIds])}`
    }
  }

  if (activeProfileIds.length > 0) return `部分激活：${formatCodeList(activeProfileIds)}`

  return '未激活'
}

function describeLifecycleStatus(step, selection) {
  const activeProfiles = getActiveProfileSet(selection)
  return activeProfiles.has(step.profileId) ? '已激活' : '未激活'
}

function getActiveProfileSet(selection) {
  return new Set([
    selection.baseProfile || 'ml-development',
    ...(selection.activeProfiles || [selection.activeProfile || 'ml-development']),
  ])
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

function renderDynamicSkillSection(selection, catalog) {
  if (!catalog) return ''
  const entries = selection.skills
    .map((skillId) => catalog.skillMap.get(skillId))
    .filter((entry) => entry?.dynamic)

  if (entries.length === 0) return ''

  return [
    '### 当前动态 Skills',
    '',
    ...entries.map((entry) => `- \`${entry.id}\` | \`${entry.sourceLayer}\` | ${entry.description || 'No description'}`),
  ].join('\n')
}

function extractTopLevelSection(text, heading) {
  const bounds = findTopLevelSectionBounds(text, heading)
  if (!bounds) return heading
  return text.slice(bounds.start, bounds.end).trimEnd()
}

function replaceTopLevelSection(text, heading, replacement) {
  const bounds = findTopLevelSectionBounds(text, heading)
  if (!bounds) return `${text.trimEnd()}\n\n${replacement.trimEnd()}`

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
