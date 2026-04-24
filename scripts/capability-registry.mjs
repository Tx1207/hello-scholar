import { readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { detectInstalledScope, getRuntimeContext, loadInstallState, loadUserConfig } from './cli-config.mjs'
import { parseArgv, pathExists, readJson, readText } from './cli-utils.mjs'
import { loadCatalog } from './catalog-loader.mjs'
import { parseFrontmatter } from './change-tracker-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'
import { loadSelectionState } from './selection-state.mjs'
import { getEvolutionPaths, readCandidates } from './skill-evolution-store.mjs'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'recommend'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command !== 'recommend') {
    throw new Error(`Unknown capability-registry command: ${command}`)
  }
  console.log(JSON.stringify(recommendCapabilities(cwd, args), null, 2))
}

export function recommendCapabilities(cwd, args) {
  const storage = resolveProjectStorage(cwd)
  const runtime = getRuntimeContext(pkgRoot)
  const scope = detectInstalledScope(runtime, cwd)
  const userConfig = loadUserConfig(runtime, cwd, scope)
  const installState = loadInstallState(runtime, cwd, scope).state
  const catalog = loadCatalog(pkgRoot, { dynamic: true, cwd, runtime })
  const selection = loadSelectionState(catalog, installState, userConfig, runtime, { cwd, scope })
  const stateMeta = readStateMeta(join(storage.rootPath, 'state', 'STATE.md'))
  const contract = readActiveContract(storage.rootPath, args)
  const recommendations = []

  const route = contract?.route || stateMeta.route || '~auto'
  if (route === '~plan') addSkill(recommendations, catalog, 'planning-with-files', 'route requires persistent planning')
  if (route === '~build') addSkill(recommendations, catalog, 'daily-coding', 'route focuses on implementation work')
  if (route === '~verify') addSkill(recommendations, catalog, 'verification-loop', 'route focuses on verification')
  if (route === '~test') addSkill(recommendations, catalog, 'verification-loop', 'route focuses on targeted testing')
  if (route === '~idea') addSkill(recommendations, catalog, 'research-ideation', 'route focuses on exploration')
  if (route === '~prd') {
    addSkill(recommendations, catalog, 'planning-with-files', 'route requires persistent document planning')
    addSkill(recommendations, catalog, 'doc-coauthoring', 'route focuses on delivery documents')
  }
  if (route === '~loop') addSkill(recommendations, catalog, 'verification-loop', 'route focuses on iterative verification loops')
  if (route === '~commit') addSkill(recommendations, catalog, 'git-commit', 'route focuses on structured git commits')

  if (contract?.verifyMode === 'evidence-driven') {
    addSkill(recommendations, catalog, 'verification-loop', 'contract requires evidence-driven verification')
    addTool(recommendations, 'delivery-gate.mjs', 'delivery gate must evaluate evidence freshness')
    addTool(recommendations, 'evidence-store.mjs', 'verification evidence should be persisted')
  }
  if (Array.isArray(contract?.reviewerFocus) && contract.reviewerFocus.length > 0) {
    addSkill(recommendations, catalog, 'code-review-excellence', 'contract requests reviewer focus')
    addAgent(recommendations, catalog, 'code-reviewer', 'reviewer focus should surface code review')
  }
  if (Array.isArray(contract?.testerFocus) && contract.testerFocus.length > 0) {
    addSkill(recommendations, catalog, 'verification-loop', 'contract requests tester focus')
    addAgent(recommendations, catalog, 'tdd-guide', 'tester focus should surface test guidance')
  }
  if (Array.isArray(contract?.advisor) && contract.advisor.length > 0) {
    addSkill(recommendations, catalog, 'architecture-design', 'advisor constraints imply design guidance')
    addAgent(recommendations, catalog, 'architect', 'advisor constraints imply architectural review')
  }
  if (Array.isArray(contract?.allowedFiles) && contract.allowedFiles.some((file) => /\.(tsx|jsx|css|html)$/.test(file))) {
    addSkill(recommendations, catalog, 'frontend-design', 'allowed files include UI assets')
    addSkill(recommendations, catalog, 'web-design-reviewer', 'allowed files include UI assets')
  }
  addEvolutionSkillRecommendations(recommendations, catalog, selection, contract, route, cwd)

  return {
    route,
    planId: contract?.planId || '',
    recommendations,
  }
}

