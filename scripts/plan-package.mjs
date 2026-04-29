import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureDir, parseArgv, readText, writeJson, writeText } from './cli-utils.mjs'
import { formatCompactDateTime, normalizeTitle, slugify, splitLines } from './change-tracker-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const REQUIREMENTS_SECTIONS = ['用户问题', '目标', '成功标准', '约束', '非目标', '需要确认的问题']
const PLAN_SECTIONS = ['修改策略', '受影响文件', '逐项修改说明', '行为变化', '风险与缓解', '验证计划', 'Traceability']
const TASK_FIELDS = ['涉及文件', '具体改动', '完成标准', '验证方式', '依赖/阻塞', '对应计划项', '对应 change 记录']
const CHANGE_RECORD_SECTIONS = ['背景', '实际修改', '文件级变更', '行为变化', '决策记录', '验证结果', '未解决问题', 'Traceability']

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'create'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command !== 'create') {
    throw new Error(`Unknown plan-package command: ${command}`)
  }
  const result = createPlanPackage(cwd, args)
  console.log(JSON.stringify(result, null, 2))
}

export function createPlanPackage(cwd, args) {
  const storage = resolveProjectStorage(cwd)
  const title = normalizeTitle(args.getFlag('--title', ''), args.getFlag('--goal', ''))
  const goal = String(args.getFlag('--goal', title)).trim() || title
  const now = new Date()
  const planId = String(args.getFlag('--plan-id', '')).trim() || `PLAN-${formatCompactDateTime(now)}-${slugify(title) || 'plan'}`
  const planRoot = join(storage.rootPath, 'plans', planId)
  const constraints = splitLines(args.getFlag('--constraints', '')).concat(args.getList('--constraint'))
  const nonGoals = splitLines(args.getFlag('--non-goals', '')).concat(args.getList('--non-goal'))
  const tasks = splitLines(args.getFlag('--tasks', '')).concat(args.getList('--task'))
  const files = args.getList('--file')
  const route = String(args.getFlag('--route', '~plan')).trim() || '~plan'
  const tier = String(args.getFlag('--tier', 'T1')).trim() || 'T1'
  const contract = buildContract(planId, title, route, tier, args, files)
  const userProblem = String(args.getFlag('--user-problem', '')).trim()
    || `用户希望完成：${goal}`
  const successCriteria = splitLines(args.getFlag('--success-criteria', '')).concat(args.getList('--success-criterion'))
  const confirmationQuestions = splitLines(args.getFlag('--confirmation-questions', '')).concat(args.getList('--confirmation-question'))
  const changeItems = splitLines(args.getFlag('--change-items', '')).concat(args.getList('--change-item'))
  const behaviorChanges = splitLines(args.getFlag('--behavior-changes', '')).concat(args.getList('--behavior-change'))
  const risks = splitLines(args.getFlag('--risks', '')).concat(args.getList('--risk'))
  const verificationPlan = splitLines(args.getFlag('--verification-plan', '')).concat(args.getList('--verification-step'))

  ensureDir(planRoot)
  writeTemplate(join(planRoot, 'requirements.md'), 'plan-requirements.md', {
    title,
    user_problem: userProblem,
    goal,
    success_criteria: renderBullets(successCriteria, [
      '用户可见输出明确说明范围、逐项修改、行为变化、风险边界和验证方式',
      'plan package 记录未来执行路径，并为每个计划项提供可验证完成标准',
      'change record 只记录实际完成的修改，并能追踪到文件和验证证据',
    ]),
    constraints: renderBullets(constraints),
    non_goals: renderBullets(nonGoals),
    confirmation_questions: renderBullets(confirmationQuestions, ['暂无需要确认的问题；如执行中发现关键歧义，应停止并补充确认']),
  }, [
    `# Requirements: ${title}`,
    '',
    '## User Problem',
    userProblem,
    '',
    '## Goal',
    goal,
    '',
    '## Success Criteria',
    renderBullets(successCriteria, [
      'User-visible output names scope, per-item changes, behavior changes, risks, and verification.',
      'Plan package records future execution with verifiable completion criteria.',
      'Change record only records completed work and links it to files and verification evidence.',
    ]),
    '',
    '## Constraints',
    renderBullets(constraints),
    '',
    '## Non-goals',
    renderBullets(nonGoals),
    '',
    '## Questions To Confirm',
    renderBullets(confirmationQuestions, ['No open confirmation questions at plan creation time.']),
  ].join('\n'))

  writeTemplate(join(planRoot, 'plan.md'), 'plan-plan.md', {
    title,
    route,
    tier,
    approach: String(args.getFlag('--approach', '待补充')).trim() || '待补充',
    affected_files: renderAffectedFiles(files),
    change_items: renderChangeItems(changeItems.length > 0 ? changeItems : tasks, files),
    behavior_changes: renderBullets(behaviorChanges, [
      '用户可见回答从摘要式说明改为包含范围、逐项修改、行为变化、风险边界和验证方式',
      'plan 文件回答接下来怎么做，change 文件回答实际改了什么',
      '完成态总结必须能追踪到 tasks、change record 和验证结果',
    ]),
    risks: renderBullets(risks, [
      '输出变长：仅在复杂修改、高影响 prompt/workflow 修改或多文件任务中强制完整结构',
      '模板机械化：无内容 section 必须显式写明暂无，而不是删除关键字段',
      '计划与实际漂移：通过 Traceability 表把用户需求、计划项、任务、文件和验证绑定',
    ]),
    verification_plan: renderBullets(verificationPlan, [
      '检查 requirements.md、plan.md、tasks.md 和 change record 是否包含必需 section',
      '检查每个计划项是否有对应任务，每个完成任务是否有实际文件变更或明确说明',
      `运行 ${contract.verifyMode} 范围内的测试或人工 review`,
    ]),
    traceability: renderPlanTraceability(tasks, files, contract.verifyMode),
  }, [
    `# Plan: ${title}`,
    '',
    `- Route: \`${route}\``,
    `- Tier: \`${tier}\``,
    '',
    '## Approach',
    String(args.getFlag('--approach', '待补充')).trim() || '待补充',
    '',
    '## Affected Files',
    renderAffectedFiles(files),
    '',
    '## Per-item Changes',
    renderChangeItems(changeItems.length > 0 ? changeItems : tasks, files),
    '',
    '## Behavior Changes',
    renderBullets(behaviorChanges),
    '',
    '## Risks And Mitigation',
    renderBullets(risks),
    '',
    '## Verification Plan',
    renderBullets(verificationPlan),
    '',
    '## Traceability',
    renderPlanTraceability(tasks, files, contract.verifyMode),
  ].join('\n'))

  writeTemplate(join(planRoot, 'tasks.md'), 'plan-tasks.md', {
    title,
    tasks: renderTasks(tasks, files, contract.verifyMode),
  }, [
    `# Tasks: ${title}`,
    '',
    renderTasks(tasks, files, contract.verifyMode),
  ].join('\n'))

  writeJson(join(planRoot, 'contract.json'), contract)

  return {
    ok: true,
    planId,
    planRoot: relative(cwd, planRoot).replace(/\\/g, '/'),
    contractPath: relative(cwd, join(planRoot, 'contract.json')).replace(/\\/g, '/'),
  }
}

