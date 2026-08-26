import React, { useState, useRef } from 'react'
import { CodingChallenge, SupportedLanguage } from '../types'
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Terminal,
  Eye,
  EyeOff,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Download,
  Square,
  FileCode,
  Code2
} from 'lucide-react'

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

// Timeout helper (1500ms)
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMsg: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMsg))
    }, timeoutMs)

    promise
      .then((res) => {
        clearTimeout(timer)
        resolve(res)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({ challenge }) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('javascript')
  const [code, setCode] = useState(challenge.starterCode)
  const [showSolution, setShowSolution] = useState(false)
  const [activeTab, setActiveTab] = useState<'console' | 'tests' | 'hints'>('console')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestCaseResult[]>([])
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<{ aborted: boolean }>({ aborted: false })

  // Derive editor code from (challenge, currentLang, showSolution) at render
  // time instead of syncing in an effect — user edits between dependency
  // changes are preserved just like the old effect-based reset.
  const [prevTemplateKey, setPrevTemplateKey] = useState('')
  const templateKey = `${challenge.id}|${currentLang}|${showSolution}`
  if (templateKey !== prevTemplateKey) {
    setPrevTemplateKey(templateKey)
    const template = challenge.languageTemplates?.find((t) => t.language === currentLang)
    setCode(template ? (showSolution ? template.solutionCode : template.starterCode) : (showSolution ? challenge.solutionCode : challenge.starterCode))
  }

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang)
    setShowSolution(false)
    setLogs([
      {
        type: 'info',
        message: `已切换至 ${lang.toUpperCase()} 编程语言模版。`,
        time: new Date().toLocaleTimeString()
      }
    ])
  }

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
    abortControllerRef.current.aborted = true
    setIsRunning(false)
    const template = challenge.languageTemplates?.find((t) => t.language === currentLang)
    setCode(template ? template.starterCode : challenge.starterCode)
    setShowSolution(false)
    setLogs([
      {
        type: 'info',
        message: '代码与沙箱状态已成功重置。',
        time: new Date().toLocaleTimeString()
      }
    ])
  }

  const handleForceStop = () => {
    abortControllerRef.current.aborted = true
    setIsRunning(false)
    setLogs((prev) => [
      ...prev,
      {
        type: 'warn',
        message: '⚠️ 用户手动中止了代码运行。',
        time: new Date().toLocaleTimeString()
      }
    ])
  }

  const toggleSolution = () => {
    const template = challenge.languageTemplates?.find((t) => t.language === currentLang)
    if (!showSolution) {
      setCode(template ? template.solutionCode : challenge.solutionCode)
      setShowSolution(true)
      setLogs([
        {
          type: 'info',
          message: '已加载官方参考解答。',
          time: new Date().toLocaleTimeString()
        }
      ])
    } else {
      setCode(template ? template.starterCode : challenge.starterCode)
      setShowSolution(false)
    }
  }

  // Generate & Download full test suite file
  const handleDownloadTestSuite = () => {
    const ext = currentLang === 'python' ? 'py' : currentLang === 'typescript' ? 'ts' : 'js'
    const fileName = `${challenge.id || 'challenge'}.test.${ext}`

    let fileContent = ''

    if (currentLang === 'python') {
      fileContent = `# =======================================================
# Coding Challenge: ${challenge.title}
# Generated from Zenith Digital Garden Code Sandbox
# =======================================================
import asyncio

# --- [User Code Solution] ---
${code}

# --- [Unit Test Cases Suite] ---
async def run_all_tests():
    print("🚀 Starting Unit Tests Execution...")
`
      challenge.testCases?.forEach((tc, i) => {
        fileContent += `
    # Test Case ${i + 1}: ${tc.name}
    try:
        res = ${tc.code}
        print(f"✅ Test ${i + 1} passed: {res}")
    except Exception as e:
        print(f"❌ Test ${i + 1} failed: {e}")
`
      })
      fileContent += `\nif __name__ == '__main__':\n    asyncio.run(run_all_tests())\n`
    } else {
      fileContent = `/**
 * Coding Challenge: ${challenge.title}
 * Generated from Zenith Digital Garden Code Sandbox
 */

// --- [User Code Solution] ---
${code}

// --- [Unit Test Cases Suite] ---
async function runAllTests() {
  console.log("🚀 Starting Unit Tests Execution in Node.js / Browser...");
  const results = [];
`
      challenge.testCases?.forEach((tc, i) => {
        fileContent += `
  // Test Case ${i + 1}: ${tc.name}
  try {
    const actual = ${tc.code};
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(${tc.expectedOutput});
    const passed = actualStr === expectedStr;
    console.log(passed ? "✅ Test ${i + 1} Passed:" : "❌ Test ${i + 1} Failed:", "${tc.name}", "=>", actualStr);
  } catch (err) {
    console.error("❌ Test ${i + 1} Error:", err.message);
  }
`
      })
      fileContent += `}\n\nrunAllTests();\n`
    }

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  // Safe Execution in Browser with Timeout Protection (Anti-hanging)
  const runCodeAndTests = async () => {
    setIsRunning(true)
    abortControllerRef.current = { aborted: false }
    const newLogs: LogEntry[] = []
    const newTestResults: TestCaseResult[] = []

    const captureLog = (type: 'log' | 'warn' | 'error' | 'info', ...args: unknown[]) => {
      if (abortControllerRef.current.aborted) return
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

    // If Python template is selected in client-side JS runtime, provide friendly simulation
    if (currentLang === 'python') {
      captureLog('info', 'ℹ️ Python 代码沙箱运行提示: 本地浏览器环境支持模拟执行与测试用例文件导出。')
      captureLog('log', '>>> python3 ' + challenge.id + '.py')
      captureLog('log', 'Python 协程模拟任务创建完成。建议点击右上角「导出测试文件」在本地 Python 3.10+ 环境下完整调试！')
      setLogs(newLogs)
      setIsRunning(false)
      setActiveTab('console')
      return
    }

    try {
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
      const mockConsole = {
        log: (...args: unknown[]) => captureLog('log', ...args),
        warn: (...args: unknown[]) => captureLog('warn', ...args),
        error: (...args: unknown[]) => captureLog('error', ...args),
        info: (...args: unknown[]) => captureLog('info', ...args),
      }

      // 1. Run main code snippet with 1500ms timeout
      const runner = new AsyncFunction('console', code)
      await withTimeout(
        runner(mockConsole),
        1500,
        '执行超时 (1500ms)：检测到未完成决议 (Pending) 的 Promise 或耗时操作。请完善 resolve/reject 逻辑后再试。'
      )

      // 2. Run Test Cases with timeout per case
      if (challenge.testCases && challenge.testCases.length > 0) {
        for (const tc of challenge.testCases) {
          if (abortControllerRef.current.aborted) break

          try {
            const testRunner = new AsyncFunction('console', `
              ${code}
              return (${tc.code});
            `)

            const actualValue = await withTimeout(
              testRunner(mockConsole),
              1500,
              '测试用例执行超时 (1500ms)'
            )

            const actualStr = JSON.stringify(actualValue)
            const expectedStr = tc.expectedOutput.replace(/\s+/g, '')

            newTestResults.push({
              id: tc.id,
              name: tc.name,
              passed: actualStr === expectedStr,
              actual: actualStr || String(actualValue),
              expected: tc.expectedOutput
            })
          } catch (err) {
            newTestResults.push({
              id: tc.id,
              name: tc.name,
              passed: false,
              actual: 'Execution Error / Timeout',
              expected: tc.expectedOutput,
              error: err instanceof Error ? err.message : String(err)
            })
          }
        }
      }
    } catch (err) {
      captureLog('error', `运行时提示: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      if (!abortControllerRef.current.aborted) {
        setLogs(newLogs)
        setTestResults(newTestResults)
      }
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
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Code2 className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={currentLang}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs font-mono font-semibold text-teal-300 focus:outline-none cursor-pointer"
            >
              <option value="javascript" className="bg-slate-900 text-slate-200">JavaScript (ES2024)</option>
              <option value="typescript" className="bg-slate-900 text-slate-200">TypeScript (v5.7)</option>
              <option value="python" className="bg-slate-900 text-slate-200">Python (asyncio)</option>
            </select>
          </div>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
            {challenge.difficulty}
          </span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center space-x-2">
          {/* Download Test Suite File Button */}
          <button
            onClick={handleDownloadTestSuite}
            title="导出/下载完整测试用例文件"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-xs">已下载测试文件</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">下载测试文件</span>
              </>
            )}
          </button>

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

          {/* Run or Stop Button */}
          {isRunning ? (
            <button
              onClick={handleForceStop}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/20"
            >
              <Square className="w-3 h-3 fill-white" />
              <span>中止执行</span>
            </button>
          ) : (
            <button
              onClick={runCodeAndTests}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-300 hover:to-teal-400 transition-all shadow-md shadow-teal-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>运行代码 & 测试</span>
            </button>
          )}
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
                <FileCode className="w-3.5 h-3.5" />
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

          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
            <span className="hidden sm:inline">1500ms 超时熔断保护</span>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="p-4 max-h-56 overflow-y-auto font-mono text-xs space-y-2">
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
                        ? 'text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20'
                        : log.type === 'warn'
                        ? 'text-amber-300 bg-amber-500/10 p-2 rounded border border-amber-500/20'
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
            <div className="space-y-3">
              {/* Test Case Detail List */}
              {challenge.testCases?.map((tc, index) => {
                const result = testResults.find((r) => r.id === tc.id)

                return (
                  <div
                    key={tc.id}
                    className={`p-3 rounded-xl border transition-all ${
                      result
                        ? result.passed
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {result ? (
                          result.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] text-slate-400 flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                        )}
                        <span className="font-semibold text-slate-200 text-xs">{tc.name}</span>
                      </div>

                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        result
                          ? result.passed
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {result ? (result.passed ? 'PASSED' : 'FAILED') : 'PENDING'}
                      </span>
                    </div>

                    {/* Test Code snippet */}
                    <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-900/90 p-2 rounded border border-slate-800/80">
                      <span className="text-slate-500">// 断言调用:</span>
                      <div className="text-teal-300 mt-0.5">{tc.code}</div>
                    </div>

                    {/* Expected vs Actual */}
                    <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                      <span>预期输出: <code className="text-emerald-400">{tc.expectedOutput}</code></span>
                      {result && (
                        <span>实际输出: <code className={result.passed ? 'text-emerald-400' : 'text-rose-400'}>{result.actual}</code></span>
                      )}
                    </div>
                  </div>
                )
              })}
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
