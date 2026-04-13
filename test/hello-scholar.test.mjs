import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { before, test } from 'node:test'
import { spawnSync } from 'node:child_process'

import { detectInstalledScope, loadInstallState, loadUserConfig } from '../scripts/cli-config.mjs'
import { loadCatalog, resolveSelection } from '../scripts/catalog-loader.mjs'
import { syncInstalledSelection } from '../scripts/cli-codex.mjs'
import { loadSelectionState, saveSelectionState } from '../scripts/selection-state.mjs'
import { applySelectionOperation, buildInteractiveFrame, buildSelectionModel } from '../scripts/text-ui.mjs'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))

before(() => {
  runNode([join(pkgRoot, 'scripts', 'build-catalog.mjs')], { cwd: pkgRoot })
})

test('catalog resolution keeps base separate and expands hard dependencies', () => {
  const catalog = loadCatalog(pkgRoot)
  const selection = resolveSelection(catalog, {
    bundles: ['obsidian-core', 'meta-builder'],
    includeBase: true,
  })

  assert(selection.skills.includes('obsidian-project-memory'))
  assert(selection.skills.includes('obsidian-markdown'))
  assert(selection.skills.includes('skill-quality-reviewer'))

  const metaBuilder = catalog.bundles.find((entry) => entry.id === 'meta-builder')
  assert(metaBuilder)
  assert(metaBuilder.skills.includes('plugin-structure'))
  assert(metaBuilder.skills.includes('skill-quality-reviewer'))
  assert.deepEqual(metaBuilder.dependsOnBase.sort(), [
    'codex-hook-emulation',
    'git-workflow',
    'planning-with-files',
    'session-wrap-up',
  ])
})

test('interactive model toggles bundles and locks inherited skills', () => {
  const catalog = loadCatalog(pkgRoot)

  const baseState = {
    mode: 'standby',
    includeBase: true,
    bundles: [],
    explicitSkills: [],
    explicitAgents: [],
    skills: [],
    agents: [],
  }

  const toggledBundle = applySelectionOperation('bundles', catalog, baseState, 0)
  assert.equal(toggledBundle.changed, true)
  assert.deepEqual(toggledBundle.nextState.bundles, ['research-core'])

  const resolved = resolveSelection(catalog, {
    bundles: ['research-core'],
    includeBase: true,
  })
  const inheritedSkillState = {
    ...baseState,
    bundles: ['research-core'],
    skills: resolved.skills,
    agents: resolved.agents,
  }

  const skillModel = buildSelectionModel('skills', catalog, inheritedSkillState)
  const researchIdeationIndex = skillModel.items.findIndex((entry) => entry.id === 'research-ideation')
  assert.notEqual(researchIdeationIndex, -1)
  assert.equal(skillModel.items[researchIdeationIndex].locked, true)

  const lockedToggle = applySelectionOperation('skills', catalog, inheritedSkillState, researchIdeationIndex)
  assert.equal(lockedToggle.changed, false)
  assert.equal(lockedToggle.nextState, inheritedSkillState)
  assert(lockedToggle.message.includes('请通过 bundles 调整'))
})

