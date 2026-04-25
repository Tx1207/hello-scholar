import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { before, test } from 'node:test'
import { spawnSync } from 'node:child_process'

import { detectInstalledScope, loadInstallState, loadUserConfig } from '../scripts/install/cli-config.mjs'
import { loadCatalog, resolveSelection } from '../scripts/profile/catalog-loader.mjs'
import { syncInstalledSelection } from '../scripts/install/cli-codex.mjs'
import { loadSelectionState, saveSelectionState } from '../scripts/profile/selection-state.mjs'
import { renderManagedBootstrapPrompt } from '../scripts/project-prompt.mjs'
import { applySelectionOperation, buildInteractiveFrame, buildSelectionModel } from '../scripts/text-ui.mjs'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

before(() => {
  runNode([join(pkgRoot, 'scripts', 'build-catalog.mjs')], { cwd: pkgRoot })
})

test('catalog resolution keeps base separate and expands hard dependencies', () => {
  const catalog = loadCatalog(pkgRoot)
  const selection = resolveSelection(catalog, {
    activeProfiles: ['paper-writing'],
    includeBase: true,
  })

  assert(selection.skills.includes('daily-coding'))
  assert(selection.skills.includes('ml-paper-writing'))
  assert(selection.skills.includes('results-analysis'))
  assert(selection.skills.includes('citation-verification'))
  assert(selection.agents.includes('code-reviewer'))
  assert(selection.agents.includes('paper-miner'))
  assert.equal(catalog.skillMap.has('commands'), false)
})

test('interactive model toggles profiles and locks inherited skills', () => {
  const catalog = loadCatalog(pkgRoot)

  const baseState = {
    mode: 'standby',
    includeBase: true,
    baseProfile: 'ml-development',
    activeProfile: 'ml-development',
    activeProfiles: ['ml-development'],
    explicitSkills: [],
    explicitAgents: [],
    skills: [],
    agents: [],
  }

  const paperWritingIndex = catalog.profiles.findIndex((entry) => entry.id === 'paper-writing')
  const toggledProfile = applySelectionOperation('profiles', catalog, baseState, paperWritingIndex)
  assert.equal(toggledProfile.changed, true)
  assert.deepEqual(toggledProfile.nextState.activeProfiles, ['paper-writing', 'ml-development'])

  const resolved = resolveSelection(catalog, {
    activeProfiles: ['paper-writing'],
    includeBase: true,
  })
  const inheritedSkillState = {
    ...baseState,
    activeProfile: 'paper-writing',
    activeProfiles: ['paper-writing'],
    skills: resolved.skills,
    agents: resolved.agents,
  }

  const skillModel = buildSelectionModel('skills', catalog, inheritedSkillState)
  const paperWritingSkillIndex = skillModel.items.findIndex((entry) => entry.id === 'ml-paper-writing')
  assert.notEqual(paperWritingSkillIndex, -1)
  assert.equal(skillModel.items[paperWritingSkillIndex].locked, true)

  const lockedToggle = applySelectionOperation('skills', catalog, inheritedSkillState, paperWritingSkillIndex)
  assert.equal(lockedToggle.changed, false)
  assert.equal(lockedToggle.nextState, inheritedSkillState)
  assert(lockedToggle.message.includes('profile use'))
})

test('interactive frame windows long skill lists around the focused entry', () => {
  const catalog = loadCatalog(pkgRoot)
  const activeProfiles = catalog.profiles.map((entry) => entry.id)
  const resolved = resolveSelection(catalog, {
    activeProfiles,
    includeBase: true,
  })

  const fullState = {
    mode: 'standby',
    includeBase: true,
    baseProfile: 'ml-development',
    activeProfile: activeProfiles[0],
    activeProfiles,
    explicitSkills: [],
    explicitAgents: [],
    skills: resolved.skills,
    agents: resolved.agents,
  }

  const frame = buildInteractiveFrame('skills', catalog, fullState, 20, 'testing', {
    rows: 14,
    cols: 80,
  })

  assert(frame.entries.length > frame.visibleCount)
  assert(frame.start > 0)
  assert(frame.end <= frame.entries.length)
  assert(frame.lines.some((line) => line.includes('当前:')))
  assert(frame.lines.some((line) => line.includes('... 上方还有')))
})

