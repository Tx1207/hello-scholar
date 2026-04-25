import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

import { parseArgv, pathExists, readJson, writeJson, writeText } from './cli-utils.mjs'
import { resolveProjectStorage } from './project-storage.mjs'
import { readEvidenceBundle } from './evidence-store.mjs'
import { readRuntimeState } from './runtime-state.mjs'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'check'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command !== 'check') {
    throw new Error(`Unknown delivery-gate command: ${command}`)
  }
  console.log(JSON.stringify(runDeliveryGate(cwd, args), null, 2))
}

export function runDeliveryGate(cwd, args) {
  const requestedExperimentId = String(args.getFlag('--experiment-id', '')).trim()
  const requestedTargetId = String(args.getFlag('--target-id', '')).trim()
  const activeExperimentId = readRuntimeState(cwd).experiment.activeExperiment || ''
  const experimentId = requestedExperimentId || (requestedTargetId.startsWith('EXP-') ? requestedTargetId : String(activeExperimentId).trim())
  if (!experimentId) throw new Error('Delivery gate requires experiment evidence. Use --experiment-id or make an experiment active.')
  if (requestedTargetId && requestedTargetId !== experimentId) {
    throw new Error('Legacy top-level evidence targets are no longer delivery gate targets. Use --experiment-id for experiment delivery gates.')
  }
  const targetId = experimentId
  const storage = resolveProjectStorage(cwd)
  const contractPath = resolveContractPath(storage.rootPath, args, targetId)
  const contract = readJson(contractPath, null)
  if (!contract) throw new Error(`Missing contract: ${contractPath}`)
  const evidence = readEvidenceBundle(cwd, targetId)
  const diffFiles = currentDiffFiles(cwd)
  const consistency = readConsistencyContext(storage.rootPath, targetId, experimentId)
  const checks = evaluateChecks(contract, evidence, diffFiles, new Date(), consistency)
  const overall = checks.every((check) => check.pass)
  const payload = {
    targetId,
    experimentId,
    contractPath,
    checkedAt: new Date().toISOString(),
    checks,
    overall,
  }
  const gateRoot = join(storage.rootPath, 'experiments', experimentId)
  writeJson(join(gateRoot, 'delivery-gate.json'), payload)
  writeText(join(gateRoot, 'closeout.md'), renderCloseout(payload))
  return payload
}

function resolveContractPath(storageRoot, args, targetId) {
  const explicit = String(args.getFlag('--contract', '')).trim()
  if (explicit) return resolve(explicit)
  const planId = String(args.getFlag('--plan-id', targetId)).trim() || targetId
  return join(storageRoot, 'plans', planId, 'contract.json')
}

function readConsistencyContext(storageRoot, targetId, experimentId) {
  if (!experimentId) return { experimentId: null, experimentExists: true, artifactExperimentId: null }
  const experimentRoot = join(storageRoot, 'experiments', experimentId)
  const artifacts = readJson(join(experimentRoot, 'artifacts.json'), null)
  return {
    experimentId,
    experimentExists: pathExists(experimentRoot),
    artifactExperimentId: artifacts?.experimentId || null,
    targetMatchesExperiment: targetId === experimentId,
  }
}

function evaluateChecks(contract, evidence, diffFiles, now, consistency = {}) {
  const minEvidenceCount = Number(contract.deliveryGate?.minEvidenceCount || 1)
  const maxAgeHours = Number(contract.deliveryGate?.maxEvidenceAgeHours || 168)
  const requiresEvidence = contract.deliveryGate?.requiresEvidence !== false
  const latestTimestamp = evidence.entries.length > 0 ? new Date(evidence.entries.at(-1).timestamp) : null
  const ageHours = latestTimestamp ? (now.valueOf() - latestTimestamp.valueOf()) / (1000 * 60 * 60) : Number.POSITIVE_INFINITY
  const allowedFiles = Array.isArray(contract.allowedFiles) ? contract.allowedFiles : []
  const failingEvidence = evidence.entries.filter((entry) => entry.status === 'fail')
  const diffOutsideAllowed = allowedFiles.length === 0
    ? []
    : diffFiles.filter((file) => !allowedFiles.includes(file))

  const checks = [
    {
      check: 'target_consistency',
      pass: !consistency.experimentId || (consistency.targetMatchesExperiment && evidence.targetId === consistency.experimentId),
      detail: consistency.experimentId ? `target=${evidence.targetId}, experiment=${consistency.experimentId}` : 'not an experiment delivery gate',
    },
    {
      check: 'experiment_package_exists',
      pass: !consistency.experimentId || consistency.experimentExists,
      detail: consistency.experimentId ? `experiment=${consistency.experimentId}` : 'not an experiment delivery gate',
    },
    {
      check: 'artifact_index_consistency',
      pass: !consistency.experimentId || !consistency.artifactExperimentId || consistency.artifactExperimentId === consistency.experimentId,
      detail: consistency.experimentId ? `artifacts_experiment=${consistency.artifactExperimentId || 'missing'}` : 'not an experiment delivery gate',
    },
    {
      check: 'evidence_required',
      pass: !requiresEvidence || evidence.entries.length >= minEvidenceCount,
      detail: `count=${evidence.entries.length}, min=${minEvidenceCount}`,
    },
    {
      check: 'evidence_fresh',
      pass: !requiresEvidence || ageHours <= maxAgeHours,
      detail: Number.isFinite(ageHours) ? `age_hours=${ageHours.toFixed(2)}, max=${maxAgeHours}` : 'no evidence timestamp',
    },
    {
      check: 'no_failing_evidence',
      pass: failingEvidence.length === 0,
      detail: `failures=${failingEvidence.length}`,
    },
    {
      check: 'allowed_files',
      pass: diffOutsideAllowed.length === 0,
      detail: diffOutsideAllowed.length === 0 ? 'all diff files allowed' : `unexpected=${diffOutsideAllowed.join(', ')}`,
    },
  ]
  return checks
}

function currentDiffFiles(cwd) {
  const probe = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd,
    encoding: 'utf-8',
  })
  if (probe.status !== 0) return []
  const diff = spawnSync('git', ['diff', '--name-only'], {
    cwd,
    encoding: 'utf-8',
  })
  if (diff.status !== 0) return []
  return diff.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/\\/g, '/'))
}

function renderCloseout(payload) {
  return [
    `# Delivery Gate: ${payload.targetId}`,
    '',
    `- Checked: \`${payload.checkedAt}\``,
    `- Overall: \`${payload.overall ? 'PASS' : 'FAIL'}\``,
    '',
    '## Checks',
    '',
    ...payload.checks.map((check) => `- ${check.check}: ${check.pass ? 'PASS' : 'FAIL'} | ${check.detail}`),
  ].join('\n')
}
