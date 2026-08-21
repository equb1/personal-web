import { Post, HobbyVideo, Book, Project, Comment, TimelineItem } from '../types'

export const SAMPLE_POSTS: Post[] = [
  {
    id: 'react-19-deep-dive',
    title: 'React 19 全面解析与 Server Components 最佳实践',
    summary: '深入探究 React 19 核心特性：Actions、useActionState、useOptimistic 以及在生产环境中的性能调优指南。',
    category: '前端工程',
    date: '2026-08-15',
    readTime: '8 分钟',
    tags: ['React 19', 'TypeScript', 'Server Components', '性能优化'],
    views: 1240,
    likes: 88,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
    content: [
      '# React 19 全面解析与 Server Components 最佳实践',
      '',
      'React 19 带来了许多颠覆性的改进，使得前端与全栈开发的边界变得更加清晰和高效。本文将从架构设计到代码实践，全面解密 React 19 的核心亮点。',
      '',
      '## 1. 核心特性一览',
      '',
      '### 1.1 React Actions',
      '在 React 19 中，官方原生引入了对表单提交和异步操作的内置状态管理机制——**Actions**。通过原生支持 `async` 异步函数过渡，框架会自动为您处理 Loading、Error 以及 Optimistic Updates。',
      '',
      '```tsx',
      'import { useActionState } from "react";',
      '',
      'async function updateName(previousState: string, formData: FormData) {',
      '  const name = formData.get("name") as string;',
      '  const res = await fetch("/api/user", { method: "POST", body: JSON.stringify({ name }) });',
      '  return res.ok ? name : previousState;',
      '}',
      '',
      'function ProfileEditor() {',
      '  const [name, formAction, isPending] = useActionState(updateName, "Anonymous");',
      '',
      '  return (',
      '    <form action={formAction}>',
      '      <input name="name" defaultValue={name} className="px-4 py-2 rounded bg-slate-900 border border-slate-700" />',
      '      <button type="submit" disabled={isPending} className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-500">',
      '        {isPending ? "保存中..." : "保存修改"}',
      '      </button>',
      '    </form>',
      '  );',
      '}',
      '```',
      '',
      '> **重要提示：** 使用 `useActionState` 能够极大简化传统前端中冗长的 `isLoading`、`error` 状态声明。',
      '',
      '### 1.2 乐观更新 (useOptimistic)',
      '在网络延迟较高的环境中，用户体验的核心在于响应速度。`useOptimistic` 允许开发者在服务器响应返回前优先绘制预期 UI：',
      '',
      '```tsx',
      'const [optimisticMessages, addOptimisticMessage] = useOptimistic(',
      '  messages,',
      '  (state, newMessage: string) => [...state, { text: newMessage, sending: true }]',
      ');',
      '```',
      '',
      '---',
      '',
      '## 2. 架构设计与性能优化',
      '',
      '1. **避免不必要的重渲染**：结合 React Compiler，绝大多数 `useMemo` 和 `useCallback` 将成为历史。',
      '2. **资源预加载 (Resource Preloading)**：使用 `prefetchDNS` 和 `preload` API 优化 Critical Rendering Path。',
      '3. **渐进式 HTML 水合**：减少 Hydration 带来的白屏开销。',
      '',
      '> 总结：React 19 不仅提升了开发者体验（DX），更将用户体验（UX）带到了全新的高度。'
    ].join('\n')
  },
  {
    id: 'tailwind-v4-modern-design-system',
    title: 'Tailwind CSS v4 引擎架构重构与设计系统构建',
    summary: '基于 Vite 插件与基于 CSS 的配置机制，探索 Tailwind v4 如何实现 10 倍构建提速与暗黑玻璃拟物风格设计。',
    category: 'CSS & 设计',
    date: '2026-08-02',
    readTime: '6 分钟',
    tags: ['TailwindCSS', 'CSS3', 'Design System', 'Glassmorphism'],
    views: 950,
    likes: 64,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    content: [
      '# Tailwind CSS v4 引擎架构重构与设计系统构建',
      '',
      'Tailwind CSS v4 采用了全新的 **Oxide** 引擎，彻底去除了传统 js 配置文件，改用原生 CSS 变量驱动。',
      '',
      '## 设计系统 Token 规范',
      '',
      '在 Tailwind CSS v4 中，我们可以在 CSS 根文件中直接定义与扩展主题变量：',
      '',
      '```css',
      '@import "tailwindcss";',
      '',
      '@theme {',
      '  --color-brand-primary: #6366f1;',
      '  --color-brand-accent: #a855f7;',
      '  --font-display: "Plus Jakarta Sans", sans-serif;',
      '}',
      '```',
      '',
      '### 玻璃拟物（Glassmorphism）三要素',
      '- **Backdrop Blur**：`backdrop-filter: blur(16px)`',
      '- **Subtle Border**：`border: 1px solid rgba(255, 255, 255, 0.08)`',
      '- **Dynamic Gradient background**：线性渐变混合深色透明蒙版',
      '',
      '通过以上属性，我们可以轻松打造符合现代 Aesthetic 标准的赛博深色主题界面！'
    ].join('\n')
  },
  {
    id: 'ai-agents-system-architecture',
    title: '自主 AI Agent 系统架构与多 Agent 协作范式',
    summary: '分析基于 LLM 的 Agent 任务拆解、Memory 记忆树、Tool Use 工具调用及自愈熔断机制。',
    category: '人工智能',
    date: '2026-07-20',
    readTime: '12 分钟',
    tags: ['AI Agent', 'LLM', 'System Design', 'Autonomous Execution'],
    views: 2100,
    likes: 156,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    content: [
      '# 自主 AI Agent 系统架构与多 Agent 协作范式',
      '',
      '一个成熟的 AI Agent 不仅仅是简单的提示词工程，更是一个包含感知、规划、工具调用与结果自愈的复杂自治系统。',
      '',
      '## 1. 核心架构图解',
      '',
      '- **Planner**：负责长文本分析与 Task List 原子化拆解',
      '- **Executor (Coder)**：依照规范进行增量修改与逻辑编写',
      '- **QA & Evaluator**：运行客观命令与单元测试，捕捉异常并自主重试修复',
      '',
      '```text',
      '[ User Prompt ] ---> [ Planner Agent ] ---> [ TASK_LIST.md ]',
      '                                                    |',
      '                                                    v',
      '[ Evaluator QA ] <--- [ Workspace State ] <--- [ Coder Agent ]',
      '       |                                             ^',
      '       +----------- (Retry/Auto-Fix) ----------------+',
      '```',
      '',
      '## 2. 总结',
      '未来软件开发将全面转向 Pair Programming 与 Agent 调度模型，程序员的角色正在升级为系统设计者与质量把控者。'
    ].join('\n')
  }
]

