import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ensureDir, parseArgv, readText, writeJson, writeText } from './cli-utils.mjs'
import { normalizeTitle, slugify, splitLines } from './change-tracker-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))

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
  const planId = String(args.getFlag('--plan-id', '')).trim() || `${now.toISOString().slice(0, 10)}-${slugify(title) || 'plan'}`
  const planRoot = join(storage.rootPath, 'plans', planId)
  const constraints = splitLines(args.getFlag('--constraints', '')).concat(args.getList('--constraint'))
  const nonGoals = splitLines(args.getFlag('--non-goals', '')).concat(args.getList('--non-goal'))
  const tasks = splitLines(args.getFlag('--tasks', '')).concat(args.getList('--task'))
  const files = args.getList('--file')
  const route = String(args.getFlag('--route', '~plan')).trim() || '~plan'
  const tier = String(args.getFlag('--tier', 'T1')).trim() || 'T1'
  const contract = buildContract(planId, title, route, tier, args, files)

  ensureDir(planRoot)
  writeTemplate(join(planRoot, 'requirements.md'), 'plan-requirements.md', {
    title,
    goal,
    constraints: renderBullets(constraints),
    non_goals: renderBullets(nonGoals),
  }, [
    `# Requirements: ${title}`,
    '',
    '## Goal',
    goal,
    '',
    '## Constraints',
    renderBullets(constraints),
    '',
    '## Non-goals',
    renderBullets(nonGoals),
  ].join('\n'))

  writeTemplate(join(planRoot, 'plan.md'), 'plan-plan.md', {
    title,
    route,
    tier,
    approach: String(args.getFlag('--approach', '待补充')).trim() || '待补充',
  }, [
    `# Plan: ${title}`,
    '',
    `- Route: \`${route}\``,
    `- Tier: \`${tier}\``,
    '',
    '## Approach',
    String(args.getFlag('--approach', '待补充')).trim() || '待补充',
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

function renderBullets(items) {
  return items.length > 0 ? items.map((item) => `- ${item}`).join('\n') : '- 暂无记录'
}

function renderTasks(tasks, files, verifyMode) {
  if (tasks.length === 0) {
    return [
      '- [ ] 待补充任务',
      `  涉及文件: ${files.length > 0 ? files.join(', ') : '待补充'}`,
      '  完成标准: 待补充',
      `  验证方式: ${verifyMode}`,
    ].join('\n')
  }
  return tasks.map((task) => [
    `- [ ] ${task}`,
    `  涉及文件: ${files.length > 0 ? files.join(', ') : '待补充'}`,
    '  完成标准: 待补充',
    `  验证方式: ${verifyMode}`,
  ].join('\n')).join('\n')
}
