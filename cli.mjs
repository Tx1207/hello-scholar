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
} from './scripts/install/cli-config.mjs'
import { loadCatalog } from './scripts/profile/catalog-loader.mjs'
import { ensureProjectPreferences, formatEffectivePreferences } from './scripts/preferences/preferences-store.mjs'
import { resolveStatusOverlay } from './scripts/overlay/resolve.mjs'
import {
  installCodex,
  syncInstalledSelection,
  uninstallCodex,
} from './scripts/install/cli-codex.mjs'
import { writeProjectActivationPrompt } from './scripts/project-prompt.mjs'
import { parseArgv } from './scripts/cli-utils.mjs'
import { loadSelectionState, saveSelectionState } from './scripts/profile/selection-state.mjs'
import {
  formatCleanupSummary,
  formatInstallSummary,
  formatStatus,
  promptSelection,
  renderList,
} from './scripts/text-ui.mjs'

const pkgRoot = dirname(fileURLToPath(import.meta.url))
const runtime = getRuntimeContext(pkgRoot)
const argv = process.argv.slice(2)
const command = argv[0]

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

    if (!command || command === 'help' || command === '-h' || command === '--help') {
      printHelp()
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
        if (!process.stdin.isTTY || !process.stdout.isTTY) {
          console.log(renderList('profiles', catalog, state))
          process.exit(0)
        }

        const interaction = await promptSelection('profiles', catalog, state)
        if (interaction.cancelled) {
          console.log(interaction.message || '已退出，不保存修改。')
          process.exit(0)
        }

        if (interaction.changed) {
          console.log(saveAndSyncProfileSelection({
            catalog,
            cwd,
            installStateResult,
            nextState: interaction.nextState,
            runtime,
            scope,
          }))
          process.exit(0)
        }

        console.log(interaction.message || '未修改当前选择。')
        process.exit(0)
      }

      if (action === 'use') {
        const profileIds = parsed.positionals.slice(1)
        if (profileIds.length === 0) throw new Error('profile use requires <profile-id> [...profile-id].')
        for (const profileId of profileIds) {
          if (!catalog.profileMap.has(profileId)) throw new Error(`Unknown profile: ${profileId}`)
        }
        console.log(saveAndSyncProfileSelection({
          catalog,
          cwd,
          installStateResult,
          nextState: {
            ...state,
            activeProfile: profileIds[0],
            activeProfiles: profileIds,
            storageScope: scope,
          },
          runtime,
          scope,
        }))
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
      console.log(formatStatus(resolveStatusOverlay({ runtime, cwd, catalog, scope })))
      process.exit(0)
    }

    if (command === 'install') {
      const parsed = parseArgv(argv.slice(1))
      const host = parsed.positionals[0] || 'codex'
      if (host !== 'codex') {
        throw new Error(`Unsupported host: ${host}`)
      }
      if (
        parsed.getList('--' + 'bundle').length > 0 ||
        parsed.getList('--skills').length > 0 ||
        parsed.getList('--agents').length > 0 ||
        parsed.hasFlag('--no-base')
      ) {
        throw new Error('Install selection flags were removed. Use `hello-scholar profile use <profile-id>` before `hello-scholar install codex`.')
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
        ...currentState,
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

    if (command === 'cleanup') {
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
  hello-scholar help
  hello-scholar install codex [--standby|--global]
  hello-scholar cleanup codex [--standby|--global]
  hello-scholar profile list
  hello-scholar profile use <profile-id> [...profile-id]
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

function saveAndSyncProfileSelection({ catalog, cwd, installStateResult, nextState, runtime, scope }) {
  const savedSelection = saveSelectionState(catalog, {
    ...nextState,
    storageScope: scope,
  }, runtime, { cwd, scope })
  const syncResult = syncInstalledSelection(runtime, installStateResult, savedSelection, cwd, catalog)
  const activeProfiles = savedSelection.activeProfiles || [savedSelection.activeProfile || 'ml-development']

  if (syncResult) {
    saveInstallState(runtime, syncResult.nextInstallState, syncResult.mode, cwd)
    writeProjectActivationPrompt({ runtime, catalog, selection: savedSelection, mode: syncResult.mode, cwd })
    return `Profiles updated and synced: ${activeProfiles.join(', ')}`
  }

  return `Profiles saved: ${activeProfiles.join(', ')}\nRuntime is not installed. Run \`hello-scholar install codex\` to activate it.`
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
