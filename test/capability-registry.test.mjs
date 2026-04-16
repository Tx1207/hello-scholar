import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('capability registry recommends dynamic skills, agents, and tools from contract', () => {
  const fixture = createFixture()
  try {
    runNode([
      join(pkgRoot, 'scripts', 'plan-package.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      'plan-capability',
      '--title',
      'UI evidence plan',
      '--route',
      '~verify',
      '--verify-mode',
      'evidence-driven',
      '--reviewer-focus',
      'diff correctness',
      '--tester-focus',
      'gate coverage',
      '--advisor',
      'architecture review',
      '--file',
      'src/app.tsx',
    ])

    const payload = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'capability-registry.mjs'),
      'recommend',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      'plan-capability',
    ]))

    const ids = payload.recommendations.map((entry) => `${entry.kind}:${entry.id}`)
    assert(ids.includes('skill:verification-loop'))
    assert(ids.includes('skill:code-review-excellence'))
    assert(ids.includes('skill:frontend-design'))
    assert(ids.includes('agent:code-reviewer'))
    assert(ids.includes('agent:tdd-guide'))
    assert(ids.includes('agent:architect'))
    assert(ids.includes('tool:delivery-gate.mjs'))
  } finally {
    destroyFixture(fixture)
  }
})

test('capability registry recommends an evolved overlay skill for a matching route', () => {
  const fixture = createFixture()
  try {
    runNode([
      join(pkgRoot, 'cli.mjs'),
      'install',
      'codex',
      '--standby',
      '--bundle',
      'meta-builder',
    ], fixture.env, fixture.projectDir)

    const overlaySkillRoot = join(fixture.hostHome, '.hello-scholar', 'overlays', 'skills', 'overlay-skill')
    mkdirSync(overlaySkillRoot, { recursive: true })
    writeFileSync(join(overlaySkillRoot, 'SKILL.md'), [
      '---',
      'name: overlay-skill',
      'description: This skill should be used when the user asks for overlay build workflow help.',
      'version: 0.1.0',
      '---',
      '',
      '# Overlay Skill',
      '',
      '## Workflow',
      '',
      '- Reuse the local build workflow.',
      '',
    ].join('\n'), 'utf-8')

    const evolutionRoot = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', 'skill-evo-20260416-001')
    mkdirSync(evolutionRoot, { recursive: true })
    writeFileSync(join(evolutionRoot, 'candidate.json'), JSON.stringify({
      id: 'skill-evo-20260416-001',
      status: 'applied',
      source: {
        changeId: 'change-20260416-001',
        planId: 'plan-overlay',
        route: '~build',
        tier: 'T2',
      },
      decision: {
        action: 'create',
        targetSkillId: 'overlay-skill',
        confidence: 0.88,
        reason: ['Reusable overlay build workflow.'],
      },
      inputs: {
        affectedFiles: ['scripts/build.mjs'],
        verification: ['node --test'],
        evidenceTargetId: 'plan-overlay',
      },
      policy: {
        requiresApproval: true,
        requiresEvidence: false,
        minEvidenceCount: 0,
      },
      review: {
        policyEnabled: true,
        routeEligible: true,
        substantial: true,
        evidenceSatisfied: true,
        activeBundles: ['meta-builder'],
        activeSkills: [],
      },
      extractedWorkflow: ['Reuse the local build workflow.'],
      createdAt: '2026-04-16T10:00:00.000Z',
      updatedAt: '2026-04-16T10:00:00.000Z',
    }, null, 2), 'utf-8')

    const modulesPath = join(fixture.projectDir, '.hello-scholar', 'modules.json')
    const modules = JSON.parse(readFileSync(modulesPath, 'utf-8'))
    modules.explicitSkills = [...new Set([...(modules.explicitSkills || []), 'overlay-skill'])].sort()
    writeFileSync(modulesPath, JSON.stringify(modules, null, 2), 'utf-8')

    runNode([
      join(pkgRoot, 'scripts', 'plan-package.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      'plan-overlay',
      '--title',
      'Overlay build workflow',
      '--route',
      '~build',
      '--file',
      'scripts/build.mjs',
    ], fixture.env, fixture.projectDir)

    const payload = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'capability-registry.mjs'),
      'recommend',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      'plan-overlay',
    ], fixture.env, fixture.projectDir))

    const evolvedSkill = payload.recommendations.find((entry) => entry.kind === 'skill' && entry.id === 'overlay-skill')
    assert(evolvedSkill)
    assert.equal(evolvedSkill.sourceLayer, 'overlay')
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-capability-registry-'))
  const hostHome = join(root, 'home')
  const codexHome = join(hostHome, '.codex')
  const projectDir = join(root, 'project')
  mkdirSync(projectDir, { recursive: true })
  return {
    root,
    hostHome,
    codexHome,
    projectDir,
    env: {
      ...process.env,
      CODEX_HOME: codexHome,
      HELLO_SCHOLAR_HOST_HOME: hostHome,
    },
  }
}

function destroyFixture(fixture) {
  rmSync(fixture.root, { recursive: true, force: true })
}

function runNode(args, env = process.env, cwd = pkgRoot) {
  const result = spawnSync(process.execPath, args, {
    encoding: 'utf-8',
    env,
    cwd,
  })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  return result.stdout.trim()
}
