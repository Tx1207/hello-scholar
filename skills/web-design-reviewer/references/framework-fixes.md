# 各框架修复指南

本文档说明不同框架和样式方案下的具体修复方式。

---

## Pure CSS / SCSS

### 修复布局溢出

```css
/* 修改前：发生溢出 */
.container {
  width: 100%;
}

/* 修改后：控制溢出 */
.container {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
```

### 防止文本裁切

```css
/* 单行截断 */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行截断 */
.text-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自动换词 */
.text-wrap {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
```

### 统一间距

```css
/* 用 CSS 自定义属性统一间距 */
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
```

### 提升对比度

```css
/* 修改前：对比度不足 */
.text {
  color: #999999;
  background-color: #ffffff;
}

/* 修改后：满足 WCAG AA 标准 */
.text {
  color: #595959; /* 对比度约 7:1 */
  background-color: #ffffff;
}
```

---

## Tailwind CSS

### 布局修复

```jsx
{/* 修改前：溢出 */}
<div className="w-full">
  <img src="..." />
</div>

{/* 修改后：控制溢出 */}
<div className="w-full max-w-full overflow-hidden">
  <img src="..." className="w-full h-auto object-contain" />
</div>
```

### 防止文本裁切

```jsx
{/* 单行截断 */}
<p className="truncate">Long text...</p>

{/* 多行截断 */}
<p className="line-clamp-3">Long text...</p>

{/* 允许换行 */}
<p className="break-words">Long text...</p>
```

### 响应式支持

```jsx
{/* Mobile-first 响应式写法 */}
<div className="
  flex flex-col gap-4
  md:flex-row md:gap-6
  lg:gap-8
">
  <div className="w-full md:w-1/2 lg:w-1/3">
    内容
  </div>
</div>
```

### 统一间距（Tailwind Config）

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
}
```

### 无障碍改进

```jsx
{/* 添加焦点态 */}
<button className="
  bg-blue-500 text-white
  hover:bg-blue-600
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
">
  按钮
</button>

{/* 提升对比度 */}
<p className="text-gray-700 bg-white"> {/* 从 text-gray-500 调整而来 */}
  可读文本
</p>
```

---

## React + CSS Modules

### 在模块作用域内修复

```css
/* Component.module.css */

/* 修改前 */
.container {
  display: flex;
}

/* 修改后：增加溢出控制 */
.container {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  max-width: 100%;
}
```

### 组件侧修复

```jsx
// Component.jsx
import styles from './Component.module.css';

// 修改前
<div className={styles.container}>

// 修改后：增加条件类名
<div className={`${styles.container} ${isOverflow ? styles.overflow : ''}`}>
```

---

## styled-components / Emotion

### 样式修复

```jsx
// 修改前
const Container = styled.div`
  width: 100%;
`;

// 修改后
const Container = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
```

### 响应式支持

```jsx
const Card = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;
```

### 与主题保持一致

```jsx
// theme.js
export const theme = {
  colors: {
    primary: '#2563eb',
    text: '#1f2937',
    textLight: '#4b5563', // 提升对比度
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  },
};

// 用法
const Text = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
```

---

## Vue (Scoped Styles)

### 修复 scoped 样式

```vue
<template>
  <div class="container">
    <p class="text">内容</p>
  </div>
</template>

<style scoped>
/* 仅作用于当前组件 */
.container {
  max-width: 100%;
  overflow: hidden;
}

.text {
  /* 修复：提升对比度 */
  color: #374151; /* 原来是 #9ca3af */
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}
</style>
```

### 深层选择器（影响子组件）

```vue
<style scoped>
/* 覆盖子组件样式（谨慎使用） */
:deep(.child-class) {
  margin-bottom: 1rem;
}
</style>
```

---

## Next.js / App Router

### 全局样式修复

```css
/* app/globals.css */
:root {
  --foreground: #171717;
  --background: #ffffff;
}

/* 防止布局溢出 */
html, body {
  max-width: 100vw;
  overflow-x: hidden;
}

/* 防止图片溢出 */
img {
  max-width: 100%;
  height: auto;
}
```

### 在布局组件中修复

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50">
          {/* 页头 */}
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <footer>
          {/* 页脚 */}
        </footer>
      </body>
    </html>
  );
}
```

---

## 常见模式

### 修复 Flexbox 布局问题

```css
/* 修改前：元素溢出 */
.flex-container {
  display: flex;
  gap: 1rem;
}

/* 修改后：换行并控制尺寸 */
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.flex-item {
  flex: 1 1 300px; /* grow, shrink, basis */
  min-width: 0; /* 防止 Flexbox 溢出 */
}
```

### 修复 Grid 布局问题

```css
/* 修改前：列数固定 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

/* 修改后：自动调整 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

### 统一管理 z-index

```css
/* 系统化管理 z-index */
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-tooltip: 500;
}

.modal {
  z-index: var(--z-modal);
}
```

### 添加焦点态

```css
/* 为所有交互元素添加焦点态 */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* 自定义 focus ring */
.custom-focus:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
}
```

---

## 调试技巧

### 可视化元素边界

```css
/* 仅在开发阶段使用 */
* {
  outline: 1px solid red !important;
}
```

### 检测溢出

```javascript
// 在控制台运行，用于检测溢出元素
document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > el.clientWidth) {
    console.log('横向溢出:', el);
  }
  if (el.scrollHeight > el.clientHeight) {
    console.log('纵向溢出:', el);
  }
});
```

### 检查对比度

```javascript
// 使用 Chrome DevTools Lighthouse 或 axe DevTools
// 也可在下面的网站检查：
// https://webaim.org/resources/contrastchecker/
```
