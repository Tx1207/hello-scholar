import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { formatDate, renderBullets } from '../change-tracker-utils.mjs'
import { ensureDir, pathExists, readJson, writeJson, writeText } from '../cli-utils.mjs'
import { resolveProjectStorage } from '../project-storage.mjs'

export function getEvolutionPaths(cwd) {
  const storage = resolveProjectStorage(cwd)
  const root = join(storage.rootPath, 'evolution')
  return {
    cwd,
    storage,
    root,
    candidatesRoot: join(root, 'candidates'),
    indexPath: join(root, 'INDEX.md'),
  }
}

export function ensureEvolutionRoots(paths) {
  ensureDir(paths.root)
  ensureDir(paths.candidatesRoot)
}

export function readCandidates(paths) {
  if (!pathExists(paths.candidatesRoot)) return []

  const candidates = []
  for (const entry of readdirSync(paths.candidatesRoot)) {
    const candidateRoot = join(paths.candidatesRoot, entry)
    if (!statSync(candidateRoot).isDirectory()) continue
    const candidate = readCandidate(paths, entry)
    if (candidate) candidates.push(candidate)
  }

  return candidates.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}

export function readCandidate(paths, candidateId) {
  const candidateRoot = join(paths.candidatesRoot, candidateId)
  const candidatePath = join(candidateRoot, 'candidate.json')
  const stored = readJson(candidatePath, null)
  if (!stored) return null

  return {
    ...stored,
    filePath: candidatePath,
    file: relative(paths.cwd, candidatePath).replace(/\\/g, '/'),
    reviewPath: join(candidateRoot, 'review.md'),
    reviewFile: relative(paths.cwd, join(candidateRoot, 'review.md')).replace(/\\/g, '/'),
    evidenceLinksPath: join(candidateRoot, 'evidence-links.json'),
    evidenceLinksFile: relative(paths.cwd, join(candidateRoot, 'evidence-links.json')).replace(/\\/g, '/'),
    patchPlanPath: join(candidateRoot, 'patch-plan.md'),
    patchPlanFile: relative(paths.cwd, join(candidateRoot, 'patch-plan.md')).replace(/\\/g, '/'),
    applyReportPath: join(candidateRoot, 'apply-report.md'),
    applyReportFile: relative(paths.cwd, join(candidateRoot, 'apply-report.md')).replace(/\\/g, '/'),
    mergeReportPath: join(candidateRoot, 'merge-report.md'),
    mergeReportFile: relative(paths.cwd, join(candidateRoot, 'merge-report.md')).replace(/\\/g, '/'),
  }
}

