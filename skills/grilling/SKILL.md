---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you haven't heard yet. Each round, choose the one frontier decision with the greatest impact on the downstream design. Ask only that question, give your recommended answer, then wait for the user's response.

Format each question as a section card. Include only the option rows the decision needs:

```markdown
#### Q1｜<question title>

<question body; use multiple paragraphs when needed>

- A｜<option title>: <option description and tradeoff>
- B｜<option title>: <option description and tradeoff>
- C｜<option title>: <option description and tradeoff>

Recommendation: **A**:
<reason for the recommendation>
```

Each answer reshapes the tree — settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier, then choose exactly one question. A question whose answer depends on an unsettled decision belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it — don't ask the user for anything you could look up yourself. If the selected question is still waiting on research, choose another frontier question that does not depend on that research; if none exists, wait for the research before asking. Ask only one question in every round. The _decisions_ are the user's — put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
