import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Post, HobbyVideo, Book, Project, NavigationTab } from '../types'
import { Search, BookOpen, Film, BookmarkCheck, Sparkles, X, ArrowRight, CornerDownLeft, Command } from 'lucide-react'

interface CommandMenuProps {
  isOpen: boolean
  onClose: () => void
  posts: Post[]
  videos: HobbyVideo[]
  books: Book[]
  projects: Project[]
  onSelectPost: (post: Post) => void
  onSelectVideo: (video: HobbyVideo) => void
  onSelectBook: (book: Book) => void
  onNavigate: (tab: NavigationTab) => void
}

type SearchResultItem =
  | { type: 'post'; data: Post }
  | { type: 'video'; data: HobbyVideo }
  | { type: 'book'; data: Book }
  | { type: 'project'; data: Project }
  | { type: 'nav'; data: { id: NavigationTab; label: string } }

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  posts,
  videos,
  books,
  projects,
  onSelectPost,
  onSelectVideo,
  onSelectBook,
  onNavigate
}) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [wasOpen, setWasOpen] = useState(isOpen)

  // Reset search state each time the menu opens — derived at render time (React
  // official "adjusting state when a prop changes" pattern) instead of syncing
  // in an effect, which avoids cascading renders.
  if (isOpen && !wasOpen) {
    setWasOpen(true)
    setQuery('')
    setSelectedIndex(0)
  } else if (!isOpen && wasOpen) {
    setWasOpen(false)
  }

  // Focus the search input once the menu is open
  useEffect(() => {
    if (!isOpen) return
    const id = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(id)
  }, [isOpen])

  // Filter items
  const results = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = []

    if (query.trim() === '') {
      // Default suggestions when query is empty
      items.push(
        { type: 'nav', data: { id: 'home', label: '前往 首页 (Home Hub)' } },
        { type: 'nav', data: { id: 'learning', label: '前往 学习 (Markdown 文章库)' } },
        { type: 'nav', data: { id: 'hobbies', label: '前往 兴趣 (4K 视频画廊)' } },
        { type: 'nav', data: { id: 'books', label: '前往 书籍 (3D 虚拟书房)' } },
        { type: 'nav', data: { id: 'other', label: '前往 其他 (Showcase & 留言板)' } }
      )
    } else {
      const q = query.toLowerCase()

      // 1. Articles
      posts.forEach((p) => {
        if (
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          items.push({ type: 'post', data: p })
        }
      })

      // 2. Videos
      videos.forEach((v) => {
        if (v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)) {
          items.push({ type: 'video', data: v })
        }
      })

      // 3. Books
      books.forEach((b) => {
        if (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) {
          items.push({ type: 'book', data: b })
        }
      })

      // 4. Projects
      projects.forEach((pj) => {
        if (pj.title.toLowerCase().includes(q) || pj.description.toLowerCase().includes(q)) {
          items.push({ type: 'project', data: pj })
        }
      })
    }

    return items
  }, [query, posts, videos, books, projects])

  const handleExecuteItem = useCallback(
    (item: SearchResultItem) => {
      onClose()
      if (item.type === 'post') {
        onSelectPost(item.data)
      } else if (item.type === 'video') {
        onSelectVideo(item.data)
      } else if (item.type === 'book') {
        onSelectBook(item.data)
      } else if (item.type === 'nav') {
        onNavigate(item.data.id)
      } else if (item.type === 'project') {
        onNavigate('other')
      }
    },
    [onClose, onSelectPost, onSelectVideo, onSelectBook, onNavigate]
  )

  // Keyboard navigation inside menu
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          handleExecuteItem(results[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, handleExecuteItem, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 space-x-3">
          <Search className="w-5 h-5 text-teal-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="搜索文章、视频、书籍、开源项目或快捷页面... (支持 ↑↓ 键)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto space-y-1 flex-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              未找到与 "{query}" 相关的匹配结果
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex

              return (
                <div
                  key={index}
                  onClick={() => handleExecuteItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-500/15 border border-teal-500/30 text-teal-200'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {item.type === 'post' && <BookOpen className="w-4 h-4 text-teal-400 flex-shrink-0" />}
                    {item.type === 'video' && <Film className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                    {item.type === 'book' && <BookmarkCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {item.type === 'project' && <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                    {item.type === 'nav' && <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}

                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">
                        {item.type === 'nav' ? item.data.label : item.data.title}
                      </div>
                      {item.type === 'post' && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.data.category} • {item.data.summary}
                        </div>
                      )}
                      {item.type === 'video' && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.data.description}
                        </div>
                      )}
                      {item.type === 'book' && (
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          作者：{item.data.author} • {item.data.category}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                      {item.type}
                    </span>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Command Menu Footer */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center space-x-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↑↓</kbd> 移动</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↵</kbd> 选择</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">esc</kbd> 关闭</span>
          </div>
          <div className="flex items-center space-x-1 text-teal-400">
            <Command className="w-3 h-3" />
            <span>Zenith Search</span>
          </div>
        </div>
      </div>
    </div>
  )
}