test('interactive frame windows long skill lists around the focused entry', () => {
  const catalog = loadCatalog(pkgRoot)
  const resolved = resolveSelection(catalog, {
    bundles: ['research-core', 'writing-core', 'dev-core', 'obsidian-core', 'meta-builder', 'ui-content'],
    includeBase: true,
  })

  const fullState = {
    mode: 'standby',
    includeBase: true,
    bundles: ['research-core', 'writing-core', 'dev-core', 'obsidian-core', 'meta-builder', 'ui-content'],
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

test('standby install writes text output, project prompt, and cleanup removes project state', () => {
  const fixture = createFixture()
  try {
    const projectScholarRoot = join(fixture.projectDir, '.hello-scholar')
    writeProjectAgentsFixture(fixture)

    const installText = runCli(fixture, [
      'install',
      'codex',
      '--standby',
      '--bundle',
      'research-core',
      '--bundle',
      'writing-core',
    ])

    assert(installText.includes('hello-scholar Install'))
    assert(installText.includes('- Mode: standby'))
    assert(installText.includes('research-core, writing-core'))
    assertPathExists(join(projectScholarRoot, 'skills', 'ml-paper-writing'))
    assertPathExists(join(projectScholarRoot, 'agents', 'paper-miner'))
    assertPathExists(join(projectScholarRoot, 'active-prompt.md'))
    assertPathExists(join(projectScholarRoot, 'install-state.json'))
    assertPathMissing(join(projectScholarRoot, 'hello-scholar.json'))
    assertPathMissing(join(projectScholarRoot, 'STATE.md'))
    assertPathMissing(join(fixture.globalScholarRoot, 'install-state.json'))

    const modules = readJson(join(projectScholarRoot, 'modules.json'))
    assert.equal(modules.runtime, 'hello-scholar')
    assert.equal(modules.mode, 'standby')
    assert.deepEqual(modules.bundles, ['research-core', 'writing-core'])

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
    assert(projectAgentsText.includes('# hello-scholar 配置'))
    assert(projectAgentsText.includes('## Session Start Protocol'))
    assert(projectAgentsText.includes('### 当前激活覆盖'))
    assert(projectAgentsText.includes('**research-ideation**: 研究构思启动 （当前：已激活）'))

    const doctorText = runCli(fixture, ['doctor'])
    assert(!doctorText.includes('[FAIL]'), doctorText)

    const statusText = runCli(fixture, ['status'])
    assert(statusText.includes('- Installed: yes'))
    assert(statusText.includes('- Mode: standby'))
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

test('global install writes home prompt and keeps project AGENTS clean', () => {
  const fixture = createFixture()
  try {
    const projectScholarRoot = join(fixture.projectDir, '.hello-scholar')
    writeProjectAgentsFixture(fixture)

    runCli(fixture, ['install', 'codex', '--standby', '--bundle', 'research-core'])
    assertPathExists(join(projectScholarRoot, 'skills', 'research-ideation'))

    const installText = runCli(fixture, [
      'install',
      'codex',
      '--global',
      '--bundle',
      'obsidian-core',
      '--bundle',
      'meta-builder',
    ])

    assert(installText.includes('hello-scholar Install'))
    assert(installText.includes('- Mode: global'))
    assertPathMissing(join(projectScholarRoot, 'install-state.json'))
    assertPathMissing(join(projectScholarRoot, 'modules.json'))
    assertPathMissing(join(projectScholarRoot, 'skills', 'research-ideation'))
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'obsidian-project-memory'))
    assertPathExists(join(
      fixture.codexHome,
      'plugins',
      'cache',
      'local-plugins',
      'hello-scholar',
      'local',
      'skills',
      'obsidian-project-memory',
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
    assert(configText.includes('plugins/hello-scholar/agents/literature-reviewer-obsidian/config.toml'))

    assertPathExists(join(fixture.codexHome, 'hello-scholar-active-prompt.md'))
    assertPathMissing(join(projectScholarRoot, 'active-prompt.md'))

    const homeAgentsText = readFileSync(join(fixture.codexHome, 'AGENTS.md'), 'utf-8')
    assert(homeAgentsText.includes('<!-- HELLO_SCHOLAR START -->'))
    assert(homeAgentsText.includes('# hello-scholar 配置'))
    assert(homeAgentsText.includes('## Session Start Protocol'))
    assert(homeAgentsText.includes('**skill-development / skill-improver / skill-quality-reviewer**: Skill 开发三件套 （当前：已激活）'))
    assert(homeAgentsText.includes('~/.codex/plugins/cache/local-plugins/hello-scholar/local/'))
    assert(!homeAgentsText.includes('Skills：项目 `skills/` 目录，在 config.toml 中注册'))

    const projectAgentsText = readFileSync(join(fixture.projectDir, 'AGENTS.md'), 'utf-8')
    assert(projectAgentsText.includes('# Existing Project Rules'))
    assert(!projectAgentsText.includes('<!-- HELLO_SCHOLAR START -->'))

    const doctorText = runCli(fixture, ['doctor', '--global'])
    assert(!doctorText.includes('[FAIL]'), doctorText)

    const statusText = runCli(fixture, ['status', '--global'])
    assert(statusText.includes('- Scope: global'))
    assert(statusText.includes('- Mode: global'))
    assert(statusText.includes('- Home Prompt: present'))
    assert(statusText.includes('- Home Bootstrap Block: present'))

    const cleanupText = runCli(fixture, ['cleanup', 'codex', '--global'])
    assert(cleanupText.includes('- Scope: global'))
    assert(cleanupText.includes('- Removed ~/.codex/.hello-scholar: yes'))
    assertPathMissing(join(fixture.hostHome, 'plugins', 'hello-scholar'))
    assertPathMissing(join(fixture.codexHome, 'AGENTS.md'))
    assertPathMissing(join(fixture.codexHome, 'config.toml'))
    assertPathMissing(join(fixture.codexHome, 'hello-scholar-active-prompt.md'))
    assertPathMissing(projectScholarRoot)
  } finally {
    destroyFixture(fixture)
  }
})

test('installing standby in a project removes active global state', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)

    runCli(fixture, ['install', 'codex', '--global', '--bundle', 'research-core'])
    assertPathExists(join(fixture.globalScholarRoot, 'install-state.json'))
    assertPathExists(join(fixture.codexHome, 'AGENTS.md'))

    const installText = runCli(fixture, ['install', 'codex', '--standby', '--bundle', 'writing-core'])
    assert(installText.includes('- Mode: standby'))

    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'install-state.json'))
    assertPathMissing(join(fixture.globalScholarRoot, 'install-state.json'))
    assertPathMissing(join(fixture.codexHome, 'AGENTS.md'))
    assertPathMissing(join(fixture.codexHome, 'config.toml'))
    assertPathMissing(join(fixture.codexHome, 'hello-scholar-active-prompt.md'))
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
      bundles: ['writing-core'],
      explicitSkills: [],
      explicitAgents: [],
      skills: [],
      agents: [],
    }, null, 2), 'utf-8')

    runCli(fixture, ['install', 'codex', '--global', '--bundle', 'research-core'])

    const statusText = runCli(fixture, ['status'])
    assert(statusText.includes('- Scope: global'))
    assert(statusText.includes('- Installed: yes'))
    assert(statusText.includes('- Mode: global'))
  } finally {
    destroyFixture(fixture)
  }
})

