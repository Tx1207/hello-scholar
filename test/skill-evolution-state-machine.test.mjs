import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  appendTransition,
  assertTransitionAllowed,
  buildSkillEvolutionWorkflow,
  deriveSkillEvolutionState,
} from '../scripts/evolution/skill-evolution-state-machine.mjs'

test('state machine derives candidate lifecycle states', () => {
  assert.equal(deriveSkillEvolutionState({ status: 'proposed' }), 'candidate')
  assert.equal(deriveSkillEvolutionState({ status: 'previewed', preview: { hash: 'abc' } }), 'approval_pending')
  assert.equal(deriveSkillEvolutionState({
    status: 'approved',
    preview: { hash: 'abc' },
    approval: { approved: true, status: 'approved', previewHash: 'abc' },
  }), 'approved')
  assert.equal(deriveSkillEvolutionState({ status: 'applied', apply: { status: 'applied' } }), 'applied_overlay')
  assert.equal(deriveSkillEvolutionState({ status: 'merged', merge: { status: 'merged' } }), 'merged_repo')
})

test('state machine blocks inconsistent candidates except preview repair', () => {
  const candidate = {
    status: 'approved',
    approval: { approved: true, status: 'approved' },
  }
  const workflow = buildSkillEvolutionWorkflow(candidate)
  assert.equal(workflow.current, 'needs_repair')
  assert(workflow.allowedTransitions.includes('preview'))
  assert.doesNotThrow(() => assertTransitionAllowed(candidate, 'preview'))
  assert.throws(() => assertTransitionAllowed(candidate, 'apply_overlay'), /candidate state is inconsistent/)
})

test('transition append records auditable state trail', () => {
  const candidate = { status: 'proposed' }
  const state = appendTransition(candidate, 'preview', '2026-04-25T00:00:00.000Z')
  assert.equal(state.current, 'approval_pending')
  assert.equal(state.lastTransition, 'preview')
  assert.deepEqual(state.transitions.at(-1), {
    name: 'preview',
    from: 'candidate',
    to: 'approval_pending',
    actor: 'script',
    at: '2026-04-25T00:00:00.000Z',
  })
})
