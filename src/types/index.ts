export type NavigationTab = 'home' | 'learning' | 'hobbies' | 'books' | 'other'

export interface Post {
  id: string
  title: string
  summary: string
  category: string
  date: string
  readTime: string
  tags: string[]
  content: string
  coverImage?: string
  views: number
  likes: number
}

export interface HobbyVideo {
  id: string
  title: string
  description: string
  category: 'vlog' | 'tech' | 'music' | 'gaming'
  videoUrl: string
  posterUrl: string
  duration: string
  date: string
  views: number
}

export interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  category: string
  rating: number
  status: 'reading' | 'completed' | 'want-to-read'
  progress: number
  summary: string
  thoughts: string // Markdown format
  tags: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  demoUrl?: string
  icon: string
  stars: number
}

export interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  date: string
  likes: number
}

export interface TimelineItem {
  year: string
  title: string
  companyOrContext: string
  description: string
  icon: string
}
