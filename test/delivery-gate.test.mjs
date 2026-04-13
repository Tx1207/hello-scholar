import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('delivery gate passes with fresh evidence that satisfies contract', () => {
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

    runNode([
      join(pkgRoot, 'scripts', 'evidence-store.mjs'),
      'record',
      '--cwd',
      fixture.projectDir,
      '--target-id',
      'plan-evidence',
      '--summary',
      'Ran targeted tests',
      '--kind',
      'test',
      '--status',
      'pass',
      '--command',
      'node --test',
      '--file',
      'scripts/evidence-store.mjs',
    ], fixture.projectDir)

    const payload = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'delivery-gate.mjs'),
      'check',
      '--cwd',
      fixture.projectDir,
      '--target-id',
      'plan-evidence',
      '--plan-id',
      'plan-evidence',
    ], fixture.projectDir))

    assert.equal(payload.overall, true)
    assert(payload.checks.every((entry) => entry.pass))
    const closeout = readFileSync(join(fixture.projectDir, 'hello-scholar', 'evidence', 'plan-evidence', 'closeout.md'), 'utf-8')
    assert(closeout.includes('PASS'))
  } finally {
    destroyFixture(fixture)
  }
})

test('delivery gate fails with stale evidence', () => {
  const fixture = createFixture()
  try {
    runNode([
      join(pkgRoot, 'scripts', 'plan-package.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      'plan-stale',
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
      '--target-id',
      'plan-stale',
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
      '--target-id',
      'plan-stale',
      '--plan-id',
      'plan-stale',
    ], fixture.projectDir))

    assert.equal(payload.overall, false)
    assert.equal(payload.checks.find((entry) => entry.check === 'evidence_fresh')?.pass, false)
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
