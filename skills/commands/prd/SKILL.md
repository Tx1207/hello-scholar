---
name: ~prd
description: 文档和规格收束命令，优先复用 planning-with-files 与 doc-coauthoring，必要时接入论文写作相关 skills。
policy:
  allow_implicit_invocation: false
---
Trigger: ~prd [description]

`~prd` 用于生成结构化交付文档，而不是直接实现代码。

## 主调度

- 主 skill：`planning-with-files`
- 文档编排：`doc-coauthoring`
- 论文/科研交付物时按需附加：
  - `ml-paper-writing`
  - `paper-self-review`
  - `review-response`
  - `post-acceptance`

## 落盘要求

- 文档型方案仍写入 `hello-scholar/plans/<plan-id>/`
- 以 `plan.md` / `tasks.md` / `contract.json` 为最小契约
- 需要长期保留的研究真相，补写到 `hello-scholar/research/`
