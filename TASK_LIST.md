# 📋 Project Task List: 3D Interactive Book Animation Component

- [x] [Package Setup] 安装 `react-pageflip` 并验证 TypeScript / Vite 构建兼容性
- [x] [Mock Data] 在 `src/data/mockData.ts` 中丰富书籍的完整 6 页 mock 结构（封面、版权与目录、第一章原文、精美图文插画页、深度思考笔记、封底结语）
- [x] [3D Book Component] 创建 `src/components/Interactive3DBook.tsx`：实现完整的 4 阶段生命周期状态机：
  - **State 1: Shelf View (书架/展台立式姿态)** - 3D 空间竖立、真实书脊厚度与地面接触阴影、支持拖拽检视与旋转
  - **State 2: Transition to Desk (取书移向桌面)** - 平滑 Framer Motion 3D 空间轨道曲线（pull out -> float & center -> rotate & tilt flat onto wooden desk at 15-18deg）
  - **State 3: Interactive Reading (真实卷曲翻页)** - 集成 `HTMLFlipBook` (react-pageflip) 配合 GPU 物理卷曲、角落起翘拖拽翻页、拟真光影渐变阴影与 Web Audio 物理翻书声
  - **State 4: Close & Return to Shelf (合拢并归架)** - 自动翻回封皮、盖合书页并反向平滑轨迹归位回书架
- [x] [Page Integration] 在 `src/App.tsx` 与 `src/pages/BooksPage.tsx` 中无缝接入沉浸式 3D 阅读动画流程
- [x] [UI/UX Review] 激活 `ui-aesthetic-ux-critique` 审查 3D 透视深度、纸质纹理、阴影渐变与交互响应
- [x] [QA & Validation] 运行 `npm run build` 确保 Exit Code 0，完成端到端验证
