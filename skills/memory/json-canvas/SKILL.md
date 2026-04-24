---
name: json-canvas
description: 创建和编辑 JSON Canvas 文件（`.canvas`），包含 node、edge、group 和 connection。处理 `.canvas` 文件、创建可视化 canvas、mind map、flowchart，或用户提到 Obsidian 中的 Canvas 文件时使用。
---

# JSON Canvas Skill

## File Structure

一个 canvas 文件（`.canvas`）遵循 [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/)，包含两个顶层数组：

```json
{
  "nodes": [],
  "edges": []
}
```

- `nodes`（可选）：node object 数组
- `edges`（可选）：连接 node 的 edge object 数组

## Common Workflows

### 1. Create a New Canvas

1. 创建 `.canvas` 文件，并写入基础结构 `{"nodes": [], "edges": []}`
2. 为每个 node 生成唯一的 16 位十六进制 ID，例如 `"6f0ad84f44ce9c17"`
3. 添加 node，并填写必要字段：`id`、`type`、`x`、`y`、`width`、`height`
4. 添加 edge，并通过 `fromNode` 和 `toNode` 引用合法 node ID
5. **Validate**：解析 JSON，确认语法合法；同时检查所有 `fromNode` / `toNode` 都存在于 `nodes` 数组中

### 2. Add a Node to an Existing Canvas

1. 读取并解析现有 `.canvas` 文件
2. 生成不会与现有 node 或 edge ID 冲突的新 ID
3. 选择不会与现有 node 重叠的位置（建议保留 50-100px 间距）
4. 将新 node object 追加到 `nodes` 数组
5. 需要时添加将新 node 与已有 node 连接的 edge
6. **Validate**：确认所有 ID 唯一，且所有 edge 引用都能解析到现有 node

### 3. Connect Two Nodes

1. 确定源 node 和目标 node 的 ID
2. 生成唯一 edge ID
3. 将 `fromNode` 和 `toNode` 设为源和目标 ID
4. 可选设置 `fromSide` / `toSide`（`top`、`right`、`bottom`、`left`）作为锚点
5. 可选设置 `label`，作为 edge 上的说明文字
6. 将 edge 追加到 `edges` 数组
7. **Validate**：确认 `fromNode` 和 `toNode` 都指向真实存在的 node ID

### 4. Edit an Existing Canvas

1. 以 JSON 形式读取并解析 `.canvas` 文件
2. 按 `id` 找到目标 node 或 edge
3. 修改需要变更的属性（text、position、color 等）
4. 将更新后的 JSON 写回文件
5. **Validate**：编辑后重新检查 ID 唯一性和 edge 引用完整性

## Nodes

Node 是放置在 canvas 上的对象。数组顺序决定 z-index：第一个 node 位于底层，最后一个 node 位于顶层。

### Generic Node Attributes

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| `id` | Yes | string | 唯一的 16 位十六进制标识符 |
| `type` | Yes | string | `text`、`file`、`link` 或 `group` |
| `x` | Yes | integer | X 坐标（像素） |
| `y` | Yes | integer | Y 坐标（像素） |
| `width` | Yes | integer | 宽度（像素） |
| `height` | Yes | integer | 高度（像素） |
| `color` | No | canvasColor | 预设 `"1"`-`"6"` 或 hex 值（如 `"#FF0000"`） |

### Text Nodes

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| `text` | Yes | string | 支持 Markdown 语法的纯文本 |

```json
{
  "id": "6f0ad84f44ce9c17",
  "type": "text",
  "x": 0,
  "y": 0,
  "width": 400,
  "height": 200,
  "text": "# Hello World\n\nThis is **Markdown** content."
}
```

**换行陷阱**：JSON 字符串中的换行必须使用 `\n`。**不要**写成字面量 `\\n`，否则 Obsidian 会把它渲染成字符 `\` 和 `n`。

### File Nodes

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| `file` | Yes | string | 系统内文件路径 |
| `subpath` | No | string | 指向标题或块的链接（以 `#` 开头） |

```json
{
  "id": "a1b2c3d4e5f67890",
  "type": "file",
  "x": 500,
  "y": 0,
  "width": 400,
  "height": 300,
  "file": "Attachments/diagram.png"
}
```

