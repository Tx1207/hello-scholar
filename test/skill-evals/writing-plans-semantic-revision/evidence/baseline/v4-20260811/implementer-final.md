已根据 Accepted `SPEC-003` revision 3 完成 Plan 修订，保持 `draft` 状态并未开始实现。

修改文件：

- `/tmp/hello-scholar-eval-writing-plans-semantic-revision-baseline/hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/plan.md`
  - 更新至 `spec_revision: 3`
  - Plan `revision: 2`
  - 保持 `status: draft`
  - 保留显式 deny 优先级、兼容迁移、cleanup gate、TDD 选择及既有回滚策略
  - 将 audit callback 义务归并至接口、第一阶段、测试策略、迁移、cleanup、回滚和 Tasks 规则
  - 删除被 revision 3 替代的旧 revision 2/approved 绑定
  - 保持完整 12 节结构

生成索引已刷新：

- `/tmp/hello-scholar-eval-writing-plans-semantic-revision-baseline/hello-scholar/specs/INDEX.md`
- `/tmp/hello-scholar-eval-writing-plans-semantic-revision-baseline/hello-scholar/specs/feature-policy/INDEX.md`

边界确认：

- 未创建或修改 `tasks.md`
- 未修改 Architecture、源码、测试或其他上游文件
- 未批准 Plan
- 未开始实现

验证结果：

- `docs check`：0 errors；索引显示 Plan 为 `Current` / `draft`
- Python 测试：2 tests passed
- `git diff --check`：通过
- Plan：完整包含 12 个必需章节
- 仅保留预期的 `tasks.md` 缺失提示

result: 已完成 SPEC-003 revision 3 的完整 12 节 draft Plan 修订、索引刷新与验证，等待整份审核。
