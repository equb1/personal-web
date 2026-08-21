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
- [x] [Learning Upgrade] 多类型文章详情、面试选择题与基础代码沙箱

---
## ⚡ CodeSandbox Critical Fixes & Enhancements (多语言 + 超时熔断防卡死 + 测试套件文件下载)
- [x] [Timeout Fix] 在 `src/components/CodeSandbox.tsx` 引入 Promise 执行超时熔断机制 (1500ms 超时自动捕获，彻底杜绝默认未完成代码/死循环导致的无限转圈卡死)
- [x] [Multi-Language] 支持多语言切换选择器 (JavaScript / TypeScript / Python 模板与语法高亮标签)
- [x] [Test Suite Export] 增加单元测试用例全屏/抽屉预览，并支持「一键导出/下载为本地测试文件 (.test.js / .test.ts / .test.py)」
- [x] [Types & Mock] 在 `src/types/index.ts` & `src/data/mockData.ts` 补充多语言预设与完整导出文件模版
- [x] [QA & Validation] 运行 `npm run build` 确保 TypeScript 类型安全与 Vite 构建零报错 (Exit Code 0)
