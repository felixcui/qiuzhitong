# UI 设计规范

> 本规范基于项目实际代码（`web/app/globals.css`、`web/app/page.tsx`）提炼，开发时必须遵守。

---

## 技术基础

- 样式框架：TailwindCSS v4（通过 `@import "tailwindcss"` 引入）
- 自定义变量通过 `@theme inline` 注册为 Tailwind 工具类
- 所有颜色/阴影/字体**必须优先使用 CSS 变量**，避免硬编码色值

---

## 色彩系统

### 主色调

| 变量 | 值 | 用途 |
| :--- | :--- | :--- |
| `--party-red` | `#C8190C` | 主色：CTA 按钮、活跃指示、Logo |
| `--party-red-hover` | `#A31409` | 按钮悬停态 |
| `--party-red-deep` | `#8B1007` | 深红（强调、深色阴影） |
| `--party-red-soft` | `#FEF2F2` | 浅红背景（图标容器、hover 背景） |

### 辅助色

| 变量 | 值 | 用途 |
| :--- | :--- | :--- |
| `--party-gold` | `#C9861C` | 金色辅助（徽章、强调） |
| `--party-gold-soft` | `#FDF8EF` | 金色浅背景 |

### 中性色 / 背景

| 变量 | 值 | 用途 |
| :--- | :--- | :--- |
| `--background` | `#F8F5F0` | 页面背景（暖米白） |
| `--foreground` | `#111827` | 主文字色 |
| `--surface-primary` | `#FFFFFF` | 白色浮层（卡片、弹窗） |
| `--surface-secondary` | `#F8F5F0` | 次级区域背景 |
| `--border-color` | `#E8E3DC` | 常规边框 |
| `--border-subtle` | `#F0EBE4` | 微弱边框（内分隔线） |
| `--text-secondary` | `#6B7280` | 辅助文字 |
| `--text-muted` | `#9CA3AF` | 弱化文字（描述、时间戳） |

### Tailwind 类名对应

- `text-party-red` / `bg-party-red` / `border-party-red`
- `text-party-red-soft` / `bg-party-red-soft`
- `bg-[#F8F5F0]`、`border-[#E8E3DC]`（内联值用暖棕调色板）

---

## 背景系统

页面默认背景为暖米白 + 超细点阵纹理：

```css
background-color: #F8F5F0;
background-image: radial-gradient(circle, rgba(180, 140, 100, 0.08) 1px, transparent 1px);
background-size: 28px 28px;
```

- 点阵颜色极淡（8% 透明度），营造纸感而不喧宾夺主
- `prefers-reduced-motion` 时自动关闭纹理（已在 CSS 中处理）

---

## 字体系统

### 字体变量

| 变量 | 字体栈 | 用途 |
| :--- | :--- | :--- |
| `--font-serif` | Noto Serif SC → Songti SC → STSong → serif | 标题、品牌文字、强调段落 |
| `--font-sans` | Noto Sans SC → PingFang SC → Microsoft YaHei → sans-serif | 正文、UI 标签、按钮 |

### Tailwind 类名

- `font-serif` → 使用 `--font-serif`
- `font-sans` → 使用 `--font-sans`（默认 body 字体）

### 规范

- 标题（h1/h2/h3）、品牌名称、Modal 内重要文字 → 用 `font-serif`
- 按钮、导航、标签、描述文字 → 用 `font-sans`（默认，无需额外声明）

---

## 阴影系统

| 变量 | 值 | 用途 |
| :--- | :--- | :--- |
| `--shadow-soft` | `0 2px 8px -2px rgba(0,0,0,0.06)` | 轻微浮起 |
| `--shadow-card` | `0 1px 3px 0 rgba(0,0,0,0.04), ...` | 默认卡片阴影 |
| `--shadow-card-hover` | `0 12px 40px -8px rgba(200,25,12,0.14), ...` | 卡片悬停（含红色辉光） |
| `--shadow-float` | `0 20px 25px -5px rgba(0,0,0,0.12), ...` | 弹窗、浮层 |
| `--shadow-sidebar` | `inset -1px 0 0 rgba(0,0,0,0.04)` | 侧边栏右边框内阴影 |

Tailwind 用法：`shadow-card`、`shadow-card-hover`、`shadow-float`

---

## 圆角规范

| 场景 | 值 | Tailwind 类 |
| :--- | :--- | :--- |
| 卡片、弹窗 | 12px | `rounded-xl` |
| 小型按钮、图标容器 | 8px | `rounded-lg` |
| Logo、重要图标 | 12px | `rounded-xl` |
| 搜索框 | 16px | `rounded-2xl` |
| 弹窗 | 16px | `rounded-2xl` |
| Pill badge / 小标签 | 全圆 | `rounded-full` |

---

## 动画规范

### 全局曲线

