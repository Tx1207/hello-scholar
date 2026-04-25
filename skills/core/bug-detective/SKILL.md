---
name: bug-detective
description: 当用户要求“debug this”、“fix this error”、“investigate this bug”、“troubleshoot this issue”、“find the problem”、“something is broken”、“this isn't working”、“why is this failing”，或直接报告 error / exception / bug 时使用。提供系统化调试流程和常见错误模式。
version: 0.1.0
---

# Bug Detective

用于调查和解决代码 error、exception 与 failure 的系统化调试工作流，提供结构化排障方法和常见错误模式识别。

## Core Philosophy

Debugging 是一个科学化的问题求解过程，通常包括：
1. **Understand the problem** - 明确症状与期望行为
2. **Gather evidence** - 收集 error message、log、stack trace
3. **Form hypotheses** - 基于证据推测可能原因
4. **Verify hypotheses** - 通过实验确认或排除原因
5. **Resolve the issue** - 应用修复并验证结果

## Debugging Workflow

### Step 1: Understand the Problem

开始调试前，先把以下信息澄清清楚：

**必须收集的信息：**
- 完整的错误信息
- 错误的准确位置（文件名和行号）
- 复现步骤（如何触发）
- 预期行为与实际行为
- 环境信息（OS、版本、依赖）

**提问模板：**
```text
1. What is the exact error message?
2. Which file and line does the error occur at?
3. How can this issue be reproduced? Provide detailed steps.
4. What was the expected result? What actually happened?
5. What recent changes might have introduced this issue?
```

### Step 2: Analyze Error Type

根据错误类型选择调试策略：

| Error Type | Characteristics | Debugging Method |
|-----------|----------------|-----------------|
| **Syntax Error** | 代码无法解析 | 检查语法、括号配对、引号 |
| **Import Error** | `ModuleNotFoundError` | 检查模块安装和路径配置 |
| **Type Error** | `TypeError` | 检查数据类型和类型转换 |
| **Attribute Error** | `AttributeError` | 检查对象是否具备该属性 |
| **Key Error** | `KeyError` | 检查字典键是否存在 |
| **Index Error** | `IndexError` | 检查列表或数组索引范围 |
| **Null Reference** | `NoneType` / `NullPointerException` | 检查变量是否为 `None` |
| **Network Error** | `ConnectionError` / `Timeout` | 检查网络连接、URL、超时设置 |
| **Permission Error** | `PermissionError` | 检查文件或用户权限 |
| **Resource Error** | `FileNotFoundError` | 检查文件路径是否存在 |

### Step 3: Locate the Problem Source

可以用以下方法定位问题：

**1. Binary Search Method**
- 注释掉一半代码，观察问题是否仍然存在
- 逐步缩小范围，直到找到出问题的代码段

**2. Log Tracing**
- 在关键位置添加 print / logging
- 跟踪变量值变化
- 确认代码执行路径

**3. Breakpoint Debugging**
- 使用 debugger 的断点功能
- 单步执行代码
- 检查变量状态

**4. Stack Trace Analysis**
- 从错误信息中的 stack trace 找调用链
- 找到直接触发点
- 继续回溯根因

### Step 4: Form and Verify Hypotheses

**假设模板：**
```text
Hypothesis: [问题描述] causes [错误现象]

Verification steps:
1. [验证方法 1]
2. [验证方法 2]

If the same verification path fails three or more times, stop and escalate the debugging strategy instead of making another local tweak. Re-check the original symptom, reduce to the smallest reproduction, inspect recent diffs, and consider whether the assumed root cause is wrong.

Expected results:
- If hypothesis is correct: [预期现象]
- If hypothesis is wrong: [预期现象]
```

### Step 5: Apply Fix

修复后要验证：
1. 原始错误已解决
2. 没有引入新的错误
3. 相关功能仍能正常工作
4. 已补充防止回归的测试

## Python Common Error Patterns

### 1. Indentation Errors
### 2. Mutable Default Arguments
### 3. Closure Issues in Loops
### 4. Modifying a List While Iterating
### 5. Using `is` for String Comparison
### 6. Forgetting to Call `super().__init__()`

## JavaScript/TypeScript Common Error Patterns

### 1. `this` Binding Issues
### 2. Async Error Handling
### 3. Object Reference Comparison

## Bash/Zsh Common Error Patterns

### 1. Spacing Issues

```bash
# ❌ 赋值两边不能有空格
name = "John"  # Error: 会尝试执行 'name' 命令

# ✅ 正确写法
name="John"

# ❌ 条件测试缺少空格
if[$name -eq 1]; then  # Error

# ✅ 正确写法
if [ $name -eq 1 ]; then
```

