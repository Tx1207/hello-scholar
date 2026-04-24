import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import {
  copyEntries,
  copyTree,
  ensureDir,
  pathExists,
  readJson,
  readText,
  removeMarkedBlock,
  removePath,
  upsertMarkedBlock,
  writeJson,
  writeText,
} from './cli-utils.mjs'
import {
  PROJECT_ACTIVE_END,
  PROJECT_ACTIVE_START,
  renderManagedBootstrapPrompt,
} from './project-prompt.mjs'

const AGENTS_START = '<!-- HELLO_SCHOLAR START -->'
const AGENTS_END = '<!-- HELLO_SCHOLAR END -->'
const CONFIG_START = '# HELLO_SCHOLAR START'
const CONFIG_END = '# HELLO_SCHOLAR END'
const MANAGED_FILE = '.hello-scholar-managed.json'
const PLUGIN_NAME = 'hello-scholar'
const MARKETPLACE_NAME = 'local-plugins'
const PLUGIN_KEY = `${PLUGIN_NAME}@${MARKETPLACE_NAME}`
const PLUGIN_SECTION_HEADER = `[plugins."${PLUGIN_KEY}"]`
const GLOBAL_RUNTIME_ENTRIES = [
  '.codex-plugin',
  'package.json',
  'README.md',
  'README.zh-CN.md',
  'README.ja-JP.md',
  'catalog',
  'scripts',
  'templates',
]
const INTERNAL_RUNTIME_SKILL_ENTRIES = [
  '_meta',
  'commands',
  'helloagents',
  'hello-api',
  'hello-arch',
  'hello-data',
  'hello-debug',
  'hello-errors',
  'hello-perf',
  'hello-reflect',
  'hello-review',
  'hello-security',
  'hello-subagent',
  'hello-test',
  'hello-ui',
  'hello-verify',
  'hello-write',
]

export function installCodex(runtime, selection, mode, installState, cwd = process.cwd(), catalog = null) {
  const previous = installState.hosts?.codex || null
  return mode === 'global'
    ? installCodexGlobal(runtime, selection, catalog)
    : installCodexStandby(runtime, selection, previous, cwd, catalog)
}

export function syncInstalledSelection(runtime, installState, selection, cwd = process.cwd(), catalog = null) {
  const normalized = normalizeInstallStateResult(installState)
  const previous = normalized.state.hosts?.codex || null
  if (!previous?.mode) return null

  const mode = previous.mode === 'global' ? 'global' : 'standby'
  const hostState = installCodex(runtime, selection, mode, normalized.state, cwd, catalog)
  return {
    scope: normalized.scope,
    mode,
    hostState,
    nextInstallState: {
      ...normalized.state,
      hosts: {
        ...normalized.state.hosts,
        codex: hostState,
      },
    },
  }
}

