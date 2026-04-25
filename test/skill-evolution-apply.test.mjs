import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { spawnSync } from 'node:child_process'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('apply command requires preview before apply', () => {
  const fixture = createFixture()
  try {
    writeCandidateFixture(fixture, {
      id: 'skill-evo-20260416-001',
      status: 'proposed',
      decision: {
        action: 'create',
        targetSkillId: 'local-overlay-skill',
        confidence: 0.8,
        reason: ['Reusable workflow captured.'],
      },
    })

    const result = spawnSync(process.execPath, [
      join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-apply.mjs'),
      'apply',
      '--cwd',
      fixture.projectDir,
      '--candidate-id',
      'skill-evo-20260416-001',
      '--json',
    ], {
      cwd: fixture.projectDir,
      env: fixture.env,
      encoding: 'utf-8',
    })

    assert.equal(result.status, 1)
    assert(result.stderr.includes('apply requires preview to run first'))
  } finally {
    destroyFixture(fixture)
  }
})

test('approve command rejects vague user confirmation after preview', () => {
  const fixture = createFixture()
  try {
    writeCandidateFixture(fixture, {
      id: 'skill-evo-20260416-001',
      status: 'proposed',
      decision: {
        action: 'create',
        targetSkillId: 'local-overlay-skill',
        confidence: 0.8,
        reason: ['Reusable workflow captured.'],
      },
    })

    const preview = runJson(fixture, [
      join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-apply.mjs'),
      'preview',
      '--cwd',
      fixture.projectDir,
      '--candidate-id',
      'skill-evo-20260416-001',
      '--json',
    ])

    const result = spawnSync(process.execPath, [
      join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-apply.mjs'),
      'approve',
      '--cwd',
      fixture.projectDir,
      '--candidate-id',
      'skill-evo-20260416-001',
      '--decision',
      'apply-overlay',
      '--preview-hash',
      preview.preview.hash,
      '--user-confirmation',
      '处理这个skill',
      '--json',
    ], {
      cwd: fixture.projectDir,
      env: fixture.env,
      encoding: 'utf-8',
    })

    assert.equal(result.status, 1)
    assert(result.stderr.includes('approve requires explicit apply confirmation'))
  } finally {
    destroyFixture(fixture)
  }
})

test('apply command updates an existing repo skill into overlay storage', () => {
  const fixture = createFixture()
  try {
    writeCandidateFixture(fixture, {
      id: 'skill-evo-20260416-001',
      status: 'proposed',
      decision: {
        action: 'update',
        targetSkillId: 'bug-detective',
        confidence: 0.82,
        reason: ['Current change refines an existing skill.'],
      },
      extractedWorkflow: [
        'Capture a local evolution note for repeated debugging work.',
        'Keep the durable guidance in references/local-evolution.md.',
      ],
    })

    const output = previewApproveApply(fixture, 'skill-evo-20260416-001')

    assert.equal(output.ok, true)
    assert.equal(output.candidate.status, 'applied')
    assert.equal(output.candidate.targetSkillId, 'bug-detective')

    const overlaySkillRoot = join(fixture.hostHome, 'plugins', 'hello-scholar', '.hello-scholar', 'overlays', 'skills', 'bug-detective')
    const overlaySkillText = readFileSync(join(overlaySkillRoot, 'SKILL.md'), 'utf-8')
    const overlayReferenceText = readFileSync(join(overlaySkillRoot, 'references', 'local-evolution.md'), 'utf-8')
    assert(overlaySkillText.includes('## Local Evolution'))
    assert(overlayReferenceText.includes('skill-evo-20260416-001'))

    const candidatePath = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', 'skill-evo-20260416-001', 'candidate.json')
    const patchPlanPath = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', 'skill-evo-20260416-001', 'patch-plan.md')
    const applyReportPath = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', 'skill-evo-20260416-001', 'apply-report.md')
    const candidate = JSON.parse(readFileSync(candidatePath, 'utf-8'))
    assert.equal(candidate.status, 'applied')
    assert.equal(candidate.apply.status, 'applied')
    assert.equal(candidate.apply.targetLayer, 'overlay')
    assertPathExists(patchPlanPath)
    assertPathExists(applyReportPath)
  } finally {
    destroyFixture(fixture)
  }
})

test('apply command creates a new overlay skill for create candidates', () => {
  const fixture = createFixture()
  try {
    writeCandidateFixture(fixture, {
      id: 'skill-evo-20260416-001',
      status: 'proposed',
      decision: {
        action: 'create',
        targetSkillId: 'local-overlay-skill',
        confidence: 0.77,
        reason: ['No existing skill matches this local workflow.'],
      },
      extractedWorkflow: [
        'Create a local overlay skill for project-specific but reusable guidance.',
      ],
    })

    const output = previewApproveApply(fixture, 'skill-evo-20260416-001')

    assert.equal(output.ok, true)
    const overlaySkillRoot = join(fixture.hostHome, 'plugins', 'hello-scholar', '.hello-scholar', 'overlays', 'skills', 'local-overlay-skill')
    const skillText = readFileSync(join(overlaySkillRoot, 'SKILL.md'), 'utf-8')
    assert(skillText.includes('name: local-overlay-skill'))
    assert(skillText.includes('references/local-evolution.md'))
  } finally {
    destroyFixture(fixture)
  }
})

