import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('plan-package create writes requirements, tasks, and contract', () => {
  const fixture = createFixture()
  try {
    const output = runNode([
      join(pkgRoot, 'scripts', 'plan-package.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Implement evidence loop',
      '--goal',
      'Add contract-driven evidence storage',
      '--constraint',
      'Do not break current standby install',
      '--non-goal',
      'No Obsidian sync in this step',
      '--task',
      'Create evidence store script',
      '--task',
      'Add delivery gate checks',
      '--file',
      'scripts/evidence-store.mjs',
      '--file',
      'scripts/delivery-gate.mjs',
      '--verify-mode',
      'evidence-driven',
      '--reviewer-focus',
      'freshness and diff correctness',
      '--tester-focus',
      'contract fields and gate failures',
    ])

    const payload = JSON.parse(output)
    assert.match(payload.planId, /^PLAN-\d{8}-\d{6}-implement-evidence-loop$/)
    assert.equal(payload.planRoot, `hello-scholar/plans/${payload.planId}`)
    const planRoot = join(fixture.projectDir, payload.planRoot)
    assert.equal(existsSync(join(planRoot, 'requirements.md')), true)
    assert.equal(existsSync(join(planRoot, 'plan.md')), true)
    assert.equal(existsSync(join(planRoot, 'tasks.md')), true)
    assert.equal(existsSync(join(planRoot, 'contract.json')), true)

    const requirements = readFileSync(join(planRoot, 'requirements.md'), 'utf-8')
    const tasks = readFileSync(join(planRoot, 'tasks.md'), 'utf-8')
    const contract = JSON.parse(readFileSync(join(planRoot, 'contract.json'), 'utf-8'))

    assert(requirements.includes('Add contract-driven evidence storage'))
    assert(tasks.includes('Create evidence store script'))
    assert.equal(contract.verifyMode, 'evidence-driven')
    assert.deepEqual(contract.allowedFiles, ['scripts/evidence-store.mjs', 'scripts/delivery-gate.mjs'])
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-plan-package-'))
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

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  return result.stdout.trim()
}