export function uninstallCodex(runtime, installState, cwd = process.cwd()) {
  const normalized = normalizeInstallStateResult(installState)
  const paths = getCodexPaths(runtime, cwd)
  if (normalized.scope === 'global') {
    const removedHomeBootstrapBlock = removeMarkedBlock(paths.agentsFile, AGENTS_START, AGENTS_END)
    const removedHomeLegacyActiveBlock = removeMarkedBlock(paths.agentsFile, PROJECT_ACTIVE_START, PROJECT_ACTIVE_END)
    const removedHomeConfigBlock = removeMarkedBlock(paths.configPath, CONFIG_START, CONFIG_END)
    const removedGlobalPluginRoot = removeManagedRoot(paths.pluginRoot)
    const removedGlobalPluginCache = removeManagedRoot(paths.pluginCachePackageRoot)
    const removedMarketplaceEntry = removeMarketplaceEntry(paths.marketplacePath)
    const removedGlobalPrompt = pathExists(paths.homeActivePromptPath)
    removePath(paths.homeActivePromptPath)
    const removedGlobalState = pathExists(paths.globalInstallStatePath) || pathExists(paths.globalModulesPath)
    removePath(paths.globalInstallStatePath)
    removePath(paths.globalModulesPath)
    return {
      scope: 'global',
      removedScopedState: removedGlobalState,
      removedScopedAgentsBlock: removedHomeBootstrapBlock || removedHomeLegacyActiveBlock,
      removedScopedConfigBlock: removedHomeConfigBlock,
      removedScopedPrompt: removedGlobalPrompt,
      removedGlobalPluginRoot,
      removedGlobalPluginCache,
      removedMarketplaceEntry,
    }
  }

  const removedProjectBootstrapBlock = removeMarkedBlock(paths.projectAgentsPath, AGENTS_START, AGENTS_END)
  const removedProjectLegacyActiveBlock = removeMarkedBlock(paths.projectAgentsPath, PROJECT_ACTIVE_START, PROJECT_ACTIVE_END)
  const removedProjectState = pathExists(paths.projectStateRoot)
  removePath(paths.projectStateRoot)
  return {
    scope: 'project',
    removedScopedState: removedProjectState,
    removedScopedAgentsBlock: removedProjectBootstrapBlock || removedProjectLegacyActiveBlock,
    removedScopedConfigBlock: false,
    removedScopedPrompt: false,
    removedGlobalPluginRoot: false,
    removedGlobalPluginCache: false,
    removedMarketplaceEntry: false,
  }
}

export function readCodexStatus(runtime, installState, cwd = process.cwd()) {
  const normalized = normalizeInstallStateResult(installState)
  const paths = getCodexPaths(runtime, cwd)
  const hostState = normalized.state.hosts?.codex || null
  if (normalized.scope === 'global') {
    const configText = readText(paths.configPath)
    const globalModules = readJson(paths.globalModulesPath, null)
    return {
      scope: 'global',
      codexHome: runtime.codexHome,
      hostHome: runtime.hostHome,
      installed: !!hostState,
      mode: hostState?.mode || '',
      bundles: hostState?.bundles || [],
      baseProfile: hostState?.baseProfile || globalModules?.baseProfile || 'ml-development',
      activeProfile: hostState?.activeProfile || globalModules?.activeProfile || 'ml-development',
      selectedSkills: hostState?.selectedSkills || [],
      selectedAgents: hostState?.selectedAgents || [],
      managedSkills: hostState?.managedSkills || [],
      managedAgents: hostState?.managedAgents || [],
      skippedSkills: hostState?.skippedSkills || [],
      skippedAgents: hostState?.skippedAgents || [],
      stateRoot: paths.globalStateRoot,
      installStatePath: paths.globalInstallStatePath,
      modulesPath: paths.globalModulesPath,
      modules: globalModules,
      promptPath: paths.homeActivePromptPath,
      promptExists: pathExists(paths.homeActivePromptPath),
      bootstrapMarker: readText(paths.agentsFile).includes(AGENTS_START),
      configMarker: configText.includes(CONFIG_START),
      pluginMarker: configText.includes(PLUGIN_SECTION_HEADER),
      pluginRoot: paths.pluginRoot,
      pluginRootExists: pathExists(paths.pluginRoot),
      pluginCacheRoot: paths.pluginCacheRoot,
      pluginCacheExists: pathExists(paths.pluginCacheRoot),
      marketplacePath: paths.marketplacePath,
      marketplaceEntry: marketplaceHasEntry(paths.marketplacePath),
    }
  }

  const projectModules = readJson(paths.projectModulesPath, null)
  return {
    scope: 'project',
    codexHome: runtime.codexHome,
    projectDir: paths.projectDir,
    attachedProjectDir: hostState?.projectDir || '',
    installed: !!hostState,
    mode: hostState?.mode || '',
      bundles: hostState?.bundles || [],
      baseProfile: hostState?.baseProfile || projectModules?.baseProfile || 'ml-development',
      activeProfile: hostState?.activeProfile || projectModules?.activeProfile || 'ml-development',
      selectedSkills: hostState?.selectedSkills || [],
    selectedAgents: hostState?.selectedAgents || [],
    managedSkills: hostState?.managedSkills || [],
    managedAgents: hostState?.managedAgents || [],
    skippedSkills: hostState?.skippedSkills || [],
    skippedAgents: hostState?.skippedAgents || [],
    stateRoot: paths.projectStateRoot,
    installStatePath: paths.projectInstallStatePath,
    modulesPath: paths.projectModulesPath,
    modules: projectModules,
    skillsRoot: paths.projectSkillsRoot,
    agentsRoot: paths.projectAgentsRoot,
    promptPath: paths.projectActivePromptPath,
    promptExists: pathExists(paths.projectActivePromptPath),
    bootstrapMarker: readText(paths.projectAgentsPath).includes(AGENTS_START),
  }
}

