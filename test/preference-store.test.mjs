import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import {
  createPreferencePatch,
  ensureProjectPreferences,
  getPreferencePaths,
  readEffectivePreferences,
  readPreferencePatch,
  readProjectPreferences,
  readUserPreferences,
  writePreferenceCandidate,
  writePreferencePatch,
  writeUserPreferences,
} from '../scripts/preferences-store.mjs'

test('ensureProjectPreferences initializes default user-preferences.yaml', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    const paths = ensureProjectPreferences(fixture.projectDir)
    assert.equal(existsSync(paths.projectFile), true)

    const preferences = readProjectPreferences(fixture.projectDir)
    assert.equal(preferences.schemaVersion, 1)
    assert.equal(preferences.profile.education, 'Computer Science PhD')
    assert.equal(preferences.publicationTargets.defaultStandard, 'top-tier ML/NLP conference')
    assert.deepEqual(preferences.researchFocus, [])
    assert.equal(preferences.preferenceEvolution.autoApply, false)
  })
  destroyFixture(fixture)
})

test('readEffectivePreferences merges built-in defaults, global preferences, and project preferences', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    const paths = getPreferencePaths(fixture.projectDir)
    mkdirSync(paths.globalRoot, { recursive: true })
    writeUserPreferences(paths.globalFile, {
      profile: {
        researchAreas: ['NLP', 'agents'],
      },
      publicationTargets: {
        conferences: ['ACL'],
        defaultStandard: 'top-tier NLP conference',
      },
      researchFocus: ['faithfulness'],
      reviewFocus: ['evidence'],
      technicalPreferences: {
        preferredLibraries: ['PyTorch'],
      },
      writingStyle: {
        tone: 'precise',
      },
    })
    mkdirSync(paths.projectRoot, { recursive: true })
    writeUserPreferences(paths.projectFile, {
      publicationTargets: {
        conferences: ['EMNLP'],
        defaultStandard: 'project-specific reviewer standard',
      },
      researchFocus: ['faithfulness', 'robustness'],
      reviewFocus: {
        override: ['ablation', 'threats-to-validity'],
      },
      technicalPreferences: {
        preferredLibraries: ['Hydra'],
      },
      writingStyle: {
        tone: 'concise',
      },
    })

    const effective = readEffectivePreferences({ cwd: fixture.projectDir })
    assert.deepEqual(effective.preferences.publicationTargets.conferences, ['ACL', 'EMNLP'])
    assert.equal(effective.preferences.publicationTargets.defaultStandard, 'project-specific reviewer standard')
    assert.deepEqual(effective.preferences.researchFocus, ['faithfulness', 'robustness'])
    assert.deepEqual(effective.preferences.reviewFocus, ['ablation', 'threats-to-validity'])
    assert.deepEqual(effective.preferences.technicalPreferences.preferredLibraries, ['PyTorch', 'Hydra'])
    assert.equal(effective.preferences.writingStyle.tone, 'concise')

    assert.equal(effective.sources['publicationTargets.defaultStandard'], 'project')
    assert.equal(effective.sources['reviewFocus'], 'project')
    assert.equal(effective.sources['technicalPreferences.preferredLibraries'], 'built-in+global+project')
    assert.equal(effective.sources['writingStyle.tone'], 'project')
  })
  destroyFixture(fixture)
})

test('readEffectivePreferences uses global and defaults when project file is absent', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    const paths = getPreferencePaths(fixture.projectDir)
    mkdirSync(paths.globalRoot, { recursive: true })
    writeUserPreferences(paths.globalFile, {
      researchFocus: ['generalization'],
      writingStyle: {
        tone: 'reviewer-aware',
      },
    })

    const effective = readEffectivePreferences({ cwd: fixture.projectDir })
    assert.deepEqual(effective.preferences.researchFocus, ['generalization'])
    assert.equal(effective.preferences.writingStyle.tone, 'reviewer-aware')
    assert.equal(effective.preferences.preferenceEvolution.evidenceRequired, true)
    assert.equal(existsSync(paths.projectFile), false)
  })
  destroyFixture(fixture)
})

