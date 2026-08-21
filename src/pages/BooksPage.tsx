import React, { useState } from 'react'
import { Book } from '../types'
import { BookmarkCheck, Star, CheckCircle2, Clock, Layers, Grid, Sparkles, BookOpen, ChevronRight } from 'lucide-react'

interface BooksPageProps {
  books: Book[]
  onSelectBook: (book: Book) => void
}

export const BooksPage: React.FC<BooksPageProps> = ({ books, onSelectBook }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'reading' | 'completed'>('all')
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d')

  const filteredBooks = books.filter(
    (b) => filterStatus === 'all' || b.status === filterStatus
  )

  return (
    <div className="space-y-12 py-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">3D 虚拟书房 & 深度读书笔记</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                支持【3D 立体书架】交互浏览。点击任意书籍可体验【原文章节节选】与【读书笔记】双栏对照深度阅读。
              </p>
            </div>
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D 书架</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>网格视图</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="pt-4 flex flex-wrap gap-2">
          {[
            { id: 'all', label: '全部藏书' },
            { id: 'reading', label: '正在阅读中' },
            { id: 'completed', label: '已读完结' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterStatus === item.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Immersive Bookshelf View */}
      {viewMode === '3d' ? (
        <section className="space-y-16">
          {/* Bookshelf Unit */}
          <div className="relative py-12 px-6 sm:px-12 bg-gradient-to-b from-slate-900/60 via-slate-950/90 to-slate-950 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/4 w-72 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-72 h-32 bg-teal-500/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 pt-8 pb-12">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="group cursor-pointer flex flex-col items-center select-none"
                  style={{ perspective: '1000px' }}
                >
                  {/* 3D Book Container */}
                  <div
                    className="relative w-44 h-64 transition-transform duration-500 ease-out transform-gpu group-hover:scale-105"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'rotateY(-18deg) rotateX(8deg)'
                    }}
                  >
                    {/* Front Cover */}
                    <div className="absolute inset-0 rounded-r-lg overflow-hidden shadow-2xl border-y border-r border-slate-700/50 group-hover:shadow-teal-500/30 group-hover:brightness-105 transition-all">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Glossy Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-white/10 pointer-events-none" />
                      {/* Status Badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-slate-950/85 text-teal-300 backdrop-blur-md border border-slate-800">
                        {book.category}
                      </div>
                    </div>

                    {/* Left Spine (3D 书脊) */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r ${
                        book.spineColor || 'from-slate-800 to-slate-900'
                      } origin-left border-l border-slate-600/40 shadow-inner flex flex-col justify-between py-3 px-1 text-[8px] font-mono text-slate-200 text-center tracking-widest uppercase`}
                      style={{
                        transform: 'rotateY(-90deg) translateX(-32px)',
                        writingMode: 'vertical-rl'
                      }}
                    >
                      <span className="font-bold truncate">{book.title}</span>
                      <span className="text-[7px] text-slate-400">{book.author}</span>
                    </div>

                    {/* Book Pages Edge (右侧书页厚度) */}
                    <div
                      className="absolute top-1 bottom-1 right-0 w-6 bg-[#f3efe6] rounded-sm opacity-90 border-r border-slate-400"
                      style={{
                        transform: 'rotateY(90deg) translateZ(10px) translateX(-4px)',
                        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.3)'
                      }}
                    />
                  </div>

                  {/* 3D Realistic Shadow under book */}
                  <div className="w-40 h-4 bg-black/70 rounded-full blur-md -mt-2 transition-transform duration-300 group-hover:scale-90 group-hover:opacity-60" />

                  {/* Book Info Card below */}
                  <div className="mt-5 text-center space-y-1 max-w-[200px]">
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400">{book.author}</p>
                    <div className="flex items-center justify-center space-x-1 text-xs pt-1">
                      <div className="flex items-center space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < book.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">({book.progress}%)</span>
                    </div>

                    <div className="pt-2">
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-teal-400 group-hover:translate-x-0.5 transition-transform">
                        <span>展开原文与笔记</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3D Wooden/Metallic Bookshelf Shelf Plank (实体书架横梁底板) */}
            <div className="relative w-full h-8 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] rounded-xl border-t border-slate-600/60 shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500/30 via-emerald-400/40 to-teal-500/30" />
              <div className="absolute inset-x-0 bottom-0 h-2 bg-black/80" />
            </div>
          </div>
        </section>
      ) : (
        /* Classic Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/40 cursor-pointer group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-5">
                  <div className="relative group-hover:rotate-1 transition-transform duration-300">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-24 h-36 object-cover rounded-xl shadow-xl border border-slate-700/80 flex-shrink-0"
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {book.category}
                    </span>

                    <h3 className="font-bold text-slate-100 text-base group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="text-xs text-slate-400 font-medium">作者：{book.author}</p>

                    <div className="flex items-center space-x-0.5 pt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < book.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  {book.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center space-x-1.5 text-slate-400">
                    {book.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    )}
                    <span>{book.status === 'completed' ? '已研读完结' : `在读 (${book.progress}%)`}</span>
                  </span>
                  <span className="text-emerald-400 group-hover:underline flex items-center space-x-1 font-sans text-xs">
                    <span>原文 & 笔记</span>
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
