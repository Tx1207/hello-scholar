import { getScopedStatePaths } from './cli-config.mjs'
import { ensureDir, readJson, writeJson } from './cli-utils.mjs'
import { resolveSelection } from './catalog-loader.mjs'

export function loadSelectionState(catalog, installState, userConfig, runtime, options = {}) {
  const cwd = options.cwd || process.cwd()
  const scope = options.scope || 'project'
  const paths = getScopedStatePaths(runtime, cwd)
  const modulesPath = scope === 'project' ? paths.projectModulesPath : paths.globalModulesPath
  const modules = readJson(modulesPath, null)
  const previous = installState.hosts?.codex || null

  if (modules) {
    const mode = modules.mode || previous?.mode || userConfig.install_mode
    const includeBase = modules.includeBase !== false && userConfig.auto_base !== false
    const bundles = uniqueList(modules.bundles || [])
    const explicit = inferExplicitSelection(catalog, {
      bundles,
      includeBase,
      explicitSkills: modules.explicitSkills,
      explicitAgents: modules.explicitAgents,
      legacySkills: modules.skills,
      legacyAgents: modules.agents,
    })
    return finalizeSelection(catalog, {
      mode,
      includeBase,
      bundles,
      explicitSkills: explicit.skills,
      explicitAgents: explicit.agents,
      storageScope: scope,
    })
  }

  if (previous) {
    const includeBase = userConfig.auto_base !== false
    const bundles = uniqueList(previous.bundles || [])
    const explicit = inferExplicitSelection(catalog, {
      bundles,
      includeBase,
      legacySkills: previous.selectedSkills || [],
      legacyAgents: previous.selectedAgents || [],
    })
    return finalizeSelection(catalog, {
      mode: previous.mode || userConfig.install_mode,
      includeBase,
      bundles,
      explicitSkills: explicit.skills,
      explicitAgents: explicit.agents,
      storageScope: scope,
    })
  }

  return finalizeSelection(catalog, {
    mode: scope === 'project' ? 'standby' : 'global',
    includeBase: userConfig.auto_base !== false,
    bundles: [],
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
    bundles: finalized.bundles,
    explicitSkills: finalized.explicitSkills,
    explicitAgents: finalized.explicitAgents,
    skills: finalized.skills,
    agents: finalized.agents,
    updatedAt: new Date().toISOString(),
  })
  return finalized
}

function finalizeSelection(catalog, state) {
  const storageScope = state.storageScope || 'project'
  const includeBase = state.includeBase !== false
  const bundles = uniqueList(state.bundles || [])
  const explicitSkills = uniqueList(state.explicitSkills || [])
  const explicitAgents = uniqueList(state.explicitAgents || [])
  const resolved = resolveSelection(catalog, {
    bundles,
    skills: explicitSkills,
    agents: explicitAgents,
    includeBase,
  })
  return {
    mode: storageScope === 'global' ? 'global' : 'standby',
    includeBase,
    bundles,
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
    bundles: payload.bundles || [],
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
