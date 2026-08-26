import React, { useState, useEffect, useCallback } from 'react'
import { Book } from '../types'
import { MarkdownRenderer } from './MarkdownRenderer'
import { toAbsolute } from '../utils/url'
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Edit3,
  ArrowLeft
} from 'lucide-react'

interface OpenBookDeskReaderProps {
  book: Book | null
  onClose: () => void
}

interface PageContentProps {
  title: string
  pageNumber: number
  content: string
  isLeft: boolean
  bookTitle: string
  bookAuthor: string
}

// Fixed 480px x 540px physical page content
const PageContent: React.FC<PageContentProps> = ({
  title,
  pageNumber,
  content,
  isLeft,
  bookTitle,
  bookAuthor
}) => (
  <div
    style={{ width: '480px', height: '540px' }}
    className={`p-6 sm:p-8 flex flex-col justify-between select-text overflow-hidden flex-shrink-0 ${
      isLeft
        ? 'bg-[#faf6ee] text-slate-800 border-r border-[#e5dec9]'
        : 'bg-[#f7f2e7] text-slate-800 border-l border-[#e5dec9]'
    }`}
  >
    {/* Page Header */}
    <div className="flex items-center justify-between pb-3 border-b border-[#e5dec9] text-xs font-mono text-slate-500">
      {isLeft ? (
        <>
          <div className="flex items-center space-x-1.5 text-teal-800 font-bold">
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate max-w-[240px]">{title}</span>
          </div>
          <span>P. {pageNumber}</span>
        </>
      ) : (
        <>
          <span>P. {pageNumber}</span>
          <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
            <Edit3 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate max-w-[240px]">{title}</span>
          </div>
        </>
      )}
    </div>

    {/* Page Content Body */}
    <div className="flex-1 overflow-y-auto pr-2 my-4 text-xs sm:text-[13px] leading-relaxed text-slate-800 font-sans">
      <div className="prose prose-slate max-w-none">
        <MarkdownRenderer content={content} />
      </div>
    </div>

    {/* Page Footer */}
    <div className="pt-3 border-t border-[#e5dec9] flex items-center justify-between text-[11px] font-mono text-slate-400">
      {isLeft ? (
        <>
          <span>原著核心章节</span>
          <span className="font-semibold text-slate-600 truncate max-w-[200px]">{bookTitle}</span>
        </>
      ) : (
        <>
          <span className="font-semibold text-emerald-700">Zenith 读书笔记</span>
          <span className="truncate max-w-[200px]">{bookAuthor} 著</span>
        </>
      )}
    </div>
  </div>
)

