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
  Flame,
  Bug,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

export default function ReasoningFeed({
  logs = [],
  status = 'idle',
  iteration = 1,
  maxIterations = 3,
  selectedDemoObj,
  repoUrl = 'https://github.com/i-m-champion/broken-calculator',
  targetFile = 'calculator.py',
  onQuickFillSample,
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
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/40">
            <CheckCircle2 className="h-3 w-3" /> HEALED
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded text-[10px] font-mono border border-rose-500/40">
            <XCircle className="h-3 w-3" /> ERROR
          </span>
        );
      case 'ITERATION_RETRY':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded text-[10px] font-mono border border-amber-500/40">
            <RefreshCw className="h-3 w-3 animate-spin" /> RETRY
          </span>
        );
      case 'SANDBOX_START':
      case 'SANDBOX_VERIFY':
        return (
          <span className="inline-flex items-center gap-1 text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-500/40">
            <Terminal className="h-3 w-3" /> SANDBOX
          </span>
        );
      case 'AI_THINKING':
      case 'AI_PROPOSAL':
        return (
          <span className="inline-flex items-center gap-1 text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded text-[10px] font-mono border border-blue-500/40">
            <Cpu className="h-3 w-3" /> VULTR AI
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-slate-300 bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono border border-zinc-700">
            {step}
          </span>
        );
    }
  };

  const isCalculator = selectedDemoObj?.id !== 'auth-sanitizer';

  return (
    <aside className="w-full lg:w-[42%] xl:w-[38%] h-full flex flex-col bg-[#12131A] border-r border-zinc-800 relative select-none">
      {/* Top Header: Agent Pipeline Title & Filter Controls */}
      <div className="h-11 px-4 border-b border-zinc-800 bg-[#0F1017] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-tight font-sans">
            Agent Reasoning Pipeline
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-slate-300 font-mono font-medium">
            Turn {iteration}/{maxIterations}
          </span>
        </div>

        {/* Tactile Solid Filter Tabs */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filter === 'ALL'
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700'
                : 'text-slate-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('AI')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filter === 'AI'
                ? 'bg-zinc-800 text-blue-300 font-semibold border border-zinc-700'
                : 'text-slate-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('SANDBOX')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filter === 'SANDBOX'
                ? 'bg-zinc-800 text-cyan-300 font-semibold border border-zinc-700'
                : 'text-slate-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            Sandbox
          </button>
        </div>
      </div>

      {/* Sleek Horizontal Pipeline Stepper */}
      <div className="px-4 py-3 border-b border-zinc-800 bg-[#0E0F15] shrink-0">
        <div className="flex items-center justify-between text-xs font-mono">
          {steps.map((st, idx) => {
            const state = computeStepState(idx);
            const isLast = idx === steps.length - 1;

            let badgeClass = 'bg-zinc-900 border-zinc-800 text-slate-400';
            if (state === 'active') {
              badgeClass = 'bg-blue-600 border-blue-400 text-white ring-2 ring-blue-500/50 shadow-md shadow-blue-500/30';
            } else if (state === 'complete') {
              badgeClass = 'bg-emerald-950 border-emerald-500/60 text-emerald-400 font-bold';
            } else if (state === 'failed') {
              badgeClass = 'bg-rose-950 border-rose-500/60 text-rose-400 font-bold';
            }

            return (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${badgeClass}`}
                  >
                    {state === 'complete' ? (
                      <Check className="h-3 w-3 stroke-[3]" />
                    ) : (
                      st.num
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-sans font-medium ${
                      state === 'active'
                        ? 'text-blue-400 font-bold'
                        : state === 'complete'
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
                {!isLast && (
                  <div className={`flex-1 mx-2 h-0.5 ${
                    state === 'complete' ? 'bg-emerald-500/40' : 'bg-zinc-800'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Stream Area */}
      <div ref={feedContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          /* IDLE STATE: Sleek Target Repository Setup Card + Pre-flight Manifest */
          <div className="space-y-4">
            {/* 1. TARGET REPOSITORY SETUP CARD */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/40 via-zinc-900 to-zinc-900 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/10 text-center space-y-3.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30">
                <Play className="h-5 w-5 fill-white ml-0.5" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-sans tracking-tight">
                  Target Repository Setup
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-sm mx-auto">
                  Paste any public GitHub repository URL above, specify the target file & test command, and click Start Surgery to heal broken tests safely inside a Vultr micro-sandbox.
                </p>
              </div>

              {/* Active Target Banner */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-left font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target Repo:</span>
                  <span className="text-cyan-400 font-semibold">{targetFile}</span>
                </div>
                <div className="text-white truncate font-semibold text-xs">
                  {repoUrl}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  onClick={onStartSurgery}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 rounded-xl font-mono text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/30 ring-2 ring-blue-500/50 hover:ring-cyan-400 flex items-center justify-center gap-2.5 transition cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>▶ Start Automated Repair</span>
                </motion.button>

                <button
                  type="button"
                  onClick={() => onQuickFillSample && onQuickFillSample('calculator')}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 text-slate-300 hover:text-white border border-zinc-700/80 text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Use Sample Demo Repo (Broken Calculator)</span>
                </button>
              </div>
            </div>

            {/* 2. Diagnostic Findings Heading */}
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-xs font-bold text-white font-sans uppercase tracking-wider">
                Pre-Flight Defect Manifest
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
                {isCalculator ? '3 Logic Regressions' : '3 Security Vulnerabilities'}
              </span>
            </div>

            {/* Issue Cards with High Contrast & Clear Typography */}
            {isCalculator ? (
              <>
                {/* Issue Card 1 */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 font-mono text-rose-300 font-bold">
                      BUG-01
                    </span>
                    <span>Inverted Subtraction Operands</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Function returns <code className="text-rose-300 bg-black/60 px-1.5 py-0.5 rounded border border-rose-500/30 font-mono text-[11px]">return b - a</code> instead of <code className="text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono text-[11px]">return a - b</code>, failing unit tests.
                  </p>
                </div>

                {/* Issue Card 2 */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 font-mono text-rose-300 font-bold">
                      BUG-02
                    </span>
                    <span>Missing Division Zero Exception Guard</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Division does not check <code className="text-zinc-200 bg-black/60 px-1.5 py-0.5 rounded border border-zinc-700 font-mono text-[11px]">b == 0</code>, failing to raise required <code className="text-amber-300 bg-black/60 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono text-[11px]">ValueError</code> specification.
                  </p>
                </div>

                {/* Issue Card 3 */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 font-mono text-rose-300 font-bold">
                      BUG-03
                    </span>
                    <span>Off-by-One Exponent Power Error</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Exponent logic computes <code className="text-rose-300 bg-black/60 px-1.5 py-0.5 rounded border border-rose-500/30 font-mono text-[11px]">return a ** (b - 1)</code> instead of expected <code className="text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono text-[11px]">return a ** b</code>.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Security Card 1 */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 font-mono text-rose-300 font-bold">
                      SEC-01
                    </span>
                    <span>Incomplete XSS Tag Stripping</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Replaces only lowercase <code className="text-rose-300 bg-black/60 px-1.5 py-0.5 rounded border border-rose-500/30 font-mono text-[11px]">&lt;script&gt;</code> without stripping closing tags or uppercase variants.
                  </p>
                </div>

                {/* Security Card 2 */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 font-mono text-rose-300 font-bold">
                      SEC-02
                    </span>
                    <span>PCI-DSS Card Number Masking Breach</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Off-by-one slice error exposes 5 digits instead of the strict PCI-DSS limit of 4 digits.
                  </p>
                </div>

                {/* Security Card 3 */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 font-mono text-rose-300 font-bold">
                      SEC-03
                    </span>
                    <span>Overly Restrictive Username Filter</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Regex filter erroneously deletes valid underscore characters from usernames.
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          /* ACTIVE LOG STREAM */
          <AnimatePresence>
            {filteredLogs.map((log, index) => {
              const isExpanded = expandedLogIdx === index;
              const hasResponse = !!log.payload?.raw_response;
              const hasOutput = !!log.payload?.output;
              const hasDetails = hasResponse || hasOutput;

              return (
                <div
                  key={index}
                  className="rounded-xl border border-zinc-800 bg-[#0F1017] overflow-hidden shadow-sm"
                >
                  <div
                    onClick={() => hasDetails && setExpandedLogIdx(isExpanded ? null : index)}
                    className={`p-3.5 flex items-start justify-between gap-3 ${
                      hasDetails ? 'cursor-pointer hover:bg-zinc-850/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 shrink-0">{renderBadge(log.step)}</div>
                      <div className="min-w-0">
                        <p className="text-slate-200 font-sans text-xs leading-relaxed font-medium">
                          {log.message}
                        </p>
                      </div>
                    </div>

                    {hasDetails && (
                      <div className="shrink-0 text-slate-400 hover:text-white mt-0.5">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expandable Trace / AI Response */}
                  <AnimatePresence>
                    {isExpanded && (
                      <div className="border-t border-zinc-800 bg-[#05070F] p-3.5 space-y-3 text-xs overflow-hidden">
                        {hasResponse && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-blue-400 text-[11px] uppercase font-mono font-semibold">
                              <span>Vultr Llama 3.3 Reasoning & Code:</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyText(log.payload.raw_response, `ai-${index}`);
                                }}
                                className="text-slate-400 hover:text-white transition-colors"
                              >
                                {copiedIdx === `ai-${index}` ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                            <pre className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-slate-200 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed font-mono text-[11px]">
                              {log.payload.raw_response}
                            </pre>
                          </div>
                        )}

                        {hasOutput && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-cyan-400 text-[11px] uppercase font-mono font-semibold">
                              <span>Pytest Execution Trace:</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyText(log.payload.output, `stdout-${index}`);
                                }}
                                className="text-slate-400 hover:text-white transition-colors"
                              >
                                {copiedIdx === `stdout-${index}` ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                            <pre className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-slate-200 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed font-mono text-[11px]">
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

      {/* Bottom Elevated Action Dock */}
      <div className="p-3.5 border-t border-zinc-800 bg-[#0E0F15] shrink-0">
        <div className="rounded-xl border border-zinc-750 bg-[#12131A] p-2.5 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2 pl-2 text-xs font-sans text-slate-300 truncate">
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
            <span className="truncate font-medium">
              {status === 'running'
                ? 'Surgery active in isolated sandbox...'
                : 'Vultr Llama 3.3 Autonomous Doctor Ready'}
            </span>
          </div>

          <motion.button
            onClick={onStartSurgery}
            disabled={status === 'running'}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-2 rounded-lg font-mono text-xs font-bold text-white transition shrink-0 disabled:opacity-50 cursor-pointer ${
              status === 'running'
                ? 'bg-zinc-800 cursor-not-allowed text-slate-400'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-blue-500/20'
            }`}
          >
            {status === 'running' ? 'Operating...' : 'Execute Surgery'}
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
