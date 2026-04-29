import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

import { readRuntimeState } from '../scripts/runtime-state.mjs'

const pkgRoot = fileURLToPath(new URL('..', import.meta.url))
const trackerScript = join(pkgRoot, 'scripts', 'change-tracker.mjs')

test('track-intent creates a human-readable change record and state summary', () => {
  const fixture = createFixture()
  try {
    const output = runNode([
      trackerScript,
      'track-intent',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Fix training config',
      '--request',
      '修复训练配置加载问题\n保持现有训练流程不变',
      '--route',
      '~build',
      '--tier',
      'T2',
      '--file',
      'src/train.py',
    ])

    assert(output.includes('Decision: new-topic'))
    const changeFile = readSingleChangeFile(fixture.projectDir)
    assert.match(changeFile, /CHG-\d{8}-\d{6}-fix-training-config\.md$/)
    const changeText = readFileSync(changeFile, 'utf-8')
    const stateText = readFileSync(join(fixture.projectDir, 'hello-scholar', 'state', 'STATE.md'), 'utf-8')
    const runtime = readRuntimeState(fixture.projectDir)

    assert(changeText.includes('# Change: Fix training config'))
    assert(changeText.includes('## 用户请求'))
    assert(changeText.includes('## 背景'))
    assert(changeText.includes('## 文件级变更'))
    assert(changeText.includes('## 行为变化'))
    assert(changeText.includes('## 决策记录'))
    assert(changeText.includes('## 未解决问题'))
    assert(changeText.includes('## Traceability'))
    assert(changeText.includes('修复训练配置加载问题'))
    assert(changeText.includes('Route: ~build'))
    assert(changeText.includes('Tier: T2'))
    assert.match(changeText, /### \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    assert(changeText.includes('`src/train.py`'))
    assert(stateText.includes('Fix training config'))
    assert.equal(runtime.change.activeTitle, 'Fix training config')
    assert.equal(runtime.change.route, '~build')
    assert.equal(runtime.change.tier, 'T2')
  } finally {
    destroyFixture(fixture)
  }
})

test('follow-up track-intent appends to the active change when context matches', () => {
  const fixture = createFixture()
  try {
    runNode([
      trackerScript,
      'track-intent',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Fix training config loading',
      '--request',
      'Fix training config loading in the runner',
      '--route',
      '~build',
      '--tier',
      'T2',
      '--file',
      'src/train.py',
    ])

    const output = runNode([
      trackerScript,
      'track-intent',
      '--cwd',
      fixture.projectDir,
      '--request',
      'continue fixing training config loading\n补一个 test',
      '--file',
      'src/train.py',
    ])

    const changeFiles = listChangeFiles(fixture.projectDir)
    const changeText = readFileSync(changeFiles[0], 'utf-8')

    assert.equal(changeFiles.length, 1)
    assert(output.includes('Decision: append-current'))
    assert(changeText.includes('continue fixing training config loading'))
    assert(changeText.includes('补一个 test'))
  } finally {
    destroyFixture(fixture)
  }
})

test('new task wording creates a separate change record', () => {
  const fixture = createFixture()
  try {
    runNode([
      trackerScript,
      'track-intent',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Fix training config',
      '--request',
      'Fix the training config loading bug',
      '--file',
      'src/train.py',
    ])

    runNode([
      trackerScript,
      'track-intent',
      '--cwd',
      fixture.projectDir,
      '--request',
      '新任务：整理论文大纲',
      '--title',
      'Organize paper outline',
      '--route',
      '~plan',
      '--tier',
      'T1',
      '--file',
      'paper/main.tex',
    ])

    const changeFiles = listChangeFiles(fixture.projectDir)
    const indexText = readFileSync(join(fixture.projectDir, 'hello-scholar', 'changes', 'INDEX.md'), 'utf-8')

    assert.equal(changeFiles.length, 2)
    assert(indexText.includes('Fix training config'))
    assert(indexText.includes('Organize paper outline'))
  } finally {
    destroyFixture(fixture)
  }
})

test('track-change and track-closeout update sections and status', () => {
  const fixture = createFixture()
  try {
    runNode([
      trackerScript,
      'track-intent',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Fix training config',
      '--request',
      'Fix the training config loading bug',
      '--file',
      'src/train.py',
    ])

    runNode([
      trackerScript,
      'track-change',
      '--cwd',
      fixture.projectDir,
      '--summary',
      'Adjusted config load order\nAdded explicit missing-config error',
      '--file',
      'src/config/loaders.py',
      '--file-change',
      'src/config/loaders.py: changed loader order and missing-config handling',
      '--file-change',
      'src/config/schema.py: preserved legacy keys, defaults, and validation order',
      '--behavior-change',
      'Config loading now resolves CLI overrides before defaults',
      '--decision',
      'Kept legacy config file names unchanged',
      '--verification',
      'pytest tests/test_config_loader.py',
      '--result',
      'Config loading now respects CLI overrides',
      '--unresolved',
      'Legacy script coverage still needs broader integration tests',
      '--trace',
      '| 用户需求 | Plan Item | Task | Changed File | Verification | Status |\n|---|---|---|---|---|---|\n| Fix config loading | PLAN-001 | Adjust loader | `src/config/loaders.py` | pytest tests/test_config_loader.py | done |',
      '--next-step',
      'Observe impact on legacy scripts',
    ])

    runNode([
      trackerScript,
      'track-closeout',
      '--cwd',
      fixture.projectDir,
      '--result',
      'Validated the fix manually',
      '--status',
      'done',
    ])

    const changeFile = readSingleChangeFile(fixture.projectDir)
    const changeText = readFileSync(changeFile, 'utf-8')
    const stateText = readFileSync(join(fixture.projectDir, 'hello-scholar', 'state', 'STATE.md'), 'utf-8')
    const runtime = readRuntimeState(fixture.projectDir)

    assert(changeText.includes('Adjusted config load order'))
    assert(changeText.includes('src/config/loaders.py: changed loader order and missing-config handling'))
    assert(changeText.includes('src/config/schema.py: preserved legacy keys, defaults, and validation order'))
    assert(changeText.includes('Config loading now resolves CLI overrides before defaults'))
    assert(changeText.includes('Kept legacy config file names unchanged'))
    assert(changeText.includes('Legacy script coverage still needs broader integration tests'))
    assert(changeText.includes('| Fix config loading | PLAN-001 | Adjust loader | `src/config/loaders.py` | pytest tests/test_config_loader.py | done |'))
    assert(changeText.includes('pytest tests/test_config_loader.py'))
    assert(changeText.includes('Validated the fix manually'))
    assert(changeText.includes('status: done'))
    assert(stateText.includes('Active change: None'))
    assert.equal(runtime.change.active_change_id, '')
    assert.equal(runtime.change.activeStatus, 'none')
  } finally {
    destroyFixture(fixture)
  }
})

test('track-change can update legacy English-section change records', () => {
  const fixture = createFixture()
  try {
    const changesRoot = join(fixture.projectDir, 'hello-scholar', 'changes')
    mkdirSync(changesRoot, { recursive: true })
    const legacyPath = join(changesRoot, 'CHG-20200101-000000-legacy.md')
    writeFileSync(legacyPath, [
      '---',
      'id: CHG-20200101-000000',
      'title: Legacy record',
      'slug: legacy-record',
      'status: active',
      'created: 2020-01-01T00:00:00.000Z',
      'updated: 2020-01-01T00:00:00.000Z',
      'route: ~build',
      'tier: T1',
      'decision: new-topic',
      'affected_files:',
      '  - src/legacy.py',
      '---',
      '# Change: Legacy record',
      '',
      '## User Requests',
      '',
      '### 2020-01-01 00:00:00',
      '',
      '- Keep this legacy request',
      '',
      '## Intent Summary',
      '',
      '- Route: ~build',
      '',
      '## Affected Files',
      '',
      '- `src/legacy.py`',
      '',
      '## Actual Changes',
      '',
      '- 暂无记录',
      '',
      '## Verification',
      '',
      '- 暂无记录',
      '',
      '## Result',
      '',
      '- 暂无记录',
      '',
      '## Next Step',
      '',
      '- 暂无记录',
      '',
    ].join('\n'))

    runNode([
      trackerScript,
      'track-change',
      '--cwd',
      fixture.projectDir,
      '--change-id',
      'CHG-20200101-000000',
      '--summary',
      'Updated a legacy record',
      '--file-change',
      'src/legacy.py: documented legacy compatibility',
    ])

    const changeText = readFileSync(legacyPath, 'utf-8')
    assert(changeText.includes('Keep this legacy request'))
    assert(changeText.includes('## 用户请求'))
    assert(changeText.includes('## 文件级变更'))
    assert(changeText.includes('Updated a legacy record'))
    assert(changeText.includes('src/legacy.py: documented legacy compatibility'))
  } finally {
    destroyFixture(fixture)
  }
})

test('track-closeout skips delivery gate for non-experiment plan packages', () => {
  const fixture = createFixture()
  try {
    runNode([
      join(pkgRoot, 'scripts', 'plan-package.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--plan-id',
      'PLAN-non-experiment',
      '--title',
      'Non experiment closeout',
      '--task',
      'Update workflow docs',
    ])

    runNode([
      trackerScript,
      'track-intent',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Non experiment closeout',
      '--request',
      'Update workflow docs.',
      '--route',
      '~build',
      '--tier',
      'T2',
      '--file',
      'AGENTS.md',
    ])

    runNode([
      trackerScript,
      'track-change',
      '--cwd',
      fixture.projectDir,
      '--summary',
      'Updated workflow docs',
      '--verification',
      'manual review',
    ])

    const output = runNode([
      trackerScript,
      'track-closeout',
      '--cwd',
      fixture.projectDir,
      '--status',
      'done',
      '--plan-id',
      'PLAN-non-experiment',
    ])

    assert(output.includes('Skipped delivery gate: PLAN-non-experiment is not an experiment target.'))
    const changeText = readFileSync(readSingleChangeFile(fixture.projectDir), 'utf-8')
    assert(changeText.includes('status: done'))
  } finally {
    destroyFixture(fixture)
  }
})

test('track-change mirrors active experiment changes while retaining top-level index', () => {
  const fixture = createFixture()
  try {
    const created = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'experiment-store.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Experiment change tracking',
      '--request',
      'Track code changes inside experiment package.',
    ]))

    runNode([
      trackerScript,
      'track-change',
      '--cwd',
      fixture.projectDir,
      '--summary',
      'Adjusted experiment config defaults',
      '--file',
      'src/config.py',
    ])

    const experimentChanges = readFileSync(join(fixture.projectDir, 'hello-scholar', 'experiments', created.id, 'changes.md'), 'utf-8')
    const indexText = readFileSync(join(fixture.projectDir, 'hello-scholar', 'changes', 'INDEX.md'), 'utf-8')
    const changeFile = readSingleChangeFile(fixture.projectDir)

    assert(experimentChanges.includes('Adjusted experiment config defaults'))
    assert(experimentChanges.includes('`src/config.py`'))
    assert(indexText.includes('Adjusted experiment config defaults'))
    assert(readFileSync(changeFile, 'utf-8').includes('Adjusted experiment config defaults'))
  } finally {
    destroyFixture(fixture)
  }
})

