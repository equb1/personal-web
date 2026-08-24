# 📋 Project Task List: 3D Interactive Book Animation Component

- [x] [Package Setup] 安装 `react-pageflip` 并验证 TypeScript / Vite 构建兼容性
- [x] [Mock Data] 在 `src/data/mockData.ts` 中丰富书籍的完整 6 页 mock 结构
- [x] [3D Book Component] 创建 `Interactive3DBook.tsx` 生命周期状态机
- [x] [Page Integration] 接入 `App.tsx` 与 `BooksPage.tsx`
- [x] [QA & Validation] `npm run build` Exit Code 0

## 🎯 当前迭代：真实"翻开/合上"封面动画重做
- [x] [CoverRig] 新增闭合书本 3D 骨架组件（双面封面 + 书脊迁移 + fore-edge 厚度 + 动态扫过阴影）
- [x] [StageMachine] 重做状态机：shelf → desk_transition → cover_open → reading → cover_close → returning
- [x] [Crossfade] flipbook 与 cover rig 交叉淡入淡出（避免 opacity 压扁 preserve-3d）
- [x] [Easing] 封面翻开用带轻微 overshoot 的 back-out 缓动，书脊迁移用 ease-in-out
- [x] [QA] `npm run build` 验证 Exit Code 0
