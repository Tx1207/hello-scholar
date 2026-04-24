import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { parseArgv } from './cli-utils.mjs'
import { readWorkflowState, writeWorkflowState } from './workflow-state-store.mjs'

const FILE_NAME = 'review-state.json'

main()

function main() {
  if (process.argv[1] !== fileURLToPath(import.meta.url)) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'read'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))
  if (command === 'write') {
    console.log(JSON.stringify(writeReviewState(cwd, args), null, 2))
    return
  }
  if (command === 'read') {
    console.log(JSON.stringify(readWorkflowState(cwd, FILE_NAME), null, 2))
    return
  }
  throw new Error(`Unknown review-state command: ${command}`)
}

export function writeReviewState(cwd, args) {
  const outcome = String(args.getFlag('--outcome', '')).trim()
  if (!outcome) throw new Error('--outcome is required')
  return writeWorkflowState(cwd, FILE_NAME, {
    outcome,
    conclusion: String(args.getFlag('--conclusion', '')).trim(),
    findings: args.getList('--finding'),
    fileReferences: args.getList('--file-reference'),
    planId: String(args.getFlag('--plan-id', '')).trim(),
    targetId: String(args.getFlag('--target-id', '')).trim(),
  })
}