test('preview records comparison, decisions, and touched files before approval', () => {
  const fixture = createFixture()
  try {
    writeCandidateFixture(fixture, {
      id: 'skill-evo-20260416-001',
      status: 'proposed',
      decision: {
        action: 'create',
        targetSkillId: 'local-overlay-skill',
        confidence: 0.77,
        reason: ['No existing skill matches this local workflow.'],
      },
      extractedWorkflow: [
        'Create a local overlay skill for project-specific but reusable guidance.',
      ],
    })

    const output = runJson(fixture, [
      join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-apply.mjs'),
      'preview',
      '--cwd',
      fixture.projectDir,
      '--candidate-id',
      'skill-evo-20260416-001',
      '--json',
    ])

    assert.equal(output.ok, true)
    assert.equal(output.candidate.status, 'previewed')
    assert.equal(output.preview.recommendedDecision, 'apply-overlay')
    assert.equal(output.preview.existingSkillComparison.targetSkillId, 'local-overlay-skill')
    assert(output.preview.availableDecisions.some((item) => item.decision === 'apply-overlay'))
    assert(output.preview.availableDecisions.find((item) => item.decision === 'apply-overlay').files.some((file) => file.endsWith('SKILL.md')))

    const patchPlanPath = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', 'skill-evo-20260416-001', 'patch-plan.md')
    const patchPlan = readFileSync(patchPlanPath, 'utf-8')
    assert(patchPlan.includes('## Existing Skill Comparison'))
    assert(patchPlan.includes('## Available Decisions'))
    assert(patchPlan.includes('Files touched if selected'))
  } finally {
    destroyFixture(fixture)
  }
})

test('apply command activates the evolved overlay skill for the next standby turn', () => {
  const fixture = createFixture()
  try {
    installStandby(fixture)
    writeCandidateFixture(fixture, {
      id: 'skill-evo-20260416-001',
      status: 'proposed',
      decision: {
        action: 'create',
        targetSkillId: 'local-overlay-skill',
        confidence: 0.77,
        reason: ['No existing skill matches this local workflow.'],
      },
      extractedWorkflow: [
        'Create a local overlay skill for project-specific but reusable guidance.',
      ],
    })

    const output = previewApproveApply(fixture, 'skill-evo-20260416-001')

    assert.equal(output.ok, true)

    const modules = JSON.parse(readFileSync(join(fixture.projectDir, '.hello-scholar', 'modules.json'), 'utf-8'))
    const installedSkillPath = join(fixture.projectDir, '.hello-scholar', 'skills', 'local-overlay-skill', 'SKILL.md')
    const promptPath = join(fixture.projectDir, '.hello-scholar', 'active-prompt.md')

    assert(modules.explicitSkills.includes('local-overlay-skill'))
    assertPathExists(installedSkillPath)
    assertPathExists(promptPath)
    assert(readFileSync(promptPath, 'utf-8').includes('local-overlay-skill'))
    assert(readFileSync(promptPath, 'utf-8').includes('当前动态 Skills'))
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-apply-'))
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

function writeCandidateFixture(fixture, overrides) {
  const candidateRoot = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', overrides.id)
  mkdirSync(candidateRoot, { recursive: true })
  writeFileSync(join(candidateRoot, 'candidate.json'), JSON.stringify({
    id: overrides.id,
    status: overrides.status || 'proposed',
    source: {
      changeId: 'change-20260416-001',
      planId: '2026-04-16-skill-evolution',
      route: '~build',
      tier: 'T2',
    },
    decision: overrides.decision,
    inputs: {
      affectedFiles: ['scripts/example.mjs'],
      verification: ['node --test'],
      evidenceTargetId: '2026-04-16-skill-evolution',
    },
    policy: {
      requiresApproval: true,
      requiresEvidence: true,
      minEvidenceCount: 1,
    },
    review: {
      policyEnabled: true,
      routeEligible: true,
      substantial: true,
      evidenceSatisfied: true,
      activeBundles: ['meta-builder'],
      activeSkills: ['skill-development'],
    },
    extractedWorkflow: overrides.extractedWorkflow || ['Use a local overlay for reusable project-specific workflows.'],
    createdAt: '2026-04-16T10:00:00.000Z',
    updatedAt: '2026-04-16T10:00:00.000Z',
  }, null, 2), 'utf-8')
}

function runJson(fixture, args) {
  const result = spawnSync(process.execPath, args, {
    cwd: fixture.projectDir,
    env: fixture.env,
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0, [
    `Command failed: ${process.execPath} ${args.join(' ')}`,
    result.stdout,
    result.stderr,
  ].join('\n'))
  return JSON.parse(result.stdout.trim())
}

function previewApproveApply(fixture, candidateId) {
  const preview = runJson(fixture, [
    join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-apply.mjs'),
    'preview',
    '--cwd',
    fixture.projectDir,
    '--candidate-id',
    candidateId,
    '--json',
  ])
  runJson(fixture, [
    join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-apply.mjs'),
    'approve',
    '--cwd',
    fixture.projectDir,
    '--candidate-id',
    candidateId,
    '--decision',
    'apply-overlay',
    '--preview-hash',
    preview.preview.hash,
    '--user-confirmation',
    `确认应用 ${candidateId} 到 overlay skill`,
    '--json',
  ])
  return runJson(fixture, [
    join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-apply.mjs'),
    'apply',
    '--cwd',
    fixture.projectDir,
    '--candidate-id',
    candidateId,
    '--json',
  ])
}

function assertPathExists(filePath) {
  assert.equal(existsSync(filePath), true, filePath)
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
