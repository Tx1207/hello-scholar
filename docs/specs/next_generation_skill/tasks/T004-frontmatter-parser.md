# T004：实现受限 YAML Front Matter 解析器

- Status: `completed`
- PR: `PR 1 - 文档解析、校验和 Index`
- Depends On: T003
- Parallel: No。T005 至 T008 都依赖它的返回合同。

## 目标

用 Node.js 标准库实现一个只覆盖本项目固定 Front Matter 格式的解析器。这不是通用 YAML Parser；不增加生产依赖，不支持嵌套对象、多行值、Anchor 或自定义 Tag。

## 事实源

- 执行 plan 第 6 节和第 9.1 节。
- PRD 第 8.2 至 8.6 节的五类 Front Matter 示例。
- `package.json`：CommonJS、无生产依赖。
- `test/test_cli_install.js`：Node `node:test` 和 `assert/strict` 风格。

## 文件边界

### Add

- `src/frontmatter.js`
- `test/test_frontmatter.js`

### Must Not Modify

- `package.json`
- `src/cli.js`
- 任何 Skill 或文档模板

## 公开合同

`src/frontmatter.js` 使用 CommonJS 导出：

- `parseFrontMatter(text, sourcePath = "<input>")`：返回 `{ attributes, body }`。
- `parseScalar(rawValue, sourcePath, lineNumber)`：可以导出供聚焦测试使用，但不得成为其他模块必须依赖的业务 API。
- `FrontMatterError`：继承 `Error`，错误信息至少包含 `sourcePath` 和 1-based 行号。

## 解析规则

1. 文档必须以独立的 `---` 行开始，并有第二个独立 `---` 结束 Front Matter。缺失边界或边界前有正文时报错。
2. 同时支持 LF 和 CRLF。`body` 保留原文内容，不为了解析而重写用户正文。
3. 每个元数据行使用第一个 `:` 分隔 key/value。Key 只允许 `[A-Za-z_][A-Za-z0-9_-]*`；重复 key 报错。空行允许，其他无法识别的行报错。
4. 值支持：双引号字符串、单引号字符串、未引号单行字符串、十进制整数、`true`、`false`、`null` 和单行数组。日期、时间戳、Spec ID 和带 `:` 的标题作为字符串。
5. 数组只允许上述标量，支持 `[]`、`[SPEC-001, SPEC-002]` 和带引号的元素。拒绝嵌套数组或对象。
6. 明确拒绝缩进嵌套对象、`|`/`>` 多行值、`&anchor`、`*alias`、`!!tag` 和未闭合引号。不能静默将不支持语法当成普通字符串。
7. 解析器只负责语法和标量类型，不在这里校验 `kind`、`status`、Revision 或路径。语义校验属于 T006。

## 测试要求

1. 先写失败测试，覆盖 Spec、Plan、Tasks、Record、Architecture 示例，以及 LF/CRLF。
2. 覆盖标量边界：负整数、引号内冒号、空数组、`null`、布尔值和带空格的中文 Summary。
3. 覆盖错误：缺少边界、重复 key、无冒号、嵌套、多行、Anchor/Tag、未闭合引号，并断言错误中的文件名和行号。
4. 运行 `node --test test/test_frontmatter.js`，先观察缺实现的失败，再实现到通过。
5. 运行 `npm test`。

## 完成标准

- 五类文档示例都能得到正确的 `attributes` 和 `body`。
- 不支持的 YAML 显式失败，不会被错解。
- 没有新增 npm 依赖，没有顺手实现序列化器或文档校验。
