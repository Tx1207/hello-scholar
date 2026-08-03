# Baseline Interaction: Wave 4

- Implementer: `/root/manage_specs_successor_wave4_baseline`
- Model: `gpt-5.6-terra`
- `forkTurns`: `none`
- Delivered rounds: both approved rounds, in order.

## Round 0: user current request

```text
先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。
```

## Implementer response after round 0

```text
建议归类为“替代设计”：新建 successor Spec 取代 `SPEC-005`，并建立互相对应、无环的 supersession 关系。

修改现有设计不适合：`SPEC-005` 的正式认证路径是“每次验证查询可撤销 token store”；签名验证不查 store 改变了核心生命周期与立即撤销模型。

独立设计不适合：它仍直接拥有同一 token 身份、签发与验证边界，无法与 `SPEC-005` 并列作为互不重叠的能力。

替代设计适合：新模型以 `kid`、`sub`、`iat`、`exp` 的签名 token 为正式路径，并在迁移期兼容旧 token，完成后删除存储，明确替换旧设计。

`SPEC-011` 已声明不决定 token 表示；因此审计事件格式保持不变，不应被取代或修改。

本轮未写入任何项目文件，也未假定后续批准。
```

## Round 1: eval-main classification decision

```text
同意把它归类为替代设计。创建 draft SPEC-012 signed stateless session tokens，并与 SPEC-005 建立双向、无环 supersession；审计事件 Spec 保持不变。只更新必要 Spec 和 CLI 生成的 Index，不实现代码。
```

## Implementer final response

```text
已创建 draft SPEC-012：签名 token 含 `kid`、`sub`、`iat`、`exp`，新 token 验证不查询 token store；迁移期保留旧 opaque token 验证，完成后删除 legacy 路径与存储。审计事件格式保持 `SPEC-011` 不变。

已更新 SPEC-005 为 `superseded_by: SPEC-012`，并将其 revision 更新为 3；SPEC-012 使用 `supersedes: [SPEC-005]`，关系双向且无环。CLI 已生成两个 Index。

`docs check` 结果为 3 个 Specs、2 个 Index、0 errors。未创建计划或任务文件，未改动运行时代码。
```
