# Generated Documentation Indexes

## 项目背景

这是一个 Python 研究文档检索工具。源码、测试、当前 Spec、Architecture 和已完成的 Record 都是事实源；三个带 generated marker 的导航 Index 仍是旧快照，遗漏当前文档。用户只要求恢复由事实源导出的导航。

项目提供 hello-scholar CLI 来确定性重建这些 Index。第二次同步必须不产生新的内容或元数据 diff。

## 原始用户请求

项目里的文档导航还是上一次的旧内容。请把它恢复成当前状态，别顺手改研究代码或正文。

## 项目约束

- 只允许生成 `hello-scholar/specs/INDEX.md`、Topic `INDEX.md` 和 `runs/INDEX.md`。
- 必须通过仓库提供的 CLI 重建，不能手工编辑导航内容。
- Spec、Record、Architecture、源码、测试、脚本和项目规则必须保持不变。
