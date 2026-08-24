import React, { forwardRef, useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'
import { Book, BookPageItem, BookFormat } from '../types'
import { MarkdownRenderer } from './MarkdownRenderer'
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  BookmarkCheck,
  Compass,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Code,
  FileCode,
  FileType,
  Download,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react'

interface Interactive3DBookProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
}

type AnimationStage =
  | 'shelf'
  | 'desk_transition'
  | 'cover_open'
  | 'reading'
  | 'cover_close'
  | 'returning'

interface PageBlockProps {
  pageData: BookPageItem
  book: Book
  totalPages: number
  activeFormatView: 'all' | 'markdown' | 'pdf' | 'epub' | 'txt' | 'code'
  onTurnNext?: () => void
  onTurnPrev?: () => void
}

/**
 * High-definition individual Page component with forwardRef
 * Must have forwardRef for react-pageflip DOM measurements & GPU transforms
 */
export const RealisticPage = forwardRef<HTMLDivElement, PageBlockProps>(
  ({ pageData, book, totalPages, activeFormatView, onTurnNext, onTurnPrev }, ref) => {
    const isOdd = pageData.pageNumber % 2 !== 0
    const isCover = pageData.type === 'cover'
    const isBackCover = pageData.type === 'back-cover'

    // Realistic warm paper texture styles (Pure uniform natural warm paper)
    const paperBackground = isCover || isBackCover
      ? 'bg-slate-900'
      : isOdd
      ? 'bg-[#faf6ee]'
      : 'bg-[#f7f2e6]'

    return (
      <div
        ref={ref}
        className={`relative w-full h-full select-none overflow-hidden flex flex-col justify-between ${paperBackground}`}
        style={{
          boxShadow: isOdd
            ? 'inset -1px 0 3px rgba(0,0,0,0.05)'
            : 'inset 1px 0 3px rgba(0,0,0,0.05)'
        }}
      >
        {/* Dynamic Spine Fold Soft Crease (Only adjacent to the central spine) */}
        {!isCover && !isBackCover && (
          isOdd ? (
            // Odd pages are on the RIGHT side of the open spread -> spine is on the LEFT
            <div className="absolute top-0 bottom-0 left-0 w-5 bg-gradient-to-r from-black/8 via-black/2 to-transparent pointer-events-none z-10" />
          ) : (
            // Even pages are on the LEFT side of the open spread -> spine is on the RIGHT
            <div className="absolute top-0 bottom-0 right-0 w-5 bg-gradient-to-l from-black/8 via-black/2 to-transparent pointer-events-none z-10" />
          )
        )}

        {/* Page Content Rendering by Type & Format */}
        {isCover ? (
          // 1. HARD COVER FRONT
          <div className="relative w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100">
            {pageData.image && (
              <img
                src={pageData.image}
                alt={book.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 backdrop-blur-md">
                  {book.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800/90 text-amber-300 border border-slate-700">
                  多格式支持: MD / PDF / EPUB / TXT
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">P. 1 (COVER)</span>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="w-8 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
                {book.title}
              </h2>
              <p className="text-xs text-slate-300 font-medium">著 者：{book.author}</p>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Zenith Multi-Format Reader • 2026</span>
              <span className="text-teal-400 animate-pulse">点击或拖拽边缘翻页 ➔</span>
            </div>
          </div>
        ) : isBackCover ? (
          // 2. HARD COVER BACK
          <div className="relative w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-200">
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono font-bold">
              <BookmarkCheck className="w-4 h-4" />
              <span>{book.category} · 典藏终卷</span>
            </div>

            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-100">{book.title}</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-5">
                {book.summary}
              </p>
            </div>

            {/* Back Barcode & Multi-format status */}
            <div className="pt-3 border-t border-slate-800 flex items-end justify-between">
              <div className="space-y-0.5 text-[9px] font-mono text-slate-400">
                <div>FORMATS: MARKDOWN / PDF / EPUB</div>
                <div>ISBN: 978-7-111-54493-2</div>
              </div>
              <div className="w-16 h-7 bg-white/90 p-1 rounded flex items-center justify-between">
                <div className="w-1 h-full bg-slate-950" />
                <div className="w-0.5 h-full bg-slate-950" />
                <div className="w-1.5 h-full bg-slate-950" />
                <div className="w-0.5 h-full bg-slate-950" />
                <div className="w-1 h-full bg-slate-950" />
                <div className="w-2 h-full bg-slate-950" />
              </div>
            </div>
          </div>
        ) : (
          // 3. INSIDE PAPER PAGES (Multi-format renderer)
          <div className="relative z-10 w-full h-full p-6 sm:p-7 flex flex-col justify-between text-slate-900">
            {/* Clean Header without divider line */}
            <div className="flex items-center justify-between pb-1 text-[10px] font-mono text-slate-500 font-medium">
              <div className="flex items-center space-x-2">
                <span className="truncate max-w-[150px] font-bold text-slate-800">
                  {pageData.chapter || book.title}
                </span>
                {pageData.format && (
                  <span className="px-1.5 py-0.2 rounded text-[8.5px] uppercase font-mono bg-amber-500/15 text-amber-800 font-semibold border border-amber-500/30">
                    {pageData.format}
                  </span>
                )}
              </div>
              <span>P. {pageData.pageNumber}</span>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto pr-1 my-2 text-[12px] leading-relaxed text-slate-800">

              {/* FORMAT A: PDF FACSIMILE SIMULATION */}
              {pageData.type === 'pdf-page' || pageData.format === 'pdf' ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono bg-[#ece4d0]/60 p-2 rounded border border-[#dcd2be]">
                    <span className="font-bold text-rose-900 flex items-center space-x-1">
                      <FileType className="w-3.5 h-3.5 text-rose-600" />
                      <span>PDF 高清矢量扫描影印模式</span>
                    </span>
                    <span className="text-slate-600">Doc. Page #{pageData.pdfPageNumber || pageData.pageNumber}</span>
                  </div>

                  {pageData.image && (
                    <div className="relative rounded-lg overflow-hidden border border-[#d8ceb8] shadow-sm">
                      <img
                        src={pageData.image}
                        alt={pageData.title || ''}
                        className="w-full h-36 object-cover"
                      />
                    </div>
                  )}

                  {pageData.content && (
                    <div className="font-serif text-[11.5px] leading-relaxed text-slate-800 bg-[#faf6ee] p-2.5 rounded border border-[#e4ded0]">
                      <MarkdownRenderer content={pageData.content} className="book-page-markdown" />
                    </div>
                  )}
                </div>
              ) : pageData.type === 'code-page' || pageData.format === 'code' ? (
                /* FORMAT B: CODE & SYNTAX PAGE */
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono text-teal-800 font-bold bg-teal-500/10 p-1.5 rounded border border-teal-500/20">
                    <FileCode className="w-3.5 h-3.5 text-teal-600" />
                    <span>源代码工程附录 ({pageData.codeLanguage || 'TypeScript'})</span>
                  </div>
                  {pageData.codeSnippet && (
                    <pre className="p-3 bg-[#1e293b] text-teal-200 rounded-lg text-[10px] font-mono overflow-x-auto leading-relaxed border border-slate-700 shadow-inner">
                      <code>{pageData.codeSnippet}</code>
                    </pre>
                  )}
                  {pageData.content && (
                    <MarkdownRenderer content={pageData.content} className="book-page-markdown" />
                  )}
                </div>
              ) : pageData.type === 'illustration' ? (
                /* FORMAT C: ILLUSTRATION & DIAGRAMS */
                <div className="space-y-3">
                  {pageData.image && (
                    <div className="relative rounded-lg overflow-hidden border border-[#d8ceb8] shadow-sm">
                      <img
                        src={pageData.image}
                        alt={pageData.title || ''}
                        className="w-full h-36 sm:h-40 object-cover"
                      />
                    </div>
                  )}
                  {pageData.quote && (
                    <blockquote className="border-l-2 border-teal-700 pl-2.5 py-1 text-[11px] italic text-teal-900 bg-[#e4ded0]/60 rounded-r">
                      {pageData.quote}
                    </blockquote>
                  )}
                  {pageData.content && (
                    <MarkdownRenderer content={pageData.content} className="book-page-markdown" />
                  )}
                </div>
              ) : (
                /* FORMAT D: MARKDOWN / EPUB TEXT */
                <div className="space-y-2">
                  {pageData.content && (
                    <MarkdownRenderer content={pageData.content} className="book-page-markdown" />
                  )}
                </div>
              )}
            </div>

            {/* Clean Footer without divider line */}
            <div className="pt-1 flex items-center justify-between text-[9.5px] font-mono text-slate-500 font-medium">
              <span>{book.author}</span>
              <span>
                {pageData.pageNumber} / {totalPages}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }
)
RealisticPage.displayName = 'RealisticPage'

// ============================================================================
//  Realistic Closed-Book Cover Rig
//  A thick hardcover lying flat on the desk. The front cover is a double-sided
//  board hinged at the LEFT spine; it swings 0° → -180° to open. Meanwhile the
//  spine migrates from the closed-book's left edge (x=210) to the open-spread
//  centre (x=420), so the book visibly "opens & recentres" like a real book.
// ============================================================================

const PAGE_W = 420
const PAGE_H = 520
const SPREAD_W = PAGE_W * 2

const EASE_COVER: [number, number, number, number] = [0.34, 1.45, 0.64, 1]
const EASE_SPINE: [number, number, number, number] = [0.45, 0, 0.2, 1]

interface CoverRigProps {
  book: Book
  coverOpen: boolean
  stage: AnimationStage
}

const CoverRig: React.FC<CoverRigProps> = ({ book, coverOpen, stage }) => {
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: SPREAD_W,
        height: PAGE_H,
        marginLeft: -SPREAD_W / 2,
        marginTop: -PAGE_H / 2,
        transformStyle: 'preserve-3d',
        zIndex: 20,
        pointerEvents: 'none',
        // The CoverRig is only needed for the open/close choreography. During
        // reading it must be hidden, otherwise it overlaps the flipbook.
        visibility: stage === 'reading' ? 'hidden' : 'visible'
      }}
    >
      {/* Spine-anchored group: back cover + page block + fore-edge + spine groove.
          Animating `x` migrates the spine from the closed book's left edge to the
          spread centre as the cover opens. */}
      <motion.div
        className="absolute top-0"
        style={{
          left: PAGE_W / 2,
          width: PAGE_W,
          height: PAGE_H,
          transformStyle: 'preserve-3d'
        }}
        animate={{ x: coverOpen ? PAGE_W / 2 : 0 }}
        transition={{ duration: 1.4, ease: EASE_SPINE }}
      >
        {/* Spine groove (crease on the left hinge line) — fades out when open */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/35 via-black/5 to-transparent pointer-events-none"
          animate={{ opacity: coverOpen ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* 4. Front cover — double-sided board hinged at the left spine */}
        <motion.div
          className="absolute top-0 left-0"
          style={{
            width: PAGE_W,
            height: PAGE_H,
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d'
          }}
          animate={{ rotateY: coverOpen ? -180 : 0 }}
          transition={{ duration: 1.4, ease: EASE_COVER }}
        >
          {/* FRONT FACE (0°): high-resolution cover art */}
          <div
            className="absolute inset-0 rounded-r-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-white/5" />
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/45 via-black/10 to-transparent" />
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-950/90 text-teal-300 backdrop-blur-md border border-slate-800">
              {book.category}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Persist the last-read page across open/close sessions (module-scoped).
let lastReadPage = 1

export const Interactive3DBook: React.FC<Interactive3DBookProps> = ({
  book,
  isOpen,
  onClose
}) => {
  const [stage, setStage] = useState<AnimationStage>('shelf')
  const [currentPage, setCurrentPage] = useState(0)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [activeFormat, setActiveFormat] = useState<'all' | 'markdown' | 'pdf' | 'epub' | 'txt' | 'code'>('all')
  const flipBookRef = useRef<any>(null)

  const coverOpen = stage === 'cover_open' || stage === 'reading'
  const isReading = stage === 'reading'

  const flipOpacityValue = stage === 'cover_open' || stage === 'reading' ? 1 : 0
  const flipOpacityTransition = (() => {
    switch (stage) {
      // Appear almost instantly right as the cover crosses 90° (~0.12s), so there's
      // no visible "content brightening over black" pause.
      case 'cover_open':
        return { duration: 0.15, delay: 0.2 }
      case 'reading':
        return { duration: 0.2 }
      case 'cover_close':
        return { duration: 0.3 }
      default:
        return { duration: 0.3 }
    }
  })()

  // ---- Diagnostic logs (remove after tuning) ----
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[book] stage:', stage, '| coverOpen:', coverOpen, '| flipOpacity:', flipOpacityValue)
    }
  }, [stage, coverOpen, flipOpacityValue])

  useEffect(() => {
    if (isOpen && book) {
      const t = setTimeout(() => {
        try {
          const fp = flipBookRef.current?.pageFlip()
          if (fp) {
            console.log(
              '[book] flipbook ready: currentPageIndex =',
              fp.getCurrentPageIndex(),
              '| startPage prop =',
              lastReadPage
            )
          }
        } catch {
          console.log('[book] flipbook not ready yet')
        }
      }, 400)
      return () => clearTimeout(t)
    }
  }, [isOpen, book])

  // Open lifecycle: fly to desk -> swing cover open -> enter reading
  useEffect(() => {
    if (isOpen && book) {
      setStage('desk_transition')
      setCurrentPage(lastReadPage)
      setActiveFormat('all')

      const t1 = setTimeout(() => setStage('cover_open'), 1500)
      const t2 = setTimeout(() => setStage('reading'), 1500 + 1400)

      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    } else {
      setStage('shelf')
    }
  }, [isOpen, book])

  // Sound effect simulation for page turn (Synthesized Web Audio Click/Rustle)
  const playPageFlipSound = () => {
    if (!isSoundEnabled) return
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(140, audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.13)
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  // Handle Close & Return to Shelf
  const handleCloseAndReturn = () => {
    if (stage === 'cover_close' || stage === 'returning') return

    setStage('cover_close')

    setTimeout(() => setStage('returning'), 1400)
    setTimeout(() => {
      onClose()
      setStage('shelf')
    }, 1400 + 800)
  }

  const handleNextPage = () => {
    if (flipBookRef.current?.pageFlip()) {
      flipBookRef.current.pageFlip().flipNext()
      playPageFlipSound()
    }
  }

  const handlePrevPage = () => {
    if (flipBookRef.current?.pageFlip()) {
      flipBookRef.current.pageFlip().flipPrev()
      playPageFlipSound()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || stage !== 'reading') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        handleNextPage()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        handlePrevPage()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleCloseAndReturn()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, stage])

  if (!isOpen || !book) return null

  // Ensure rich 8-page multi-format content.
  // With showCover enabled the front/back covers render as single pages (no
  // endpaper beside them), and the even page count keeps every content spread full.
  const pages: BookPageItem[] = book.bookPages || [
    { pageNumber: 1, title: '封面', type: 'cover', image: book.coverUrl },
    {
      pageNumber: 2,
      title: '扉页与索引',
      type: 'copyright',
      format: 'markdown',
      content: `# ${book.title}\n\n**作者**：${book.author}\n\n> “${book.summary}”`
    },
    {
      pageNumber: 3,
      title: 'Markdown 原著第一章',
      type: 'content',
      format: 'markdown',
      content: book.excerpt || '暂无原文节选'
    },
    {
      pageNumber: 4,
      title: 'PDF 影印排版页',
      type: 'pdf-page',
      format: 'pdf',
      pdfPageNumber: 42,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
      content: '### PDF 原文排版矢量影印\n\n精准保留了原书的版面边距、图文混排比例与原版字重。'
    },
    {
      pageNumber: 5,
      title: 'EPUB 电子书流动排版',
      type: 'content',
      format: 'epub',
      content: [
        '### EPUB 流式排版章节',
        '',
        '- **自适应字号**：支持按设备视口动态调整行高与字阶。',
        '- **知识图谱连接**：章节间双向引用与书签同步。',
        '- **语义化排版**：符合 W3C EPUB3 最新规范。'
      ].join('\n')
    },
    {
      pageNumber: 6,
      title: '工程源码附录',
      type: 'code-page',
      format: 'code',
      codeLanguage: 'TypeScript',
      codeSnippet: [
        '// 架构实现：局部性缓存算法',
        'interface CacheNode<K, V> {',
        '  key: K;',
        '  value: V;',
        '  expiresAt: number;',
        '}',
        '',
        'export class MemoryMountainCache<K, V> {',
        '  private store = new Map<K, CacheNode<K, V>>();',
        '  // ... 实现高命中率分级缓存',
        '}'
      ].join('\n'),
      content: '附录：CSAPP 局部性原理在现代前端组件缓存与渲染优化中的实战代码。'
    },
    {
      pageNumber: 7,
      title: '深度读书笔记',
      type: 'notes',
      format: 'markdown',
      content: book.thoughts || '暂无读书笔记'
    },
    {
      pageNumber: 8,
      title: '封底',
      type: 'back-cover',
      content: `### Zenith Reader 2026\n\nISBN: 978-7-111-54493-2\n状态：${book.status}`
    }
  ]

  const totalPages = pages.length

  // Outer flying wrapper pose per stage
  const outerPose = (() => {
    if (stage === 'desk_transition') {
      return {
        rotateX: 4,
        rotateY: 0,
        rotateZ: 0,
        z: 0,
        scale: 0.95,
        y: 0,
        transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
      }
    }
    if (stage === 'cover_open') {
      return {
        rotateX: 2,
        rotateY: 0,
        rotateZ: 0,
        z: 0,
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' as const }
      }
    }
    if (stage === 'reading' || stage === 'cover_close') {
      return {
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        z: 0,
        scale: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' as const }
      }
    }
    // returning -> back to shelf
    return {
      rotateX: 65,
      rotateY: -35,
      rotateZ: 10,
      z: -400,
      scale: 0.65,
      y: -120,
      transition: { duration: 0.8, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] }
    }
  })()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-2xl select-none overflow-hidden"
        style={{ perspective: '2400px' }}
      >
        {/* Desk Environment Background Layer */}
        <div className="absolute inset-0 bg-radial from-slate-900/60 via-slate-950/90 to-[#030712] pointer-events-none" />

        {/* Ambient Top Studio Warm Lamp */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-400/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Wooden Desk Surface Subtle Texture */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-30 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.8) 60%, rgba(2, 6, 23, 0.95) 100%)'
          }}
        />

        {/* Floating Modal Frame (overflow-visible to let curling pages rotate beyond bounds) */}
        <div className="relative w-full max-w-6xl h-[92vh] rounded-3xl bg-slate-900/40 border border-slate-800/80 shadow-2xl overflow-visible flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md">

          {/* Top Control Bar with Format Selector */}
          <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 pb-3">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCloseAndReturn}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-white transition-all text-xs cursor-pointer shadow-sm group"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-400 group-hover:-rotate-45 transition-transform" />
                <span>合上并归还书架 (Esc)</span>
              </button>

              <div className="hidden sm:flex items-center space-x-2 text-xs">
                <span className="font-bold text-slate-100">{book.title}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{book.author}</span>
              </div>
            </div>

            {/* Format Filter Bar (Markdown / PDF / EPUB / Code) */}
            <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
              <span className="px-2 text-slate-400 font-sans text-xs">格式视图:</span>
              {[
                { id: 'all', label: '全格式混排', icon: Layers },
                { id: 'markdown', label: 'Markdown', icon: FileText },
                { id: 'pdf', label: 'PDF 影印', icon: FileType },
                { id: 'epub', label: 'EPUB 流式', icon: BookOpen },
                { id: 'code', label: '代码附录', icon: FileCode }
              ].map((fmt) => {
                const Icon = fmt.icon
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      setActiveFormat(fmt.id as any)
                      // Quick jump to first page of this format
                      const targetIdx = pages.findIndex(
                        (p) => fmt.id === 'all' || p.format === fmt.id || p.type === `${fmt.id}-page`
                      )
                      if (targetIdx >= 0 && flipBookRef.current?.pageFlip()) {
                        flipBookRef.current.pageFlip().turnToPage(targetIdx)
                      }
                    }}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all ${
                      activeFormat === fmt.id
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{fmt.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center space-x-3">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                  isSoundEnabled
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={isSoundEnabled ? '翻书音效开启' : '静音'}
              >
                {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Page Indicator */}
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                <span className="text-teal-400 font-bold">
                  P. {currentPage + 1}
                </span>
                <span className="text-slate-500">/ {totalPages} 页</span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseAndReturn}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN 3D WORKSPACE STAGE (GPU Accelerated Spatial Transforms) */}
          <div
            className="relative flex-1 flex items-center justify-center my-2 overflow-visible"
            style={{ perspective: '2200px' }}
          >
            {/* 3D Spatial Animated Book Container */}
            <motion.div
              initial={{
                rotateX: 65,
                rotateY: -35,
                rotateZ: 10,
                z: -400,
                scale: 0.65,
                y: -120
              }}
              animate={outerPose}
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
              className="relative flex items-center justify-center"
            >
              {/* Dynamic Desk Surface Contact Shadow */}
              <div
                className="absolute -bottom-8 inset-x-8 h-16 bg-black/90 rounded-full blur-2xl pointer-events-none transition-all duration-500"
                style={{
                  transform: 'rotateX(90deg)',
                  opacity: isReading ? 0.85 : 0.4
                }}
              />

              {/* ===== FlipBook reading canvas — sits UNDER the cover so the opening cover reveals it directly ===== */}
              <motion.div
                className="relative rounded-2xl overflow-visible flex items-center justify-center"
                style={{
                  width: `${SPREAD_W}px`,
                  height: `${PAGE_H}px`,
                  zIndex: 10,
                  pointerEvents: isReading ? 'auto' : 'none'
                }}
                initial={false}
                animate={{ opacity: flipOpacityValue }}
                transition={flipOpacityTransition}
              >
                <HTMLFlipBook
                  ref={flipBookRef}
                  width={PAGE_W}
                  height={PAGE_H}
                  size="fixed"
                  minWidth={320}
                  maxWidth={540}
                  minHeight={400}
                  maxHeight={650}
                  maxShadowOpacity={0.25}
                  drawShadow={true}
                  flippingTime={600}
                  usePortrait={false}
                  startPage={lastReadPage}
                  startZIndex={0}
                  autoSize={true}
                  swipeDistance={20}
                  showCover={true}
                  mobileScrollSupport={true}
                  useMouseEvents={true}
                  clickEventForward={true}
                  showPageCorners={true}
                  disableFlipByClick={false}
                  className="rounded-2xl"
                  style={{ margin: '0 auto' }}
                  onFlip={(e: any) => {
                    lastReadPage = e.data
                    setCurrentPage(e.data)
                    playPageFlipSound()
                  }}
                >
                  {pages.map((p, idx) => (
                    <RealisticPage
                      key={idx}
                      pageData={p}
                      book={book}
                      totalPages={totalPages}
                      activeFormatView={activeFormat}
                      onTurnNext={handleNextPage}
                      onTurnPrev={handlePrevPage}
                    />
                  ))}
                </HTMLFlipBook>
              </motion.div>

              {/* ===== Realistic closed-book cover rig — swings OVER the flipbook, revealing it ===== */}
              <CoverRig book={book} coverOpen={coverOpen} stage={stage} />
            </motion.div>
          </div>

          {/* Bottom Toolbar & Page Navigation Bar */}
          <div className="relative z-30 flex items-center justify-between pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 0 || !isReading}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-200 text-xs font-semibold disabled:opacity-30 transition-all cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-teal-400" />
              <span>上一页 (←)</span>
            </button>

            {/* Quick Page Jump Tracker */}
            <div className="flex items-center space-x-1.5">
              {pages.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (flipBookRef.current?.pageFlip()) {
                      flipBookRef.current.pageFlip().turnToPage(i)
                      playPageFlipSound()
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentPage
                      ? 'w-6 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md shadow-teal-500/40'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`第 ${i + 1} 页 (${p.format || p.type})`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1 || !isReading}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 text-xs font-bold disabled:opacity-30 transition-all cursor-pointer shadow-lg shadow-teal-500/20"
            >
              <span>下一页 (→)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
