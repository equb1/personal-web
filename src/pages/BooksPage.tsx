import React, { useState, useMemo } from 'react'
import { Book } from '../types'
import {
  BookmarkCheck,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  Grid,
  BookOpen
} from 'lucide-react'
import { BookShelf3D } from '../components/BookShelf3D'
import { toAbsolute } from '../utils/url'

interface BooksPageProps {
  books: Book[]
  onSelectBook: (book: Book) => void
}

export const BooksPage: React.FC<BooksPageProps> = ({ books, onSelectBook }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'reading' | 'completed'>('all')
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d')

  // The book currently pulled off the shelf into 360° inspection (reported by BookShelf3D)
  const [inspectBook, setInspectBook] = useState<Book | null>(null)

  const filteredBooks = useMemo(
    () => books.filter((b) => filterStatus === 'all' || b.status === filterStatus),
    [books, filterStatus]
  )

  return (
    <div className="space-y-10 py-6 animate-fade-in select-none">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <BookmarkCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">3D 实体书架 · 360° 交互书房</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                拖动旋转书架，点击书脊将书本抽出，360° 自由旋转检视封面、书脊与封底；再次点击进入阅读，合上后放回书架。
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
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
              <span>网格平铺</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="pt-4 flex flex-wrap gap-2">
          {[
            { id: 'all' as const, label: '全部藏书' },
            { id: 'reading' as const, label: '正在阅读中' },
            { id: 'completed' as const, label: '已研读完结' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setFilterStatus(item.id)
                setInspectBook(null)
              }}
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

      {/* 3D Shelf View */}
      {viewMode === '3d' && filteredBooks.length > 0 ? (
        <div className="space-y-8">
          {/* Main 3D Stage Box */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#070e1b] to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10 overflow-hidden">
            {/* Top Stage Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  {inspectBook ? '书本检视台 · 360° 自由旋转' : '3D 实体书架 · 书脊朝外'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                  <BookmarkCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    共 {filteredBooks.length} 册 · {inspectBook ? '拖动书本 360° 旋转' : '拖动旋转书架'}
                  </span>
                </span>
              </div>
            </div>

            <BookShelf3D
              books={filteredBooks}
              onRead={onSelectBook}
              onInspectChange={setInspectBook}
            />
          </div>

          {/* Book Details Summary Card (inspection mode) */}
          {inspectBook && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {inspectBook.category}
                  </span>
                  <span className="flex items-center space-x-1 text-xs text-slate-400">
                    {inspectBook.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>
                      {inspectBook.status === 'completed' ? '已全书研读完结' : `在读 (${inspectBook.progress}%)`}
                    </span>
                  </span>
                  <div className="flex items-center space-x-0.5 ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < inspectBook.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{inspectBook.title}</h2>
                <p className="text-xs text-slate-400 font-medium">作者：{inspectBook.author}</p>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl pt-1">{inspectBook.summary}</p>
              </div>

              <button
                type="button"
                onClick={() => onSelectBook(inspectBook)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs hover:from-emerald-300 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20 flex items-center space-x-2 flex-shrink-0 cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>进入阅读 · 3D 卷角翻阅</span>
              </button>
            </div>
          )}
        </div>
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
                      src={toAbsolute(book.coverUrl)}
                      alt={book.title}
                      draggable={false}
                      className="w-24 h-36 object-cover rounded-xl shadow-xl border border-slate-700/80 flex-shrink-0 select-none pointer-events-none"
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
