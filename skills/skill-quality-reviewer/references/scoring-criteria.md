# Skill 质量评分标准

本文件定义 `skill-quality-reviewer` 用于评估 skill 的主要维度。

## 1. Description Quality（25%）

关注 frontmatter description 是否能正确触发 skill。

主要检查：
- trigger phrases 是否具体
- 是否使用第三人称
- 长度是否合适
- 是否覆盖清晰 use cases

高分 skill 的 description 通常：
- 有 3-5 个以上具体 trigger phrases
- 使用 `This skill should be used when...`
- 长度适中
- 不空泛

## 2. Content Organization（30%）

关注是否遵循 progressive disclosure。

主要检查：
- `SKILL.md` 是否过长
- 细节是否下沉到 `references/`
- examples 是否独立放入 `examples/`
- 结构是否易导航

## 3. Writing Style（20%）

关注是否遵循 skill 写作规范。

主要检查：
- 是否使用 imperative form
- 是否避免第二人称
- 语言是否客观、专业
- 风格是否统一

## 4. Structural Integrity（25%）

关注 skill 的物理结构是否完整、可用。

主要检查：
- YAML frontmatter 是否有效
- `name`、`description` 是否存在
- 目录结构是否合理
- 所有引用文件是否真实存在
- examples 是否完整
- scripts 是否可执行

## 总分计算

```text
Overall Score =
  Description Quality * 0.25 +
  Content Organization * 0.30 +
  Writing Style * 0.20 +
  Structural Integrity * 0.25
```

## 等级映射

| Score Range | Grade | 结论 |
|-------------|-------|------|
| 97-100 | A+ | Exemplary |
| 93-96 | A | Excellent |
| 90-92 | A- | Very Good |
| 87-89 | B+ | Good |
| 83-86 | B | Above Average |
| 80-82 | B- | Solid |
| 77-79 | C+ | Acceptable |
| 73-76 | C | Satisfactory |
| 70-72 | C- | Minimal |
| 67-69 | D+ | Below Standard |
| 63-66 | D | Poor |
| 60-62 | D- | Very Poor |
| 0-59 | F | Fail |

## Certified 门槛

建议共享前至少满足：
- Overall >= 80
- Description Quality >= 75
- Content Organization >= 75
- Writing Style >= 70
- Structural Integrity >= 80

## 快速检查清单

### Description
- [ ] 有具体 trigger phrases
- [ ] 用第三人称
- [ ] 长度适中
- [ ] 说明具体 use cases

### Content Organization
- [ ] `SKILL.md` 不臃肿
- [ ] 细节拆到 `references/`
- [ ] examples 独立
- [ ] 结构清楚

### Writing Style
- [ ] 使用 imperative verbs
- [ ] 没有大量第二人称
- [ ] 语气客观
- [ ] 风格一致

### Structural Integrity
- [ ] YAML 合法
- [ ] 必填字段齐全
- [ ] 引用文件都存在
- [ ] examples / scripts 可用
