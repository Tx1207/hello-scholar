# JavaScript / TypeScript 错误指南

## 常见故障类型
- 由 `undefined` / `null` 访问触发的 `TypeError`
- `Promise` 链中的 async error 被吞掉
- `this` 绑定不符合预期
- hook 或 event handler 中的 stale closure
- ESM / CJS import 不匹配

## 最小调试流程
1. 先复制完整 stack trace。
2. 判断问题属于 runtime、bundler 还是 type-level。
3. 在修改逻辑前先确认出错对象和值。
4. 用尽可能小的输入稳定复现。
