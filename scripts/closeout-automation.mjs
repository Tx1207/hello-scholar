import { readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { detectInstalledScope, getRuntimeContext, loadInstallState, loadUserConfig } from './install/cli-config.mjs'
import { loadCatalog } from './profile/catalog-loader.mjs'
import { pathExists, readJson } from './cli-utils.mjs'
import { runDeliveryGate } from './delivery-gate.mjs'
import { resolveProjectStorage } from './project-storage.mjs'
import { loadSelectionState } from './profile/selection-state.mjs'
import { reviewSkillEvolution } from './evolution/skill-evolution-review.mjs'
import { getEvolutionPaths, readCandidates } from './evolution/skill-evolution-store.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const CLOSEABLE_STATUSES = new Set(['done', 'closed'])
const ELIGIBLE_ROUTES = new Set(['~build', '~verify', '~plan'])

export function runCloseoutAutomation(cwd, args, record) {
  const context = loadAutomationContext(cwd, args, record)
  const notes = []
  const deliveryGate = runGateIfNeeded(cwd, context, notes)
  const review = runReviewIfNeeded(cwd, context, deliveryGate, notes)
  return {
    ran: deliveryGate.ran || review.ran,
    deliveryGate,
    review,
    notes,
  }
}

function loadAutomationContext(cwd, args, record) {
  const runtime = getRuntimeContext(pkgRoot)
  const scope = detectInstalledScope(runtime, cwd)
  const userConfig = loadUserConfig(runtime, cwd, scope)
  const installState = loadInstallState(runtime, cwd, scope).state
  const catalog = loadCatalog(pkgRoot, { dynamic: true, cwd, runtime })
  const selection = loadSelectionState(catalog, installState, userConfig, runtime, { cwd, scope })
  const storage = resolveProjectStorage(cwd)
  const explicitPlanId = String(args.getFlag('--plan-id', '')).trim()
  const explicitTargetId = String(args.getFlag('--target-id', '')).trim()
  const contractMatch = resolveContract(storage.rootPath, explicitPlanId)
  const contract = contractMatch?.contract || null
  const planId = explicitPlanId || contract?.planId || ''
  const targetId = explicitTargetId || planId
  const route = String(contract?.route || record.meta?.route || '~build').trim() || '~build'
  const actualChangeCount = (record.actualChanges || []).reduce((count, entry) => count + entry.items.length, 0)
  const substantial =
    (record.meta?.affected_files || []).length >= 2 ||
    actualChangeCount >= 2 ||
    (record.verification || []).length >= 1

  return {
    runtime,
    scope,
    selection,
    storage,
    record,
    contract,
    contractPath: contractMatch?.contractPath || '',
    planId,
    targetId,
    route,
    substantial,
    status: String(record.meta?.status || '').trim(),
    deliveryGateAllowed: !args.hasFlag('--skip-delivery-gate') && !args.hasFlag('--skip-closeout-automation'),
    reviewAllowed: !args.hasFlag('--skip-skill-evolution-review') && !args.hasFlag('--skip-closeout-automation'),
  }
}

function runGateIfNeeded(cwd, context, notes) {
  if (!CLOSEABLE_STATUSES.has(context.status)) {
    notes.push(`Skipped delivery gate: closeout status ${context.status || 'unknown'} is not final.`)
    return { ran: false, skipped: 'status-not-final', overall: null, targetId: context.targetId }
  }
  if (!context.deliveryGateAllowed) {
    notes.push('Skipped delivery gate: disabled by closeout flags.')
    return { ran: false, skipped: 'disabled', overall: null, targetId: context.targetId }
  }
  if (!context.contract || !context.targetId) {
    notes.push('Skipped delivery gate: missing contract or target id.')
    return { ran: false, skipped: 'missing-contract', overall: null, targetId: context.targetId }
  }

  const payload = runDeliveryGate(cwd, buildArgs({
    '--target-id': context.targetId,
    '--plan-id': context.planId || context.targetId,
    '--contract': context.contractPath,
  }))
  notes.push(`Delivery gate: ${payload.overall ? 'PASS' : 'FAIL'} for ${context.targetId}.`)
  return {
    ran: true,
    skipped: '',
    overall: payload.overall,
    targetId: context.targetId,
    checks: payload.checks,
  }
}

function runReviewIfNeeded(cwd, context, deliveryGate, notes) {
  if (!CLOSEABLE_STATUSES.has(context.status)) {
    notes.push(`Skipped skill evolution review: closeout status ${context.status || 'unknown'} is not final.`)
    return { ran: false, skipped: 'status-not-final', candidateId: '' }
  }
  if (!context.reviewAllowed) {
    notes.push('Skipped skill evolution review: disabled by closeout flags.')
    return { ran: false, skipped: 'disabled', candidateId: '' }
  }
  if (!context.contract) {
    notes.push('Skipped skill evolution review: no active contract found.')
    return { ran: false, skipped: 'missing-contract', candidateId: '' }
  }
  if (!ELIGIBLE_ROUTES.has(context.route)) {
    notes.push(`Skipped skill evolution review: route ${context.route} is not eligible.`)
    return { ran: false, skipped: 'route-ineligible', candidateId: '' }
  }
  if (!context.substantial) {
    notes.push('Skipped skill evolution review: change is too small for durable skill extraction.')
    return { ran: false, skipped: 'not-substantial', candidateId: '' }
  }
  if (deliveryGate.ran && deliveryGate.overall !== true) {
    notes.push('Skipped skill evolution review: delivery gate did not pass.')
    return { ran: false, skipped: 'delivery-gate-failed', candidateId: '' }
  }
  if (!(context.contract.skillEvolution?.enabled === true || hasSkillEvolutionCapability(context.selection))) {
    notes.push('Skipped skill evolution review: meta-builder is inactive and contract did not opt in.')
    return { ran: false, skipped: 'policy-disabled', candidateId: '' }
  }
  if (hasExistingCandidateForChange(cwd, context.record.id)) {
    notes.push(`Skipped skill evolution review: candidate already exists for ${context.record.id}.`)
    return { ran: false, skipped: 'candidate-exists', candidateId: '' }
  }

  const payload = reviewSkillEvolution(cwd, buildArgs({
    '--change-id': context.record.id,
    '--plan-id': context.planId,
    '--target-id': context.targetId,
  }))
  notes.push(`Skill evolution review: ${payload.candidate.action} -> ${payload.candidate.targetSkillId || 'N/A'}.`)
  return {
    ran: true,
    skipped: '',
    candidateId: payload.candidate.id,
    action: payload.candidate.action,
    targetSkillId: payload.candidate.targetSkillId,
    status: payload.candidate.status,
  }
}

function resolveContract(storageRoot, explicitPlanId) {
  if (explicitPlanId) {
    const contractPath = join(storageRoot, 'plans', explicitPlanId, 'contract.json')
    return {
      contractPath,
      contract: readJson(contractPath, null),
    }
  }

  const plansRoot = join(storageRoot, 'plans')
  if (!pathExists(plansRoot)) return null

  const candidates = readdirSync(plansRoot)
    .map((entry) => join(plansRoot, entry))
    .filter((entry) => statSync(entry).isDirectory())
    .sort()
    .reverse()

  for (const candidate of candidates) {
    const contractPath = join(candidate, 'contract.json')
    const contract = readJson(contractPath, null)
    if (contract) {
      return { contractPath, contract }
    }
  }

  return null
}

function hasExistingCandidateForChange(cwd, changeId) {
  return readCandidates(getEvolutionPaths(cwd)).some((candidate) => candidate.source?.changeId === changeId)
}

function hasSkillEvolutionCapability(selection = {}) {
  const skills = selection.skills || []
  return skills.includes('skill-development') || skills.includes('skill-improver') || skills.includes('skill-quality-reviewer')
}

function buildArgs(flags) {
  const store = new Map()
  for (const [key, value] of Object.entries(flags)) {
    if (value === undefined || value === null || value === '') continue
    store.set(key, [value])
  }
  return {
    positionals: [],
    hasFlag(name) {
      return store.has(name)
    },
    getFlag(name, fallback = '') {
      return store.has(name) ? store.get(name).at(-1) : fallback
    },
    getList(name) {
      return store.has(name) ? [...store.get(name)] : []
    },
  }
}