test('help command prints CLI usage', () => {
  const fixture = createFixture()
  try {
    for (const flag of ['help', '-h', '--help']) {
      const helpText = runCli(fixture, [flag])
      assert(helpText.includes('Usage:'))
      assert(helpText.includes('hello-scholar help'))
      assert(helpText.includes('hello-scholar profile list'))
    }
  } finally {
    destroyFixture(fixture)
  }
})

test('activation prompt lifecycle status follows active profiles instead of reused skills', () => {
  const fixture = createFixture()
  try {
    const catalog = loadCatalog(pkgRoot)
    const selection = resolveSelection(catalog, {
      baseProfile: 'ml-development',
      activeProfile: 'ml-development',
    })
    const prompt = renderManagedBootstrapPrompt({
      runtime: createRuntime(fixture),
      catalog,
      selection,
      mode: 'standby',
    })

    assert(prompt.includes('- 1. 研究构思：未激活'))
    assert(prompt.includes('- 2. ML 项目开发：已激活'))
    assert(prompt.includes('- 3. 论文写作：未激活'))
  } finally {
    destroyFixture(fixture)
  }
})

test('standby install writes text output, project prompt, and cleanup removes project state', () => {
  const fixture = createFixture()
  try {
    const projectScholarRoot = join(fixture.projectDir, '.hello-scholar')
    writeProjectAgentsFixture(fixture)

    runCli(fixture, ['profile', 'use', 'paper-writing', '--standby'])
    const installText = runCli(fixture, ['install', 'codex', '--standby'])

    assert(installText.includes('hello-scholar Install'))
    assert(installText.includes('- Mode: standby'))
    assert(installText.includes('- Profile: paper-writing'))
    assertPathExists(join(projectScholarRoot, 'skills', 'writing', 'ml-paper-writing'))
    assertPathExists(join(projectScholarRoot, 'skills', 'commands', 'plan', 'SKILL.md'))
    assertPathExists(join(projectScholarRoot, 'skills', 'commands', 'verify', 'SKILL.md'))
    assertPathExists(join(projectScholarRoot, 'agents', 'paper-miner'))
    assertPathExists(join(projectScholarRoot, 'active-prompt.md'))
    assertPathExists(join(projectScholarRoot, 'install-state.json'))
    assertPathExists(join(projectScholarRoot, 'scripts', 'change-tracker.mjs'))
    assertPathExists(join(projectScholarRoot, 'scripts', 'plan-package.mjs'))
    assertPathExists(join(projectScholarRoot, 'scripts', 'delivery-gate.mjs'))
    assertPathExists(join(projectScholarRoot, 'scripts', 'research-store.mjs'))
    assertPathExists(join(projectScholarRoot, 'scripts', 'capability-registry.mjs'))
    assertPathExists(join(projectScholarRoot, 'templates', 'change-record.md'))
    assertPathExists(join(projectScholarRoot, 'templates', 'plan-requirements.md'))
    assertPathMissing(join(projectScholarRoot, 'hello-scholar.json'))
    assertPathMissing(join(projectScholarRoot, 'STATE.md'))
    assertPathMissing(join(fixture.globalScholarRoot, 'install-state.json'))

    const modules = readJson(join(projectScholarRoot, 'modules.json'))
    assert.equal(modules.runtime, 'hello-scholar')
    assert.equal(modules.mode, 'standby')
    assert.equal(modules.activeProfile, 'paper-writing')

    const installState = readJson(join(projectScholarRoot, 'install-state.json'))
    assert.equal(installState.install_mode, 'standby')
    assert.equal(installState.auto_base, true)
    assert.equal(installState.last_host, 'codex')

    assertPathMissing(join(fixture.codexHome, 'config.toml'))
    assertPathMissing(join(fixture.codexHome, 'AGENTS.md'))
    assertPathMissing(join(fixture.codexHome, 'hello-scholar-active-prompt.md'))

    const projectAgentsText = readFileSync(join(fixture.projectDir, 'AGENTS.md'), 'utf-8')
    assert(projectAgentsText.includes('# Existing Project Rules'))
    assert(projectAgentsText.includes('<!-- HELLO_SCHOLAR START -->'))
    assert(projectAgentsText.includes('# hello-scholar'))
    assert(projectAgentsText.includes('## 统一执行流程'))
    assert(projectAgentsText.includes('## 当前激活 Profile'))
    assert(projectAgentsText.includes('【hello-scholar】'))
    assert(projectAgentsText.includes('🔄 下一步'))
    assert(projectAgentsText.includes('paper-writing'))

    writeOverlaySkillFixture(fixture, 'status-overlay-skill')
    const statusText = runCli(fixture, ['status'])
    assert(statusText.includes('- Installed: yes'))
    assert(statusText.includes('- Mode: standby'))
    assert(statusText.includes('- Standby Install: installed (standby'))
    assert(statusText.includes('- Global Install: not installed'))
    assert(statusText.includes('- Active Change: None'))
    assert(statusText.includes('- Active Experiment: None'))
    assert(statusText.includes('- Overlay Skills: 1'))
    assert(statusText.includes('- Preference Sources: built-in'))
    assert(statusText.includes('- Project Preferences:'))
    assert(statusText.includes('- Project Prompt: present'))
    assert(statusText.includes('- Project Bootstrap Block: present'))
    assert(statusText.includes('- Scope: standby'))

    const cleanupText = runCli(fixture, ['cleanup', 'codex'])
    assert(cleanupText.includes('hello-scholar Cleanup'))
    assert(cleanupText.includes('- Removed .hello-scholar: yes'))
    assertPathMissing(projectScholarRoot)

    const cleanedAgentsText = readFileSync(join(fixture.projectDir, 'AGENTS.md'), 'utf-8')
    assert(cleanedAgentsText.includes('# Existing Project Rules'))
    assert(!cleanedAgentsText.includes('<!-- HELLO_SCHOLAR START -->'))

    const cleanedStatusText = runCli(fixture, ['status'])
    assert(cleanedStatusText.includes('- Installed: no'))
    assert(cleanedStatusText.includes('- Project Prompt: absent'))
  } finally {
    destroyFixture(fixture)
  }
})

