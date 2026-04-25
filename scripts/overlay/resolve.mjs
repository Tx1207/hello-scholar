import { loadInstallState } from '../install/cli-config.mjs'
import { readCodexStatus } from '../install/cli-codex.mjs'
import { readExperimentStatus } from '../experiment-store.mjs'
import { getPaths as getChangePaths, getActiveRecord, loadWorkspace } from '../change-tracker-store.mjs'
import { isActiveStatus } from '../change-tracker-utils.mjs'
import { ensureProjectPreferences } from '../preferences/preferences-store.mjs'

export function resolveStatusOverlay({ runtime, cwd = process.cwd(), catalog, scope = 'project' }) {
  const preferredScope = scope === 'global' ? 'global' : 'project'
  const selectedInstallState = loadInstallState(runtime, cwd, preferredScope)
  const selectedStatus = readCodexStatus(runtime, selectedInstallState, cwd)
  const standby = readSideStatus(runtime, cwd, 'project')
  const global = readSideStatus(runtime, cwd, 'global')
  const experimentStatus = readExperimentStatus(cwd)
  const preferences = ensureProjectPreferences({ cwd, runtime })
  const activeChange = readActiveChange(cwd)
  const skillSummary = summarizeSkills(catalog)

  return {
    ...selectedStatus,
    displayScope: preferredScope === 'global' ? 'global' : 'standby',
    standbyInstall: standby,
    globalInstall: global,
    activeChange,
    activeExperiment: experimentStatus.activeExperiment,
    experimentCount: experimentStatus.experiments.length,
    overlaySkillCount: skillSummary.overlaySkillCount,
    repoSkillCount: skillSummary.repoSkillCount,
    preferencesProjectFile: preferences.projectFile,
    preferencesGlobalFile: preferences.globalFile,
    preferenceSources: summarizePreferenceSources(preferences.sources),
  }
}

function readSideStatus(runtime, cwd, scope) {
  const installState = loadInstallState(runtime, cwd, scope)
  const hostState = installState.state.hosts?.codex || null
  const modules = readCodexStatus(runtime, installState, cwd).modules
  return {
    scope: scope === 'global' ? 'global' : 'standby',
    installed: !!hostState,
    mode: hostState?.mode || modules?.mode || (scope === 'global' ? 'global' : 'standby'),
    activeProfile: hostState?.activeProfile || modules?.activeProfile || 'ml-development',
    activeProfiles: hostState?.activeProfiles || modules?.activeProfiles || [hostState?.activeProfile || modules?.activeProfile || 'ml-development'],
    selectedSkills: hostState?.selectedSkills || modules?.skills || [],
    selectedAgents: hostState?.selectedAgents || modules?.agents || [],
    installStatePath: installState.path,
  }
}

function readActiveChange(cwd) {
  const paths = getChangePaths(cwd)
  const active = getActiveRecord(loadWorkspace(paths), isActiveStatus)
  if (!active) return null
  return {
    id: active.id,
    title: active.title,
    status: active.meta.status,
    file: active.file,
  }
}

function summarizeSkills(catalog) {
  const skills = Array.isArray(catalog?.skills) ? catalog.skills : []
  return {
    repoSkillCount: skills.filter((entry) => entry.sourceLayer !== 'overlay').length,
    overlaySkillCount: skills.filter((entry) => entry.sourceLayer === 'overlay').length,
  }
}

function summarizePreferenceSources(sources = {}) {
  return [...new Set(Object.values(sources).filter(Boolean))].sort()
}
