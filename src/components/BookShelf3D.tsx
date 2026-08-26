import React, { useEffect, useRef, useState } from 'react'
import { motion, animate } from 'framer-motion'
import { Book } from '../types'
import { Compass, RotateCw, Undo2, BookmarkCheck } from 'lucide-react'
import { toAbsolute } from '../utils/url'

interface BookShelf3DProps {
  books: Book[]
  onRead: (book: Book) => void
  onInspectChange: (book: Book | null) => void
}

// Unified 6-face book box (same geometry as the 3D inspector):
//   front cover 200 wide, 290 tall, 36 thick. Standing on the shelf with the
//   wrapper rotated rotateY(90) so the SPINE faces the viewer (+z). Pulling a
//   book out simply animates that wrapper forward (+z) while turning it to the
//   inspection pose — one continuous action.
const BOOK_W = 200
const BOOK_H = 290
const SPINE_T = 36
const GAP = 10
const PITCH = SPINE_T + GAP
const SHELF_PAD = 60
const BOARD_H = BOOK_H + 46
const BOOK_DEPTH = BOOK_W // front-to-back depth while standing spine-out
const PLANK_D = BOOK_DEPTH + 56
const PLANK_TOP = BOARD_H - PLANK_D / 2
const MAX_WIDTH = 820

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const TILT = 12 // shelf perspective tilt when on the shelf

