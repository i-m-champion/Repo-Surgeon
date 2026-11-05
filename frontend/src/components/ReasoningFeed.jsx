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
  GitCommit,
  Clock,
  Layers,
  ArrowRight,
  Code2,
  Bug,
  AlertCircle,
  Play,
  FileCode,
  Shield
} from 'lucide-react';

export default function ReasoningFeed({
  logs = [],
  status = 'idle',
  iteration = 1,
  maxIterations = 3,
  selectedDemoObj,
  testMetrics
}) {
  const [filter, setFilter] = useState('ALL'); // ALL, AI, SANDBOX
  const [expandedLogIdx, setExpandedLogIdx] = useState(null);
  const feedEndRef = useRef(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Determine stage progress for the visual stepper
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
    { title: '01 Diagnosing', desc: 'Isolate & run pytest in sandbox' },
    { title: '02 Vultr Inference', desc: 'Query Llama 3.3 for root cause' },
    { title: '03 Patching', desc: 'Generate surgical unified diff' },
    { title: '04 Verified Green', desc: 'Regression test with zero leak' },
  ];

  const filteredLogs = logs.filter((log) => {
    if (filter === 'AI') {
      return log.step.startsWith('AI') || log.step === 'HEALED';
    }
    if (filter === 'SANDBOX') {
      return log.step.startsWith('SANDBOX') || log.step === 'INIT';
    }
    return true;
  });

  const renderBadge = (step) => {
    switch (step) {
      case 'HEALED':
      case 'SUCCESS':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="h-3 w-3" /> HEALED
          </span>
        );
      case 'ERROR':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-md">
            <XCircle className="h-3 w-3" /> ERROR
          </span>
        );
      case 'AI_THINKING':
      case 'AI_PROPOSAL':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
            <Sparkles className="h-3 w-3" /> VULTR LLM
          </span>
        );
      case 'SANDBOX_START':
      case 'SANDBOX_RESULT':
      case 'SANDBOX_VERIFY':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded-md">
            <Terminal className="h-3 w-3" /> SANDBOX
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
            {step}
          </span>
        );
    }
  };

  return (
    <aside className="w-full lg:w-[40%] h-full flex flex-col bg-[#07090e]/95 border-r border-white/[0.08] overflow-hidden relative select-none">
      {/* Top Header */}
      <div className="p-3 border-b border-white/[0.08] bg-[#090c14]/80 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
              Agent Reasoning Feed
            </h2>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span>Turn {iteration}/{maxIterations}</span>
              <span>•</span>
              <span className="text-cyan-400 font-medium">Vultr Llama 3.3 70B</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#05070d] p-0.5 rounded-lg border border-white/10 text-[10px]">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-0.5 rounded font-mono transition ${
              filter === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilter('AI')}
            className={`px-2 py-0.5 rounded font-mono transition ${
              filter === 'AI'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('SANDBOX')}
            className={`px-2 py-0.5 rounded font-mono transition ${
              filter === 'SANDBOX'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sandbox
          </button>
        </div>
      </div>

      {/* Visual Stepper: Railway / Bolt.new Style Pipeline */}
      <div className="p-3 border-b border-white/[0.08] bg-[#080b13]/60 shrink-0">
        <div className="grid grid-cols-4 gap-1.5">
          {steps.map((st, idx) => {
            const state = computeStepState(idx);
            return (
              <div
                key={idx}
                className={`relative p-2 rounded-lg border text-left transition-all duration-300 flex flex-col justify-between ${
                  state === 'complete'
                    ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-950/30'
                    : state === 'active'
                    ? 'bg-cyan-950/30 border-cyan-400/50 text-cyan-200 shadow-sm shadow-cyan-500/20'
                    : state === 'failed'
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                    : 'bg-white/[0.02] border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                  {state === 'complete' && (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  )}
                  {state === 'active' && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                    </span>
                  )}
                  {state === 'failed' && (
                    <XCircle className="h-3 w-3 text-rose-400" />
                  )}
                  {state === 'pending' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                  )}
                </div>
                <div className="font-mono text-[10px] font-semibold leading-tight truncate">
                  {st.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assistant Feed / Reasoning Log Cards (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          /* High-End Diagnostic Pre-Flight Blueprint (Replaces the empty void) */
          <div className="space-y-3.5 select-text">
            {/* Target Health & Spec Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0c101c] to-[#070a12] border border-white/[0.08] shadow-lg">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] mb-3">
                <div className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-rose-400" />
                  <span className="font-mono font-bold text-slate-200 text-xs">
                    Target Health: 40%
                  </span>
                </div>
                <span className="text-[10px] font-mono text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded">
                  3 Failing Tests
                </span>
              </div>

              {/* Detected Test Assertion Breakdown */}
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-200">
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-semibold truncate">test_subtract</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">Assert -6 == 6 (Inverted)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-200">
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-semibold truncate">test_divide_by_zero</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">Missing ValueError</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-200">
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="font-semibold truncate">test_power</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">Off-by-one Exponent</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 opacity-75">
                  <div className="flex items-center gap-2 truncate">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">test_add & test_multiply</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 shrink-0">Passing (2 tests)</span>
                </div>
              </div>
            </div>

            {/* Autonomous Execution Safeguards Card */}
            <div className="p-3.5 rounded-xl bg-[#090d18]/70 border border-white/[0.08] space-y-2.5">
              <div className="flex items-center gap-2 text-slate-300 font-mono text-xs font-semibold">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Blast Radius Zero Quarantine</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-slate-500 block">Container UID</span>
                  <span className="text-emerald-400 font-semibold">10001 (Non-root)</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-slate-500 block">RAM & CPU Cap</span>
                  <span className="text-slate-300 font-semibold">512 MB • 1.0 vCPU</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-slate-500 block">Network Boundary</span>
                  <span className="text-amber-400 font-semibold">Quarantined (0 Egress)</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-slate-500 block">LLM Engine</span>
                  <span className="text-cyan-400 font-semibold">Vultr Serverless</span>
                </div>
              </div>
            </div>

            {/* Operation Readiness Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 text-center space-y-1.5">
              <span className="text-[11px] font-mono text-cyan-300 font-semibold flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                System Pre-warmed & Ready
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Click <span className="text-white font-semibold">Start Surgery</span> in the top header to isolate pytest runs inside the Vultr sandbox, synthesize patches via Llama 3.3, and achieve 100% test coverage.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredLogs.map((log, index) => {
              const isExpanded = expandedLogIdx === index;
              const hasOutput = Boolean(log.payload?.output);
              const hasResponse = Boolean(log.payload?.raw_response);
              const latency = log.payload?.inference_telemetry?.latency_ms;
              const linesAdded = log.payload?.stats?.lines_added;
              const linesRemoved = log.payload?.stats?.lines_removed;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    log.step === 'HEALED'
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                      : log.step === 'ERROR'
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : log.step === 'AI_PROPOSAL'
                      ? 'bg-cyan-950/20 border-cyan-500/30'
                      : 'bg-[#090d18]/60 border-white/10 hover:border-cyan-500/30'
                  }`}
                >
                  <div
                    onClick={() => (hasOutput || hasResponse) && setExpandedLogIdx(isExpanded ? null : index)}
                    className={`p-2.5 flex items-start justify-between gap-2 cursor-pointer ${
                      (hasOutput || hasResponse) ? 'hover:bg-white/[0.02]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="mt-0.5 shrink-0">{renderBadge(log.step)}</div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-slate-200 text-[11px] leading-snug font-sans break-words">
                          {log.message}
                        </div>
                        {/* Micro stats */}
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          {latency && (
                            <span className="text-cyan-400 flex items-center gap-0.5">
                              <Cpu className="h-2.5 w-2.5" />
                              {latency}ms
                            </span>
                          )}
                          {linesAdded !== undefined && (
                            <span className="text-emerald-400 font-semibold">
                              +{linesAdded} / -{linesRemoved} lines
                            </span>
                          )}
                          {log.payload?.iteration && (
                            <span className="text-purple-400">
                              iter {log.payload.iteration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {(hasOutput || hasResponse) && (
                      <div className="shrink-0 text-slate-500 hover:text-slate-300 mt-1">
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90 text-cyan-400' : ''
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Expanded Detail Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/10 bg-[#04060c] p-2.5 space-y-2 text-[11px]"
                      >
                        {hasOutput && (
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block mb-1">
                              Sandbox Command Trace:
                            </span>
                            <pre className="p-2 rounded bg-black/60 text-slate-300 overflow-x-auto border border-white/5 text-[10px] leading-relaxed max-h-48 overflow-y-auto">
                              {log.payload.output}
                            </pre>
                          </div>
                        )}

                        {hasResponse && (
                          <div>
                            <span className="text-cyan-400 text-[10px] uppercase font-mono tracking-wider block mb-1">
                              Vultr Inference Synthesis:
                            </span>
                            <div className="p-2 rounded bg-cyan-950/20 text-cyan-200 border border-cyan-900/30 text-[10px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {log.payload.raw_response}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={feedEndRef} />
      </div>
    </aside>
  );
}
