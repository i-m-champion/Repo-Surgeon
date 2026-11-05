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
  AlertCircle
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
    // 0: Diagnosing Failures
    // 1: Querying Vultr Llama 3.3
    // 2: Patching Sandbox
    // 3: Verified Green

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
    { title: 'Diagnosing Failures', desc: 'Isolated Pytest Sandbox' },
    { title: 'Querying Vultr Llama 3.3', desc: '70B Inference Engine' },
    { title: 'Patching Sandbox', desc: 'Diff Generation & Inject' },
    { title: 'Verified Green', desc: 'Zero Regression Boundary' }
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

  const renderBadge = (step) => {
    switch (step) {
      case 'HEALED':
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/40">
            <CheckCircle2 className="h-3 w-3" /> HEALED
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded text-[10px] font-mono border border-rose-500/40">
            <XCircle className="h-3 w-3" /> ERROR
          </span>
        );
      case 'ITERATION_RETRY':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded text-[10px] font-mono border border-amber-500/40">
            <RefreshCw className="h-3 w-3 animate-spin" /> RETRY
          </span>
        );
      case 'AI_THINKING':
      case 'AI_PROPOSAL':
        return (
          <span className="inline-flex items-center gap-1 text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-500/40">
            <Sparkles className="h-3 w-3" /> VULTR AI
          </span>
        );
      case 'SANDBOX_START':
      case 'SANDBOX_RESULT':
      case 'SANDBOX_VERIFY':
      case 'SANDBOX_VERIFY_RESULT':
        return (
          <span className="inline-flex items-center gap-1 text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded text-[10px] font-mono border border-blue-500/40">
            <ShieldCheck className="h-3 w-3" /> SANDBOX
          </span>
        );
      case 'PATCH_GENERATED':
        return (
          <span className="inline-flex items-center gap-1 text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded text-[10px] font-mono border border-purple-500/40">
            <Code2 className="h-3 w-3" /> PATCH
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-slate-400 bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800">
            {step}
          </span>
        );
    }
  };

  return (
    <aside className="w-full lg:w-[40%] h-full flex flex-col bg-[#07090e]/90 border-r border-white/10 overflow-hidden relative select-none">
      {/* Top Header */}
      <div className="p-3 border-b border-white/10 bg-[#0a0d16]/70 flex items-center justify-between gap-2 shrink-0">
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
              <span className="text-cyan-400">Vultr Llama 3.3 70B</span>
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
      <div className="p-3 border-b border-white/10 bg-[#090c14]/50 shrink-0">
        <div className="grid grid-cols-4 gap-1.5">
          {steps.map((st, idx) => {
            const state = computeStepState(idx);
            return (
              <div
                key={idx}
                className={`relative p-2 rounded-lg border text-left transition-all duration-300 flex flex-col justify-between ${
                  state === 'complete'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-950/30'
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

      {/* Target Scenario Context Banner (if available) */}
      {selectedDemoObj && (
        <div className="px-3 py-2 border-b border-white/5 bg-[#0a0f1d]/40 flex items-center justify-between text-[11px] shrink-0">
          <div className="flex items-center gap-2 truncate text-slate-300">
            <Bug className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 font-mono">Scenario:</span>
            <span className="truncate text-slate-300">{selectedDemoObj.description}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {(selectedDemoObj.tags || []).slice(0, 2).map((t, i) => (
              <span
                key={i}
                className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assistant Feed / Reasoning Log Cards (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
            <div className="h-12 w-12 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">
                Awaiting Surgical Operation
              </h3>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                Click <span className="text-cyan-400 font-semibold">Start Surgery</span> in the top header. The agent will isolate pytest runs inside the Vultr sandbox, query Llama 3.3 70B, and verify code diffs with Blast Radius Zero.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-slate-600 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              <span>Target: {selectedDemoObj?.id || 'broken-calculator'}</span>
              <span>•</span>
              <span className="text-emerald-500">Sandbox Ready</span>
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

                  {/* Expandable Payload Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="border-t border-white/10 bg-[#05070d]/80 p-2.5 space-y-2 text-[10px] overflow-hidden"
                      >
                        {hasResponse && (
                          <div className="space-y-1">
                            <span className="text-cyan-400 font-semibold uppercase text-[9px] tracking-wider">
                              Vultr Llama 3.3 Thought & Code:
                            </span>
                            <pre className="p-2 rounded bg-cyan-950/20 border border-cyan-900/40 text-cyan-200 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                              {log.payload.raw_response}
                            </pre>
                          </div>
                        )}

                        {hasOutput && (
                          <div className="space-y-1">
                            <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">
                              Sandbox Test Execution Output:
                            </span>
                            <pre className="p-2 rounded bg-[#03050a] border border-white/5 text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                              {log.payload.output}
                            </pre>
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