### 2. Quoting Issues

```bash
# ❌ 单引号内变量不会展开
echo 'The value is $var'  # 输出: The value is $var

# ✅ 使用双引号
echo "The value is $var"  # 输出: The value is actual_value

# ❌ 使用反引号做命令替换，可读性差
result=`command`

# ✅ 使用 $()
result=$(command)
```

### 3. Unquoted Variables

```bash
# ❌ 变量未加引号，空值时可能导致严重后果
rm -rf $dir/*  # 如果 dir 为空，可能删掉当前目录所有文件

# ✅ 始终给变量加引号
[ -n "$dir" ] && rm -rf "$dir"/*

# 或使用 set -u 阻止未定义变量
set -u  # or set -o nounset
```

### 4. Variable Scope in Loops

```bash
# ❌ pipe 会创建 subshell，外层变量不变
cat file.txt | while read line; do
    count=$((count + 1))  # 外层 count 不会变化
done
echo "Total: $count"  # 输出 0

# ✅ 使用 process substitution 或重定向
while read line; do
    count=$((count + 1))
done < file.txt
echo "Total: $count"  # 输出正确
```

### 5. Array Operations

```bash
# ❌ 错误的数组访问方式
arr=(1 2 3)
echo $arr[1]  # 输出 1[1]

# ✅ 正确访问
echo ${arr[1]}  # 输出 2
echo ${arr[@]}  # 输出全部元素
echo ${#arr[@]} # 输出数组长度
```

### 6. String Comparison

```bash
# ✅ POSIX `[` 用 `=`，Bash `[[ ]]` 用 `==`
if [ "$name" = "John" ]; then
if [[ "$name" == "John" ]]; then

# ❌ 把 = 当成数值比较
if [ $age = 18 ]; then  # Wrong

# ✅ 数值比较使用算术运算符
if [ $age -eq 18 ]; then
if (( age == 18 )); then
```

### 7. Command Failure Continues Execution

```bash
# ❌ 命令失败后脚本继续执行
cd /nonexistent
rm file.txt  # 会在当前目录删除 file.txt

# ✅ 使用 set -e 遇错退出
set -e  # or set -o errexit
cd /nonexistent  # 脚本在这里退出
rm file.txt

# 或手工检查命令是否成功
cd /nonexistent || exit 1
```

## Common Debugging Commands

### Python pdb Debugger

```bash
python -m pdb script.py
pytest -x -vv tests/test_target.py
```

### Node.js Inspector

```bash
node --inspect-brk app.js
node --trace-warnings app.js
```

### Git Bisect

```bash
git bisect start
git bisect bad
git bisect good <known-good-commit>
```

### Bash Debugging

```bash
# 以调试模式运行脚本
bash -x script.sh  # 打印每条命令
bash -v script.sh  # 打印命令源代码
bash -n script.sh  # 只做语法检查，不执行

# 在脚本内开启调试
set -x  # 打开命令追踪
set -v  # 打开 verbose mode
set -e  # 遇错退出
set -u  # 未定义变量时报错
set -o pipefail  # pipe 中任一命令失败则整体失败
```

## Preventive Debugging

### 1. Use Type Checking
### 2. Input Validation
### 3. Defensive Programming
### 4. Logging

## Debugging Checklist

### Before Starting

- [ ] 获取完整错误信息
- [ ] 记录 stack trace
- [ ] 确认复现步骤
- [ ] 理解期望行为

### During Debugging

- [ ] 检查最近代码变更
- [ ] 用二分法缩小范围
- [ ] 添加日志追踪变量
- [ ] 验证假设

### After Resolution

- [ ] 确认原始错误已修复
- [ ] 确认修复没有只改变错误表现而掩盖根因
- [ ] 添加或更新回归测试，或记录为什么无法自动化覆盖
- [ ] 测试相关功能
- [ ] 添加防回归测试
- [ ] 记录问题和解决方案

## Additional Resources

### Reference Files

详细调试技巧与模式见：
- **`references/python-errors.md`** - Python 错误细节
- **`references/javascript-errors.md`** - JavaScript / TypeScript 错误细节
- **`references/shell-errors.md`** - Bash / Zsh 脚本错误细节
- **`references/debugging-tools.md`** - 调试工具使用指南
- **`references/common-patterns.md`** - 常见错误模式

### Example Files

可运行的调试示例：
- **`examples/debugging-workflow.py`** - 完整调试工作流示例
- **`examples/error-handling-patterns.py`** - 错误处理模式
- **`examples/debugging-workflow.sh`** - Shell 脚本调试示例
