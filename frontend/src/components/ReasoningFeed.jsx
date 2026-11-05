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
  ArrowRight
} from 'lucide-react';

export default function ReasoningFeed({
  logs = [],
  status = 'idle',
  iteration = 1,
  maxIterations = 3,
  selectedDemoObj,
  onStartSurgery
}) {
  const [filter, setFilter] = useState('ALL'); // ALL, AI, SANDBOX
  const [expandedLogIdx, setExpandedLogIdx] = useState(null);
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

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const renderBadge = (step) => {
    switch (step) {
      case 'HEALED':
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3" /> HEALED
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded text-[10px] font-mono border border-rose-500/30">
            <XCircle className="h-3 w-3" /> ERROR
          </span>
        );
      case 'ITERATION_RETRY':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded text-[10px] font-mono border border-amber-500/30">
            <RefreshCw className="h-3 w-3 animate-spin" /> RETRY
          </span>
        );
      case 'AI_THINKING':
      case 'AI_PROPOSAL':
        return (
          <span className="inline-flex items-center gap-1 text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded text-[10px] font-mono border border-blue-500/30">
            <Sparkles className="h-3 w-3" /> VULTR AI
          </span>
        );
      case 'SANDBOX_START':
      case 'SANDBOX_RESULT':
      case 'SANDBOX_VERIFY':
      case 'SANDBOX_VERIFY_RESULT':
        return (
          <span className="inline-flex items-center gap-1 text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded text-[10px] font-mono border border-zinc-700/60">
            <ShieldCheck className="h-3 w-3 text-zinc-400" /> SANDBOX
          </span>
        );
      case 'PATCH_GENERATED':
        return (
          <span className="inline-flex items-center gap-1 text-violet-400 bg-violet-950/40 px-2 py-0.5 rounded text-[10px] font-mono border border-violet-500/30">
            <Code2 className="h-3 w-3" /> PATCH
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded text-[10px] font-mono border border-zinc-800">
            {step}
          </span>
        );
    }
  };

  const isCalculator = selectedDemoObj?.id !== 'auth-sanitizer';

  return (
    <aside className="w-full lg:w-[40%] xl:w-[38%] h-full flex flex-col bg-[#12131A] border-r border-zinc-800/80 overflow-hidden relative select-none">
      {/* Top Header: Agent Pipeline Title & Iteration Counter */}
      <div className="h-10 px-3.5 border-b border-zinc-800/80 bg-[#12131A] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-200 tracking-tight font-sans">
            Agent Pipeline
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
            Iteration {iteration}/{maxIterations}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 text-[10px] font-mono">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-0.5 rounded transition-colors ${filter === 'ALL'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('AI')}
            className={`px-2 py-0.5 rounded transition-colors ${filter === 'AI'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('SANDBOX')}
            className={`px-2 py-0.5 rounded transition-colors ${filter === 'SANDBOX'
                ? 'bg-zinc-800 text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Sandbox
          </button>
        </div>
      </div>

      {/* Sleek Horizontal Pipeline Stepper (Bolt.new style) */}
      <div className="px-3.5 py-2.5 border-b border-zinc-800/80 bg-[#0F1017] shrink-0">
        <div className="flex items-center justify-between text-xs font-mono">
          {steps.map((st, idx) => {
            const state = computeStepState(idx);
            const isLast = idx === steps.length - 1;

            return (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${state === 'complete'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : state === 'active'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 ring-2 ring-blue-500/20'
                          : state === 'failed'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                      }`}
                  >
                    {state === 'complete' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      st.num
                    )}
                  </div>
                  <span
                    className={`text-[11px] ${state === 'active'
                        ? 'text-zinc-100 font-medium'
                        : state === 'complete'
                          ? 'text-zinc-300'
                          : 'text-zinc-500'
                      }`}
                  >
                    {st.label}
                  </span>
                </div>
                {!isLast && (
                  <div className="flex-1 mx-2 h-px bg-zinc-800" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Stream Area */}
      <div ref={feedContainerRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          /* IDLE STATE: GitHub-Style Issue Diagnostics */
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-zinc-200 font-sans">
                Diagnostic Findings
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                3 Failures Pending
              </span>
            </div>

            {isCalculator ? (
              <>
                {/* Issue Card 1 */}
                <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-800/80 font-mono text-rose-400 font-bold">
                        BUG-01
                      </span>
                      <span>Inverted Subtraction Operands</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Function returns <code className="text-rose-400 bg-rose-950/40 px-1 py-0.5 rounded text-[11px]">b - a</code> instead of <code className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded text-[11px]">a - b</code>, failing subtraction test cases.
                  </p>
                </div>

                {/* Issue Card 2 */}
                <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-800/80 font-mono text-rose-400 font-bold">
                        BUG-02
                      </span>
                      <span>Missing Division Zero Guard</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Division does not check for <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded text-[11px]">b == 0</code>, failing to raise required <code className="text-amber-400 bg-amber-950/40 px-1 py-0.5 rounded text-[11px]">ValueError</code> exception.
                  </p>
                </div>

                {/* Issue Card 3 */}
                <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-800/80 font-mono text-rose-400 font-bold">
                        BUG-03
                      </span>
                      <span>Off-by-One Exponent Calculation</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Exponent logic computes <code className="text-rose-400 bg-rose-950/40 px-1 py-0.5 rounded text-[11px]">a ** (b - 1)</code> instead of expected power <code className="text-emerald-400 bg-emerald-950/40 px-1 py-0.5 rounded text-[11px]">a ** b</code>.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-800/80 font-mono text-rose-400 font-bold">
                        SEC-01
                      </span>
                      <span>Incomplete XSS Tag Sanitization</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Replaces only lowercase <code className="text-rose-400 bg-rose-950/40 px-1 py-0.5 rounded text-[11px]">&lt;script&gt;</code> without stripping closing tags or uppercase variants.
                  </p>
                </div>

                <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-800/80 font-mono text-rose-400 font-bold">
                        SEC-02
                      </span>
                      <span>PCI-DSS Card Number Exposure</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Slice calculation exposes 5 digits instead of the 4-digit PCI compliance ceiling.
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          /* ACTIVE LOG STREAM */
          <AnimatePresence initial={false}>
            {filteredLogs.map((log, index) => {
              const isExpanded = expandedLogIdx === index;
              const hasOutput = Boolean(log.payload?.output);
              const hasResponse = Boolean(log.payload?.raw_response);
              const latency = log.payload?.inference_telemetry?.latency_ms;
              const linesAdded = log.payload?.stats?.lines_added;
              const linesRemoved = log.payload?.stats?.lines_removed;

              return (
                <div
                  key={index}
                  className={`rounded-xl border transition-colors overflow-hidden ${log.step === 'HEALED'
                      ? 'bg-emerald-950/15 border-emerald-500/30'
                      : log.step === 'ERROR'
                        ? 'bg-rose-950/15 border-rose-500/30'
                        : log.step === 'AI_PROPOSAL'
                          ? 'bg-blue-950/15 border-blue-500/30'
                          : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80'
                    }`}
                >
                  <div
                    onClick={() => (hasOutput || hasResponse) && setExpandedLogIdx(isExpanded ? null : index)}
                    className={`p-3 flex items-start justify-between gap-2.5 ${(hasOutput || hasResponse) ? 'cursor-pointer hover:bg-zinc-800/20' : ''
                      }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 shrink-0">{renderBadge(log.step)}</div>
                      <div className="space-y-1 min-w-0">
                        <div className="text-zinc-200 text-xs leading-snug font-sans">
                          {log.message}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                          {latency && (
                            <span className="text-blue-400">
                              {latency}ms
                            </span>
                          )}
                          {linesAdded !== undefined && (
                            <span className="text-emerald-400">
                              +{linesAdded} / -{linesRemoved}
                            </span>
                          )}
                          {log.payload?.iteration && (
                            <span className="text-zinc-400">
                              turn {log.payload.iteration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {(hasOutput || hasResponse) && (
                      <div className="shrink-0 text-zinc-500 hover:text-zinc-300 mt-1 transition-colors">
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform duration-150 ${isExpanded ? 'rotate-90 text-blue-400' : ''
                            }`}
                        />
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <div className="border-t border-zinc-800/80 bg-zinc-950/70 p-3 space-y-2 text-[11px] overflow-hidden">
                        {hasResponse && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-blue-400 text-[10px] uppercase font-mono">
                              <span>Vultr Llama 3.3 Reasoning & Code:</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyText(log.payload.raw_response, `ai-${index}`);
                                }}
                                className="text-zinc-500 hover:text-zinc-200 transition-colors"
                              >
                                {copiedIdx === `ai-${index}` ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <pre className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 text-zinc-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed font-mono text-[11px]">
                              {log.payload.raw_response}
                            </pre>
                          </div>
                        )}

                        {hasOutput && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase font-mono">
                              <span>Pytest Execution Trace:</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyText(log.payload.output, `stdout-${index}`);
                                }}
                                className="text-zinc-500 hover:text-zinc-200 transition-colors"
                              >
                                {copiedIdx === `stdout-${index}` ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <pre className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 text-zinc-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed font-mono text-[11px]">
                              {log.payload.output}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Elevated Action Box (Bolt.new Chat/Action Dock) */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#0F1017] shrink-0">
        <div className="rounded-xl border border-zinc-800 bg-[#12131A] p-2 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 pl-2 text-xs font-sans text-zinc-400 truncate">
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="truncate">
              {status === 'running'
                ? 'Surgery in progress inside sandbox...'
                : 'Autonomous multi-turn diagnosis & repair ready'}
            </span>
          </div>

          <motion.button
            onClick={onStartSurgery}
            disabled={status === 'running'}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-medium text-white transition shrink-0 disabled:opacity-50 ${status === 'running'
                ? 'bg-zinc-800 cursor-not-allowed text-zinc-500'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:brightness-110 shadow-sm'
              }`}
          >
            {status === 'running' ? 'Operating...' : 'Execute Surgery'}
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
