# 📋 Project Task List: Personal Web Blog

- [x] [Init] 创建 React + TypeScript + Tailwind CSS + Vite 前端项目基础结构
- [x] [Init] 安装核心依赖并配置 Tailwind CSS 基础样式
- [x] [Components] 打造 Navigation、Glassmorphism Navbar、Footer 与响应式布局容器
- [x] [Page - Home] 开发首页 Hero 区域、特色板块卡片导航与交互动效
- [x] [Page - Learning] 开发“学习”板块：MD 文章列表、多标签分类、Markdown 全功能阅读器
- [x] [Page - Hobbies] 开发“兴趣”板块：视频/摄影展示墙、自定义现代 Video Player 组件、模态框
- [x] [Page - Books] 开发“书籍”板块：3D/立体书柜卡片、阅读状态标签、读书笔记 Markdown 浮层
- [x] [Page - Other] 开发“其他”板块：个人简介、经历 TimeLine 时间轴、技能栈与交互式留言板
- [x] [UI/UX Review] 参照 `ui-aesthetic-ux-critique` Skill 进行全界面审美与交互体验自我审查
- [x] [QA & Validation] 运行 TypeScript 类型检查与 Vite 构建验证
- [x] [Theme Redesign] 去 AI 紫色化，重构为清新翡翠薄荷青 (Emerald & Teal & Mint) 极光主题

---
## 🔍 Feature: 全局 Cmd+K 快捷搜索弹窗 (Command Menu)
- [x] [CommandK] 创建 `src/components/CommandMenu.tsx` 搜索弹窗组件 (支持分类搜索文章、视频、书籍、项目，包含键盘上下键与 Enter 选择导航)
- [x] [CommandK] 在 `src/components/Navbar.tsx` 中增加快捷搜索按钮与 `⌘K` 视觉 Badge 触发器
- [x] [CommandK] 在 `src/App.tsx` 中集成全局 `Cmd+K` / `Ctrl+K` 快捷键监听与模块跨页面协同跳转
- [x] [UI/UX Review] 对 Cmd+K 弹窗的 Glassmorphism 居中视觉、WCAG 对比度、高亮焦点与微交互进行自我审查
- [x] [QA & Validation] 运行 `npm run build` 确保没有任何类型/语法报错 (Exit Code 0)
