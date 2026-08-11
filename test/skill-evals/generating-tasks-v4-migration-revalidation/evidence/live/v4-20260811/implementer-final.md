已生成并等待审核：

`hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md`

- 元数据保持 `revision: 1`、`approval: pending-review`、`status: pending`。
- 拆分为 T001–T006，覆盖：
  - 双读兼容窗口与迁移准备
  - dry-run、应用迁移、幂等性与损坏输入保护
  - JSON-only 切换门及三类失败验证
  - 旧 writer、flag、reader 分支和 dependency 删除
  - 完整回归矩阵
  - 隔离 Git worktree 回滚演练
- 依赖已串行化为 `T001 → T002 → T003 → T004 → T005 → T006`，避免共享文件和迁移证据冲突。
- `npm test` 通过，5/5 tests passed。
- Git 写入集合仅有上述 `tasks.md`，未修改 Spec、Plan、Architecture、源码、测试或配置数据，也未安装依赖或开始迁移。
- `docs sync` / `docs check` 因环境权限拦截未执行；因此未声称 CLI 文档检查通过。

现停在 pending-review，等待你审核。
