# 面向 Marketplace 的 Command 设计考量

这是为“可分发、可上架”的 commands 准备的设计指南。

## 概览

要进入 marketplace 的 command，要求比个人自用 command 更高。它们必须：
- 跨环境运行
- 兼容更多用户场景
- 在未知用户面前仍然有良好 UX

## 面向分发的设计

### 通用兼容性

要考虑跨平台差异，例如：
- macOS
- Linux
- Windows / WSL

command 中如果必须依赖平台能力，应先检测平台，再决定行为。避免直接写死平台专属命令，比如只支持 `pbcopy` 而不考虑 `xclip` / `clip.exe`。

### 最小依赖

分发给别人使用的 command，应在执行前主动检查依赖，例如：
- `git`
- `jq`
- `node`

如果缺失依赖，应输出：
1. 缺失哪些工具
2. 安装方式
3. 安装后如何重试

同时在文档中区分：
- **Required dependencies**
- **Optional dependencies**

### Graceful Degradation

如果某些扩展能力依赖额外工具（如 `gh`、`docker`），command 应在这些工具缺失时优雅降级，而不是直接崩溃：
- 有 `gh`：启用 GitHub integration
- 没有 `gh`：保留基础功能，并提示安装可获得完整能力

## 面向未知用户的 UX

### Clear Onboarding

首次运行时应有良好 onboarding：
- 告诉用户这个 command 是做什么的
- 给出 quick start
- 说明是否需要额外 setup
- 如有必要，创建初始化标记文件

### Progressive Feature Discovery

command 执行完后可顺手给出 tips，例如：
- 还有哪些参数能提升效率
- 如何查看更多帮助
- 如何发现相关 commands

### Comprehensive Error Handling

要预判用户常见错误：
- 拼错参数
- 提供未知选项
- 缺少依赖
- 当前目录不满足要求

错误信息应包含：
1. 出了什么问题
2. 可能原因
3. 可以怎么修

必要时附带 diagnostics，例如：
- 平台
- shell
- 当前目录
- git repo 状态
- 权限检查

## 分发最佳实践

### Namespace Awareness

要避免命令名冲突：
- 尽量使用清晰、可区分的名字
- 必要时加 plugin 前缀
- 避免 `/test`、`/run` 这种过于通用的名字

好的命名通常同时兼顾：
- 可发现性
- 易输入
- 不易冲突

### Configurability

可分发 command 最好支持用户配置，例如读取：

```markdown
.codex/plugin-name.local.md
```

并提供 sensible defaults，例如：
- `format: json`
- `output: stdout`
- `verbose: false`

用户可以通过 arguments 覆盖默认值，也可以通过本地配置长期定制。

### Version Compatibility

建议在 command 中记录：
- command version
- 所需最小 plugin version
- breaking changes
- deprecation 策略

当用户使用旧参数或旧行为时，应给出 deprecation warning，并告诉用户新写法与迁移路径。

## Marketplace 展示

### Command Discovery

description 要具体，避免空泛。好的 description 应该能让用户在 `/help` 或 marketplace 搜索结果中一眼看懂用途。

可以在文档中额外标记关键词，提升搜索可发现性，例如：
- security
- code-review
- validation
- audit

### Showcase Examples

为 command 提供一眼能打动用户的演示：
- 一条可直接试跑的示例命令
- 清楚写出“你会得到什么”
- 附一段样例输出

### User Feedback

为 command 预留反馈机制：
- Helpful / Not helpful
- report bug
- suggestion

如果有 usage analytics，也要坚持：
- 不收集个人敏感信息
- 只做聚合统计
- 尊重用户 opt-out

## 质量标准

### Professional Polish

细节决定成品感：
- branding 一致
- 输出对齐整洁
- 数字格式友好
- 必要时加进度提示
- 成功完成时明确确认

### Reliability

command 应尽量具备：
- **Idempotency**：重复执行不会造成混乱
- **Atomicity**：要么全成功，要么不落半成品

例如：
- 用完成标记避免重复执行
- 先在临时目录做变更，通过验证后再原子替换

## 面向分发的测试

### Pre-Release Checklist

发布前至少确认：

**Functionality**
- macOS / Linux / Windows (WSL) 可用
- 所有 arguments 测过
- 错误路径可处理
- edge cases 覆盖

**User Experience**
- description 清楚
- 错误信息有帮助
- 提供 examples
- 首次体验顺畅
- 文档完整

**Distribution**
- 没有硬编码路径
- 依赖文档齐全
- 配置方式清楚
- 版本号正确
- changelog 已更新

**Quality**
- 没有 TODO
- 没有 debug 残留
- 性能可接受
- 安全性已检查
- 隐私已考虑

### Beta Testing

若 command 尚不稳定，可明确标记 beta：
- 当前版本
- 稳定性等级
- 已知限制
- 如何反馈问题

## 维护与更新

### Update Strategy

建议遵循版本化策略：
- **Major**：breaking changes
- **Minor**：新功能，向后兼容
- **Patch**：bug fixes

### Update Notifications

如可行，可在 command 中提示更新：
- 当前版本
- 最新版本
- 新功能摘要
- 更新命令
- release notes 链接

## 最佳实践总结

### Distribution Design

1. **Universal**：跨平台、跨环境
2. **Self-contained**：依赖尽量少、要求清楚
3. **Graceful**：功能缺失时能优雅降级
4. **Forgiving**：对用户错误更宽容
5. **Helpful**：文档清楚，默认值合理，错误可修复

### Marketplace Success

1. **Discoverable**：命名清晰、description 好、关键词可搜索
2. **Professional**：呈现完整、风格统一
3. **Reliable**：充分测试，覆盖边界情况
4. **Maintainable**：版本清楚，持续更新
5. **User-focused**：围绕真实用户体验设计

### Quality Standards

1. **Complete**：功能和文档都完整
2. **Tested**：在真实环境中验证过
3. **Secure**：没有明显安全问题
4. **Performant**：速度和资源占用合理
5. **Ethical**：尊重隐私和用户同意

满足这些条件后，command 才真正算得上 marketplace-ready。
