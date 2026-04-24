import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('workflow state scripts write structured payloads into hello-scholar/state', () => {
  const fixture = createFixture()
  try {
    runNode([
      join(pkgRoot, 'scripts', 'turn-state.mjs'),
      'write',
      '--cwd',
      fixture.projectDir,
      '--kind',
      'complete',
      '--role',
      'main',
      '--summary',
      'Finished verification loop',
    ])

    runNode([
      join(pkgRoot, 'scripts', 'review-state.mjs'),
      'write',
      '--cwd',
      fixture.projectDir,
      '--outcome',
      'clean',
      '--conclusion',
      '未发现阻塞问题。',
      '--file-reference',
      'src/app.ts:42',
    ])

    runNode([
      join(pkgRoot, 'scripts', 'visual-state.mjs'),
      'write',
      '--cwd',
      fixture.projectDir,
      '--status',
      'PASS',
      '--tooling',
      'code-review',
      '--screen',
      'dashboard',
      '--state',
      'loading',
      '--summary',
      'Checked primary screen states',
    ])

    runNode([
      join(pkgRoot, 'scripts', 'closeout-state.mjs'),
      'write',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      'plan-001',
      '--requirements-status',
      'PASS',
      '--requirements-summary',
      'Requirements covered',
      '--delivery-status',
      'PASS',
      '--delivery-summary',
      'Delivery checklist complete',
    ])

    const stateRoot = join(fixture.projectDir, 'hello-scholar', 'state')
    const turnState = JSON.parse(readFileSync(join(stateRoot, 'turn-state.json'), 'utf-8'))
    const reviewState = JSON.parse(readFileSync(join(stateRoot, 'review-state.json'), 'utf-8'))
    const visualState = JSON.parse(readFileSync(join(stateRoot, 'visual-state.json'), 'utf-8'))
    const closeoutState = JSON.parse(readFileSync(join(stateRoot, 'closeout-state.json'), 'utf-8'))

    assert.equal(turnState.kind, 'complete')
    assert.equal(reviewState.outcome, 'clean')
    assert.deepEqual(visualState.screensChecked, ['dashboard'])
    assert.equal(closeoutState.requirementsCoverage.status, 'PASS')
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-workflow-state-'))
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