export function readCodexDoctor(runtime, installState, cwd = process.cwd()) {
  const status = readCodexStatus(runtime, installState, cwd)
  const checks = [
    { check: 'managed_state_present', pass: status.installed },
    { check: 'no_skipped_modules', pass: status.skippedSkills.length === 0 && status.skippedAgents.length === 0 },
  ]

  if (status.scope === 'global') {
    checks.push({ check: 'codex_home_exists', pass: pathExists(status.codexHome) })
    checks.push({ check: 'global_state_root_present', pass: pathExists(status.stateRoot) })
    checks.push({ check: 'global_install_state_present', pass: pathExists(status.installStatePath) })
    checks.push({ check: 'home_bootstrap_block_present', pass: status.bootstrapMarker })
    checks.push({ check: 'config_marker_present_or_no_agents', pass: status.configMarker || status.selectedAgents.length === 0 })
    checks.push({ check: 'plugin_root_present', pass: status.pluginRootExists })
    checks.push({ check: 'plugin_cache_present', pass: status.pluginCacheExists })
    checks.push({ check: 'marketplace_entry_present', pass: status.marketplaceEntry })
    checks.push({ check: 'plugin_config_enabled', pass: status.pluginMarker })
    checks.push({ check: 'home_active_prompt_present', pass: status.promptExists })
    checks.push({
      check: 'selected_skills_present_in_plugin_root',
      pass: areModulesPresent(join(status.pluginRoot, 'skills'), status.selectedSkills),
    })
    checks.push({
      check: 'selected_agents_present_in_plugin_root',
      pass: areModulesPresent(join(status.pluginRoot, 'agents'), status.selectedAgents),
    })
    checks.push({ check: 'global_modules_detected', pass: !!status.modules })
  } else {
    const standbyProjectMatchesHost = !status.attachedProjectDir || normalizePath(status.attachedProjectDir) === normalizePath(status.projectDir)
    checks.push({ check: 'standby_project_matches_cwd', pass: standbyProjectMatchesHost })
    checks.push({ check: 'standby_project_state_root_present', pass: pathExists(status.stateRoot) })
    checks.push({ check: 'standby_project_install_state_present', pass: pathExists(status.installStatePath) })
    checks.push({ check: 'project_bootstrap_block_present', pass: status.bootstrapMarker })
    checks.push({ check: 'project_active_prompt_present', pass: status.promptExists })
    checks.push({
      check: 'selected_skills_present_in_project_root',
      pass: areModulesPresent(status.skillsRoot, status.selectedSkills),
    })
    checks.push({
      check: 'selected_agents_present_in_project_root',
      pass: areModulesPresent(status.agentsRoot, status.selectedAgents),
    })
    checks.push({ check: 'project_modules_detected', pass: !!status.modules })
  }
  return checks
}

