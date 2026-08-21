import React, { useState } from 'react'
import { Project, Comment, TimelineItem } from '../types'
import { Sparkles, Code2, Briefcase, MessageSquare, Send, Github } from 'lucide-react'

interface OtherPageProps {
  projects: Project[]
  timeline: TimelineItem[]
  comments: Comment[]
  onAddComment: (comment: Comment) => void
}

export const OtherPage: React.FC<OtherPageProps> = ({
  projects,
  timeline,
  comments,
  onAddComment
}) => {
  const [newAuthor, setNewAuthor] = useState('')
  const [newContent, setNewContent] = useState('')

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuthor.trim() || !newContent.trim()) return

    const commentItem: Comment = {
      id: Date.now().toString(),
      author: newAuthor,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 100)}?q=80&w=200&auto=format&fit=crop`,
      content: newContent,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      likes: 0
    }

    onAddComment(commentItem)
    setNewAuthor('')
    setNewContent('')
  }

  return (
    <div className="space-y-16 py-6 animate-fade-in">
      {/* Top Banner - About Me */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 p-1 flex-shrink-0 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
              alt="Avatar"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About & Portfolio Hub</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-100">Zenith 开发者 & 自由创造者</h1>

            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              热衷于全栈技术架构、前端清新 UI/UX 体验以及自主 AI 智能体应用。坚信优雅的代码与精致自然的视觉相得益彰。
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              {['React 19', 'TypeScript', 'TailwindCSS v4', 'AI Agent', 'Vite', 'Node.js'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-6 rounded-full bg-teal-400" />
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Code2 className="w-6 h-6 text-teal-400" />
            <span>个人开源项目集 (Showcase)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div className="flex items-center space-x-2">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {proj.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-6 rounded-full bg-emerald-400" />
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-emerald-400" />
            <span>履历与成长时间轴 (Timeline)</span>
          </h2>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {timeline.map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-emerald-400 group-hover:scale-125 transition-transform" />

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                  {item.year}
                </span>

                <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                <p className="text-xs font-semibold text-slate-400">{item.companyOrContext}</p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guestbook / Comments */}
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-6 rounded-full bg-teal-400" />
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-teal-400" />
            <span>互动留言板 (Guestbook)</span>
          </h2>
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleSubmitComment} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">留下您的脚印或建议</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="您的昵称 / 身份 (例如: Designer Alex)"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/60"
              required
            />
          </div>

          <textarea
            placeholder="撰写您的留言内容..."
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500/60"
            required
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs hover:from-emerald-300 hover:to-cyan-400 transition-all flex items-center space-x-1.5 shadow-lg shadow-teal-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>发表留言</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex items-start space-x-4">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{comment.author}</span>
                  <span className="text-[10px] font-mono text-slate-500">{comment.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