export const OpenBookDeskReader: React.FC<OpenBookDeskReaderProps> = ({ book, onClose }) => {
  const [currentSpread, setCurrentSpread] = useState(0)

  // 1. 'closed': 封面合在右页上方，全书居中展示 480px 封面 (400ms 定格)
  // 2. 'unfolding': 封面从 0° 向左旋转 180° 翻开成左页，展露右侧笔记 (950ms)
  // 3. 'reading': 平铺双页阅读就绪
  // 4. 'folding_close': 封面从左向右旋转 180° 盖回合拢 (850ms)
  const [readerState, setReaderState] = useState<'closed' | 'unfolding' | 'reading' | 'folding_close'>('closed')

  // Page flipping animation state (during reading)
  const [flipState, setFlipState] = useState<{
    direction: 'next' | 'prev'
    fromSpread: number
    toSpread: number
  } | null>(null)

  // Edge hover indicators
  const [isHoverLeft, setIsHoverLeft] = useState(false)
  const [isHoverRight, setIsHoverRight] = useState(false)

  const spreads = [
    {
      leftTitle: '原著核心章节 · 第一小节',
      leftContent: book?.excerpt || '暂无原文节选',
      rightTitle: '读书笔记与实践 · 思考沉淀',
      rightContent: book?.thoughts || '暂无读书笔记'
    },
    {
      leftTitle: '原著原理拓展与设计哲学',
      leftContent: [
        '### 核心概念深度剖析',
        '',
        `> “${book?.summary}”`,
        '',
        '#### 关键认知法则与工程启示',
        '1. **空间局部性与时间局部性**：重复使用的资源应尽可能靠近计算核心（Cache 与前端 Memo 思想）。',
        '2. **容错机制与优雅降级**：所有关键操作均应具备撤销 (Undo) 与二次确认保护。',
        '3. **视觉引导与意符**：通过对比度、空间层级与即时微交互引导用户视线。'
      ].join('\n'),
      rightTitle: '工程落地指南 · 实战总结',
      rightContent: [
        '### 架构落地实战总结',
        '',
        '- **组件设计**：保持单一职责，杜绝状态滥用。',
        '- **性能调优**：借助 React 19 编译器与浏览器局部性原理优化首屏渲染。',
        '- **心智模型**：优秀的工具应该像空气一样自然，让使用者专注于创造本身。'
      ].join('\n')
    },
    {
      leftTitle: '经典案例分析与避坑指南',
      leftContent: [
        '### 行业反面案例剖析',
        '',
        '- **过度设计**：脱离业务场景盲目引入重型架构，导致维护成本几何级增长；',
        '- **无响应与卡死**：缺少明确加载与超时熔断保护的长异步请求；',
        '- **破坏心智模型**：随意改动操作系统与通用平台的原生交互习惯。'
      ].join('\n'),
      rightTitle: '终身学习与知识沉淀心得',
      rightContent: [
        '### 持续输出的力量',
        '',
        '将阅读转化为可执行的代码或架构规范，是实现知识内化的最佳路径。',
        '',
        '通过持续公开学习（Learn in Public）与建立数字花园，让知识产生复利。',
        '',
        '*(完结篇 · 点击左侧翻页可返回前序章节)*'
      ].join('\n')
    }
  ]

  const totalSpreads = spreads.length

  // Reset reader state synchronously whenever the book changes (render-time
  // derivation, so no cascading render), and orchestrate the open-animation
  // timers in the effect below.
  const [prevBookId, setPrevBookId] = useState<string | null>(null)
  const activeBookId = book?.id ?? null
  if (activeBookId !== prevBookId) {
    setPrevBookId(activeBookId)
    setCurrentSpread(0)
    setFlipState(null)
    setReaderState('closed')
  }

  // Sequential Stage Orchestration
  useEffect(() => {
    if (!book) return
    // Step 1: Explicit closed book on desk (set by render-time reset above)
    // Step 2: Smooth unfolding begins after 400ms
    const t1 = setTimeout(() => {
      setReaderState('unfolding')
    }, 400)

    // Step 3: Unfolding completes (400 + 950 = 1350ms)
    const t2 = setTimeout(() => {
      setReaderState('reading')
    }, 1350)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [book])

  // Sequential Close Orchestration: Fold close -> Exit
  const handleStartClose = useCallback(() => {
    if (readerState !== 'reading') return

    // Fold cover from left back to right over right page (850ms)
    setReaderState('folding_close')

    setTimeout(() => {
      onClose()
    }, 850)
  }, [readerState, onClose])

  const handleNextPage = useCallback(() => {
    if (currentSpread < totalSpreads - 1 && !flipState && readerState === 'reading') {
      const from = currentSpread
      const to = currentSpread + 1
      setFlipState({ direction: 'next', fromSpread: from, toSpread: to })
      setTimeout(() => {
        setCurrentSpread(to)
        setFlipState(null)
      }, 700)
    }
  }, [currentSpread, flipState, readerState, totalSpreads])

  const handlePrevPage = useCallback(() => {
    if (currentSpread > 0 && !flipState && readerState === 'reading') {
      const from = currentSpread
      const to = currentSpread - 1
      setFlipState({ direction: 'prev', fromSpread: from, toSpread: to })
      setTimeout(() => {
        setCurrentSpread(to)
        setFlipState(null)
      }, 700)
    }
  }, [currentSpread, flipState, readerState])

  // Keyboard controls
  useEffect(() => {
    if (readerState !== 'reading') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        handleNextPage()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        handlePrevPage()
      } else if (e.key === 'Escape') {
        handleStartClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [readerState, currentSpread, flipState, handleNextPage, handlePrevPage, handleStartClose])

  if (!book) return null

  const activeSpread = spreads[currentSpread] || spreads[0]
  const flippingFromSpread = flipState ? spreads[flipState.fromSpread] : activeSpread
  const flippingToSpread = flipState ? spreads[flipState.toSpread] : activeSpread

  const isClosedOrClosing = readerState === 'closed' || readerState === 'folding_close'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 transition-all duration-700 select-none ${
        readerState === 'folding_close' ? 'bg-slate-950/40 opacity-90' : 'bg-slate-950/90 backdrop-blur-2xl opacity-100'
      }`}
    >
      {/* Desk Environment Canvas */}
      <div className="relative w-full max-w-6xl h-[92vh] rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#090e1a] to-[#020617] border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-4 sm:p-6">
        
        {/* Overhead Desk Lamp Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-400/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-30 flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleStartClose}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-white transition-all text-xs cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
              <span>合上书本 (Esc)</span>
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-100">{book.title}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{book.author}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1.5 text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
              <span>快捷翻页：</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-teal-300">←</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-teal-300">→</kbd>
              <span>或悬停触碰边缘</span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
              <span className="text-teal-400 font-bold">P. {currentSpread * 2 + 1} - {currentSpread * 2 + 2}</span>
              <span className="text-slate-500">/ {totalSpreads * 2} 页</span>
            </div>

            <button
              onClick={handleStartClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D DESK READING STAGE (Perspective: 2600px) */}
        <div
          className="relative flex-1 flex items-center justify-center my-1"
          style={{ perspective: '2600px' }}
        >
          {/* Main Morphing Book Stage (Centered on Desk) */}
          <div
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.95s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: isClosedOrClosing ? 'translateX(-240px)' : 'translateX(0px)'
            }}
            className="relative flex items-center justify-center"
          >
            {/* Real Floor Contact Shadow */}
            <div
              className="absolute -bottom-6 inset-x-4 h-12 bg-black/95 rounded-full blur-2xl pointer-events-none transition-all duration-700"
              style={{
                opacity: readerState === 'reading' ? 0.95 : 0.7
              }}
            />

            {/* UNIFIED 3D BOOK RIG (Width: Left 480px + Spine 24px + Right 480px = 984px) */}
            <div
              style={{ width: '984px', height: '540px' }}
              className="relative rounded-2xl shadow-2xl flex border border-slate-700/60 overflow-visible"
            >
              {/* ================= 1. LEFT STATIC SPREAD CONTAINER (Visible when unfolded) ================= */}
              <div
                style={{
                  width: '480px',
                  height: '540px',
                  opacity: readerState === 'reading' ? 1 : 0,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={() => setIsHoverLeft(true)}
                onMouseLeave={() => setIsHoverLeft(false)}
                onClick={() => {
                  if (currentSpread > 0 && !flipState && readerState === 'reading') handlePrevPage()
                }}
                className={`relative rounded-l-2xl overflow-hidden flex flex-col justify-between border-r border-[#e5dec9] ${
                  currentSpread > 0 && readerState === 'reading' ? 'cursor-pointer' : ''
                }`}
              >
                {/* Shadows */}
                <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-black/20 via-black/5 to-transparent pointer-events-none z-10" />
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-10" />

                {/* Left Hover Indicator */}
                {currentSpread > 0 && readerState === 'reading' && (
                  <div
                    className={`absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-teal-500/20 via-teal-500/5 to-transparent flex items-center justify-start pl-4 z-20 transition-opacity duration-300 pointer-events-none ${
                      isHoverLeft && !flipState ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-950/85 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold shadow-xl animate-pulse">
                      <ChevronLeft className="w-4 h-4 text-teal-400" />
                      <span>上一页</span>
                    </div>
                  </div>
                )}

                {/* Fixed-Width Left Page Content */}
                <PageContent
                  title={
                    flipState?.direction === 'prev'
                      ? flippingToSpread.leftTitle
                      : activeSpread.leftTitle
                  }
                  pageNumber={
                    flipState?.direction === 'prev'
                      ? flipState.toSpread * 2 + 1
                      : currentSpread * 2 + 1
                  }
                  content={
                    flipState?.direction === 'prev'
                      ? flippingToSpread.leftContent
                      : activeSpread.leftContent
                  }
                  isLeft={true}
                  bookTitle={book.title}
                  bookAuthor={book.author}
                />
              </div>

              {/* ================= 2. CENTRAL BOOK SPINE (Fixed 24px) ================= */}
              <div
                style={{
                  width: '24px',
                  height: '540px',
                  opacity: readerState === 'reading' ? 1 : isClosedOrClosing ? 0 : 1,
                  transition: 'opacity 0.4s ease'
                }}
                className="relative bg-gradient-to-r from-[#d8ceb8] via-[#9e9276] to-[#d8ceb8] shadow-inner flex flex-col items-center justify-between py-6 z-20 flex-shrink-0"
              >
                <div className="w-3 h-24 bg-gradient-to-b from-rose-700 via-rose-600 to-rose-800 shadow-lg rounded-b-sm transform -translate-y-6" />
                <div className="w-0.5 h-full bg-black/40" />
              </div>

              {/* ================= 3. RIGHT STATIC BASE SPREAD (Right Notes Page) ================= */}
              <div
                style={{ width: '480px', height: '540px' }}
                onMouseEnter={() => setIsHoverRight(true)}
                onMouseLeave={() => setIsHoverRight(false)}
                onClick={() => {
                  if (currentSpread < totalSpreads - 1 && !flipState && readerState === 'reading') handleNextPage()
                }}
                className={`relative rounded-r-2xl overflow-hidden flex flex-col justify-between border-l border-[#e5dec9] ${
                  currentSpread < totalSpreads - 1 && readerState === 'reading' ? 'cursor-pointer' : ''
                }`}
              >
                {/* Shadows */}
                <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-10" />
                <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-10" />

                {/* Right Hover Indicator */}
                {currentSpread < totalSpreads - 1 && readerState === 'reading' && (
                  <div
                    className={`absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-emerald-500/20 via-emerald-500/5 to-transparent flex items-center justify-end pr-4 z-20 transition-opacity duration-300 pointer-events-none ${
                      isHoverRight && !flipState ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-950/85 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold shadow-xl animate-pulse">
                      <span>下一页</span>
                      <ChevronRight className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                )}

                {/* Fixed-Width Right Page Content */}
                <PageContent
                  title={
                    flipState?.direction === 'next'
                      ? flippingToSpread.rightTitle
                      : activeSpread.rightTitle
                  }
                  pageNumber={
                    flipState?.direction === 'next'
                      ? flipState.toSpread * 2 + 2
                      : currentSpread * 2 + 2
                  }
                  content={
                    flipState?.direction === 'next'
                      ? flippingToSpread.rightContent
                      : activeSpread.rightContent
                  }
                  isLeft={false}
                  bookTitle={book.title}
                  bookAuthor={book.author}
                />
              </div>

              {/* ================= 4. REVOLUTIONARY COVER WING (Flips 180° around central spine) ================= */}
              {readerState !== 'reading' && (
                <div
                  style={{
                    position: 'absolute',
                    left: '504px', // Pivot aligned precisely with the right edge of spine
                    top: '0px',
                    width: '480px',
                    height: '540px',
                    zIndex: 50,
                    transformOrigin: 'left center', // Central spine pivot
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none',
                    transform:
                      readerState === 'closed' || readerState === 'folding_close'
                        ? 'rotateY(0deg)'
                        : 'rotateY(-180deg)',
                    transition:
                      readerState === 'unfolding'
                        ? 'transform 0.95s cubic-bezier(0.25, 1, 0.5, 1)'
                        : readerState === 'folding_close'
                        ? 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)'
                        : 'none'
                  }}
                >
                  {/* FRONT SIDE (0 deg): HIGH RESOLUTION BOOK COVER (Covers Right Page when closed) */}
                  <div
                    style={{
                      width: '480px',
                      height: '540px',
                      backfaceVisibility: 'hidden'
                    }}
                    className="absolute inset-0 rounded-r-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900"
                  >
                    <img
                      src={toAbsolute(book.coverUrl)}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-white/10" />
                    {/* Left Spine Crease */}
                    <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-black/60 to-transparent" />
                  </div>

                  {/* BACK SIDE (180 deg): INSIDE LEFT PAGE (Becomes Left Page when unfolded) */}
                  <div
                    style={{
                      width: '480px',
                      height: '540px',
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden'
                    }}
                    className="absolute inset-0 rounded-l-2xl overflow-hidden shadow-2xl border-y border-l border-[#e5dec9]"
                  >
                    <PageContent
                      title={activeSpread.leftTitle}
                      pageNumber={1}
                      content={activeSpread.leftContent}
                      isLeft={true}
                      bookTitle={book.title}
                      bookAuthor={book.author}
                    />
                  </div>
                </div>
              )}

              {/* ================= 5. DOUBLE-SIDED 3D PAGE TURN FLIPPER (During Reading) ================= */}
              {flipState?.direction === 'next' && (
                <div
                  style={{
                    position: 'absolute',
                    left: '504px',
                    top: '0px',
                    width: '480px',
                    height: '540px',
                    zIndex: 40,
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none',
                    animation: 'pageFlipNext 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                  }}
                >
                  {/* Front: Right Page being turned away */}
                  <div
                    style={{
                      width: '480px',
                      height: '540px',
                      backfaceVisibility: 'hidden'
                    }}
                    className="absolute inset-0 overflow-hidden shadow-2xl"
                  >
                    <PageContent
                      title={flippingFromSpread.rightTitle}
                      pageNumber={flipState.fromSpread * 2 + 2}
                      content={flippingFromSpread.rightContent}
                      isLeft={false}
                      bookTitle={book.title}
                      bookAuthor={book.author}
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  </div>

                  {/* Back: Left Page of Next Spread */}
                  <div
                    style={{
                      width: '480px',
                      height: '540px',
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden'
                    }}
                    className="absolute inset-0 overflow-hidden shadow-2xl"
                  >
                    <PageContent
                      title={flippingToSpread.leftTitle}
                      pageNumber={flipState.toSpread * 2 + 1}
                      content={flippingToSpread.leftContent}
                      isLeft={true}
                      bookTitle={book.title}
                      bookAuthor={book.author}
                    />
                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                  </div>
                </div>
              )}

              {flipState?.direction === 'prev' && (
                <div
                  style={{
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '480px',
                    height: '540px',
                    zIndex: 40,
                    transformOrigin: 'right center',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none',
                    animation: 'pageFlipPrev 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                  }}
                >
                  {/* Front: Left Page being turned back */}
                  <div
                    style={{
                      width: '480px',
                      height: '540px',
                      backfaceVisibility: 'hidden'
                    }}
                    className="absolute inset-0 overflow-hidden shadow-2xl"
                  >
                    <PageContent
                      title={flippingFromSpread.leftTitle}
                      pageNumber={flipState.fromSpread * 2 + 1}
                      content={flippingFromSpread.leftContent}
                      isLeft={true}
                      bookTitle={book.title}
                      bookAuthor={book.author}
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                  </div>

                  {/* Back: Right Page of Prev Spread */}
                  <div
                    style={{
                      width: '480px',
                      height: '540px',
                      transform: 'rotateY(-180deg)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <PageContent
                      title={flippingToSpread.rightTitle}
                      pageNumber={flipState.toSpread * 2 + 2}
                      content={flippingToSpread.rightContent}
                      isLeft={false}
                      bookTitle={book.title}
                      bookAuthor={book.author}
                    />
                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Page Navigation Toolbar */}
        <div className="relative z-30 flex items-center justify-between pt-3 border-t border-slate-800/80">
          <button
            onClick={handlePrevPage}
            disabled={currentSpread === 0 || flipState !== null || readerState !== 'reading'}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-200 text-xs font-semibold disabled:opacity-30 transition-all cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-4 h-4 text-teal-400" />
            <span>上一页 (←)</span>
          </button>

          {/* Quick Page Jump Dots */}
          <div className="flex items-center space-x-2">
            {spreads.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (readerState === 'reading' && !flipState && i !== currentSpread) {
                    const dir = i > currentSpread ? 'next' : 'prev'
                    setFlipState({ direction: dir, fromSpread: currentSpread, toSpread: i })
                    setTimeout(() => {
                      setCurrentSpread(i)
                      setFlipState(null)
                    }, 700)
                  }
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentSpread
                    ? 'w-8 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md shadow-teal-500/40'
                    : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`第 ${i * 2 + 1}-${i * 2 + 2} 页`}
              />
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentSpread === totalSpreads - 1 || flipState !== null || readerState !== 'reading'}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 text-xs font-bold disabled:opacity-30 transition-all cursor-pointer shadow-lg shadow-teal-500/20"
          >
            <span>下一页 (→)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