export const SAMPLE_VIDEOS: HobbyVideo[] = [
  {
    id: 'v1',
    title: '赛博夜色 - 4K 城市流光航拍剪辑',
    description: '使用无人机记录下的科技都市夜景，配合 Ambient Synthwave 音乐，感受极小与极大的视觉冲击。',
    category: 'vlog',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop',
    duration: '0:15',
    date: '2026-08-10',
    views: 3420
  },
  {
    id: 'v2',
    title: '极简工作站 setup 搭建 & 桌面沉浸式 VLOG',
    description: '追求无线化与极简升降桌环境，精心挑选 4K 显示器、机械键盘与隐形线束管理方案。',
    category: 'tech',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
    duration: '0:30',
    date: '2026-07-28',
    views: 5890
  },
  {
    id: 'v3',
    title: '指弹吉他 Live - 《Sunburst》即兴演奏',
    description: '午后阳光下的木吉他单轨录音，尝试将爵士和弦与特殊调弦相结合。',
    category: 'music',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    duration: '0:45',
    date: '2026-06-15',
    views: 2150
  }
]

export const SAMPLE_BOOKS: Book[] = [
  {
    id: 'b1',
    title: '设计心理学 (The Design of Everyday Things)',
    author: '唐·诺曼 (Don Norman)',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
    category: 'UI/UX & 设计',
    rating: 5,
    status: 'completed',
    progress: 100,
    summary: '阐述产品设计的核心原则，剖析示能（Affordance）、意符（Signifier）与反馈机制。',
    tags: ['UX设计', '认知心理学', '产品思维'],
    thoughts: [
      '# 读书笔记：《设计心理学》',
      '',
      '优秀的设计是隐形的。当用户在使用一个工具感到困惑时，责任永远在产品设计师身上，而非用户。',
      '',
      '## 关键收获',
      '- **示能 (Affordance)**：物品所具备的物理属性直接提示了其用法（如凹陷按钮提示点击）。',
      '- **反馈 (Feedback)**：每一次操作必须有明确且即时的视觉/听觉反馈。',
      '- **容错设计**：预判用户的误操作，提供优雅撤销（Undo）机制。'
    ].join('\n')
  },
  {
    id: 'b2',
    title: '深入理解计算机系统 (CSAPP)',
    author: 'Randal E. Bryant',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop',
    category: '计算机底层',
    rating: 5,
    status: 'reading',
    progress: 68,
    summary: '从程序员的视角探索计算机系统，涵盖汇编、内存层级、虚拟内存与并发编程。',
    tags: ['C语言', '操作系统', '体系结构'],
    thoughts: [
      '# 读书笔记：CSAPP 内存层级与 Cache 优化',
      '',
      '内存山（Memory Mountain）完美展示了 L1/L2 Cache 命中的巨大性能优势。代码的书写应当具备极高的**空间局部性**与**时间局部性**。'
    ].join('\n')
  },
  {
    id: 'b3',
    title: '软技能：代码之外的生存指南',
    author: 'John Sonmez',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
    category: '职业发展',
    rating: 4,
    status: 'completed',
    progress: 100,
    summary: '为软件工程师量身定制的个人品牌建立、时间管理与终身学习法则。',
    tags: ['个人成长', '时间管理', '生产力'],
    thoughts: [
      '# 读书笔记：建立开发者个人品牌',
      '',
      '- **持续输出**：将学习过程公开（Learn in Public），通过博客与开源项目建立影响力。',
      '- **番茄工作法**：保持专注与高密度输出。'
    ].join('\n')
  }
]

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Zenith Personal Suite',
    description: '基于 React 19 + TypeScript + Tailwind CSS v4 打造的现代深色极简博客系统。',
    tags: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    githubUrl: 'https://github.com',
    demoUrl: '#',
    icon: 'Sparkles',
    stars: 128
  },
  {
    id: 'p2',
    title: 'Markdown Cyber Reader',
    description: '带有代码高亮、复制、TOC 大纲与响应式排版的全功能 Markdown 渲染引擎。',
    tags: ['Markdown', 'Highlight.js', 'React'],
    githubUrl: 'https://github.com',
    icon: 'BookOpen',
    stars: 89
  },
  {
    id: 'p3',
    title: 'Cyberpunk Soundwave Player',
    description: '支持自定义视频/音频轨道控制、平滑进度条与全屏沉浸式的流媒体播放组件。',
    tags: ['HTML5 Video', 'CSS3', 'Vite'],
    githubUrl: 'https://github.com',
    icon: 'Video',
    stars: 215
  }
]

