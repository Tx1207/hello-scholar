import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('research-store initializes project, records reference run, and adds hypothesis', () => {
  const fixture = createFixture()
  try {
    runNode([
      join(pkgRoot, 'scripts', 'research-store.mjs'),
      'init-project',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Scholar runtime experiments',
      '--question',
      'How should hello-scholar store research truth?',
      '--dataset',
      'internal-benchmark-v1',
      '--evaluation',
      'accuracy',
    ])

    runNode([
      join(pkgRoot, 'scripts', 'research-store.mjs'),
      'add-run',
      '--cwd',
      fixture.projectDir,
      '--run-id',
      'run-001',
      '--reference',
      '--summary',
      'Baseline run',
      '--main-variable',
      'none',
      '--metric',
      'accuracy=0.81',
    ])

    runNode([
      join(pkgRoot, 'scripts', 'research-store.mjs'),
      'add-hypothesis',
      '--cwd',
      fixture.projectDir,
      '--hypothesis-id',
      'hyp-001',
      '--claim',
      'Smaller contract should reduce workflow drift',
      '--main-variable',
      'contract-size',
      '--allowed-file',
      'scripts/research-store.mjs',
    ])

    const summary = readFileSync(join(fixture.projectDir, 'hello-scholar', 'research', 'summary.md'), 'utf-8')
    const journal = readFileSync(join(fixture.projectDir, 'hello-scholar', 'research', 'journal.md'), 'utf-8')

    assert(summary.includes('Reference run: run-001'))
    assert(summary.includes('hyp-001'))
    assert(journal.includes('Run run-001'))
    assert(journal.includes('Hypothesis hyp-001'))
  } finally {
    destroyFixture(fixture)
  }
})

test('research-store blocks hypotheses without a reference run', () => {
  const fixture = createFixture()
  try {
    runNode([
      join(pkgRoot, 'scripts', 'research-store.mjs'),
      'init-project',
      '--cwd',
      fixture.projectDir,
      '--title',
      'No reference run',
      '--dataset',
      'benchmark',
      '--evaluation',
      'f1',
    ])

    const result = spawnSync(process.execPath, [
      join(pkgRoot, 'scripts', 'research-store.mjs'),
      'add-hypothesis',
      '--cwd',
      fixture.projectDir,
      '--hypothesis-id',
      'hyp-002',
      '--claim',
      'This should fail',
      '--main-variable',
      'batch-size',
    ], { encoding: 'utf-8' })

    assert.notEqual(result.status, 0)
    assert((result.stderr || result.stdout).includes('reference run'))
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-research-store-'))
  const projectDir = join(root, 'project')
  mkdirSync(projectDir, { recursive: true })
  return { root, projectDir }
}

function destroyFixture(fixture) {
  rmSync(fixture.root, { recursive: true, force: true })
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, { encoding: 'utf-8' })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  return result.stdout.trim()
}
