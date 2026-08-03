---
name: manage-specs
description: Classify a design request into the stable Spec identity it belongs to. Use when creating, revising, replacing, or resolving ambiguity between Specs; another design skill may invoke it before writing a Spec Bundle.
---

# Manage Specs

Own **classification** of one design request into one stable Spec identity. Return exactly one of:

- `Update Existing Spec`
- `Create Independent Spec`
- `Create Successor Spec`
- `Need Human Classification`

The result names the candidate Spec(s), evidence, and the next confirmation gate. This Skill owns Spec identity and revision maintenance; it does not design the solution, approve a Spec, generate a Plan or Tasks, or implement work.

## 1. Establish the document facts

1. Confirm the project root and run:
   ```sh
   node <hello-scholar-repo>/bin/hello-scholar.js docs sync
   node <hello-scholar-repo>/bin/hello-scholar.js docs check
   ```
2. If either command reports a structural error, report the diagnostics and stop. Do not write around an invalid document graph.
3. Read the global Spec Index, the relevant Topic Index when it exists, and only candidate `spec.md` files whose title, problem, goal, or ownership boundary may match the request. Read project facts needed to distinguish those candidates.

**Completion:** the request has a bounded candidate set backed by current project facts, not a search over every historical document.

## 2. Make one classification

Use the evidence below; do not combine classifications.

| Classification | Use when | Result before any write |
| --- | --- | --- |
| `Update Existing Spec` | The request changes the same problem, capability, and lifecycle already owned by one Spec. | Name that Spec and explain the shared boundary. |
| `Create Independent Spec` | The request is a different problem or independently valuable capability **and** can be approved, implemented, validated, and stopped or rolled back independently. | State the two independent-lifecycle facts and request permission to create it. |
| `Create Successor Spec` | A reviewed new design fundamentally replaces an existing design rather than extending it. | Name the replaced Spec, explain the replacement boundary, and request permission for the linked two-Spec transaction. |
| `Need Human Classification` | Two or more candidates are equally plausible, or local evidence cannot establish an independent lifecycle. | List the competing boundaries and the one decision needed from the user. |

Keep alternatives for one problem inside the candidate Spec's `候选方案与权衡` / `Alternatives and Tradeoffs` section. They do not create parallel Specs.

**Completion:** the response contains one classification, concrete evidence, and either a requested confirmation or an explicit stop.

## 3. Apply a confirmed classification

Read the matching template in `assets/` before creating a new Spec. Choose `spec-template.zh_CN.md` when the project default language is Chinese; otherwise choose `spec-template.md`. Preserve identifiers, paths, enum values, and commands exactly.

### Update Existing Spec

- Keep the existing ID, Topic, and Bundle path.
- For a semantic change, increment `revision`, set `updated` to the current date, and append a concise `Revision History` entry describing the changed decision.
- Correcting format or a typo without changing meaning keeps the revision unchanged.
- Modify only that `spec.md`; a changed Spec can make existing Plan and Tasks stale without synchronizing them.

### Create Independent Spec

- Proceed only after the user explicitly confirms this classification.
- Allocate the numeric ID as the global maximum existing Spec number plus one. Use at least three digits, never reuse a gap, and include rejected or superseded IDs in the maximum.
- Use lowercase kebab-case Topic and design slugs. Create `hello-scholar/specs/<topic-id>/SPEC-<number>-<design-name>/spec.md` from the selected template.
- Set `status: draft`, `revision: 1`, `supersedes: []`, and `superseded_by: null`.

### Create Successor Spec

- Proceed only after the user explicitly confirms the replacement and both affected Specs.
- Allocate the new ID and path as for an independent Spec. The new Spec lists the old ID in `supersedes`.
- Update the old `spec.md` in the same transaction: set `superseded_by` to the new ID, make the semantic revision and `updated` change, and record the relationship in `Revision History`. When the new design replaces its active owner, set the old status to `superseded`.
- Verify the relationship is reciprocal and acyclic. This linked new/old Spec maintenance is the only multi-document exception; do not edit Plan, Tasks, Architecture, source, or a Run.

### Need Human Classification

Do not write a Spec. Present the candidate boundaries and wait for the user's decision.

**Completion:** a write occurred only after its required confirmation, and the changed paths match the selected classification.

## 4. Validate and hand off

After a write, run:

```sh
node <hello-scholar-repo>/bin/hello-scholar.js docs check
node <hello-scholar-repo>/bin/hello-scholar.js docs sync
node <hello-scholar-repo>/bin/hello-scholar.js docs check
```

Only the CLI may rebuild generated Indexes. Confirm that the diff contains the selected `spec.md` transaction and generated Indexes only.

A new Spec remains `draft`. Change it to `accepted` only after the user explicitly approves the complete Spec. Then stop for the next requested stage; this Skill never treats discussion or classification confirmation as Spec approval.
