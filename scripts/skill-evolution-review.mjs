import { readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { detectInstalledScope, getRuntimeContext, loadInstallState, loadUserConfig } from './cli-config.mjs'
import { loadCatalog } from './catalog-loader.mjs'
import { mergeUnique, renderBullets, slugify } from './change-tracker-utils.mjs'
import { parseArgv, pathExists, readJson, readText } from './cli-utils.mjs'
import { getPaths, loadWorkspace } from './change-tracker-store.mjs'
import { readEvidenceBundle } from './evidence-store.mjs'
import { resolveProjectStorage } from './project-storage.mjs'
import { loadSelectionState } from './selection-state.mjs'
import {
  createCandidate,
  ensureEvolutionRoots,
  getEvolutionPaths,
  readCandidate,
  readCandidates,
  renderWorkflowSummary,
  writeCandidate,
} from './skill-evolution-store.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'review'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  const asJson = args.hasFlag('--json')

  try {
    const result = runCommand(command, cwd, args)
    emit(result, asJson)
  } catch (error) {
    emitError(error, asJson)
    process.exitCode = 1
  }
}

function runCommand(command, cwd, args) {
  if (command === 'review') return reviewSkillEvolution(cwd, args)
  if (command === 'status') return readSkillEvolutionStatus(cwd, args)
  throw new Error(`Unknown skill-evolution command: ${command}`)
}

export function reviewSkillEvolution(cwd, args) {
  const paths = getEvolutionPaths(cwd)
  ensureEvolutionRoots(paths)

  const reviewInput = loadReviewInput(cwd, args)
  const decision = analyzeCandidate(reviewInput, args)
  const candidate = createCandidate(readCandidates(paths), {
    status: decision.action === 'reject' ? 'rejected' : 'proposed',
    source: {
      changeId: reviewInput.change.id,
      planId: reviewInput.contract?.planId || '',
      route: reviewInput.route,
      tier: reviewInput.tier,
    },
    decision: {
      action: decision.action,
      targetSkillId: decision.targetSkillId,
      confidence: decision.confidence,
      reason: decision.reasons,
    },
    inputs: {
      affectedFiles: reviewInput.change.meta.affected_files || [],
      verification: reviewInput.change.verification || [],
      evidenceTargetId: reviewInput.evidence.targetId || '',
    },
    policy: {
      requiresApproval: true,
      requiresEvidence: reviewInput.requiresEvidence,
      minEvidenceCount: reviewInput.minEvidenceCount,
    },
    review: {
      policyEnabled: reviewInput.policyEnabled,
      routeEligible: reviewInput.routeEligible,
      substantial: reviewInput.substantial,
      evidenceSatisfied: reviewInput.evidenceSatisfied,
      activeBundles: reviewInput.selection.bundles,
      activeSkills: reviewInput.selection.skills,
    },
    extractedWorkflow: decision.workflow,
  })

  const saved = writeCandidate(paths, candidate, {
    reviewText: renderReviewMarkdown(candidate, reviewInput, decision),
    links: {
      changeId: reviewInput.change.id,
      changeFile: reviewInput.change.file,
      planId: reviewInput.contract?.planId || '',
      contractPath: reviewInput.contractPath,
      evidenceTargetId: reviewInput.evidence.targetId || '',
      evidenceRoot: reviewInput.evidenceRoot,
      scope: reviewInput.scope,
      modulesPath: reviewInput.modulesPath,
    },
  })

  return {
    ok: true,
    action: 'review',
    candidate: {
      id: saved.id,
      status: saved.status,
      action: saved.decision.action,
      targetSkillId: saved.decision.targetSkillId,
      confidence: saved.decision.confidence,
      file: saved.file,
      reviewFile: saved.reviewFile,
    },
    notes: buildNotes(reviewInput, decision),
  }
}

