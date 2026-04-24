---
name: obsidian-bases
description: 创建和编辑 Obsidian Bases（`.base` 文件），包括 view、filter、formula 和 summary。处理 `.base` 文件、创建类似数据库的笔记视图，或用户提到 Obsidian 中的 Bases、table view、card view、filter、formula 时使用。
---

# Obsidian Bases Skill

## Workflow

1. **Create the file**：在 vault 中创建一个包含合法 YAML 的 `.base` 文件
2. **Define scope**：添加 `filters`，按 tag、folder、property 或日期筛选要展示的笔记
3. **Add formulas**（可选）：在 `formulas` 区块中定义计算属性
4. **Configure views**：添加一个或多个 view（`table`、`cards`、`list`、`map`），并在 `order` 中指定显示属性
5. **Validate**：确认 YAML 合法、无语法错误；检查所有引用的 property 和 formula 都存在。常见问题：包含 YAML 特殊字符的字符串未加引号、formula 中引号不匹配、引用了 `formula.X` 但 `formulas` 中未定义 `X`
6. **Test in Obsidian**：在 Obsidian 中打开 `.base` 文件，确认视图渲染正常。如果出现 YAML error，优先检查下面的 quoting 规则

## Schema

Base 文件使用 `.base` 扩展名，并包含合法 YAML。

```yaml
# Global filters apply to ALL views in the base
filters:
  # Can be a single filter string
  # OR a recursive filter object with and/or/not
  and: []
  or: []
  not: []

# Define formula properties that can be used across all views
formulas:
  formula_name: 'expression'

# Configure display names and settings for properties
properties:
  property_name:
    displayName: "Display Name"
  formula.formula_name:
    displayName: "Formula Display Name"
  file.ext:
    displayName: "Extension"

# Define custom summary formulas
summaries:
  custom_summary_name: 'values.mean().round(3)'

# Define one or more views
views:
  - type: table | cards | list | map
    name: "View Name"
    limit: 10
    groupBy:
      property: property_name
      direction: ASC | DESC
    filters:
      and: []
    order:
      - file.name
      - property_name
      - formula.formula_name
    summaries:
      property_name: Average
```

## Filter Syntax

Filter 用于缩小结果范围，可全局使用，也可按 view 单独配置。

### Filter Structure

```yaml
# Single filter
filters: 'status == "done"'

# AND - all conditions must be true
filters:
  and:
    - 'status == "done"'
    - 'priority > 3'

# OR - any condition can be true
filters:
  or:
    - 'file.hasTag("book")'
    - 'file.hasTag("article")'

# NOT - exclude matching items
filters:
  not:
    - 'file.hasTag("archived")'

# Nested filters
filters:
  or:
    - file.hasTag("tag")
    - and:
        - file.hasTag("book")
        - file.hasLink("Textbook")
    - not:
        - file.hasTag("book")
        - file.inFolder("Required Reading")
```

### Filter Operators

| Operator | Description |
|----------|-------------|
| `==` | 等于 |
| `!=` | 不等于 |
| `>` | 大于 |
| `<` | 小于 |
| `>=` | 大于等于 |
| `<=` | 小于等于 |
| `&&` | 逻辑与 |
| `\|\|` | 逻辑或 |
| <code>!</code> | 逻辑非 |

## Properties

### 三类属性

1. **Note properties** - 来自 frontmatter，如 `note.author` 或直接写 `author`
2. **File properties** - 文件元数据，如 `file.name`、`file.mtime`
3. **Formula properties** - 计算属性，如 `formula.my_formula`

### File Properties Reference

