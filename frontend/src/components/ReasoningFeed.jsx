import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Cpu,
  ChevronRight,
  Code2,
  Copy,
  Check,
  Play,
  Layers,
  ArrowRight,
  User,
  Bot,
  AlertCircle,
  FileCode,
  CornerDownLeft,
  RotateCcw
} from 'lucide-react';

export default function ReasoningFeed({
  logs = [],
  status = 'idle',
  iteration = 1,
  maxIterations = 3,
  selectedDemoObj,
  repoName = 'broken-calculator',
  onStartSurgery,
  onSelectScenario,
  onReset
}) {
  const [filter, setFilter] = useState('ALL'); // ALL, AI, SANDBOX
  const [promptInput, setPromptInput] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const feedContainerRef = useRef(null);

  useEffect(() => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = feedContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Determine stage progress for the compact step tracker
  const computeStepState = (stepIndex) => {
    if (status === 'idle') return 'idle';

    const hasDiagnosed = logs.some((l) => l.step === 'SANDBOX_RESULT' || l.step === 'AI_THINKING');
    const isDiagnosing = logs.some((l) => l.step === 'SANDBOX_START') && !hasDiagnosed;

    const hasAIProposal = logs.some((l) => l.step === 'AI_PROPOSAL' || l.step === 'PATCH_GENERATED');
    const isAIThinking = logs.some((l) => l.step === 'AI_THINKING') && !hasAIProposal;

    const hasPatchVerified = logs.some((l) => l.step === 'SANDBOX_VERIFY_RESULT' || l.step === 'HEALED');
    const isPatching = (logs.some((l) => l.step === 'PATCH_GENERATED' || l.step === 'SANDBOX_VERIFY')) && !hasPatchVerified;

    const isHealed = status === 'healed' || logs.some((l) => l.step === 'HEALED');
    const isError = status === 'error';

    if (stepIndex === 0) {
      if (hasDiagnosed) return 'complete';
      if (isDiagnosing) return 'active';
      return 'pending';
    }
    if (stepIndex === 1) {
      if (hasAIProposal) return 'complete';
      if (isAIThinking) return 'active';
      return hasDiagnosed ? 'pending' : 'idle';
    }
    if (stepIndex === 2) {
      if (hasPatchVerified) return 'complete';
      if (isPatching) return 'active';
      return hasAIProposal ? 'pending' : 'idle';
    }
    if (stepIndex === 3) {
      if (isHealed) return 'complete';
      if (isError) return 'failed';
      return hasPatchVerified ? 'active' : 'idle';
    }
    return 'idle';
  };

  const steps = [
    { label: 'Diagnose', num: '1' },
    { label: 'Analyze', num: '2' },
    { label: 'Hotpatch', num: '3' },
    { label: 'Verify', num: '4' }
  ];

  const filteredLogs = logs.filter((log) => {
    if (filter === 'AI') {
      return log.step?.startsWith('AI_') || log.payload?.raw_response;
    }
    if (filter === 'SANDBOX') {
      return log.step?.startsWith('SANDBOX_') || log.payload?.output;
    }
    return true;
  });

  const isRunning = status === 'running';
  const isHealed = status === 'healed';
  const isCalculator = repoName === 'broken-calculator';

  return (
    <aside className="w-full lg:w-[38%] xl:w-[36%] h-full flex flex-col bg-[#111218] rounded-xl border border-zinc-800/80 shadow-2xl overflow-hidden relative select-none">
      {/* Top Header: Agent Assistant & Status */}
      <div className="h-10 px-3.5 border-b border-zinc-800/80 bg-[#14151E] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-semibold text-zinc-200 tracking-tight font-sans">
            AI Assistant
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
            Iteration {iteration}/{maxIterations}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 text-[10px] font-mono">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-0.5 rounded transition-colors ${
              filter === 'ALL'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('AI')}
            className={`px-2 py-0.5 rounded transition-colors ${
              filter === 'AI'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('SANDBOX')}
            className={`px-2 py-0.5 rounded transition-colors ${
              filter === 'SANDBOX'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sandbox
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar (Bolt Style) */}
      <div className="px-3.5 py-2 border-b border-zinc-800/80 bg-[#0E0F16] shrink-0">
        <div className="flex items-center justify-between text-xs font-mono">
          {steps.map((st, idx) => {
            const state = computeStepState(idx);
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    state === 'complete'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : state === 'active'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 ring-2 ring-blue-500/20'
                      : state === 'failed'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {state === 'complete' ? <CheckCircle2 className="h-3 w-3" /> : st.num}
                </div>
                <span
                  className={`text-[11px] ${
                    state === 'active'
                      ? 'text-zinc-100 font-medium'
                      : state === 'complete'
                      ? 'text-zinc-300'
                      : 'text-zinc-500'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Scrollable Chat & Activity Stream */}
      <div ref={feedContainerRef} className="flex-1 p-3.5 overflow-y-auto space-y-4">
        {/* User Prompt Message (Bolt.new Chat Bubble) */}
        <div className="flex items-start gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span className="font-semibold text-zinc-400">You</span>
              <span>Just now</span>
            </div>
            <p className="leading-relaxed">
              Diagnose and repair all failing unit test assertions in{' '}
              <code className="text-blue-400 bg-blue-950/40 px-1 py-0.5 rounded font-mono">
                {isCalculator ? 'calculator.py' : 'sanitizer.py'}
              </code>{' '}
              inside the isolated Vultr micro-sandbox with zero regressions.
            </p>
          </div>
        </div>

        {/* Assistant Response & Plan Overview (Bolt.new Response Bubble) */}
        <div className="flex items-start gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <Bot className="h-4 w-4" />
          </div>

          <div className="flex-1 p-3.5 rounded-xl bg-[#14151F] border border-zinc-800 text-xs space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="font-semibold text-blue-400">RepoSurgeon (Vultr Llama 3.3)</span>
              <span className="text-zinc-500">
                {isRunning ? 'Executing...' : isHealed ? 'Healed' : 'Analysis Ready'}
              </span>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              {isHealed
                ? 'All unit test assertions verified green! Ephemeral sandbox confirms 0 regressions and safe AST boundaries.'
                : 'I have isolated the repository inside an ephemeral micro-sandbox (quarantined network, 512MB cgroup). Baseline Pytest execution detected 3 failing test specifications:'}
            </p>

            {/* Diagnostic Findings Cards (High-Density Bolt Style) */}
            <div className="space-y-2 pt-1">
              {isCalculator ? (
                <>
                  {/* Bug 1 */}
                  <div className="p-2.5 rounded-lg bg-[#0F1017] border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-rose-400 font-semibold">
                        BUG-01 • Line 11
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        test_subtract()
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5">
                      Inverted Subtraction Operands
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                      <code className="text-rose-400 bg-rose-950/30 px-1 py-0.5 rounded">
                        return b - a
                      </code>
                      <span>→</span>
                      <code className="text-emerald-400 bg-emerald-950/30 px-1 py-0.5 rounded">
                        return a - b
                      </code>
                    </div>
                  </div>

                  {/* Bug 2 */}
                  <div className="p-2.5 rounded-lg bg-[#0F1017] border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-rose-400 font-semibold">
                        BUG-02 • Line 20
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        test_divide_by_zero()
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5">
                      Missing ZeroDivisionError Guard
                    </div>
                    <div className="mt-1 text-[11px] font-mono text-zinc-400">
                      Must raise{' '}
                      <code className="text-rose-400 bg-rose-950/30 px-1 py-0.5 rounded">
                        ValueError("Cannot divide by zero")
                      </code>
                    </div>
                  </div>

                  {/* Bug 3 */}
                  <div className="p-2.5 rounded-lg bg-[#0F1017] border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-rose-400 font-semibold">
                        BUG-03 • Line 25
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        test_power()
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5">
                      Off-by-One Exponent Logic
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                      <code className="text-rose-400 bg-rose-950/30 px-1 py-0.5 rounded">
                        return a ** (b - 1)
                      </code>
                      <span>→</span>
                      <code className="text-emerald-400 bg-emerald-950/30 px-1 py-0.5 rounded">
                        return a ** b
                      </code>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2.5 rounded-lg bg-[#0F1017] border border-rose-500/20">
                    <span className="text-[10px] font-mono text-rose-400 font-semibold">
                      BUG-01 • Line 9
                    </span>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5">
                      Incomplete XSS Script Tag Filter
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0F1017] border border-rose-500/20">
                    <span className="text-[10px] font-mono text-rose-400 font-semibold">
                      BUG-02 • Line 15
                    </span>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5">
                      PCI Expiry Masking Off-by-One
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0F1017] border border-rose-500/20">
                    <span className="text-[10px] font-mono text-rose-400 font-semibold">
                      BUG-03 • Line 20
                    </span>
                    <div className="text-xs font-semibold text-zinc-200 mt-0.5">
                      Underscore Character Stripping
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Live Streaming Logs / Event Feed */}
            {filteredLogs.length > 0 && (
              <div className="pt-2 space-y-2 border-t border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Live Execution Steps ({filteredLogs.length})
                </div>
                <div className="space-y-1.5 font-mono text-xs max-h-56 overflow-y-auto pr-1">
                  {filteredLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-[#090A0E] border border-zinc-800/80 flex items-start gap-2"
                    >
                      <span className="text-blue-400 text-[10px] font-bold">›</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-zinc-200">{log.message}</div>
                        {log.step && (
                          <span className="text-[9px] text-zinc-500 uppercase">
                            {log.step}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bolt.new Signature Prompt / Action Box (Bottom) */}
      <div className="p-3 bg-[#13141D] border-t border-zinc-800 shrink-0">
        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 mb-2 overflow-x-auto text-[11px] font-mono">
          <button
            onClick={onStartSurgery}
            disabled={isRunning}
            className="px-2.5 py-1 rounded-full bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 transition-colors whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>⚡ Execute Auto-Heal</span>
          </button>

          <button
            onClick={onReset}
            disabled={isRunning}
            className="px-2.5 py-1 rounded-full bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-colors whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Elevated Prompt Box */}
        <div className="relative flex items-center bg-[#090A0F] border border-zinc-750 focus-within:border-blue-500/80 rounded-xl p-1.5 shadow-lg transition-colors">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isRunning) {
                onStartSurgery();
              }
            }}
            placeholder="Ask RepoSurgeon to fix, test, or refactor..."
            disabled={isRunning}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none font-sans"
          />

          <motion.button
            onClick={onStartSurgery}
            disabled={isRunning}
            whileTap={{ scale: 0.95 }}
            className={`h-8 px-3 rounded-lg font-mono text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-md ${
              isRunning
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 shadow-blue-500/20'
            }`}
          >
            {isRunning ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <span>Surgery</span>
                <CornerDownLeft className="h-3 w-3" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
