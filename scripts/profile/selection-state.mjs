import { getScopedStatePaths } from '../install/cli-config.mjs'
import { ensureDir, readJson, writeJson } from '../cli-utils.mjs'
import { readRuntimeState, updateRuntimeProfileState } from '../runtime-state.mjs'
import { resolveSelection } from './catalog-loader.mjs'

export function loadSelectionState(catalog, installState, userConfig, runtime, options = {}) {
  const cwd = options.cwd || process.cwd()
  const scope = options.scope || 'project'
  const paths = getScopedStatePaths(runtime, cwd)
  const modulesPath = scope === 'project' ? paths.projectModulesPath : paths.globalModulesPath
  const modules = readJson(modulesPath, null)
  const previous = installState.hosts?.codex || null
  const runtimeProfile = scope === 'project' ? readRuntimeState(cwd).profile : {}

  if (modules) {
    const mode = modules.mode || previous?.mode || userConfig.install_mode
    const includeBase = modules.includeBase !== false && userConfig.auto_base !== false
    const baseProfile = runtimeProfile.baseProfile || modules.baseProfile || 'ml-development'
    const activeProfiles = normalizeActiveProfiles(runtimeProfile.activeProfiles || modules.activeProfiles, runtimeProfile.activeProfile || modules.activeProfile || baseProfile)
    const activeProfile = activeProfiles[0] || baseProfile
    const explicit = inferExplicitSelection(catalog, {
      includeBase,
      explicitSkills: modules.explicitSkills,
      explicitAgents: modules.explicitAgents,
      legacySkills: modules.skills,
      legacyAgents: modules.agents,
    })
    return finalizeSelection(catalog, {
      mode,
      includeBase,
      baseProfile,
      activeProfile,
      activeProfiles,
      explicitSkills: explicit.skills,
      explicitAgents: explicit.agents,
      storageScope: scope,
    })
  }

  if (previous) {
    const includeBase = userConfig.auto_base !== false
    const baseProfile = runtimeProfile.baseProfile || previous.baseProfile || 'ml-development'
    const activeProfiles = normalizeActiveProfiles(runtimeProfile.activeProfiles || previous.activeProfiles, runtimeProfile.activeProfile || previous.activeProfile || baseProfile)
    const activeProfile = activeProfiles[0] || baseProfile
    const explicit = inferExplicitSelection(catalog, {
      includeBase,
      legacySkills: previous.selectedSkills || [],
      legacyAgents: previous.selectedAgents || [],
    })
    return finalizeSelection(catalog, {
      mode: previous.mode || userConfig.install_mode,
      includeBase,
      baseProfile,
      activeProfile,
      activeProfiles,
      explicitSkills: explicit.skills,
      explicitAgents: explicit.agents,
      storageScope: scope,
    })
  }

  return finalizeSelection(catalog, {
    mode: scope === 'project' ? 'standby' : 'global',
    includeBase: userConfig.auto_base !== false,
    baseProfile: 'ml-development',
    activeProfile: 'ml-development',
    activeProfiles: ['ml-development'],
    explicitSkills: [],
    explicitAgents: [],
    storageScope: scope,
  })
}

export function saveSelectionState(catalog, nextState, runtime, options = {}) {
  const cwd = options.cwd || process.cwd()
  const scope = options.scope || nextState.storageScope || 'project'
  const paths = getScopedStatePaths(runtime, cwd)
  const stateRoot = scope === 'project' ? paths.projectStateRoot : paths.globalStateRoot
  const modulesPath = scope === 'project' ? paths.projectModulesPath : paths.globalModulesPath
  const finalized = finalizeSelection(catalog, {
    ...nextState,
    storageScope: scope,
  })

  ensureDir(stateRoot)
  writeJson(modulesPath, {
    runtime: 'hello-scholar',
    mode: finalized.mode,
    includeBase: finalized.includeBase,
    baseProfile: finalized.baseProfile,
    activeProfile: finalized.activeProfile,
    activeProfiles: finalized.activeProfiles,
    explicitSkills: finalized.explicitSkills,
    explicitAgents: finalized.explicitAgents,
    skills: finalized.skills,
    agents: finalized.agents,
    updatedAt: new Date().toISOString(),
  })
  if (scope === 'project') {
    updateRuntimeProfileState(cwd, {
      mode: finalized.mode,
      includeBase: finalized.includeBase,
      baseProfile: finalized.baseProfile,
      activeProfile: finalized.activeProfile,
      activeProfiles: finalized.activeProfiles,
      explicitSkills: finalized.explicitSkills,
      explicitAgents: finalized.explicitAgents,
      skills: finalized.skills,
      agents: finalized.agents,
    })
  }
  return finalized
}

function finalizeSelection(catalog, state) {
  const storageScope = state.storageScope || 'project'
  const includeBase = state.includeBase !== false
  const baseProfile = state.baseProfile || 'ml-development'
  const activeProfiles = normalizeActiveProfiles(state.activeProfiles, state.activeProfile || baseProfile)
  const activeProfile = activeProfiles[0] || baseProfile
  const explicitSkills = uniqueList(state.explicitSkills || [])
  const explicitAgents = uniqueList(state.explicitAgents || [])
  const resolved = resolveSelection(catalog, {
    activeProfiles,
    skills: explicitSkills,
    agents: explicitAgents,
    includeBase,
    baseProfile,
    activeProfile,
  })
  return {
    mode: storageScope === 'global' ? 'global' : 'standby',
    includeBase,
    baseProfile: resolved.baseProfile,
    activeProfile: resolved.activeProfile,
    activeProfiles: resolved.activeProfiles,
    explicitSkills,
    explicitAgents,
    skills: resolved.skills,
    agents: resolved.agents,
    storageScope,
  }
}

function inferExplicitSelection(catalog, payload) {
  if (Array.isArray(payload.explicitSkills) || Array.isArray(payload.explicitAgents)) {
    return {
      skills: uniqueList(payload.explicitSkills || []),
      agents: uniqueList(payload.explicitAgents || []),
    }
  }

  const derived = resolveSelection(catalog, {
    includeBase: payload.includeBase !== false,
  })

  return {
    skills: uniqueList((payload.legacySkills || []).filter((id) => !derived.skills.includes(id))),
    agents: uniqueList((payload.legacyAgents || []).filter((id) => !derived.agents.includes(id))),
  }
}

function uniqueList(values) {
  return [...new Set((values || []).filter(Boolean))].sort()
}

function normalizeActiveProfiles(activeProfiles, fallback) {
  if (Array.isArray(activeProfiles)) return uniqueList(activeProfiles)
  if (typeof activeProfiles === 'string' && activeProfiles.trim()) {
    return uniqueList(activeProfiles.split(',').map((entry) => entry.trim()))
  }
  return uniqueList([fallback])
}
