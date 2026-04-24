import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseArgv } from './cli-utils.mjs'
import { readWorkflowState, writeWorkflowState } from './workflow-state-store.mjs'

const FILE_NAME = 'closeout-state.json'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'read'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command === 'write') {
    console.log(JSON.stringify(writeCloseoutState(cwd, args), null, 2))
    return
  }
  if (command === 'read') {
    console.log(JSON.stringify(readWorkflowState(cwd, FILE_NAME), null, 2))
    return
  }
  throw new Error(`Unknown closeout-state command: ${command}`)
}

export function writeCloseoutState(cwd, args) {
  return writeWorkflowState(cwd, FILE_NAME, {
    planId: String(args.getFlag('--plan-id', '')).trim(),
    targetId: String(args.getFlag('--target-id', '')).trim(),
    requirementsCoverage: {
      status: String(args.getFlag('--requirements-status', 'BLOCKED')).trim() || 'BLOCKED',
      summary: String(args.getFlag('--requirements-summary', '')).trim(),
    },
    deliveryChecklist: {
      status: String(args.getFlag('--delivery-status', 'BLOCKED')).trim() || 'BLOCKED',
      summary: String(args.getFlag('--delivery-summary', '')).trim(),
    },
    notes: args.getList('--note'),
  })
}