function installCodexStandby(runtime, selection, previous, cwd = process.cwd(), catalog = null) {
  const paths = getCodexPaths(runtime, cwd)
  ensureDir(paths.projectStateRoot)
  ensureDir(paths.projectSkillsRoot)
  ensureDir(paths.projectAgentsRoot)
  copyEntries(runtime.pkgRoot, paths.projectStateRoot, ['scripts', 'templates'])

  const bootstrap = renderManagedBootstrapPrompt({ runtime, catalog, selection, mode: 'standby' })

  upsertMarkedBlock(paths.projectAgentsPath, AGENTS_START, AGENTS_END, bootstrap)
  removeMarkedBlock(paths.projectAgentsPath, PROJECT_ACTIVE_START, PROJECT_ACTIVE_END)

  const skillSync = syncModules({
    kind: 'skill',
    targetRoot: paths.projectSkillsRoot,
    selectedIds: selection.skills,
    previousIds: previous?.managedSkills || [],
    sourcePathForId: (moduleId) => resolveSkillSourcePath(catalog, runtime.pkgRoot, moduleId),
  })
  syncInternalRuntimeSkills(runtime.pkgRoot, paths.projectSkillsRoot)

  const agentSync = syncModules({
    kind: 'agent',
    sourceRoot: join(runtime.pkgRoot, 'agents'),
    targetRoot: paths.projectAgentsRoot,
    selectedIds: selection.agents,
    previousIds: previous?.managedAgents || [],
  })

  const standbyState = {
    mode: 'standby',
    projectDir: normalizePath(paths.projectDir),
    baseProfile: selection.baseProfile || 'ml-development',
    activeProfile: selection.activeProfile || 'ml-development',
    bundles: selection.bundles,
    selectedSkills: selection.skills,
    selectedAgents: selection.agents,
    managedSkills: skillSync.installed,
    managedAgents: agentSync.installed,
    skippedSkills: skillSync.skipped,
    skippedAgents: agentSync.skipped,
    updatedAt: new Date().toISOString(),
  }
  writeJson(paths.projectInstallStatePath, standbyState)
  return standbyState
}

function installCodexGlobal(runtime, selection, catalog = null) {
  const paths = getCodexPaths(runtime)
  ensureDir(runtime.codexHome)
  ensureDir(join(runtime.hostHome, 'plugins'))
  ensureDir(join(runtime.hostHome, '.agents', 'plugins'))

  assertManagedRootAvailable(paths.pluginRoot)
  assertManagedRootAvailable(paths.pluginCachePackageRoot)
  removeManagedRoot(paths.pluginRoot)
  removeManagedRoot(paths.pluginCachePackageRoot)

  ensureDir(paths.pluginRoot)
  ensureDir(paths.pluginCacheRoot)
  ensureDir(join(paths.pluginRoot, 'skills'))
  ensureDir(join(paths.pluginRoot, 'agents'))
  ensureDir(join(paths.pluginCacheRoot, 'skills'))
  ensureDir(join(paths.pluginCacheRoot, 'agents'))

  copyEntries(runtime.pkgRoot, paths.pluginRoot, GLOBAL_RUNTIME_ENTRIES)
  copyEntries(runtime.pkgRoot, paths.pluginCacheRoot, GLOBAL_RUNTIME_ENTRIES)

  const skillSync = syncModules({
    kind: 'skill',
    targetRoot: join(paths.pluginRoot, 'skills'),
    selectedIds: selection.skills,
    previousIds: [],
    sourcePathForId: (moduleId) => resolveSkillSourcePath(catalog, runtime.pkgRoot, moduleId),
  })
  syncInternalRuntimeSkills(runtime.pkgRoot, join(paths.pluginRoot, 'skills'))

  const agentSync = syncModules({
    kind: 'agent',
    sourceRoot: join(runtime.pkgRoot, 'agents'),
    targetRoot: join(paths.pluginRoot, 'agents'),
    selectedIds: selection.agents,
    previousIds: [],
  })

  syncModules({
    kind: 'skill',
    targetRoot: join(paths.pluginCacheRoot, 'skills'),
    selectedIds: selection.skills,
    previousIds: [],
    sourcePathForId: (moduleId) => resolveSkillSourcePath(catalog, runtime.pkgRoot, moduleId),
  })
  syncInternalRuntimeSkills(runtime.pkgRoot, join(paths.pluginCacheRoot, 'skills'))

  syncModules({
    kind: 'agent',
    sourceRoot: join(runtime.pkgRoot, 'agents'),
    targetRoot: join(paths.pluginCacheRoot, 'agents'),
    selectedIds: selection.agents,
    previousIds: [],
  })

  writeManagedRootMarker(paths.pluginRoot, 'global-runtime', selection)
  writeManagedRootMarker(paths.pluginCachePackageRoot, 'global-cache', selection)

  const bootstrap = renderManagedBootstrapPrompt({ runtime, catalog, selection, mode: 'global' })
  writeText(join(paths.pluginRoot, 'AGENTS.md'), bootstrap ? `${bootstrap}\n` : '')
  writeText(join(paths.pluginCacheRoot, 'AGENTS.md'), bootstrap ? `${bootstrap}\n` : '')
  upsertMarkedBlock(paths.agentsFile, AGENTS_START, AGENTS_END, bootstrap)

  upsertMarketplace(paths.marketplacePath)

  const configBlock = buildConfigBlock({
    includePluginSection: true,
    agentIds: selection.agents,
    agentRoot: join(paths.pluginRoot, 'agents'),
  })

  if (configBlock.trim()) {
    upsertMarkedBlock(paths.configPath, CONFIG_START, CONFIG_END, configBlock)
  } else {
    removeMarkedBlock(paths.configPath, CONFIG_START, CONFIG_END)
  }

  return {
    mode: 'global',
    baseProfile: selection.baseProfile || 'ml-development',
    activeProfile: selection.activeProfile || 'ml-development',
    bundles: selection.bundles,
    selectedSkills: selection.skills,
    selectedAgents: selection.agents,
    managedSkills: skillSync.installed,
    managedAgents: agentSync.installed,
    skippedSkills: skillSync.skipped,
    skippedAgents: agentSync.skipped,
    updatedAt: new Date().toISOString(),
  }
}

