import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseArgv } from './cli-utils.mjs'
import { readWorkflowState, writeWorkflowState } from './workflow-state-store.mjs'

const FILE_NAME = 'visual-state.json'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'read'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command === 'write') {
    console.log(JSON.stringify(writeVisualState(cwd, args), null, 2))
    return
  }
  if (command === 'read') {
    console.log(JSON.stringify(readWorkflowState(cwd, FILE_NAME), null, 2))
    return
  }
  throw new Error(`Unknown visual-state command: ${command}`)
}

export function writeVisualState(cwd, args) {
  const status = String(args.getFlag('--status', '')).trim()
  if (!status) throw new Error('--status is required')
  return writeWorkflowState(cwd, FILE_NAME, {
    status,
    reason: String(args.getFlag('--reason', '')).trim(),
    tooling: String(args.getFlag('--tooling', '')).trim(),
    screensChecked: args.getList('--screen'),
    statesChecked: args.getList('--state'),
    summary: String(args.getFlag('--summary', '')).trim(),
    findings: args.getList('--finding'),
    recommendations: args.getList('--recommendation'),
    planId: String(args.getFlag('--plan-id', '')).trim(),
    targetId: String(args.getFlag('--target-id', '')).trim(),
  })
}