export function createCandidate(existingCandidates, input, now = new Date()) {
  const candidateId = nextCandidateId(existingCandidates, now)
  const action = String(input.decision?.action || 'reject').trim() || 'reject'
  const normalizedReasons = normalizeList(input.decision?.reason)
  const extractedWorkflow = normalizeList(input.extractedWorkflow)
  const affectedFiles = normalizeList(input.inputs?.affectedFiles)
  const verification = normalizeList(input.inputs?.verification)

  return {
    id: candidateId,
    status: String(input.status || (action === 'reject' ? 'rejected' : 'proposed')).trim(),
    source: {
      changeId: String(input.source?.changeId || '').trim(),
      planId: String(input.source?.planId || '').trim(),
      route: String(input.source?.route || '~build').trim() || '~build',
      tier: String(input.source?.tier || 'T1').trim() || 'T1',
    },
    decision: {
      action,
      targetSkillId: String(input.decision?.targetSkillId || '').trim(),
      confidence: Number(input.decision?.confidence || 0),
      reason: normalizedReasons,
    },
    inputs: {
      affectedFiles,
      verification,
      evidenceTargetId: String(input.inputs?.evidenceTargetId || '').trim(),
    },
    policy: {
      requiresApproval: input.policy?.requiresApproval !== false,
      requiresEvidence: input.policy?.requiresEvidence !== false,
      minEvidenceCount: Number(input.policy?.minEvidenceCount || 1),
    },
    review: {
      policyEnabled: Boolean(input.review?.policyEnabled),
      routeEligible: Boolean(input.review?.routeEligible),
      substantial: Boolean(input.review?.substantial),
      evidenceSatisfied: Boolean(input.review?.evidenceSatisfied),
      activeBundles: normalizeList(input.review?.activeBundles),
      activeSkills: normalizeList(input.review?.activeSkills),
    },
    extractedWorkflow,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

export function writeCandidate(paths, candidate, artifacts = {}) {
  ensureEvolutionRoots(paths)
  const candidateRoot = join(paths.candidatesRoot, candidate.id)
  ensureDir(candidateRoot)

  writeJson(join(candidateRoot, 'candidate.json'), stripCandidateRuntimeFields(candidate))
  writeJson(join(candidateRoot, 'evidence-links.json'), {
    changeId: String(artifacts.links?.changeId || '').trim(),
    changeFile: String(artifacts.links?.changeFile || '').trim(),
    planId: String(artifacts.links?.planId || '').trim(),
    contractPath: String(artifacts.links?.contractPath || '').trim(),
    evidenceTargetId: String(artifacts.links?.evidenceTargetId || '').trim(),
    evidenceRoot: String(artifacts.links?.evidenceRoot || '').trim(),
    scope: String(artifacts.links?.scope || '').trim(),
    modulesPath: String(artifacts.links?.modulesPath || '').trim(),
  })

  if (artifacts.reviewText) {
    writeText(join(candidateRoot, 'review.md'), `${String(artifacts.reviewText).trimEnd()}\n`)
  }
  if (artifacts.patchPlanText) {
    writeText(join(candidateRoot, 'patch-plan.md'), `${String(artifacts.patchPlanText).trimEnd()}\n`)
  }
  if (artifacts.applyReportText) {
    writeText(join(candidateRoot, 'apply-report.md'), `${String(artifacts.applyReportText).trimEnd()}\n`)
  }
  if (artifacts.mergeReportText) {
    writeText(join(candidateRoot, 'merge-report.md'), `${String(artifacts.mergeReportText).trimEnd()}\n`)
  }

  writeIndex(paths)
  return readCandidate(paths, candidate.id)
}

export function writeIndex(paths) {
  ensureEvolutionRoots(paths)
  const candidates = readCandidates(paths)
  const lines = [
    '# hello-scholar Skill Evolution Index',
    '',
    `- Updated: \`${new Date().toISOString()}\``,
    `- Candidates: \`${candidates.length}\``,
    '',
    '## Recent Candidates',
    '',
  ]

  if (candidates.length === 0) {
    lines.push('- No candidates recorded.')
  } else {
    for (const candidate of candidates) {
      const targetSkill = candidate.decision.targetSkillId || 'N/A'
      lines.push(
        `- [${candidate.id}](candidates/${candidate.id}/review.md) | \`${candidate.status}\` | \`${candidate.decision.action}\` | \`${targetSkill}\` | \`${candidate.updatedAt}\``,
      )
    }
  }

  writeText(paths.indexPath, `${lines.join('\n').trimEnd()}\n`)
}

export function renderWorkflowSummary(items) {
  return renderBullets(normalizeList(items))
}

function nextCandidateId(existingCandidates, now) {
  const stamp = formatDate(now).replaceAll('-', '')
  const todays = existingCandidates.filter((candidate) => candidate.id.startsWith(`skill-evo-${stamp}`)).length + 1
  return `skill-evo-${stamp}-${String(todays).padStart(3, '0')}`
}

function normalizeList(values) {
  return [...new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean))]
}

function stripCandidateRuntimeFields(candidate) {
  return {
    id: candidate.id,
    status: candidate.status,
    source: candidate.source,
    decision: candidate.decision,
    inputs: candidate.inputs,
    policy: candidate.policy,
    review: candidate.review,
    preview: candidate.preview,
    approval: candidate.approval,
    apply: candidate.apply,
    merge: candidate.merge,
    reset: candidate.reset,
    state: candidate.state,
    extractedWorkflow: candidate.extractedWorkflow,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  }
}