function getCodexPaths(runtime, cwd = process.cwd()) {
  const pluginRoot = join(runtime.hostHome, 'plugins', PLUGIN_NAME)
  const pluginCachePackageRoot = join(runtime.codexHome, 'plugins', 'cache', MARKETPLACE_NAME, PLUGIN_NAME)
  const projectStateRoot = join(cwd, '.hello-scholar')
  const globalStateRoot = runtime.scholarHome
  return {
    projectDir: cwd,
    projectStateRoot,
    projectModulesPath: join(projectStateRoot, 'modules.json'),
    projectInstallStatePath: join(projectStateRoot, 'install-state.json'),
    projectActivePromptPath: join(projectStateRoot, 'active-prompt.md'),
    globalStateRoot,
    globalModulesPath: join(globalStateRoot, 'modules.json'),
    globalInstallStatePath: join(globalStateRoot, 'install-state.json'),
    homeActivePromptPath: join(runtime.codexHome, 'hello-scholar-active-prompt.md'),
    projectSkillsRoot: join(projectStateRoot, 'skills'),
    projectAgentsRoot: join(projectStateRoot, 'agents'),
    projectAgentsPath: join(cwd, 'AGENTS.md'),
    agentsFile: join(runtime.codexHome, 'AGENTS.md'),
    configPath: join(runtime.codexHome, 'config.toml'),
    legacyStandbySkillsRoot: join(runtime.codexHome, 'skills'),
    legacyStandbyAgentsRoot: join(runtime.codexHome, 'agents'),
    pluginRoot,
    pluginCachePackageRoot,
    pluginCacheRoot: join(pluginCachePackageRoot, 'local'),
    marketplacePath: join(runtime.hostHome, '.agents', 'plugins', 'marketplace.json'),
  }
}

