---
name: skill-quality-reviewer
description: 当用户要求“analyze skill quality”、“evaluate this skill”、“review skill quality”、“check my skill” 或 “generate quality report” 时使用。它会从 description quality、内容组织、写作风格和结构完整性四个维度评估本地 skill。
version: 0.1.0
---

# Skill Quality Reviewer

## 概览

这是一个用于评估 Claude Skills 质量的 meta-skill。它会围绕四个核心维度进行综合分析：description quality（25%）、content organization（30%）、writing style（20%）和 structural integrity（25%），并生成加权分数、letter grade 与可执行的 improvement plan。

用它来：
- 在分享 skill 之前做质量验证
- 识别改进空间
- 检查是否符合 skill development best practices

## When to Use This Skill

**适用场景：**
- 在分发前分析一个 skill 的质量
- 审查 skill 文档是否符合最佳实践
- 检查是否满足 skill development 标准
- 为已有 skill 生成改进建议
- 验证 skill 结构与完整性

**触发短语：**
- "Analyze skill quality for ./my-skill"
- "Evaluate this skill: ./skills/api-helper"
- "Review skill quality of git-workflow"
- "Check my skill for best practices"
- "Generate quality report for this skill"

## Review Modes

根据任务选择三种 review mode 之一：

1. **score-only**
   - 快速给单个 skill 做首轮评分
2. **remediation-backlog**
   - 把发现转成带证据的 P0 / P1 / P2 修复队列
3. **batch-portfolio**
   - 批量审查多个 skill，聚类重复问题，并给出优先修复短名单

如果用户问“下一步先修什么”，优先使用 `remediation-backlog`。
如果用户要一次审很多 skill，优先使用 `batch-portfolio`。

## Analysis Workflow

### Step 1: Load the Skill

接收 skill 路径作为输入，确认路径存在且包含 `SKILL.md`，然后读取完整 skill 目录结构。

```bash
# Example invocation
ls -la ./skills/target-skill/
```

**验证：**
- `SKILL.md` 存在
- 目录可读
- 路径确实指向一个合法 skill

### Step 2: Parse YAML Frontmatter

提取并校验 `SKILL.md` 中的 YAML frontmatter。

**必需字段：**
- `name` - skill 标识符
- `description` - 含触发短语的描述

**检查点：**
- YAML 语法合法
- 没有被禁止的字段
- 格式正确

### Step 3: Evaluate Description Quality (25%)

评估 frontmatter description 的质量和触发效果。

**评分细则：**

| Criterion | Points | Evaluation |
|-----------|--------|------------|
| Trigger phrases clarity | 25 | 是否有 3-5 个具体用户短语 |
| Third-person format | 25 | 是否使用 “This skill should be used when...” |
| Description length | 25 | 100-300 字符最优 |
| Specific scenarios | 25 | 是否给出具体 use case，而非空泛描述 |

**红旗信号：**
- 模糊触发语，如 “helps with tasks”
- 第二人称描述（“Use this when you...”）
- description 缺失或过于泛化
- 没有可操作的 trigger phrase

参考：`references/examples-good.md`

### Step 4: Evaluate Content Organization (30%)

评估是否遵循 progressive disclosure 原则。

**评分细则：**

| Criterion | Points | Evaluation |
|-----------|--------|------------|
| Progressive disclosure | 30 | `SKILL.md` 精炼，细节放在 `references/` |
| `SKILL.md` length | 25 | 小于 5,000 词（1,500-2,000 最理想） |
| `references/` usage | 25 | 详细内容是否正确下放 |
| Logical organization | 20 | 分节清楚、流转合理 |

**检查点：**
- `SKILL.md` 本体是否简洁聚焦
- 详细内容是否迁移到 `references/`
- example 和 template 是否放在合适目录
- 文件间是否存在重复信息

参考：`references/scoring-criteria.md`

### Step 5: Evaluate Writing Style (20%)

检查是否符合 skill 写作规范。

**评分细则：**

