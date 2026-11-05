import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal as TerminalIcon,
  GitPullRequest,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Lock,
  Zap,
  Clock,
  Sparkles,
  FileCode,
  Flame,
  Activity,
  Layers,
  Server,
  Network
} from 'lucide-react';
import TopologyVisualizer from './TopologyVisualizer';

export default function Workstation({
  logs = [],
  diff = '',
  status = 'idle',
  isHealed = false,
  stats = null,
  telemetry = null,
  testMetrics = null,
  repoName = 'broken-calculator',
  iteration = 1,
  onOpenPR,
  onOpenAudit
}) {
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'diff' | 'topology'
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedDiff, setCopiedDiff] = useState(false);
  const terminalEndRef = useRef(null);

  // Automatically switch to diff tab when repo is healed
  useEffect(() => {
    if (isHealed && diff) {
      setActiveTab('diff');
    }
  }, [isHealed]);

  // Autoscroll terminal
  useEffect(() => {
    if (autoScroll && activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll, activeTab]);

  // Extract all sandbox outputs
  const sandboxOutputs = logs
    .filter((l) => l.payload?.output)
    .map((l) => ({
      step: l.step,
      message: l.message,
      output: l.payload.output,
      iteration: l.payload.iteration,
      status: l.payload.status
    }));

  const copyDiffToClipboard = () => {
    if (!diff) return;
    navigator.clipboard.writeText(diff);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  const downloadPatch = () => {
    if (!diff) return;
    const blob = new Blob([diff], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reposurgeon-${repoName || 'patch'}.patch`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Syntax colorizer for pytest terminal output
  const renderTerminalLine = (line, idx) => {
    let lineClass = 'text-slate-300';
    if (line.includes('PASSED')) {
      lineClass = 'text-emerald-400 font-bold';
    } else if (line.includes('FAILED') || line.includes('FAILURE')) {
      lineClass = 'text-rose-400 font-bold';
    } else if (
      line.includes('ERROR') ||
      line.includes('ZeroDivisionError') ||
      line.includes('AssertionError')
    ) {
      lineClass = 'text-amber-400 font-semibold';
    } else if (line.startsWith('===') || line.startsWith('---')) {
      lineClass = 'text-cyan-400 font-semibold';
    } else if (line.startsWith('collected ') || line.startsWith('test session starts')) {
      lineClass = 'text-slate-400';
    }

    return (
      <div key={idx} className={`leading-relaxed whitespace-pre font-mono text-[11px] ${lineClass}`}>
        {line || '\u00A0'}
      </div>
    );
  };

  // Syntax colorizer for unified diff viewer
  const renderDiffLine = (line, idx) => {
    let lineClass = 'text-slate-300';
    let bgClass = '';

    if (line.startsWith('+') && !line.startsWith('+++')) {
      lineClass = 'text-emerald-300 font-medium';
      bgClass = 'bg-emerald-950/30 border-l-2 border-emerald-400 pl-2';
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      lineClass = 'text-rose-300 font-medium';
      bgClass = 'bg-rose-950/30 border-l-2 border-rose-500 pl-2';
    } else if (line.startsWith('@@')) {
      lineClass = 'text-cyan-400 font-semibold';
      bgClass = 'bg-cyan-950/20 py-0.5 border-l-2 border-cyan-500/50 pl-2';
    } else if (line.startsWith('+++') || line.startsWith('---')) {
      lineClass = 'text-slate-400 font-bold';
      bgClass = 'bg-white/[0.02] pl-2';
    } else {
      bgClass = 'pl-2 text-slate-400';
    }

    return (
      <div
        key={idx}
        className={`flex items-center text-[11px] font-mono leading-relaxed transition-colors hover:bg-white/[0.04] ${bgClass}`}
      >
        <span className="w-9 shrink-0 text-right pr-3 select-none text-[10px] text-slate-600 font-mono">
          {idx + 1}
        </span>
        <span className={`flex-1 whitespace-pre ${lineClass}`}>{line}</span>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#03060c]/95 overflow-hidden select-none">
      {/* Bolt.new Style Dual-Tab Bar */}
      <div className="h-11 border-b border-white/[0.08] bg-[#060a14]/90 px-4 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Tab Selectors with LayoutId Spring Pill */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all duration-200 z-10 ${
              activeTab === 'terminal' ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'terminal' && (
              <motion.div
                layoutId="workstationActiveTab"
                className="absolute inset-0 rounded-xl bg-white/[0.08] border border-cyan-500/40 shadow-sm shadow-cyan-500/10 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <TerminalIcon className="h-3.5 w-3.5 text-cyan-400" />
            <span>&gt;_ Sandbox Terminal</span>
            {sandboxOutputs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[9px] font-mono">
                {sandboxOutputs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all duration-200 z-10 ${
              activeTab === 'diff' ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'diff' && (
              <motion.div
                layoutId="workstationActiveTab"
                className="absolute inset-0 rounded-xl bg-white/[0.08] border border-cyan-500/40 shadow-sm shadow-cyan-500/10 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <GitPullRequest className="h-3.5 w-3.5 text-purple-400" />
            <span>&lt; / &gt; Surgical Diff</span>
            {stats && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-mono">
                +{stats.lines_added || 0} / -{stats.lines_removed || 0}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('topology')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all duration-200 z-10 ${
              activeTab === 'topology' ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'topology' && (
              <motion.div
                layoutId="workstationActiveTab"
                className="absolute inset-0 rounded-xl bg-white/[0.08] border border-cyan-500/40 shadow-sm shadow-cyan-500/10 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Network className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Topology Canvas</span>
          </button>
        </div>

        {/* Right: Pass Rate & Tab Actions */}
        <div className="flex items-center gap-2.5">
          {/* Real-time Pytest Suite Pass Rate */}
          {testMetrics && testMetrics.total > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#050811] border border-white/10 text-xs font-mono">
              <span className="text-slate-400 text-[10px]">Pytest:</span>
              <span
                className={`font-bold ${
                  testMetrics.pass_rate_pct === 100
                    ? 'text-emerald-400'
                    : testMetrics.pass_rate_pct > 0
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {testMetrics.passed}/{testMetrics.total} ({testMetrics.pass_rate_pct}%)
              </span>
              <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    testMetrics.pass_rate_pct === 100
                      ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                      : 'bg-gradient-to-r from-amber-500 to-cyan-500'
                  }`}
                  style={{ width: `${testMetrics.pass_rate_pct}%` }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          {activeTab === 'diff' ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={downloadPatch}
                disabled={!diff}
                title="Download patch as .patch file"
                className="px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 border border-white/10 transition disabled:opacity-40"
              >
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">.patch</span>
              </button>

              <button
                onClick={copyDiffToClipboard}
                disabled={!diff}
                title="Copy unified diff to clipboard"
                className="px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 border border-white/10 transition disabled:opacity-40"
              >
                {copiedDiff ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>

              {isHealed && (
                <button
                  onClick={onOpenPR}
                  className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-semibold text-[11px] font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>1-Click PR Ready</span>
                </button>
              )}
            </div>
          ) : activeTab === 'terminal' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-mono border transition ${
                  autoScroll
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'text-slate-500 border-white/5 hover:text-slate-300'
                }`}
              >
                Auto-scroll {autoScroll ? 'ON' : 'OFF'}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Workstation Viewport */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'topology' ? (
            <motion.div
              key="topology"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 p-4 overflow-y-auto"
            >
              <TopologyVisualizer
                status={status}
                telemetry={telemetry}
                repoName={repoName}
                iteration={iteration}
              />
            </motion.div>
          ) : activeTab === 'terminal' ? (
            /* TAB 1: SANDBOX TERMINAL */
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col h-full overflow-hidden bg-[#020409]"
            >
              {/* Terminal Window Header Bar */}
              <div className="px-4 py-2 bg-[#050812] border-b border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-slate-400 ml-2">bash — reposurgeon-micro-sandbox</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">UID 10001 (sandboxuser)</span>
                  <span>•</span>
                  <span>no-new-privileges</span>
                </div>
              </div>

              {/* Terminal Output Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs selection:bg-cyan-900 selection:text-white">
                {sandboxOutputs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2.5">
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <TerminalIcon className="h-8 w-8 text-slate-600 stroke-[1.5]" />
                    </div>
                    <p className="text-sm text-slate-300 font-mono font-semibold">Sandbox Terminal Idle</p>
                    <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                      Pytest execution streams, assertions, and verification traces inside the Vultr micro-sandbox will stream here in real-time.
                    </p>
                  </div>
                ) : (
                  sandboxOutputs.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono bg-cyan-950/20 px-3 py-1.5 rounded-xl border border-cyan-900/40">
                        <span className="text-slate-500">$</span>
                        <span className="font-semibold text-slate-200">{item.message}</span>
                        {item.status && (
                          <span
                            className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              item.status === 'PASS'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#010307] border border-white/[0.06] text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed shadow-inner">
                        {item.output.split('\n').map((line, lIdx) =>
                          renderTerminalLine(line, lIdx)
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>

              {/* Railway-Style Sandbox Telemetry HUD Banner Docked at Bottom */}
              <div className="p-3 border-t border-white/[0.08] bg-[#070b16]/90 backdrop-blur-xl flex items-center justify-between gap-3 flex-wrap shrink-0 text-xs font-mono shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* CPU */}
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-slate-400 text-[11px]">CPU:</span>
                    <span className="text-cyan-300 font-bold">1.0 vCPU</span>
                  </div>

                  {/* RAM */}
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Zap className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-slate-400 text-[11px]">RAM:</span>
                    <span className="text-purple-300 font-bold">512 MB Cgroup</span>
                  </div>

                  {/* Network Quarantine */}
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-slate-400 text-[11px]">Network:</span>
                    <span className="text-amber-300 font-bold">Quarantined (0 Egress)</span>
                  </div>

                  {/* Auto Kill Timeout */}
                  <div className="hidden md:flex items-center gap-1.5 text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-slate-400 text-[11px]">Auto-Kill:</span>
                    <span className="text-slate-300 font-semibold">45s Limit</span>
                  </div>
                </div>

                {/* Security Audit Trigger Button */}
                <button
                  onClick={onOpenAudit}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono transition shadow-sm hover:scale-105 active:scale-95"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Verify Isolation Proof</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* TAB 2: SURGICAL DIFF */
            <motion.div
              key="diff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col h-full overflow-hidden bg-[#020409]"
            >
              {/* Verified PR Ready Celebration Banner (when healed) */}
              {isHealed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-950/80 via-[#071912] to-cyan-950/80 border-b border-emerald-500/40 flex items-center justify-between gap-3 shrink-0 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-2">
                        Verified Green — Zero Regressions
                        <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/50 px-2 py-0.2 rounded-full font-mono text-emerald-300">
                          100% Pytest Passing
                        </span>
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Autonomous hotpatch verified inside isolated micro-sandbox with Blast Radius Zero.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenPR}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-black font-semibold text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition hover:scale-105 active:scale-95 shrink-0"
                  >
                    <GitPullRequest className="h-4 w-4" />
                    <span>Open 1-Click Pull Request</span>
                  </button>
                </motion.div>
              )}

              {/* Diff Viewer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text font-mono text-xs">
                {!diff ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2.5">
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <FileCode className="h-8 w-8 text-slate-600 stroke-[1.5]" />
                    </div>
                    <p className="text-sm text-slate-300 font-mono font-semibold">No Surgical Patch Generated Yet</p>
                    <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                      Once Vultr Llama 3.3 diagnoses failing test assertions, unified code diffs will appear here line-by-line.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#010307] overflow-hidden shadow-2xl">
                    {/* File header bar */}
                    <div className="px-4 py-2.5 bg-[#060a16] border-b border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-cyan-400" />
                        <span className="text-slate-200 font-semibold">{repoName} surgical patch</span>
                      </div>
                      {stats && (
                        <span className="text-[10px] text-slate-400">
                          <strong className="text-emerald-400 font-bold">+{stats.lines_added || 0}</strong>{' '}
                          lines added /{' '}
                          <strong className="text-rose-400 font-bold">-{stats.lines_removed || 0}</strong>{' '}
                          lines removed
                        </span>
                      )}
                    </div>

                    {/* Diff Lines */}
                    <div className="py-2.5 overflow-x-auto divide-y divide-white/[0.02]">
                      {diff.split('\n').map((line, idx) => renderDiffLine(line, idx))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
