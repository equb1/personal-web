import React, { useState, useEffect } from 'react'
import { NavigationTab, Post, HobbyVideo, Book, Comment } from './types'
import {
  SAMPLE_POSTS,
  SAMPLE_VIDEOS,
  SAMPLE_BOOKS,
  SAMPLE_PROJECTS,
  SAMPLE_TIMELINE,
  INITIAL_COMMENTS
} from './data/mockData'

import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { VideoModal } from './components/VideoModal'
import { BookDetailModal } from './components/BookDetailModal'
import { CommandMenu } from './components/CommandMenu'

import { HomePage } from './pages/HomePage'
import { LearningPage } from './pages/LearningPage'
import { HobbiesPage } from './pages/HobbiesPage'
import { BooksPage } from './pages/BooksPage'
import { OtherPage } from './pages/OtherPage'

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home')
  
  // Data States
  const [posts] = useState<Post[]>(SAMPLE_POSTS)
  const [videos] = useState<HobbyVideo[]>(SAMPLE_VIDEOS)
  const [books] = useState<Book[]>(SAMPLE_BOOKS)
  const [projects] = useState(SAMPLE_PROJECTS)
  const [timeline] = useState(SAMPLE_TIMELINE)
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS)

  // Selection & Modal States
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<HobbyVideo | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  // Command Menu Modal State
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false)

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandMenuOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab)
    setSelectedPost(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectPostFromSearchOrHome = (post: Post) => {
    setSelectedPost(post)
    setActiveTab('learning')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddComment = (newComment: Comment) => {
    setComments([newComment, ...comments])
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={handleTabChange}
            onSelectPost={handleSelectPostFromSearchOrHome}
            onSelectVideo={setSelectedVideo}
            onSelectBook={setSelectedBook}
            posts={posts}
            videos={videos}
            books={books}
          />
        )}

        {activeTab === 'learning' && (
          <LearningPage
            posts={posts}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
          />
        )}

        {activeTab === 'hobbies' && (
          <HobbiesPage
            videos={videos}
            onSelectVideo={setSelectedVideo}
          />
        )}

        {activeTab === 'books' && (
          <BooksPage
            books={books}
            onSelectBook={setSelectedBook}
          />
        )}

        {activeTab === 'other' && (
          <OtherPage
            projects={projects}
            timeline={timeline}
            comments={comments}
            onAddComment={handleAddComment}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Command Menu */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        posts={posts}
        videos={videos}
        books={books}
        projects={projects}
        onSelectPost={handleSelectPostFromSearchOrHome}
        onSelectVideo={setSelectedVideo}
        onSelectBook={setSelectedBook}
        onNavigate={handleTabChange}
      />
    </div>
  )
}

export default App
