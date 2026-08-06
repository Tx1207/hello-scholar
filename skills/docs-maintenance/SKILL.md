---
name: docs-maintenance
description: Maintain next-generation documents through four explicit modes. Use when the user wants to check document health, rebuild generated Indexes, update Current Architecture, or recover reviewable documentation after damage or neglect.
---

# Docs Maintenance

Choose exactly one mode: `check`, `index`, `architecture`, or `recover`. Do not combine modes whose write sets differ.

## Establish the transaction

1. Confirm the project/worktree root, read its instructions, and identify the user's explicit request.
2. If the user names a mode, use it. If one mode is unambiguous, state it before acting. If the request spans multiple write sets, ask the user to choose.
3. Enter `architecture` only when the user explicitly asks, or after a completed Bundle shows a material change to project structure, a key module responsibility, a public runtime flow, or a persistent location; in the latter case, state the evidence and proposed scope, then wait for confirmation.
4. Record the initial Git status and Git diff baseline with the mode's allowed write set before acting. At completion, inspect the transaction delta against that baseline and stop to report any newly changed path outside that set; pre-existing changes remain out of scope.
5. Read only the relevant Index, Architecture, Bundle, Run, and code facts. Invoke the installed `hello-scholar` command directly.

| Mode | Purpose | Allowed writes | Completion |
| --- | --- | --- | --- |
| `check` | Read-only diagnosis | None | Report command, exit code, errors, notices, and relative paths. |
| `index` | Derived navigation | CLI-generated `hello-scholar/specs/INDEX.md`, Topic `INDEX.md`, and `runs/INDEX.md` only | The CLI completes; the transaction delta contains only generated Indexes. |
| `architecture` | Current implemented system | First round: none. Approved second round: `hello-scholar/architecture.md` only | Return a Proposal, then write only after approval of its current Hash. |
| `recover` | Reviewable recovery | CLI-generated Indexes only | Report recovery findings and a chat-only review draft. |

## `check`

1. Run `hello-scholar docs check` only.
2. Return the exact command, exit code, errors, notices, and project-relative paths. A no-document Fast Path is valid; a missing Architecture is a notice unless the CLI reports an error.
3. Leave all files and mtimes unchanged. Do not run sync, repair Front Matter, or generate a report artifact.

**Completion:** diagnostics are reported and the transaction delta is empty.

## `index`

1. Run `hello-scholar docs sync` only. Let the CLI own parsing, validation, ordering, links, and atomic Index updates.
2. If it fails, report the diagnostics and preserve the old Indexes. Do not edit source documents or reconstruct tables.
3. Verify that the transaction delta contains only generated global, Topic, and Run `INDEX.md` files.

**Completion:** the CLI result and final allowed-only transaction delta are reported.

## `architecture`

Read `assets/architecture-template.md` for an English project or `assets/architecture-template.zh_CN.md` for a Chinese project before drafting or writing.

### Proposal round

1. Read the existing Architecture, current code and directory layout, Git status/history relevant to the change, Completed Spec/Plan/Tasks, valid Records, and necessary Converge results.
2. Exclude Draft or Rejected Specs, failed and unadopted prototypes, unmerged branches, and future designs discussed only in chat.
3. In the response, provide a semantic Proposal containing the current `hello-scholar/architecture.md` SHA-256 (or state that it is missing), fact sources, section-by-section Add/Change/Keep items, statements to remove, unresolved facts, and the expected transaction delta. Keep the transaction delta at zero.
4. Stop for explicit user approval of this exact Proposal and file Hash. A content change, "continue" without approval, an Architecture Hash change, or changed Git facts invalidates the Proposal and requires a new one.

**Completion:** the Proposal is returned without a write, or an approval gate is reached.

### Approved write round

1. Recheck the approved Architecture SHA-256 and the facts on which the Proposal relies. If either changed, return to the Proposal round.
2. Update only approved, fact-affected sections in `hello-scholar/architecture.md`; preserve other verified content. Describe implemented reality only and cite the source Spec for each important technical choice.
3. Use the template's exact Front Matter and all nine sections. Set `updated` to the current date.
4. Verify the transaction delta contains only `hello-scholar/architecture.md`.

**Completion:** one approved Architecture file reflects verified current facts and the transaction delta has no other path.

## `recover`

1. Run `hello-scholar docs check`. When source documents are parseable, run `hello-scholar docs sync` to rebuild generated Indexes; when parsing fails, retain existing Indexes and report the blocker.
2. Report orphan Specs, Stale Plans and Tasks, unassociated Runs, missing or possibly drifting Architecture, and legacy-path notices.
3. Read the applicable architecture template. From current code, Git, and trustworthy Completed/Record facts, provide a complete nine-section Architecture draft headed `Needs Human Review`; distinguish verified current facts from inferences and identify fact sources.
4. Keep the draft in the response, never in an `INDEX.md`. Do not treat "continue" as approval; after review, require a separate `architecture` transaction to write the formal Architecture.
5. Verify that the transaction delta contains only CLI-generated Indexes, if any.

**Completion:** recovery findings and a `Needs Human Review` draft are returned without writing a formal Architecture or another repository report.

## Boundaries

- Architecture is one independent document transaction; do not synchronize Spec, Plan, Tasks, or Record semantics with it.
- Do not add a `docs migrate` entry point, parser implementation, hand-written Index procedure, `architecture-recovery.md`, `recovery-report.md`, or another repository recovery report.
- Treat generated Indexes as CLI-owned; do not hand-edit them.
