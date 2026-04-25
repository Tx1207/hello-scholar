import { readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getOverlayPaths, getRuntimeContext } from '../install/cli-config.mjs'
import { renderBullets } from '../change-tracker-utils.mjs'
import { parseArgv, pathExists, readText } from '../cli-utils.mjs'
import { activateEvolvedSkill } from './skill-evolution-runtime.mjs'
import { buildPreview, materializeOverlaySkill, runIntegrityChecks, summarizePreview, validateApplyGate, validateApproval } from './skill-evolution-apply-preview.mjs'
import { renderCreatedSkill, renderPatchPlan, renderUpdatedSkill } from './skill-evolution-apply-render.mjs'
import { getEvolutionPaths, readCandidate, writeCandidate } from './skill-evolution-store.mjs'

const pkgRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const EVOLUTION_START = '<!-- HELLO_SCHOLAR EVOLUTION START -->'
const EVOLUTION_END = '<!-- HELLO_SCHOLAR EVOLUTION END -->'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'status'] = args.positionals
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
  if (command === 'plan') return planSkillEvolution(cwd, args)
  if (command === 'preview') return previewSkillEvolution(cwd, args)
  if (command === 'approve') return approveSkillEvolution(cwd, args)
  if (command === 'apply') return applySkillEvolution(cwd, args)
  if (command === 'status') return readSkillEvolutionApplyStatus(cwd, args)
  throw new Error(`Unknown skill-evolution-apply command: ${command}`)
}

export function planSkillEvolution(cwd, args, options = {}) {
  const context = loadApplyContext(cwd, args, options)
  const preview = buildPreview(context)
  const patchPlanText = renderPatchPlan(context, preview)
  writeCandidate(context.evolutionPaths, context.candidate, {
    patchPlanText,
  })

  return {
    ok: true,
    action: 'plan',
    candidate: summarizeCandidate(context.candidate, context.overlaySkillRoot),
    notes: [
      `Overlay skill root: ${context.overlaySkillRoot}`,
      `Patch plan: ${context.patchPlanFile}`,
    ],
  }
}

export function previewSkillEvolution(cwd, args, options = {}) {
  const context = loadApplyContext(cwd, args, options)
  const preview = buildPreview(context)
  const patchPlanText = renderPatchPlan(context, preview)
  const now = new Date().toISOString()
  const nextCandidate = {
    ...context.candidate,
    status: 'previewed',
    preview: {
      status: 'previewed',
      previewedAt: now,
      hash: preview.hash,
      targetLayer: 'overlay',
      recommendedDecision: preview.recommendedDecision,
      existingSkillComparison: preview.existingSkillComparison,
      availableDecisions: preview.availableDecisions,
    },
    approval: {
      approved: false,
      status: 'pending',
      required: true,
    },
    updatedAt: now,
  }
  const saved = writeCandidate(context.evolutionPaths, nextCandidate, {
    patchPlanText,
  })

  return {
    ok: true,
    action: 'preview',
    candidate: summarizeCandidate(saved, context.overlaySkillRoot),
    preview: summarizePreview(preview),
    notes: [
      `Preview hash: ${preview.hash}`,
      `Recommended decision: ${preview.recommendedDecision}`,
      `Patch plan: ${saved.patchPlanFile}`,
      'Explicit approval is required before apply.',
    ],
  }
}

export function approveSkillEvolution(cwd, args, options = {}) {
  const context = loadApplyContext(cwd, args, options)
  const decision = String(args.getFlag('--decision', '')).trim()
  const userConfirmation = String(args.getFlag('--user-confirmation', args.getFlag('--user-request', ''))).trim()
  const previewHash = String(args.getFlag('--preview-hash', '')).trim()
  validateApproval(context.candidate, decision, userConfirmation, previewHash)

  const now = new Date().toISOString()
  const nextCandidate = {
    ...context.candidate,
    status: 'approved',
    approval: {
      approved: true,
      status: 'approved',
      decision,
      approvedAt: now,
      userConfirmation,
      previewHash: context.candidate.preview.hash,
    },
    updatedAt: now,
  }
  const saved = writeCandidate(context.evolutionPaths, nextCandidate)

  return {
    ok: true,
    action: 'approve',
    candidate: summarizeCandidate(saved, context.overlaySkillRoot),
    notes: [
      `Decision: ${decision}`,
      `Preview hash: ${context.candidate.preview.hash}`,
      'Approval recorded; apply may now run.',
    ],
  }
}