test('global install is blocked until current project standby is manually cleaned', () => {
  const fixture = createFixture()
  try {
    const projectScholarRoot = join(fixture.projectDir, '.hello-scholar')
    writeProjectAgentsFixture(fixture)

    runCli(fixture, ['install', 'codex', '--standby'])
    assertPathExists(join(projectScholarRoot, 'skills', 'research', 'research-ideation'))

    const blocked = spawnSync(process.execPath, [
      join(pkgRoot, 'cli.mjs'),
      'install',
      'codex',
      '--global',
    ], { cwd: fixture.projectDir, env: fixture.env, encoding: 'utf-8' })

    assert.equal(blocked.status, 1)
    assert(blocked.stderr.includes('Standby install is active'))
    assertPathExists(join(projectScholarRoot, 'install-state.json'))

    runCli(fixture, ['cleanup', 'codex', '--standby'])
    const installText = runCli(fixture, ['install', 'codex', '--global'])

    assert(installText.includes('hello-scholar Install'))
    assert(installText.includes('- Mode: global'))
    assertPathMissing(join(projectScholarRoot, 'install-state.json'))
    assertPathMissing(join(projectScholarRoot, 'modules.json'))
    assertPathMissing(join(projectScholarRoot, 'skills', 'research', 'research-ideation'))
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'research', 'research-ideation'))
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'commands', 'verify', 'SKILL.md'))
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'core', 'daily-coding', 'SKILL.md'))
    assertPathExists(join(
      fixture.codexHome,
      'plugins',
      'cache',
      'local-plugins',
      'hello-scholar',
      'local',
      'skills',
      'research',
      'research-ideation',
    ))
    assertPathExists(join(fixture.globalScholarRoot, 'install-state.json'))
    assertPathMissing(join(fixture.globalScholarRoot, 'hello-scholar.json'))
    assertPathMissing(join(fixture.globalScholarRoot, 'STATE.md'))

    const installState = readJson(join(fixture.globalScholarRoot, 'install-state.json'))
    assert.equal(installState.install_mode, 'global')
    assert.equal(installState.auto_base, true)
    assert.equal(installState.last_host, 'codex')

    const configText = readFileSync(join(fixture.codexHome, 'config.toml'), 'utf-8')
    assert(configText.includes('[plugins."hello-scholar@local-plugins"]'))
    assert(configText.includes('plugins/hello-scholar/agents/literature-reviewer/config.toml'))

    assertPathExists(join(fixture.codexHome, 'hello-scholar-active-prompt.md'))
    assertPathMissing(join(projectScholarRoot, 'active-prompt.md'))

    const homeAgentsText = readFileSync(join(fixture.codexHome, 'AGENTS.md'), 'utf-8')
    assert(homeAgentsText.includes('<!-- HELLO_SCHOLAR START -->'))
    assert(homeAgentsText.includes('# hello-scholar'))
    assert(homeAgentsText.includes('## 统一执行流程'))
    assert(homeAgentsText.includes('ml-development'))
    assert(!homeAgentsText.includes('Skills：项目 `skills/` 目录，在 config.toml 中注册'))

    const projectAgentsText = readFileSync(join(fixture.projectDir, 'AGENTS.md'), 'utf-8')
    assert(projectAgentsText.includes('# Existing Project Rules'))
    assert(!projectAgentsText.includes('<!-- HELLO_SCHOLAR START -->'))

    const statusText = runCli(fixture, ['status', '--global'])
    assert(statusText.includes('- Scope: global'))
    assert(statusText.includes('- Mode: global'))
    assert(statusText.includes('- Standby Install: not installed'))
    assert(statusText.includes('- Global Install: installed (global'))
    assert(statusText.includes('- Home Prompt: present'))
    assert(statusText.includes('- Home Bootstrap Block: present'))

    const cleanupText = runCli(fixture, ['cleanup', 'codex', '--global'])
    assert(cleanupText.includes('- Scope: global'))
    assert(cleanupText.includes('- Removed global install state: yes'))
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', '.hello-scholar'))
    assertPathMissing(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills'))
    assertPathMissing(join(fixture.codexHome, 'AGENTS.md'))
    assertPathMissing(join(fixture.codexHome, 'config.toml'))
    assertPathMissing(join(fixture.codexHome, 'hello-scholar-active-prompt.md'))
    assertPathMissing(projectScholarRoot)
  } finally {
    destroyFixture(fixture)
  }
})

