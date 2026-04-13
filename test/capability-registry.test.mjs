import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
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

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-capability-registry-'))
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
