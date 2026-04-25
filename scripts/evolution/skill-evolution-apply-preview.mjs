import { createHash } from 'node:crypto'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { parseFrontmatter } from '../change-tracker-utils.mjs'
import { copyTree, ensureDir, pathExists, readText, writeText } from '../cli-utils.mjs'
import { renderCreatedSkill, renderLocalEvolutionReference, renderUpdatedSkill } from './skill-evolution-apply-render.mjs'


export function buildPreview(context) {
  const currentSkillText = pathExists(join(context.overlaySkillRoot, 'SKILL.md'))
    ? readText(join(context.overlaySkillRoot, 'SKILL.md'), '')
    : readText(join(context.repoSkillRoot, 'SKILL.md'), '')
  const proposedSkillText = context.candidate.decision.action === 'create'
    ? renderCreatedSkill(context)
    : renderUpdatedSkill(context, currentSkillText)
  const existingSkillComparison = buildExistingSkillComparison(context, currentSkillText)
  const availableDecisions = buildAvailableDecisions(context)
  const recommendedDecision = context.candidate.decision.action === 'create'
    ? 'apply-overlay'
    : 'apply-overlay'
  const previewBody = JSON.stringify({
    candidateId: context.candidate.id,
    targetSkillId: context.candidate.decision.targetSkillId,
    action: context.candidate.decision.action,
    overlaySkillRoot: context.overlaySkillRoot,
    repoSkillRoot: context.repoSkillRoot,
    currentSkillText,
    proposedSkillText,
    existingSkillComparison,
    availableDecisions,
  })
  return {
    hash: hashText(previewBody),
    currentSkillText,
    proposedSkillText,
    existingSkillComparison,
    availableDecisions,
    recommendedDecision,
  }
}

function buildExistingSkillComparison(context, currentSkillText) {
  const skillId = context.candidate.decision.targetSkillId
  const overlayExists = pathExists(join(context.overlaySkillRoot, 'SKILL.md'))
  const repoExists = pathExists(join(context.repoSkillRoot, 'SKILL.md'))
  const similarSkills = findSimilarRepoSkills(join(context.pkgRoot, 'skills'), skillId)
  const relation = overlayExists
    ? 'An overlay skill with the same name already exists; this candidate will update that overlay copy.'
    : repoExists
      ? 'A repository skill with the same name exists; this candidate will copy it to overlay and apply local evolution notes.'
      : 'No same-name skill exists in overlay or repository; this candidate will create a new overlay skill.'
  return {
    targetSkillId: skillId,
    action: context.candidate.decision.action,
    overlayExists,
    repoExists,
    hasCurrentSkillContent: currentSkillText.trim().length > 0,
    relation,
    similarSkills,
  }
}

function buildAvailableDecisions(context) {
  const candidateRoot = join('hello-scholar', 'evolution', 'candidates', context.candidate.id)
  return [
    {
      decision: 'apply-overlay',
      description: 'Apply the candidate to global overlay skill storage and refresh runtime selection.',
      files: [
        join(context.overlaySkillRoot, 'SKILL.md'),
        join(context.overlaySkillRoot, 'references', 'local-evolution.md'),
        join(candidateRoot, 'candidate.json'),
        join(candidateRoot, 'apply-report.md'),
      ],
    },
    {
      decision: 'keep-candidate',
      description: 'Keep the candidate and preview only; do not create or update any skill.',
      files: [
        join(candidateRoot, 'candidate.json'),
        join(candidateRoot, 'patch-plan.md'),
      ],
    },
    {
      decision: 'reject',
      description: 'Mark this candidate as rejected so it will not be applied later.',
      files: [
        join(candidateRoot, 'candidate.json'),
        join('hello-scholar', 'evolution', 'INDEX.md'),
      ],
    },
    {
      decision: 'merge-repo',
      description: 'Do not use this apply command; use the repo merge flow if the skill should become durable source code.',
      files: [
        join(context.repoSkillRoot, 'SKILL.md'),
        join(context.repoSkillRoot, 'references', 'local-evolution.md'),
        'catalog/skills.json',
      ],
    },
  ]
}

export function validateApproval(candidate, decision, userConfirmation, previewHash) {
  const allowedDecisions = ['apply-overlay', 'keep-candidate', 'reject', 'merge-repo']
  if (!candidate.preview?.hash) {
    throw new Error('approve requires preview to run first')
  }
  if (!allowedDecisions.includes(decision)) {
    throw new Error(`approve requires --decision to be one of: ${allowedDecisions.join(', ')}`)
  }
  if (decision !== 'apply-overlay') {
    throw new Error(`approve for ${decision} is not handled by overlay apply; use the matching decision flow`)
  }
  if (previewHash && previewHash !== candidate.preview.hash) {
    throw new Error('approve preview hash does not match the latest preview')
  }
  if (!isExplicitApplyConfirmation(userConfirmation)) {
    throw new Error('approve requires explicit apply confirmation, not a vague request')
  }
}