test('preference patch.yaml read and write preserves candidate structure', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    const patchPath = join(fixture.projectDir, 'patch.yaml')
    const patch = createPreferencePatch({
      candidateId: 'PREF-20260424-153012-writing-style',
      targetScope: 'global',
      targetFile: '~/plugins/hello-scholar/.hello-scholar/preferences/user-preferences.yaml',
      changes: {
        writingStyle: {
          tone: 'concise, technical, reviewer-aware',
        },
      },
    })
    writePreferencePatch(patchPath, patch)

    const stored = readPreferencePatch(patchPath)
    assert.equal(stored.candidateId, 'PREF-20260424-153012-writing-style')
    assert.equal(stored.type, 'preference')
    assert.equal(stored.targetScope, 'global')
    assert.equal(stored.changes.writingStyle.tone, 'concise, technical, reviewer-aware')
  })
  destroyFixture(fixture)
})

test('writePreferenceCandidate creates proposal, evidence, patch, and decision files', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    const result = writePreferenceCandidate({
      cwd: fixture.projectDir,
      candidateId: 'PREF-20260424-153012-writing-style',
      proposal: 'Prefer concise technical writing.',
      evidence: 'User explicitly asked for concise technical responses.',
      decision: 'pending',
      patch: createPreferencePatch({
        candidateId: 'PREF-20260424-153012-writing-style',
        targetScope: 'project',
        targetFile: 'hello-scholar/preferences/user-preferences.yaml',
        changes: {
          writingStyle: {
            tone: 'concise',
          },
        },
      }),
    })

    assert.equal(result.id, 'PREF-20260424-153012-writing-style')
    assert.equal(existsSync(join(result.root, 'proposal.md')), true)
    assert.equal(existsSync(join(result.root, 'evidence.md')), true)
    assert.equal(existsSync(join(result.root, 'patch.yaml')), true)
    assert.equal(existsSync(join(result.root, 'decision.md')), true)
    assert(readFileSync(join(result.root, 'proposal.md'), 'utf-8').includes('Prefer concise technical writing.'))
    assert.equal(readPreferencePatch(join(result.root, 'patch.yaml')).changes.writingStyle.tone, 'concise')
  })
  destroyFixture(fixture)
})

test('readUserPreferences parses nested empty objects and lists', () => {
  const fixture = createFixture()
  const filePath = join(fixture.projectDir, 'prefs.yaml')
  writeUserPreferences(filePath, {
    schemaVersion: 1,
    writingStyle: {},
    researchFocus: ['retrieval', 'evaluation'],
  })
  const parsed = readUserPreferences(filePath)
  assert.equal(parsed.schemaVersion, 1)
  assert.deepEqual(parsed.writingStyle, {})
  assert.deepEqual(parsed.researchFocus, ['retrieval', 'evaluation'])
  destroyFixture(fixture)
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'hello-scholar-preferences-'))
  const hostHome = join(root, 'home')
  const codexHome = join(hostHome, '.codex')
  const projectDir = join(root, 'project')
  mkdirSync(projectDir, { recursive: true })
  return { root, hostHome, codexHome, projectDir }
}

function destroyFixture(fixture) {
  rmSync(fixture.root, { recursive: true, force: true })
}

function withEnv(fixture, callback) {
  const previousHostHome = process.env.HELLO_SCHOLAR_HOST_HOME
  const previousCodexHome = process.env.CODEX_HOME
  const previousScholarHome = process.env.HELLO_SCHOLAR_HOME
  try {
    process.env.HELLO_SCHOLAR_HOST_HOME = fixture.hostHome
    process.env.CODEX_HOME = fixture.codexHome
    delete process.env.HELLO_SCHOLAR_HOME
    callback()
  } finally {
    restoreEnv('HELLO_SCHOLAR_HOST_HOME', previousHostHome)
    restoreEnv('CODEX_HOME', previousCodexHome)
    restoreEnv('HELLO_SCHOLAR_HOME', previousScholarHome)
  }
}

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name]
    return
  }
  process.env[name] = value
}

