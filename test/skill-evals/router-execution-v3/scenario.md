# LRU Cache Tasks

## 项目背景

这是一个 Python 内存 Cache 库。`CacheAllocator` 的公开构造与 `set`、`get`、`keys` 方法已经存在；当前实现按插入顺序淘汰。现有 Accepted Spec、Approved Plan 和当前批准的 Tasks 已经定义将行为改为真正的 LRU，并限定了文件、依赖、验证和完成条件。

## 原始用户请求

Cache 的 Spec、Plan 和 Tasks 都已审过。本轮明确授权你按当前 Tasks 完成实现；完成后把任务状态和验证结果收口。

## 项目约束

- `SPEC-004` 是 accepted，Plan 是 approved，Tasks 的 `approval` 已批准且 `approved_revision` 等于当前 `revision`。
- 保持现有公开 API；读取和更新都必须刷新最近使用顺序，满容量时淘汰最久未使用项。
- 实施只限 Tasks 指定的 allocator、测试和 Tasks 完成状态。
