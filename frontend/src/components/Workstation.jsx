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
  Code2
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
  onOpenAudit
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

  // Syntax colorizer for pytest terminal output
  const renderTerminalLine = (line, idx) => {
    let lineClass = 'text-zinc-300';
    if (line.includes('PASSED')) {
      lineClass = 'text-emerald-400 font-semibold';
    } else if (line.includes('FAILED') || line.includes('FAILURE')) {
      lineClass = 'text-rose-400 font-semibold';
    } else if (
      line.includes('ERROR') ||
      line.includes('ZeroDivisionError') ||
      line.includes('AssertionError')
    ) {
      lineClass = 'text-amber-400';
    } else if (line.startsWith('===') || line.startsWith('---')) {
      lineClass = 'text-zinc-400 font-semibold';
    } else if (line.startsWith('collected ') || line.startsWith('test session starts')) {
      lineClass = 'text-zinc-500';
    }

    return (
      <div key={idx} className={`leading-relaxed whitespace-pre font-mono text-[11px] ${lineClass}`}>
        {line || '\u00A0'}
      </div>
    );
  };

  // Syntax colorizer for unified diff viewer
  const renderDiffLine = (line, idx) => {
    let lineClass = 'text-zinc-300';
    let bgClass = '';

    if (line.startsWith('+') && !line.startsWith('+++')) {
      lineClass = 'text-emerald-300';
      bgClass = 'bg-emerald-950/20 border-l-2 border-emerald-500 pl-2';
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      lineClass = 'text-rose-300';
      bgClass = 'bg-rose-950/20 border-l-2 border-rose-500 pl-2';
    } else if (line.startsWith('@@')) {
      lineClass = 'text-blue-400 font-semibold';
      bgClass = 'bg-blue-950/15 py-0.5 pl-2';
    } else if (line.startsWith('+++') || line.startsWith('---')) {
      lineClass = 'text-zinc-400 font-bold';
      bgClass = 'bg-zinc-900/40 pl-2';
    } else {
      bgClass = 'pl-2 text-zinc-400';
    }

    return (
      <div
        key={idx}
        className={`flex items-center text-[11px] font-mono leading-relaxed hover:bg-zinc-800/20 ${bgClass}`}
      >
        <span className="w-9 shrink-0 text-right pr-3 select-none text-[10px] text-zinc-600 font-mono">
          {idx + 1}
        </span>
        <span className={`flex-1 whitespace-pre ${lineClass}`}>{line}</span>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#0D0E12] overflow-hidden select-none">
      {/* Top Tab Bar (Bolt.new IDE Style) */}
      <div className="h-10 border-b border-zinc-800/80 bg-[#12131A] px-3 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Minimalist Tabs with Framer Motion layoutId */}
        <div className="flex items-center gap-1">
          {/* Tab 1: Code */}
          <button
            onClick={() => setActiveTab('code')}
            className={`relative px-3 py-1 rounded-md text-xs font-mono transition-colors ${activeTab === 'code'
                ? 'text-white bg-zinc-800/90 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
          >
            Code
          </button>

          {/* Tab 2: Diff */}
          <button
            onClick={() => setActiveTab('diff')}
            className={`relative px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${activeTab === 'diff'
                ? 'text-white bg-zinc-800/90 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
          >
            <span>Diff</span>
            {stats && (
              <span className="text-[10px] text-emerald-400">
                +{stats.lines_added || 0}/-{stats.lines_removed || 0}
              </span>
            )}
          </button>

          {/* Tab 3: Terminal */}
          <button
            onClick={() => setActiveTab('terminal')}
            className={`relative px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${activeTab === 'terminal'
                ? 'text-white bg-zinc-800/90 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
          >
            <span>Terminal</span>
            {sandboxOutputs.length > 0 && (
              <span className="text-[10px] px-1 rounded bg-zinc-700/60 text-zinc-300">
                {sandboxOutputs.length}
              </span>
            )}
          </button>

          {/* Tab 4: Topology */}
          <button
            onClick={() => setActiveTab('topology')}
            className={`relative px-3 py-1 rounded-md text-xs font-mono transition-colors ${activeTab === 'topology'
                ? 'text-white bg-zinc-800/90 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
          >
            Topology
          </button>
        </div>

        {/* Right: Metadata Chips & Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'code' && (
            <>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] font-mono">
                Python 3.11
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono">
                3 Issues Detected
              </span>
            </>
          )}

          {activeTab === 'diff' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={downloadPatch}
                disabled={!diff}
                title="Download unified diff as .patch"
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono flex items-center gap-1 border border-zinc-800 transition-colors disabled:opacity-30"
              >
                <Download className="h-3 w-3" />
                <span>.patch</span>
              </button>

              <button
                onClick={copyDiffToClipboard}
                disabled={!diff}
                title="Copy unified diff"
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono flex items-center gap-1 border border-zinc-800 transition-colors disabled:opacity-30"
              >
                {copiedDiff ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {isHealed && (
                <button
                  onClick={onOpenPR}
                  className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium flex items-center gap-1.5 border border-emerald-500/30 transition-colors"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>1-Click PR Ready</span>
                </button>
              )}
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setClearedLogs(true)}
                title="Clear current terminal log output"
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono flex items-center gap-1 border border-zinc-800 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear</span>
              </button>

              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${autoScroll
                    ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                    : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'
                  }`}
              >
                Scroll: {autoScroll ? 'ON' : 'OFF'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workstation Viewport */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'code' ? (
            /* TAB: CODE INSPECTOR */
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
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
              className="flex-1 flex flex-col h-full overflow-hidden bg-[#0D1117]"
            >
              {isHealed && (
                <div className="px-4 py-2.5 bg-emerald-950/20 border-b border-emerald-500/20 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Verified Green: All test assertions passed inside sandbox</span>
                  </div>
                  <button
                    onClick={onOpenPR}
                    className="px-3 py-1 rounded bg-emerald-500 text-black text-xs font-mono font-semibold hover:bg-emerald-400 transition-colors"
                  >
                    Open Pull Request
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-1 select-text font-mono text-xs">
                {!diff ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-1.5 font-sans">
                    <p className="text-sm text-zinc-400 font-medium">No diff generated yet</p>
                    <p className="text-xs text-zinc-500">
                      Unified code diff will appear here after the agent completes diagnosis and patching.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-zinc-800 bg-[#0B0D13] overflow-hidden">
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
              className="flex-1 flex flex-col h-full overflow-hidden bg-[#0A0D14]"
            >
              {/* Terminal Logs Output */}
              <div
                ref={terminalContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs"
              >
                {sandboxOutputs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-1.5 font-sans">
                    <p className="text-sm text-zinc-400 font-medium">Sandbox Terminal Ready</p>
                    <p className="text-xs text-zinc-500">
                      Isolated Pytest runs and output streams will display here.
                    </p>
                  </div>
                ) : (
                  sandboxOutputs.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                        <span className="text-zinc-600">$</span>
                        <span className="text-zinc-200">{item.message}</span>
                        {item.status && (
                          <span
                            className={`ml-auto text-[10px] px-1.5 py-0.2 rounded font-bold ${item.status === 'PASS'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                                : 'bg-rose-950/60 text-rose-400 border border-rose-800/80'
                              }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="p-3 rounded-lg bg-[#08090D] border border-zinc-800/60 text-zinc-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                        {item.output.split('\n').map((line, lIdx) =>
                          renderTerminalLine(line, lIdx)
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Minimalist Telemetry Dock */}
              <div className="h-9 px-4 border-t border-zinc-800/80 bg-[#0E1018] flex items-center justify-between text-xs font-mono text-zinc-400 shrink-0">
                <div className="flex items-center gap-4 text-[11px]">
                  <span>CPU: <strong className="text-zinc-200">1.0 vCPU</strong></span>
                  <span>RAM: <strong className="text-zinc-200">512 MB</strong></span>
                  <span>Network: <strong className="text-zinc-200">Quarantined</strong></span>
                  <span>Timeout: <strong className="text-zinc-200">45s</strong></span>
                </div>

                <button
                  onClick={onOpenAudit}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Verify Isolation →
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
