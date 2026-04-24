import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseArgv } from './cli-utils.mjs'
import { readWorkflowState, writeWorkflowState } from './workflow-state-store.mjs'

const FILE_NAME = 'advisor-state.json'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'read'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command === 'write') {
    console.log(JSON.stringify(writeAdvisorState(cwd, args), null, 2))
    return
  }
  if (command === 'read') {
    console.log(JSON.stringify(readWorkflowState(cwd, FILE_NAME), null, 2))
    return
  }
  throw new Error(`Unknown advisor-state command: ${command}`)
}

export function writeAdvisorState(cwd, args) {
  const status = String(args.getFlag('--status', '')).trim()
  if (!status) throw new Error('--status is required')
  return writeWorkflowState(cwd, FILE_NAME, {
    status,
    reason: String(args.getFlag('--reason', '')).trim(),
    focus: args.getList('--focus'),
    consultedSources: args.getList('--consulted-source'),
    conclusion: String(args.getFlag('--conclusion', '')).trim(),
    recommendations: args.getList('--recommendation'),
    planId: String(args.getFlag('--plan-id', '')).trim(),
    targetId: String(args.getFlag('--target-id', '')).trim(),
  })
}
