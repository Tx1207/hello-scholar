# Security Review 指南

## 检查重点
- 未清洗输入
- SQL 或 shell injection
- 不安全的反序列化
- secret 泄漏
- 缺失的 authz 检查
- 不安全的文件系统或网络默认配置

## Review Note Pattern
`Blocking: 这条路径接收了不可信输入，并在未验证的情况下传给了 X。`
