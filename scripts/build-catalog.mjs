import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { readJson, readText, writeJson } from './cli-utils.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))

const base = readJson(join(pkgRoot, 'catalog', 'base.json'), null)
if (!base) {
  throw new Error('Missing base.json')
}

const hardDependencies = {
  'results-report': ['results-analysis'],
  'obsidian-project-bootstrap': ['obsidian-project-memory'],
  'obsidian-research-log': ['obsidian-project-memory'],
  'obsidian-experiment-log': ['obsidian-project-memory'],
  'obsidian-project-lifecycle': ['obsidian-project-memory'],
  'obsidian-literature-workflow': ['obsidian-project-memory', 'obsidian-markdown'],
  'zotero-obsidian-bridge': ['obsidian-project-memory'],
  'skill-improver': ['skill-quality-reviewer'],
}

const optionalDependencies = {
  'citation-verification': ['ml-paper-writing'],
  'ml-paper-writing': ['paper-miner'],
  'paper-self-review': ['ml-paper-writing'],
  'review-response': ['paper-self-review'],
  'readme-updater': ['git-push'],
  'project-creator': ['uv-package-manager', 'git-workflow'],
}

const INTERNAL_SKILL_DIRS = new Set([
  '_meta',
  'commands',
])

const skills = readSkillDirectories(join(pkgRoot, 'skills'))
  .map((entry) => {
    const skillId = entry.id
    const skillPath = join(pkgRoot, entry.path, 'SKILL.md')
    const frontmatter = parseFrontmatter(readText(skillPath))
    return {
      id: skillId,
      name: frontmatter.name || skillId,
      description: frontmatter.description || '',
      path: entry.path,
      layer: base.defaultSkills.includes(skillId) ? 'base' : 'profile',
      category: base.defaultSkills.includes(skillId) ? 'base' : (entry.domain || 'unassigned'),
      profileIds: [],
      dependencies: hardDependencies[skillId] || [],
      optionalDependencies: optionalDependencies[skillId] || [],
    }
  })

const agents = readModuleDirectories(join(pkgRoot, 'agents'))
  .map((agentId) => {
    const configPath = join(pkgRoot, 'agents', agentId, 'config.toml')
    const description = extractTomlDescription(readText(configPath))
    return {
      id: agentId,
      name: agentId,
      description,
      path: `agents/${agentId}`,
      category: 'unassigned',
      profileIds: [],
      dependencies: [],
      optionalDependencies: [],
    }
  })


writeJson(join(pkgRoot, 'catalog', 'skills.json'), skills)
writeJson(join(pkgRoot, 'catalog', 'agents.json'), agents)
console.log(`Generated catalog for ${skills.length} skills and ${agents.length} agents.`)

function readModuleDirectories(rootPath) {
  return readdirSync(rootPath)
    .filter((entry) => statSync(join(rootPath, entry)).isDirectory())
    .filter((entry) => !INTERNAL_SKILL_DIRS.has(entry))
    .filter((entry) => existsSync(join(rootPath, entry, 'SKILL.md')) || existsSync(join(rootPath, entry, 'config.toml')))
    .sort()
}

function readSkillDirectories(rootPath) {
  const entries = []
  walkSkillDirectories(rootPath, [], entries)
  assertUniqueSkillIds(entries)
  return entries.sort((left, right) => left.id.localeCompare(right.id))
}

function walkSkillDirectories(rootPath, segments, entries) {
  for (const entry of readdirSync(rootPath)) {
    const entryPath = join(rootPath, entry)
    if (!statSync(entryPath).isDirectory()) continue
    if (segments.length === 0 && INTERNAL_SKILL_DIRS.has(entry)) continue
    if (segments.length === 0 && (entry === 'commands' || entry === 'profiles')) continue

    const nextSegments = [...segments, entry]
    if (existsSync(join(entryPath, 'SKILL.md'))) {
      entries.push({
        id: entry,
        path: ['skills', ...nextSegments].join('/'),
        domain: segments.length > 0 ? segments[0] : '',
      })
      continue
    }

    walkSkillDirectories(entryPath, nextSegments, entries)
  }
}

function assertUniqueSkillIds(entries) {
  const seen = new Map()
  for (const entry of entries) {
    const previous = seen.get(entry.id)
    if (previous) throw new Error(`Duplicate skill id ${entry.id}: ${previous.path}, ${entry.path}`)
    seen.set(entry.id, entry)
  }
}

function parseFrontmatter(fileText) {
  const match = fileText.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const result = {}
  for (const line of match[1].split(/\r?\n/)) {
    const [, key, value] = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/) || []
    if (!key) continue
    result[key] = trimQuotes(value)
  }
  return result
}

function extractTomlDescription(fileText) {
  const match = fileText.match(/^description\s*=\s*"(.*)"$/m)
  return match ? match[1] : ''
}

function trimQuotes(value = '') {
  return value.replace(/^['"]|['"]$/g, '')
}
