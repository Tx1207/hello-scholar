# Stable Spec Identity

仅在分类会创建新 Spec 身份时使用本参考。

## Stable Identity Test

1. **一次分配。** ID 取全局最大 Spec 数字加一；rejected 和 superseded ID 也计入最大值，至少保留三位。
2. **保持 owner 边界。** 优先复用既有 Topic owner。尚无 owner 时，使用 Architecture、调用方、相邻 Spec 排除项或已确认 Topic 建立的最窄仓库能力边界。接口类型属于设计名。
3. **命名跨方案不变量。** 设计名由已确认公共能力、稳定且材料性的身份修饰词和接口类型组成。选中的方案、执行模式或实现选择保留在 `候选方案与权衡`；只有用户将其确认为公共身份时才写入设计名。
4. **交叉核对。** 用既有 ownership、完整能力措辞和候选排除项核对 ID、Topic 与设计名。任一部分仍不确定时，返回 `Need Human Classification` 并只询问一个身份问题。
5. **绑定路径。** 展示 `hello-scholar/specs/<topic-id>/SPEC-<number>-<design-name>/spec.md`。确认必须明确绑定同一个 ID、Topic 和完整设计名；任一部分改变时，重新展示完整路径并开启新的确认门。

| 项目事实 | Topic | 设计名 |
| --- | --- | --- |
| public batch retrieval API；从多个方案中选择同步入口 | `batch-retrieval` | `public-batch-retrieval-api` |
| signed stateless session tokens 替代 opaque stored tokens | `session-auth` | `signed-stateless-session-tokens` |

**完成条件：** 已提出一条完整路径；路径中每个 token 都有稳定身份事实支持；确认请求逐字重复该路径。