| Property | Type | Description |
|----------|------|-------------|
| `file.name` | String | 文件名 |
| `file.basename` | String | 去掉扩展名的文件名 |
| `file.path` | String | 文件完整路径 |
| `file.folder` | String | 父目录路径 |
| `file.ext` | String | 扩展名 |
| `file.size` | Number | 文件大小（字节） |
| `file.ctime` | Date | 创建时间 |
| `file.mtime` | Date | 修改时间 |
| `file.tags` | List | 文件中的所有标签 |
| `file.links` | List | 内部链接 |
| `file.backlinks` | List | 指向该文件的反向链接 |
| `file.embeds` | List | 笔记中的嵌入 |
| `file.properties` | Object | 所有 frontmatter 属性 |

### The `this` Keyword

- 在主内容区域：指向 base 文件本身
- 在被 embed 时：指向嵌入它的文件
- 在 sidebar 中：指向主内容区当前激活文件

## Formula Syntax

Formula 用于从属性中计算值，定义在 `formulas` 区块。

```yaml
formulas:
  total: "price * quantity"
  status_icon: 'if(done, "✅", "⏳")'
  formatted_price: 'if(price, price.toFixed(2) + " dollars")'
  created: 'file.ctime.format("YYYY-MM-DD")'
  days_old: '(now() - file.ctime).days'
  days_until_due: 'if(due_date, (date(due_date) - today()).days, "")'
```

## Key Functions

最常用的函数如下。完整参考见 [FUNCTIONS_REFERENCE.md](references/FUNCTIONS_REFERENCE.md)。

| Function | Signature | Description |
|----------|-----------|-------------|
| `date()` | `date(string): date` | 把字符串解析为日期（`YYYY-MM-DD HH:mm:ss`） |
| `now()` | `now(): date` | 当前日期时间 |
| `today()` | `today(): date` | 今天日期（时间为 `00:00:00`） |
| `if()` | `if(condition, trueResult, falseResult?)` | 条件分支 |
| `duration()` | `duration(string): duration` | 解析 duration 字符串 |
| `file()` | `file(path): file` | 获取 file object |
| `link()` | `link(path, display?): Link` | 创建链接 |

### Duration Type

两个日期相减得到的是 **Duration**，不是数字。

**可用字段：** `duration.days`、`duration.hours`、`duration.minutes`、`duration.seconds`、`duration.milliseconds`

**重要：** Duration 不能直接使用 `.round()`、`.floor()`、`.ceil()`。必须先取数值字段，再做 number 操作。

```yaml
"(date(due_date) - today()).days"
"(now() - file.ctime).days"
"(date(due_date) - today()).days.round(0)"
```

### Date Arithmetic

```yaml
"now() + \"1 day\""
"today() + \"7d\""
"now() - file.ctime"
"(now() - file.ctime).days"
```

## View Types

### Table View

```yaml
views:
  - type: table
    name: "My Table"
    order:
      - file.name
      - status
      - due_date
    summaries:
      price: Sum
      count: Average
```

### Cards View

```yaml
views:
  - type: cards
    name: "Gallery"
    order:
      - file.name
      - cover_image
      - description
```

### List View

```yaml
views:
  - type: list
    name: "Simple List"
    order:
      - file.name
      - status
```

### Map View

需要 latitude / longitude 属性以及 Maps community plugin。

```yaml
views:
  - type: map
    name: "Locations"
```

## Default Summary Formulas

| Name | Input Type | Description |
|------|------------|-------------|
| `Average` | Number | 平均值 |
| `Min` | Number | 最小值 |
| `Max` | Number | 最大值 |
| `Sum` | Number | 求和 |
| `Range` | Number | `Max - Min` |
| `Median` | Number | 中位数 |
| `Stddev` | Number | 标准差 |
| `Earliest` | Date | 最早日期 |
| `Latest` | Date | 最晚日期 |
| `Range` | Date | `Latest - Earliest` |
| `Checked` | Boolean | `true` 的数量 |
| `Unchecked` | Boolean | `false` 的数量 |
| `Empty` | Any | 空值数量 |
| `Filled` | Any | 非空值数量 |
| `Unique` | Any | 唯一值数量 |

## Complete Examples

### Task Tracker Base