test('installing standby in a project is blocked while global is active', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)

    runCli(fixture, ['install', 'codex', '--global'])
    assertPathExists(join(fixture.globalScholarRoot, 'install-state.json'))
    assertPathExists(join(fixture.codexHome, 'AGENTS.md'))

    const blocked = spawnSync(process.execPath, [join(pkgRoot, 'cli.mjs'), 'install', 'codex', '--standby'], {
      cwd: fixture.projectDir,
      env: fixture.env,
      encoding: 'utf-8',
    })
    assert.equal(blocked.status, 1)
    assert(blocked.stderr.includes('Global install is active'))

    assertPathMissing(join(fixture.projectDir, '.hello-scholar', 'install-state.json'))
    assertPathExists(join(fixture.globalScholarRoot, 'install-state.json'))
    assertPathExists(join(fixture.codexHome, 'AGENTS.md'))
  } finally {
    destroyFixture(fixture)
  }
})

test('status defaults to global when global is installed and project only has local selection files', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)
    mkdirSync(join(fixture.projectDir, '.hello-scholar'), { recursive: true })
    writeFileSync(join(fixture.projectDir, '.hello-scholar', 'modules.json'), JSON.stringify({
      runtime: 'hello-scholar',
      mode: 'standby',
      includeBase: true,
      activeProfiles: ['paper-writing'],
      explicitSkills: [],
      explicitAgents: [],
      skills: [],
      agents: [],
    }, null, 2), 'utf-8')

    runCli(fixture, ['install', 'codex', '--global'])

    const statusText = runCli(fixture, ['status'])
    assert(statusText.includes('- Scope: global'))
    assert(statusText.includes('- Installed: yes'))
    assert(statusText.includes('- Mode: global'))
  } finally {
    destroyFixture(fixture)
  }
})