| Criterion | Points | Evaluation |
|-----------|--------|------------|
| Imperative form | 40 | 是否通篇使用动词开头指令式 |
| No second person in body | 30 | workflow 正文中避免 conversational second person |
| Objective language | 30 | 语气客观、说明性强 |

**检查点：**
- 是否使用祈使句，如 “Create the file”“Validate input”“Check structure”
- 是否避免 “You should”“You can”“You need to”
- 是否保持客观 instruction tone
- 风格是否前后一致

**好例子：**
```text
Create the skill directory structure.
Validate the YAML frontmatter.
Check for required fields.
```

**坏例子：**
```text
You should create the directory.
You need to validate the frontmatter.
Check if the fields are there.
```

### Step 6: Evaluate Structural Integrity (25%)

验证 skill 的物理结构与完整度。

**评分细则：**

| Criterion | Points | Evaluation |
|-----------|--------|------------|
| YAML frontmatter | 30 | 必需字段是否齐全 |
| Directory structure | 30 | 组织是否规范 |
| Resource references | 40 | 所有引用文件是否真实存在 |

**验证内容：**
- YAML frontmatter 是否包含 `name` 和 `description`
- 目录结构是否符合约定：
  ```text
  skill-name/
  ├── SKILL.md
  ├── references/ (optional)
  ├── examples/ (optional)
  └── scripts/ (optional)
  ```
- `SKILL.md` 中提到的文件是否都存在
- example 是否完整可用
- script 是否可执行

### Step 7: Calculate Weighted Score

根据加权维度计算总分。

**公式：**
```text
Overall Score = (Description × 0.25) + (Organization × 0.30) +
                (Style × 0.20) + (Structure × 0.25)
```

**Letter grade 映射：**

| Score Range | Grade | Meaning |
|-------------|-------|---------|
| 97-100 | A+ | Exemplary |
| 93-96 | A | Excellent |
| 90-92 | A- | Very Good |
| 87-89 | B+ | Good |
| 83-86 | B | Above Average |
| 80-82 | B- | Solid |
| 77-79 | C+ | Acceptable |
| 73-76 | C | Satisfactory |
| 70-72 | C- | Minimal Acceptable |
| 67-69 | D+ | Below Standard |
| 63-66 | D | Poor |
| 60-62 | D- | Very Poor |
| 0-59 | F | Fail |

### Step 8: Generate Reports

在当前工作目录创建两个输出文件。

**1. Quality Report**（`quality-report-{skill-name}.md`）
- Executive summary：总分与等级
- 按维度拆分评分
- 每个维度的 strengths / weaknesses
- 评分贡献表
- 指向 improvement plan 的链接

**2. Improvement Plan**（`improvement-plan-{skill-name}.md`）
- 按优先级排序的改进列表（High / Medium / Low）
- 问题对应的具体文件位置与行号
- 当前内容与建议内容的对比
- 预计分数提升
- 修复时间估算
- 预期总分改善

## Output Templates

### Quality Report Template

```markdown
# Skill Quality Report: {skill-name}

## Executive Summary
- **Overall Score**: X/100 ({Grade})
- **Evaluated**: {Date}
- **Skill Path**: {path}

## Dimension Scores

### 1. Description Quality (25%)
**Score**: X/100

**Strengths**:
- ✅ {specific strength}

**Weaknesses**:
- ❌ {specific weakness}

**Recommendations**:
1. {actionable recommendation}

[Repeat for other dimensions...]

## Grade Breakdown
| Dimension | Score | Weight | Contribution |
|-----------|-------|--------|--------------|
| Description | X/100 | 25% | X.X |
| Organization | X/100 | 30% | X.X |
| Style | X/100 | 20% | X.X |
| Structure | X/100 | 25% | X.X |
| **Overall** | **X/100** | **100%** | **X.X ({Grade})** |

## Next Steps
See `improvement-plan-{skill-name}.md` for detailed improvement suggestions.
```

### Improvement Plan Template

