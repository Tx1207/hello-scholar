import { dirname, isAbsolute, join, resolve } from 'node:path'

import { ensureDir, parseArgv, pathExists, readJson, writeJson } from './cli-utils.mjs'

const DEFAULT_DIRNAME = 'hello-scholar'
const CONFIG_PATH = ['.hello-scholar', 'project-storage.json']

main()

function main() {
  if (process.argv[1] !== new URL(import.meta.url).pathname) return
  const args = parseArgv(process.argv.slice(2))
  const [command = 'status'] = args.positionals
  const cwd = resolve(String(args.getFlag('--cwd', process.cwd())))

  if (command === 'status') {
    const status = resolveProjectStorage(cwd)
    console.log(JSON.stringify(status, null, 2))
    return
  }

  if (command === 'use-shared') {
    const rootPath = String(args.getFlag('--root', '')).trim()
    if (!rootPath) throw new Error('--root is required for use-shared')
    const next = saveProjectStorageConfig(cwd, {
      mode: 'shared',
      rootPath,
    })
    console.log(JSON.stringify(next, null, 2))
    return
  }

  if (command === 'use-local') {
    const next = saveProjectStorageConfig(cwd, {
      mode: 'repo-local',
      rootPath: DEFAULT_DIRNAME,
    })
    console.log(JSON.stringify(next, null, 2))
    return
  }

  throw new Error(`Unknown project-storage command: ${command}`)
}

export function resolveProjectStorage(cwd) {
  const configPath = join(cwd, ...CONFIG_PATH)
  const config = pathExists(configPath) ? readJson(configPath, null) : null
  const mode = config?.mode === 'shared' ? 'shared' : 'repo-local'
  const configuredRoot = String(config?.rootPath || DEFAULT_DIRNAME)
  const rootPath = mode === 'shared'
    ? resolveSharedRoot(cwd, configuredRoot)
    : join(cwd, DEFAULT_DIRNAME)
  return {
    cwd,
    mode,
    configPath,
    configuredRoot,
    rootPath,
  }
}

export function resolveProjectAssetPath(cwd, ...segments) {
  const storage = resolveProjectStorage(cwd)
  return join(storage.rootPath, ...segments)
}

export function saveProjectStorageConfig(cwd, config) {
  const configPath = join(cwd, ...CONFIG_PATH)
  ensureDir(dirname(configPath))
  writeJson(configPath, {
    mode: config.mode === 'shared' ? 'shared' : 'repo-local',
    rootPath: config.rootPath || DEFAULT_DIRNAME,
  })
  return resolveProjectStorage(cwd)
}

function resolveSharedRoot(cwd, rootPath) {
  if (isAbsolute(rootPath)) return rootPath
  return resolve(cwd, rootPath)
}
