import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))
const helperPath = join(pkgRoot, 'skills', 'core', 'codex-hook-emulation', 'scripts', 'codex_hook_emulation.py')
const pythonBin = resolvePython()

test('preflight blocks mutating commands in ~idea route', () => {
  const result = spawnSync(pythonBin, [helperPath, 'preflight', '--json', '--route', '~idea', 'git commit -m test'], {
    encoding: 'utf-8',
  })
  assert.equal(result.status, 2, result.stdout)
  const payload = JSON.parse(result.stdout)
  assert.equal(payload.decision, 'block')
  assert(payload.reasons.includes('~idea route must stay side-effect free'))
})

test('preflight asks for confirmation before writing sensitive files', () => {
  const result = spawnSync(pythonBin, [helperPath, 'preflight', '--json', 'Set-Content .env api_key=demo'], {
    encoding: 'utf-8',
  })
  assert.equal(result.status, 3, result.stdout)
  const payload = JSON.parse(result.stdout)
  assert.equal(payload.decision, 'confirm')
})

function resolvePython() {
  for (const candidate of ['python3', 'python']) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf-8' })
    if (!probe.error) return candidate
  }
  throw new Error('Python interpreter not found')
}
