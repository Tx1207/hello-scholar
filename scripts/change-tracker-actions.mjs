import {
  ACTIVE_STATUSES,
  CONTINUE_PATTERNS,
  NEW_TASK_PATTERNS,
  appendTimestampedItems,
  buildResult,
  compactList,
  computeFileScore,
  computeTitleScore,
  createPlaceholderResult,
  formatLocalTime,
  isActiveStatus,
  isRecent,
  mergeUnique,
  normalizeFiles,
  normalizeTitle,
  requireText,
  splitLines,
} from './change-tracker-utils.mjs'
import {
  createRecord,
  ensureTrackingRoots,
  getActiveRecord,
  getPaths,
  loadWorkspace,
  writeIndexAndState,
  writeRecord,
} from './change-tracker-store.mjs'
import { runCloseoutAutomation } from './closeout-automation.mjs'

export function trackIntent(cwd, args) {
  const request = requireText(args.getFlag('--request', ''), '--request is required')
  const now = new Date()
  const paths = getPaths(cwd)
  ensureTrackingRoots(paths)
  const workspace = loadWorkspace(paths)
  const files = normalizeFiles(cwd, [...args.getList('--file'), ...args.getList('--files')])
  const route = String(args.getFlag('--route', workspace.state.route || '~auto')).trim() || '~auto'
  const tier = String(args.getFlag('--tier', workspace.state.tier || 'T1')).trim() || 'T1'
  const title = normalizeTitle(args.getFlag('--title', ''), request)
  const selection = selectIntentTarget(workspace, { request, title, files, now, args })
  const record = selection.record

  record.meta.updated = now.toISOString()
  record.meta.status = 'active'
  record.meta.route = route
  record.meta.tier = tier
  record.meta.decision = selection.decision
  record.meta.affected_files = mergeUnique(record.meta.affected_files || [], files)
  record.userRequests = appendTimestampedItems(record.userRequests, formatLocalTime(now), splitLines(request))
  record.intentSummary = compactList([
    `主目标：${title}`,
    `Route: ${route}`,
    `Tier: ${tier}`,
    `Decision: ${selection.decision}`,
  ])

  writeRecord(paths, record)
  const nextWorkspace = loadWorkspace(paths)
  writeIndexAndState(paths, nextWorkspace, record.id, isActiveStatus)
  return buildResult('track-intent', selection.decision, record, [
    selection.created ? 'Created a new change record.' : 'Appended to the active change record.',
    `Tracked ${splitLines(request).length} user request line(s).`,
  ])
}

export function trackChange(cwd, args) {
  const summary = requireText(args.getFlag('--summary', ''), '--summary is required')
  const now = new Date()
  const paths = getPaths(cwd)
  ensureTrackingRoots(paths)
  const workspace = loadWorkspace(paths)
  const files = normalizeFiles(cwd, [...args.getList('--file'), ...args.getList('--files')])
  const verification = splitLines(args.getFlag('--verification', '')).concat(args.getList('--verify'))
  const resultItems = splitLines(args.getFlag('--result', ''))
  const nextStepItems = splitLines(args.getFlag('--next-step', ''))
  const requestedStatus = String(args.getFlag('--status', 'active')).trim() || 'active'
  const record = selectRecordForUpdate(workspace, args.getFlag('--change-id', ''), summary, files, now)

  record.meta.updated = now.toISOString()
  record.meta.status = requestedStatus
  record.meta.affected_files = mergeUnique(record.meta.affected_files || [], files)
  record.actualChanges = appendTimestampedItems(record.actualChanges, formatLocalTime(now), splitLines(summary))
  record.verification = mergeUnique(record.verification, verification)
  record.result = mergeUnique(record.result, resultItems)
  record.nextStep = mergeUnique(record.nextStep, nextStepItems)

  writeRecord(paths, record)
  const nextWorkspace = loadWorkspace(paths)
  writeIndexAndState(paths, nextWorkspace, isActiveStatus(record.meta.status) ? record.id : '', isActiveStatus)
  return buildResult('track-change', 'update-current', record, [
    `Recorded ${splitLines(summary).length} actual change line(s).`,
    verification.length > 0 ? `Added ${verification.length} verification item(s).` : 'No verification items were added.',
  ])
}

