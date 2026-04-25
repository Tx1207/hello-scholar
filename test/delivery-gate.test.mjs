import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('delivery gate rejects non-experiment top-level evidence targets', () => {
  const fixture = createFixture()
  try {
    runNode([
      join(pkgRoot, 'scripts', 'plan-package.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      'plan-evidence',
      '--title',
      'Evidence gate',
      '--file',
      'scripts/evidence-store.mjs',
      '--min-evidence',
      '1',
      '--max-evidence-age-hours',
      '24',
    ], fixture.projectDir)

    const result = spawnSync(process.execPath, [
      join(pkgRoot, 'scripts', 'delivery-gate.mjs'),
      'check',
      '--cwd',
      fixture.projectDir,
      '--target-id',
      'plan-evidence',
      '--plan-id',
      'plan-evidence',
    ], {
      cwd: fixture.projectDir,
      encoding: 'utf-8',
    })

    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /Delivery gate requires experiment evidence|Legacy top-level evidence targets are no longer delivery gate targets/)
    assert.equal(existsSync(join(fixture.projectDir, 'hello-scholar', 'evidence', 'plan-evidence', 'closeout.md')), false)
  } finally {
    destroyFixture(fixture)
  }
})

test('delivery gate fails with stale experiment evidence', () => {
  const fixture = createFixture()
  try {
    const created = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'experiment-store.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Stale experiment evidence',
      '--request',
      'Validate stale experiment evidence gate.',
    ], fixture.projectDir))

    runNode([
      join(pkgRoot, 'scripts', 'plan-package.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      created.id,
      '--title',
      'Stale evidence',
      '--min-evidence',
      '1',
      '--max-evidence-age-hours',
      '1',
    ], fixture.projectDir)

    runNode([
      join(pkgRoot, 'scripts', 'evidence-store.mjs'),
      'record',
      '--cwd',
      fixture.projectDir,
      '--experiment-id',
      created.id,
      '--summary',
      'Old verification',
      '--status',
      'pass',
      '--at',
      '2020-01-01T00:00:00.000Z',
    ], fixture.projectDir)

    const payload = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'delivery-gate.mjs'),
      'check',
      '--cwd',
      fixture.projectDir,
      '--experiment-id',
      created.id,
      '--plan-id',
      created.id,
    ], fixture.projectDir))

    assert.equal(payload.overall, false)
    assert.equal(payload.checks.find((entry) => entry.check === 'evidence_fresh')?.pass, false)
  } finally {
    destroyFixture(fixture)
  }
})

test('delivery gate can consume experiment package evidence', () => {
  const fixture = createFixture()
  try {
    const created = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'experiment-store.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Experiment evidence gate',
      '--request',
      'Validate experiment evidence gate.',
    ], fixture.projectDir))

    runNode([
      join(pkgRoot, 'scripts', 'plan-package.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      created.id,
      '--title',
      'Experiment evidence gate',
      '--min-evidence',
      '1',
      '--max-evidence-age-hours',
      '24',
    ], fixture.projectDir)

    runNode([
      join(pkgRoot, 'scripts', 'evidence-store.mjs'),
      'record',
      '--cwd',
      fixture.projectDir,
      '--experiment-id',
      created.id,
      '--summary',
      'Experiment run completed',
      '--kind',
      'run-log',
      '--status',
      'pass',
      '--path',
      'outputs/run.log',
    ], fixture.projectDir)

    const payload = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'delivery-gate.mjs'),
      'check',
      '--cwd',
      fixture.projectDir,
      '--experiment-id',
      created.id,
      '--plan-id',
      created.id,
    ], fixture.projectDir))

    assert.equal(payload.overall, true)
    assert.equal(payload.experimentId, created.id)
    assert.equal(payload.checks.find((entry) => entry.check === 'target_consistency')?.pass, true)
    assert.equal(payload.checks.find((entry) => entry.check === 'experiment_package_exists')?.pass, true)
    assert.equal(payload.checks.find((entry) => entry.check === 'artifact_index_consistency')?.pass, true)
    const expDir = join(fixture.projectDir, 'hello-scholar', 'experiments', created.id)
    assert.equal(existsSync(join(expDir, 'delivery-gate.json')), true)
    assert(readFileSync(join(expDir, 'closeout.md'), 'utf-8').includes('PASS'))
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-delivery-gate-'))
  const projectDir = join(root, 'project')
  mkdirSync(projectDir, { recursive: true })
  return {
    root,
    projectDir,
  }
}

function destroyFixture(fixture) {
  rmSync(fixture.root, { recursive: true, force: true })
}

function runNode(args, cwd) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  return result.stdout.trim()
}
