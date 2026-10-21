# Release checks

Use these checks to judge whether an assembled release is complete and safe to publish. They support judgment; a passing item does not replace the reproduction check against the reported results.

## Completeness

These follow the ML Code Completeness Checklist from Papers with Code's research-code release guidance.

| Item | What a reader needs |
| --- | --- |
| Dependencies | A `requirements.txt`, `environment.yml`, or package metadata with versions that actually ran; CUDA and framework versions when results depend on them. |
| Training code | The entry point and configs that produced each released claim, runnable without internal launchers. |
| Evaluation code | The entry point that computes each reported metric, with the evaluation data split and preprocessing. |
| Pretrained weights | A download location and the checkpoint that each table row uses; state the license of the weights. |
| README results | A table with one row per claim: the result, the exact command that reproduces it, and the expected value with tolerance. |

A README row should read like this:

| Claim | Command | Expected |
| --- | --- | --- |
| Table 2, UVG, DISTS | `python scripts/eval.py --config configs/uvg.yaml --ckpt weights/main.pt` | 0.081 ± 0.002 |

## Leaks

Search the assembled tree, not the development tree, because the release is what will be published:

- secrets: API keys, tokens, passwords, private keys (`.pem`, `id_rsa`), cloud credentials, `.env` files;
- internal locations: absolute home or cluster paths, internal hostnames, IP addresses, scheduler accounts, internal URLs;
- data: private datasets, samples without redistribution rights, personal information in fixtures or logs;
- text: internal comments, names of collaborators who did not agree to be listed, notes about reviewers or unpublished work.

A scanner such as gitleaks catches common secret formats; a text search for the project's own internal path prefixes and hostnames catches what scanners miss.

## README

The README is the first thing a reader uses, and most readers only want to run the released model on their data or check one number. These patterns recur in well-regarded research code READMEs:

- Show what the method does before any setup: one figure, a link row to the paper, project page, weights, and citation, and the headline result with its condition. [Segment Anything](https://github.com/facebookresearch/segment-anything) does this without badges.
- Give the shortest path to a real output with released weights: one install command and a few lines or one command. Segment Anything fits core usage in about three lines; [MAE](https://github.com/facebookresearch/mae) adds a notebook demo that needs no GPU.
- Tie every reported number to a checkpoint and a command. The [Papers with Code template](https://github.com/paperswithcode/releasing-research-code) asks for a results table with reproduction commands; MAE pairs checkpoint tables with result tables.
- State the conditions that change the numbers and warn when cross-method comparisons are unfair. [DCVC](https://github.com/microsoft/DCVC) lists tested versions exactly, keeps test conditions in a separate file, and explains how intra period, frame count, and padding affect comparisons.
- Keep long procedures in separate files linked from the README, as MAE does with PRETRAIN.md and FINETUNE.md and DCVC with training.md.

Every number in the README must be one the reproduction check confirmed or one quoted from the paper with its condition. Leave out badge walls, marketing language, and internal details.

## Licenses

Keep license headers and notices of copied third-party code, and confirm their licenses allow redistribution under the release license. State dataset and weight licenses separately from the code license. Ask the user when the release license is not decided.
