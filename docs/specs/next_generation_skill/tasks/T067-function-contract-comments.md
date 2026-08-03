# T067：为升级代码增加函数输入、输出与用途合同注释

- Status: `completed`
- PR: `PR 7 - Legacy 迁移与完整闭环`
- Depends On: T008
- Parallel: Yes。可以与纯 Scenario/Protocol/Fixture 准备并行；不得修改 Eval 题目或历史证据。

## 为什么要做

用户在 2026-08-01 明确要求：完成本次项目时，写代码要在函数定义紧邻位置说明函数用途、输入和输出。当前项目强调“Make AI write code you will not rewrite”，但原 AGENTS 只要求少写无效注释，没有定义函数合同格式；本次新增的 parser、校验器、Index 和 Eval 合同 helper 因此缺少统一入口说明。

这个 Task 把新要求变成可执行合同，而不是依赖后续 Agent 记住当前对话。它只改善可读性和维护性，不改变函数行为、异常、路径、Schema 或公共 API。

## 人话规则

每个本次升级新增或发生行为修改的命名函数/方法，在函数体第一处用一条简洁合同说明：

- `Purpose`：这个函数负责什么，不复述函数名；
- `Input`：参数的业务含义和关键形态；没有参数时明确写 `none`；
- `Output`：返回什么；无返回值时写 `none`；
- `Errors`：会抛出哪些对调用方有意义的错误；
- `Side effects`：会写文件、改外部状态、启动进程或提交批次时说明。

`Errors` 和 `Side effects` 只在存在时写。Python 使用函数体第一条 docstring；JavaScript/TypeScript 使用函数体第一条注释。匿名 callback 默认不要求，除非它承载了可复用行为。

例如：

```javascript
function parseFrontMatter(text, sourcePath = "<input>") {
  // Purpose: parse one restricted Front Matter block; Input: Markdown text and source label; Output: attributes, body, and line metadata; Errors: FrontMatterError for unsupported syntax.
}
```

```python
def sha256_tree(path: str | Path) -> str:
    """Purpose: hash one safe directory tree; Input: directory path; Output: deterministic SHA-256; Errors: ContractError for unsafe nodes."""
```

## 与原注释规则的关系

原规则反对“给显而易见赋值写旁白”这类无效注释；本 Task 不推翻它。函数合同只在入口集中说明调用者关心的边界，不逐行解释实现。一个函数只有一个合同事实源，行为变化时在同一改动更新，不在 README、调用方和多份注释里复制同一内容。

Eval Fixture、Baseline 和 Live evidence 描述外部项目或已发生的历史运行，修改它们会改变题目 Hash 或伪造证据，因此不为代码风格回写。生产 Skill 的 Markdown 指令不是函数，也不添加这种注释。

## 文件边界

### Modify

- `AGENTS.md`
- `AGENTS-zh.md`
- 本次升级在 `src/` 中新增或行为修改的 JavaScript 函数。
- `test/skill_eval_contract.py` 中的可复用合同函数。
- 本次升级新增测试中的可复用 helper：`test/test_cli_docs.js`、`test/test_document_discovery.js`、`test/test_document_validation.js`、`test/test_frontmatter.js`、`test/test_index_generator.js`、`test/test_eval_proposal_batch.py`、`test/test_no_systematic_debugging_skill.py`、`test/test_skill_eval_contract.py`。
- 后续本次升级新增或行为修改的生产函数和可复用 script/helper。

### Add

- `test/test_function_contract_comments.py`

### Must Not Modify

- `test/skill-evals/**` 中的 Scenario、Protocol、Fixture、Approval、Baseline、Scorecard 或 evidence。
- 已批准 Spec 的语义内容。
- 函数行为、签名、返回值、异常、文件格式或 CLI。
- 第三方、vendored、generated、安装目标或用户项目代码。

## 实施细节

1. 在中英文 AGENTS 加同一条函数合同规则和各语言示例。
2. 回补 T004-T008 新增模块的全部命名函数，以及 `src/cli.js`、`src/fs-ops.js` 中被这些 Task 新增或行为修改的函数。
3. 为 `test/skill_eval_contract.py` 的可复用函数补第一条 docstring；不为 dataclass 字段或纯声明制造注释。
4. 新增静态测试，使用 JavaScript 源文本和 Python AST 检查上述明确 owner 文件/函数，包括本次升级测试中的可复用 helper；测试框架发现用的 `test_*` 方法和匿名 callback 不作为 helper。测试只判断合同是否紧邻函数入口且包含 `Purpose`、`Input`、`Output`；它不解析 Eval Fixture，也不扫描第三方代码。
5. 后续 Task 新增生产函数或可复用 helper 时，同一 Task 更新函数合同和静态守卫的 owner 清单。不要等到发布末尾再猜哪些函数属于本次升级。
6. 做 focused diff review，确认只有注释和静态合同变化；任何行为 diff 都退回对应 owner Task。

## 验证

- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest test/test_function_contract_comments.py`
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_function_contract_comments.py'`
- `npm test`
- `git diff --check`

如果直接 module 形式受系统同名 `test` package 遮蔽，保留失败事实并以 discovery 形式作为仓库有效入口；不要为绕过环境遮蔽新增无关 `test/__init__.py`。

## 完成标准

- 中英文 AGENTS 对函数合同的字段、位置和例外一致。
- 当前升级 owner 的函数都具有紧邻定义的 `Purpose`、`Input`、`Output` 合同，存在错误/副作用时没有隐瞒。
- 静态守卫能在删除字段、把注释移离函数入口或新增未说明的 owner 函数时失败。
- Eval 题目和证据 Hash 未因代码风格要求变化。
- 全部测试通过，函数行为 bytes 之外的语义保持不变。
