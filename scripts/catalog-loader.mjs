import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { getOverlayPaths, getRuntimeContext } from './cli-config.mjs'
import { readJson, readText } from './cli-utils.mjs'

export function loadCatalog(pkgRoot, options = {}) {
  const base = readJson(join(pkgRoot, 'catalog', 'base.json'), null)
  const bundles = readJson(join(pkgRoot, 'catalog', 'bundles.json'), null)
  const skills = readJson(join(pkgRoot, 'catalog', 'skills.json'), null)
  const agents = readJson(join(pkgRoot, 'catalog', 'agents.json'), null)
  if (!base || !bundles || !skills || !agents) {
    throw new Error('Catalog files are missing. Run `node scripts/build-catalog.mjs` first.')
  }
  const resolvedSkills = options.dynamic === true
    ? hydrateDynamicSkills(pkgRoot, skills, options)
    : hydrateStaticSkills(pkgRoot, skills)

  return {
    base,
    bundles,
    skills: resolvedSkills,
    agents,
    bundleMap: new Map(bundles.map((entry) => [entry.id, entry])),
    skillMap: new Map(resolvedSkills.map((entry) => [entry.id, entry])),
    agentMap: new Map(agents.map((entry) => [entry.id, entry])),
  }
}

export function resolveSelection(catalog, options = {}) {
  const includeBase = options.includeBase !== false
  const bundleIds = uniqueList(options.bundles || [])
  const explicitSkillIds = uniqueList(options.skills || [])
  const explicitAgentIds = uniqueList(options.agents || [])

  for (const bundleId of bundleIds) {
    if (!catalog.bundleMap.has(bundleId)) {
      throw new Error(`Unknown bundle: ${bundleId}`)
    }
  }
  for (const skillId of explicitSkillIds) {
    if (!catalog.skillMap.has(skillId)) {
      throw new Error(`Unknown skill: ${skillId}`)
    }
  }
  for (const agentId of explicitAgentIds) {
    if (!catalog.agentMap.has(agentId)) {
      throw new Error(`Unknown agent: ${agentId}`)
    }
  }

  const selectedSkillIds = new Set(includeBase ? catalog.base.defaultSkills : [])
  const selectedAgentIds = new Set(includeBase ? catalog.base.defaultAgents : [])

  for (const bundleId of bundleIds) {
    const bundle = catalog.bundleMap.get(bundleId)
    for (const skillId of bundle.skills || []) selectedSkillIds.add(skillId)
    for (const agentId of bundle.agents || []) selectedAgentIds.add(agentId)
  }

  for (const skillId of explicitSkillIds) selectedSkillIds.add(skillId)
  for (const agentId of explicitAgentIds) selectedAgentIds.add(agentId)

  const queue = [...selectedSkillIds]
  while (queue.length > 0) {
    const currentId = queue.pop()
    const entry = catalog.skillMap.get(currentId)
    if (!entry) continue
    for (const dependencyId of entry.dependencies || []) {
      if (selectedSkillIds.has(dependencyId)) continue
      selectedSkillIds.add(dependencyId)
      queue.push(dependencyId)
    }
  }

  return {
    includeBase,
    bundles: bundleIds,
    skills: [...selectedSkillIds].sort(),
    agents: [...selectedAgentIds].sort(),
  }
}

export function listCatalogItems(catalog, kind, options = {}) {
  if (kind === 'base' || kind === 'default') {
    return {
      defaultSkills: [...catalog.base.defaultSkills],
      defaultAgents: [...catalog.base.defaultAgents],
      dependencyHubs: [...catalog.base.dependencyHubs],
    }
  }

  if (kind === 'bundles') {
    return catalog.bundles.map((bundle) => ({
      id: bundle.id,
      description: bundle.description,
      skills: bundle.skills.length,
      agents: bundle.agents.length,
      dependsOnBase: bundle.dependsOnBase,
    }))
  }

  if (kind === 'skills') {
    const category = options.category || ''
    return catalog.skills.filter((entry) => !category || entry.category === category)
  }

  if (kind === 'agents') {
    const category = options.category || ''
    return catalog.agents.filter((entry) => !category || entry.category === category)
  }

  throw new Error(`Unsupported list kind: ${kind}`)
}

function uniqueList(values) {
  return [...new Set(values.filter(Boolean))]
}

function hydrateStaticSkills(pkgRoot, skills) {
  return skills.map((entry) => ({
    ...entry,
    sourceLayer: 'repo',
    sourceRoot: join(pkgRoot, 'skills', entry.id),
    dynamic: false,
  }))
}

function hydrateDynamicSkills(pkgRoot, skills, options) {
  const runtime = options.runtime || getRuntimeContext(pkgRoot)
  const overlayPaths = getOverlayPaths(runtime)
  const skillMap = new Map(hydrateStaticSkills(pkgRoot, skills).map((entry) => [entry.id, entry]))

  for (const entry of readDynamicSkills(join(pkgRoot, 'skills'), 'repo')) {
    const previous = skillMap.get(entry.id)
    skillMap.set(entry.id, mergeSkillEntry(previous, entry))
  }

  for (const entry of readDynamicSkills(overlayPaths.overlaySkillsRoot, 'overlay')) {
    const previous = skillMap.get(entry.id)
    skillMap.set(entry.id, mergeSkillEntry(previous, entry))
  }

  return [...skillMap.values()].sort((left, right) => left.id.localeCompare(right.id))
}

function readDynamicSkills(rootPath, sourceLayer) {
  const entries = []
  for (const skillId of readModuleDirectories(rootPath)) {
    const frontmatter = parseFrontmatter(readJsonAsText(join(rootPath, skillId, 'SKILL.md')))
    entries.push({
      id: skillId,
      name: frontmatter.name || skillId,
      description: frontmatter.description || '',
      path: join(rootPath, skillId).replace(/\\/g, '/'),
      layer: sourceLayer === 'overlay' ? 'overlay' : 'bundle',
      category: sourceLayer === 'overlay' ? 'overlay' : 'unassigned',
      bundleIds: [],
      dependencies: [],
      optionalDependencies: [],
      sourceLayer,
      sourceRoot: join(rootPath, skillId),
      dynamic: true,
    })
  }
  return entries
}

function mergeSkillEntry(previous, nextEntry) {
  if (!previous) return nextEntry
  return {
    ...previous,
    name: nextEntry.name || previous.name,
    description: nextEntry.description || previous.description,
    path: nextEntry.path,
    layer: nextEntry.sourceLayer === 'overlay' ? 'overlay' : previous.layer,
    category: nextEntry.sourceLayer === 'overlay' ? 'overlay' : previous.category,
    sourceLayer: nextEntry.sourceLayer,
    sourceRoot: nextEntry.sourceRoot,
    dynamic: previous.dynamic || nextEntry.sourceLayer === 'overlay',
  }
}

function readModuleDirectories(rootPath) {
  try {
    return readdirSync(rootPath)
      .filter((entry) => statSync(join(rootPath, entry)).isDirectory())
      .sort()
  } catch {
    return []
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

function readJsonAsText(filePath) {
  return readText(filePath, '')
}

function trimQuotes(value = '') {
  return value.replace(/^['"]|['"]$/g, '')
}
