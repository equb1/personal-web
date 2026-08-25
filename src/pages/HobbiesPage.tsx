import React, { useState } from 'react'
import { HobbyVideo } from '../types'
import { Film, Play, Eye, Calendar, Clock } from 'lucide-react'
import { toAbsolute } from '../utils/url'

interface HobbiesPageProps {
  videos: HobbyVideo[]
  onSelectVideo: (video: HobbyVideo) => void
}

export const HobbiesPage: React.FC<HobbiesPageProps> = ({ videos, onSelectVideo }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: '全部项目' },
    { id: 'vlog', label: '城市 Vlog & 航拍' },
    { id: 'tech', label: '桌面 Setup & 硬件' },
    { id: 'music', label: '指弹吉他 & 音乐' }
  ]

  const filteredVideos = videos.filter(
    (v) => selectedCategory === 'all' || v.category === selectedCategory
  )

  return (
    <div className="space-y-10 py-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
            <Film className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">兴趣、影音与生活美学</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              记录城市流光 4K 航拍、无线化沉浸式桌面搭建以及吉他单轨录音。点击唤起高清全功能播放器。
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="pt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video)}
            className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-500/40 cursor-pointer group flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
          >
            {/* Video Poster with Play Overlay */}
            <div className="relative aspect-video overflow-hidden bg-slate-950">
              <img
                src={toAbsolute(video.posterUrl)}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-slate-950 translate-x-0.5" />
                </div>
              </div>

              {/* Top Badges */}
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-950/80 text-teal-300 backdrop-blur-md border border-slate-800 uppercase">
                {video.category}
              </div>

              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/90 text-slate-300 font-mono text-[10px] flex items-center space-x-1">
                <Clock className="w-3 h-3 text-teal-400" />
                <span>{video.duration}</span>
              </div>
            </div>

            {/* Video Card Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-100 text-base group-hover:text-teal-300 transition-colors line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-teal-400" />
                  <span>{video.date}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-3 h-3 text-teal-400" />
                  <span>{video.views} 播放</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
