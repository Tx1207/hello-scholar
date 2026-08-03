---
name: landing
description: |
  Landing: use only when the user explicitly names `landing`, or explicitly asks in this turn to pressure-test a recoverable prior direction for real-world feasibility—ground or narrow it, and define a stop rule.
---

# Landing

## Overview

Enter `landing` only when the user explicitly expresses Landing intent in this turn. Existing `takeoff` context is input, not authorization; without that authorization, stay in the current phase. A valid intent either names `landing` or explicitly asks to reality-test a direction by making it feasible, grounding or shrinking it, and defining a stop rule.

`landing` rewrites the bold direction into a feasible plan: keep the ambition, rewrite the parts that cannot survive reality, and produce a feasible revised direction. The output is not just the first move and not the whole execution plan.

If `brainstorming` also applies, deliver the `landing` judgment first before any brainstorming-style clarification begins. Brainstorming starts only after the user accepts the landed direction or explicitly asks to refine it. When design work is next, ask the user whether to enter `brainstorming`; wait for their answer before changing phase.

After entry is authorized, recover the prior direction from current context. A valid context makes the bold thesis, the old model it replaces, and the main reality question recoverable. If an explicit Landing request lacks those inputs, ask for the missing direction; explicit intent does not permit guessing the thesis. Ordinary risk, MVP, verification, or next-step questions do not authorize Landing.

## Entry Check

Before reading the Workflow, quote the user's triggering words from this turn. A future Approved Task may authorize entry only if an explicit contract adds that path. If there is no explicit Landing intent, stay in the current phase and do not read the workflow below to self-trigger. Once authorized, verify that the bold thesis, old model, and main reality question are recoverable; otherwise ask the one missing-direction question before using any template. Complete this check only with an authorization quote plus recoverable direction, or with that missing-input question.

## Value Criteria

This is the landing value gate, not decoration. Every important **Must Keep** or **Rewrite and Keep** item must name the criterion it hits and the concrete payoff. If it cannot, default to **Defer** or **Delete**. "Already exists", "the user likes it", or "easy to change" is not value.

| Criterion | Passing signal |
|---|---|
| Core ambition | Removing it flattens the takeoff upside |
| Real contract | It protects a public API, persisted data, documented integration, deployment/compliance constraint, or explicit promise |
| Largest risk | It reduces the largest blast radius instead of adding aesthetic complexity |
| Cheap verification | It creates a cheap observable success/failure signal |
| Stage boundary / stop rule | It clarifies what belongs now and when to pause or shrink |

## Workflow

1. **Restate the direction.** Name the bold thesis and source context. If the bold thesis / old model / main reality question cannot be recovered, stop.
2. **Value-rank before rewriting.** Use the value criteria and four buckets: **Must Keep**, **Rewrite and Keep**, **Defer**, **Delete**. For each important item include Criterion:, Evidence:, Why it matters:, Cost if ignored:, and Landing treatment:. A one-line category table is not enough when the direction touches real files or contracts.
3. **Handle disagreement as a hard gate.** AI value ranking is an evidence-backed recommendation, not a final verdict. If the user disagrees, treat the user's judgment as a new constraint, then re-price cost, risk, stage boundary, verification, and stop rule in five separate dimensions: Cost, Risk, Stage Boundary, Verification, Stop Rule.
4. **Reality-check the thesis.** Read and use the five anti-patterns in `references/anti-patterns.md`: Vision Without Viable Shape, Fake Migration Plan, Unpriced Risk, Ambition Collapsed Into First Step, and No Stop Rule. Do not only list the names; convert them into target shape and consumer, contract/migration split, largest risk plus verification, ambition-vs-proof check, and stop condition.
5. **Produce the feasible revised direction.** Feasible Plan is a Target Shape Statement: landed shape, boundary, tradeoffs, and evidence signal. It is not a rewrite procedure, implementation sequence, or "first A, then B" operation list; any next-phase action belongs only in `🔄 Next Step` / `🔄 下一步`.
6. **Set Stage Boundary, Verification, and Stop Rule.** Say what belongs now, what waits for design or implementation planning, what success/failure signal is cheap to observe, and what evidence would pause or shrink the plan.
7. **Close with Next Move.** Ask whether to proceed with that judgment, revise, pause, validate further, or enter `brainstorming` for design. Next Move must ask a direct question. If the response must use the hello-scholar wrapper, put this question in the single `🔄 Next Step` / `🔄 下一步` wrapper field; do not add a separate `Next Move` / `下一步` body heading.

## Output

Use these exact semantic labels in the user's default language. English labels: Landing Judgment / Value Ranking / Ambition Kept / Must Rewrite / User Decision Points / Reality Check / Feasible Plan / Stage Boundary / Verification / Stop Rule / Next Move. Chinese labels: 落地审判 / 价值排序 / 保留的野心 / 必须改写的部分 / 用户裁决点 / 现实检查 / 落地版方案 / 阶段边界 / 验证 / 止损规则 / 下一步. The only exception is when the hello-scholar wrapper already provides a `🔄 Next Step` / `🔄 下一步` field: merge the Next Move question there so the answer has one next-step exit; the body should state what the current landing judgment includes and excludes, not preview the next phase's action.

Short dialogue means no headings, not partial judgment. It still has to cover Value Ranking, Ambition Kept, Must Rewrite, User Decision Points, Reality Check, Feasible Plan, Stage Boundary, Verification, Stop Rule, and Next Move. If those elements are missing, the landing failed.

Formal answer self-check:

- Do not compress Value Ranking evidence fields; important items still need Criterion, Evidence, Why it matters, Cost if ignored, and Landing treatment.
- Value Ranking must use the value criteria; items that cannot name a concrete pain removed, capability unlocked, or real contract protected cannot enter Must Keep / Rewrite and Keep.
- User Decision Points must name where the user's judgment could override the recommendation.
- If the user disagrees: Do not merge Cost, Risk, Stage Boundary, Verification, and Stop Rule into one paragraph. Use explicit labels: `Repriced Cost:`, `Repriced Risk:`, `Repriced Stage Boundary:`, `Repriced Verification:`, and `Repriced Stop Rule:`.
- Value Ranking must use Must Keep, Rewrite and Keep, Defer, Delete. Empty buckets can be named as none; do not collapse value into binary valuable/useless.
- Lead with the verdict: go / shrink / pause / reject / validate first.
- Name real constraints separately from anxiety or inertia, and preserve the bold target when it is useful.
- Feasible Plan may describe the revised shape, boundaries, tradeoffs, and evidence signal; it must not become a document rewrite method, implementation order, file-step list, or migration sequence.
- Next Move must ask the user whether to proceed, revise, pause, validate further, or enter `brainstorming` if design is needed. With the hello-scholar wrapper, this question belongs only in `🔄 Next Step` / `🔄 下一步`.
