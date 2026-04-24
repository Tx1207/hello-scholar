---
name: ui-ux-pro-max
description: 当用户要求设计或评审 UI、创建 landing page 或 dashboard、选择颜色或 typography、改善 accessibility，或实现带清晰设计系统的精致前端界面时使用该 skill。
version: 0.2.0
---

# UI/UX Pro Max

使用该 skill，将模糊的 UI 请求转化为 **具体的 design system + 实施指导**。

## 角色

该 skill 适用于：
- design-system 选择
- palette 和 typography 选择
- UX review 与修复建议
- 结合技术栈的 frontend implementation guidance
- 用于多页面工作的轻量 design-system 持久化

它**不是** product strategy 或 user research 的替代品。应在产品方向已经大致明确后，使用它把执行做得更锋利。

## 核心工作流

### 1. 先推断请求形态

先提取最小设计信号：
- product type
- industry
- style keywords
- target platform
- implementation stack

如果用户没有指定 stack，默认使用 `html-tailwind`。

### 2. 先生成 design system

使用 helper script 生成紧凑型设计建议：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-pro-max/scripts/search.py" "<product_type> <industry> <keywords>" --design-system -p "Project Name"
```

这会产出：
- 推荐 style direction
- palette family
- typography direction
- interaction / visual effects
- landing 或 layout 偏向
- 需要避免的 anti-patterns

如果工作跨多个回合或多个页面，持久化该 design system：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-pro-max/scripts/search.py" "<query>" --design-system --persist -p "Project Name"
python3 "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-pro-max/scripts/search.py" "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

这会创建：
- `design-system/MASTER.md`
- 可选的页面级覆盖说明，位于 `design-system/pages/`

### 3. 仅在需要时拉取针对性指导

不要一次性加载所有内容，而是做 focused search：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-pro-max/scripts/search.py" "glassmorphism dark" --domain style
python3 "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-pro-max/scripts/search.py" "animation accessibility" --domain ux
python3 "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-pro-max/scripts/search.py" "real-time dashboard" --domain chart
python3 "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-pro-max/scripts/search.py" "elegant luxury serif" --domain typography
```

支持的 domains：
- `product`
- `style`
- `color`
- `typography`
- `landing`
- `chart`
- `ux`

### 4. 编码前补足 stack-specific guidance

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/ui-ux-pro-max/scripts/search.py" "forms table responsive" --stack html-tailwind
```

支持的 stacks：
- `html-tailwind`
- `react`
- `nextjs`
- `vue`
- `svelte`
- `swiftui`
- `react-native`
- `flutter`
- `shadcn`
- `jetpack-compose`

### 5. 实现前先做综合

在收集到 design system 后，将其转化为：
- layout structure
- component rules
- visual tokens
- interaction rules
- accessibility constraints
- 面向选定 stack 的 implementation notes

不要把原始 search 输出直接塞进最终答案。要把它综合成一个连贯的设计方向。

## 默认输出形态

一个好的回答通常应包含：
1. product 和 UI framing
2. 推荐的 style system
3. palette 和 typography
4. component 与 layout rules
5. accessibility 和 interaction checks
6. stack-aware implementation notes

## 安全规则

- 不要在未连接 product type 的前提下硬套某种 design language。
- 不要把 emoji 当作主要 UI iconography。
- 不要为了视觉炫技而削弱文本对比度。
- 不要在 hover 时让交互卡片缩放到破坏布局稳定性。
- 不要使用违反 `prefers-reduced-motion` 的动画。
- 不要虚构不存在的 helper scripts 或 datasets；只使用 bundled `search.py` 和 `data/ui-reasoning.csv`。

## References

按需加载：
- `references/USAGE.md` - 推荐命令模式与检索流程
- `data/ui-reasoning.csv` - helper script 使用的紧凑型 product-to-design heuristics
- `scripts/search.py` - 用于 design-system、domain 和 stack 查找的确定性 helper