function readStateMeta(statePath) {
  if (!pathExists(statePath)) return {}
  return parseFrontmatter(readJsonAsText(statePath)).meta
}

function readActiveContract(storageRoot, args) {
  const explicitPlanId = String(args.getFlag('--plan-id', '')).trim()
  if (explicitPlanId) {
    return readJson(join(storageRoot, 'plans', explicitPlanId, 'contract.json'), null)
  }
  const plansRoot = join(storageRoot, 'plans')
  if (!pathExists(plansRoot)) return null
  const candidates = readdirSync(plansRoot)
    .map((entry) => join(plansRoot, entry))
    .filter((entry) => statSync(entry).isDirectory())
    .sort()
    .reverse()
  for (const candidate of candidates) {
    const contract = readJson(join(candidate, 'contract.json'), null)
    if (contract) return contract
  }
  return null
}

function addSkill(recommendations, catalog, skillId, reason) {
  if (!catalog.skillMap.has(skillId) || recommendations.some((entry) => entry.kind === 'skill' && entry.id === skillId)) return
  const entry = catalog.skillMap.get(skillId)
  recommendations.push({
    kind: 'skill',
    id: skillId,
    reason,
    sourceLayer: entry?.sourceLayer || 'repo',
    path: entry?.path || '',
  })
}

function addAgent(recommendations, catalog, agentId, reason) {
  if (!catalog.agentMap.has(agentId) || recommendations.some((entry) => entry.kind === 'agent' && entry.id === agentId)) return
  recommendations.push({ kind: 'agent', id: agentId, reason })
}

function addTool(recommendations, toolId, reason) {
  if (recommendations.some((entry) => entry.kind === 'tool' && entry.id === toolId)) return
  recommendations.push({ kind: 'tool', id: toolId, reason })
}

function readJsonAsText(filePath) {
  return readText(filePath, '')
}

function addEvolutionSkillRecommendations(recommendations, catalog, selection, contract, route, cwd) {
  const candidates = readCandidates(getEvolutionPaths(cwd))
    .filter((candidate) => ['applied', 'merged'].includes(candidate.status))
  if (candidates.length === 0) return

  const latestBySkill = new Map()
  for (const candidate of candidates) {
    const skillId = String(candidate.decision?.targetSkillId || '').trim()
    if (!skillId || latestBySkill.has(skillId)) continue
    latestBySkill.set(skillId, candidate)
  }

  const contextTokens = tokenizeContract(contract)
  const candidateSkillIds = new Set([
    ...selection.skills.filter((skillId) => catalog.skillMap.get(skillId)?.dynamic),
    ...latestBySkill.keys(),
  ])

  for (const skillId of candidateSkillIds) {
    const entry = catalog.skillMap.get(skillId)
    const candidate = latestBySkill.get(skillId)
    if (!entry) continue

    const reasons = []
    let score = 0

    if (candidate?.source?.route && candidate.source.route === route && route !== '~auto') {
      score += 2
      reasons.push(`recent evolved skill was captured for route ${route}`)
    }
    if (candidate?.source?.planId && contract?.planId && candidate.source.planId === contract.planId) {
      score += 3
      reasons.push('same plan already produced this reusable skill')
    }

    const overlap = findTokenOverlap(contextTokens, [
      entry.description,
      ...(candidate?.extractedWorkflow || []),
      ...(candidate?.decision?.reason || []),
    ].join(' '))
    if (overlap.length >= 2) {
      score += 2
      reasons.push(`contract overlap: ${overlap.slice(0, 3).join(', ')}`)
    }

    if (selection.explicitSkills.includes(skillId)) {
      score += 1
      reasons.push('skill is already in the active explicit selection')
    }
    if (entry.sourceLayer === 'overlay') {
      score += 1
      reasons.push('local overlay variant is available')
    }

    if (score >= 2) {
      addSkill(recommendations, catalog, skillId, reasons.join('; '))
    }
  }
}

function tokenizeContract(contract) {
  const parts = [
    contract?.title || '',
    contract?.route || '',
    contract?.tier || '',
    ...(contract?.reviewerFocus || []),
    ...(contract?.testerFocus || []),
    ...(contract?.advisor || []),
    ...(contract?.allowedFiles || []),
  ]
  return tokenize(parts.join(' '))
}

function findTokenOverlap(baseTokens, text) {
  const other = new Set(tokenize(text))
  return [...baseTokens].filter((token) => other.has(token))
}

function tokenize(text) {
  return [...new Set(String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3))]
}
