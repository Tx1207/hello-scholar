---
name: docs-maintenance
description: Check, synchronize, recover, or update hello-scholar documentation when the user requests document maintenance or implementation changes adopted architecture facts.
---

# Docs Maintenance

Keep project knowledge consistent with what it claims to describe. A reader should be able to distinguish the adopted system, proposed changes, actual execution evidence, and navigation without reconciling conflicting copies.

## Identify the fact and its owner

Start from the requested document or the facts changed by implementation. Ask what would mislead a reader if left unchanged, then follow the relevant references. A moved artifact may require a path correction; a changed module responsibility may require an Architecture update. The number of edited files or a new commit alone does not establish either need.

Use the owning source for each claim: a Spec holds intended design and judgment criteria, a Record holds one execution's facts, Architecture holds implemented and adopted structure, and an Index locates those sources. If code and a draft Spec differ, first determine whether the design is still pending; do not resolve that difference by pretending the proposal was adopted. For a partially implemented Spec, state only the verified and adopted portion as current architecture.

Explain important ownership, dependency, and runtime relationships in the document itself. Cite code and evidence so readers can verify them. Avoid replacing useful explanation with a file inventory, copying the same fact into several owners, or promoting generated navigation into authority.

## Operations

Modes may be combined in a sensible order when the user's authorization already covers them. Choose the operation that repairs the actual knowledge gap:

- **Check:** run `hello-scholar docs check` and report its exit code, errors, notices, and relative paths. This operation is strictly read-only: do not sync or repair anything.
- **Sync:** run `hello-scholar docs sync`. The CLI alone may update global, Topic, and Run `INDEX.md` files. On failure, report diagnostics and do not hand-rebuild an Index.
- **Architecture:** update `hello-scholar/architecture.md` from verified implemented and adopted facts when the user requests it or the authorized implementation materially changes structure, module ownership, runtime flow, public contracts, or persistent locations. Read [assets/architecture-template.md](assets/architecture-template.md) for English or [assets/architecture-template.zh_CN.md](assets/architecture-template.zh_CN.md) for Chinese. Preserve unaffected content, exclude future designs and unadopted experiments, and describe unresolved facts explicitly. A missing Architecture notice alone does not authorize reconstructing or adopting one.
- **Recover:** check first, then sync when source documents parse. Inventory orphaned or legacy material and reconstruct a reviewable Architecture draft from code, Git, completed acceptance evidence, and valid Records. Do not guess through parse failures or write a formal Architecture unless the request authorizes that write.

## Repair the affected knowledge

Before writing, inspect existing Git changes. Resolve contradictions from current source evidence and known adoption decisions. When the evidence cannot settle a claim, identify the missing fact and its consequence instead of selecting the tidier narrative. Explicitly authorized recovery may repair source structure, but must preserve historical provenance and real uncertainty.

If a concurrent edit touches the same facts, reread and merge verified changes rather than overwriting them. Afterward, inspect the diff and relevant links or document checks. Explain which project facts or navigation changed, why they are now supported, and what remains unresolved. Structural checks verify document contracts; they do not prove an architecture decision has been adopted.
