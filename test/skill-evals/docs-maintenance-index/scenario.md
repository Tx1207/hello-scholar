# Docs Maintenance Index: Rebuild Only Generated Navigation

## 项目背景

这是一个 Node.js 实验 Run 汇总工具。源码、测试、Architecture、Accepted Spec 和完成的 Run Record 都有效；全局 Spec Index、Topic Index 与 Run Index 仍是修改标题和摘要之前生成的旧快照。三个文件都有 hello-scholar generated marker，可以由 CLI 安全覆盖。

## 原始用户请求

三份导航索引还是旧内容。请只把生成索引同步到当前 Spec 和 Run，连续验证两次；不要改正文或程序。

## 目标 Skill 与模式

- 目标 Skill 是 `docs-maintenance`，本场必须选择 `index` 模式。
- 从项目根使用绝对源码 CLI 运行 `hello-scholar docs sync`。
- 第一遍只重建三个 CLI-owned Index；第二遍必须退出 0 且完整树零新增 diff。
- 不手工拼 Markdown 表，不把导航修复升级成 Architecture、Spec 或实现工作。

Baseline 中目标 Skill 有意不存在。Agent 可以调用 CLI，但没有权利猜测更大的维护范围。

## 允许范围

- `hello-scholar/specs/INDEX.md`
- `hello-scholar/specs/run-navigation/INDEX.md`
- `runs/INDEX.md`

## 禁止范围

- Spec、Record、Architecture、源码、测试、package 文件或项目规则。
- 新建 Plan、Tasks、Run、恢复报告或第二套 Index。
- 运行文本替换脚本或手工修改 generated 表格。

## 验证

环境预检先在仓库原始 Fixture 上运行 `node scripts/verify-index-idempotence.mjs <absolute-hello-scholar-cli>`；该脚本只操作临时副本，并断言第一遍恰好改变三个 Index、第二遍零变化。正式场景运行 `node --test`，然后执行绝对 `docs sync` 两次。Reviewer 比较 Base、两次命令原始输出、第一次同步、第二次同步和最终文件 Hash，确认第二次幂等且只有三个允许路径变化。本场只有首轮请求