test('list selection follows global scope when global is the active install', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)
    runCli(fixture, ['install', 'codex', '--global', '--bundle', 'research-core'])
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'research-ideation'))

    mkdirSync(join(fixture.projectDir, '.hello-scholar'), { recursive: true })
    writeFileSync(join(fixture.projectDir, '.hello-scholar', 'modules.json'), JSON.stringify({
      runtime: 'hello-scholar',
      mode: 'standby',
      includeBase: true,
      bundles: ['writing-core'],
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
      bundles: ['meta-builder'],
      explicitSkills: [],
      explicitAgents: [],
      storageScope: scope,
    }, runtime, { cwd: fixture.projectDir, scope })
    const syncResult = syncInstalledSelection(runtime, loadInstallState(runtime, fixture.projectDir, scope), savedSelection, fixture.projectDir)
    assert(syncResult)

    const globalModules = readJson(join(fixture.globalScholarRoot, 'modules.json'))
    const projectModules = readJson(join(fixture.projectDir, '.hello-scholar', 'modules.json'))
    assert.deepEqual(globalModules.bundles, ['meta-builder'])
    assert.deepEqual(projectModules.bundles, ['writing-core'])
    assertPathExists(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'plugin-structure'))
    assertPathMissing(join(fixture.hostHome, 'plugins', 'hello-scholar', 'skills', 'research-ideation'))
  } finally {
    destroyFixture(fixture)
  }
})

test('list selection follows standby scope when current project standby is active', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)
    runCli(fixture, ['install', 'codex', '--standby', '--bundle', 'research-core'])
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'research-ideation'))

    mkdirSync(fixture.globalScholarRoot, { recursive: true })
    writeFileSync(join(fixture.globalScholarRoot, 'modules.json'), JSON.stringify({
      runtime: 'hello-scholar',
      mode: 'global',
      includeBase: true,
      bundles: ['meta-builder'],
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
      bundles: ['writing-core'],
      explicitSkills: [],
      explicitAgents: [],
      storageScope: scope,
    }, runtime, { cwd: fixture.projectDir, scope })
    const syncResult = syncInstalledSelection(runtime, loadInstallState(runtime, fixture.projectDir, scope), savedSelection, fixture.projectDir)
    assert(syncResult)

    const projectModules = readJson(join(fixture.projectDir, '.hello-scholar', 'modules.json'))
    const globalModules = readJson(join(fixture.globalScholarRoot, 'modules.json'))
    assert.deepEqual(projectModules.bundles, ['writing-core'])
    assert.deepEqual(globalModules.bundles, ['meta-builder'])
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'ml-paper-writing'))
    assertPathMissing(join(fixture.projectDir, '.hello-scholar', 'skills', 'research-ideation'))
  } finally {
    destroyFixture(fixture)
  }
})

test('first install without explicit mode defaults to standby', () => {
  const fixture = createFixture()
  try {
    writeProjectAgentsFixture(fixture)

    const installText = runCli(fixture, ['install', 'codex', '--bundle', 'research-core'])
    assert(installText.includes('- Mode: standby'))
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'install-state.json'))
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'research-ideation'))
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

    runNode([join(pkgRoot, 'cli.mjs'), 'install', 'codex', '--standby', '--bundle', 'research-core'], {
      cwd: fixture.projectDir,
      env: fixture.env,
    })
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'install-state.json'))

    runNode([join(pkgRoot, 'cli.mjs'), 'install', 'codex', '--standby', '--bundle', 'writing-core'], {
      cwd: projectB,
      env: fixture.env,
    })

    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'install-state.json'))
    assertPathExists(join(projectB, '.hello-scholar', 'install-state.json'))
    assertPathExists(join(fixture.projectDir, '.hello-scholar', 'skills', 'research-ideation'))
    assertPathExists(join(projectB, '.hello-scholar', 'skills', 'ml-paper-writing'))
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-'))
  const hostHome = join(root, 'home')
  const codexHome = join(hostHome, '.codex')
  const globalScholarRoot = join(codexHome, '.hello-scholar')
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
