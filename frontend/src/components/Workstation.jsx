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
  Network,
  Trash2,
  Code2,
  Play,
  RotateCcw
} from 'lucide-react';
import TopologyVisualizer from './TopologyVisualizer';
import CodeInspector from './CodeInspector';

export default function Workstation({
  logs = [],
  diff = '',
  status = 'idle',
  isHealed = false,
  stats = null,
  telemetry = null,
  testMetrics = null,
  repoName = 'broken-calculator',
  targetFile = 'calculator.py',
  iteration = 1,
  onOpenPR,
  onOpenAudit,
  onStartSurgery
}) {
  const [activeTab, setActiveTab] = useState(diff ? 'diff' : 'code');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [clearedLogs, setClearedLogs] = useState(false);
  const terminalContainerRef = useRef(null);

  // Automatically switch to terminal when running
  useEffect(() => {
    if (status === 'running') {
      setActiveTab('terminal');
      setClearedLogs(false);
    }
  }, [status]);

  // Automatically switch to diff tab when repo is healed
  useEffect(() => {
    if (isHealed && diff) {
      setActiveTab('diff');
    }
  }, [isHealed, diff]);

  // Autoscroll terminal container without scrolling window
  useEffect(() => {
    if (autoScroll && activeTab === 'terminal' && terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll, activeTab]);

  const displayedLogs = clearedLogs ? [] : logs;

  // Extract all sandbox outputs
  const sandboxOutputs = displayedLogs
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

  // Syntax colorizer for pytest terminal output with high contrast
  const renderTerminalLine = (line, idx) => {
    let lineClass = 'text-slate-300';
    if (line.includes('PASSED') || line.includes('=== 4 passed')) {
      lineClass = 'text-emerald-400 font-bold';
    } else if (
      line.includes('FAILED') ||
      line.includes('FAILURE') ||
      line.includes('ERROR') ||
      line.includes('AssertionError') ||
      line.includes('ZeroDivisionError')
    ) {
      lineClass = 'text-rose-400 font-bold';
    } else if (line.includes('def test_') || line.includes('collected ')) {
      lineClass = 'text-cyan-400 font-semibold';
    } else if (line.startsWith('>') || line.startsWith('E   ')) {
      lineClass = 'text-amber-300 font-medium';
    } else if (line.startsWith('rootdir:') || line.startsWith('platform ')) {
      lineClass = 'text-slate-400';
    }

    return (
      <div
        key={idx}
        className="flex items-start hover:bg-white/[0.03] px-2 py-0.5 rounded font-mono text-[11px] leading-5"
      >
        <span className="w-10 shrink-0 text-right pr-3 select-none text-[10px] text-slate-500 font-mono">
          {idx + 1}
        </span>
        <span className={`flex-1 whitespace-pre ${lineClass}`}>{line}</span>
      </div>
    );
  };

  // Diff Line Highlighter with high contrast
  const renderDiffLine = (line, idx) => {
    let bg = 'hover:bg-zinc-800/20 text-slate-300';
    let prefix = ' ';
    if (line.startsWith('+') && !line.startsWith('+++')) {
      bg = 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 font-semibold';
      prefix = '+';
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      bg = 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 line-through opacity-85';
      prefix = '-';
    } else if (line.startsWith('@@')) {
      bg = 'bg-blue-950/40 text-blue-300 border-y border-blue-900/40 font-semibold';
    }

    return (
      <div
        key={idx}
        className={`px-3 py-0.5 font-mono text-xs flex items-center gap-2 ${bg}`}
      >
        <span className="w-9 shrink-0 text-right select-none text-[10px] text-slate-500">
          {idx + 1}
        </span>
        <span className="select-none font-bold text-xs w-3 text-center">{prefix}</span>
        <span className="whitespace-pre flex-1">{line.slice(1) || line}</span>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#0D0E12] overflow-hidden select-none">
      {/* Top Tab Bar: Solid, Tactile, High-Contrast Containers */}
      <div className="h-12 border-b border-zinc-800 bg-[#12131A] px-4 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Solid Tactile Tab Buttons */}
        <div className="flex items-center gap-2">
          {/* Tab 1: Code */}
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'code'
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20'
                : 'bg-zinc-900/90 text-slate-300 border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Code Inspector</span>
          </button>

          {/* Tab 2: Terminal */}
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'terminal'
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20'
                : 'bg-zinc-900/90 text-slate-300 border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
          >
            <TerminalIcon className="h-3.5 w-3.5" />
            <span>Sandbox Terminal</span>
            {sandboxOutputs.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'terminal' ? 'bg-white/20 text-white' : 'bg-zinc-800 text-slate-300'
              }`}>
                {sandboxOutputs.length}
              </span>
            )}
          </button>

          {/* Tab 3: Diff */}
          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'diff'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/20'
                : 'bg-zinc-900/90 text-slate-300 border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Surgical Diff</span>
            {stats && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'diff' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
              }`}>
                +{stats.lines_added || 0}/-{stats.lines_removed || 0}
              </span>
            )}
          </button>

          {/* Tab 4: Topology */}
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-2 shadow-sm ${
              activeTab === 'topology'
                ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/20'
                : 'bg-zinc-900/90 text-slate-300 border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>Topology</span>
          </button>
        </div>

        {/* Right: Solid Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'code' && (
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-zinc-900 text-slate-300 border border-zinc-800 text-xs font-mono">
              Python 3.11 • {targetFile}
            </span>
          )}

          {activeTab === 'diff' && (
            <div className="flex items-center gap-2">
              <button
                onClick={downloadPatch}
                disabled={!diff}
                className="px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-slate-200 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors shadow-sm disabled:opacity-30 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-blue-400" />
                <span>Download .patch</span>
              </button>

              <button
                onClick={copyDiffToClipboard}
                disabled={!diff}
                className="px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-slate-200 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors shadow-sm disabled:opacity-30 cursor-pointer"
              >
                {copiedDiff ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Diff</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition ${
                  autoScroll
                    ? 'bg-zinc-800 text-emerald-400 border-zinc-700'
                    : 'bg-zinc-900 text-slate-400 border-zinc-800'
                }`}
              >
                Auto-scroll {autoScroll ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setClearedLogs(true)}
                title="Clear console output"
                className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white border border-zinc-800 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Views Canvas with High-Contrast Backgrounds */}
      <div className="flex-1 overflow-hidden relative bg-[#090B10]">
        <AnimatePresence mode="wait">
          {activeTab === 'code' ? (
            /* TAB: CODE INSPECTOR */
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="h-full flex flex-col overflow-hidden"
            >
              <CodeInspector repoName={repoName} targetFile={targetFile} />
            </motion.div>
          ) : activeTab === 'diff' ? (
            /* TAB: SURGICAL DIFF */
            <motion.div
              key="diff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex-1 flex flex-col h-full overflow-hidden bg-[#05070F]"
            >
              {/* Diff Header Banner */}
              <div className="px-4 py-2 border-b border-zinc-800 bg-[#0E1018] flex items-center justify-between text-xs font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Target File:</span>
                  <code className="text-blue-400">{targetFile}</code>
                  {stats && (
                    <span className="text-zinc-400 text-[11px] ml-2">
                      ({stats.lines_added || 0} insertions(+), {stats.lines_removed || 0} deletions(-))
                    </span>
                  )}
                </div>

                {isHealed && (
                  <button
                    onClick={onOpenPR}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-sm transition"
                  >
                    <GitPullRequest className="h-3.5 w-3.5" />
                    <span>Create Pull Request</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1 select-text font-mono text-xs">
                {!diff ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 font-sans">
                    <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-400 mx-auto">
                      <FileCode className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-zinc-200 font-semibold">No diff generated yet</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Click <strong className="text-blue-400">"Start Surgery"</strong> to run automated diagnosis. The unified patch will render here line-by-line.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-zinc-800 bg-[#05070F] overflow-hidden shadow-md">
                    <div className="py-2 overflow-x-auto">
                      {diff.split('\n').map((line, idx) => renderDiffLine(line, idx))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'terminal' ? (
            /* TAB: TERMINAL */
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex-1 flex flex-col h-full overflow-hidden bg-[#05070F]"
            >
              {/* Terminal Logs Output */}
              <div
                ref={terminalContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs"
              >
                {sandboxOutputs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 font-sans">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 mx-auto shadow-md">
                      <TerminalIcon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base text-white font-bold tracking-tight">Sandbox Terminal Idle</p>
                      <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                        Pytest test runs, assertions, and verification traces inside the Vultr micro-sandbox will stream here in real-time.
                      </p>
                    </div>

                    {/* Quick Trigger Button in Terminal if user lands here first */}
                    <button
                      onClick={onStartSurgery}
                      disabled={status === 'running'}
                      className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-blue-500/20 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Execute Pytest & Surgery</span>
                    </button>
                  </div>
                ) : (
                  sandboxOutputs.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                        <span className="text-cyan-400 font-bold">$</span>
                        <span className="text-zinc-100 font-semibold">{item.message}</span>
                        {item.status && (
                          <span
                            className={`ml-auto text-[10px] px-2 py-0.5 rounded font-bold ${
                              item.status === 'PASS'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#030408] border border-zinc-800 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed shadow-inner">
                        {item.output.split('\n').map((line, lIdx) =>
                          renderTerminalLine(line, lIdx)
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Solid Telemetry Dock with Action Button */}
              <div className="h-11 px-4 border-t border-zinc-800 bg-[#0E1018] flex items-center justify-between text-xs font-mono text-slate-300 shrink-0">
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span>CPU: <strong className="text-white">1.0 vCPU</strong></span>
                  <span>RAM: <strong className="text-white">512 MB Cgroup</strong></span>
                  <span>Network: <strong className="text-emerald-400 font-semibold">Quarantined (0 Egress)</strong></span>
                  <span>Timeout: <strong className="text-amber-400">45s Cap</strong></span>
                </div>

                <button
                  onClick={onOpenAudit}
                  className="px-3 py-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verify Isolation Proof</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* TAB: TOPOLOGY CANVAS */
            <motion.div
              key="topology"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex-1 p-4 overflow-y-auto"
            >
              <TopologyVisualizer
                status={status}
                telemetry={telemetry}
                repoName={repoName}
                iteration={iteration}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