function buildContract(planId, title, route, tier, args, files) {
  const deliveryGate = {
    requiresEvidence: args.getFlag('--requires-evidence', 'true') !== 'false',
    minEvidenceCount: Number(args.getFlag('--min-evidence', 1)) || 1,
    maxEvidenceAgeHours: Number(args.getFlag('--max-evidence-age-hours', 168)) || 168,
  }
  return {
    version: 1,
    planId,
    title,
    route,
    tier,
    status: String(args.getFlag('--status', 'active')).trim() || 'active',
    verifyMode: String(args.getFlag('--verify-mode', 'targeted')).trim() || 'targeted',
    reviewerFocus: splitLines(args.getFlag('--reviewer-focus', '')).concat(args.getList('--reviewer-focus-item')),
    testerFocus: splitLines(args.getFlag('--tester-focus', '')).concat(args.getList('--tester-focus-item')),
    advisor: splitLines(args.getFlag('--advisor', '')).concat(args.getList('--advisor-item')),
    allowedFiles: files,
    deliveryGate,
    documentationContract: {
      requirementsSections: REQUIREMENTS_SECTIONS,
      planSections: PLAN_SECTIONS,
      taskFields: TASK_FIELDS,
      changeRecordSections: CHANGE_RECORD_SECTIONS,
      traceabilityRequired: true,
      userVisibleModificationResponse: [
        '我理解的问题',
        '修改目标',
        '修改范围',
        '具体修改点',
        '行为变化',
        '风险与边界',
        '验证方式',
      ],
    },
    skillEvolution: buildSkillEvolutionPolicy(args, deliveryGate),
  }
}

