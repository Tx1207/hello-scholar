import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

import { addEvidence, addRun, analyzeExperiment, createExperiment } from '../scripts/experiment-store.mjs'
import { refreshResearchView } from '../scripts/research-store.mjs'

test('research-store derives summary and status from experiment packages', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'hello-scholar-research-view-'))
  try {
    const first = createExperiment({
      cwd: fixture,
      title: 'Focal loss',
      request: 'Try focal loss for minority-class recall.',
      now: new Date('2026-04-24T08:00:00.000Z'),
    })
    addRun({
      cwd: fixture,
      experimentId: first.id,
      kind: 'small-run',
      command: 'python train.py loss=focal',
      metrics: ['macro_f1=0.728'],
      now: new Date('2026-04-24T08:30:00.000Z'),
    })
    addEvidence({
      cwd: fixture,
      experimentId: first.id,
      kind: 'metric-log',
      status: 'pass',
      summary: 'Small run completed.',
      path: 'outputs/train.log',
      now: new Date('2026-04-24T08:40:00.000Z'),
    })
    analyzeExperiment({
      cwd: fixture,
      experimentId: first.id,
      summary: 'Recall improved.',
      decision: 'follow-up',
      now: new Date('2026-04-24T09:00:00.000Z'),
    })

    const second = createExperiment({
      cwd: fixture,
      title: 'Seed sweep',
      request: 'Check seed stability.',
      now: new Date('2026-04-24T10:00:00.000Z'),
    })

    const status = refreshResearchView(fixture)
    const summaryPath = join(fixture, 'hello-scholar', 'research', 'summary.md')
    const statusPath = join(fixture, 'hello-scholar', 'research', 'status.json')
    const summary = readFileSync(summaryPath, 'utf-8')
    const statusJson = JSON.parse(readFileSync(statusPath, 'utf-8'))

    assert.equal(status.source, 'experiment-packages')
    assert.equal(status.totalExperiments, 2)
    assert.equal(status.activeExperiment, second.id)
    assert.equal(status.countsByStatus.analyzed, 1)
    assert.equal(status.countsByStatus.in_progress, 1)
    assert.equal(status.experiments.find((entry) => entry.id === first.id).runCount, 1)
    assert.equal(status.experiments.find((entry) => entry.id === first.id).evidenceCount, 1)
    assert.equal(statusJson.source, 'experiment-packages')
    assert(summary.includes('Generated from experiment packages'))
    assert(summary.includes(first.id))
    assert(summary.includes(second.id))
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})

test('research-store rejects old second-source write commands', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'hello-scholar-research-legacy-'))
  try {
    const result = spawnSync(process.execPath, [
      new URL('../scripts/research-store.mjs', import.meta.url).pathname,
      'add-run',
      '--cwd',
      fixture,
      '--run-id',
      'run-001',
    ], { encoding: 'utf-8' })

    assert.notEqual(result.status, 0)
    assert((result.stderr || result.stdout).includes('Use scripts/experiment-store.mjs'))
    assert.equal(existsSync(join(fixture, 'hello-scholar', 'research', 'runs', 'run-001.json')), false)
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
