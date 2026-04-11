import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true })
}

export function readText(filePath, fallback = '') {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch {
    return fallback
  }
}

export function writeText(filePath, text) {
  ensureDir(dirname(filePath))
  writeFileSync(filePath, text, 'utf-8')
}

export function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch {
    return fallback
  }
}

export function writeJson(filePath, value) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

export function copyTree(sourcePath, targetPath) {
  cpSync(sourcePath, targetPath, {
    recursive: true,
    force: true,
  })
}

export function copyEntries(sourceRoot, targetRoot, entryNames) {
  for (const entryName of entryNames) {
    const sourcePath = join(sourceRoot, entryName)
    const targetPath = join(targetRoot, entryName)
    if (!existsSync(sourcePath)) continue
    ensureDir(dirname(targetPath))
    cpSync(sourcePath, targetPath, {
      recursive: true,
      force: true,
    })
  }
}

export function removePath(targetPath) {
  rmSync(targetPath, {
    recursive: true,
    force: true,
  })
}

export function pathExists(targetPath) {
  return existsSync(targetPath)
}

export function wrapMarkedBlock(startMarker, endMarker, content) {
  const body = String(content || '').trim()
  return `${startMarker}\n${body}\n${endMarker}\n`
}

export function upsertMarkedBlock(filePath, startMarker, endMarker, content) {
  const nextBlock = wrapMarkedBlock(startMarker, endMarker, content)
  const current = readText(filePath, '')
  const pattern = new RegExp(`${escapeRegex(startMarker)}[\\s\\S]*?${escapeRegex(endMarker)}\\n?`, 'm')
  const next = pattern.test(current)
    ? current.replace(pattern, nextBlock)
    : appendBlock(current, nextBlock)
  writeText(filePath, next)
}

export function removeMarkedBlock(filePath, startMarker, endMarker) {
  const current = readText(filePath, '')
  if (!current) return false
  const pattern = new RegExp(`${escapeRegex(startMarker)}[\\s\\S]*?${escapeRegex(endMarker)}\\n?`, 'm')
  if (!pattern.test(current)) return false
  const next = current.replace(pattern, '').replace(/\n{3,}/g, '\n\n').trimEnd()
  if (!next) {
    removePath(filePath)
    return true
  }
  writeText(filePath, `${next}\n`)
  return true
}

export function parseArgv(argv) {
  const positionals = []
  const flags = new Map()
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) {
      positionals.push(token)
      continue
    }
    const [rawName, inlineValue] = token.split('=', 2)
    const value = inlineValue !== undefined
      ? inlineValue
      : (argv[index + 1] && !argv[index + 1].startsWith('--') ? argv[++index] : true)
    const current = flags.get(rawName) || []
    current.push(value)
    flags.set(rawName, current)
  }
  return {
    positionals,
    hasFlag(name) {
      return flags.has(name)
    },
    getFlag(name, fallback = '') {
      return flags.has(name) ? flags.get(name).at(-1) : fallback
    },
    getList(name) {
      if (!flags.has(name)) return []
      return flags.get(name)
        .flatMap((value) => String(value).split(','))
        .map((value) => value.trim())
        .filter(Boolean)
    },
  }
}

function appendBlock(current, block) {
  const trimmed = current.trimEnd()
  return trimmed ? `${trimmed}\n\n${block}` : block
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
