# Command 测试策略

这是在发布和分发前测试 slash commands 的完整策略。

## 概览

测试 command 的目标是确保它：
- 功能正确
- 能处理 edge cases
- 用户体验合理
- 在分发后具有稳定性

系统化测试可以尽早暴露问题，并提升对 command 可靠性的信心。

## 测试层级

### Level 1：语法与结构校验

要检查：
- YAML frontmatter 语法
- Markdown 格式
- 文件位置与命名

典型检查：

```bash
head -n 20 .codex/commands/my-command.md | grep -A 10 "^---"
ls .codex/commands/*.md
test -f .codex/commands/my-command.md && echo "Found" || echo "Missing"
```

也可以写自动校验脚本，检查：
- 文件是否存在
- 是否为 `.md`
- frontmatter 是否成对闭合
- 文件是否为空

### Level 2：Frontmatter 字段校验

要检查：
- 字段类型是否正确
- 值是否在合法范围内
- 必需字段是否存在

例如检查：
- `model` 是否为合法值
- `allowed-tools` 是否存在且格式合理
- `description` 是否过长

### Level 3：手动调用测试

要检查：
- command 是否出现在 `/help`
- command 执行是否报错
- 输出是否符合预期

典型流程：
1. 启动 `claude --debug`
2. 用 `/help` 确认 command 已加载
3. 无参数执行一次
4. 有效参数执行一次
5. 查看 debug logs

### Level 4：参数测试

要检查：
- `$1`、`$2` 等位置参数是否正确替换
- `$ARGUMENTS` 是否能捕获全部参数
- 缺少参数时是否优雅处理
- 非法参数是否被识别

建议测试矩阵：
- 无参数
- 单参数
- 多参数
- 多余参数
- 带空格参数
- 空字符串参数

### Level 5：文件引用测试

要检查：
- `@file` 是否能读取内容
- 文件不存在时是否优雅报错
- 大文件是否处理得当
- 多文件引用是否正常

应分别测试：
- 存在文件
- 不存在文件
- 多文件
- 大文件

### Level 6：Bash 执行测试

要检查：
- `!`` 命令是否正常执行
- 输出是否被注入 prompt
- 失败命令是否被正确处理
- 只允许已声明的命令运行

特别要测：
- 正常命令
- 被禁止命令
- 返回非零退出码的命令

### Level 7：集成测试

要检查：
- command 与其他插件组件是否协同正常
- command 之间的顺序工作流是否能跑通
- 状态文件能否跨多次调用工作
- MCP、hooks、agents 等集成是否正常

典型场景：
1. command + hook
2. 多 command 顺序执行
3. command + MCP integration

## 自动化测试方法

### Command Test Suite

可以写统一测试脚本，对每个 `.md` command 批量做：
- 结构校验
- frontmatter 校验
- 基础输出检查

### Pre-Commit Hook

可在 `.git/hooks/pre-commit` 中加入 command 校验，防止损坏的 command 被提交。

### Continuous Testing

在 CI/CD 中执行：
- command 结构检查
- frontmatter 检查
- TODO 检查

## Edge Case 测试

重点覆盖：

### 参数边界

- 空参数：`/cmd ""`
- 特殊字符：空格、引号、斜杠、下划线
- 超长参数
- 奇怪路径：`./file`、`../file`、`~/file`、带空格路径

### Bash 边界

- `exit 1`
- `false`
- 不存在的命令
- 空输出
- 大量输出

## 性能测试

### 响应时间

关注：
- command 平均响应时间
- 多次运行的波动
- 快速 command 是否能控制在可接受阈值内

### 资源占用

可在一个终端运行 `claude --debug`，另一个终端观察：
- 内存
- CPU
- 进程数

## 用户体验测试

### Usability Checklist

- [ ] 命令名直观
- [ ] `/help` 中 description 清楚
- [ ] 参数说明明确
- [ ] 错误消息有帮助
- [ ] 输出易读
- [ ] 长任务有进度提示
- [ ] 结果可执行
- [ ] edge cases 下 UX 不崩

### User Acceptance Testing

可以找 beta testers 试用，并收集：
1. 是否容易理解
2. 输出是否符合预期
3. 最想修改什么
4. 是否愿意常用

## 发布前检查清单

### Structure

- [ ] 文件位置正确
- [ ] `.md` 扩展名正确
- [ ] YAML frontmatter 合法
- [ ] Markdown 语法正确

### Functionality

- [ ] command 出现在 `/help`
- [ ] description 清楚
- [ ] 执行无错误
- [ ] arguments 工作正常
- [ ] 文件引用正常
- [ ] Bash 执行正常（若使用）

### Edge Cases

- [ ] 缺参处理正常
- [ ] 非法参数可识别
- [ ] 不存在文件可处理
- [ ] 特殊字符可处理
- [ ] 长输入可处理

### Integration

- [ ] 与其他 commands 协同正常
- [ ] 与 hooks 协同正常
- [ ] 与 MCP 协同正常
- [ ] 状态管理正常

### Quality

- [ ] 性能可接受
- [ ] 无明显安全问题
- [ ] 错误消息有帮助
- [ ] 输出格式清晰
- [ ] 文档完整

### Distribution

- [ ] 已找他人测试
- [ ] 已吸收反馈
- [ ] README 更新
- [ ] 提供 examples

## 调试失败测试

### 常见问题

**command 没出现在 `/help`：**
- 检查文件位置
- 检查权限
- 检查 frontmatter / Markdown 是否损坏
- 重启 Claude Code

**参数没替换：**
- 检查 `$1`、`$2`、`$ARGUMENTS` 写法
- 先用最小示例验证

**Bash 没执行：**
- 检查 `allowed-tools`
- 检查 `!`` 语法
- 手工先跑一次命令本身

**文件引用失效：**
- 检查 `@` 语法
- 检查目标文件是否存在
- 检查读取权限

## 最佳实践

1. 早测、频测，不要最后一起补
2. 能自动化的检查尽量自动化
3. 不只测 happy path，也测坏路径
4. 发布前让别人试用
5. 保留测试场景，便于回归测试
6. 发布后继续观察真实使用情况
7. 根据反馈持续迭代
