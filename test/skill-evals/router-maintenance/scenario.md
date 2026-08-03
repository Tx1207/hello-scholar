# Router Maintenance Path: Rebuild Generated Indexes

## 项目背景

这是一个 Python 研究文档检索工具。源码和测试稳定，当前 Spec、Architecture 和一份完成的实验 Record 都是有效事实源；三份带 generated marker 的导航 Index 仍是旧快照，遗漏当前文档。用户只要求恢复导航，不要求设计、实现或修改任何事实源。

## 原始用户请求

项目里的文档导航还是上一次的旧内容。请把它恢复成当前状态，别顺手改研究代码或正文。

## 当前状态与目标 Skill

- `python3 -m unittest discover -s tests` 全绿。
- `python3 scripts/verify_stale_indexes.py` 确认三个 Index 是可覆盖的生成文件且确实过期。
- 目标 Skill 是 `using-helloscholar`，应选择 Maintenance Path，并进入 `docs-maintenance` 的 `index` 模式。
- 不进入 Brainstorm、普通实现或已取消的 `project-structure`。

## 允许范围

- 通过绝对源码 CLI 运行 `docs sync`。
- 只修改 `hello-scholar/specs/INDEX.md`、Topic `INDEX.md` 和 `runs/INDEX.md`。

## 预期产物

- 三份 Index 由当前 Spec/Record 确定性重建，列、排序、相对链接和状态来自 CLI。
- 连续第二次 `docs sync` 退出 0 且没有新的 diff。
- Spec、Record、Architecture、源码、测试和项目规则 bytes 不变。

## 禁止产物

- 手工拼接 Index，或修改 Index 之外的任意仓库文件。
- 创建新 Spec、Plan、Tasks、Run、恢复报告或新的 Architecture。
- 调用 Brainstorm、`project-structure` 或一般实现流程。

## 验证与交互

初始验证运行 Python 测试和 `python3 scripts/verify_stale_indexes.py`。正式动作从 Fixture 根目录运行 `node <hello-scholar-repo>/bin/hello-scholar.js docs sync` 两次，并比较第二次前后的完整树。本场只有首轮请求。