test('track-change supports explicit experiment-id when no experiment is active', () => {
  const fixture = createFixture()
  try {
    const created = JSON.parse(runNode([
      join(pkgRoot, 'scripts', 'experiment-store.mjs'),
      'create',
      '--cwd',
      fixture.projectDir,
      '--title',
      'Explicit experiment change tracking',
      '--request',
      'Track explicit experiment change.',
    ]))
    rmSync(join(fixture.projectDir, 'hello-scholar', 'state', 'active.json'), { force: true })

    runNode([
      trackerScript,
      'track-change',
      '--cwd',
      fixture.projectDir,
      '--experiment-id',
      created.id,
      '--summary',
      'Recorded explicit experiment change',
    ])

    const experimentChanges = readFileSync(join(fixture.projectDir, 'hello-scholar', 'experiments', created.id, 'changes.md'), 'utf-8')
    assert(experimentChanges.includes('Recorded explicit experiment change'))
  } finally {
    destroyFixture(fixture)
  }
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-change-tracker-'))
  const projectDir = join(root, 'project')
  return { root, projectDir }
}

function destroyFixture(fixture) {
  rmSync(fixture.root, { recursive: true, force: true })
}

function listChangeFiles(projectDir) {
  const changesRoot = join(projectDir, 'hello-scholar', 'changes')
  assert.equal(existsSync(changesRoot), true, changesRoot)
  return readdirSync(changesRoot)
    .filter((entry) => entry.endsWith('.md') && entry !== 'INDEX.md')
    .map((entry) => join(changesRoot, entry))
}

function readSingleChangeFile(projectDir) {
  const files = listChangeFiles(projectDir)
  assert.equal(files.length, 1)
  return files[0]
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    encoding: 'utf-8',
  })
  assert.equal(result.status, 0, [
    `Command failed: ${process.execPath} ${args.join(' ')}`,
    result.stdout,
    result.stderr,
  ].join('\n'))
  return result.stdout.trim()
}
