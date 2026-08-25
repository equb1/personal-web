import React, { useState } from 'react'
import { Post, PostType } from '../types'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { CodeSandbox } from '../components/CodeSandbox'
import { QuizCard } from '../components/QuizCard'
import { Search, Calendar, Eye, ThumbsUp, ArrowLeft, BookOpen, Clock, Code2, HelpCircle, FileText, CheckCircle2 } from 'lucide-react'
import { toAbsolute } from '../utils/url'

interface LearningPageProps {
  posts: Post[]
  selectedPost: Post | null
  setSelectedPost: (post: Post | null) => void
}

export const LearningPage: React.FC<LearningPageProps> = ({
  posts,
  selectedPost,
  setSelectedPost
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [liked, setLiked] = useState(false)

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesType = selectedType === 'all' || post.type === selectedType || (!post.type && selectedType === 'article')

    return matchesSearch && matchesCategory && matchesType
  })

  // Active Reading / Interactive Practice View
  if (selectedPost) {
    const postType: PostType = selectedPost.type || 'article'

    return (
      <div className="max-w-5xl mx-auto space-y-8 py-6 animate-fade-in">
        {/* Navigation / Back Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-white transition-all text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-teal-400" />
            <span>返回学习列表</span>
          </button>

          <div className="flex items-center space-x-2">
            {postType === 'coding' && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>手撕代码沙箱实战</span>
              </span>
            )}
            {postType === 'quiz' && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>交互式面试真题集</span>
              </span>
            )}
            {postType === 'article' && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>技术深度长文</span>
              </span>
            )}
          </div>
        </div>

        {/* Article Header Container */}
        <header className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              {selectedPost.category}
            </span>
            {selectedPost.tags.map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-400">
                #{t}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
            {selectedPost.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-4 border-t border-slate-800/80 gap-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>{selectedPost.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>{selectedPost.readTime}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>{selectedPost.views} 阅读</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all ${
                  liked
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{selectedPost.likes + (liked ? 1 : 0)}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Render: Depending on PostType */}

        {/* 1. Standard Markdown Text Introduction */}
        <article className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl">
          <MarkdownRenderer content={selectedPost.content} />
        </article>

        {/* 2. Coding Sandbox Container (if type === 'coding') */}
        {postType === 'coding' && selectedPost.codingChallenge && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span>在线代码沙箱 (Interactive JS Sandbox)</span>
              </h2>
            </div>
            <CodeSandbox challenge={selectedPost.codingChallenge} />
          </section>
        )}

        {/* 3. Interactive Quiz Question Cards (if type === 'quiz') */}
        {postType === 'quiz' && selectedPost.quizzes && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-teal-400" />
                <span>精选选择题列表 ({selectedPost.quizzes.length} 题)</span>
              </h2>
            </div>

            <div className="space-y-4">
              {selectedPost.quizzes.map((quiz, idx) => (
                <QuizCard key={quiz.id} quiz={quiz} index={idx} />
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  // Articles List View
  return (
    <div className="space-y-10 py-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">学习、手撕代码与面试题库</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              涵盖前端架构技术长文、大厂高频选择题交互作答，以及内置浏览器实时运行的【手撕代码沙箱】。
            </p>
          </div>
        </div>

        {/* Filter Controls: Content Type + Category + Search */}
        <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Content Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '全部类型' },
              { id: 'article', label: '📖 深度长文' },
              { id: 'coding', label: '⚡ 手撕代码沙箱' },
              { id: 'quiz', label: '🎯 选择题库' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedType === t.id
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索文章、题目或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500/60 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const type = post.type || 'article'

          return (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-500/40 cursor-pointer group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              {post.coverImage && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={toAbsolute(post.coverImage)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category & Type Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/80 text-teal-300 backdrop-blur-md border border-slate-800">
                      {post.category}
                    </span>
                    {type === 'coding' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-slate-950">
                        ⚡ 代码沙箱
                      </span>
                    )}
                    {type === 'quiz' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/90 text-slate-950">
                        🎯 选择题
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-slate-100 text-lg group-hover:text-teal-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-teal-400" />
                      <span>{post.date}</span>
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