export function readSkillEvolutionStatus(cwd, args) {
  const candidateId = String(args.getFlag('--candidate-id', '')).trim()
  if (!candidateId) throw new Error('--candidate-id is required')
  const candidate = readCandidate(getEvolutionPaths(cwd), candidateId)
  if (!candidate) throw new Error(`Unknown candidate id: ${candidateId}`)

  return {
    ok: true,
    action: 'status',
    candidate: {
      id: candidate.id,
      status: candidate.status,
      action: candidate.decision.action,
      targetSkillId: candidate.decision.targetSkillId,
      confidence: candidate.decision.confidence,
      file: candidate.file,
      reviewFile: candidate.reviewFile,
    },
    notes: candidate.decision.reason,
  }
}

function loadReviewInput(cwd, args) {
  const change = resolveChange(cwd, args)
  const { contract, contractPath } = resolveContract(cwd, args)
  const { runtime, scope, modulesPath, selection } = resolveSelection(cwd)
  const route = String(contract?.route || change.meta.route || '~auto').trim() || '~auto'
  const tier = String(contract?.tier || change.meta.tier || 'T1').trim() || 'T1'
  const evidenceTargetId = String(args.getFlag('--target-id', contract?.planId || '')).trim()
  const evidence = evidenceTargetId ? readEvidenceBundle(cwd, evidenceTargetId) : { targetId: '', updatedAt: '', entries: [] }
  const evidenceRoot = evidenceTargetId ? join(resolveProjectStorage(cwd).rootPath, 'evidence', evidenceTargetId) : ''
  const requiresEvidence = contract?.deliveryGate?.requiresEvidence !== false
  const minEvidenceCount = Number(contract?.deliveryGate?.minEvidenceCount || 1)
  const activeText = [
    change.title,
    ...change.userRequests.flatMap((entry) => entry.items),
    ...change.actualChanges.flatMap((entry) => entry.items),
    ...change.result,
  ].join('\n')
  const substantial = isSubstantialChange(change, evidence)
  const routeEligible = ['~build', '~verify', '~plan'].includes(route)
  const policyEnabled = contract?.skillEvolution?.enabled === true || selection.bundles.includes('meta-builder')
  const evidenceSatisfied = !requiresEvidence || evidence.entries.length >= minEvidenceCount

  return {
    cwd,
    runtime,
    scope,
    modulesPath,
    selection,
    change,
    contract,
    contractPath,
    route,
    tier,
    evidence,
    evidenceRoot,
    requiresEvidence,
    minEvidenceCount,
    policyEnabled,
    routeEligible,
    substantial,
    evidenceSatisfied,
    activeText,
  }
}

function resolveChange(cwd, args) {
  const explicitId = String(args.getFlag('--change-id', '')).trim()
  const workspace = loadWorkspace(getPaths(cwd))
  if (workspace.records.length === 0) {
    throw new Error('No change records found. Run change-tracker first.')
  }

  if (explicitId) {
    const matched = workspace.records.find((record) => record.id === explicitId)
    if (!matched) throw new Error(`Unknown change id: ${explicitId}`)
    return matched
  }

  return workspace.records[0]
}

function resolveContract(cwd, args) {
  const storage = resolveProjectStorage(cwd)
  const explicitPlanId = String(args.getFlag('--plan-id', '')).trim()
  if (explicitPlanId) {
    const contractPath = join(storage.rootPath, 'plans', explicitPlanId, 'contract.json')
    return {
      contract: readJson(contractPath, null),
      contractPath,
    }
  }

  const plansRoot = join(storage.rootPath, 'plans')
  if (!pathExists(plansRoot)) return { contract: null, contractPath: '' }

  const candidates = readdirSync(plansRoot)
    .map((entry) => join(plansRoot, entry))
    .filter((entry) => statSync(entry).isDirectory())
    .sort()
    .reverse()
  for (const candidate of candidates) {
    const contractPath = join(candidate, 'contract.json')
    const contract = readJson(contractPath, null)
    if (contract) return { contract, contractPath }
  }

  return { contract: null, contractPath: '' }
}

