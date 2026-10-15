# Cross-Agent Review

Give the reviewer a stable object and enough evidence to form an independent judgment.

## Prepare the review

Provide the source material, not the author's desired verdict. Include:

- The question to examine and the specific proposal, change, or evidence. For a Spec, include its path and revision. For code, identify the existing commit and the in-scope working-tree changes. No Spec is required for other review objects.
- The user goal, confirmed constraints, and necessary supporting files or direct evidence. Include contrary results when they affect the claim. State unavailable evidence plainly.
- The actual state of code, inputs, and Run results that this round uses. A Spec revision alone does not identify all of them.
- The readable scope, permitted checks, and any designated output path. The reviewer must not change the reviewed design, code, experiments, or generated navigation.
- A request for consequential findings with triggers, evidence, effects, and the smallest response; ask the reviewer to distinguish confirmed defects from questions needing verification and to identify meaningful limits.

Keep the input stable while it is inspected. Use existing Git references, a bounded diff, or the current document and its stated state; do not introduce a fingerprint service or duplicate the whole project. If inputs change during review, identify the set actually examined and qualify the affected findings. Do not describe a mixture of states as one complete verification.

## Use the available client honestly

When the user names Claude, Codex, or another model, use that client through an available, authorized tool. Reuse prior authorization for the stated task; model-specific cost or remote execution still has to fit that authorization. Identify the actual reviewer and model when known. A subagent from the current model is not evidence that the requested different model ran.

If the required client or access is unavailable, return a ready-to-use review request with the concrete paths, input state, purpose, and output instructions. Explain that the requested review has not run. Do not install a client, obtain credentials, or substitute a different model under the original name.

For example, adapt this request to the actual material:

> Review `<proposal path>` at `<revision or current state>` for `<decision or risk>`, using `<supporting paths and their state>`. Read the necessary connected material and perform only `<permitted checks>`. Write findings to `<authorized output path>`, or return them here when no file is requested. Keep the reviewed material unchanged. Explain each material issue's trigger, evidence, consequence, and smallest response; separate confirmed issues from unresolved questions. State what you inspected and what remains unverified.

The placeholders describe needed information, not required headings in the reviewer's answer. Include only what the task needs, and never pass secrets as review context.

## Preserve what each round establishes

When saving a Spec review is within scope, use `review.md` beside `spec.md`. For other objects, use the existing project review location or the conversation. Use ordinary Markdown; add no new schema, mandatory Index, or parallel task tracker.

Record the object and input state, date, actual reviewer, findings, and coverage by round. The reviewer writes findings to the assigned location; the main Agent records disposition: adopted, not adopted with a reason, or still needing a particular fact. The main Agent integrates resulting decisions into the relevant Spec under the original authorization.

If multiple Agents work concurrently, keep one writer per file at a time. Read the latest contents before merging another Agent's completed output. A reviewer can return findings for the main Agent to save when both would otherwise edit the same review file.

A later Spec revision does not change which revision an earlier review examined. Even when the Spec revision is unchanged, changes to code, input data, or Run results can narrow earlier review coverage. Revisit the affected judgments using the changed evidence; do not repeat unrelated checks by default.