### Link Nodes

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| `url` | Yes | string | 外部 URL |

```json
{
  "id": "c3d4e5f678901234",
  "type": "link",
  "x": 1000,
  "y": 0,
  "width": 400,
  "height": 200,
  "url": "https://obsidian.md"
}
```

### Group Nodes

Group 是用于组织其他 node 的视觉容器。子 node 应放在 group 边界内部。

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| `label` | No | string | group 的文本标签 |
| `background` | No | string | 背景图片路径 |
| `backgroundStyle` | No | string | `cover`、`ratio` 或 `repeat` |

```json
{
  "id": "d4e5f6789012345a",
  "type": "group",
  "x": -50,
  "y": -50,
  "width": 1000,
  "height": 600,
  "label": "Project Overview",
  "color": "4"
}
```

## Edges

Edge 通过 `fromNode` 和 `toNode` ID 连接 node。

| Attribute | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `id` | Yes | string | - | 唯一标识符 |
| `fromNode` | Yes | string | - | 源 node ID |
| `fromSide` | No | string | - | `top`、`right`、`bottom` 或 `left` |
| `fromEnd` | No | string | `none` | `none` 或 `arrow` |
| `toNode` | Yes | string | - | 目标 node ID |
| `toSide` | No | string | - | `top`、`right`、`bottom` 或 `left` |
| `toEnd` | No | string | `arrow` | `none` 或 `arrow` |
| `color` | No | canvasColor | - | 线条颜色 |
| `label` | No | string | - | 文本标签 |

```json
{
  "id": "0123456789abcdef",
  "fromNode": "6f0ad84f44ce9c17",
  "fromSide": "right",
  "toNode": "a1b2c3d4e5f67890",
  "toSide": "left",
  "toEnd": "arrow",
  "label": "leads to"
}
```

## Colors

`canvasColor` 类型接受 hex 字符串或预设数字：

| Preset | Color |
|--------|-------|
| `"1"` | Red |
| `"2"` | Orange |
| `"3"` | Yellow |
| `"4"` | Green |
| `"5"` | Cyan |
| `"6"` | Purple |

预设色的具体值是故意未定义的，不同应用可以使用自己的品牌色。

## ID Generation

生成 16 位小写十六进制字符串（64-bit 随机值）：

```text
"6f0ad84f44ce9c17"
"a3b2c1d0e9f8a7b6"
```

## Layout Guidelines

- 坐标可以为负值（canvas 是无限延展的）
- `x` 向右增大，`y` 向下增大；定位点是左上角
- node 之间保持 50-100px 间距；group 内建议保留 20-50px 内边距
- 尽量对齐到网格（10 或 20 的倍数），布局会更整洁

| Node Type | Suggested Width | Suggested Height |
|-----------|-----------------|------------------|
| Small text | 200-300 | 80-150 |
| Medium text | 300-450 | 150-300 |
| Large text | 400-600 | 300-500 |
| File preview | 300-500 | 200-400 |
| Link preview | 250-400 | 100-200 |

## Validation Checklist

创建或编辑 canvas 文件后，检查：

1. 所有 `id` 在 node 和 edge 中都唯一
2. 每个 `fromNode` 和 `toNode` 都指向真实存在的 node ID
3. 每种 node 类型所需字段都存在（如 text node 要有 `text`，file node 要有 `file`，link node 要有 `url`）
4. `type` 必须是 `text`、`file`、`link`、`group` 之一
5. `fromSide` / `toSide` 只能是 `top`、`right`、`bottom`、`left`
6. `fromEnd` / `toEnd` 只能是 `none`、`arrow`
7. 颜色预设必须是 `"1"` 到 `"6"`，或合法 hex（如 `"#FF0000"`）
8. JSON 语法合法且可解析

如果校验失败，优先检查：重复 ID、悬空 edge 引用、格式错误的 JSON 字符串（尤其是 text 内容中未转义的换行）。

## Complete Examples

完整 canvas 示例见 [references/EXAMPLES.md](references/EXAMPLES.md)，包括 mind map、project board、research canvas 和 flowchart。

## References

- [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/)
- [JSON Canvas GitHub](https://github.com/obsidianmd/jsoncanvas)
