# Hook 开发辅助脚本

这些脚本用于在部署前校验、测试和 lint hook 实现。

## `validate-hook-schema.sh`

用途：校验 `hooks.json` 结构和常见错误。

检查项：
- JSON 语法
- 必需字段
- hook event 名称是否合法
- hook 类型是否正确
- timeout 是否合理
- 是否存在硬编码路径

## `test-hook.sh`

用途：在接入 Claude Code 前，用样例输入测试单个 hook 脚本。

支持：
- verbose 模式
- 自定义 timeout
- 生成 sample input
- 校验输出 JSON
- 查看 exit code 语义

## `hook-linter.sh`

用途：检查 hook script 的常见问题和最佳实践违规。

检查项：
- shebang
- `set -euo pipefail`
- stdin 读取
- 错误处理
- 变量引用
- exit code
- 硬编码路径
- 长时间运行逻辑

## Typical Workflow

1. 编写 hook script
2. 用 `hook-linter.sh` 检查
3. 生成 sample input
4. 用 `test-hook.sh` 测试
5. 把脚本加入 `hooks.json`
6. 用 `validate-hook-schema.sh` 校验
7. 最后在 Claude Code 中用 `claude --debug` 做真实测试

## 常见问题

**Hook 不执行：**
- 缺 shebang
- 没执行权限
- `hooks.json` 路径写错

**Hook 超时：**
- 缩短脚本逻辑
- 调整 timeout
- 移除慢操作

**Hook 静默失败：**
- 检查 exit code
- 错误是否写到 stderr
- 输出 JSON 是否合法

**存在注入风险：**
- 所有变量加引号
- 开启 `set -euo pipefail`
- 校验输入字段
