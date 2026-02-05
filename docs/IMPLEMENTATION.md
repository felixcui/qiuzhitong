# 思想理论导航网站 - 实现文档 (Implementation Plan)

## 1. 概述
本项目基于 V1.0 原型设计与 PRD 文档，完成了“思想理论导航”网站的核心功能实现。
采用 **Next.js 14+ (App Router)** 框架构建，配合 **Tailwind CSS v4** 进行样式开发，确保了高性能、SEO 友好及良好的用户体验。

## 2. 技术栈
- **框架**: Next.js 16 (React 19)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4 (配置了自定义主题色 `party-red`, `party-gold`)
- **图标**: Lucide React
- **字体**: Noto Serif SC (标题), Noto Sans SC (正文) - 通过 Google Fonts 引入
- **数据**: JSON 静态数据 (由 `scripts/process_data.js` 生成)

## 3. 目录结构
```bash
/web
  /app
    layout.tsx    # 全局布局 (字体, Metadata)
    page.tsx      # 核心页面逻辑 (侧边栏, 搜索, 网格, 弹窗)
    globals.css   # 全局样式与 Tailwind 主题变量
  /lib
    sites.json    # 网站数据源 (480+ 条目)
  /public         # 静态资源
```

## 4. 功能实现
1.  **数据处理**:
    - 编写了 `scripts/process_data.js` 脚本，将 `data/output_list.txt` (制表符分隔文本) 转换为结构化 JSON 数据。
    - 提取了 480 个网站条目，涵盖 18 个分类。

2.  **界面交互**:
    - **侧边栏导航**: 动态渲染分类列表，支持点击切换，高亮当前选中项。
    - **实时搜索**: 支持按“网站名称”、“描述”、“分类”进行实时关键词检索。
    - **详情弹窗**: 点击卡片弹出右侧抽屉式详情页，展示完整描述、标签及访问按钮。
    - **响应式设计**: 适配桌面端 (侧边栏布局) 与 移动端 (顶部导航 + 折叠菜单)。

3.  **设计风格**:
    - 严格遵循原型图的“简约学术、党政风格”。
    - 定义了 `--party-red` (#DE2910) 等核心色彩变量。

## 5. 后续计划
- **部署**: 可直接部署至 Vercel 或 Netlify。
- **数据维护**: 仅需更新 `web/lib/sites.json` (或重新运行处理脚本) 即可更新内容。
- **SEO优化**: 进一步完善每页的 Meta Tags。

## 6. 运行方式
```bash
cd web
npm install
npm run dev
```
访问 http://localhost:3000 即可预览。