```css
cubic-bezier(0.16, 1, 0.3, 1)  /* 弹性出入，推荐用于所有 UI 动效 */
```

### 预定义动画类

| 类名 | 时长 | 用途 |
| :--- | :--- | :--- |
| `animate-fade-in-up` | 0.5s | 内容区块淡入（列表、搜索结果） |
| `animate-scale-in` | 0.35s | 弹窗/Modal 弹出 |
| `animate-shimmer` | 2s 循环 | 骨架屏占位闪烁 |

### 交互 transition

- 常规 hover/color 变化：`transition-all duration-200 ease-out`
- 阴影/边框变化：`transition-shadow duration-300`
- 图标/小元素位移：`transition-transform duration-200`

---

## 组件规范

### 卡片（SiteCard）

```
bg-white rounded-xl p-5
border border-[#EDE8E1]
shadow-card hover:shadow-card-hover
hover:-translate-y-1.5
transition-all duration-200 ease-out
```

- 悬停时左侧出现红色渐变竖线（`w-0.5 h-12`，`opacity-0 → opacity-100`）
- 悬停时右上角显示第一个 tag badge（`opacity-0 → opacity-100`）
- 图标容器：`w-10 h-10 rounded-lg bg-gray-50 border border-gray-100`，悬停变红色背景+边框

### 侧边栏导航项（SidebarItem）

- 活跃态：`bg-red-50/60 text-party-red font-semibold`
- 活跃指示：左侧 `w-1 h-5` 渐变竖线（`from-party-red to-party-red/40`）
- 每项右侧显示分类资源计数 badge：活跃时 `bg-party-red/10 text-party-red`，非活跃时 `bg-gray-100 text-gray-400`

### 分类标题（CategorySection Header）

```tsx
<div className="w-1 h-7 bg-gradient-to-b from-party-red to-party-red/30 rounded-full" />
<h2 className="font-serif font-bold text-xl tracking-tight" />
<span className="bg-[#F0EBE4] text-gray-400 text-xs px-2 py-0.5 rounded-full" />  {/* 数量 badge */}
<div className="h-px flex-1 bg-gradient-to-r from-[#EDE8E1] to-transparent" />   {/* 渐变分割线 */}
```

### 搜索框（SearchBar）

- 引擎切换：Segmented Control 风格，外层 `bg-white/70 backdrop-blur-sm border border-[#EDE8E1] rounded-lg p-1`
- 搜索框 focus 三层效果：`focus-within:border-party-red/25 focus-within:ring-4 focus-within:ring-party-red/[0.07] focus-within:shadow-[0_0_0_1px_rgba(200,25,12,0.15),...]`

### 按钮

| 类型 | 样式 |
| :--- | :--- |
| 主要 CTA | `bg-party-red text-white rounded-xl hover:bg-party-red-hover shadow-sm` |
| 次要 | `bg-gray-900 text-white rounded-lg hover:bg-gray-800` |
| 文字按钮 | `text-gray-500 hover:text-gray-900 hover:bg-[#F0EBE4] rounded-lg` |

### 弹窗（Modal）

- 遮罩：`bg-gray-900/25 backdrop-blur-sm`
- 弹窗容器：`bg-white rounded-2xl shadow-float border border-[#EDE8E1]`
- 顶部装饰条（DetailModal）：`h-1 bg-gradient-to-r from-party-red via-party-red to-party-red/60`
- 入场动画：`animate-scale-in`

---

## 无障碍规范（必须遵守）

- 所有可点击元素必须有 `aria-label`
- 键盘交互：`onKeyDown` 处理 `Enter`/`Space`，tabIndex 合理设置
- 焦点样式：`focus-visible:ring-2 focus-visible:ring-party-red focus-visible:ring-offset-2`
- 全局 `:focus-visible` 已定义（`outline: 2px solid var(--party-red)`）
- 装饰性元素加 `aria-hidden="true"`
- 遵循 WCAG 2.1 AA，`prefers-reduced-motion` 已全局处理

---

## 毛玻璃效果（Glassmorphism）

Header 和侧边栏使用毛玻璃：

```css
bg-white/85 backdrop-blur-md     /* Header */
bg-white/60 backdrop-blur-sm     /* Sidebar */
```

`prefers-reduced-motion` 下自动降级为纯白背景（已在 CSS 中处理）。

---

## 禁止事项

- ❌ 不得使用 `bg-white` 作为页面背景（应使用 `bg-[#F8F5F0]` 或 CSS 变量）
- ❌ 不得硬编码不在色彩系统内的颜色（如 `#DE2910`、`#F9FAFB`）
- ❌ 不得使用 `border-gray-100`、`border-gray-200` 作为卡片边框（应使用 `border-[#EDE8E1]`）
- ❌ 不得在主要 UI 上省略悬停/焦点状态
- ❌ 不得跳过 `focus-visible` 样式
