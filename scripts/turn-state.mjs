import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseArgv } from './cli-utils.mjs'
import { readWorkflowState, writeWorkflowState } from './workflow-state-store.mjs'

const FILE_NAME = 'turn-state.json'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'read'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command === 'write') {
    console.log(JSON.stringify(writeTurnState(cwd, args), null, 2))
    return
  }
  if (command === 'read') {
    console.log(JSON.stringify(readWorkflowState(cwd, FILE_NAME), null, 2))
    return
  }
  throw new Error(`Unknown turn-state command: ${command}`)
}

export function writeTurnState(cwd, args) {
  const kind = String(args.getFlag('--kind', '')).trim()
  if (!kind) throw new Error('--kind is required')
  return writeWorkflowState(cwd, FILE_NAME, {
    kind,
    role: String(args.getFlag('--role', 'main')).trim() || 'main',
    reasonCategory: String(args.getFlag('--reason-category', '')).trim(),
    reason: String(args.getFlag('--reason', '')).trim(),
    summary: String(args.getFlag('--summary', '')).trim(),
    route: String(args.getFlag('--route', '')).trim(),
    tier: String(args.getFlag('--tier', '')).trim(),
    planId: String(args.getFlag('--plan-id', '')).trim(),
    targetId: String(args.getFlag('--target-id', '')).trim(),
  })
}
