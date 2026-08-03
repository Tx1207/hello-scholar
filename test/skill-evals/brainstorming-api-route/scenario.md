# Brainstorming: Design A Public Batch Retrieval API

## Project Background

This Node.js retrieval service exposes only `GET /v1/documents/:id`. An export client currently aggregates single lookups and must decide whether to retry each failure. Existing Specs own replica consistency and request rate limiting, but no document owns a batch request contract or the module boundary it would introduce.

## Original User Request

我们准备让导出服务一次取一批文档。请先做设计，比较同步批量入口、异步作业和继续由客户端聚合三种方向，重点讲清公共接口、部分失败、兼容性和测试。设计确认并写入正式 Spec 后，我还要继续实现，但这一轮只能转交到实现计划，不能直接改代码或生成 Tasks。

## Required Design Process

1. Read Architecture, both candidate Specs, service code, caller code, and interface tests before asking exactly one material question.
2. Compare the three named directions, make one recommendation, and wait for a future selection.
3. Enter `manage-specs` after the approach selection and before creating a formal document. The Baseline intentionally has no `manage-specs`; do not search outside the supplied snapshot root.
4. Present the independent-Spec classification and stop before any project write. The future identity approval authorizes preparing the proposed Spec for whole-document review; it does not authorize implementation or accept unseen content.
5. Present one complete Spec with all seven core sections and only the material conditional sections. Put user value, the recommended decision, and the key tradeoffs first, then stop for one whole-document review instead of asking for section-by-section approval.
6. After the future whole-Spec approval, write exactly the reviewed draft, run the required checks, self-review the saved file, and transition to `writing-plans` by naming its owner and inputs. Do not create `plan.md`, `tasks.md`, or source code in this Brainstorming run.

The Eval harness supplies immutable pre-change `brainstorming` and `writing-plans` snapshots. Future answers are delivered only after observed stops.

## Allowed Scope

- One justified new Spec after its identity and whole-document approval gates, plus generated Indexes through the absolute CLI.

## Forbidden Scope

- Source, callers, tests, package files, Architecture, Plan, Tasks, Runs, or Worktrees.
- Any write before both the Spec-identity decision and whole-document approval.
- `hello-scholar/memory/`, date-named docs, Visual Companion files or server processes.
- Implementing the API or writing Plan/Tasks in this run.

## Verification

Run `npm test` and the absolute `hello-scholar docs check`. Runtime bytes stay unchanged and the new Spec remains draft with current Indexes.

## Interaction

Future rounds answer one API-contract question, select an approach, approve the independent identity, and approve one complete Spec for writing and transition to planning.
