export type NavigationTab = 'home' | 'learning' | 'hobbies' | 'books' | 'other'

export type PostType = 'article' | 'quiz' | 'coding'

export type SupportedLanguage = 'javascript' | 'typescript' | 'python'

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizItem {
  id: string
  question: string
  options: QuizOption[]
  explanation: string // Markdown format
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
}

export interface TestCase {
  id: string
  name: string
  code: string // Test case execution code snippet
  expectedOutput: string
}

export interface LanguageTemplate {
  language: SupportedLanguage
  label: string
  extension: string
  starterCode: string
  solutionCode: string
}

export interface CodingChallenge {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string // Markdown format
  starterCode: string
  solutionCode: string
  testCases: TestCase[]
  hints?: string[]
  languageTemplates?: LanguageTemplate[]
}

export interface Post {
  id: string
  title: string
  summary: string
  category: string
  date: string
  readTime: string
  tags: string[]
  content: string // Markdown
  type?: PostType // 'article' (default) | 'quiz' | 'coding'
  quizzes?: QuizItem[]
  codingChallenge?: CodingChallenge
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

export type BookFormat = 'markdown' | 'pdf' | 'epub' | 'txt' | 'mixed'

export interface BookPageItem {
  pageNumber: number
  title?: string
  subtitle?: string
  chapter?: string
  type: 'cover' | 'copyright' | 'content' | 'illustration' | 'notes' | 'back-cover' | 'pdf-page' | 'code-page' | 'epub-section'
  content?: string // Markdown / Plain text content
  format?: 'markdown' | 'pdf' | 'epub' | 'txt' | 'code'
  image?: string
  pdfPageNumber?: number
  pdfUrl?: string
  codeLanguage?: string
  codeSnippet?: string
  quote?: string
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
  lastPage?: number // 最近阅读的 bookPages 页码（断点续读，来自 DB 实时进度）
  summary: string
  excerpt?: string // Original book excerpt in Markdown
  thoughts: string // Reading notes in Markdown format
  tags: string[]
  publishYear?: string
  pages?: number
  spineColor?: string // 3D Spine color for realistic visual
  formats?: BookFormat[] // Supported electronic formats
  pdfUrl?: string
  epubUrl?: string
  bookPages?: BookPageItem[] // Structured 6-8 pages for realistic 3D curl flipping
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
