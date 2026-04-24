---
name: ~help
description: 输出 hello-scholar 的命令入口、主资产目录、兼容别名和推荐使用路径。
policy:
  allow_implicit_invocation: false
---
Trigger: ~help

输出内容至少包含：

- 支持的命令：`~idea ~plan ~build ~verify ~test ~auto ~prd ~init ~wiki ~loop ~commit ~clean`
- 兼容别名：`~do ~design ~review`
- 主资产目录：`hello-scholar/`
- 运行时安装目录：`.hello-scholar/`
- 主命令与现有 skill 的映射关系

不要把内部 `hello-*` 质量层当成普通用户可选 skill 列表输出。
