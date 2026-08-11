✅ 【hello-scholar】- SPEC-001 Revision 3 已写入并完成自审 - brainstorming / manage-specs

已按批准的精确修订稿完成 bounded 本地 Spec 更新，未触碰 Plan、Tasks、Architecture、源码或测试。

### 写入范围

- `hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`
  - `status: draft`
  - `revision: 3`
  - `updated: 2026-08-11`
  - 保留原有 `id`、Topic、Bundle 路径、创建日期及关系字段
- 由 CLI 生成：
  - `hello-scholar/specs/INDEX.md`
  - `hello-scholar/specs/search-ranking/INDEX.md`

### 执行证据

运行：

```text
env -C /tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v2-20260811a hello-scholar docs sync
```

结果：

```text
docs sync: written 2, deleted 0, errors 0, notices 4
```

随后运行：

```text
env -C /tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v2-20260811a hello-scholar docs check
```

结果：

```text
docs check: specs 2, records 0, indexes 2, errors 0, notices 4
```

Index 均为 `Current`。4 个 notices 仅为两个 Spec 缺少 Plan/Tasks，符合本轮禁止创建 Plan/Tasks 的边界。

### Whole-file semantic-conservation 自审

- `Keep`：relevance owner、lexical/semantic/freshness 权重、稳定 tie、公开返回结构、diversity/pagination 非目标均保留。
- `Modify`：现有 semantic threshold 改为 `0.68`；新增 bounded deterministic phrase lexical bonus，且上限为 `0.15`。
- `Add`：phrase-match 内部 signal、phrase bonus 规则、threshold boundary 验收和对应验证要求已进入完整 Spec。
- `Remove`：未新增公开参数；旧 threshold 不再出现在规范性 Current State、Goals、Target Design、Interfaces、Invariants、Boundaries、Acceptance、Migration 或 Rollback 中。
- `Revision History` 保留旧决定的历史记录；`0.62` 仅出现于 Revision 2 历史条目，已通过 `grep` 验证。
- 写入后的实际变更文件仅为上述一个 Spec 和两个 CLI 生成的 Index 文件。