```yaml
filters:
  and:
    - file.hasTag("task")
    - 'file.ext == "md"'

formulas:
  days_until_due: 'if(due, (date(due) - today()).days, "")'
  is_overdue: 'if(due, date(due) < today() && status != "done", false)'
  priority_label: 'if(priority == 1, "🔴 High", if(priority == 2, "🟡 Medium", "🟢 Low"))'

properties:
  status:
    displayName: Status
  formula.days_until_due:
    displayName: "Days Until Due"
  formula.priority_label:
    displayName: Priority

views:
  - type: table
    name: "Active Tasks"
    filters:
      and:
        - 'status != "done"'
    order:
      - file.name
      - status
      - formula.priority_label
      - due
      - formula.days_until_due
    groupBy:
      property: status
      direction: ASC
    summaries:
      formula.days_until_due: Average

  - type: table
    name: "Completed"
    filters:
      and:
        - 'status == "done"'
    order:
      - file.name
      - completed_date
```

### Reading List Base

```yaml
filters:
  or:
    - file.hasTag("book")
    - file.hasTag("article")

formulas:
  reading_time: 'if(pages, (pages * 2).toString() + " min", "")'
  status_icon: 'if(status == "reading", "📖", if(status == "done", "✅", "📚"))'
  year_read: 'if(finished_date, date(finished_date).year, "")'

properties:
  author:
    displayName: Author
  formula.status_icon:
    displayName: ""
  formula.reading_time:
    displayName: "Est. Time"

views:
  - type: cards
    name: "Library"
    order:
      - cover
      - file.name
      - author
      - formula.status_icon
    filters:
      not:
        - 'status == "dropped"'

  - type: table
    name: "Reading List"
    filters:
      and:
        - 'status == "to-read"'
    order:
      - file.name
      - author
      - pages
      - formula.reading_time
```

### Daily Notes Index

```yaml
filters:
  and:
    - file.inFolder("Daily Notes")
    - '/^\d{4}-\d{2}-\d{2}$/.matches(file.basename)'

formulas:
  word_estimate: '(file.size / 5).round(0)'
  day_of_week: 'date(file.basename).format("dddd")'

properties:
  formula.day_of_week:
    displayName: "Day"
  formula.word_estimate:
    displayName: "~Words"

views:
  - type: table
    name: "Recent Notes"
    limit: 30
    order:
      - file.name
      - formula.day_of_week
      - formula.word_estimate
      - file.mtime
```

## Embedding Bases

在 Markdown 中嵌入：

```markdown
![[MyBase.base]]
![[MyBase.base#View Name]]
```

## YAML Quoting Rules

- 包含双引号的 formula 优先使用单引号包裹：`'if(done, "Yes", "No")'`
- 简单字符串可用双引号：`"My View Name"`
- 复杂表达式中的嵌套引号必须正确转义

## Troubleshooting

### YAML Syntax Errors

**特殊字符未加引号**：包含 `:`, `{`, `}`, `[`, `]`, `,`, `&`, `*`, `#`, `?`, `|`, `-`, `<`, `>`, `=`, `!`, `%`, `@`, `` ` `` 的字符串必须加引号。

```yaml
displayName: "Status: Active"
```

**Formula 引号不匹配**：formula 内有双引号时，整体请用单引号包住。

### Common Formula Errors

**Duration 直接当数字用**：日期相减结果不是 number，必须先取 `.days`、`.hours` 等字段。

**缺少 null guard**：某些属性并非所有 note 都有，必须用 `if()` 包裹。

**引用未定义 formula**：凡是 `order` 或 `properties` 中出现 `formula.X`，都必须在 `formulas` 中定义 `X`。

## References

- [Bases Syntax](https://help.obsidian.md/bases/syntax)
- [Functions](https://help.obsidian.md/bases/functions)
- [Views](https://help.obsidian.md/bases/views)
- [Formulas](https://help.obsidian.md/formulas)
- [Complete Functions Reference](references/FUNCTIONS_REFERENCE.md)
