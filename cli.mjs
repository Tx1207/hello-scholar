#!/usr/bin/env node

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  detectInstalledScope,
  ensureGlobalStateRoot,
  getRuntimeContext,
  loadInstallState,
  loadUserConfig,
  saveInstallState,
} from './scripts/cli-config.mjs'
import { loadCatalog } from './scripts/catalog-loader.mjs'
import { readExperimentStatus } from './scripts/experiment-store.mjs'
import { ensureProjectPreferences, formatEffectivePreferences } from './scripts/preferences-store.mjs'
import {
  installCodex,
  readCodexDoctor,
  readCodexStatus,
  syncInstalledSelection,
  uninstallCodex,
} from './scripts/cli-codex.mjs'
import { writeProjectActivationPrompt } from './scripts/project-prompt.mjs'
import { parseArgv } from './scripts/cli-utils.mjs'
import { loadSelectionState, saveSelectionState } from './scripts/selection-state.mjs'
import {
  formatCleanupSummary,
  formatDoctor,
  formatInstallSummary,
  formatStatus,
  promptSelection,
  renderList,
} from './scripts/text-ui.mjs'

const pkgRoot = dirname(fileURLToPath(import.meta.url))
const runtime = getRuntimeContext(pkgRoot)
const argv = process.argv.slice(2)
const command = argv[0] || 'help'

await main()

