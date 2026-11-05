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
  Bug,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Layers,
  FileText
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
  const [copiedIdx, setCopiedIdx] = useState(null);
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
    { title: 'Diagnose', desc: 'Pytest Suite' },
    { title: 'Vultr AI', desc: 'Llama 3.3 70B' },
    { title: 'Hotpatch', desc: 'Micro-Sandbox' },
    { title: 'Verified', desc: 'Zero Regression' }
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
      case 'VERIFIED_GREEN':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> VERIFIED GREEN
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full text-[10px] font-mono border border-rose-500/50">
            <XCircle className="h-3 w-3 text-rose-400" /> ERROR
          </span>
        );
      case 'REFLECTING':
      case 'ITERATION_RETRY':
        return (
          <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full text-[10px] font-mono border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <RefreshCw className="h-3 w-3 animate-spin text-amber-400" /> REFLECTING
          </span>
        );
      case 'TURN_1_ATTEMPT':
      case 'TURN_2_ATTEMPT':
      case 'TURN_3_ATTEMPT':
        return (
          <span className="inline-flex items-center gap-1 text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full text-[10px] font-mono border border-cyan-500/50">
            <Zap className="h-3 w-3 text-cyan-400" /> {step.replace('_ATTEMPT', '')}
          </span>
        );
      case 'TURN_1_PATCH':
      case 'TURN_2_PATCH':
      case 'TURN_3_PATCH':
      case 'PATCH_GENERATED':
        return (
          <span className="inline-flex items-center gap-1 text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full text-[10px] font-mono border border-purple-500/50">
            <Code2 className="h-3 w-3 text-purple-400" /> PATCH
          </span>
        );
      case 'AI_THINKING':
      case 'AI_PROPOSAL':
        return (
          <span className="inline-flex items-center gap-1 text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full text-[10px] font-mono border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Sparkles className="h-3 w-3 text-cyan-400" /> VULTR AI
          </span>
        );
      case 'SANDBOX_START':
      case 'SANDBOX_RESULT':
      case 'SANDBOX_VERIFY':
      case 'SANDBOX_VERIFY_RESULT':
        return (
          <span className="inline-flex items-center gap-1 text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full text-[10px] font-mono border border-blue-500/50">
            <ShieldCheck className="h-3 w-3 text-blue-400" /> SANDBOX
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/10">
            {step}
          </span>
        );
    }
  };

  return (
    <aside className="w-full lg:w-[40%] xl:w-[38%] h-full flex flex-col bg-[#05070f]/90 border-r border-white/[0.08] overflow-hidden relative select-none">
      {/* Top Header Bar */}
      <div className="p-3 border-b border-white/[0.08] bg-[#070b16]/70 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-sm shadow-cyan-500/10">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Agent Reasoning Feed
            </h2>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="text-cyan-400 font-semibold">Iteration {iteration}/{maxIterations}</span>
              <span>•</span>
              <span className="text-slate-400">Vultr Serverless Inference</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#03050a] p-0.5 rounded-xl border border-white/10 text-[10px]">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-0.5 rounded-lg font-mono transition-all duration-200 ${
              filter === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilter('AI')}
            className={`px-2 py-0.5 rounded-lg font-mono transition-all duration-200 ${
              filter === 'AI'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setFilter('SANDBOX')}
            className={`px-2 py-0.5 rounded-lg font-mono transition-all duration-200 ${
              filter === 'SANDBOX'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sandbox
          </button>
        </div>
      </div>

      {/* Visual Stepper: Railway / Bolt.new Style Connected Pipeline */}
      <div className="p-3 border-b border-white/[0.08] bg-[#070b18]/40 shrink-0">
        <div className="grid grid-cols-4 gap-2 relative">
          {steps.map((st, idx) => {
            const state = computeStepState(idx);
            return (
              <div
                key={idx}
                className={`relative p-2 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  state === 'complete'
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : state === 'active'
                    ? 'bg-cyan-950/30 border-cyan-400/60 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : state === 'failed'
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                    : 'bg-white/[0.02] border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold tracking-wider">
                    0{idx + 1}
                  </span>
                  {state === 'complete' && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  {state === 'active' && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-radar-ring absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                    </span>
                  )}
                  {state === 'failed' && (
                    <XCircle className="h-3.5 w-3.5 text-rose-400" />
                  )}
                  {state === 'pending' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
                <div>
                  <div className="font-mono text-[11px] font-bold leading-tight truncate">
                    {st.title}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">
                    {st.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Scenario Context Banner */}
      {selectedDemoObj && (
        <div className="px-3 py-2 border-b border-white/[0.05] bg-[#080d1e]/30 flex items-center justify-between text-[11px] shrink-0">
          <div className="flex items-center gap-2 truncate text-slate-300">
            <Bug className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 font-mono text-[10px]">SCENARIO:</span>
            <span className="truncate text-slate-200 font-medium">{selectedDemoObj.description}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {(selectedDemoObj.tags || []).slice(0, 2).map((t, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-[#0a0f20] border border-white/10 text-slate-400 text-[9px] font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assistant Feed Stream Cards (Bolt.new Style) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3.5 text-slate-500">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-cyan-500/20 blur-xl animate-pulse" />
              <div className="relative h-14 w-14 rounded-2xl bg-[#090e1f] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-950/50">
                <Sparkles className="h-7 w-7" />
              </div>
            </div>
            <div className="space-y-1.5 max-w-xs">
              <h3 className="text-sm font-bold text-slate-200">
                Ready for Surgery
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Click <span className="text-cyan-400 font-semibold">Start Surgery</span> above to trigger isolated Pytest execution, Vultr Llama 3.3 diagnosis, and surgical micro-patching.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Sandbox Quarantined & Ready</span>
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
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    log.step === 'HEALED'
                      ? 'bg-emerald-950/25 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : log.step === 'ERROR'
                      ? 'bg-rose-950/25 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                      : log.step === 'AI_PROPOSAL'
                      ? 'bg-cyan-950/20 border-cyan-500/35 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                      : 'bg-[#080d1c]/70 border-white/[0.08] hover:border-cyan-500/30'
                  }`}
                >
                  <div
                    onClick={() => (hasOutput || hasResponse) && setExpandedLogIdx(isExpanded ? null : index)}
                    className={`p-3 flex items-start justify-between gap-2.5 cursor-pointer ${
                      (hasOutput || hasResponse) ? 'hover:bg-white/[0.03]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 shrink-0">{renderBadge(log.step)}</div>
                      <div className="space-y-1 min-w-0">
                        <div className="text-slate-200 text-[11px] leading-snug font-sans break-words font-medium">
                          {log.message}
                        </div>
                        {/* Micro stats tag bar */}
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          {latency && (
                            <span className="text-cyan-400 flex items-center gap-1 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/60">
                              <Cpu className="h-2.5 w-2.5" />
                              {latency}ms
                            </span>
                          )}
                          {linesAdded !== undefined && (
                            <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                              +{linesAdded} / -{linesRemoved} lines
                            </span>
                          )}
                          {log.payload?.iteration && (
                            <span className="text-purple-400 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/60">
                              turn {log.payload.iteration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {(hasOutput || hasResponse) && (
                      <div className="shrink-0 text-slate-400 hover:text-cyan-300 mt-1 transition-colors">
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90 text-cyan-400' : ''
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Expandable Payload Content with Smooth Height Spring */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="border-t border-white/[0.08] bg-[#03060d]/90 p-3 space-y-2.5 text-[10px] overflow-hidden"
                      >
                        {hasResponse && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-cyan-400 font-semibold uppercase text-[9px] tracking-wider">
                              <span className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                Vultr Llama 3.3 Reasoning & Code:
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyText(log.payload.raw_response, `ai-${index}`);
                                }}
                                className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                              >
                                {copiedIdx === `ai-${index}` ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <pre className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-cyan-200 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed shadow-inner font-mono text-[11px]">
                              {log.payload.raw_response}
                            </pre>
                          </div>
                        )}

                        {hasOutput && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-slate-400 font-semibold uppercase text-[9px] tracking-wider">
                              <span className="flex items-center gap-1">
                                <Terminal className="h-3 w-3 text-emerald-400" />
                                Isolated Pytest Trace:
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyText(log.payload.output, `stdout-${index}`);
                                }}
                                className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                              >
                                {copiedIdx === `stdout-${index}` ? (
                                  <Check className="h-3 w-3 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <pre className="p-2.5 rounded-xl bg-[#020409] border border-white/5 text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed shadow-inner font-mono text-[11px]">
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