export const BookShelf3D: React.FC<BookShelf3DProps> = ({ books, onRead, onInspectChange }) => {
  const [inspectBook, setInspectBook] = useState<Book | null>(null)
  const [phase, setPhase] = useState<'pull' | 'return' | null>(null)
  const [shelfRot, setShelfRot] = useState(0)
  const [tilt, setTilt] = useState(TILT)
  const [dragging, setDragging] = useState(false)

  // Inspected book rotation (user-draggable 360°)
  const [rotateX, setRotateX] = useState(8)
  const [rotateY, setRotateY] = useState(-25)
  const [isDraggingBook, setIsDraggingBook] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    rotX0: 0,
    rotY0: 0,
    shelfRot0: 0,
    moved: false,
    active: false,
    target: null as HTMLElement | null
  })
  const timeoutsRef = useRef<number[]>([])

  // Normalize an angle to [0, 360).
  const normalizeAngle = (deg: number) => ((deg % 360) + 360) % 360

  // Snap `target` to the whole-turn equivalent nearest to `current`, so framer-
  // motion tweens take the shortest path instead of spinning backwards a full
  // turn (which is what "跳回起点重新转" felt like).
  const nearCurrent = (target: number, current: number) => {
    const diff = normalizeAngle(target - current)
    return current + (diff > 180 ? diff - 360 : diff)
  }

  // Reset inspection if the book leaves the list (filter change). Stays in an
  // effect because onInspectChange() notifies the parent (calling it during
  // render is not allowed); this is an external-system sync, not derived state.
  useEffect(() => {
    if (inspectBook && !books.some((b) => b.id === inspectBook.id)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInspectBook(null)
      onInspectChange(null)
      setPhase(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books])

  // When a book is pulled out, swing the shelf flat + front-facing and tilt it
  // upright so the inspected book reads like the standalone 360° inspection
  // stage. Restore the tilted shelf pose when the book is put back.
  useEffect(() => {
    const targetTilt = inspectBook ? 0 : TILT
    const fromTilt = tilt
    const fromRot = shelfRot
    const controls = animate(0, 1, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: (t) => {
        setTilt(fromTilt + (targetTilt - fromTilt) * t)
        setShelfRot(fromRot * (1 - t))
      }
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectBook])

  // Auto-rotate the inspected book — rotateY grows unbounded so the rotation is
  // continuous; wrapping it with `% 360` made framer-motion tween backwards a
  // full turn each time it crossed 360°.
  useEffect(() => {
    if (!inspectBook || phase || isDraggingBook || !autoRotate) return
    const id = setInterval(() => setRotateY((p) => p + 0.8), 16)
    return () => clearInterval(id)
  }, [inspectBook, phase, isDraggingBook, autoRotate])

  useEffect(() => () => timeoutsRef.current.forEach((t) => clearTimeout(t)), [])

  if (books.length === 0) return null

  const totalWidth = books.length * PITCH - GAP + SHELF_PAD * 2
  const fitScale = Math.min(1, MAX_WIDTH / totalWidth)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase) return
    // Let control-bar buttons receive their own clicks — pointer capture would
    // swallow them, and we must clear any stale drag state so the following
    // pointerup is ignored.
    if ((e.target as HTMLElement).closest?.('[data-stage-control]')) {
      dragRef.current = {
        startX: 0,
        startY: 0,
        rotX0: 0,
        rotY0: 0,
        shelfRot0: 0,
        moved: false,
        active: false,
        target: null
      }
      return
    }
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      rotX0: rotateX,
      rotY0: rotateY,
      shelfRot0: shelfRot,
      moved: false,
      active: true,
      target: e.target as HTMLElement
    }
    if (inspectBook) setIsDraggingBook(true)
    else setDragging(true)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Ignore
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging && !isDraggingBook) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) + Math.abs(dy) > 4) dragRef.current.moved = true
    const sens = 0.65
    if (inspectBook) {
      setRotateY(dragRef.current.rotY0 + dx * sens)
      setRotateX(Math.max(-40, Math.min(40, dragRef.current.rotX0 - dy * sens)))
    } else {
      setShelfRot(dragRef.current.shelfRot0 + dx * 0.4)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) setDragging(false)
    if (isDraggingBook) setIsDraggingBook(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignore
    }
    // Ignore pointerups that did not start a captured interaction (e.g. clicking
    // a control-bar button) to avoid acting on stale drag state.
    if (!dragRef.current.active || phase || dragRef.current.moved) return
    const el = dragRef.current.target?.closest?.('[data-book-id]')
    const id = el?.getAttribute('data-book-id')
    if (inspectBook) {
      if (id === inspectBook.id) onRead(inspectBook)
      return
    }
    const book = books.find((b) => b.id === id)
    if (book) pullOut(book)
  }

  const pullOut = (book: Book) => {
    if (phase) return
    setInspectBook(book)
    setPhase('pull')
    onInspectChange(book)
    setRotateX(8)
    setRotateY((prev) => nearCurrent(-25, prev))
    setAutoRotate(false)
    timeoutsRef.current.push(window.setTimeout(() => setPhase(null), 720))
  }

  const putBack = () => {
    if (!inspectBook || phase) return
    setPhase('return')
    setAutoRotate(false)
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setInspectBook(null)
        onInspectChange(null)
        setPhase(null)
      }, 560)
    )
  }

  const setAnglePreset = (x: number, y: number) => {
    setAutoRotate(false)
    setRotateX(x)
    setRotateY((prev) => nearCurrent(y, prev))
  }

  return (
    <div
      className="relative select-none touch-none overflow-hidden flex items-center justify-center"
      style={{ perspective: '1800px', perspectiveOrigin: '50% 40%', height: 540 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Floor contact shadow (shelf mode) */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[72%] h-14 bg-black/70 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 ${
          inspectBook ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Standalone inspection contact shadow (old-stage look) */}
      {inspectBook && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div
            style={{
              width: '240px',
              height: '120px',
              transform: `translateY(200px) rotateX(90deg) rotateZ(${-rotateY * 0.5}deg) scale(${
                1 + Math.abs(Math.sin((rotateY * Math.PI) / 180)) * 0.2
              })`,
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.85), transparent 70%)',
              borderRadius: '9999px',
              filter: 'blur(14px)'
            }}
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative"
        style={{ width: totalWidth, height: BOARD_H }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt}deg) rotateY(${shelfRot}deg) scale(${fitScale})`,
            willChange: 'transform'
          }}
        >
          {/* Back panel (fades out while a book is being inspected — masks the shelf) */}
          <motion.div
            className="absolute rounded-xl"
            animate={{ opacity: inspectBook ? 0 : 1 }}
            transition={{ duration: 0.35 }}
            style={{
              left: -SHELF_PAD,
              top: -30,
              width: totalWidth + SHELF_PAD * 2,
              height: BOARD_H + 40,
              transform: `translateZ(${-(BOOK_DEPTH / 2 + 12)}px)`,
              background: 'linear-gradient(to bottom, #1c2737, #0e1729 82%, #0a1120)',
              boxShadow: 'inset 0 0 52px rgba(0,0,0,0.65)',
              border: '1px solid rgba(148,163,184,0.08)'
            }}
          />

          {/* Base plank */}
          <motion.div
            className="absolute rounded-md"
            animate={{ opacity: inspectBook ? 0 : 1 }}
            transition={{ duration: 0.35 }}
            style={{
              left: -SHELF_PAD - 8,
              top: PLANK_TOP,
              width: totalWidth + SHELF_PAD * 2 + 16,
              height: PLANK_D,
              transform: 'rotateX(-90deg)',
              background: 'linear-gradient(to bottom, #6b563f, #453a2b 45%, #292219)',
              boxShadow: '0 -8px 16px rgba(0,0,0,0.45), 0 12px 16px rgba(0,0,0,0.6)',
              borderTop: '1px solid rgba(255,255,255,0.14)'
            }}
          />

          {/* Books */}
          {books.map((b, i) => {
            const left = SHELF_PAD + i * PITCH
            const isInspecting = inspectBook?.id === b.id
            const dx = left + BOOK_W / 2 - totalWidth / 2
            const transition =
              phase === 'pull' && isInspecting
                ? { duration: 0.7, ease: EASE }
                : phase === 'return' && isInspecting
                ? { duration: 0.4, ease: EASE }
                : isDraggingBook || autoRotate
                ? { duration: 0 }
                : { duration: 0.35 }

            return (
              <motion.div
                key={b.id}
                data-book-id={b.id}
                initial={false}
                animate={
                  isInspecting
                    ? { rotateX, rotateY, z: 150, x: -dx, scale: 1.15 }
                    : { rotateX: 0, rotateY: 90, z: 0, x: 0, scale: 1, opacity: inspectBook ? 0 : 1 }
                }
                transition={transition}
                className="absolute cursor-pointer"
                style={{
                  left,
                  top: BOARD_H - BOOK_H,
                  width: BOOK_W,
                  height: BOOK_H,
                  transformStyle: 'preserve-3d',
                  pointerEvents: isInspecting ? 'auto' : 'none'
                }}
              >
                {/* 1. FRONT COVER (faces +x while on the shelf, +z when inspecting) */}
                <div
                  style={{ transform: 'translateZ(18px)', backfaceVisibility: 'hidden' }}
                  className="absolute inset-0 rounded-r-xl overflow-hidden shadow-2xl bg-slate-900 border-y border-r border-slate-600/60"
                >
                  <img
                    src={toAbsolute(b.coverUrl)}
                    alt={b.title}
                    draggable={false}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(${105 + rotateY * 0.5}deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)`
                    }}
                  />
                  <div className="absolute top-0 bottom-0 left-3 w-1.5 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-950/90 text-teal-300 backdrop-blur-md border border-slate-800">
                    {b.category}
                  </div>
                </div>

                {/* 2. BACK COVER */}
                <div
                  style={{ transform: 'rotateY(180deg) translateZ(18px)', backfaceVisibility: 'hidden' }}
                  className={`absolute inset-0 rounded-l-xl overflow-hidden p-5 bg-gradient-to-br ${
                    b.spineColor || 'from-slate-900 to-slate-950'
                  } border-y border-l border-slate-700 text-slate-300 flex flex-col justify-between shadow-2xl`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-teal-300 text-xs font-mono font-bold">
                      <BookmarkCheck className="w-4 h-4" />
                      <span>{b.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{b.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-4">{b.summary}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-700/80 flex items-end justify-between">
                    <div className="space-y-0.5 text-[9px] font-mono text-slate-400">
                      <div>ISBN 978-7-111-54493-2</div>
                      <div>Zenith Press • Edition 2026</div>
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

                {/* 3. LEFT SPINE — the visible shelf face, the click target */}
                <div
                  style={{
                    width: '36px',
                    height: '290px',
                    transform: 'rotateY(-90deg) translateZ(18px)',
                    left: '0px',
                    pointerEvents: 'auto'
                  }}
                  className={`absolute top-0 bottom-0 bg-gradient-to-r ${
                    b.spineColor || 'from-slate-800 via-slate-700 to-slate-900'
                  } border-y border-slate-600/50 shadow-inner flex flex-col justify-between py-5 px-1 text-center font-mono text-slate-100 select-none hover:brightness-110`}
                >
                  <div className="text-[8px] font-bold text-teal-300">ZENITH</div>
                  <div
                    className="font-bold text-[10px] tracking-widest text-teal-100 truncate"
                    style={{ writingMode: 'vertical-rl' }}
                  >
                    {b.title}
                  </div>
                  <div className="text-[8px] text-slate-400" style={{ writingMode: 'vertical-rl' }}>
                    {b.author}
                  </div>
                </div>

                {/* 4. RIGHT PAGES EDGE */}
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

                {/* 5. TOP PAGES EDGE */}
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

                {/* 6. BOTTOM PAGES EDGE */}
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
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 text-xs font-mono pointer-events-none shadow-lg">
        <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>
          {inspectBook
            ? '拖动旋转书本 · 点击书本进入阅读'
            : '拖动旋转书架 · 点击书脊抽出检视'}
        </span>
      </div>

      {/* Inspect mode control bar */}
      {inspectBook && (
        <div
          data-stage-control
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/85 border border-slate-800 text-xs font-mono shadow-2xl max-w-full"
        >
          <span className="px-2 text-teal-400 whitespace-nowrap">
            X:{Math.round(rotateX)}° Y:{Math.round(normalizeAngle(rotateY))}°
          </span>
          <button
            type="button"
            onClick={() => setAnglePreset(8, -25)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            正侧视
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
            <span>{autoRotate ? '停止自转' : '自动巡航'}</span>
          </button>
          <button
            type="button"
            onClick={putBack}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-500/40 text-teal-300 hover:bg-teal-500/25 transition-colors"
          >
            <Undo2 className="w-3 h-3" />
            <span>放回书架</span>
          </button>
        </div>
      )}
    </div>
  )
}
