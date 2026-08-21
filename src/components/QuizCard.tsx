import React, { useState } from 'react'
import { QuizItem } from '../types'
import { MarkdownRenderer } from './MarkdownRenderer'
import { CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, Sparkles, RefreshCw } from 'lucide-react'

interface QuizCardProps {
  quiz: QuizItem
  index: number
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, index }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleSelect = (optionId: string) => {
    if (isSubmitted) return
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    if (!selectedOption) return
    setIsSubmitted(true)
    setShowExplanation(true)
  }

  const handleReset = () => {
    setSelectedOption(null)
    setIsSubmitted(false)
    setShowExplanation(false)
  }

  const isSelectedCorrect = isSubmitted && quiz.options.find((o) => o.id === selectedOption)?.isCorrect

  return (
    <div className="my-6 rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl transition-all">
      {/* Quiz Card Header */}
      <div className="flex items-center justify-between p-5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 font-mono text-xs font-bold flex items-center justify-center border border-teal-500/30">
            Q{index + 1}
          </span>
          <span className="text-xs font-semibold uppercase text-slate-400">单项选择题</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
            quiz.difficulty === 'easy'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : quiz.difficulty === 'medium'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
          }`}>
            {quiz.difficulty}
          </span>
        </div>

        {isSubmitted && (
          <div className="flex items-center space-x-2">
            {isSelectedCorrect ? (
              <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>回答正确</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5" />
                <span>回答错误</span>
              </span>
            )}
            <button
              onClick={handleReset}
              title="重新作答"
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Question Text */}
      <div className="p-6 space-y-4">
        <div className="text-slate-100 font-medium text-sm leading-relaxed">
          <MarkdownRenderer content={quiz.question} />
        </div>

        {/* Options List */}
        <div className="space-y-2.5 pt-2">
          {quiz.options.map((option) => {
            const isSelected = selectedOption === option.id
            let optionStyles = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'

            if (isSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold'
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'bg-rose-500/15 border-rose-500/40 text-rose-200 line-through'
              } else {
                optionStyles = 'bg-slate-900/30 border-slate-800/40 text-slate-500 opacity-60'
              }
            } else if (isSelected) {
              optionStyles = 'bg-teal-500/15 border-teal-500/50 text-teal-200 shadow-md shadow-teal-500/10 font-semibold'
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${optionStyles}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-md bg-slate-800 font-mono text-xs font-bold flex items-center justify-center uppercase text-slate-300 flex-shrink-0">
                    {option.id}
                  </span>
                  <span className="text-xs sm:text-sm">{option.text}</span>
                </div>

                {isSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                {isSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>

        {/* Submit / Reveal Action Bar */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-300 hover:to-teal-400 transition-all shadow-md shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center space-x-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showExplanation ? '收起题目解析' : '查看考点解析'}</span>
              {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Markdown Explanation Section */}
        {showExplanation && (
          <div className="mt-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2 animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>考点与官方解析</span>
            </h4>
            <div className="text-xs text-slate-300 leading-relaxed pt-2">
              <MarkdownRenderer content={quiz.explanation} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
