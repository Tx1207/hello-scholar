import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { before, test } from 'node:test'
import { spawnSync } from 'node:child_process'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

before(() => {
  runNode([join(pkgRoot, 'scripts', 'build-catalog.mjs')], { cwd: pkgRoot })
})

test('review command creates update candidate when change points to an existing skill and evidence is present', () => {
  const fixture = createFixture()
  try {
    writeChangeRecord(fixture, {
      id: 'change-20260414-001',
      title: 'Improve skill quality reviewer workflow',
      slug: 'improve-skill-quality-reviewer-workflow',
      route: '~build',
      tier: 'T2',
      affectedFiles: ['skills/meta/skill-quality-reviewer/SKILL.md', 'scripts/evolution/skill-evolution-review.mjs'],
      actualChanges: [
        'Refined the review workflow for reusable skill feedback.',
        'Added candidate-based review artifacts for later apply stages.',
      ],
      verification: ['node --test'],
    })
    writePlanContract(fixture, '2026-04-14-improve-skill-quality-reviewer-workflow', {
      route: '~build',
      tier: 'T2',
      skillEvolution: {
        enabled: true,
      },
      deliveryGate: {
        requiresEvidence: true,
        minEvidenceCount: 1,
        maxEvidenceAgeHours: 168,
      },
    })
    writeEvidenceBundle(fixture, '2026-04-14-improve-skill-quality-reviewer-workflow', [
      {
        id: 'evidence-1',
        timestamp: '2026-04-14T13:30:00.000Z',
        kind: 'test',
        status: 'pass',
        summary: 'node --test passed for the updated review flow',
        command: 'node --test',
        files: ['test/skill-evolution-review.test.mjs'],
        notes: [],
      },
    ])

    const reviewResult = runJson(fixture, [
      join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-review.mjs'),
      'review',
      '--cwd',
      fixture.projectDir,
      '--json',
    ])

    assert.equal(reviewResult.ok, true)
    assert.equal(reviewResult.candidate.action, 'update')
    assert.equal(reviewResult.candidate.status, 'proposed')
    assert.equal(reviewResult.candidate.targetSkillId, 'skill-quality-reviewer')

    const candidateJsonPath = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', reviewResult.candidate.id, 'candidate.json')
    const reviewPath = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', reviewResult.candidate.id, 'review.md')
    const indexPath = join(fixture.projectDir, 'hello-scholar', 'evolution', 'INDEX.md')

    assertPathExists(candidateJsonPath)
    assertPathExists(reviewPath)
    assertPathExists(indexPath)

    const storedCandidate = JSON.parse(readFileSync(candidateJsonPath, 'utf-8'))
    assert.equal(storedCandidate.decision.action, 'update')
    assert.equal(storedCandidate.decision.targetSkillId, 'skill-quality-reviewer')
    assert.equal(storedCandidate.policy.requiresEvidence, true)

    const statusResult = runJson(fixture, [
      join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-review.mjs'),
      'status',
      '--cwd',
      fixture.projectDir,
      '--candidate-id',
      reviewResult.candidate.id,
      '--json',
    ])

    assert.equal(statusResult.ok, true)
    assert.equal(statusResult.candidate.id, reviewResult.candidate.id)
    assert.equal(statusResult.candidate.action, 'update')
  } finally {
    destroyFixture(fixture)
  }
})

