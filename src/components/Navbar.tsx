import React from 'react'
import { NavigationTab } from '../types'
import { Home, BookOpen, Film, BookmarkCheck, Sparkles, Compass, Search, Command } from 'lucide-react'

interface NavbarProps {
  activeTab: NavigationTab
  setActiveTab: (tab: NavigationTab) => void
  onOpenCommandMenu: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenCommandMenu }) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'learning', label: '学习', icon: BookOpen },
    { id: 'hobbies', label: '兴趣', icon: Film },
    { id: 'books', label: '书籍', icon: BookmarkCheck },
    { id: 'other', label: '其他', icon: Sparkles },
  ]

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight gradient-text">ZENITH</span>
            <span className="text-xs block text-slate-400 font-mono">Digital Garden</span>
          </div>
        </div>

        {/* Center: Search Trigger Bar */}
        <button
          onClick={onOpenCommandMenu}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 text-slate-400 hover:text-slate-200 text-xs transition-all w-44 sm:w-64 justify-between"
        >
          <div className="flex items-center space-x-2 truncate">
            <Search className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span className="truncate">搜索文章、视频、书籍...</span>
          </div>
          <div className="hidden sm:flex items-center space-x-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>

        {/* Navigation Tabs - Desktop */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/70 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-lg">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive
                    ? 'text-slate-950 font-semibold shadow-md shadow-teal-500/15'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full -z-10 animate-fade-in" />
                )}
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110 text-slate-950' : ''}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center">
          <div className="flex space-x-1 bg-slate-900/90 p-1 rounded-full border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`p-2 rounded-full transition-all ${
                    isActive ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
