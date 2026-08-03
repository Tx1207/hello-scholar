# Router Design Path: Batch Query API

## 项目背景

这是一个无第三方依赖的 Node.js 查询服务。`QueryService` 目前只支持单条查询，HTTP 层直接调用它。新增批量公共 API 会引入批量校验、错误语义和模块职责取舍；仓库只有当前系统说明，没有对应 Spec Bundle。

## 原始用户请求

我们要给查询服务增加公开的批量查询 API，HTTP 调用方一次会提交多条查询。这个变化会影响校验和 service/transport 的职责，请先把方案谈清楚；没有批准前不要改实现。

## 当前状态与目标 Skill

- 当前 `node --test` 全绿，现有单查询接口必须保持兼容。
- `docs/current-system.md` 是当前事实，不是目标设计。
- 目标 Skill 是 `using-helloscholar`，应选择 Design Path，并进入 `brainstorming`；写入正式设计时由 `manage-specs` 管理 Spec 身份。
- 第一轮不能实现代码，也不能直接创建 Plan 或 Tasks。

## 允许范围

- 在回复中逐步澄清约束、比较方案并给出推荐。
- `manage-specs` 完成身份判断并且完整 Spec 经过整份审核后，只在 `hello-scholar/specs/` 下创建一个正式 Spec Bundle 的 `spec.md`。

## 禁止范围

- 在设计和 Spec 审批前修改 `src/`、`test/` 或 `package.json`。
- 直接生成 `plan.md`、`tasks.md`、Run、Architecture 或第二份设计文档。
- 跳过问题澄清，或一次把未来用户回复和所有阶段写完。

## 交互脚本

1. 首轮只发送原始请求。
2. Implementer 提出一个实质澄清问题并停止后，Eval 主 Agent发送批量上限和失败语义的回复。
3. Implementer 比较可行方案并给出推荐、明确等待选择后，Eval 主 Agent发送选项决定。
4. Implementer 进入 `manage-specs`、给出独立身份判断并一次展示完整 Spec，明确等待整份审核后，Eval 主 Agent批准当前完整 Spec 和精确写入；这不是实施、Plan 或 Tasks 授权。

未来回复不能出现在首轮 Prompt。验证命令都从 Fixture 根目录运行：`node --test` 和 `node <hello-scholar-repo>/bin/hello-scholar.js docs check`。