function syncModules({ kind, sourceRoot, targetRoot, selectedIds, previousIds, sourcePathForId = null }) {
  const installed = []
  const skipped = []

  for (const moduleId of previousIds) {
    if (!selectedIds.includes(moduleId)) {
      removeManagedModule(join(targetRoot, moduleId))
    }
  }

  for (const moduleId of selectedIds) {
    const sourcePath = sourcePathForId ? sourcePathForId(moduleId) : join(sourceRoot, moduleId)
    const targetPath = join(targetRoot, moduleId)
    const managedPath = join(targetPath, MANAGED_FILE)
    const alreadyManaged = pathExists(managedPath)
    const blockedByForeignInstall = pathExists(targetPath) && !alreadyManaged

    if (!pathExists(sourcePath)) {
      skipped.push({ id: moduleId, reason: `${kind}-source-missing` })
      continue
    }

    if (blockedByForeignInstall) {
      skipped.push({ id: moduleId, reason: `${kind}-already-exists` })
      continue
    }

    removePath(targetPath)
    copyTree(sourcePath, targetPath)
    writeJson(managedPath, {
      runtime: PLUGIN_NAME,
      kind,
      id: moduleId,
      installedAt: new Date().toISOString(),
    })
    installed.push(moduleId)
  }

  return { installed, skipped }
}

function syncInternalRuntimeSkills(pkgRoot, targetRoot) {
  copyEntries(join(pkgRoot, 'skills'), targetRoot, INTERNAL_RUNTIME_SKILL_ENTRIES)
}

function buildConfigBlock({ includePluginSection, agentIds, agentRoot }) {
  const blocks = []
  if (includePluginSection) {
    blocks.push(`${PLUGIN_SECTION_HEADER}\nenabled = true`)
  }

  for (const agentId of agentIds) {
    const configPath = join(agentRoot, agentId, 'config.toml')
    if (!pathExists(configPath)) continue
    const description = escapeTomlString(extractTomlDescription(readText(configPath)) || agentId)
    blocks.push([
      `[agents.${agentId}]`,
      `description = "${description}"`,
      `config_file = "${normalizePath(configPath)}"`,
    ].join('\n'))
  }

  return blocks.join('\n\n').trim()
}

function extractTomlDescription(fileText) {
  const match = fileText.match(/^description\s*=\s*"(.*)"$/m)
  return match ? match[1] : ''
}

function upsertMarketplace(marketplacePath) {
  const nextEntry = {
    name: PLUGIN_NAME,
    source: {
      source: 'local',
      path: `./plugins/${PLUGIN_NAME}`,
    },
    policy: {
      installation: 'AVAILABLE',
      authentication: 'ON_INSTALL',
    },
    category: 'Developer Tools',
  }

  const marketplace = pathExists(marketplacePath)
    ? readJsonOrThrow(marketplacePath, 'Codex marketplace config')
    : {
        name: MARKETPLACE_NAME,
        interface: { displayName: 'Local Plugins' },
        plugins: [],
      }

  marketplace.name = MARKETPLACE_NAME
  marketplace.interface = marketplace.interface || { displayName: 'Local Plugins' }
  marketplace.plugins = Array.isArray(marketplace.plugins) ? marketplace.plugins : []

  const existingIndex = marketplace.plugins.findIndex((entry) => entry?.name === PLUGIN_NAME)
  if (existingIndex >= 0) {
    marketplace.plugins.splice(existingIndex, 1, nextEntry)
  } else {
    marketplace.plugins.push(nextEntry)
  }

  writeJson(marketplacePath, marketplace)
}

function removeMarketplaceEntry(marketplacePath) {
  if (!pathExists(marketplacePath)) return false
  const marketplace = readJsonOrThrow(marketplacePath, 'Codex marketplace config')
  const plugins = Array.isArray(marketplace.plugins) ? marketplace.plugins : []
  const nextPlugins = plugins.filter((entry) => entry?.name !== PLUGIN_NAME)
  if (nextPlugins.length === plugins.length) return false
  if (nextPlugins.length === 0) {
    removePath(marketplacePath)
    return true
  }
  marketplace.plugins = nextPlugins
  writeJson(marketplacePath, marketplace)
  return true
}

