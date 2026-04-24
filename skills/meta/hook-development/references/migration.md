# 从基础 Hook 迁移到高级 Hook

本指南说明如何把基础 command hook 迁移为 prompt-based hook，以提升可维护性和灵活性。

## Why Migrate?

prompt-based hook 的优势：
- 自然语言推理能力更强
- 对 edge case 处理更灵活
- 不一定需要 bash 脚本
- 更容易扩展复杂校验规则

## 典型迁移思路

### Bash Command Validation

**旧方式：**
- 在 shell 脚本里硬编码危险命令模式
- 只能匹配字符串，难覆盖变体

**新方式：**
- 在 prompt 中直接描述校验标准
- 让 LLM 理解意图，而不是死匹配文本

### File Write Validation

**旧方式：**
- 手工检查 `..`、`/etc/`、`.env` 等路径模式

**新方式：**
- 同时考虑文件路径和内容
- 统一判断 system path、credential file、path traversal、secret leakage

## When to Keep Command Hooks

以下场景仍适合 command hook：

1. **纯确定性检查**
   - 文件大小
   - 简单正则
   - 固定格式验证

2. **外部工具集成**
   - 调用 security scanner
   - 查询本地工具返回结果

3. **极快检查**
   - 小于 50ms 的白名单判断

## Hybrid Approach

可以组合：
- command hook 负责快速 deterministic check
- prompt hook 负责复杂 reasoning

这样既保证性能，也保证复杂场景覆盖。

## Migration Checklist

- [ ] 识别旧脚本中的校验逻辑
- [ ] 把硬编码规则改写成自然语言标准
- [ ] 用旧 hook 漏掉的 edge case 重新测试
- [ ] 为 prompt hook 配合合理 timeout
- [ ] 在 README 中记录迁移结果
- [ ] 归档旧脚本，必要时保留参考

## Migration Tips

1. 一次只迁一个 hook
2. 迁移后先验证它至少不比原来差
3. 借迁移机会顺手提升校验质量
4. 对真正快且确定的逻辑，不要强行改成 prompt hook