async function main() {
  try {
    if (command === 'postinstall') {
      const stateInfo = ensureGlobalStateRoot(runtime)
      console.log(`hello-scholar installed. State root: ${stateInfo.stateRoot}`)
      process.exit(0)
    }

    const cwd = process.cwd()
    const catalog = loadCatalog(pkgRoot, { dynamic: true, cwd, runtime })

    if (command === 'help') {
      printHelp()
      process.exit(0)
    }

    if (command === 'list') {
      const parsed = parseArgv(argv.slice(1))
      const kind = parsed.positionals[0] || 'bundles'
      const scope = resolveScope(parsed, detectInstalledScope(runtime, cwd))
      const userConfig = loadUserConfig(runtime, cwd, scope)
      const installStateResult = loadInstallState(runtime, cwd, scope)
      const installState = installStateResult.state
      if (kind === 'base' || kind === 'default') {
        console.log('`list base/default` 已移除。默认 base 会自动随安装带上，无需单独查看。')
        process.exit(0)
      }
      if (!['bundles', 'skills', 'agents'].includes(kind)) {
        throw new Error(`Unsupported list kind: ${kind}`)
      }

      const state = loadSelectionState(catalog, installState, userConfig, runtime, { cwd, scope })
      if (!process.stdin.isTTY || !process.stdout.isTTY) {
        console.log(renderList(kind, catalog, state))
      }
      const interaction = await promptSelection(kind, catalog, state)
      if (interaction.cancelled) {
        console.log(interaction.message)
        process.exit(0)
      }
      if (interaction.changed) {
        const savedSelection = saveSelectionState(catalog, interaction.nextState, runtime, { cwd, scope: state.storageScope })
        const syncResult = syncInstalledSelection(runtime, installStateResult, savedSelection, cwd, catalog)
        if (syncResult) {
          saveInstallState(runtime, syncResult.nextInstallState, syncResult.mode, cwd)
          writeProjectActivationPrompt({
            runtime,
            catalog,
            selection: savedSelection,
            mode: syncResult.mode,
            cwd,
          })
        }
        console.log(interaction.message)
      } else if (interaction.message) {
        console.log(interaction.message)
      }
      process.exit(0)
    }

    if (command === 'profile') {
      const parsed = parseArgv(argv.slice(1))
      const action = parsed.positionals[0] || 'list'
      const scope = resolveScope(parsed, detectInstalledScope(runtime, cwd))
      const userConfig = loadUserConfig(runtime, cwd, scope)
      const installStateResult = loadInstallState(runtime, cwd, scope)
      const installState = installStateResult.state
      const state = loadSelectionState(catalog, installState, userConfig, runtime, { cwd, scope })

      if (action === 'list') {
        console.log(renderList('profiles', catalog, state))
        process.exit(0)
      }

      if (action === 'use') {
        const profileId = parsed.positionals[1]
        if (!profileId) throw new Error('profile use requires <profile-id>.')
        if (!catalog.profileMap.has(profileId)) throw new Error(`Unknown profile: ${profileId}`)
        const savedSelection = saveSelectionState(catalog, {
          ...state,
          activeProfile: profileId,
          storageScope: scope,
        }, runtime, { cwd, scope })
        const syncResult = syncInstalledSelection(runtime, installStateResult, savedSelection, cwd, catalog)
        if (syncResult) {
          saveInstallState(runtime, syncResult.nextInstallState, syncResult.mode, cwd)
          writeProjectActivationPrompt({ runtime, catalog, selection: savedSelection, mode: syncResult.mode, cwd })
          console.log(`Profile updated and synced: ${profileId}`)
        } else {
          console.log(`Profile saved: ${profileId}\nRuntime is not installed. Run \`hello-scholar install codex\` to activate it.`)
        }
        process.exit(0)
      }

      throw new Error(`Unsupported profile action: ${action}`)
    }

    if (command === 'preferences') {
      const parsed = parseArgv(argv.slice(1))
      const action = parsed.positionals[0] || 'show'
      if (action !== 'show') throw new Error(`Unsupported preferences action: ${action}`)
      const result = ensureProjectPreferences({ cwd, runtime })
      console.log(formatEffectivePreferences(result))
      process.exit(0)
    }

    if (command === 'status') {
      const parsed = parseArgv(argv.slice(1))
      const scope = resolveScope(parsed, detectInstalledScope(runtime, cwd))
      const installStateResult = loadInstallState(runtime, cwd, scope)
      const installStatus = readCodexStatus(runtime, installStateResult, cwd)
      const experimentStatus = readExperimentStatus(cwd)
      const preferences = ensureProjectPreferences({ cwd, runtime })
      console.log(formatStatus({
        ...installStatus,
        activeExperiment: experimentStatus.activeExperiment,
        experimentCount: experimentStatus.experiments.length,
        preferencesProjectFile: preferences.projectFile,
        preferencesGlobalFile: preferences.globalFile,
      }))
      process.exit(0)
    }

    if (command === 'doctor') {
      const parsed = parseArgv(argv.slice(1))
      const scope = resolveScope(parsed, detectInstalledScope(runtime, cwd))
      const installStateResult = loadInstallState(runtime, cwd, scope)
      console.log(formatDoctor(readCodexDoctor(runtime, installStateResult, cwd)))
      process.exit(0)
    }

    if (command === 'install' || command === 'update' || command === 'activate') {
      const parsed = parseArgv(argv.slice(1))
      const host = command === 'activate' ? 'codex' : (parsed.positionals[0] || 'codex')
      if (host !== 'codex') {
        throw new Error(`Unsupported host: ${host}`)
      }

      if (command === 'update') {
        console.log('`update codex` 已并入 `install codex`，将按当前选择继续安装。')
      }
      if (command === 'activate') {
        console.log('`activate` 已并入 `install codex`，将按当前选择继续安装。')
      }

      const explicitScope = resolveScope(parsed, detectInstalledScope(runtime, cwd))
      const mode = scopeToMode(explicitScope)
      const userConfig = loadUserConfig(runtime, cwd, explicitScope)
      const installStateResult = loadInstallState(runtime, cwd, explicitScope)
      const installState = installStateResult.state
      const currentState = loadSelectionState(catalog, installState, userConfig, runtime, {
        cwd,
        scope: explicitScope,
      })
      let nextState = currentState

      const hasLegacySelectionFlags =
        parsed.getList('--bundle').length > 0 ||
        parsed.getList('--skills').length > 0 ||
        parsed.getList('--agents').length > 0 ||
        parsed.hasFlag('--no-base')

      if (hasLegacySelectionFlags) {
        nextState = {
          ...currentState,
          includeBase: !parsed.hasFlag('--no-base') && userConfig.auto_base !== false,
          bundles: parsed.getList('--bundle'),
          explicitSkills: parsed.getList('--skills'),
          explicitAgents: parsed.getList('--agents'),
        }
      } else if (
        currentState.bundles.length === 0 &&
        currentState.explicitSkills.length === 0 &&
        currentState.explicitAgents.length === 0 &&
        process.stdin.isTTY &&
        process.stdout.isTTY
      ) {
        const interaction = await promptSelection('bundles', catalog, currentState)
        if (interaction.cancelled) {
          console.log(interaction.message)
          process.exit(0)
        }
        if (interaction.changed) {
          nextState = interaction.nextState
          console.log(interaction.message)
        }
      }

      const scope = mode === 'standby' ? 'project' : 'global'
      const projectInstallStateResult = scope === 'project'
        ? installStateResult
        : loadInstallState(runtime, cwd, 'project')
      const globalInstallStateResult = scope === 'global'
        ? installStateResult
        : loadInstallState(runtime, cwd, 'global')

      if (mode === 'standby' && globalInstallStateResult.state.hosts?.codex?.mode === 'global') {
        throw new Error('Global install is active. Run `hello-scholar cleanup codex --global` before installing standby.')
      }

      if (mode === 'global' && projectInstallStateResult.state.hosts?.codex?.mode === 'standby') {
        throw new Error('Standby install is active in this project. Run `hello-scholar cleanup codex --standby` before installing global.')
      }

      const savedSelection = saveSelectionState(catalog, {
        ...nextState,
        mode,
        storageScope: scope,
      }, runtime, { cwd, scope })

      const hostState = installCodex(runtime, savedSelection, mode, installState, cwd, catalog)
      const nextInstallState = {
        ...installState,
        install_mode: mode,
        auto_base: savedSelection.includeBase,
        last_host: 'codex',
        hosts: {
          ...installState.hosts,
          codex: hostState,
        },
      }
      saveInstallState(runtime, nextInstallState, mode, cwd)
      writeProjectActivationPrompt({
        runtime,
        catalog,
        selection: savedSelection,
        mode,
        cwd,
      })
      console.log(formatInstallSummary(hostState, savedSelection, mode, cwd))
      process.exit(0)
    }

    if (command === 'cleanup' || command === 'uninstall') {
      const parsed = parseArgv(argv.slice(1))
      const host = parsed.positionals[0] || 'codex'
      const scope = resolveScope(parsed, detectInstalledScope(runtime, cwd))
      const installStateResult = loadInstallState(runtime, cwd, scope)
      const installState = installStateResult.state
      if (host !== 'codex') {
        throw new Error(`Unsupported host: ${host}`)
      }
      const cleanup = uninstallCodex(runtime, installStateResult, cwd)
      const nextState = removeCodexHost(installState)
      const cleanupMode = scopeToMode(installStateResult.scope)
      saveInstallState(runtime, nextState, cleanupMode, cwd)
      console.log(formatCleanupSummary({
        cwd,
        ...cleanup,
      }))
      process.exit(0)
    }

    throw new Error(`Unknown command: ${command}`)
  } catch (error) {
    console.error(`hello-scholar error: ${error.message}`)
    process.exitCode = 1
  }
}

