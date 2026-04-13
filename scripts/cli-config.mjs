import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

import { ensureDir, pathExists, readJson, removePath, writeJson } from './cli-utils.mjs'

export const DEFAULTS = {
  install_mode: 'standby',
  auto_base: true,
  last_host: 'codex',
}

export function getRuntimeContext(pkgRoot) {
  const codexHome = process.env.CODEX_HOME || join(homedir(), '.codex')
  const scholarHome = process.env.HELLO_SCHOLAR_HOME || join(codexHome, '.hello-scholar')
  const hostHome = process.env.HELLO_SCHOLAR_HOST_HOME || dirname(codexHome)
  return {
    pkgRoot: resolve(pkgRoot),
    scholarHome: resolve(scholarHome),
    installStatePath: join(resolve(scholarHome), 'install-state.json'),
    hostHome: resolve(hostHome),
    codexHome: resolve(codexHome),
  }
}

export function getScopedStatePaths(runtime, cwd = process.cwd()) {
  const projectStateRoot = join(cwd, '.hello-scholar')
  return {
    projectStateRoot,
    projectInstallStatePath: join(projectStateRoot, 'install-state.json'),
    projectModulesPath: join(projectStateRoot, 'modules.json'),
    globalStateRoot: runtime.scholarHome,
    globalInstallStatePath: runtime.installStatePath,
    globalModulesPath: join(runtime.scholarHome, 'modules.json'),
  }
}

export function detectStateScope(runtime, cwd = process.cwd()) {
  const paths = getScopedStatePaths(runtime, cwd)
  const projectHasState =
    pathExists(paths.projectModulesPath) ||
    pathExists(paths.projectInstallStatePath)

  return projectHasState ? 'project' : 'global'
}

export function detectInstalledScope(runtime, cwd = process.cwd()) {
  const paths = getScopedStatePaths(runtime, cwd)
  const projectInstallState = readScopedInstallState(paths.projectInstallStatePath)
  if (projectInstallState?.hosts?.codex?.mode === 'standby') {
    return 'project'
  }

  const globalInstallState = readScopedInstallState(paths.globalInstallStatePath)
  if (globalInstallState?.hosts?.codex?.mode === 'global') {
    return 'global'
  }

  return 'project'
}

export function ensureGlobalStateRoot(runtime) {
  ensureDir(runtime.scholarHome)
  return {
    stateRoot: runtime.scholarHome,
    installStatePath: runtime.installStatePath,
  }
}

export function loadUserConfig(runtime, cwd = process.cwd(), preferredScope = 'auto') {
  const paths = getScopedStatePaths(runtime, cwd)
  if (preferredScope === 'project') {
    return pickUserConfig(readScopedInstallState(paths.projectInstallStatePath))
  }
  if (preferredScope === 'global') {
    return pickUserConfig(readScopedInstallState(paths.globalInstallStatePath))
  }
  if (pathExists(paths.projectInstallStatePath)) {
    return pickUserConfig(readScopedInstallState(paths.projectInstallStatePath))
  }
  if (pathExists(paths.globalInstallStatePath)) {
    return pickUserConfig(readScopedInstallState(paths.globalInstallStatePath))
  }
  return { ...DEFAULTS }
}

export function loadInstallState(runtime, cwd = process.cwd(), preferredScope = 'auto') {
  const paths = getScopedStatePaths(runtime, cwd)
  if (preferredScope === 'project') {
    return {
      state: readScopedInstallState(paths.projectInstallStatePath),
      scope: 'project',
      path: paths.projectInstallStatePath,
    }
  }
  if (preferredScope === 'global') {
    return {
      state: readScopedInstallState(paths.globalInstallStatePath),
      scope: 'global',
      path: paths.globalInstallStatePath,
    }
  }
  if (pathExists(paths.projectInstallStatePath)) {
    return {
      state: readScopedInstallState(paths.projectInstallStatePath),
      scope: 'project',
      path: paths.projectInstallStatePath,
    }
  }
  if (pathExists(paths.globalInstallStatePath)) {
    return {
      state: readScopedInstallState(paths.globalInstallStatePath),
      scope: 'global',
      path: paths.globalInstallStatePath,
    }
  }
  return {
    state: { ...DEFAULTS, hosts: {} },
    scope: 'global',
    path: paths.globalInstallStatePath,
  }
}

export function saveInstallState(runtime, nextState, mode, cwd = process.cwd()) {
  const paths = getScopedStatePaths(runtime, cwd)
  const scope = mode === 'standby' ? 'project' : 'global'
  const targetPath = scope === 'project' ? paths.projectInstallStatePath : paths.globalInstallStatePath
  const targetRoot = scope === 'project' ? paths.projectStateRoot : paths.globalStateRoot
  const normalized = normalizeInstallState(nextState)
  if (Object.keys(normalized.hosts || {}).length === 0) {
    removePath(targetPath)
    return {
      scope,
      path: targetPath,
      removed: true,
    }
  }
  ensureDir(targetRoot)
  writeJson(targetPath, normalized)
  return {
    scope,
    path: targetPath,
    removed: false,
  }
}

function readScopedInstallState(filePath) {
  return normalizeInstallState(readJson(filePath, null))
}

function normalizeInstallState(rawState) {
  return {
    ...DEFAULTS,
    ...(rawState || {}),
    hosts: (rawState && rawState.hosts && typeof rawState.hosts === 'object') ? rawState.hosts : {},
  }
}

function pickUserConfig(installState) {
  return {
    install_mode: installState.install_mode,
    auto_base: installState.auto_base,
    last_host: installState.last_host,
  }
}