export function applySkillEvolution(cwd, args, options = {}) {
  const context = loadApplyContext(cwd, args, options)
  validateApplyGate(context.candidate)

  const preview = buildPreview(context)
  if (preview.hash !== context.candidate.approval.previewHash) {
    throw new Error('apply requires a fresh approval because preview hash changed')
  }
  const patchPlanText = renderPatchPlan(context, preview)
  const applyResult = materializeOverlaySkill(context)
  const integrityChecks = runIntegrityChecks(context.overlaySkillRoot, context.candidate.decision.targetSkillId)
  const failed = integrityChecks.filter((check) => !check.pass)
  if (failed.length > 0) {
    throw new Error(`Integrity checks failed: ${failed.map((check) => check.name).join(', ')}`)
  }

  const now = new Date().toISOString()
  const nextCandidate = {
    ...context.candidate,
    status: 'applied',
    approval: {
      ...context.candidate.approval,
      appliedAt: now,
    },
    apply: {
      status: 'applied',
      targetLayer: 'overlay',
      overlaySkillRoot: context.overlaySkillRoot,
      touchedFiles: applyResult.touchedFiles,
      sourceLayer: applyResult.sourceLayer,
      appliedAt: now,
      integrityChecks,
    },
    updatedAt: now,
  }
  const applyReportText = renderApplyReport(context, applyResult, integrityChecks)
  const saved = writeCandidate(context.evolutionPaths, nextCandidate, {
    patchPlanText,
    applyReportText,
  })
  const activation = activateEvolvedSkill(cwd, context.candidate.decision.targetSkillId, {
    pkgRoot: context.pkgRoot,
    runtime: context.runtime,
  })

  return {
    ok: true,
    action: 'apply',
    candidate: summarizeCandidate(saved, context.overlaySkillRoot),
    notes: [
      `Source layer: ${applyResult.sourceLayer}`,
      `Touched files: ${applyResult.touchedFiles.join(', ')}`,
      `Apply report: ${saved.applyReportFile}`,
      `Approved decision: ${context.candidate.approval.decision}`,
      `User confirmation: ${context.candidate.approval.userConfirmation}`,
      activation.activated
        ? `Selection refreshed in ${activation.scope} scope (${activation.mode})`
        : `Selection refresh skipped: ${activation.reason}`,
    ],
  }
}

export function readSkillEvolutionApplyStatus(cwd, args) {
  const candidateId = String(args.getFlag('--candidate-id', '')).trim()
  if (!candidateId) throw new Error('--candidate-id is required')
  const candidate = readCandidate(getEvolutionPaths(cwd), candidateId)
  if (!candidate) throw new Error(`Unknown candidate id: ${candidateId}`)

  return {
    ok: true,
    action: 'status',
    candidate: summarizeCandidate(candidate, candidate.apply?.overlaySkillRoot || ''),
    notes: [
      `Apply status: ${candidate.apply?.status || 'pending'}`,
      `Preview status: ${candidate.preview?.status || 'missing'}`,
      `Approval status: ${candidate.approval?.status || (candidate.approval?.approved ? 'approved' : 'missing')}`,
      `Patch plan: ${candidate.patchPlanFile}`,
      `Apply report: ${candidate.applyReportFile}`,
    ],
  }
}

