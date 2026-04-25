import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import {
  addEvidence,
  addRun,
  analyzeExperiment,
  appendChange,
  createExperiment,
  readExperimentStatus,
} from '../scripts/experiment-store.mjs'
import { readEvidenceTarget, recordEvidence, readEvidenceBundle } from '../scripts/evidence-store.mjs'
import { parseArgv } from '../scripts/cli-utils.mjs'
import { readRuntimeState } from '../scripts/runtime-state.mjs'

test('experiment store creates centralized experiment package and updates active state', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'hello-scholar-exp-'))
  try {
    const created = createExperiment({
      cwd: fixture,
      title: 'Focal loss',
      request: 'Try focal loss for minority-class recall.',
      now: new Date('2026-04-24T08:00:00.000Z'),
    })

    assert.match(created.id, /^EXP-20260424-080000-focal-loss$/)
    const expDir = join(fixture, 'hello-scholar', 'experiments', created.id)
    assert.equal(existsSync(join(expDir, 'experiment.yaml')), true)
    assert.equal(existsSync(join(expDir, 'README.md')), true)
    assert.equal(existsSync(join(expDir, 'changes.md')), true)
    assert.equal(existsSync(join(expDir, 'runs.md')), true)
    assert.equal(existsSync(join(expDir, 'evidence.md')), true)
    assert.equal(existsSync(join(expDir, 'analysis.md')), true)
    assert.equal(existsSync(join(expDir, 'artifacts.json')), true)

    const active = readFileSync(join(fixture, 'hello-scholar', 'state', 'active.json'), 'utf-8')
    assert(active.includes(created.id))
    const runtime = readRuntimeState(fixture)
    assert.equal(runtime.experiment.activeExperiment, created.id)
    assert.equal(runtime.experiment.activeProfile, 'ml-development')

    appendChange({ cwd: fixture, experimentId: created.id, summary: 'Added focal loss.', files: ['src/losses.py'] })
    addRun({ cwd: fixture, experimentId: created.id, kind: 'small-run', command: 'python train.py loss=focal', metrics: ['macro_f1=0.728'] })
    addEvidence({ cwd: fixture, experimentId: created.id, kind: 'log', status: 'pass', summary: 'Small run completed.', path: 'outputs/train.log' })
    analyzeExperiment({ cwd: fixture, experimentId: created.id, summary: 'Recall improved.', decision: 'follow-up' })

    assert(readFileSync(join(expDir, 'changes.md'), 'utf-8').includes('Added focal loss.'))
    assert(readFileSync(join(expDir, 'runs.md'), 'utf-8').includes('macro_f1=0.728'))
    assert(readFileSync(join(expDir, 'evidence.md'), 'utf-8').includes('Small run completed.'))
    assert(readFileSync(join(expDir, 'analysis.md'), 'utf-8').includes('Recall improved.'))
    assert(readFileSync(join(expDir, 'artifacts.json'), 'utf-8').includes('outputs/train.log'))

    const status = readExperimentStatus(fixture)
    assert.equal(status.activeExperiment, created.id)
    assert.deepEqual(status.experiments, [created.id])
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})

test('evidence store records active experiment evidence into the experiment package by default', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'hello-scholar-exp-evidence-'))
  try {
    const created = createExperiment({
      cwd: fixture,
      title: 'Seed sweep',
      request: 'Check seed stability.',
      now: new Date('2026-04-24T08:00:00.000Z'),
    })

    const result = recordEvidence(fixture, parseArgv([
      '--kind',
      'metric-log',
      '--status',
      'pass',
      '--summary',
      'Three seeds completed.',
      '--path',
      'outputs/seeds.json',
      '--at',
      '2026-04-24T09:00:00.000Z',
    ]))

    assert.equal(result.scope, 'experiment')
    assert.equal(result.experimentId, created.id)
    const expDir = join(fixture, 'hello-scholar', 'experiments', created.id)
    assert(readFileSync(join(expDir, 'evidence.md'), 'utf-8').includes('Three seeds completed.'))
    assert(readFileSync(join(expDir, 'artifacts.json'), 'utf-8').includes('outputs/seeds.json'))

    const bundle = readEvidenceBundle(fixture, created.id)
    assert.equal(bundle.entries.length, 1)
    assert.equal(bundle.entries[0].summary, 'Three seeds completed.')
    assert.equal(bundle.entries[0].files[0], 'outputs/seeds.json')
    assert.equal(existsSync(join(fixture, 'hello-scholar', 'evidence', created.id)), false)
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})

test('evidence store rejects explicit top-level target-id evidence writes', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'hello-scholar-target-evidence-'))
  try {
    createExperiment({
      cwd: fixture,
      title: 'Active experiment',
      request: 'Keep active experiment available.',
      now: new Date('2026-04-24T08:00:00.000Z'),
    })

    assert.throws(
      () => recordEvidence(fixture, parseArgv([
        '--target-id',
        'plan-evidence',
        '--summary',
        'Plan-level check completed.',
        '--status',
        'pass',
        '--at',
        '2026-04-24T09:00:00.000Z',
      ])),
      /Legacy top-level evidence targets are no longer write targets/,
    )
    assert.equal(existsSync(join(fixture, 'hello-scholar', 'evidence', 'plan-evidence', 'index.json')), false)
    assert.throws(
      () => readEvidenceTarget(fixture, parseArgv(['--target-id', 'plan-evidence'])),
      /Legacy top-level evidence targets are no longer readable/,
    )
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
