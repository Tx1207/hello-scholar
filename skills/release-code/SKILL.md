---
name: release-code
description: Derive a public, reproducible release of research code from the development repository. Trace the minimal code behind the paper's claims, assemble it on an orphan branch for a separate public repository, check for leaks, and verify that it reproduces the results reported in the paper. Use when preparing or updating an open-source code release; pushing or publishing still requires explicit user authorization.
---

# Release Code

A public release lets others reproduce the paper's results and understand the method without seeing internal paths, secrets, abandoned experiments, or development history. The development repository stays the single source of truth: the release is regenerated from it, never developed in parallel.

## Define what the release must support

Start from the claims the release backs: the results reported in the paper, or a subset of Runs the user selects. The release reproduces those claims, not every Run Record in the project. For each claim, record the reported value, the tolerance within which a reproduction counts, and the Run that produced it when one exists; the Run supplies the exact conditions, such as config, checkpoint, and data. Keep this scope in a release Spec through `manage-specs`: one `AC-NN` per claim with its reported value, tolerance, and Run IDs, the code paths included, explicit exclusions, the license, third-party code and its licenses, and the public repository. A claim whose producing conditions cannot be found is reported as such, not released on trust.

## Trace the minimal code path

From each Run's `entry` and effective config, follow imports and config references to the code actually executed, and bring only that path. Fast research iteration often leaves several copies of one script that differ by constants; release one parameterized entry point with the variants as configs. Rewrite for readability where needed without changing the computation. Leave out dead experiments, cluster launch wrappers, and debugging switches.

## Assemble on an isolated branch

The public repository must never receive development history. By default, create an orphan branch named `release`, check it out in a separate worktree outside the development tree, such as `../<repo>-release`, add the public repository as remote `public`, and map pushes to that branch only:

```bash
git config remote.public.push refs/heads/release:refs/heads/main
```

Follow the release Spec when the user chose another arrangement.

Make the release complete for a reader: dependency specification, training and evaluation code for the released claims, pretrained weights or how to obtain them, a README with a results table and the exact command for each row, and LICENSE and third-party notices. Start the README from [assets/readme-template.md](assets/readme-template.md) and drop sections that do not apply. Replace internal absolute paths, hostnames, and cluster settings with documented defaults or arguments. Read [references/release-checks.md](references/release-checks.md) for the completeness and leak checks.

## Check for leaks

Before committing, search the assembled tree for secrets and tokens, internal hostnames and absolute paths, private or unlicensed data, personal information, and internal comments that should not be public. Use an available secret scanner such as gitleaks, and say so when none is available. Any finding blocks the commit until it is fixed.

## Verify reproduction

In a fresh clone with a fresh environment, run the README commands with the recorded checkpoints, data, and configs, and compare each result with the value reported in the paper, or with the selected Run Record, within the Spec's tolerance. Record each comparison as evidence on its `AC-NN`. When a claim does not reproduce, report the gap and its cause; do not drop the claim or loosen the tolerance. Evaluation from released weights is usually the first check; full retraining needs its own authorization because of its cost.

## Commit and stop

Commit the release as one snapshot whose message names the source development commit, the claims it reproduces with their Run IDs, and the release Spec revision. Then stop and report the reproduced and unreproduced claims, the leak-check result, and the push command. Pushing, making a repository public, or uploading weights requires the user's explicit authorization.

## Keep the release in sync

Re-export only when a development change affects a released claim, and repeat the reproduction check for those claims. Port external pull requests into the development repository first, then re-export; never merge them only on the release branch.
