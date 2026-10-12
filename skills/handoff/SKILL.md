---
name: handoff
description: Save the minimum durable context a future session needs when the user asks for a handoff or work must continue across sessions.
---

# Handoff

Give the next session enough context to take the right next action without replaying the conversation. Start from that action and work backward: what must the next agent know that it cannot reliably recover from durable sources?

## Preserve the missing context

Use the Spec, acceptance evidence, code, tests, Git, Records, issues, and other artifacts to distinguish recoverable facts from session-only state. Briefly orient the reader to the current objective and link the relevant owners. Preserve only additional context that changes continuation: an unresolved user choice, a local constraint not yet captured, the ownership of unfinished work, a blocker, or an active job the next session must not duplicate.

Explain a temporary choice through its reason and consequence, not a chronology of attempts. A discarded approach matters when its evidence would prevent the next agent from repeating an unproductive action. Preserve useful negative results through their source; do not rewrite them as failure to make the handoff sound complete.

Distinguish actions already performed, observations, and proposed next steps. Link recorded verification; include a check's actual command, result, and coverage only when those facts are otherwise unavailable. For ongoing external work, record the real job or process identifier and where to inspect it, rather than guessing its eventual result. Existing authorization and unresolved limits travel with the task; a handoff grants no new authority.

## Make continuation concrete

State the first useful action, its prerequisite or blocker, and the evidence it should produce. Prefer a path or precise command when one is known. The next session should be able to explain why that action is next without searching the whole history. Do not require a full recheck of unchanged evidence merely because the agent changed.

Write `hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md` under the current project root, using an unused suffix for a distinct handoff or updating the identified ongoing one. Use [assets/handoff-template.md](assets/handoff-template.md) for English or [assets/handoff-template.zh_CN.md](assets/handoff-template.zh_CN.md) for Chinese, following the requested language and otherwise the project language. Merge or omit template divisions that add no useful context.

Do not copy entire durable documents, conversation transcripts, secrets, credentials, or personal data. Do not turn the handoff into another design owner or an experiment summary. A Handoff is not a Spec Bundle member and is not indexed. Read it as the receiving agent: remove facts easily recoverable from the linked owners and repair any missing reason that would block the next action. Report the exact path and what the next session can resume.
