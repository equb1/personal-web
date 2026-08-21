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
- [x] [CommandMenu] 全局 Cmd+K 快捷搜索弹窗与键盘流跳转

---
## 🚀 Feature: 学习文章详情页深度优化 (多类型支持 + 交互选择题 + 在线代码沙箱)
- [x] [Types & Mock] 扩展 `src/types/index.ts` 支持 `type: 'article' | 'quiz' | 'coding'`，并扩充手撕代码题与选择题示例数据 (`src/data/mockData.ts`)
- [x] [Code Sandbox] 开发 `src/components/CodeSandbox.tsx` 交互式代码沙箱容器 (支持代码编辑、Console 实时输出捕获、一键运行 Run、测试用例 Test Cases 验证与官方解法切换)
- [x] [Quiz Component] 开发 `src/components/QuizCard.tsx` 交互式面试选择题组件 (选项点击交互、正误即时判定、解析折叠展开与答题统计)
- [x] [Detail View Upgrade] 深度重构 `src/pages/LearningPage.tsx` 文章详情页：类型指示 Badge、题目快速导航索引、沙箱分屏交互体验
- [x] [UI/UX Review] 参照 `ui-aesthetic-ux-critique` 对沙箱编辑器与答题界面的对比度、状态微动效与排版进行自我审查与优化
- [x] [QA & Validation] 运行 `npm run build` 确保 TypeScript 类型安全与 Vite 构建零报错 (Exit Code 0)
