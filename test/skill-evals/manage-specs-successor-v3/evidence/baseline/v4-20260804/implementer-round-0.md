已完成设计归档前的只读检查，未修改任何文件。

检查范围：
- `/tmp/hello-scholar-eval-manage-specs-successor-v3-baseline-20260804-164844/AGENTS.md`
- 当前架构、Spec 索引
- `SPEC-005` opaque session token 设计
- `SPEC-011` 审计事件设计
- `src/token-store.js`
- `test/token-store.test.js`

判断与候选：
1. **修改现有设计（推荐）**：目标仍是 session-auth/token identity 与 validation，但把 `SPEC-005` 的核心验证模型从服务端 token-store lookup 改为带 `kid/sub/iat/exp` 的签名 token；迁移期兼容旧 token，最终删除存储。依据是 `SPEC-005` 已明确拥有 token identity、validation、expiry 与 revocation 边界。
2. **独立设计**：不推荐。虽然迁移期有兼容阶段，但新旧格式属于同一认证能力的生命周期演进，不是独立能力。
3. **替代设计/新 successor Spec**：可选。若希望保留已接受的 `SPEC-005` 作为历史基线，可创建 successor Spec，并建立双向、无环的 supersession 关系；但这会增加正式设计与索引维护成本。

审计事件格式保持不变，因为 `SPEC-011` 明确规定其不选择 token 表示形式。

已运行检查：
- `npm test`：1 个测试通过，0 失败。
- `git status --short`：工作区无变化。

当前停止点：等待你确认采用“修改现有设计”还是创建 successor/替代设计；尚未写正式文档。