```markdown
# Skill Improvement Plan: {skill-name}

## Priority Summary
- **High Priority**: {count} items
- **Medium Priority**: {count} items
- **Low Priority**: {count} items

## High Priority Improvements

### 1. [Issue Title]
**File**: SKILL.md:line:line
**Dimension**: Description Quality
**Impact**: +X points

**Current**:
```yaml
{current content}
```

**Suggested**:
```yaml
{suggested content}
```

**Reason**: {why this improves quality}

[Continue with all issues...]

## Quick Wins (Easy Fixes)
1. {quick fix}
2. {quick fix}

## Estimated Time to Complete
- High Priority: X hours
- Medium Priority: X hours
- Low Priority: X hours
- **Total**: X hours

## Expected Score Improvement
- Current: X/100 ({Grade})
- After High Priority: X/100 ({Grade})
- After All: X/100 ({Grade})
```

## Additional Resources

### Reference Files

需要详细评分标准和示例时，查看：

- **`references/scoring-criteria.md`** - 各维度详细评分 rubric
- **`references/examples-good.md`** - 高质量 skill 示例
- **`references/examples-bad.md`** - 应避免的常见反模式

### Scripts

- **`scripts/extract-yaml.sh`** - 从 `SKILL.md` 提取 YAML frontmatter
- **`scripts/skill-audit.py`** - 轻量完整性审计，检查缺失引用、字数和 sibling path

### Related Skills

- **`skill-development`** - 创建 skill 的完整指南
- **`code-review-excellence`** - code review 最佳实践

## 最佳实践

### When Analyzing Skills

1. **客观且具体** - 评分基于可观察标准，而不是个人喜好
2. **反馈必须可执行** - 每条建议都应明确、能落地
3. **附示例** - 用当前内容与建议内容对照说明
4. **估计影响** - 让用户知道哪些改动最值得先做
5. **保持建设性** - 把反馈表述为改进机会

### Common Quality Issues

**Description Quality：**
- trigger phrase 模糊或过泛
- 使用第二人称描述
- 缺少具体 use case

**Content Organization：**
- `SKILL.md` 过长（>5,000 词）
- 细节没有下放到 `references/`
- 信息层级混乱

**Writing Style：**
- 出现第二人称（`you`、`your`）
- 祈使句和描述句混用
- 语气主观或口语化

**Structural Integrity：**
- 缺失必填 YAML 字段
- 被引用文件不存在
- example 不完整或 script 已损坏

### Grade Benchmarks

**A 档（90-100）**：可作为范本的高质量 skill
- 四个维度基本都在 85+
- description 清晰具体
- progressive disclosure 做得好
- imperative style 一致
- 结构完整且组织良好

**B 档（80-89）**：高质量，但还有少量可改进点
- 大多数维度在 75+
- description 与组织都较好
- 基本遵循最佳实践
- 可能存在轻微风格不一致

**C 档（70-79）**：可接受，但仍需中等强度改进
- 核心区域达到最低标准
- 在组织或风格上存在明显短板
- 功能可用，但不够优秀

**D/F 档（70 以下）**：需要大修
- 多个维度低于 70
- 存在明显结构或风格问题
- 需要系统性返工

## Usage Examples

**Example 1: 分析本地 skill**
```text
User: "Analyze skill quality for ./skills/git-workflow"

[Claude 执行 8 步流程，并生成：]
- quality-report-git-workflow.md
- improvement-plan-git-workflow.md
```

**Example 2: 发布前审查**
```text
User: "Review my new skill before I publish it"

[Claude 会提供：]
- 详细质量评估
- 具体改进建议
- 落地修改后的预期分数
```

**Example 3: 检查已有 skill**
```text
User: "Check skill quality of api-helper"

[Claude 会报告：]
- 当前等级和分数
- 最值得优先修改的点
- 可快速提分的 quick wins
```

**Example 4: Batch portfolio review**
```text
User: "Review all skills in ./skills and tell me what to fix first"

[Claude 会输出：]
- portfolio matrix
- grouped issue clusters
- second-pass remediation shortlist
```
