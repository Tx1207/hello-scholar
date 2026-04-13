import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

import { resolveProjectStorage, saveProjectStorageConfig } from '../scripts/project-storage.mjs'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

test('project storage defaults to repo-local and can switch to shared root', () => {
  const fixture = createFixture()
  try {
    const initial = resolveProjectStorage(fixture.projectDir)
    assert.equal(initial.mode, 'repo-local')
    assert.equal(initial.rootPath, join(fixture.projectDir, 'hello-scholar'))

    const shared = saveProjectStorageConfig(fixture.projectDir, {
      mode: 'shared',
      rootPath: fixture.sharedRoot,
    })
    assert.equal(shared.mode, 'shared')
    assert.equal(shared.rootPath, fixture.sharedRoot)

    runNode([
      join(pkgRoot, 'scripts', 'change-tracker.mjs'),
      'refresh-index',
      '--cwd',
      fixture.projectDir,
    ])

    assert.equal(existsSync(join(fixture.sharedRoot, 'changes', 'INDEX.md')), true)
    assert.equal(existsSync(join(fixture.projectDir, 'hello-scholar', 'changes', 'INDEX.md')), false)
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-project-storage-'))
  const projectDir = join(root, 'project')
  const sharedRoot = join(root, 'shared-assets')
  mkdirSync(projectDir, { recursive: true })
  mkdirSync(sharedRoot, { recursive: true })
  return { root, projectDir, sharedRoot }
}

function destroyFixture(fixture) {
  rmSync(fixture.root, { recursive: true, force: true })
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, { encoding: 'utf-8' })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  return result.stdout.trim()
}
