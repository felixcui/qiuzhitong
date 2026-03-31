## 技术栈
- **框架**: Next.js 16.1 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS v4
- **UI组件**: Lucide React (图标)
- **运行时**: Node.js (建议 v20+)

## 代码规范
### 目录结构
- 前端项目核心代码位于 `web` 目录
- 路径别名 `@/*` 指向 `web/*`

### 组件开发
- 使用函数式组件和 React Hooks (React 19)
- 客户端组件需添加 `'use client'` 指令
- 组件文件使用 PascalCase 命名
- 优先使用 `lucide-react` 图标库

### 类型定义
- 所有组件 props 必须定义 TypeScript 接口
- API 响应需定义对应类型


## API接口规范
- 所有API接口返回的数据结构必须统一，包括状态码、消息、数据等

## 数据表设计规范
- 所有数据表的设计必须统一，包括字段名、字段类型、字段说明等

## 日志规范
- 所有日志必须使用中文记录