test('selection follows global scope when global is the active install', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)
    runCli(fixture, ['install', 'codex', '--global'])
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'research', 'research-ideation'))

    mkdirSync(join(fixture.projectDir, '.hello-scholar'), { recursive: true })
    writeFileSync(join(fixture.projectDir, '.hello-scholar', 'modules.json'), JSON.stringify({
      runtime: 'hello-scholar',
      mode: 'standby',
      includeBase: true,
      activeProfiles: ['paper-writing'],
      explicitSkills: [],
      explicitAgents: [],
      skills: [],
      agents: [],
    }, null, 2), 'utf-8')

    const runtime = createRuntime(fixture)
    const catalog = loadCatalog(pkgRoot)
    const scope = detectInstalledScope(runtime, fixture.projectDir)
    assert.equal(scope, 'global')

    const userConfig = loadUserConfig(runtime, fixture.projectDir, scope)
    const installState = loadInstallState(runtime, fixture.projectDir, scope).state
    const currentState = loadSelectionState(catalog, installState, userConfig, runtime, {
      cwd: fixture.projectDir,
      scope,
    })

    const savedSelection = saveSelectionState(catalog, {
      ...currentState,
      activeProfiles: ['paper-writing'],
      explicitSkills: [],
      explicitAgents: [],
      storageScope: scope,
    }, runtime, { cwd: fixture.projectDir, scope })
    const syncResult = syncInstalledSelection(runtime, loadInstallState(runtime, fixture.projectDir, scope), savedSelection, fixture.projectDir)
    assert(syncResult)

    const globalModules = readJson(join(fixture.globalScholarRoot, 'modules.json'))
    const projectModules = readJson(join(fixture.projectDir, '.hello-scholar', 'modules.json'))
    assert.deepEqual(globalModules.activeProfiles, ['paper-writing'])
    assert.deepEqual(projectModules.activeProfiles, ['paper-writing'])
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'writing', 'ml-paper-writing'))
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'research', 'research-ideation'))
  } finally {
    destroyFixture(fixture)
  }
})

test('selection follows standby scope when current project standby is active', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)
    runCli(fixture, ['install', 'codex', '--standby'])
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'research', 'research-ideation'))

    mkdirSync(fixture.globalScholarRoot, { recursive: true })
    writeFileSync(join(fixture.globalScholarRoot, 'modules.json'), JSON.stringify({
      runtime: 'hello-scholar',
      mode: 'global',
      includeBase: true,
      activeProfiles: ['paper-writing'],
      explicitSkills: [],
      explicitAgents: [],
      skills: [],
      agents: [],
    }, null, 2), 'utf-8')

    const runtime = createRuntime(fixture)
    const catalog = loadCatalog(pkgRoot)
    const scope = detectInstalledScope(runtime, fixture.projectDir)
    assert.equal(scope, 'project')

    const userConfig = loadUserConfig(runtime, fixture.projectDir, scope)
    const installState = loadInstallState(runtime, fixture.projectDir, scope).state
    const currentState = loadSelectionState(catalog, installState, userConfig, runtime, {
      cwd: fixture.projectDir,
      scope,
    })

    const savedSelection = saveSelectionState(catalog, {
      ...currentState,
      activeProfiles: ['paper-writing'],
      explicitSkills: [],
      explicitAgents: [],
      storageScope: scope,
    }, runtime, { cwd: fixture.projectDir, scope })
    const syncResult = syncInstalledSelection(runtime, loadInstallState(runtime, fixture.projectDir, scope), savedSelection, fixture.projectDir)
    assert(syncResult)

    const projectModules = readJson(join(fixture.projectDir, '.hello-scholar', 'modules.json'))
    const globalModules = readJson(join(fixture.globalScholarRoot, 'modules.json'))
    assert.deepEqual(projectModules.activeProfiles, ['paper-writing'])
    assert.deepEqual(globalModules.activeProfiles, ['paper-writing'])
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'writing', 'ml-paper-writing'))
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'research', 'research-ideation'))
  } finally {
    destroyFixture(fixture)
  }
})

