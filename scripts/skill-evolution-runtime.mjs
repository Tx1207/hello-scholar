import { resolve } from 'node:path'

import {
  detectInstalledScope,
  getRuntimeContext,
  getScopedStatePaths,
  loadInstallState,
  loadUserConfig,
  saveInstallState,
} from './cli-config.mjs'
import { loadCatalog } from './catalog-loader.mjs'
import { pathExists } from './cli-utils.mjs'
import { syncInstalledSelection } from './cli-codex.mjs'
import { writeProjectActivationPrompt } from './project-prompt.mjs'
import { loadSelectionState, saveSelectionState } from './selection-state.mjs'

export function activateEvolvedSkill(cwd, skillId, options = {}) {
  const effectiveCwd = resolve(cwd)
  const effectivePkgRoot = resolve(String(options.pkgRoot || '.'))
  const runtime = options.runtime || getRuntimeContext(effectivePkgRoot)
  const scope = options.scope || detectInstalledScope(runtime, effectiveCwd)
  const scopedPaths = getScopedStatePaths(runtime, effectiveCwd)
  const modulesPath = scope === 'global' ? scopedPaths.globalModulesPath : scopedPaths.projectModulesPath
  const installStateResult = loadInstallState(runtime, effectiveCwd, scope)
  const installMode = installStateResult.state.hosts?.codex?.mode || ''
  const hasManagedSelection = pathExists(modulesPath)

  if (!installMode && !hasManagedSelection) {
    return {
      activated: false,
      reason: 'hello-scholar is not installed in the current scope',
      scope,
    }
  }

  const userConfig = loadUserConfig(runtime, effectiveCwd, scope)
  const catalog = loadCatalog(effectivePkgRoot, { dynamic: true, cwd: effectiveCwd, runtime })
  if (!catalog.skillMap.has(skillId)) {
    throw new Error(`Skill is not available for activation: ${skillId}`)
  }

  const currentState = loadSelectionState(catalog, installStateResult.state, userConfig, runtime, {
    cwd: effectiveCwd,
    scope,
  })
  const explicitSkills = uniqueList([...currentState.explicitSkills, skillId])
  const savedSelection = saveSelectionState(catalog, {
    ...currentState,
    explicitSkills,
    storageScope: scope,
  }, runtime, { cwd: effectiveCwd, scope })

  const syncResult = syncInstalledSelection(runtime, installStateResult, savedSelection, effectiveCwd, catalog)
  if (syncResult) {
    saveInstallState(runtime, syncResult.nextInstallState, syncResult.mode, effectiveCwd)
  }

  const mode = syncResult?.mode || (scope === 'global' ? 'global' : 'standby')
  const prompt = writeProjectActivationPrompt({
    runtime,
    catalog,
    selection: savedSelection,
    mode,
    cwd: effectiveCwd,
  })

  return {
    activated: true,
    scope,
    mode,
    promptPath: prompt.activePromptPath,
    explicitSkillAdded: !currentState.explicitSkills.includes(skillId),
    selectedSkillCount: savedSelection.skills.length,
  }
}

function uniqueList(values) {
  return [...new Set((values || []).filter(Boolean))].sort()
}