export function trackCloseout(cwd, args) {
  const now = new Date()
  const paths = getPaths(cwd)
  ensureTrackingRoots(paths)
  const workspace = loadWorkspace(paths)
  const record = selectRecordForCloseout(workspace, args.getFlag('--change-id', ''))
  const closeSummary = splitLines(args.getFlag('--summary', ''))
  const resultItems = splitLines(args.getFlag('--result', ''))
  const nextStepItems = splitLines(args.getFlag('--next-step', ''))
  const status = String(args.getFlag('--status', 'done')).trim() || 'done'

  record.meta.updated = now.toISOString()
  record.meta.status = status
  if (closeSummary.length > 0) {
    record.actualChanges = appendTimestampedItems(record.actualChanges, formatLocalTime(now), closeSummary)
  }
  record.result = mergeUnique(record.result, resultItems)
  record.nextStep = mergeUnique(record.nextStep, nextStepItems)

  writeRecord(paths, record)
  const nextWorkspace = loadWorkspace(paths)
  writeIndexAndState(paths, nextWorkspace, '', isActiveStatus)
  const result = buildResult('track-closeout', 'close-current', record, [
    `Marked the change as ${status}.`,
    nextStepItems.length > 0 ? `Captured ${nextStepItems.length} next-step item(s).` : 'No next-step items were added.',
  ])
  const automation = runCloseoutAutomation(cwd, args, record)
  result.automation = automation
  result.notes = [...result.notes, ...automation.notes]
  return result
}

export function refreshIndexOnly(cwd) {
  const paths = getPaths(cwd)
  ensureTrackingRoots(paths)
  const workspace = loadWorkspace(paths)
  const active = getActiveRecord(workspace, isActiveStatus)
  writeIndexAndState(paths, workspace, active?.id || '', isActiveStatus)
  return buildResult('refresh-index', 'refresh-only', active || createPlaceholderResult(), [
    `Refreshed index for ${workspace.records.length} change record(s).`,
  ])
}

function selectIntentTarget(workspace, input) {
  const explicitId = String(input.args.getFlag('--change-id', '')).trim()
  if (explicitId) {
    const existing = workspace.records.find((record) => record.id === explicitId)
    if (!existing) throw new Error(`Unknown change id: ${explicitId}`)
    return { record: existing, decision: 'explicit-target', created: false }
  }
  if (input.args.hasFlag('--force-new')) {
    return { record: createRecord(workspace.records, input.title, input.files, input.now), decision: 'force-new', created: true }
  }

  const active = getActiveRecord(workspace, isActiveStatus)
  const decision = decideIntentTarget(active, input)
  if (decision === 'append-current' && active) {
    return { record: active, decision, created: false }
  }
  return { record: createRecord(workspace.records, input.title, input.files, input.now), decision, created: true }
}

function decideIntentTarget(active, input) {
  if (!active) return 'new-topic'
  if (!ACTIVE_STATUSES.has(active.meta.status)) return 'new-topic'
  if (NEW_TASK_PATTERNS.test(input.request)) return 'new-topic'

  const goalScore = computeTitleScore(active.title, `${input.title} ${input.request}`)
  const fileScore = computeFileScore(active.meta.affected_files || [], input.files)
  const wordingScore = CONTINUE_PATTERNS.test(input.request) ? 3 : 0
  const timeScore = isRecent(active.meta.updated, input.now) ? 1 : 0
  return goalScore + fileScore + wordingScore + timeScore >= 5 ? 'append-current' : 'new-topic'
}

function selectRecordForUpdate(workspace, explicitId, summary, files, now) {
  if (explicitId) {
    const existing = workspace.records.find((record) => record.id === explicitId)
    if (!existing) throw new Error(`Unknown change id: ${explicitId}`)
    return existing
  }
  const active = getActiveRecord(workspace, isActiveStatus)
  if (active) return active
  return createRecord(workspace.records, normalizeTitle('', summary), files, now)
}

function selectRecordForCloseout(workspace, explicitId) {
  if (explicitId) {
    const existing = workspace.records.find((record) => record.id === explicitId)
    if (!existing) throw new Error(`Unknown change id: ${explicitId}`)
    return existing
  }
  const active = getActiveRecord(workspace, isActiveStatus)
  if (!active) throw new Error('No active change record found to close.')
  return active
}
