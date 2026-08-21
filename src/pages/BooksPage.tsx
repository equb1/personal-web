import React, { useState } from 'react'
import { Book } from '../types'
import { BookmarkCheck, Star, BookOpen, CheckCircle2, Clock, Sparkles } from 'lucide-react'

interface BooksPageProps {
  books: Book[]
  onSelectBook: (book: Book) => void
}

export const BooksPage: React.FC<BooksPageProps> = ({ books, onSelectBook }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'reading' | 'completed'>('all')

  const filteredBooks = books.filter(
    (b) => filterStatus === 'all' || b.status === filterStatus
  )

  return (
    <div className="space-y-10 py-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <BookmarkCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">书籍、阅读与知识沉淀</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              记录计算机底层、UI/UX 认知心理学与职业成长读物。点击书籍封面可直接展开对应的 Markdown 深度读书笔记。
            </p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="pt-4 flex flex-wrap gap-2">
          {[
            { id: 'all', label: '全部藏书' },
            { id: 'reading', label: '正在阅读中' },
            { id: 'completed', label: '已读完完结' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                filterStatus === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books Shelf Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => onSelectBook(book)}
            className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 cursor-pointer group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative"
          >
            <div className="space-y-4">
              {/* Cover & Rating Layout */}
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
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {book.category}
                  </span>

                  <h3 className="font-bold text-slate-100 text-base group-hover:text-blue-300 transition-colors line-clamp-2">
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

              {/* Summary */}
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                {book.summary}
              </p>
            </div>

            {/* Reading Progress & Action */}
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
                <span className="text-blue-400 group-hover:underline flex items-center space-x-1 font-sans text-xs">
                  <span>查看 Markdown 笔记</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
