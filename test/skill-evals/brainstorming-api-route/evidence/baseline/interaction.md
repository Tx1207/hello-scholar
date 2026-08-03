# Baseline Interaction

- Implementer: `/root/brainstorming_api_baseline`
- Model: `gpt-5.6-terra`
- `forkTurns`: `none`
- Delivered rounds: the approved current-request round only.

## Implementer output

```text
⚡【hello-scholar】- 等待批量公共接口的创建批准 - brainstorming

已完成上下文核对：现有 `RetrievalService.getDocument(id)` 是唯一公共读取入口；`ExportClient.collect(ids)` 由客户端逐项聚合并保留输入顺序与每项 `null`。`SPEC-007` 仅约束单项副本一致性，`SPEC-013` 仅约束请求预算，均不定义批量语义。

建议采用“同步批量入口”作为第一阶段：新增独立的批量读取公共接口，返回与输入一一对应的结果项，以 `document` 或明确的项级错误表示部分失败，并维持原有单项接口及客户端行为不变。它能将批次验证、预算计量和一致性选择集中到服务端，且不引入作业存储、状态轮询或过期清理。

比较结论：

| 方向 | 公共接口 | 部分失败 | 兼容性 | 测试重点 |
| --- | --- | --- | --- | --- |
| 同步批量入口（推荐） | 独立批量方法；单项接口保留 | 每个输入项有成功/失败结果，整体仅在请求无效时失败 | 纯新增；客户端可逐步迁移 | 顺序、重复 ID、缺失文档、项级错误、预算与副本约束 |
| 异步作业 | 创建作业、查询状态、获取结果 | 作业完成后按项汇总；需定义取消、重试、TTL | 新的生命周期与持久状态 | 幂等、轮询、状态迁移、过期、重试、部分结果 |
| 客户端继续聚合 | 无新服务端接口 | 客户端处理每项 | 当前行为不变 | 客户端并发、重试、跨调用预算与一致性 |

当前 `AGENTS.md` 要求批量路由具有独立生命周期并获得显式创建批准，且在该批准前不得写入正式文档。因此尚未创建或修改 Spec，也未生成 Plan/Tasks。

唯一需要的批准：是否批准创建“同步批量读取”这一独立公共接口，并以“输入顺序保持、逐项结果、单项接口不变”为契约？批准后才能将该设计写入正式 draft Spec，待其单独接受后再转交实施计划。

🔄 下一步: 等待你对批量公共接口创建的明确批准。
```

The approved first stop required exactly one material API question after reading project and caller facts. The Implementer instead presented the three-way comparison and requested creation approval. No later Protocol message was delivered because that approved first stop was not observed.
