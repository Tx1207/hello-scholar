import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { readJson, readText, writeJson } from './cli-utils.mjs'

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)))

const base = readJson(join(pkgRoot, 'catalog', 'base.json'), null)
const bundles = readJson(join(pkgRoot, 'catalog', 'bundles.json'), null)

if (!base || !bundles) {
  throw new Error('Missing base.json or bundles.json')
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
])

const bundleSkillMembership = new Map()
const bundleAgentMembership = new Map()
for (const bundle of bundles) {
  for (const skillId of bundle.skills) pushMembership(bundleSkillMembership, skillId, bundle.id)
  for (const agentId of bundle.agents) pushMembership(bundleAgentMembership, agentId, bundle.id)
}

const skills = readModuleDirectories(join(pkgRoot, 'skills'))
  .map((skillId) => {
    const skillPath = join(pkgRoot, 'skills', skillId, 'SKILL.md')
    const frontmatter = parseFrontmatter(readText(skillPath))
    return {
      id: skillId,
      name: frontmatter.name || skillId,
      description: frontmatter.description || '',
      path: `skills/${skillId}`,
      layer: base.defaultSkills.includes(skillId) ? 'base' : 'bundle',
      category: base.defaultSkills.includes(skillId) ? 'base' : (bundleSkillMembership.get(skillId)?.[0] || 'unassigned'),
      bundleIds: bundleSkillMembership.get(skillId) || [],
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
      category: bundleAgentMembership.get(agentId)?.[0] || 'unassigned',
      bundleIds: bundleAgentMembership.get(agentId) || [],
      dependencies: [],
      optionalDependencies: [],
    }
  })

assertCoverage(skills.filter((entry) => entry.layer !== 'base' && entry.bundleIds.length === 0).map((entry) => entry.id), 'skill bundle')
assertCoverage(agents.filter((entry) => entry.bundleIds.length === 0).map((entry) => entry.id), 'agent bundle')

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

function pushMembership(map, key, bundleId) {
  const current = map.get(key) || []
  current.push(bundleId)
  map.set(key, current)
}

function assertCoverage(missingIds, label) {
  if (missingIds.length === 0) return
  throw new Error(`Missing ${label} coverage for: ${missingIds.join(', ')}`)
}
