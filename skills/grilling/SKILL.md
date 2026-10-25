---
name: grilling
description: Clarify a goal, idea, plan, or decision through focused dialogue when unresolved assumptions or tradeoffs could change the choice, or when the user asks to deepen a request or rewrite a prompt before work starts. Works independently of a project or Spec.
---

# Grilling

Help the user make a defensible choice by finding the uncertainty that matters most. Work from the desired outcome: a proposed tool, feature, or experiment may be a means rather than the goal. Distinguish observed facts, real constraints, preferences, and assumptions inherited from the first proposal.

## Find the decision that changes the approach

Establish factual context from the supplied material and available files or tools. Ask the user for choices they own or facts you cannot obtain. Trace dependencies between decisions: settle the prerequisite before asking about consequences that depend on it. Prioritize a question by how much its answer could change the recommendation, scope, or success criteria, rather than by how easy it is to ask.

For each unresolved assumption, consider what would follow if it were false. Use a concrete alternative, counterexample, or failure condition to expose a meaningful tradeoff. Challenge the reasoning without requiring the user to defend a preference as an objective fact. When project evidence already resolves a question, state the finding and move on.

## Question and update

Each round, ask one direct question whose prerequisites are known. Briefly explain why it changes the choice; offer a recommendation and its main tradeoff when the available evidence supports one. Use concise, mutually exclusive options when they make the decision easier. Do not invent a recommendation for an unknown personal preference.

Use the answer to revise the emerging decision and select the next question. Do not reopen an answered distinction without new conflicting evidence. When useful, state the implication immediately: which approach is now viable, ruled out, or still uncertain, and why. This keeps the user from having to reconstruct the reasoning at the end.

Stop when remaining answers would not change the choice, implementation, or acceptance; when the user asks to stop; or when a necessary fact cannot be obtained. In the last case, identify what depends on that fact and what can still proceed. Do not exhaust hypothetical future branches or force a final confirmation round.

## Deepen a request instead of enlarging it

When the user asks for a deeper version of a task or a better prompt, answer from domain knowledge instead of questioning round by round:

- what a top practitioner would do here that the request does not ask for;
- the rawest material they would start from, such as raw data, logs, source code, or original papers, instead of summaries already digested for the user;
- the specific methods and tools they would use;
- what evidence other than the agent's or the user's judgment would show the result is right, such as a baseline, benchmark, held-out data, an independent measurement, or a real entry point.

Keep each addition only when it raises the quality of the same goal; drop anything that adds a new goal, deliverable, or budget. Then give the rewritten request in a fenced block, ready to paste, and stop. The user decides whether to use it; deepening a request authorizes no work.

## Return a usable decision

Summarize the current choice, its decisive reasons, meaningful constraints, and unresolved questions with their consequences. Separate accepted decisions from recommendations. Include a concrete next action when it follows from the discussion; a generic promise to investigate is not a decision.

Standalone questioning writes no project files and requires no project, Spec, tracker, or subagent.