test('first install without explicit mode defaults to standby', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)

    const installText = runCli(fixture, ['install', 'codex'])
    assert(installText.includes('- Mode: standby'))
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'install-state.json'))
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'research', 'research-ideation'))
    assertPathMissing(join(fixture.globalScholarRoot, 'install-state.json'))
    assertPathMissing(join(fixture.codexHome, 'AGENTS.md'))
  } finally {
    destroyFixture(fixture)
  }
})

test('standby installs in different projects do not delete each other', () => {
  const fixture = createFixture()
  const projectB = join(fixture.root, 'project-b')
  mkdirSync(projectB, { recursive: true })
  try {
    writeProjectAgentsFixture(fixture)
    writeFileSync(join(projectB, 'AGENTS.md'), [
      '# Existing Project Rules',
      '',
      'Keep this file structure intact.',
      '',
    ].join('\n'), 'utf-8')

    runNode([join(pkgRoot, 'cli.mjs'), 'install', 'codex', '--standby'], {
      cwd: fixture.projectDir,
      env: fixture.env,
    })
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'install-state.json'))

    runNode([join(pkgRoot, 'cli.mjs'), 'install', 'codex', '--standby'], {
      cwd: projectB,
      env: fixture.env,
    })

    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'install-state.json'))
    assertPathExists(join(projectB, '.hello-scholar', 'install-state.json'))
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'research', 'research-ideation'))
    assertPathExists(join(projectB, '.hello-scholar', 'skills', 'core', 'daily-coding'))
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-'))
  const hostHome = join(root, 'home')
  const codexHome = join(hostHome, '.codex')
  const globalScholarRoot = join(hostHome, 'plugins', 'hello-scholar', '.hello-scholar')
  const projectDir = join(root, 'project')
  mkdirSync(projectDir, { recursive: true })
  return {
    root,
    hostHome,
    codexHome,
    globalScholarRoot,
    projectDir,
    env: {
      ...process.env,
      CODEX_HOME: codexHome,
      HELLO_SCHOLAR_HOST_HOME: hostHome,
    },
  }
}

function writeProjectAgentsFixture(fixture) {
  writeFileSync(join(fixture.projectDir, 'AGENTS.md'), [
    '# Existing Project Rules',
    '',
    'Keep this file structure intact.',
    '',
  ].join('\n'), 'utf-8')
}

function writeOverlaySkillFixture(fixture, skillId) {
  const skillRoot = join(fixture.globalScholarRoot, 'overlays', 'skills', skillId)
  mkdirSync(skillRoot, { recursive: true })
  writeFileSync(join(skillRoot, 'SKILL.md'), [
    '---',
    `name: ${skillId}`,
    'description: Test overlay skill for status resolver.',
    '---',
    '',
    '# Test Overlay Skill',
    '',
  ].join('\n'), 'utf-8')
}

function createRuntime(fixture) {
  return {
    pkgRoot,
    scholarHome: fixture.globalScholarRoot,
    installStatePath: join(fixture.globalScholarRoot, 'install-state.json'),
    hostHome: fixture.hostHome,
    codexHome: fixture.codexHome,
  }
}

function destroyFixture(fixture) {
  rmSync(fixture.root, { recursive: true, force: true })
}

function runCli(fixture, args) {
  return runNode([join(pkgRoot, 'cli.mjs'), ...args], {
    cwd: fixture.projectDir,
    env: fixture.env,
  })
}

function runNode(args, options) {
  const result = spawnSync(process.execPath, args, {
    ...options,
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0, [
    `Command failed: ${process.execPath} ${args.join(' ')}`,
    result.stdout,
    result.stderr,
  ].join('\n'))
  return result.stdout.trim()
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

function assertPathExists(filePath) {
  assert.equal(existsSync(filePath), true, filePath)
}

function assertPathMissing(filePath) {
  assert.equal(existsSync(filePath), false, filePath)
}