test('review command records rejected candidate when policy and evidence requirements are not met', () => {
  const fixture = createFixture()
  try {
    writeChangeRecord(fixture, {
      id: 'change-20260414-001',
      title: 'Tweak a small note',
      slug: 'tweak-a-small-note',
      route: '~idea',
      tier: 'T0',
      affectedFiles: ['README.md'],
      actualChanges: ['Adjusted one note in the draft.'],
      verification: [],
    })

    const reviewResult = runJson(fixture, [
      join(pkgRoot, 'scripts', 'evolution', 'skill-evolution-review.mjs'),
      'review',
      '--cwd',
      fixture.projectDir,
      '--json',
    ])

    assert.equal(reviewResult.ok, true)
    assert.equal(reviewResult.candidate.action, 'reject')
    assert.equal(reviewResult.candidate.status, 'rejected')
    assert.equal(reviewResult.candidate.targetSkillId, '')

    const candidateJsonPath = join(fixture.projectDir, 'hello-scholar', 'evolution', 'candidates', reviewResult.candidate.id, 'candidate.json')
    const storedCandidate = JSON.parse(readFileSync(candidateJsonPath, 'utf-8'))
    assert.equal(storedCandidate.decision.action, 'reject')
    assert.equal(storedCandidate.review.policyEnabled, false)
    assert.equal(storedCandidate.review.evidenceSatisfied, false)
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-evolution-'))
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

function writeChangeRecord(fixture, input) {
  const changeRoot = join(fixture.projectDir, 'hello-scholar', 'changes')
  mkdirSync(changeRoot, { recursive: true })
  const text = [
    '---',
    `id: ${input.id}`,
    `title: ${input.title}`,
    `slug: ${input.slug}`,
    'status: done',
    'created: 2026-04-14T13:00:00.000Z',
    'updated: 2026-04-14T13:05:00.000Z',
    `route: ${input.route}`,
    `tier: ${input.tier}`,
    'decision: new-topic',
    'affected_files:',
    ...input.affectedFiles.map((file) => `  - ${file}`),
    '---',
    `# Change: ${input.title}`,
    '',
    '## User Requests',
    '',
    '### 2026-04-14 13:00',
    '',
    '- Capture reusable workflow from the task.',
    '',
    '## Intent Summary',
    '',
    `- Route: ${input.route}`,
    `- Tier: ${input.tier}`,
    '',
    '## Affected Files',
    '',
    ...input.affectedFiles.map((file) => `- \`${file}\``),
    '',
    '## Actual Changes',
    '',
    '### 2026-04-14 13:05',
    '',
    ...input.actualChanges.map((item) => `- ${item}`),
    '',
    '## Verification',
    '',
    ...(input.verification.length > 0 ? input.verification.map((item) => `- ${item}`) : ['- 暂无记录']),
    '',
    '## Result',
    '',
    '- Review artifacts are ready.',
    '',
    '## Next Step',
    '',
    '- Run skill evolution review.',
    '',
  ].join('\n')
  writeFileSync(join(changeRoot, '2026-04-14-change.md'), text, 'utf-8')
}

function writePlanContract(fixture, planId, overrides) {
  const planRoot = join(fixture.projectDir, 'hello-scholar', 'plans', planId)
  mkdirSync(planRoot, { recursive: true })
  writeFileSync(join(planRoot, 'contract.json'), JSON.stringify({
    version: 1,
    planId,
    title: planId,
    route: '~build',
    tier: 'T2',
    status: 'active',
    verifyMode: 'targeted',
    reviewerFocus: [],
    testerFocus: [],
    advisor: [],
    allowedFiles: [],
    deliveryGate: {
      requiresEvidence: true,
      minEvidenceCount: 1,
      maxEvidenceAgeHours: 168,
    },
    ...overrides,
  }, null, 2), 'utf-8')
}

function writeEvidenceBundle(fixture, targetId, entries) {
  const evidenceRoot = join(fixture.projectDir, 'hello-scholar', 'evidence', targetId)
  mkdirSync(evidenceRoot, { recursive: true })
  writeFileSync(join(evidenceRoot, 'index.json'), JSON.stringify({
    targetId,
    updatedAt: entries.at(-1)?.timestamp || '',
    entries,
  }, null, 2), 'utf-8')
}

function runJson(fixture, args) {
  const output = runNode(args, {
    cwd: fixture.projectDir,
    env: fixture.env,
  })
  return JSON.parse(output)
}

function runNode(args, options) {
  const result = spawnSync(process.execPath, args, {
    ...options,
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0, [
    `Command failed: ${process.execPath} ${args.join(' ')}`,
    result.stdout,
    result.stderr,
  ].join('\n'))
  return result.stdout.trim()
}

function assertPathExists(filePath) {
  assert.equal(existsSync(filePath), true, filePath)
}
