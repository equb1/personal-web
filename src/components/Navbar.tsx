import React from 'react'
import { NavigationTab } from '../types'
import { Home, BookOpen, Film, BookmarkCheck, Sparkles, Terminal } from 'lucide-react'

interface NavbarProps {
  activeTab: NavigationTab
  setActiveTab: (tab: NavigationTab) => void
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'learning', label: '学习', icon: BookOpen },
    { id: 'hobbies', label: '兴趣', icon: Film },
    { id: 'books', label: '书籍', icon: BookmarkCheck },
    { id: 'other', label: '其他', icon: Sparkles },
  ]

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/70 border-b border-slate-800/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight gradient-text">ZENITH</span>
            <span className="text-xs block text-slate-400 font-mono">Personal Space</span>
          </div>
        </div>

        {/* Navigation Tabs - Desktop */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-lg">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive
                    ? 'text-white shadow-md shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 rounded-full -z-10 animate-fade-in" />
                )}
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
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
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
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