export function validateApplyGate(candidate) {
  if (!candidate.preview?.hash) {
    throw new Error('apply requires preview to run first')
  }
  if (!candidate.approval?.approved || candidate.approval.status !== 'approved') {
    throw new Error('apply requires approved candidate from approve command')
  }
  if (candidate.approval.decision !== 'apply-overlay') {
    throw new Error('apply only supports approved decision apply-overlay')
  }
  if (!candidate.approval.previewHash) {
    throw new Error('apply requires approval preview hash')
  }
}

function isExplicitApplyConfirmation(text) {
  const value = String(text || '').trim().toLowerCase()
  if (!value) return false
  const vagueOnly = ['处理', '处理这个skill', '处理这个 skill', '看看', '继续', '可以', '好的', 'ok', 'yes', '执行吧']
  if (vagueOnly.includes(value.replace(/\s+/g, ' '))) return false
  return /确认.*(应用|采用|合并)|(?:应用|采用|合并).*(?:candidate|skill|候选|这个)|\b(apply|adopt|merge)\b/.test(value)
}

export function summarizePreview(preview) {
  return {
    hash: preview.hash,
    recommendedDecision: preview.recommendedDecision,
    existingSkillComparison: preview.existingSkillComparison,
    availableDecisions: preview.availableDecisions,
  }
}

export function materializeOverlaySkill(context) {
  const { candidate, overlaySkillRoot, repoSkillRoot } = context
  ensureDir(context.overlayPaths.overlaySkillsRoot)

  let sourceLayer = 'new'
  if (pathExists(overlaySkillRoot)) {
    sourceLayer = 'overlay'
  } else if (pathExists(repoSkillRoot)) {
    copyTree(repoSkillRoot, overlaySkillRoot)
    sourceLayer = 'repo'
  } else {
    ensureDir(overlaySkillRoot)
  }

  const referencesRoot = join(overlaySkillRoot, 'references')
  ensureDir(referencesRoot)
  const evolutionReferencePath = join(referencesRoot, 'local-evolution.md')
  const skillMdPath = join(overlaySkillRoot, 'SKILL.md')

  const referenceText = renderLocalEvolutionReference(context)
  const skillText = candidate.decision.action === 'create'
    ? renderCreatedSkill(context)
    : renderUpdatedSkill(context, readText(skillMdPath, ''))

  writeText(evolutionReferencePath, `${referenceText.trimEnd()}\n`)
  writeText(skillMdPath, `${skillText.trimEnd()}\n`)

  return {
    sourceLayer,
    touchedFiles: [
      relativeOverlayPath(overlaySkillRoot, skillMdPath),
      relativeOverlayPath(overlaySkillRoot, evolutionReferencePath),
    ],
  }
}

export function runIntegrityChecks(skillRoot, skillId) {
  const checks = []
  const skillMdPath = join(skillRoot, 'SKILL.md')
  const skillText = readText(skillMdPath, '')
  const frontmatter = parseFrontmatter(skillText).meta

  checks.push({
    name: 'skill_md_exists',
    pass: pathExists(skillMdPath),
    detail: skillMdPath,
  })
  checks.push({
    name: 'frontmatter_name_present',
    pass: String(frontmatter.name || '').trim().length > 0,
    detail: String(frontmatter.name || ''),
  })
  checks.push({
    name: 'frontmatter_name_matches_dir',
    pass: String(frontmatter.name || '').trim() === skillId,
    detail: `${frontmatter.name || ''} -> ${skillId}`,
  })
  checks.push({
    name: 'frontmatter_description_present',
    pass: String(frontmatter.description || '').trim().length > 0,
    detail: String(frontmatter.description || ''),
  })

  const referencedPaths = collectReferencedPaths(skillText)
  for (const referencedPath of referencedPaths) {
    checks.push({
      name: `reference_exists:${referencedPath}`,
      pass: pathExists(join(skillRoot, referencedPath)),
      detail: referencedPath,
    })
  }

  return checks
}

function findSimilarRepoSkills(rootPath, skillId) {
  if (!pathExists(rootPath)) return []
  const targetTokens = tokenizeSkillId(skillId)
  const matches = []
  collectRepoSkillIds(rootPath, matches)
  return matches
    .filter((candidateSkillId) => candidateSkillId !== skillId)
    .filter((candidateSkillId) => {
      const candidateTokens = tokenizeSkillId(candidateSkillId)
      return candidateTokens.some((token) => targetTokens.includes(token))
    })
    .slice(0, 8)
}

function collectRepoSkillIds(rootPath, matches) {
  for (const entry of readdirSync(rootPath)) {
    const entryPath = join(rootPath, entry)
    if (!statSync(entryPath).isDirectory()) continue
    if (pathExists(join(entryPath, 'SKILL.md'))) matches.push(entry)
    collectRepoSkillIds(entryPath, matches)
  }
}

function tokenizeSkillId(skillId) {
  return String(skillId || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4)
}

function hashText(text) {
  return createHash('sha256').update(String(text)).digest('hex')
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function collectReferencedPaths(skillText) {
  const matches = skillText.match(/(?:references|examples|scripts|assets)\/[A-Za-z0-9._/-]+/g) || []
  return [...new Set(matches)]
}

function relativeOverlayPath(skillRoot, filePath) {
  return filePath.slice(skillRoot.length + 1).replace(/\\/g, '/')
}