function loadApplyContext(cwd, args, options) {
  const evolutionPaths = getEvolutionPaths(cwd)
  const candidateId = String(args.getFlag('--candidate-id', '')).trim()
  if (!candidateId) throw new Error('--candidate-id is required')
  const candidate = readCandidate(evolutionPaths, candidateId)
  if (!candidate) throw new Error(`Unknown candidate id: ${candidateId}`)
  if (!['create', 'update'].includes(candidate.decision.action)) {
    throw new Error(`Candidate action ${candidate.decision.action} cannot be applied`)
  }

  const effectivePkgRoot = resolve(String(options.pkgRoot || pkgRoot))
  const runtime = getRuntimeContext(effectivePkgRoot)
  const overlayPaths = getOverlayPaths(runtime)
  const skillId = candidate.decision.targetSkillId
  if (!skillId) throw new Error('Candidate is missing targetSkillId')

  const overlaySkillRoot = join(overlayPaths.overlaySkillsRoot, skillId)
  const repoSkillRoot = findRepoSkillRoot(join(effectivePkgRoot, 'skills'), skillId) || join(effectivePkgRoot, 'skills', skillId)
  const patchPlanFile = join('hello-scholar', 'evolution', 'candidates', candidate.id, 'patch-plan.md')

  return {
    cwd,
    pkgRoot: effectivePkgRoot,
    runtime,
    overlayPaths,
    evolutionPaths,
    candidate,
    overlaySkillRoot,
    repoSkillRoot,
    patchPlanFile,
  }
}

function renderApplyReport(context, applyResult, integrityChecks) {
  const templatePath = join(context.pkgRoot, 'templates', 'skill-evolution-apply-report.md')
  const fallback = [
    '# Skill Evolution Apply Report: {{candidate_id}}',
    '',
    '- Action: `{{action}}`',
    '- Target Skill: `{{target_skill}}`',
    '- Overlay Root: `{{overlay_root}}`',
    '- Source Layer: `{{source_layer}}`',
    '',
    '## Touched Files',
    '',
    '{{files}}',
    '',
    '## Integrity Checks',
    '',
    '{{checks}}',
  ].join('\n')
  const template = readText(templatePath, fallback)
  const values = {
    candidate_id: context.candidate.id,
    action: context.candidate.decision.action,
    target_skill: context.candidate.decision.targetSkillId,
    overlay_root: context.overlaySkillRoot,
    source_layer: applyResult.sourceLayer,
    files: renderBullets(applyResult.touchedFiles),
    checks: renderBullets(integrityChecks.map((check) => `${check.name}: ${check.pass ? 'PASS' : 'FAIL'} | ${check.detail}`)),
  }
  return fillTemplate(template, values)
}

function collectReferencedPaths(skillText) {
  const matches = skillText.match(/(?:references|examples|scripts|assets)\/[A-Za-z0-9._/-]+/g) || []
  return [...new Set(matches)]
}

function findRepoSkillRoot(rootPath, skillId) {
  if (!pathExists(rootPath)) return ''
  for (const entry of readdirSync(rootPath)) {
    const entryPath = join(rootPath, entry)
    if (!statSync(entryPath).isDirectory()) continue
    if (entry === skillId && pathExists(join(entryPath, 'SKILL.md'))) return entryPath
    const nested = findRepoSkillRoot(entryPath, skillId)
    if (nested) return nested
  }
  return ''
}

function formatSkillTitle(skillId) {
  return skillId
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function relativeOverlayPath(skillRoot, filePath) {
  return filePath.slice(skillRoot.length + 1).replace(/\\/g, '/')
}

function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (current, [key, value]) => current.replaceAll(`{{${key}}}`, value),
    template,
  )
}

function summarizeCandidate(candidate, overlaySkillRoot) {
  return {
    id: candidate.id,
    status: candidate.status,
    action: candidate.decision.action,
    targetSkillId: candidate.decision.targetSkillId,
    confidence: candidate.decision.confidence,
    overlaySkillRoot,
    file: candidate.file,
    patchPlanFile: candidate.patchPlanFile,
    applyReportFile: candidate.applyReportFile,
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function emit(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  console.log('== hello-scholar Skill Evolution Apply ==')
  console.log(`- Action: ${result.action}`)
  console.log(`- Candidate ID: ${result.candidate.id}`)
  console.log(`- Status: ${result.candidate.status}`)
  console.log(`- Decision: ${result.candidate.action}`)
  console.log(`- Target Skill: ${result.candidate.targetSkillId}`)
  console.log(`- Overlay Root: ${result.candidate.overlaySkillRoot}`)
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
  console.error(`skill-evolution-apply failed: ${message}`)
}