function printHelp() {
  console.log(`
hello-scholar

Usage:
  hello-scholar install codex [--standby|--global]
  hello-scholar cleanup codex [--standby|--global]
  hello-scholar profile list
  hello-scholar profile use <profile-id>
  hello-scholar preferences show
  hello-scholar status [--standby|--global]

Notes:
  - 正式入口保持最小化：安装、清理、profile 切换、偏好查看和状态查看
  - \`install codex\` 会使用当前 profile selection 并完成安装
  - 无 flag 时默认处理当前项目的 \`standby\`
  - 默认 base 会自动安装，无需单独查看
`)
}

function resolveScope(parsed, defaultScope = 'project') {
  const hasStandby = parsed.hasFlag('--standby')
  const hasGlobal = parsed.hasFlag('--global')
  if (hasStandby && hasGlobal) {
    throw new Error('Use either --standby or --global, not both.')
  }
  if (hasGlobal) return 'global'
  if (hasStandby) return 'project'
  return defaultScope
}

function scopeToMode(scope) {
  return scope === 'global' ? 'global' : 'standby'
}

function removeCodexHost(installState) {
  const nextState = {
    ...(installState || {}),
    hosts: {
      ...((installState && installState.hosts) || {}),
    },
  }
  delete nextState.hosts.codex
  return nextState
}
