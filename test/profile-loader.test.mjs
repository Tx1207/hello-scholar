import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, test } from 'node:test'

import { loadCatalog, resolveProfileSelection, resolveSelection } from '../scripts/profile/catalog-loader.mjs'
import { loadSelectionState, saveSelectionState } from '../scripts/profile/selection-state.mjs'
import { applySelectionOperation } from '../scripts/text-ui.mjs'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))
const tempRoots = []

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true })
  }
})

test('profile catalog exposes lifecycle and support profiles with ml-development as base', () => {
  const catalog = loadCatalog(pkgRoot)
  const expectedLifecycleProfiles = [
    'research-ideation',
    'ml-development',
    'paper-writing',
    'paper-self-review',
    'submission-rebuttal',
    'post-acceptance',
  ]
  const expectedSupportProfiles = [
    'knowledge-extraction',
    'obsidian-memory',
    'zotero-integration',
    'skill-evolution',
  ]

  assert.deepEqual(catalog.profiles.map((profile) => profile.id), [
    ...expectedLifecycleProfiles,
    ...expectedSupportProfiles,
  ])
  assert.equal(catalog.profiles.filter((profile) => profile.base === true).length, 1)
  assert.equal(catalog.profileMap.get('ml-development')?.base, true)

  for (const profile of catalog.profiles) {
    assert(profile.displayName)
    assert(profile.stage)
    assert(profile.description)
    assert((profile.skills || []).length > 0)
  }
})

test('all repo skills can be activated through base, profile, or hard dependency selection', () => {
  const catalog = loadCatalog(pkgRoot)
  const activatableSkills = new Set()

  for (const skillId of catalog.base.defaultSkills) activatableSkills.add(skillId)
  for (const profile of catalog.profiles) {
    const selection = resolveSelection(catalog, {
      activeProfiles: [profile.id],
      includeBase: true,
    })
    for (const skillId of selection.skills) activatableSkills.add(skillId)
  }

  const orphanSkills = catalog.skills
    .filter((entry) => entry.sourceLayer !== 'overlay')
    .map((entry) => entry.id)
    .filter((skillId) => !activatableSkills.has(skillId))

  assert.deepEqual(orphanSkills, [])
})

test('ml-development resolves as the default base profile only', () => {
  const catalog = loadCatalog(pkgRoot)
  const profileSelection = resolveProfileSelection(catalog, {
    baseProfile: 'ml-development',
    activeProfile: 'ml-development',
  })
  const selection = resolveSelection(catalog, {
    baseProfile: 'ml-development',
    activeProfile: 'ml-development',
  })

  assert.deepEqual(profileSelection.profiles, ['ml-development'])
  assert.deepEqual(profileSelection.activeProfiles, ['ml-development'])
  assert.equal(selection.baseProfile, 'ml-development')
  assert.equal(selection.activeProfile, 'ml-development')
  assert(selection.skills.includes('daily-coding'))
  assert(selection.skills.includes('results-analysis'))
  assert(selection.agents.includes('code-reviewer'))
  assert(selection.agents.includes('record-keeper'))
})

test('paper-writing resolves as ml-development base plus paper-writing stage', () => {
  const catalog = loadCatalog(pkgRoot)
  const profileSelection = resolveProfileSelection(catalog, {
    baseProfile: 'ml-development',
    activeProfile: 'paper-writing',
  })
  const selection = resolveSelection(catalog, {
    baseProfile: 'ml-development',
    activeProfile: 'paper-writing',
  })

  assert.deepEqual(profileSelection.profiles, ['ml-development', 'paper-writing'])
  assert.deepEqual(profileSelection.activeProfiles, ['paper-writing'])
  assert.equal(selection.baseProfile, 'ml-development')
  assert.equal(selection.activeProfile, 'paper-writing')
  assert(selection.skills.includes('daily-coding'))
  assert(selection.skills.includes('ml-paper-writing'))
  assert(selection.skills.includes('results-report'))
  assert(selection.agents.includes('code-reviewer'))
  assert(selection.agents.includes('paper-miner'))
})

test('unknown profile fails profile resolution', () => {
  const catalog = loadCatalog(pkgRoot)

  assert.throws(
    () => resolveProfileSelection(catalog, { activeProfile: 'not-a-profile' }),
    /Unknown profile: not-a-profile/,
  )
})

test('selection state persists and reloads baseProfile and activeProfile from modules.json', () => {
  const catalog = loadCatalog(pkgRoot)
  const root = createTempRoot()
  const cwd = join(root, 'project')
  const runtime = createRuntime(root)

  const saved = saveSelectionState(catalog, {
    includeBase: true,
    activeProfile: 'paper-writing',
    activeProfiles: ['paper-writing'],
    explicitSkills: [],
    explicitAgents: [],
  }, runtime, { cwd, scope: 'project' })
  const modules = JSON.parse(readFileSync(join(cwd, '.hello-scholar', 'modules.json'), 'utf-8'))
  const loaded = loadSelectionState(catalog, { hosts: {} }, { auto_base: true, install_mode: 'standby' }, runtime, {
    cwd,
    scope: 'project',
  })

  assert.equal(saved.baseProfile, 'ml-development')
  assert.equal(saved.activeProfile, 'paper-writing')
  assert.equal(modules.baseProfile, 'ml-development')
  assert.equal(modules.activeProfile, 'paper-writing')
  assert.deepEqual(modules.activeProfiles, ['paper-writing'])
  assert(loaded.skills.includes('daily-coding'))
  assert(loaded.skills.includes('ml-paper-writing'))
  assert(loaded.agents.includes('code-reviewer'))
  assert(loaded.agents.includes('paper-miner'))
})

test('profile selection operation updates activeProfile without changing baseProfile', () => {
  const catalog = loadCatalog(pkgRoot)
  const currentState = {
    includeBase: true,
    baseProfile: 'ml-development',
    activeProfile: 'ml-development',
    activeProfiles: ['ml-development'],
    explicitSkills: [],
    explicitAgents: [],
    skills: [],
    agents: [],
  }
  const paperWritingIndex = catalog.profiles.findIndex((profile) => profile.id === 'paper-writing')
  const result = applySelectionOperation('profiles', catalog, currentState, paperWritingIndex)

  assert.equal(result.changed, true)
  assert.equal(result.nextState.baseProfile, 'ml-development')
  assert.equal(result.nextState.activeProfile, 'paper-writing')
  assert.deepEqual(result.nextState.activeProfiles, ['paper-writing', 'ml-development'])
})

function createTempRoot() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-profile-'))
  tempRoots.push(root)
  return root
}

function createRuntime(root) {
  return {
    scholarHome: join(root, 'global', '.hello-scholar'),
    installStatePath: join(root, 'global', '.hello-scholar', 'install-state.json'),
  }
}
