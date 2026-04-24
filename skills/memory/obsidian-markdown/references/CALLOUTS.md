# Callouts 参考

## 基础 Callout

```markdown
> [!note]
> 这是一个 note callout。

> [!info] 自定义标题
> 这个 callout 使用了自定义标题。

> [!tip] 只有标题
```

## 可折叠 Callout

```markdown
> [!faq]- 默认折叠
> 这段内容在展开前是隐藏的。

> [!faq]+ 默认展开
> 这段内容默认可见，但可以折叠。
```

## 嵌套 Callout

```markdown
> [!question] 外层 callout
> > [!note] 内层 callout
> > 嵌套内容
```

## 支持的 Callout 类型

| Type | Aliases | 颜色 / 图标 |
|------|---------|-------------|
| `note` | - | 蓝色，铅笔 |
| `abstract` | `summary`, `tldr` | 青色，剪贴板 |
| `info` | - | 蓝色，信息 |
| `todo` | - | 蓝色，复选框 |
| `tip` | `hint`, `important` | 青蓝色，火焰 |
| `success` | `check`, `done` | 绿色，对勾 |
| `question` | `help`, `faq` | 黄色，问号 |
| `warning` | `caution`, `attention` | 橙色，警告 |
| `failure` | `fail`, `missing` | 红色，X |
| `danger` | `error` | 红色，闪电 |
| `bug` | - | 红色，虫子 |
| `example` | - | 紫色，列表 |
| `quote` | `cite` | 灰色，引号 |

## 自定义 Callout（CSS）

```css
.callout[data-callout="custom-type"] {
  --callout-color: 255, 0, 0;
  --callout-icon: lucide-alert-circle;
}
```
