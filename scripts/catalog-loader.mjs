import { join } from 'node:path'

import { readJson } from './cli-utils.mjs'

export function loadCatalog(pkgRoot) {
  const base = readJson(join(pkgRoot, 'catalog', 'base.json'), null)
  const bundles = readJson(join(pkgRoot, 'catalog', 'bundles.json'), null)
  const skills = readJson(join(pkgRoot, 'catalog', 'skills.json'), null)
  const agents = readJson(join(pkgRoot, 'catalog', 'agents.json'), null)
  if (!base || !bundles || !skills || !agents) {
    throw new Error('Catalog files are missing. Run `node scripts/build-catalog.mjs` first.')
  }
  return {
    base,
    bundles,
    skills,
    agents,
    bundleMap: new Map(bundles.map((entry) => [entry.id, entry])),
    skillMap: new Map(skills.map((entry) => [entry.id, entry])),
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
