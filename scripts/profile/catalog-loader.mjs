import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { getOverlayPaths, getRuntimeContext } from '../install/cli-config.mjs'
import { readJson, readText } from '../cli-utils.mjs'

const INTERNAL_SKILL_DIRS = new Set([
  '_meta',
  'commands',
  'profiles',
])

export function loadCatalog(pkgRoot, options = {}) {
  const base = readJson(join(pkgRoot, 'catalog', 'base.json'), null)
  const profiles = readJson(join(pkgRoot, 'catalog', 'profiles.json'), null)
  const skills = readJson(join(pkgRoot, 'catalog', 'skills.json'), null)
  const agents = readJson(join(pkgRoot, 'catalog', 'agents.json'), null)
  if (!base || !profiles || !skills || !agents) {
    throw new Error('Catalog files are missing. Run `node scripts/build-catalog.mjs` first.')
  }
  const resolvedSkills = options.dynamic === true
    ? hydrateDynamicSkills(pkgRoot, skills, options)
    : hydrateStaticSkills(pkgRoot, skills)

  return {
    base,
    profiles,
    skills: resolvedSkills,
    agents,
    profileMap: new Map(profiles.map((entry) => [entry.id, entry])),
    skillMap: new Map(resolvedSkills.map((entry) => [entry.id, entry])),
    agentMap: new Map(agents.map((entry) => [entry.id, entry])),
  }
}

export function resolveSelection(catalog, options = {}) {
  const includeBase = options.includeBase !== false
  const profileSelection = resolveProfileSelection(catalog, options)
  const explicitSkillIds = uniqueList([...(options.skills || []), ...profileSelection.skills])
  const explicitAgentIds = uniqueList([...(options.agents || []), ...profileSelection.agents])

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
    baseProfile: profileSelection.baseProfile,
    activeProfile: profileSelection.activeProfile,
    activeProfiles: profileSelection.activeProfiles,
    skills: [...selectedSkillIds].sort(),
    agents: [...selectedAgentIds].sort(),
  }
}

export function resolveProfileSelection(catalog, options = {}) {
  const baseProfile = options.baseProfile || 'ml-development'
  const activeProfiles = normalizeActiveProfiles(options.activeProfiles, options.activeProfile || baseProfile)
  const activeProfile = activeProfiles[0] || baseProfile
  const selectedProfileIds = uniqueList([baseProfile, ...activeProfiles])
  const skills = []
  const agents = []

  for (const profileId of selectedProfileIds) {
    const profile = catalog.profileMap?.get(profileId)
    if (!profile) throw new Error(`Unknown profile: ${profileId}`)
    skills.push(...(profile.skills || []))
    agents.push(...(profile.agents || []))
  }

  return {
    baseProfile,
    activeProfile,
    activeProfiles,
    profiles: selectedProfileIds,
    skills: uniqueList(skills),
    agents: uniqueList(agents),
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

  if (kind === 'profiles') {
    return catalog.profiles.map((profile) => ({
      id: profile.id,
      displayName: profile.displayName,
      stage: profile.stage,
      base: profile.base === true,
      description: profile.description,
      skills: profile.skills?.length || 0,
      agents: profile.agents?.length || 0,
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

function normalizeActiveProfiles(activeProfiles, fallback) {
  if (Array.isArray(activeProfiles)) return uniqueList(activeProfiles)
  if (typeof activeProfiles === 'string' && activeProfiles.trim()) {
    return uniqueList(activeProfiles.split(',').map((entry) => entry.trim()))
  }
  return uniqueList([fallback])
}

function hydrateStaticSkills(pkgRoot, skills) {
  return skills.map((entry) => ({
    ...entry,
    sourceLayer: 'repo',
    sourceRoot: join(pkgRoot, entry.path || `skills/${entry.id}`),
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
  for (const entry of readSkillDirectories(rootPath, sourceLayer)) {
    const skillId = entry.id
    const frontmatter = parseFrontmatter(readJsonAsText(join(entry.sourceRoot, 'SKILL.md')))
    entries.push({
      id: skillId,
      name: frontmatter.name || skillId,
      description: frontmatter.description || '',
      path: entry.path,
      layer: sourceLayer === 'overlay' ? 'overlay' : 'bundle',
      category: sourceLayer === 'overlay' ? 'overlay' : (entry.domain || 'unassigned'),
      bundleIds: [],
      dependencies: [],
      optionalDependencies: [],
      sourceLayer,
      sourceRoot: entry.sourceRoot,
      dynamic: true,
    })
  }
  return entries
}

function mergeSkillEntry(previous, nextEntry) {
  if (!previous) return nextEntry
  if (nextEntry.sourceLayer !== 'overlay') {
    return {
      ...previous,
      name: previous.name || nextEntry.name,
      description: previous.description || nextEntry.description,
      sourceRoot: previous.sourceRoot || nextEntry.sourceRoot,
      dynamic: previous.dynamic,
    }
  }
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

function readSkillDirectories(rootPath, sourceLayer) {
  if (sourceLayer === 'overlay') {
    return readModuleDirectories(rootPath).map((skillId) => ({
      id: skillId,
      path: join(rootPath, skillId).replace(/\\/g, '/'),
      sourceRoot: join(rootPath, skillId),
      domain: 'overlay',
    }))
  }

  const entries = []
  walkRepoSkillDirectories(rootPath, [], entries)
  return entries
}

function walkRepoSkillDirectories(rootPath, segments, entries) {
  for (const entry of readModuleDirectories(rootPath)) {
    if (segments.length === 0 && INTERNAL_SKILL_DIRS.has(entry)) continue
    const sourceRoot = join(rootPath, entry)
    const nextSegments = [...segments, entry]
    if (readJsonAsText(join(sourceRoot, 'SKILL.md')).trim()) {
      entries.push({
        id: entry,
        path: sourceRoot.replace(/\\/g, '/'),
        sourceRoot,
        domain: segments.length > 0 ? segments[0] : '',
      })
      continue
    }
    walkRepoSkillDirectories(sourceRoot, nextSegments, entries)
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
