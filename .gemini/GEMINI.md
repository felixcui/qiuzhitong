## 开发流程

1. **开发前设计** - 理解需求，做好技术实现方案设计
2. **代码开发** - 遵循项目代码规范进行开发
3. **类型检查** - 完成代码更改后必须运行 `npm run build`, `npm run lint` 确保无类型错误
4. **功能验证** - 请完成代码后进行功能验证
5. **文档更新** - 完成功能后,必须生成总结文档(文件名格式：YYYYMMDD_功能名称.md),放到 docs/features 目录下, 并同步更新project 下面的 PRD.md, IMPLEMENTATION.md 等项目文档中, 体现项目变更。

## 项目文档
- docs/project/PRD.md (产品需求文档)
- docs/project/IMPLEMENTATION.md (技术实现文档 / 实施文档)
- docs/features/DESIGN_REPORT.md (设计报告)
- docs/features/UI_UX_OPTIMIZATION_SUMMARY.md (UI/UX 优化总结)

## 开发命令
> 注意：以下命令需在 `web` 目录下执行

```bash
cd web

# 开发服务器
npm run dev

# 生产构建（包含类型检查）
npm run build

# 代码检查和自动修复
npm run lint

# 启动生产服务
npm run start
```

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

## UI设计规范
- 使用 TailwindCSS v4 工具类
- 遵循 `docs/features/UI_UX_OPTIMIZATION_SUMMARY.md` 中的设计规范

## API接口规范
- 所有API接口返回的数据结构必须统一，包括状态码、消息、数据等

## 数据表设计规范
- 所有数据表的设计必须统一，包括字段名、字段类型、字段说明等

## 日志规范
- 所有日志必须使用中文记录
