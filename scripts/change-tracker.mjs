import { parseArgv } from './cli-utils.mjs'
import {
  refreshIndexOnly,
  trackChange,
  trackCloseout,
  trackIntent,
} from './change-tracker-actions.mjs'

main()

function main() {
  const args = parseArgv(process.argv.slice(2))
  const [command = ''] = args.positionals
  const cwd = String(args.getFlag('--cwd', process.cwd()))
  const json = args.hasFlag('--json')

  try {
    const result = runCommand(command, cwd, args)
    emit(result, json)
  } catch (error) {
    emitError(error, json)
    process.exitCode = 1
  }
}

function runCommand(command, cwd, args) {
  if (command === 'track-intent') return trackIntent(cwd, args)
  if (command === 'track-change') return trackChange(cwd, args)
  if (command === 'track-closeout') return trackCloseout(cwd, args)
  if (command === 'refresh-index') return refreshIndexOnly(cwd)
  throw new Error(`Unknown change-tracker command: ${command || '<missing>'}`)
}

function emit(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2))
    return
  }
  console.log('== hello-scholar Change Tracker ==')
  console.log(`- Action: ${result.action}`)
  console.log(`- Decision: ${result.decision}`)
  console.log(`- Change ID: ${result.change.id}`)
  console.log(`- Title: ${result.change.title}`)
  console.log(`- File: ${result.change.file}`)
  if (result.notes.length > 0) {
    console.log('- Notes:')
    for (const note of result.notes) {
      console.log(`  - ${note}`)
    }
  }
}

function emitError(error, asJson) {
  const message = error instanceof Error ? error.message : String(error)
  if (asJson) {
    console.error(JSON.stringify({ ok: false, error: message }, null, 2))
    return
  }
  console.error(`change-tracker failed: ${message}`)
}
