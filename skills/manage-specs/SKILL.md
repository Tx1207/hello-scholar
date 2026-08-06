---
name: manage-specs
description: Classify a design request into one stable Spec identity. Use before creating, revising, or replacing a Spec, or when another design Skill needs the canonical Spec owner.
---

# Manage Specs

Own **classification** of one design request into one stable Spec identity. Return exactly one of:

- `Update Existing Spec`
- `Create Independent Spec`
- `Create Successor Spec`
- `Need Human Classification`

The result names the candidate Spec(s), evidence, and the next confirmation gate. This Skill owns Spec identity and revision maintenance; solution design, Spec acceptance, Plans, Tasks, and implementation belong to their respective owners.

## 1. Establish the document facts

1. Confirm the project root and run:
   ```sh
   hello-scholar docs sync
   hello-scholar docs check
   ```
2. Stop on a structural error and report the diagnostics.
3. Read the global Spec Index, the relevant Topic Index when it exists, and candidate `spec.md` files whose problem, goal, or ownership boundary may match. Read only the project facts needed to distinguish those candidates.

**Completion:** the request has a bounded candidate set backed by current project facts.

## 2. Classify one identity

| Classification | Evidence | Result before any write |
| --- | --- | --- |
| `Update Existing Spec` | One Spec already owns the same problem, capability, and lifecycle. | Name that Spec and its shared boundary. |
| `Create Independent Spec` | The capability is independently valuable and can be approved, implemented, validated, and rolled back independently. | State the independent lifecycle facts and propose one canonical path. |
| `Create Successor Spec` | The design replaces an active implementation model or removes a required store, protocol, or lifecycle boundary. | Name the replaced Spec, the historical boundary, and the successor's canonical path. |
| `Need Human Classification` | Multiple owners remain equally plausible after reading local evidence. | Present the competing boundaries and one identity decision. |

Alternatives for one problem remain in one candidate Spec's `Alternatives and Tradeoffs`; they are not separate identities.

For `Create Independent Spec` or `Create Successor Spec`, read [`assets/spec-identity.md`](assets/spec-identity.md) before returning an identity. Use [`assets/spec-identity.zh_CN.md`](assets/spec-identity.zh_CN.md) when responding in Chinese. Complete its **Stable Identity Test**, then repeat the proposed full path in the confirmation request.

**Completion:** the response contains one classification, concrete evidence, one complete path when creating an identity, and one confirmation gate or explicit stop.

## 3. Apply the confirmed classification

Proceed only when the reply unambiguously confirms the classification and exact identity proposed in Step 2.

### Update Existing Spec

- Keep its ID, Topic, and Bundle path.
- For a semantic change, increment `revision`, set `status: draft`, update `updated`, and append one `Revision History` entry.
- A format-only correction keeps the revision unchanged.
- Modify only that `spec.md`; existing Plan and Tasks may become stale.

### Create Independent Spec

- Read the matching template in `assets/`: use `spec-template.zh_CN.md` for a Chinese project, otherwise `spec-template.md`.
- Create the confirmed path with `status: draft`, `revision: 1`, `supersedes: []`, and `superseded_by: null`.

### Create Successor Spec

- Create the confirmed draft as above and list the old ID in `supersedes`.
- In the same transaction, update the old `spec.md`: point `superseded_by` to the new ID, record the semantic revision, and set an active owner to `superseded`.
- Verify a reciprocal, non-self, acyclic relationship. This is the only multi-Spec write branch.

### Need Human Classification

Return the unresolved identity decision with zero project writes.

**Completion:** every changed `spec.md` matches the confirmed branch and identity; no Plan, Tasks, Architecture, source, or Run changed.

## 4. Validate and hand off

Run:

```sh
hello-scholar docs check
hello-scholar docs sync
hello-scholar docs check
```

Only the CLI rebuilds generated Indexes. Confirm the final diff contains the selected Spec transaction and generated Indexes.

A new Spec and a semantic update remain `draft` until the user approves the complete Spec. Then stop at the next requested owner.

**Completion:** both checks pass, generated Indexes are current, and every changed path belongs to the confirmed transaction.
