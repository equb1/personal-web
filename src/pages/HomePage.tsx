import React from 'react'
import { NavigationTab, Post, HobbyVideo, Book } from '../types'
import { BookOpen, Film, BookmarkCheck, Sparkles, ArrowRight, Code2, Compass, Play, Eye, Calendar, Star } from 'lucide-react'

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void
  onSelectPost: (post: Post) => void
  onSelectVideo: (video: HobbyVideo) => void
  onSelectBook: (book: Book) => void
  posts: Post[]
  videos: HobbyVideo[]
  books: Book[]
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectPost,
  onSelectVideo,
  onSelectBook,
  posts,
  videos,
  books
}) => {
  const sections = [
    {
      id: 'learning' as NavigationTab,
      title: '学习与笔记',
      subtitle: 'Markdown 交互式知识库',
      desc: '沉淀 React 19、Tailwind CSS v4、TypeScript 及 AI Agent 系统设计的前沿思考与实战总结。',
      icon: BookOpen,
      color: 'from-emerald-500/15 to-teal-500/15',
      borderColor: 'hover:border-emerald-500/40',
      badge: '支持 MD 全功能渲染'
    },
    {
      id: 'hobbies' as NavigationTab,
      title: '兴趣与影音',
      subtitle: '4K 视频与流媒体墙',
      desc: '记录城市流光航拍、极简 4K 桌面搭建与指弹吉他 Live，分享生活中的审美灵学。',
      icon: Film,
      color: 'from-teal-500/15 to-cyan-500/15',
      borderColor: 'hover:border-teal-500/40',
      badge: '支持 Video 原生播放'
    },
    {
      id: 'books' as NavigationTab,
      title: '书籍与思考',
      subtitle: '3D 个人虚拟书房',
      desc: '精选计算机底层、UI/UX 认知设计与职业成长书籍，附带深度 Markdown 读书心路。',
      icon: BookmarkCheck,
      color: 'from-sky-500/15 to-blue-500/15',
      borderColor: 'hover:border-sky-500/40',
      badge: '含评分与阅读进度'
    },
    {
      id: 'other' as NavigationTab,
      title: '关于与全栈',
      subtitle: '作品集 & 互动留言',
      desc: '探索个人职业 Timeline 时间轴、开源项目展示及全双工互动留言体验。',
      icon: Sparkles,
      color: 'from-amber-500/15 to-emerald-500/15',
      borderColor: 'hover:border-amber-500/40',
      badge: '个人经历与 Timeline'
    }
  ]

  return (
    <div className="space-y-16 py-6 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-8 sm:p-12 md:p-16 border border-slate-800 shadow-2xl">
        {/* Fresh Aurora Glow Effects (No AI Neon Purple) */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Zenith Fresh Digital Garden</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            探索代码架构、<br />
            <span className="gradient-text">自然美学与文字力量</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            欢迎来到我的个人数字花园。这里采用清新自然的翡翠薄荷配色，集成学习 Markdown 笔记、4K 兴趣视频、3D 电子书架以及个人项目作品。
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => onNavigate('learning')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-semibold text-sm hover:from-emerald-300 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20 flex items-center space-x-2"
            >
              <Code2 className="w-4 h-4" />
              <span>探索学习笔记</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('hobbies')}
              className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-sm transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 text-teal-400" />
              <span>浏览兴趣视频</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Section Navigation Cards (4 Key Hubs) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">核心功能板块导航</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">快速跳转至各主要主题区域</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((sec) => {
            const Icon = sec.icon
            return (
              <div
                key={sec.id}
                onClick={() => onNavigate(sec.id)}
                className={`glass-panel p-6 rounded-2xl border border-slate-800/80 cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group ${sec.borderColor}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sec.color} flex items-center justify-center border border-slate-700/50 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-teal-300" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {sec.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-xs font-medium text-teal-400 mt-0.5">{sec.subtitle}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform">
                  <span>进入板块</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Latest Featured Articles (MD) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-6 rounded-full bg-teal-400" />
            <h2 className="text-2xl font-bold text-slate-100">最新学习笔记 (Markdown)</h2>
          </div>
          <button
            onClick={() => onNavigate('learning')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
          >
            <span>查看全部</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-500/40 cursor-pointer group flex flex-col justify-between transition-all duration-300"
            >
              {post.coverImage && (
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/80 text-teal-300 backdrop-blur-md border border-slate-800">
                    {post.category}
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-100 text-base group-hover:text-teal-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-teal-400" />
                    <span>{post.date}</span>
                  </span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Videos & Books Quick Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Videos Preview */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Film className="w-5 h-5 text-teal-400" />
              <span>精选兴趣视频</span>
            </h3>
            <button
              onClick={() => onNavigate('hobbies')}
              className="text-xs text-teal-400 hover:underline"
            >
              更多视频
            </button>
          </div>

          <div className="space-y-3">
            {videos.slice(0, 2).map((vid) => (
              <div
                key={vid.id}
                onClick={() => onSelectVideo(vid)}
                className="flex items-center space-x-4 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-all group"
              >
                <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={vid.posterUrl} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                    <Play className="w-5 h-5 fill-white text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-teal-300 truncate">
                    {vid.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{vid.description}</p>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono mt-1">
                    <span>{vid.duration}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5">
                      <Eye className="w-3 h-3 text-teal-400" />
                      <span>{vid.views}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Books Preview */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <BookmarkCheck className="w-5 h-5 text-emerald-400" />
              <span>最近在读与笔记</span>
            </h3>
            <button
              onClick={() => onNavigate('books')}
              className="text-xs text-emerald-400 hover:underline"
            >
              查看书房
            </button>
          </div>

          <div className="space-y-3">
            {books.slice(0, 2).map((bk) => (
              <div
                key={bk.id}
                onClick={() => onSelectBook(bk)}
                className="flex items-center space-x-4 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-all group"
              >
                <img
                  src={bk.coverUrl}
                  alt={bk.title}
                  className="w-12 h-16 object-cover rounded-md shadow-md border border-slate-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                    {bk.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">作者：{bk.author}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono">
                      {bk.category}
                    </span>
                    <div className="flex items-center space-x-0.5">
                      {[...Array(bk.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
