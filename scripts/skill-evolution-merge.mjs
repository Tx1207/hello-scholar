import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getOverlayPaths, getRuntimeContext } from './cli-config.mjs'
import { copyTree, ensureDir, parseArgv, pathExists } from './cli-utils.mjs'
import { getEvolutionPaths, readCandidate, writeCandidate } from './skill-evolution-store.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))

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
  if (command === 'merge') return mergeOverlaySkill(cwd, args)
  if (command === 'status') return readMergeStatus(cwd, args)
  throw new Error(`Unknown skill-evolution-merge command: ${command}`)
}

export function mergeOverlaySkill(cwd, args, options = {}) {
  if (!args.hasFlag('--approve')) {
    throw new Error('merge requires --approve')
  }

  const context = loadMergeContext(cwd, args, options)
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
      },
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
      ].join('\n'),
    })
  }

  return {
    ok: true,
    action: 'merge',
    skillId: context.skillId,
    overlaySkillRoot: context.overlaySkillRoot,
    repoSkillRoot: context.repoSkillRoot,
    notes: [
      `Merged overlay skill into repo source: ${context.skillId}`,
    ],
  }
}

export function readMergeStatus(cwd, args, options = {}) {
  const context = loadMergeContext(cwd, args, options)
  return {
    ok: true,
    action: 'status',
    skillId: context.skillId,
    overlaySkillRoot: context.overlaySkillRoot,
    repoSkillRoot: context.repoSkillRoot,
    notes: [
      `Overlay exists: ${pathExists(context.overlaySkillRoot)}`,
      `Repo skill exists: ${pathExists(context.repoSkillRoot)}`,
    ],
  }
}

function loadMergeContext(cwd, args, options) {
  const effectivePkgRoot = resolve(String(options.pkgRoot || pkgRoot))
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
    repoSkillRoot: join(effectivePkgRoot, 'skills', resolvedSkillId),
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
