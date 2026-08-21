import React, { useState } from 'react'
import { Post } from '../types'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { Search, Tag, Calendar, Eye, ThumbsUp, ArrowLeft, BookOpen, Clock, Share2 } from 'lucide-react'

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
  const [liked, setLiked] = useState(false)

  const categories = ['all', ...Array.from(new Set(posts.map((p) => p.category)))]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Active Markdown Reading View
  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回文章列表</span>
        </button>

        {/* Article Header */}
        <header className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{selectedPost.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{selectedPost.readTime}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
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

        {/* Markdown Content Body */}
        <article className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl">
          <MarkdownRenderer content={selectedPost.content} />
        </article>
      </div>
    )
  }

  // Articles List View
  return (
    <div className="space-y-10 py-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">学习与技术 Markdown 笔记</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              记录前端架构、React 19、Tailwind CSS v4 以及系统级 AI 智能体开发经验。
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? '全部主题' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索文章或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 cursor-pointer group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
          >
            {post.coverImage && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-slate-800">
                  {post.category}
                </div>
              </div>
            )}

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-slate-100 text-lg group-hover:text-indigo-400 transition-colors line-clamp-2">
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
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span>{post.date}</span>
                  </span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
