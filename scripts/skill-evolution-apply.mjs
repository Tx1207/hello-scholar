import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getOverlayPaths, getRuntimeContext } from './cli-config.mjs'
import { parseFrontmatter, renderBullets } from './change-tracker-utils.mjs'
import { copyTree, ensureDir, parseArgv, pathExists, readText, writeText } from './cli-utils.mjs'
import { getEvolutionPaths, readCandidate, writeCandidate } from './skill-evolution-store.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))
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
  if (command === 'apply') return applySkillEvolution(cwd, args)
  if (command === 'status') return readSkillEvolutionApplyStatus(cwd, args)
  throw new Error(`Unknown skill-evolution-apply command: ${command}`)
}

export function planSkillEvolution(cwd, args, options = {}) {
  const context = loadApplyContext(cwd, args, options)
  const patchPlanText = renderPatchPlan(context)
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

export function applySkillEvolution(cwd, args, options = {}) {
  const context = loadApplyContext(cwd, args, options)
  if (!args.hasFlag('--approve')) {
    throw new Error('apply requires --approve')
  }

  const patchPlanText = renderPatchPlan(context)
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
      approved: true,
      approvedAt: now,
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

  return {
    ok: true,
    action: 'apply',
    candidate: summarizeCandidate(saved, context.overlaySkillRoot),
    notes: [
      `Source layer: ${applyResult.sourceLayer}`,
      `Touched files: ${applyResult.touchedFiles.join(', ')}`,
      `Apply report: ${saved.applyReportFile}`,
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
  const repoSkillRoot = join(effectivePkgRoot, 'skills', skillId)
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

function materializeOverlaySkill(context) {
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

function runIntegrityChecks(skillRoot, skillId) {
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

function renderCreatedSkill(context) {
  const skillId = context.candidate.decision.targetSkillId
  const description = buildDescription(context)
  const workflow = context.candidate.extractedWorkflow.length > 0
    ? context.candidate.extractedWorkflow
    : ['Review `references/local-evolution.md` and apply the captured workflow conservatively.']

  return [
    '---',
    `name: ${skillId}`,
    `description: ${description}`,
    'version: 0.1.0',
    '---',
    '',
    `# ${formatSkillTitle(skillId)}`,
    '',
    '## Goal',
    '',
    `Capture a reusable workflow derived from \`${context.candidate.source.changeId || 'local-evolution'}\` and expose it as a local overlay skill.`,
    '',
    '## When to Use',
    '',
    '- Use when the user asks for the same or closely related workflow.',
    '- Use only when the task matches the captured method, not for unrelated work.',
    '',
    '## Workflow',
    '',
    ...workflow.map((item) => `- ${item}`),
    '',
    '## Boundaries',
    '',
    '- Keep the workflow scoped to the durable method captured here.',
    '- Do not treat task-specific progress or temporary notes as reusable guidance.',
    '',
    '## Resources',
    '',
    '- `references/local-evolution.md`',
  ].join('\n')
}

function renderUpdatedSkill(context, currentText) {
  const fallback = renderCreatedSkill(context)
  const baseText = currentText || fallback
  const nextBlock = [
    EVOLUTION_START,
    '## Local Evolution',
    '',
    `- Candidate: \`${context.candidate.id}\``,
    `- Source Change: \`${context.candidate.source.changeId || 'N/A'}\``,
    `- Source Plan: \`${context.candidate.source.planId || 'N/A'}\``,
    '- Additional context: `references/local-evolution.md`',
    '',
    EVOLUTION_END,
  ].join('\n')

  const pattern = new RegExp(`${escapeRegex(EVOLUTION_START)}[\\s\\S]*?${escapeRegex(EVOLUTION_END)}`)
  if (pattern.test(baseText)) {
    return baseText.replace(pattern, nextBlock)
  }
  return `${baseText.trimEnd()}\n\n${nextBlock}\n`
}

function renderLocalEvolutionReference(context) {
  return [
    '# Local Evolution',
    '',
    `- Candidate: \`${context.candidate.id}\``,
    `- Action: \`${context.candidate.decision.action}\``,
    `- Target Skill: \`${context.candidate.decision.targetSkillId}\``,
    `- Source Change: \`${context.candidate.source.changeId || 'N/A'}\``,
    `- Source Plan: \`${context.candidate.source.planId || 'N/A'}\``,
    '',
    '## Reasons',
    '',
    renderBullets(context.candidate.decision.reason || []),
    '',
    '## Extracted Workflow',
    '',
    renderBullets(context.candidate.extractedWorkflow || []),
  ].join('\n')
}

function renderPatchPlan(context) {
  const templatePath = join(context.pkgRoot, 'templates', 'skill-evolution-patch-plan.md')
  const fallback = [
    '# Skill Evolution Patch Plan: {{candidate_id}}',
    '',
    '- Action: `{{action}}`',
    '- Target Skill: `{{target_skill}}`',
    '- Overlay Root: `{{overlay_root}}`',
    '- Repo Source Root: `{{repo_root}}`',
    '',
    '## Planned Changes',
    '',
    '{{changes}}',
    '',
    '## Extracted Workflow',
    '',
    '{{workflow}}',
  ].join('\n')
  const template = readText(templatePath, fallback)
  const plannedChanges = [
    'Materialize or update the overlay skill directory.',
    'Write `references/local-evolution.md` with captured workflow.',
    'Create or update `SKILL.md` using the approved candidate.',
    'Run minimal integrity checks after writing.',
  ]
  const values = {
    candidate_id: context.candidate.id,
    action: context.candidate.decision.action,
    target_skill: context.candidate.decision.targetSkillId,
    overlay_root: context.overlaySkillRoot,
    repo_root: context.repoSkillRoot,
    changes: renderBullets(plannedChanges),
    workflow: renderBullets(context.candidate.extractedWorkflow || []),
  }
  return fillTemplate(template, values)
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

function buildDescription(context) {
  const skillId = context.candidate.decision.targetSkillId
  const phrases = context.candidate.extractedWorkflow.slice(0, 2).map((item) => item.replace(/[.`]/g, '').trim()).filter(Boolean)
  if (phrases.length === 0) {
    return `This skill should be used when the user asks for help with ${skillId.replaceAll('-', ' ')} or needs the local overlay workflow captured from recent work.`
  }
  return `This skill should be used when the user asks to \"${phrases[0]}\", needs help with ${skillId.replaceAll('-', ' ')}, or wants the local overlay workflow captured from recent work.`
}

function collectReferencedPaths(skillText) {
  const matches = skillText.match(/(?:references|examples|scripts|assets)\/[A-Za-z0-9._/-]+/g) || []
  return [...new Set(matches)]
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
