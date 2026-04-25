import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getOverlayPaths, getRuntimeContext } from '../install/cli-config.mjs'
import { copyTree, ensureDir, parseArgv, pathExists } from '../cli-utils.mjs'
import { activateEvolvedSkill } from './skill-evolution-runtime.mjs'
import { appendTransition, assertTransitionAllowed, buildSkillEvolutionWorkflow } from './skill-evolution-state-machine.mjs'
import { getEvolutionPaths, readCandidate, writeCandidate } from './skill-evolution-store.mjs'

const pkgRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))))

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
  if (command === 'preview') return previewRepoMerge(cwd, args)
  if (command === 'merge') return mergeOverlaySkill(cwd, args)
  if (command === 'status') return readMergeStatus(cwd, args)
  throw new Error(`Unknown skill-evolution-merge command: ${command}`)
}

export function previewRepoMerge(cwd, args, options = {}) {
  const context = loadMergeContext(cwd, args, options)
  const workflow = context.candidate ? buildSkillEvolutionWorkflow(context.candidate) : null
  const notes = [
    `Overlay exists: ${pathExists(context.overlaySkillRoot)}`,
    `Repo skill exists: ${pathExists(context.repoSkillRoot)}`,
    'Review overlay content and repo target before running merge.',
    `Exact next command: node scripts/evolution/skill-evolution-merge.mjs merge --candidate-id ${context.candidate?.id || ''} --approve --user-request "确认合并这个 skill 到 repo" --cwd .`,
  ]
  if (context.candidate) {
    notes.push(`Workflow current: ${workflow.current}`)
    notes.push(`Allowed transitions: ${workflow.allowedTransitions.join(', ') || 'none'}`)
  }
  return {
    ok: true,
    action: 'preview',
    skillId: context.skillId,
    overlaySkillRoot: context.overlaySkillRoot,
    repoSkillRoot: context.repoSkillRoot,
    workflow,
    notes,
  }
}

export function mergeOverlaySkill(cwd, args, options = {}) {
  if (!args.hasFlag('--approve')) {
    throw new Error('merge requires --approve')
  }
  const userRequest = requireUserInitiatedRequest(args, 'merge')

  const context = loadMergeContext(cwd, args, options)
  if (context.candidate) assertTransitionAllowed(context.candidate, 'merge_repo')
  ensureDir(join(context.pkgRoot, 'skills'))
  copyTree(context.overlaySkillRoot, context.repoSkillRoot)

  if (context.candidate) {
    const now = new Date().toISOString()
    const nextCandidate = {
      ...context.candidate,
      status: 'merged',
      merge: {
        status: 'merged',
        repoSkillRoot: context.repoSkillRoot,
        mergedAt: now,
        userRequest,
      },
      state: appendTransition(context.candidate, 'merge_repo', now),
      updatedAt: now,
    }
    writeCandidate(context.evolutionPaths, nextCandidate, {
      mergeReportText: [
        `# Skill Evolution Merge Report: ${context.candidate.id}`,
        '',
        `- Skill: \`${context.skillId}\``,
        `- Overlay Root: \`${context.overlaySkillRoot}\``,
        `- Repo Root: \`${context.repoSkillRoot}\``,
        `- Merged At: \`${now}\``,
        `- User Request: ${userRequest}`,
      ].join('\n'),
    })
  }
  const activation = activateEvolvedSkill(cwd, context.skillId, {
    pkgRoot: context.pkgRoot,
    runtime: context.runtime,
  })

  return {
    ok: true,
    action: 'merge',
    skillId: context.skillId,
    overlaySkillRoot: context.overlaySkillRoot,
    repoSkillRoot: context.repoSkillRoot,
    notes: [
      `Merged overlay skill into repo source: ${context.skillId}`,
      `User request: ${userRequest}`,
      activation.activated
        ? `Selection refreshed in ${activation.scope} scope (${activation.mode})`
        : `Selection refresh skipped: ${activation.reason}`,
    ],
  }
}

function requireUserInitiatedRequest(args, action) {
  const request = String(args.getFlag('--user-request', '')).trim()
  if (!request) {
    throw new Error(`${action} requires --user-request to prove the user explicitly asked AI to apply this candidate`)
  }
  return request
}

export function readMergeStatus(cwd, args, options = {}) {
  const context = loadMergeContext(cwd, args, options)
  const workflow = context.candidate ? buildSkillEvolutionWorkflow(context.candidate) : null
  return {
    ok: true,
    action: 'status',
    skillId: context.skillId,
    overlaySkillRoot: context.overlaySkillRoot,
    repoSkillRoot: context.repoSkillRoot,
    workflow,
    notes: [
      `Overlay exists: ${pathExists(context.overlaySkillRoot)}`,
      `Repo skill exists: ${pathExists(context.repoSkillRoot)}`,
      workflow ? `Workflow current: ${workflow.current}` : 'No candidate workflow available.',
      workflow ? `Allowed transitions: ${workflow.allowedTransitions.join(', ') || 'none'}` : 'Use --candidate-id to inspect candidate transitions.',
    ],
  }
}

function loadMergeContext(cwd, args, options) {
  const effectivePkgRoot = resolve(String(options.pkgRoot || pkgRoot))
  const repoRoot = resolve(String(options.repoRoot || effectivePkgRoot))
  const runtime = getRuntimeContext(effectivePkgRoot)
  const overlayPaths = getOverlayPaths(runtime)
  const evolutionPaths = getEvolutionPaths(cwd)
  const candidateId = String(args.getFlag('--candidate-id', '')).trim()
  const skillId = String(args.getFlag('--skill-id', '')).trim()
  const candidate = candidateId ? readCandidate(evolutionPaths, candidateId) : null
  const resolvedSkillId = skillId || candidate?.decision?.targetSkillId || ''
  if (!resolvedSkillId) throw new Error('Either --skill-id or --candidate-id is required')

  const overlaySkillRoot = join(overlayPaths.overlaySkillsRoot, resolvedSkillId)
  if (!pathExists(overlaySkillRoot)) {
    throw new Error(`Overlay skill is missing: ${overlaySkillRoot}`)
  }

  return {
    pkgRoot: effectivePkgRoot,
    runtime,
    overlayPaths,
    evolutionPaths,
    candidate,
    skillId: resolvedSkillId,
    overlaySkillRoot,
    repoSkillRoot: join(repoRoot, 'skills', resolvedSkillId),
  }
}

function emit(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  console.log('== hello-scholar Skill Evolution Merge ==')
  console.log(`- Action: ${result.action}`)
  console.log(`- Skill ID: ${result.skillId}`)
  console.log(`- Overlay Root: ${result.overlaySkillRoot}`)
  console.log(`- Repo Root: ${result.repoSkillRoot}`)
  if (result.workflow) {
    console.log('- Workflow:')
    console.log(`  - Flow: ${result.workflow.flow.join(' -> ')}`)
    console.log(`  - Current: ${result.workflow.current}`)
    console.log(`  - Next actor: ${result.workflow.nextRequiredActor}`)
    if (result.workflow.allowedTransitions.length > 0) {
      console.log(`  - Allowed transitions: ${result.workflow.allowedTransitions.join(', ')}`)
    }
    if (result.workflow.issues.length > 0) {
      console.log('  - State issues:')
      for (const issue of result.workflow.issues) console.log(`    - ${issue}`)
    }
  }
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
  console.error(`skill-evolution-merge failed: ${message}`)
}
