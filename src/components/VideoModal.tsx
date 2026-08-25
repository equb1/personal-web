import React, { useRef, useState, useEffect } from 'react'
import { HobbyVideo } from '../types'
import { X, Play, Pause, Volume2, VolumeX, Maximize, Eye, Calendar, Sparkles } from 'lucide-react'
import { toAbsolute } from '../utils/url'

interface VideoModalProps {
  video: HobbyVideo | null
  onClose: () => void
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (videoRef.current && video) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => setIsPlaying(false))
    }
  }, [video])

  if (!video) return null

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const current = videoRef.current.currentTime
    const total = videoRef.current.duration
    if (total > 0) {
      setProgress((current / total) * 100)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pos * videoRef.current.duration
  }

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 uppercase">
              {video.category}
            </span>
            <h3 className="text-lg font-bold text-slate-100 truncate">{video.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video bg-black group overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            src={toAbsolute(video.videoUrl)}
            poster={toAbsolute(video.posterUrl)}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Play/Pause Overlay Icon when paused */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <Play className="w-8 h-8 fill-slate-950 translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Custom Video Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <div 
              onClick={handleSeek}
              className="w-full h-1.5 bg-slate-700/80 hover:h-2.5 rounded-full cursor-pointer transition-all mb-3 relative overflow-hidden"
            >
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <button onClick={togglePlay} className="hover:text-teal-400 transition-colors">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={toggleMute} className="hover:text-teal-400 transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <span className="text-xs font-mono text-slate-300">{video.duration}</span>
              </div>
              <button onClick={handleFullScreen} className="hover:text-teal-400 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Description & Metadata */}
        <div className="p-6 bg-slate-900 overflow-y-auto">
          <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{video.date}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>{video.views} 次播放</span>
            </span>
            <span className="flex items-center space-x-1 text-teal-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>4K High Definition</span>
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{video.description}</p>
        </div>
      </div>
    </div>
  )
}
