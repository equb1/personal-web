import React from 'react'
import { Book } from '../types'
import { MarkdownRenderer } from './MarkdownRenderer'
import { X, Star, Bookmark, CheckCircle2, Clock } from 'lucide-react'

interface BookDetailModalProps {
  book: Book | null
  onClose: () => void
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  if (!book) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-4">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-12 h-16 object-cover rounded-md shadow-md border border-slate-700"
            />
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {book.category}
              </span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">{book.title}</h3>
              <p className="text-xs text-slate-400 font-medium">作者：{book.author}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-300">
              {book.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Clock className="w-4 h-4 text-amber-400" />
              )}
              <span>{book.status === 'completed' ? '已读完' : `阅读中 (${book.progress}%)`}</span>
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
              <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Content - Markdown Notes */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2 flex items-center space-x-1">
              <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              <span>书籍简介</span>
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
              {book.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-3">
              核心读书笔记 (Markdown)
            </h4>
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
              <MarkdownRenderer content={book.thoughts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
