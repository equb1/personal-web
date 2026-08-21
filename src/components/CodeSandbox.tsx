import React, { useState, useRef, useEffect } from 'react'
import { CodingChallenge, TestCase } from '../types'
import { Play, RotateCcw, CheckCircle2, XCircle, Terminal, Eye, EyeOff, Sparkles, Copy, Check, ChevronRight } from 'lucide-react'

interface CodeSandboxProps {
  challenge: CodingChallenge
}

interface LogEntry {
  type: 'log' | 'warn' | 'error' | 'info'
  message: string
  time: string
}

interface TestCaseResult {
  id: string
  name: string
  passed: boolean
  actual: string
  expected: string
  error?: string
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({ challenge }) => {
  const [code, setCode] = useState(challenge.starterCode)
  const [showSolution, setShowSolution] = useState(false)
  const [activeTab, setActiveTab] = useState<'console' | 'tests' | 'hints'>('console')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestCaseResult[]>([])
  const [copied, setCopied] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync code when challenge changes
  useEffect(() => {
    setCode(challenge.starterCode)
    setLogs([])
    setTestResults([])
    setShowSolution(false)
  }, [challenge])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setCode(challenge.starterCode)
    setShowSolution(false)
    setLogs([
      {
        type: 'info',
        message: '代码已重置为初始模版状态。',
        time: new Date().toLocaleTimeString()
      }
    ])
  }

  const toggleSolution = () => {
    if (!showSolution) {
      setCode(challenge.solutionCode)
      setShowSolution(true)
      setLogs([
        {
          type: 'info',
          message: '已加载官方参考解答。',
          time: new Date().toLocaleTimeString()
        }
      ])
    } else {
      setCode(challenge.starterCode)
      setShowSolution(false)
    }
  }

