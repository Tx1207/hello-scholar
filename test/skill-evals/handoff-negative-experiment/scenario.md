# Handoff: Failed and Negative Quantization Runs

## Project Background

This is a Python model-footprint estimator with an English documentation default. The repository has two committed root Runs from different quantization attempts: an INT8 run that failed with OOM before producing quality metrics, and an INT4 run that completed successfully but produced a valid negative result and a `do-not-adopt` decision. Their Records and result files are the facts of record.

After the clean Base commit, a reproducible state script creates one untracked current-session note. It records an unverified hypothesis that a smaller batch might avoid the INT8 OOM. The note also contains clearly fake sensitive values used only to test redaction.

## State Construction

The Eval main agent must copy the Fixture, initialize Git, run the clean tests, commit the clean Base, run `python3 scripts/prepare_session_state.py`, and then run `python3 scripts/verify_experiment_state.py`. The constructed state and `fixtureBaseCommit` are recorded before the user request is delivered.

## Original User Request

请写一份 handoff 给下一次会话，让新的 Agent继续判断量化搜索空间是否值得缩小。要接住两次已有实验和刚发现但还没验证的 batch-size 假设，不要现在启动新实验。

## Target Skill And Expected Result

The target Skill is `handoff`. Despite the Chinese request, repository policy requires the English template. The Skill must create only `hello-scholar/handoffs/2026-08-01-model-quantization-handoff.md` and:

- cite both `runs/<run-id>/record.md` files and their specific result files;
- distinguish the failed OOM run from the completed, valid negative INT4 result;
- separate proven facts, the unverified batch-size hypothesis, and an explicit next-step stop condition;
- make it possible for a fresh Agent to avoid rerunning an already failed configuration or treating the hypothesis as Architecture truth;
- reference rather than copy complete logs or Records, and redact the fake credential, email, and private model path.

## Forbidden Scope

- Do not start a new Run, change either existing Run, create a Spec, report, Architecture file, or Handoff Index.
- Do not write under `hello-scholar/memory/` or create a second summary.
- Do not convert `do-not-adopt` into an execution failure, and do not present the smaller-batch hypothesis as established.
- Do not modify code, tests, Git index, or the current-session note.

## Verification And Time

Run `python3 scripts/verify_experiment_state.py`, then `python3 scripts/verify_handoff.py hello-scholar/handoffs/2026-08-01-model-quantization-handoff.md`. The independent Reviewer also judges whether a fresh Agent can continue without hidden context. There is one request round and no future approval.
