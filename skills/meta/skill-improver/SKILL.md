---
name: skill-improver
description: 当用户要求“apply skill improvements”、“update skill from plan”、“execute improvement plan”、“fix skill issues”、“implement skill recommendations”，或提到要根据 quality review report 落地改进时使用。它会读取 `skill-quality-reviewer` 生成的 `improvement-plan-{name}.md`，并把建议变更智能合并后执行，用于提升 Claude Skills 质量。
version: 1.0.0
---

# Skill Improver

执行 `skill-quality-reviewer` 生成的 improvement plan，自动更新 Claude Skills 并修复其中的问题。

## Core Workflow

```text
Read improvement-plan-{name}.md
    ↓
Parse improvement items (High/Medium/Low priority)
    ↓
Group changes by file
    ↓
Detect and resolve conflicts
    ↓
Backup original files
    ↓
Execute updates (Edit or Write tools)
    ↓
Verify results
    ↓
Generate update-report
```

## When to Use

**触发短语：**
- "Apply improvements from improvement-plan-git-workflow.md"
- "Update my skill based on the quality report"
- "Execute the improvement plan for api-helper"
- "Fix the issues identified in quality review"

**适用场景：**
- 根据 improvement plan 应用改进
- 按 quality review 反馈更新 skill
- 执行 `skill-quality-reviewer` 推荐的修复项
- 对 skill 文档实施结构化改进

## Step-by-Step Guide

### Step 1: Load the Improvement Plan

读取 `skill-quality-reviewer` 生成的 `improvement-plan-{skill-name}.md` 文件。

```bash
# 计划文件通常在当前目录
ls improvement-plan-*.md

# 或指定完整路径
read /path/to/improvement-plan-my-skill.md
```

**验证计划文件：**
- 文件存在且可读
- 包含优先级分区（High / Medium / Low）
- 含有结构化改进项
- 提供文件路径和建议修改内容

详细结构见 `references/plan-format.md`。

### Step 2: Parse and Group Changes

提取所有改进建议，并按目标文件组织。

**从每个条目中提取：**
- 文件路径（如 `SKILL.md:line:line` 或 `references/file.md`）
- 维度（Description Quality、Content Organization 等）
- 影响分（`+X points`）
- 当前内容
- 建议内容
- 修改原因

**构建更新队列：**
```text
by_file = {
  "SKILL.md": [change1, change2, ...],
  "references/guide.md": [change3, ...],
  "examples/demo.md": [change4, ...],
}
```

### Step 3: Detect and Resolve Conflicts

当多个变更影响同一内容时，检测并处理冲突。

**处理策略：**
1. High priority 高于 medium / low
2. 若优先级相同，保留第一个变更
3. 将冲突标记为需要人工复核
4. 在 update report 中记录冲突处理方式

详细合并逻辑见 `references/merge-strategies.md`。

### Step 4: Sort by Priority

在每个文件内按优先级排序：

**优先级顺序：**
1. High Priority（最先执行）
2. Medium Priority（其次执行）
3. Low Priority（最后执行）

### Step 5: Backup and Execute

**备份位置：** `hello-scholar/skill-backups/{skill-name}-{timestamp}/`

```bash
# 使用备份脚本
./skills/skill-improver/scripts/backup-skill.sh <skill-path>
```

**应用变更：**
- 现有内容使用 Edit tool
- 新文件使用 Write tool
- 每项变更完成后都要验证已正确写入

### Step 6: Verify and Report

**验证检查：**
1. YAML 语法合法
2. 所有修改后的文件都存在且有效
3. 新文件已成功创建
4. 没有发生意外改动

```bash
# 使用验证脚本
./skills/skill-improver/scripts/verify-update.sh <skill-path>
```

生成 `update-report-{skill-name}-{timestamp}.md`，记录：
- Summary（修改文件数、创建文件数、总变更数）
- Changes Applied（按文件拆分）
- Quality Improvement（前后分数对比）
- Verification Results
- Backup Location

报告模板见 `examples/update-report-example.md`。

## Priority Handling

### High Priority

最先执行，通常解决：
- 严重的 description 问题
- 主要写作风格问题
- 缺失的结构性元素
- 安全相关问题

### Medium Priority

在 High 之后执行，通常解决：
- 内容组织优化
- 补充示例
- 文档增强

### Low Priority

最后执行，通常解决：
- 细微澄清
- 锦上添花型改进
- 文案润色与细节打磨

## Integration with Skill Quality Reviewer

本 skill 与 `skill-quality-reviewer` 可以无缝协同：

```text
Current Skill (67/100 D+)
    ↓ [skill-quality-reviewer]
Improvement Plan
    ↓ [skill-improver]
Improved Skill (87/100 B+)
    ↓ [skill-quality-reviewer]
Quality Report (validation)
```

**持续迭代，直到达到目标质量水平。**

## Additional Resources

### Reference Files

- **`references/plan-format.md`** - improvement plan 的结构与格式
- **`references/merge-strategies.md`** - 详细合并算法与冲突处理方式
- **`references/error-handling.md`** - 错误处理策略
- **`references/supported-updates.md`** - 支持的更新类型与示例

### Example Files

- **`examples/improvement-plan-example.md`** - improvement plan 示例
- **`examples/update-report-example.md`** - update report 示例

### Scripts

- **`scripts/backup-skill.sh`** - 更新前为 skill 创建备份
- **`scripts/verify-update.sh`** - 更新后验证 skill 完整性

## 最佳实践

### Before Applying Updates

1. **先审 improvement plan** - 清楚知道会改什么
2. **确认备份位置** - 确保出现问题时可恢复
3. **检查手工改动** - 留意本地未提交修改
4. **预估影响** - 理解预期质量提升幅度

### During Update Execution

1. **按优先级顺序处理** - High → Medium → Low
2. **每个文件改完就验证** - 确认修改已正确生效
3. **记录所有变更** - 明确写出实际修改内容
4. **平稳处理冲突** - 必要时标记复核

### After Applying Updates

1. **查看 update report** - 确认所有变更都符合预期
2. **测试 skill** - 验证它仍能正常工作
3. **对比评分** - 确认质量提升符合预期
4. **保留备份** - 在确定稳定前不要删备份

## Usage Examples

**Example 1: 对本地 skill 应用改进**
```text
User: "Apply improvements from improvement-plan-git-workflow.md"

[Claude 执行流程：]
1. 读取 improvement-plan-git-workflow.md
2. 解析所有改进项
3. 按文件分组
4. 检测并处理冲突
5. 按优先级排序
6. 备份 git-workflow skill
7. 执行更新
8. 验证结果
9. 生成 update-report-git-workflow-timestamp.md
```

**Example 2: 根据 quality review 更新 skill**
```text
User: "Update my api-helper skill based on quality report"

[Claude:]
1. 定位 improvement-plan-api-helper.md
2. 应用所有推荐修改
3. 验证 skill 结构
4. 报告质量提升：72/100 → 91/100
```
