import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import {
  applyPreferenceCandidate,
  createPreferencePatch,
  ensureProjectPreferences,
  getPreferencePaths,
  readEffectivePreferences,
  readPreferencePatch,
  readProjectPreferences,
  readUserPreferences,
  suggestPreferenceCandidate,
  writePreferenceCandidate,
  writePreferencePatch,
  writeUserPreferences,
} from '../scripts/preferences/preferences-store.mjs'
import { loadCatalog } from '../scripts/profile/catalog-loader.mjs'
import { resolveStatusOverlay } from '../scripts/overlay/resolve.mjs'
import { parseArgv } from '../scripts/cli-utils.mjs'

const pkgRoot = new URL('..', import.meta.url).pathname

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

test('status overlay resolver reports overlay skills and effective preference sources', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    const paths = getPreferencePaths(fixture.projectDir)
    mkdirSync(paths.globalRoot, { recursive: true })
    writeUserPreferences(paths.globalFile, {
      researchFocus: ['global-focus'],
    })
    mkdirSync(paths.projectRoot, { recursive: true })
    writeUserPreferences(paths.projectFile, {
      reviewFocus: ['project-review'],
    })

    const runtime = createRuntime(fixture)
    writeOverlaySkillFixture(runtime, 'preference-overlay-skill')
    const catalog = loadCatalog(pkgRoot, { dynamic: true, cwd: fixture.projectDir, runtime })
    const status = resolveStatusOverlay({ runtime, cwd: fixture.projectDir, catalog, scope: 'project' })

    assert.equal(status.overlaySkillCount, 1)
    assert(status.preferenceSources.includes('built-in'))
    assert(status.preferenceSources.includes('built-in+global'))
    assert(status.preferenceSources.includes('built-in+project'))
    assert.equal(status.standbyInstall.installed, false)
    assert.equal(status.globalInstall.installed, false)
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

test('suggestPreferenceCandidate creates a project candidate without applying preferences', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    const result = suggestPreferenceCandidate({
      cwd: fixture.projectDir,
      summary: 'Prefer terse implementation summaries.',
      evidence: 'User repeatedly asked to reduce final-answer verbosity.',
      path: 'interactionPreferences.finalAnswerStyle',
      value: 'terse',
      now: new Date('2026-04-25T08:00:00.000Z'),
    })

    assert.equal(result.id, 'PREF-20260425-080000-interactionpreferences-finalanswerstyle')
    const patch = readPreferencePatch(join(result.root, 'patch.yaml'))
    assert.equal(patch.targetScope, 'project')
    assert.equal(patch.changes.interactionPreferences.finalAnswerStyle, 'terse')

    const prefs = readProjectPreferences(fixture.projectDir, { initialize: true })
    assert.equal(prefs.interactionPreferences.finalAnswerStyle, undefined)
    assert(readFileSync(join(result.root, 'proposal.md'), 'utf-8').includes('candidate only'))
  })
  destroyFixture(fixture)
})

test('applyPreferenceCandidate requires user initiated request and approval', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    writePreferenceCandidate({
      cwd: fixture.projectDir,
      candidateId: 'PREF-20260425-080000-final-answer-style',
      proposal: 'Prefer concise final answers.',
      evidence: 'User explicitly asked for concise handoffs.',
      patch: createPreferencePatch({
        candidateId: 'PREF-20260425-080000-final-answer-style',
        targetScope: 'project',
        targetFile: 'hello-scholar/preferences/user-preferences.yaml',
        changes: {
          interactionPreferences: {
            finalAnswerStyle: 'concise',
          },
        },
      }),
    })

    assert.throws(
      () => applyPreferenceCandidate({
        cwd: fixture.projectDir,
        args: parseArgv(['--candidate-id', 'PREF-20260425-080000-final-answer-style', '--approve']),
      }),
      /requires --user-request/,
    )
  })
  destroyFixture(fixture)
})

test('applyPreferenceCandidate applies project preference only after explicit user request', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    writePreferenceCandidate({
      cwd: fixture.projectDir,
      candidateId: 'PREF-20260425-080000-final-answer-style',
      proposal: 'Prefer concise final answers.',
      evidence: 'User explicitly asked for concise handoffs.',
      patch: createPreferencePatch({
        candidateId: 'PREF-20260425-080000-final-answer-style',
        targetScope: 'project',
        targetFile: 'hello-scholar/preferences/user-preferences.yaml',
        changes: {
          interactionPreferences: {
            finalAnswerStyle: 'concise',
          },
        },
      }),
    })

    const result = applyPreferenceCandidate({
      cwd: fixture.projectDir,
      args: parseArgv([
        '--candidate-id',
        'PREF-20260425-080000-final-answer-style',
        '--approve',
        '--user-request',
        'User asked AI to apply this preference candidate.',
      ]),
      now: new Date('2026-04-25T08:30:00.000Z'),
    })

    assert.equal(result.ok, true)
    assert.equal(result.changedPaths.includes('interactionPreferences.finalAnswerStyle'), true)
    const prefs = readProjectPreferences(fixture.projectDir)
    assert.equal(prefs.interactionPreferences.finalAnswerStyle, 'concise')
    const decision = readFileSync(join(fixture.projectDir, 'hello-scholar', 'preferences', 'candidates', 'PREF-20260425-080000-final-answer-style', 'decision.md'), 'utf-8')
    assert(decision.includes('Status: `accepted`'))
    assert(decision.includes('User asked AI to apply this preference candidate.'))
    assert(decision.includes('Before'))
    assert(decision.includes('After'))
  })
  destroyFixture(fixture)
})

test('applyPreferenceCandidate blocks high-impact preference without explicit confirmation', () => {
  const fixture = createFixture()
  withEnv(fixture, () => {
    writePreferenceCandidate({
      cwd: fixture.projectDir,
      candidateId: 'PREF-20260425-080000-role',
      proposal: 'Change academic role.',
      evidence: 'User said to update role.',
      patch: createPreferencePatch({
        candidateId: 'PREF-20260425-080000-role',
        targetScope: 'project',
        targetFile: 'hello-scholar/preferences/user-preferences.yaml',
        changes: {
          profile: {
            role: 'principal investigator',
          },
        },
      }),
    })

    assert.throws(
      () => applyPreferenceCandidate({
        cwd: fixture.projectDir,
        args: parseArgv([
          '--candidate-id',
          'PREF-20260425-080000-role',
          '--approve',
          '--user-request',
          'User asked AI to apply this high impact preference.',
        ]),
      }),
      /require --confirm-high-impact/i,
    )
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

function createRuntime(fixture) {
  return {
    pkgRoot,
    scholarHome: join(fixture.hostHome, 'plugins', 'hello-scholar', '.hello-scholar'),
    installStatePath: join(fixture.hostHome, 'plugins', 'hello-scholar', '.hello-scholar', 'install-state.json'),
    hostHome: fixture.hostHome,
    codexHome: fixture.codexHome,
  }
}

function writeOverlaySkillFixture(runtime, skillId) {
  const skillRoot = join(runtime.scholarHome, 'overlays', 'skills', skillId)
  mkdirSync(skillRoot, { recursive: true })
  writeFileSync(join(skillRoot, 'SKILL.md'), [
    '---',
    `name: ${skillId}`,
    'description: Test overlay skill for resolver.',
    '---',
    '',
    '# Test Overlay Skill',
  ].join('\n'), 'utf-8')
}

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name]
    return
  }
  process.env[name] = value
}
