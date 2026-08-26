import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'
import { toAbsolute } from '../utils/url'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * CommonMark treats 4+ leading spaces as an indented CODE BLOCK. Auto-generated
 * TOC/list content often carries 4-space indentation (e.g. "    - 3.2.1 …"),
 * which silently renders the first lines as <pre> instead of a nested list.
 * Normalize: uniformly drop 2 leading spaces from any line that is an INDENTED
 * LIST ITEM (4+ spaces before a list marker). Relative nesting is preserved and
 * genuine code blocks (lines not starting with a list marker) are untouched.
 */
function normalizeListIndent(md: string): string {
  return md
    .split('\n')
    .map((line) => (/^ {4,}([-*+]|\d+\.)\s/.test(line) ? line.replace(/^ {2}/, '') : line))
    .join('\n')
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <div className={`markdown-body ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(src) => toAbsolute(src)}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const codeString = String(children).replace(/\n$/, '')
            
            return match ? (
              <CodeBlock language={language} code={codeString} />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {normalizeListIndent(content)}
      </ReactMarkdown>
    </div>
  )
}

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
      {/* Code Bar Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 font-mono text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="ml-2 uppercase tracking-wider text-slate-400 font-semibold">{language || 'text'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-200 leading-relaxed bg-slate-950/80">
        <code>{code}</code>
      </pre>
    </div>
  )
}
