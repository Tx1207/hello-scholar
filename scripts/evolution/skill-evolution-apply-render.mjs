import { join } from 'node:path'

import { renderBullets } from '../change-tracker-utils.mjs'
import { readText } from '../cli-utils.mjs'

const EVOLUTION_START = '<!-- HELLO_SCHOLAR EVOLUTION START -->'
const EVOLUTION_END = '<!-- HELLO_SCHOLAR EVOLUTION END -->'

export function renderCreatedSkill(context) {
  const skillId = context.candidate.decision.targetSkillId
  const description = buildDescription(context)
  const workflow = context.candidate.extractedWorkflow.length > 0
    ? context.candidate.extractedWorkflow
    : ['Review `references/local-evolution.md` and apply the captured workflow conservatively.']

  return [
    '---',
    `name: ${skillId}`,
    `description: ${description}`,
    'version: 0.1.0',
    '---',
    '',
    `# ${formatSkillTitle(skillId)}`,
    '',
    '## Goal',
    '',
    `Capture a reusable workflow derived from \`${context.candidate.source.changeId || 'local-evolution'}\` and expose it as a local overlay skill.`,
    '',
    '## When to Use',
    '',
    '- Use when the user asks for the same or closely related workflow.',
    '- Use only when the task matches the captured method, not for unrelated work.',
    '',
    '## Workflow',
    '',
    ...workflow.map((item) => `- ${item}`),
    '',
    '## Boundaries',
    '',
    '- Keep the workflow scoped to the durable method captured here.',
    '- Do not treat task-specific progress or temporary notes as reusable guidance.',
    '',
    '## Resources',
    '',
    '- `references/local-evolution.md`',
  ].join('\n')
}

export function renderUpdatedSkill(context, currentText) {
  const fallback = renderCreatedSkill(context)
  const baseText = currentText || fallback
  const nextBlock = [
    EVOLUTION_START,
    '## Local Evolution',
    '',
    `- Candidate: \`${context.candidate.id}\``,
    `- Source Change: \`${context.candidate.source.changeId || 'N/A'}\``,
    `- Source Plan: \`${context.candidate.source.planId || 'N/A'}\``,
    '- Additional context: `references/local-evolution.md`',
    '',
    EVOLUTION_END,
  ].join('\n')

  const pattern = new RegExp(`${escapeRegex(EVOLUTION_START)}[\\s\\S]*?${escapeRegex(EVOLUTION_END)}`)
  if (pattern.test(baseText)) {
    return baseText.replace(pattern, nextBlock)
  }
  return `${baseText.trimEnd()}\n\n${nextBlock}\n`
}

export function renderLocalEvolutionReference(context) {
  return [
    '# Local Evolution',
    '',
    `- Candidate: \`${context.candidate.id}\``,
    `- Action: \`${context.candidate.decision.action}\``,
    `- Target Skill: \`${context.candidate.decision.targetSkillId}\``,
    `- Source Change: \`${context.candidate.source.changeId || 'N/A'}\``,
    `- Source Plan: \`${context.candidate.source.planId || 'N/A'}\``,
    '',
    '## Reasons',
    '',
    renderBullets(context.candidate.decision.reason || []),
    '',
    '## Extracted Workflow',
    '',
    renderBullets(context.candidate.extractedWorkflow || []),
  ].join('\n')
}

export function renderPatchPlan(context, preview) {
  if (!preview) throw new Error('renderPatchPlan requires preview')
  const templatePath = join(context.pkgRoot, 'templates', 'skill-evolution-patch-plan.md')
  const fallback = [
    '# Skill Evolution Patch Plan: {{candidate_id}}',
    '',
    '- Action: `{{action}}`',
    '- Target Skill: `{{target_skill}}`',
    '- Overlay Root: `{{overlay_root}}`',
    '- Repo Source Root: `{{repo_root}}`',
    '',
    '## Planned Changes',
    '',
    '{{changes}}',
    '',
    '## Extracted Workflow',
    '',
    '{{workflow}}',
  ].join('\n')
  const template = readText(templatePath, fallback)
  const plannedChanges = [
    'Materialize or update the overlay skill directory.',
    'Write `references/local-evolution.md` with captured workflow.',
    'Create or update `SKILL.md` using the approved candidate.',
    'Run minimal integrity checks after writing.',
  ]
  const values = {
    candidate_id: context.candidate.id,
    action: context.candidate.decision.action,
    target_skill: context.candidate.decision.targetSkillId,
    overlay_root: context.overlaySkillRoot,
    repo_root: context.repoSkillRoot,
    changes: renderBullets(plannedChanges),
    workflow: renderBullets(context.candidate.extractedWorkflow || []),
  }
  return [
    fillTemplate(template, values).trimEnd(),
    '',
    '## Current Skill Content',
    '',
    preview.currentSkillText.trim() ? fencedMarkdown(preview.currentSkillText) : '- No existing skill content was found; this candidate will create a new overlay skill.',
    '',
    '## Proposed Skill Content',
    '',
    fencedMarkdown(preview.proposedSkillText),
    '',
    '## Existing Skill Comparison',
    '',
    renderExistingSkillComparison(preview.existingSkillComparison),
    '',
    '## Available Decisions',
    '',
    renderAvailableDecisions(preview.availableDecisions),
    '',
    '## Application Gate',
    '',
    `- Preview hash: \`${preview.hash}\``,
    '- Applying this candidate requires `approve --decision apply-overlay --user-confirmation "确认应用 ..."` before `apply`.',
    '- Vague requests such as “处理这个 skill”, “继续”, or “可以” must stop at preview and cannot approve apply.',
  ].join('\n')
}

function renderExistingSkillComparison(comparison) {
  return [
    `- Target Skill: \`${comparison.targetSkillId}\``,
    `- Candidate Action: \`${comparison.action}\``,
    `- Overlay Exists: \`${comparison.overlayExists}\``,
    `- Repo Skill Exists: \`${comparison.repoExists}\``,
    `- Relation: ${comparison.relation}`,
    `- Similar Repo Skills: ${comparison.similarSkills.length > 0 ? comparison.similarSkills.map((skill) => `\`${skill}\``).join(', ') : 'none detected'}`,
  ].join('\n')
}

function renderAvailableDecisions(decisions) {
  return decisions.map((item, index) => [
    `### ${index + 1}. ${item.decision}`,
    '',
    item.description,
    '',
    'Files touched if selected:',
    '',
    renderBullets(item.files.map((file) => `\`${file}\``)),
  ].join('\n')).join('\n\n')
}

function fencedMarkdown(text) {
  return ['```markdown', String(text || '').trimEnd(), '```'].join('\n')
}

function buildDescription(context) {
  const skillId = context.candidate.decision.targetSkillId
  const phrases = context.candidate.extractedWorkflow
    .slice(0, 2)
    .map((item) => item.replace(/[.`]/g, '').trim())
    .filter(Boolean)
  if (phrases.length === 0) {
    return `This skill should be used when the user asks for help with ${skillId.replaceAll('-', ' ')} or needs the local overlay workflow captured from recent work.`
  }
  return `This skill should be used when the user asks to \"${phrases[0]}\", needs help with ${skillId.replaceAll('-', ' ')}, or wants the local overlay workflow captured from recent work.`
}

function formatSkillTitle(skillId) {
  return skillId
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function fillTemplate(template, values) {
  return Object.entries(values).reduce(
    (current, [key, value]) => current.replaceAll(`{{${key}}}`, value),
    template,
  )
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
