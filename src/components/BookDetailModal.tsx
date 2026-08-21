import React, { useState } from 'react'
import { Book } from '../types'
import { MarkdownRenderer } from './MarkdownRenderer'
import {
  X,
  Star,
  Bookmark,
  CheckCircle2,
  Clock,
  BookOpen,
  Edit3,
  Columns2,
  FileText,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react'

interface BookDetailModalProps {
  book: Book | null
  onClose: () => void
}

type ReadMode = 'split' | 'excerpt' | 'notes'

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const [readMode, setReadMode] = useState<ReadMode>('split')

  if (!book) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className={`relative w-full ${
        readMode === 'split' ? 'max-w-6xl' : 'max-w-4xl'
      } bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300`}>
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-12 h-16 object-cover rounded-lg shadow-md border border-slate-700 flex-shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {book.category}
                </span>
                {book.publishYear && (
                  <span className="text-[10px] font-mono text-slate-400">
                    出版: {book.publishYear}
                  </span>
                )}
                {book.pages && (
                  <span className="text-[10px] font-mono text-slate-400">
                    {book.pages} 页
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-1">{book.title}</h3>
              <p className="text-xs text-slate-400 font-medium">作者：{book.author}</p>
            </div>
          </div>

          {/* Right Action: Read Mode Switcher + Close Button */}
          <div className="flex items-center space-x-3">
            {/* 3 Read Modes Switcher */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setReadMode('split')}
                title="双栏对照阅读"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  readMode === 'split'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">双栏对照</span>
              </button>

              <button
                onClick={() => setReadMode('excerpt')}
                title="仅看原文章节"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  readMode === 'excerpt'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">原文章节</span>
              </button>

              <button
                onClick={() => setReadMode('notes')}
                title="仅看读书笔记"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  readMode === 'notes'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">读书笔记</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-slate-300 font-mono">
              {book.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Clock className="w-4 h-4 text-amber-400" />
              )}
              <span>{book.status === 'completed' ? '已全书研读完结' : `研读中 (${book.progress}%)`}</span>
            </span>

            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < book.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {book.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px] font-mono">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reader Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Summary Quote */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start space-x-2.5">
            <Bookmark className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-slate-200">一句话核心导读：</span>
              <span>{book.summary}</span>
            </div>
          </div>

          {/* Read Mode Content Switching */}

          {/* 1. Split Side-by-Side View */}
          {readMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              {/* Left Column: Original Excerpt */}
              <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/90 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    <span>原著精选章节节选 (Original Excerpt)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">经典原著</span>
                </div>
                <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300">
                  <MarkdownRenderer content={book.excerpt || '暂无原文节选'} />
                </div>
              </div>

              {/* Right Column: Thoughts & Notes */}
              <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/90 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-1.5">
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>深度读书笔记 & 工程实践 (My Notes)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400/80 font-bold">思考沉淀</span>
                </div>
                <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300">
                  <MarkdownRenderer content={book.thoughts} />
                </div>
              </div>
            </div>
          )}

          {/* 2. Excerpt Only View */}
          {readMode === 'excerpt' && (
            <div className="bg-slate-950/80 rounded-2xl p-8 border border-slate-800 max-w-3xl mx-auto space-y-4 animate-fade-in">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-slate-200">原著核心章节精读</h4>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">
                <MarkdownRenderer content={book.excerpt || '暂无原文节选'} />
              </div>
            </div>
          )}

          {/* 3. Notes Only View */}
          {readMode === 'notes' && (
            <div className="bg-slate-950/80 rounded-2xl p-8 border border-slate-800 max-w-3xl mx-auto space-y-4 animate-fade-in">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-200">全篇深度读书笔记与实战启示</h4>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">
                <MarkdownRenderer content={book.thoughts} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