function resolveSelection(cwd) {
  const runtime = getRuntimeContext(pkgRoot)
  const scope = detectInstalledScope(runtime, cwd)
  const userConfig = loadUserConfig(runtime, cwd, scope)
  const installState = loadInstallState(runtime, cwd, scope).state
  const catalog = loadCatalog(pkgRoot, { dynamic: true, cwd, runtime })
  const selection = loadSelectionState(catalog, installState, userConfig, runtime, { cwd, scope })
  const modulesPath = scope === 'global'
    ? join(runtime.scholarHome, 'modules.json')
    : join(cwd, '.hello-scholar', 'modules.json')

  return {
    runtime,
    scope,
    modulesPath,
    selection,
    catalog,
  }
}

function analyzeCandidate(input, args) {
  const explicitAction = String(args.getFlag('--action', '')).trim()
  const explicitSkillId = String(args.getFlag('--proposed-skill-id', '')).trim()
  const matchedSkillId = detectExistingSkillTarget(input.change.meta.affected_files || [], input.activeText, input.selection.skills)
  const targetSkillId = explicitSkillId || matchedSkillId || deriveSkillId(input.change, input.contract)
  const reasons = []
  const workflow = extractWorkflow(input.change, input.evidence)

  if (!input.policyEnabled) reasons.push('meta-builder 未激活，且 contract 未显式启用 skillEvolution')
  if (!input.routeEligible) reasons.push(`当前 route ${input.route} 不在允许范围内`)
  if (!input.substantial) reasons.push('当前 change 规模过小，暂不建议沉淀 skill')
  if (!input.evidenceSatisfied) reasons.push(`evidence 数量不足，至少需要 ${input.minEvidenceCount} 条`)

  if (explicitAction) {
    reasons.push(`操作由显式参数覆盖：${explicitAction}`)
    return {
      action: explicitAction,
      targetSkillId: explicitAction === 'reject' ? '' : targetSkillId,
      confidence: explicitAction === 'reject' ? 0.1 : 0.95,
      reasons,
      workflow,
    }
  }

  if (!input.policyEnabled || !input.routeEligible || !input.substantial || !input.evidenceSatisfied) {
    return {
      action: 'reject',
      targetSkillId: '',
      confidence: 0.18,
      reasons,
      workflow,
    }
  }

  if (matchedSkillId) {
    reasons.push(`识别到现有 skill 目标：${matchedSkillId}`)
    reasons.push('本次 change 与已有 skill 语义重合，优先建议 update')
    return {
      action: 'update',
      targetSkillId,
      confidence: 0.82,
      reasons,
      workflow,
    }
  }

  reasons.push('未命中现有 skill，建议先以 review candidate 形式创建新 skill')
  reasons.push('本次 change 具备 route、规模和 evidence 条件')
  return {
    action: 'create',
    targetSkillId,
    confidence: 0.64,
    reasons,
    workflow,
  }
}

