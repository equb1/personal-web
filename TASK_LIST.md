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
- [x] [Sandbox Fixes] 超时熔断防卡死、多语言切换与测试套件文件导出下载

---
## 📚 Feature: 3D 沉浸式虚拟书架与「原文/笔记/双栏结合」多维阅读器
- [x] [Types & Mock] 扩展 `src/types/index.ts` 中的 `Book` 接口支持 `excerpt` 原文精选与章节，并更新 `src/data/mockData.ts` 丰富原文内容
- [x] [3D Bookshelf] 深度重构 `src/pages/BooksPage.tsx`：利用 CSS 3D 透视渲染立体书脊 (Book Spine)、3D 书本翻转与实体层次书架托板
- [x] [Reader Modal] 重构 `src/components/BookDetailModal.tsx`：提供【📖 仅看原文】、【✍️ 仅看笔记】与【🪟 原文+笔记双栏结合对照】3种阅读模式切换
- [x] [UI/UX Review] 参照 `ui-aesthetic-ux-critique` 对 3D 书架质感、双栏排版阅读体验与呼吸感进行审查优化
- [x] [QA & Validation] 运行 `npm run build` 确保 Exit Code 0，并在本地 Git commit (严格禁止 push 到 github)
