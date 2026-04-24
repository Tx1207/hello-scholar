---
name: frontend-design
description: 创建具有辨识度、production-grade 且高设计质量的前端界面。当用户要求构建 web components、pages、artifacts、posters 或 applications 时使用该 skill，例如 websites、landing pages、dashboards、React components、HTML/CSS layouts，或需要 styling / beautifying 任意 web UI 时。生成有创意、精致且避免通用 AI 审美的代码和 UI 设计。
license: Complete terms in LICENSE.txt
version: 0.1.0
---

该 skill 指导创建具有辨识度、production-grade 的前端界面，避免通用 “AI slop” 审美。实现真实可运行代码，并对美学细节和创意选择保持极高关注。

用户会提供前端需求：要构建的 component、page、application 或 interface。用户也可能提供用途、受众或技术约束。

## 设计思考

编码前，先理解上下文并选择一个 **bold** 的美学方向：
- **Purpose**：这个界面解决什么问题？谁使用它？
- **Tone**：选择一种明确极端风格：brutally minimal、maximalist chaos、retro-futuristic、organic/natural、luxury/refined、playful/toy-like、editorial/magazine、brutalist/raw、art deco/geometric、soft/pastel、industrial/utilitarian 等。它们只是灵感，最终设计要忠于你选择的美学方向。
- **Constraints**：技术要求（framework、performance、accessibility）。
- **Differentiation**：是什么让它令人难忘？用户会记住哪一个点？

**CRITICAL**：选择清晰的概念方向并精确执行。大胆的 maximalism 和克制的 refined minimalism 都可以成立，关键是 intentionality，而不是 intensity。

然后实现工作代码（HTML/CSS/JS、React、Vue 等），要求：
- Production-grade 且功能可用
- 视觉上有冲击力且令人记住
- 有清晰审美立场并保持整体一致
- 每个细节都经过精修

## 前端美学指南

重点关注：
- **Typography**：选择美观、独特、有趣的字体。避免 Arial、Inter 等通用字体；优先选择能提升前端美学的、有性格的字体。用 distinctive display font 搭配精致正文字体。
- **Color & Theme**：坚持统一审美。使用 CSS variables 保持一致性。强主色 + 锐利点缀通常比平均分布的胆怯配色更好。
- **Motion**：用 animations 表达效果与 micro-interactions。HTML 优先使用 CSS-only 方案。React 中如可用则使用 Motion library。聚焦高影响力时刻：一次经过编排的 page load 和 staggered reveals（animation-delay）比零散微交互更有惊喜。使用出人意料的 scroll-triggering 和 hover states。
- **Spatial Composition**：使用非预期布局、不对称、重叠、斜向流动、打破网格的元素。可以选择大面积留白，也可以选择受控密度。
- **Backgrounds & Visual Details**：营造氛围和深度，不要默认纯色背景。添加与整体审美匹配的上下文效果和纹理。可使用 gradient meshes、noise textures、geometric patterns、layered transparencies、dramatic shadows、decorative borders、custom cursors 和 grain overlays 等创意形式。

绝不要使用通用 AI 生成审美，例如过度使用的字体族（Inter、Roboto、Arial、system fonts）、陈词滥调配色（尤其白底紫色渐变）、可预测布局和组件模式，以及缺乏上下文个性的 cookie-cutter design。

要创造性解读需求，做出真正为上下文设计的意外选择。不同设计之间不应重复。可在 light/dark themes、不同字体和不同美学之间变化。不要在多次生成中收敛到常见选择（例如 Space Grotesk）。

**IMPORTANT**：让实现复杂度匹配审美愿景。Maximalist designs 需要更丰富的动画和效果代码。Minimalist 或 refined designs 则需要克制、精确，以及对 spacing、typography 和微妙细节的细致把控。优雅来自把愿景执行到位。

记住：Claude 能做出非常有创造力的作品。不要保守，展示当你跳出框架并完全投入一个独特愿景时真正能创造出的东西。
