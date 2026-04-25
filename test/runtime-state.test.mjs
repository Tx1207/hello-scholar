import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import {
  readRuntimeState,
  updateRuntimeChangeState,
  updateRuntimeExperimentState,
  updateRuntimeProfileState,
  updateRuntimeStatusState,
} from '../scripts/runtime-state.mjs'

test('runtime state is the unified machine-readable state entry', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'hello-scholar-runtime-state-'))
  try {
    updateRuntimeExperimentState(fixture, { activeExperiment: 'EXP-1' }, new Date('2026-04-24T08:00:00.000Z'))
    updateRuntimeChangeState(fixture, { active_change_id: 'CHG-1' }, new Date('2026-04-24T08:01:00.000Z'))
    updateRuntimeProfileState(fixture, { activeProfile: 'paper-writing' }, new Date('2026-04-24T08:02:00.000Z'))
    updateRuntimeStatusState(fixture, { deliveryGate: { overall: true } }, new Date('2026-04-24T08:03:00.000Z'))

    const runtime = readRuntimeState(fixture)
    assert.equal(runtime.schemaVersion, 1)
    assert.equal(runtime.updatedAt, '2026-04-24T08:03:00.000Z')
    assert.equal(runtime.experiment.activeExperiment, 'EXP-1')
    assert.equal(runtime.change.active_change_id, 'CHG-1')
    assert.equal(runtime.profile.activeProfile, 'paper-writing')
    assert.equal(runtime.status.deliveryGate.overall, true)
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