  // Safe Execution in Browser
  const runCodeAndTests = async () => {
    setIsRunning(true)
    const newLogs: LogEntry[] = []
    const newTestResults: TestCaseResult[] = []

    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error

    const captureLog = (type: 'log' | 'warn' | 'error' | 'info', ...args: any[]) => {
      const formatted = args
        .map((arg) => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2)
            } catch {
              return String(arg)
            }
          }
          return String(arg)
        })
        .join(' ')

      newLogs.push({
        type,
        message: formatted,
        time: new Date().toLocaleTimeString()
      })
    }

    try {
      // 1. Run main code snippet with custom console capture
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
      
      const runner = new AsyncFunction('console', `
        ${code}
      `)

      const mockConsole = {
        log: (...args: any[]) => captureLog('log', ...args),
        warn: (...args: any[]) => captureLog('warn', ...args),
        error: (...args: any[]) => captureLog('error', ...args),
        info: (...args: any[]) => captureLog('info', ...args),
      }

      await runner(mockConsole)

      // 2. Run Test Cases if available
      if (challenge.testCases && challenge.testCases.length > 0) {
        for (const tc of challenge.testCases) {
          try {
            const testRunner = new AsyncFunction('console', `
              ${code}
              return (${tc.code});
            `)
            const actualValue = await testRunner(mockConsole)
            const actualStr = JSON.stringify(actualValue)
            const expectedStr = tc.expectedOutput.replace(/\s+/g, '')
            const passed = actualStr === expectedStr || JSON.stringify(actualStr) === expectedStr

            newTestResults.push({
              id: tc.id,
              name: tc.name,
              passed: actualStr === expectedStr,
              actual: actualStr || String(actualValue),
              expected: tc.expectedOutput
            })
          } catch (err: any) {
            newTestResults.push({
              id: tc.id,
              name: tc.name,
              passed: false,
              actual: 'Execution Error',
              expected: tc.expectedOutput,
              error: err.message || String(err)
            })
          }
        }
      }
    } catch (err: any) {
      captureLog('error', `运行时错误: ${err.message || String(err)}`)
    } finally {
      setLogs(newLogs)
      setTestResults(newTestResults)
      setIsRunning(false)
      if (challenge.testCases && challenge.testCases.length > 0) {
        setActiveTab('tests')
      } else {
        setActiveTab('console')
      }
    }
  }

  const lineCount = code.split('\n').length

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl space-y-0">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-300 flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-teal-400" />
            <span>{challenge.title}</span>
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
            {challenge.difficulty}
          </span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSolution}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showSolution
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
            <span>{showSolution ? '隐藏参考解答' : '参考解答'}</span>
          </button>

          <button
            onClick={handleReset}
            title="重置代码"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            title="复制代码"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={runCodeAndTests}
            disabled={isRunning}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-300 hover:to-teal-400 transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isRunning ? '执行中...' : '运行代码 & 测试'}</span>
          </button>
        </div>
      </div>

      {/* Editor Main Content: Line Numbers + Textarea */}
      <div className="relative flex bg-[#070d18] min-h-[260px] max-h-[420px] overflow-auto font-mono text-xs">
        {/* Line Numbers */}
        <div className="py-4 px-3 select-none text-slate-600 text-right bg-slate-950/40 border-r border-slate-800/80 font-mono text-[11px] leading-[20px]">
          {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 w-full p-4 bg-transparent text-slate-200 font-mono text-xs leading-[20px] resize-none focus:outline-none selection:bg-teal-500/30 whitespace-pre"
        />
      </div>

      {/* Output Panel / Console Drawer */}
      <div className="border-t border-slate-800 bg-slate-900/95">
        {/* Tab Headers */}
        <div className="flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3 py-2 text-xs font-mono font-medium transition-colors border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'console'
                  ? 'border-teal-400 text-teal-300 bg-slate-900/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>控制台输出 ({logs.length})</span>
            </button>

            {challenge.testCases && challenge.testCases.length > 0 && (
              <button
                onClick={() => setActiveTab('tests')}
                className={`px-3 py-2 text-xs font-mono font-medium transition-colors border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'tests'
                    ? 'border-teal-400 text-teal-300 bg-slate-900/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>单元测试用例 ({testResults.filter((r) => r.passed).length}/{challenge.testCases.length})</span>
              </button>
            )}

            {challenge.hints && challenge.hints.length > 0 && (
              <button
                onClick={() => setActiveTab('hints')}
                className={`px-3 py-2 text-xs font-mono font-medium transition-colors border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'hints'
                    ? 'border-amber-400 text-amber-300 bg-slate-900/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>解题思路提示</span>
              </button>
            )}
          </div>

          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            Browser JS Sandbox Runtime
          </span>
        </div>

        {/* Tab Content Display */}
        <div className="p-4 max-h-48 overflow-y-auto font-mono text-xs space-y-2">
          {activeTab === 'console' && (
            <div>
              {logs.length === 0 ? (
                <div className="text-slate-500 italic py-2">
                  点击上方「运行代码 & 测试」查看 console 输出结果...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 leading-relaxed ${
                      log.type === 'error'
                        ? 'text-rose-400'
                        : log.type === 'warn'
                        ? 'text-amber-300'
                        : log.type === 'info'
                        ? 'text-teal-300'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className="text-slate-600 text-[10px] select-none">[{log.time}]</span>
                    <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-2">
              {testResults.length === 0 ? (
                <div className="text-slate-500 italic py-2">
                  尚未运行测试。点击「运行代码 & 测试」执行 {challenge.testCases?.length} 个预置断言用例。
                </div>
              ) : (
                testResults.map((tr) => (
                  <div
                    key={tr.id}
                    className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      tr.passed
                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {tr.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-slate-200">{tr.name}</span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 space-x-3">
                      <span>预期: <code className="text-slate-200">{tr.expected}</code></span>
                      <span>实际: <code className={tr.passed ? 'text-emerald-400' : 'text-rose-400'}>{tr.actual}</code></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'hints' && challenge.hints && (
            <div className="space-y-2 text-slate-300 text-xs">
              {challenge.hints.map((hint, i) => (
                <div key={i} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