function marketplaceHasEntry(marketplacePath) {
  const marketplace = readJson(marketplacePath, null)
  const plugins = Array.isArray(marketplace?.plugins) ? marketplace.plugins : []
  return plugins.some((entry) => entry?.name === PLUGIN_NAME)
}

function readJsonOrThrow(filePath, label) {
  const value = readJson(filePath, null)
  if (value) return value
  throw new Error(`${label} is not valid JSON: ${filePath}`)
}

function writeManagedRootMarker(rootPath, kind, selection) {
  ensureDir(rootPath)
  writeJson(join(rootPath, MANAGED_FILE), {
    runtime: PLUGIN_NAME,
    kind,
    bundles: selection.bundles,
    skills: selection.skills,
    agents: selection.agents,
    installedAt: new Date().toISOString(),
  })
}

function assertManagedRootAvailable(rootPath) {
  if (!pathExists(rootPath)) return
  if (pathExists(join(rootPath, MANAGED_FILE))) return
  if (isEmptyDirectory(rootPath)) return
  if (isPluginRootWithOnlySharedState(rootPath)) return
  throw new Error(`Refusing to overwrite unmanaged path: ${rootPath}`)
}

function removeManagedRoot(rootPath) {
  if (!pathExists(rootPath)) return false
  if (isPluginRootWithSharedState(rootPath)) {
    let removed = false
    for (const entry of readdirSync(rootPath)) {
      if (entry === '.hello-scholar') continue
      removePath(join(rootPath, entry))
      removed = true
    }
    return removed
  }
  if (!pathExists(join(rootPath, MANAGED_FILE)) && !isEmptyDirectory(rootPath)) return false
  removePath(rootPath)
  return true
}

function isPluginRootWithOnlySharedState(rootPath) {
  try {
    const entries = readdirSync(rootPath).filter((entry) => entry !== '.hello-scholar')
    return pathExists(join(rootPath, '.hello-scholar')) && entries.length === 0
  } catch {
    return false
  }
}

function isPluginRootWithSharedState(rootPath) {
  return pathExists(join(rootPath, '.hello-scholar')) && (pathExists(join(rootPath, MANAGED_FILE)) || isPluginRootWithOnlySharedState(rootPath))
}

function purgeManagedModules(rootPath) {
  if (!pathExists(rootPath)) return
  for (const entry of readdirSync(rootPath)) {
    const entryPath = join(rootPath, entry)
    if (!statSync(entryPath).isDirectory()) continue
    removeManagedModule(entryPath)
  }
}

function removeManagedModule(targetPath) {
  if (!pathExists(join(targetPath, MANAGED_FILE))) return false
  removePath(targetPath)
  return true
}

function areModulesPresent(rootPath, moduleIds) {
  return moduleIds.every((moduleId) => pathExists(join(rootPath, moduleId)))
}

function isEmptyDirectory(rootPath) {
  if (!pathExists(rootPath)) return true
  return readdirSync(rootPath).length === 0
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/')
}

function resolveSkillSourcePath(catalog, pkgRoot, skillId) {
  return catalog?.skillMap.get(skillId)?.sourceRoot || findRepoSkillRoot(join(pkgRoot, 'skills'), skillId) || join(pkgRoot, 'skills', skillId)
}

function findRepoSkillRoot(rootPath, skillId) {
  if (!pathExists(rootPath)) return ''
  for (const entry of readdirSync(rootPath)) {
    const entryPath = join(rootPath, entry)
    if (!statSync(entryPath).isDirectory()) continue
    if (entry === skillId && pathExists(join(entryPath, 'SKILL.md'))) return entryPath
    const nested = findRepoSkillRoot(entryPath, skillId)
    if (nested) return nested
  }
  return ''
}

function escapeTomlString(value = '') {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function normalizeInstallStateResult(input) {
  if (input && typeof input === 'object' && 'state' in input && 'scope' in input) {
    return input
  }
  return {
    state: input || { hosts: {} },
    scope: 'project',
    path: '',
  }
}