function detectExistingSkillTarget(files, activeText, activeSkillIds) {
  for (const file of files) {
    const match = String(file).match(/^skills\/([^/]+)\//)
    if (match) return match[1]
  }

  for (const skillId of activeSkillIds) {
    if (activeText.includes(skillId)) return skillId
  }

  return ''
}

function deriveSkillId(change, contract) {
  const base = slugify(contract?.title || change.slug || change.title || '')
  return base || 'skill-evolution-candidate'
}

function extractWorkflow(change, evidence) {
  const actualChanges = change.actualChanges.flatMap((entry) => entry.items)
  const resultItems = change.result || []
  const verification = (change.verification || []).map((item) => `验证：${item}`)
  const evidenceItems = evidence.entries.map((entry) => `${entry.kind || 'manual'}: ${entry.summary || 'N/A'}`)
  return mergeUnique([], [...actualChanges, ...resultItems, ...verification, ...evidenceItems]).slice(0, 8)
}

function isSubstantialChange(change, evidence) {
  const actualChangeCount = change.actualChanges.reduce((count, entry) => count + entry.items.length, 0)
  return (change.meta.affected_files || []).length >= 2 ||
    actualChangeCount >= 2 ||
    (change.verification || []).length >= 1 ||
    evidence.entries.length >= 1
}

function renderReviewMarkdown(candidate, input, decision) {
  const templatePath = join(pkgRoot, 'templates', 'skill-evolution-review.md')
  const fallback = [
    '# Skill Evolution Review: {{candidate_id}}',
    '',
    '- Status: `{{status}}`',
    '- Action: `{{action}}`',
    '- Target Skill: `{{target_skill}}`',
    '- Confidence: `{{confidence}}`',
    '- Source Change: `{{change_id}}`',
    '- Source Plan: `{{plan_id}}`',
    '- Route/Tier: `{{route}}` / `{{tier}}`',
    '- Evidence Target: `{{evidence_target}}`',
    '',
    '## Review Summary',
    '',
    '{{reasons}}',
    '',
    '## Extracted Workflow',
    '',
    '{{workflow}}',
    '',
    '## Context Snapshot',
    '',
    '- Active Bundles: {{bundles}}',
    '- Active Skills: {{active_skills}}',
    '- Affected Files: {{files}}',
    '- Verification Items: {{verification_count}}',
    '- Evidence Count: {{evidence_count}}',
  ].join('\n')
  const template = readText(templatePath, fallback)
  const values = {
    candidate_id: candidate.id,
    status: candidate.status,
    action: candidate.decision.action,
    target_skill: candidate.decision.targetSkillId || 'N/A',
    confidence: candidate.decision.confidence.toFixed(2),
    change_id: input.change.id,
    plan_id: input.contract?.planId || 'N/A',
    route: input.route,
    tier: input.tier,
    evidence_target: input.evidence.targetId || 'N/A',
    reasons: renderBullets(decision.reasons),
    workflow: renderWorkflowSummary(decision.workflow),
    bundles: input.selection.bundles.length > 0 ? input.selection.bundles.map((value) => `\`${value}\``).join(', ') : '`(none)`',
    active_skills: input.selection.skills.length > 0 ? input.selection.skills.slice(0, 12).map((value) => `\`${value}\``).join(', ') : '`(none)`',
    files: (input.change.meta.affected_files || []).length > 0 ? (input.change.meta.affected_files || []).map((value) => `\`${value}\``).join(', ') : '`(none)`',
    verification_count: String((input.change.verification || []).length),
    evidence_count: String(input.evidence.entries.length),
  }

  return Object.entries(values).reduce(
    (current, [key, value]) => current.replaceAll(`{{${key}}}`, value),
    template,
  )
}

function buildNotes(input, decision) {
  return [
    `Route/Tier: ${input.route} / ${input.tier}`,
    `Scope: ${input.scope}`,
    `Evidence count: ${input.evidence.entries.length}`,
    ...decision.reasons,
  ]
}

function emit(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  console.log('== hello-scholar Skill Evolution ==')
  console.log(`- Action: ${result.action}`)
  console.log(`- Candidate ID: ${result.candidate.id}`)
  console.log(`- Status: ${result.candidate.status}`)
  console.log(`- Decision: ${result.candidate.action}`)
  console.log(`- Target Skill: ${result.candidate.targetSkillId || 'N/A'}`)
  console.log(`- Confidence: ${result.candidate.confidence}`)
  console.log(`- Review File: ${result.candidate.reviewFile}`)
  if (result.notes.length > 0) {
    console.log('- Notes:')
    for (const note of result.notes) {
      console.log(`  - ${note}`)
    }
  }
}

function emitError(error, asJson) {
  const message = error instanceof Error ? error.message : String(error)
  if (asJson) {
    console.error(JSON.stringify({ ok: false, error: message }, null, 2))
    return
  }
  console.error(`skill-evolution failed: ${message}`)
}