function buildSkillEvolutionPolicy(args, deliveryGate) {
  const enabled = args.hasFlag('--skill-evolution')
    ? normalizeBool(args.getFlag('--skill-evolution', true), true)
    : false
  return {
    enabled,
    requiresApproval: normalizeBool(args.getFlag('--skill-evolution-requires-approval', 'true'), true),
    allowCreate: normalizeBool(args.getFlag('--skill-evolution-allow-create', 'true'), true),
    allowUpdate: normalizeBool(args.getFlag('--skill-evolution-allow-update', 'true'), true),
    minEvidenceCount: Number(args.getFlag('--skill-evolution-min-evidence', deliveryGate.minEvidenceCount)) || deliveryGate.minEvidenceCount,
    scope: String(args.getFlag('--skill-evolution-scope', 'meta-builder-or-opt-in')).trim() || 'meta-builder-or-opt-in',
  }
}

function normalizeBool(value, fallback) {
  if (value === true) return true
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return fallback
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true
  if (['false', '0', 'no', 'off'].includes(normalized)) return false
  return fallback
}

function writeTemplate(targetPath, templateName, values, fallback) {
  const templatePath = join(pkgRoot, 'templates', templateName)
  const template = readText(templatePath, fallback)
  const rendered = Object.entries(values).reduce(
    (current, [key, value]) => current.replaceAll(`{{${key}}}`, value),
    template,
  )
  writeText(targetPath, `${rendered.trimEnd()}\n`)
}

function renderBullets(items, fallbackItems = ['暂无记录']) {
  const values = items.length > 0 ? items : fallbackItems
  return values.map((item) => `- ${item}`).join('\n')
}

function renderTasks(tasks, files, verifyMode) {
  if (tasks.length === 0) {
    return [
      '- [ ] 待补充任务',
      `  涉及文件：${files.length > 0 ? files.join(', ') : '待补充'}`,
      '  具体改动：待补充',
      '  完成标准：待补充',
      `  验证方式：${verifyMode}`,
      '  依赖/阻塞：暂无',
      '  对应计划项：PLAN-001',
      '  对应 change 记录：完成后补充',
    ].join('\n')
  }
  return tasks.map((task, index) => [
    `- [ ] ${task}`,
    `  涉及文件：${files.length > 0 ? files.join(', ') : '待补充'}`,
    `  具体改动：围绕该任务补充具体对象、规则、脚本或测试改动，禁止只写泛化动词。`,
    '  完成标准：相关文件已落地明确规则或实现，且能从 diff 中定位。',
    `  验证方式：${verifyMode}`,
    '  依赖/阻塞：暂无',
    `  对应计划项：PLAN-${String(index + 1).padStart(3, '0')}`,
    '  对应 change 记录：完成后补充',
  ].join('\n')).join('\n')
}

function renderAffectedFiles(files) {
  if (files.length === 0) {
    return [
      '| 文件 | 相关 section / 模块 | 本次职责 |',
      '|---|---|---|',
      '| 待补充 | 待补充 | 待补充 |',
    ].join('\n')
  }
  return [
    '| 文件 | 相关 section / 模块 | 本次职责 |',
    '|---|---|---|',
    ...files.map((file) => `| \`${file}\` | 待补充 | 待补充 |`),
  ].join('\n')
}

function renderChangeItems(items, files) {
  const values = items.length > 0 ? items : ['待补充修改项']
  return values.map((item, index) => [
    `### PLAN-${String(index + 1).padStart(3, '0')} ${item}`,
    '',
    '- 当前问题：待补充',
    '- 准备修改：待补充',
    '- 插入位置：待补充',
    '- 新增规则：待补充',
    '- 删除或替换内容：无，除非后续确认',
    `- 影响的输出：${files.length > 0 ? files.join(', ') : '待补充'}`,
    '- 与其他规则的关系：待补充',
  ].join('\n')).join('\n\n')
}

function renderPlanTraceability(tasks, files, verifyMode) {
  const values = tasks.length > 0 ? tasks : ['待补充任务']
  return [
    '| 用户需求 | Plan Item | Task | Changed File | Verification | Status |',
    '|---|---|---|---|---|---|',
    ...values.map((task, index) => {
      const itemId = `PLAN-${String(index + 1).padStart(3, '0')}`
      const fileCell = files.length > 0 ? files.map((file) => `\`${file}\``).join('<br>') : '待补充'
      return `| ${task} | ${itemId} | ${task} | ${fileCell} | ${verifyMode} | planned |`
    }),
  ].join('\n')
}
