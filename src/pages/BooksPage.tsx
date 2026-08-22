import React, { useState, useRef, useEffect } from 'react'
import { Book } from '../types'
import {
  BookmarkCheck,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  Grid,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RotateCw,
  RefreshCw,
  Compass,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react'

interface BooksPageProps {
  books: Book[]
  onSelectBook: (book: Book) => void
}

export const BooksPage: React.FC<BooksPageProps> = ({ books, onSelectBook }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'reading' | 'completed'>('all')
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d')
  const [currentIndex, setCurrentIndex] = useState(0)

  // 3D Object Rotation State (X/Y Euler angles for 360° free rotation)
  const [rotateX, setRotateX] = useState(8)
  const [rotateY, setRotateY] = useState(-25)
  const [isDraggingBook, setIsDraggingBook] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)

  const startPosRef = useRef({ x: 0, y: 0, rx: 8, ry: -25 })
  const bookStageRef = useRef<HTMLDivElement>(null)

  const filteredBooks = books.filter(
    (b) => filterStatus === 'all' || b.status === filterStatus
  )

  const currentBook = filteredBooks[currentIndex] || filteredBooks[0]

  // Auto Rotation Loop
  useEffect(() => {
    if (!autoRotate || isDraggingBook || viewMode !== '3d') return

    const interval = setInterval(() => {
      setRotateY((prev) => (prev + 0.8) % 360)
    }, 16)

    return () => clearInterval(interval)
  }, [autoRotate, isDraggingBook, viewMode])

  // Direct 3D Book Drag Rotation (Mouse / Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingBook(true)
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      rx: rotateX,
      ry: rotateY
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Ignore
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingBook) return
    const deltaX = e.clientX - startPosRef.current.x
    const deltaY = e.clientY - startPosRef.current.y

    // Rotation sensitivity
    const sensitivity = 0.65

    setRotateY(startPosRef.current.ry + deltaX * sensitivity)
    // Clamp X rotation between -45 and 45 deg to maintain comfortable perspective
    setRotateX(Math.max(-40, Math.min(40, startPosRef.current.rx - deltaY * sensitivity)))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingBook) return
    setIsDraggingBook(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignore
    }
  }

  // Quick Preset Angles
  const setAnglePreset = (x: number, y: number) => {
    setAutoRotate(false)
    setRotateX(x)
    setRotateY(y)
  }

  const handleNextBook = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredBooks.length)
    setRotateX(8)
    setRotateY(-25)
  }

  const handlePrevBook = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredBooks.length) % filteredBooks.length)
    setRotateX(8)
    setRotateY(-25)
  }

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
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">360° 交互式 3D 实体书房</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                按住书本任意方向拖拽，即可 360° 旋转检视封面、书脊与封底。
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
              <span>3D 检视展台</span>
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
            { id: 'all', label: '全部藏书' },
            { id: 'reading', label: '正在阅读中' },
            { id: 'completed', label: '已研读完结' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setFilterStatus(item.id as any)
                setCurrentIndex(0)
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

      {/* 3D Model Stage View */}
      {viewMode === '3d' && currentBook ? (
        <div className="space-y-8">
          {/* Main 3D Stage Box */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#070e1b] to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-10 overflow-hidden">
            {/* Top Stage Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  3D Book Model Inspector
                </span>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  X: {Math.round(rotateX)}° | Y: {Math.round(rotateY)}°
                </span>
              </div>

              {/* Viewpoint Quick Presets */}
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setAnglePreset(8, -25)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  正侧视 (3D)
                </button>
                <button
                  type="button"
                  onClick={() => setAnglePreset(0, 0)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  正封面
                </button>
                <button
                  type="button"
                  onClick={() => setAnglePreset(0, -90)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  看书脊
                </button>
                <button
                  type="button"
                  onClick={() => setAnglePreset(0, 180)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  看封底
                </button>
                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-all ${
                    autoRotate
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span>{autoRotate ? '停止自转' : '自动巡航自转'}</span>
                </button>
              </div>
            </div>

            {/* Interactive 3D Canvas / Stage (360° Drag) */}
            <div
              ref={bookStageRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-full h-[380px] sm:h-[430px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none my-2"
              style={{ perspective: '1200px' }}
            >
              {/* Drag Hint Banner */}
              <div className="absolute top-4 z-10 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 text-xs font-mono pointer-events-none shadow-lg">
                <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>鼠标按住书本即可向任意方向 360° 旋转把玩</span>
              </div>

              {/* 3D BOOK GEOMETRY (Width: 200px, Height: 290px, Thickness/Depth: 36px) */}
              <div
                style={{
                  width: '200px',
                  height: '290px',
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                  transition: isDraggingBook ? 'none' : 'transform 0.15s ease-out',
                  willChange: 'transform'
                }}
                className="relative"
              >
                {/* 1. FRONT COVER (正面封面) */}
                <div
                  style={{
                    transform: 'translateZ(18px)',
                    backfaceVisibility: 'hidden'
                  }}
                  className="absolute inset-0 rounded-r-xl overflow-hidden shadow-2xl bg-slate-900 border-y border-r border-slate-600/60"
                >
                  <img
                    src={currentBook.coverUrl}
                    alt={currentBook.title}
                    draggable={false}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  {/* Dynamic Gloss / Sheen Highlight */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(${105 + rotateY * 0.5}deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)`
                    }}
                  />
                  {/* Left Spine Fold Shadow */}
                  <div className="absolute top-0 bottom-0 left-3 w-1.5 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-950/90 text-teal-300 backdrop-blur-md border border-slate-800">
                    {currentBook.category}
                  </div>
                </div>

                {/* 2. BACK COVER (背面封底) */}
                <div
                  style={{
                    transform: 'rotateY(180deg) translateZ(18px)',
                    backfaceVisibility: 'hidden'
                  }}
                  className={`absolute inset-0 rounded-l-xl overflow-hidden p-5 bg-gradient-to-br ${
                    currentBook.spineColor || 'from-slate-900 to-slate-950'
                  } border-y border-l border-slate-700 text-slate-300 flex flex-col justify-between shadow-2xl`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-teal-300 text-xs font-mono font-bold">
                      <BookmarkCheck className="w-4 h-4" />
                      <span>{currentBook.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{currentBook.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-4">
                      {currentBook.summary}
                    </p>
                  </div>

                  {/* Back Cover Barcode & Publishing Info */}
                  <div className="pt-3 border-t border-slate-700/80 flex items-end justify-between">
                    <div className="space-y-0.5 text-[9px] font-mono text-slate-400">
                      <div>ISBN 978-7-111-54493-2</div>
                      <div>Zenith Press • Edition 2026</div>
                    </div>
                    {/* Simulated Barcode */}
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

                {/* 3. LEFT SPINE (左侧立体书脊厚度 36px) */}
                <div
                  style={{
                    width: '36px',
                    height: '290px',
                    transform: 'rotateY(-90deg) translateZ(18px)',
                    left: '0px'
                  }}
                  className={`absolute top-0 bottom-0 bg-gradient-to-r ${
                    currentBook.spineColor || 'from-slate-800 via-slate-700 to-slate-900'
                  } border-y border-slate-600/50 shadow-inner flex flex-col justify-between py-5 px-1 text-center font-mono text-slate-100 select-none`}
                >
                  <div className="text-[8px] font-bold text-teal-300">ZENITH</div>
                  <div
                    className="font-bold text-[10px] tracking-widest text-teal-100 truncate"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    {currentBook.title}
                  </div>
                  <div className="text-[8px] text-slate-400" style={{ writingMode: 'vertical-rl' }}>
                    {currentBook.author}
                  </div>
                </div>

                {/* 4. RIGHT PAGES EDGE (右侧书页层叠厚切面 36px) */}
                <div
                  style={{
                    width: '36px',
                    height: '290px',
                    transform: 'rotateY(90deg) translateZ(182px)',
                    left: '0px',
                    backgroundImage: 'repeating-linear-gradient(0deg, #e8e2d5, #e8e2d5 2px, #fdfaf2 2px, #fdfaf2 4px)',
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4)'
                  }}
                  className="absolute top-0 bottom-0 bg-[#f5f0e6] rounded-r-sm opacity-95 border-y border-slate-500/40"
                />

                {/* 5. TOP PAGES EDGE (书本顶部切面) */}
                <div
                  style={{
                    width: '200px',
                    height: '36px',
                    transform: 'rotateX(90deg) translateZ(18px)',
                    top: '0px',
                    backgroundImage: 'repeating-linear-gradient(90deg, #eae4d8, #eae4d8 2px, #fbf7ee 2px, #fbf7ee 4px)',
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.4)'
                  }}
                  className="absolute left-0 right-0 bg-[#f5f0e6] border-x border-slate-600/40"
                />

                {/* 6. BOTTOM PAGES EDGE (书本底部切面) */}
                <div
                  style={{
                    width: '200px',
                    height: '36px',
                    transform: 'rotateX(-90deg) translateZ(272px)',
                    top: '0px',
                    backgroundColor: '#e2dcce',
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5)'
                  }}
                  className="absolute left-0 right-0 border-x border-slate-600/40"
                />
              </div>

              {/* Dynamic 3D Contact Shadow on Floor */}
              <div
                style={{
                  transform: `translateY(190px) rotateX(90deg) rotateZ(${-rotateY * 0.5}deg) scale(${
                    1 + Math.abs(Math.sin((rotateY * Math.PI) / 180)) * 0.2
                  })`,
                  width: '220px',
                  height: '110px'
                }}
                className="absolute bg-black/85 rounded-full blur-xl pointer-events-none transition-transform duration-75"
              />
            </div>

            {/* Bottom Book Switcher Carousel Bar */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevBook}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-teal-400" />
                <span>上一本书</span>
              </button>

              {/* Book Select Tabs */}
              <div className="flex items-center space-x-2">
                {filteredBooks.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx)
                      setRotateX(8)
                      setRotateY(-25)
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-8 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md shadow-teal-500/40'
                        : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={b.title}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextBook}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <span>下一本书</span>
                <ChevronRight className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          </div>

          {/* Book Details Summary Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {currentBook.category}
                </span>
                <span className="flex items-center space-x-1 text-xs text-slate-400">
                  {currentBook.status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{currentBook.status === 'completed' ? '已全书研读完结' : `在读 (${currentBook.progress}%)`}</span>
                </span>
                <div className="flex items-center space-x-0.5 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < currentBook.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{currentBook.title}</h2>
              <p className="text-xs text-slate-400 font-medium">作者：{currentBook.author}</p>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl pt-1">{currentBook.summary}</p>
            </div>

            <button
              type="button"
              onClick={() => onSelectBook(currentBook)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs hover:from-emerald-300 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20 flex items-center space-x-2 flex-shrink-0 cursor-pointer group"
            >
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>从书架取下 · 桌面 3D 卷角翻阅</span>
            </button>
          </div>
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
                      src={book.coverUrl}
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
