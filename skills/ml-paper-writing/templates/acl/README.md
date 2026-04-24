# ACL 论文模板说明

这个目录包含 *ACL 系列会议使用的 LaTeX 模板。

## 面向作者的说明

投稿到 *ACL 系列会议的论文，应使用官方 ACL style files，不要改用其他会议模板，也不要自行修改这些样式文件。

可用资源：

- [Overleaf 模板](https://www.overleaf.com/latex/templates/association-for-computational-linguistics-acl-conference/jvxskxpnznfj)
- 当前仓库内的模板文件
- [官方 ZIP 下载](https://github.com/acl-org/acl-style-files/archive/refs/heads/master.zip)

示例文档见 [`acl_latex.tex`](https://github.com/acl-org/acl-style-files/blob/master/acl_latex.tex)。

论文格式细则请参考：

- [Paper formatting guidelines](https://acl-org.github.io/ACLPUB/formatting.html)

## 面向 publication chair 的说明

如果你需要为具体会场适配样式文件，建议 fork 官方仓库后再做修改。最少通常需要：

- 更新会议名称
- 按会场重命名相关文件

如果你的修改应当回流给后续 ACL 会场，建议向上游提交 pull request。

旧版本模板曾要求作者手动填写 START submission ID，并将编号印在匿名稿页面顶部。现在这一步通常可以由 START 自动完成；如需启用，通常由 program chair 联系 `support@softconf.com`。

## 面向模板维护者的同步流程

- 在 GitHub 合并 pull request，或直接推送到对应仓库
- 从 GitHub `git pull` 到本地仓库
- 再从本地仓库 `git push` 到 Overleaf 项目
- 最后在 Overleaf 中点击 `Submit` 和 `Submit as Template`，请求其更新在线模板

当前文档中提到的 Overleaf 项目信息如下：

- 项目地址：https://www.overleaf.com/project/5f64f1fb97c4c50001b60549
- Git 地址：https://git.overleaf.com/5f64f1fb97c4c50001b60549
