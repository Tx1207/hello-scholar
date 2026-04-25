import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

import { parseArgv } from '../scripts/cli-utils.mjs'
import { mergeOverlaySkill } from '../scripts/evolution/skill-evolution-merge.mjs'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('mergeOverlaySkill copies overlay skill into repo source and updates candidate state', () => {
  const fixture = createFixture()
  const previousHostHome = process.env.HELLO_SCHOLAR_HOST_HOME
  const previousCodexHome = process.env.CODEX_HOME
  try {
    process.env.HELLO_SCHOLAR_HOST_HOME = fixture.hostHome
    process.env.CODEX_HOME = fixture.codexHome
    installStandby(fixture)
    const overlaySkillRoot = join(fixture.hostHome, 'plugins', 'hello-scholar', '.hello-scholar', 'overlays', 'skills', 'overlay-skill')
    mkdirSync(join(overlaySkillRoot, 'references'), { recursive: true })
    writeFileSync(join(overlaySkillRoot, 'SKILL.md'), [
      '---',
      'name: overlay-skill',
      'description: This skill should be used when the user asks for overlay skill help.',
      'version: 0.1.0',
      '---',
      '',
      '# Overlay Skill',
      '',
      '## Resources',
      '',
      '- `references/local-evolution.md`',
      '',
    ].join('\n'), 'utf-8')
    writeFileSync(join(overlaySkillRoot, 'references', 'local-evolution.md'), '# Local Evolution\n', 'utf-8')

    const candidateRoot = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', 'skill-evo-20260416-001')
    mkdirSync(candidateRoot, { recursive: true })
    writeFileSync(join(candidateRoot, 'candidate.json'), JSON.stringify({
      id: 'skill-evo-20260416-001',
      status: 'applied',
      source: {
        changeId: 'change-20260416-001',
        planId: '2026-04-16-skill-evolution',
        route: '~build',
        tier: 'T2',
      },
      decision: {
        action: 'create',
        targetSkillId: 'overlay-skill',
        confidence: 0.9,
        reason: ['Overlay skill is ready to merge.'],
      },
      inputs: {
        affectedFiles: [],
        verification: [],
        evidenceTargetId: '',
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
      apply: {
        status: 'applied',
        targetLayer: 'overlay',
        overlaySkillRoot,
      },
      extractedWorkflow: ['Merge overlay skill into repo source.'],
      createdAt: '2026-04-16T10:00:00.000Z',
      updatedAt: '2026-04-16T10:00:00.000Z',
    }, null, 2), 'utf-8')

    const args = parseArgv(['--candidate-id', 'skill-evo-20260416-001', '--approve'])
    const result = mergeOverlaySkill(fixture.projectDir, args, {
      pkgRoot,
      repoRoot: fixture.repoRoot,
    })

    assert.equal(result.ok, true)
    const repoSkillPath = join(fixture.repoRoot, 'skills', 'overlay-skill', 'SKILL.md')
    assert.equal(existsSync(repoSkillPath), true)
    assert(readFileSync(repoSkillPath, 'utf-8').includes('name: overlay-skill'))

    const candidate = JSON.parse(readFileSync(join(candidateRoot, 'candidate.json'), 'utf-8'))
    assert.equal(candidate.status, 'merged')
    assert.equal(candidate.merge.status, 'merged')
    assert.equal(existsSync(join(candidateRoot, 'merge-report.md')), true)

    const modules = JSON.parse(readFileSync(join(fixture.projectDir, '.hello-scholar', 'modules.json'), 'utf-8'))
    const installedSkillPath = join(fixture.projectDir, '.hello-scholar', 'skills', 'overlay-skill', 'SKILL.md')
    const promptPath = join(fixture.projectDir, '.hello-scholar', 'active-prompt.md')
    assert(modules.explicitSkills.includes('overlay-skill'))
    assert.equal(existsSync(installedSkillPath), true)
    assert(readFileSync(promptPath, 'utf-8').includes('overlay-skill'))
  } finally {
    if (previousHostHome === undefined) {
      delete process.env.HELLO_SCHOLAR_HOST_HOME
    } else {
      process.env.HELLO_SCHOLAR_HOST_HOME = previousHostHome
    }
    if (previousCodexHome === undefined) {
      delete process.env.CODEX_HOME
    } else {
      process.env.CODEX_HOME = previousCodexHome
    }
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-merge-'))
  const hostHome = join(root, 'home')
  const codexHome = join(hostHome, '.codex')
  const projectDir = join(root, 'project')
  const repoRoot = join(root, 'repo')
  mkdirSync(projectDir, { recursive: true })
  mkdirSync(join(repoRoot, 'skills'), { recursive: true })
  return {
    root,
    hostHome,
    codexHome,
    projectDir,
    repoRoot,
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

function installStandby(fixture) {
  const result = spawnSync(process.execPath, [
    join(pkgRoot, 'cli.mjs'),
    'install',
    'codex',
    '--standby',
  ], {
    cwd: fixture.projectDir,
    env: fixture.env,
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
}
