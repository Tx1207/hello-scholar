export const SKILL_EVOLUTION_FLOW = [
  'candidate',
  'previewed',
  'approval_pending',
  'approved',
  'applied_overlay',
  'tested',
  'merge_ready',
  'merged_repo',
]

export const SKILL_EVOLUTION_TRANSITIONS = {
  preview: {
    from: ['candidate', 'needs_repair', 'previewed', 'approval_pending'],
    to: 'approval_pending',
    actor: 'script',
  },
  approve_overlay: {
    from: ['approval_pending'],
    to: 'approved',
    actor: 'user',
  },
  apply_overlay: {
    from: ['approved'],
    to: 'applied_overlay',
    actor: 'script',
  },
  test_overlay: {
    from: ['applied_overlay'],
    to: 'tested',
    actor: 'script',
  },
  mark_merge_ready: {
    from: ['applied_overlay', 'tested'],
    to: 'merge_ready',
    actor: 'user',
  },
  merge_repo: {
    from: ['applied_overlay', 'tested', 'merge_ready'],
    to: 'merged_repo',
    actor: 'script',
  },
  keep_candidate: {
    from: ['approval_pending', 'applied_overlay', 'tested'],
    to: 'kept',
    actor: 'user',
  },
  reject: {
    from: ['candidate', 'previewed', 'approval_pending'],
    to: 'rejected',
    actor: 'user',
  },
  reset_candidate: {
    from: ['candidate', 'previewed', 'approval_pending', 'approved', 'applied_overlay', 'tested', 'merge_ready', 'needs_repair'],
    to: 'candidate',
    actor: 'user',
  },
}

export function detectCandidateConsistencyIssues(candidate) {
  const issues = []
  if (candidate.status === 'approved' && !candidate.preview?.hash) {
    issues.push('candidate.status is approved but preview.hash is missing')
  }
  if (candidate.approval?.approved && !candidate.approval?.previewHash) {
    issues.push('approval is marked approved but approval.previewHash is missing')
  }
  if (candidate.apply?.status === 'applied' && candidate.status !== 'applied') {
    issues.push(`apply.status is applied but candidate.status is ${candidate.status}`)
  }
  if (candidate.merge?.status === 'merged' && candidate.status !== 'merged') {
    issues.push(`merge.status is merged but candidate.status is ${candidate.status}`)
  }
  return issues
}

export function deriveSkillEvolutionState(candidate) {
  const issues = detectCandidateConsistencyIssues(candidate)
  if (issues.length > 0) return 'needs_repair'
  if (candidate.merge?.status === 'merged' || candidate.status === 'merged') return 'merged_repo'
  if (candidate.merge?.status === 'ready' || candidate.status === 'merge_ready') return 'merge_ready'
  if (candidate.test?.status === 'tested' || candidate.status === 'tested') return 'tested'
  if (candidate.apply?.status === 'applied' || candidate.status === 'applied') return 'applied_overlay'
  if (candidate.approval?.approved && candidate.approval.status === 'approved') return 'approved'
  if (candidate.preview?.hash) return 'approval_pending'
  if (candidate.status === 'rejected') return 'rejected'
  if (candidate.status === 'kept') return 'kept'
  return 'candidate'
}

export function buildSkillEvolutionWorkflow(candidate) {
  const current = deriveSkillEvolutionState(candidate)
  const issues = detectCandidateConsistencyIssues(candidate)
  const allowedTransitions = Object.entries(SKILL_EVOLUTION_TRANSITIONS)
    .filter(([, transition]) => transition.from.includes(current))
    .map(([name]) => name)
  const blockedTransitions = Object.keys(SKILL_EVOLUTION_TRANSITIONS)
    .filter((name) => !allowedTransitions.includes(name))
  return {
    flow: SKILL_EVOLUTION_FLOW,
    current,
    nextRequiredActor: nextActorForState(current),
    allowedTransitions,
    blockedTransitions,
    issues,
  }
}

export function assertTransitionAllowed(candidate, transitionName) {
  const workflow = buildSkillEvolutionWorkflow(candidate)
  const transition = SKILL_EVOLUTION_TRANSITIONS[transitionName]
  if (!transition) throw new Error(`Unknown skill evolution transition: ${transitionName}`)
  if (workflow.issues.length > 0 && transitionName !== 'preview') {
    throw new Error([
      `candidate state is inconsistent; ${transitionName} is blocked`,
      ...workflow.issues.map((issue) => `- ${issue}`),
      'Run preview again to rebuild a fresh preview and reset approval to pending.',
    ].join('\n'))
  }
  if (!transition.from.includes(workflow.current)) {
    if (transitionName === 'apply_overlay' && workflow.current === 'candidate') {
      throw new Error('apply requires preview to run first')
    }
    throw new Error(`transition ${transitionName} is not allowed from ${workflow.current}`)
  }
  return workflow
}

export function appendTransition(candidate, transitionName, now = new Date().toISOString()) {
  const transition = SKILL_EVOLUTION_TRANSITIONS[transitionName]
  return {
    ...(candidate.state || {}),
    current: transition.to,
    lastTransition: transitionName,
    lastTransitionAt: now,
    transitions: [
      ...(candidate.state?.transitions || []),
      {
        name: transitionName,
        from: deriveSkillEvolutionState(candidate),
        to: transition.to,
        actor: transition.actor,
        at: now,
      },
    ],
  }
}

function nextActorForState(state) {
  if (['approval_pending', 'merge_ready', 'needs_repair'].includes(state)) return 'user'
  if (['candidate', 'approved', 'applied_overlay', 'tested'].includes(state)) return 'script'
  return 'none'
}
