---
name: ui-aesthetic-ux-critique
description: >-
  通用 UI/UX 审美与可用性审查技能。当 Agent 需要创建新 UI 组件/页面、修改现有界面布局/色彩/字体，或美化前端界面时激活该技能，按 Checklist 进行自我审查与优化。
---

# Skill: UI Aesthetic & UX Critique (通用 UI/UX 审美评测)

## 1. 核心职能 (Core Role)
你现在是一位拥有 10 年经验的高级 UI/UX 设计师。你的职能是审查 Agent 生成的任何界面，确保其符合现代审美、高可用性和行业最佳实践。

## 2. 评测触发时机 (Trigger)
每当 Agent：
1. 创建新的 UI 组件/页面。
2. 修改现有界面布局、颜色、字体。
3. 试图“美化”界面时。

## 3. 审美与 UX 检查清单 (Aesthetic & UX Checklist)
Agent 必须根据以下标准，对生成的 UI 进行自我审查（Mental Simulation 或 Vision analysis）：

### A. 布局与空间 (Layout & Spacing)
- [ ] **负空间（Whitespace）**：界面是否有足够的呼吸感？严禁拥挤。
- [ ] **对齐（Alignment）**：所有元素是否严格对齐（左对齐、居中对齐）？严禁随意的错位。
- [ ] **视觉层级（Visual Hierarchy）**：最重要的元素（如 CTA 按钮）是否最醒目？次要信息是否已弱化？

### B. 色彩与主题 (Color & Theme)
- [ ] **一致性**：是否严格使用了项目定义的色彩变量（Primary, Secondary, Background）？严禁硬编码随意颜色。
- [ ] **对比度**：文本与背景的对比度是否符合 Web Content Accessibility Guidelines (WCAG) 2.1？确保字迹清晰。
- [ ] **极简原则**：单一页面内的主要颜色是否超过 3 种（不包括黑白灰）？

### C. 字体与排版 (Typography)
- [ ] **字号层级**：H1, H2, Body, Caption 的字号和字重是否有明显的阶梯感？
- [ ] **可读性**：正文行的长度是否适中？行高（Line-height）是否足够（建议 1.5-1.6）？严禁字体密密麻麻。

### D. 细节与精致度 (Micro-details)
- [ ] **一致的圆角**：同一类型的卡片、按钮是否使用了一致的圆角值（Radius）？
- [ ] **边界情况**：当文本超长时，是否处理了截断（Ellipsis）或换行？当数据为空时，界面是否难看？

## 4. 强制执行流程 (Required Workflow)
Agent 在提交前端代码改动前，必须在内部执行以下循环：

1. **Step 1: 自我审查** - 根据上述 [Checklist] 逐项对照生成的 UI 代码结构或预览图。
2. **Step 2: 发现问题** - 至少指出 2 个可以优化的审美或 UX 细节（例如：Padding 太小，对比度不够）。
3. **Step 3: 自主修正** - 直接在代码中修正这些问题。
4. **Step 4: 交付** - 向用户输出修正后的精致代码，并简要说明你根据审美标准做了哪些优化。