export const SAMPLE_TIMELINE: TimelineItem[] = [
  {
    year: '2026 - 至今',
    title: '高级前端架构师 & AI 智能体开发者',
    companyOrContext: 'Tech Innovation Lab',
    description: '负责复杂 Web 应用全栈设计、前端性能调优，并探索大模型 Agent 在编码流程中的落地。',
    icon: 'Briefcase'
  },
  {
    year: '2024 - 2025',
    title: '核心 UI/UX 设计工程师',
    companyOrContext: 'Creative Studio',
    description: '主导企业级 Design System 组件库重构，使用 TypeScript 与 Tailwind CSS 提升团队开发效率。',
    icon: 'Layout'
  },
  {
    year: '2022 - 2024',
    title: '全栈开发工程师',
    companyOrContext: 'Personal Projects & Open Source',
    description: '发布多个开源 Markdown 引擎与现代 UI 组件库，累计获星 1000+。',
    icon: 'Code'
  }
]

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'Alex (前端开发者)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    content: '博客的界面审美太赞了！深色玻璃质感和动效非常流畅，支持 MD 和视频播放的功能也很实用。',
    date: '2026-08-20 14:22',
    likes: 12
  },
  {
    id: 'c2',
    author: 'Sarah (UI设计师)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    content: '排版和负空间处理得很舒服，尤其是书籍板块的 3D 卡片和笔记浮层，细节满满！',
    date: '2026-08-18 09:15',
    likes: 8
  }
]
