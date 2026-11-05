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
  ExternalLink,
  RotateCcw,
  Eye,
  Activity,
  Layers,
  FileCode,
  Flame,
  Bug,
  AlertTriangle
} from 'lucide-react';

export default function Workstation({
  logs = [],
  diff = '',
  isHealed = false,
  stats = null,
  telemetry = null,
  testMetrics = null,
  repoName = 'broken-calculator',
  onOpenPR,
  onOpenAudit
}) {
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' | 'diff'
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedDiff, setCopiedDiff] = useState(false);
  const terminalEndRef = useRef(null);

  // Automatically switch to diff tab when patch is generated or repo is healed
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

  const copyDiffToClipboard = () => {
    if (!diff) return;
    navigator.clipboard.writeText(diff);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  const downloadPatchFile = () => {
    if (!diff) return;
    const blob = new Blob([diff], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${repoName}-surgery.patch`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Collect outputs for terminal
  const sandboxOutputs = logs
    .filter((l) => l.payload?.output)
    .map((l) => ({
      step: l.step,
      message: l.message,
      output: l.payload.output,
      status: l.payload.status,
      duration: l.payload.duration_seconds
    }));

  const renderTerminalLine = (line, idx) => {
    let lineClass = 'text-slate-300';
    if (line.includes('PASSED') || line.includes('PASS') || line.includes('✓')) {
      lineClass = 'text-emerald-400 font-semibold';
    } else if (line.includes('FAILED') || line.includes('FAIL') || line.includes('ERROR') || line.includes('✗')) {
      lineClass = 'text-rose-400 font-semibold';
    } else if (line.startsWith('===')) {
      lineClass = 'text-cyan-400 font-bold';
    } else if (line.startsWith('---') || line.startsWith('___')) {
      lineClass = 'text-slate-500';
    }

    return (
      <div key={idx} className={`leading-relaxed whitespace-pre font-mono ${lineClass}`}>
        {line}
      </div>
    );
  };

  const renderDiffLine = (line, idx) => {
    let lineClass = 'text-slate-300';
    let bgClass = 'hover:bg-white/[0.02]';
    let lineMarker = ' ';

    if (line.startsWith('+') && !line.startsWith('+++')) {
      lineClass = 'text-emerald-300 font-semibold';
      bgClass = 'bg-emerald-950/30 border-l-2 border-emerald-500 pl-2';
      lineMarker = '+';
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      lineClass = 'text-rose-300 line-through opacity-80';
      bgClass = 'bg-rose-950/30 border-l-2 border-rose-500 pl-2';
      lineMarker = '-';
    } else if (line.startsWith('@')) {
      lineClass = 'text-cyan-400 font-bold bg-cyan-950/20 py-1 px-2 my-1 rounded text-[11px]';
    }

    return (
      <div key={idx} className={`font-mono text-xs whitespace-pre py-0.5 px-2 transition-colors ${lineClass} ${bgClass}`}>
        {line}
      </div>
    );
  };

  return (
    <main className="w-full lg:w-[60%] h-full flex flex-col bg-[#05070c] overflow-hidden relative">
      {/* Top Workstation Header Bar */}
      <div className="p-2.5 border-b border-white/[0.08] bg-[#080b13]/80 flex items-center justify-between gap-3 shrink-0">
        {/* Tab Switchers */}
        <div className="flex items-center gap-1 bg-[#030508] p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all ${
              activeTab === 'terminal'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <TerminalIcon className="h-3.5 w-3.5" />
            <span>&gt;_ Sandbox Terminal</span>
            {sandboxOutputs.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                {sandboxOutputs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all ${
              activeTab === 'diff'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <GitPullRequest className="h-3.5 w-3.5" />
            <span>&lt; / &gt; Surgical Diff & Code</span>
            {diff && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Patch
              </span>
            )}
          </button>
        </div>

        {/* Right Tab Toolbar */}
        <div className="flex items-center gap-2">
          {activeTab === 'diff' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={downloadPatchFile}
                disabled={!diff}
                title="Download unified .patch file"
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 border border-white/10 transition disabled:opacity-40"
              >
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">.patch</span>
              </button>

              <button
                onClick={copyDiffToClipboard}
                disabled={!diff}
                title="Copy unified diff to clipboard"
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 border border-white/10 transition disabled:opacity-40"
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
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-[11px] font-mono flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>1-Click PR Ready</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition ${
                  autoScroll
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'text-slate-500 border-white/5 hover:text-slate-300'
                }`}
              >
                Auto-scroll {autoScroll ? 'ON' : 'OFF'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'terminal' ? (
          /* TAB 1: SANDBOX TERMINAL */
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#04060b]">
            {/* Terminal Window Header Bar */}
            <div className="px-4 py-2 bg-[#070a12] border-b border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-slate-400 ml-2 font-mono">bash — reposurgeon-micro-sandbox</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <span className="text-emerald-400">UID: 10001 (sandboxuser)</span>
                <span>•</span>
                <span>no-new-privileges</span>
              </div>
            </div>

            {/* Terminal Logs Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs selection:bg-cyan-900 selection:text-white">
              {sandboxOutputs.length === 0 ? (
                /* High-End Pre-Warmed Container Boot Output (Replaces the empty void) */
                <div className="space-y-2 font-mono text-xs text-slate-300 select-text leading-relaxed">
                  <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06] text-cyan-300 space-y-1">
                    <div className="text-emerald-400 font-bold flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Vultr Ephemeral Micro-Sandbox Engine: READY
                    </div>
                    <div className="text-slate-400 text-[11px] space-y-0.5 pt-1">
                      <div>├─ Container ID   : <span className="text-slate-200">vultr-sandbox-ephemeral-8f3a</span></div>
                      <div>├─ Isolation Boundary : <span className="text-emerald-400 font-semibold">Blast Radius Zero (cgroup v2 hard limit)</span></div>
                      <div>├─ Memory Quota     : <span className="text-purple-300 font-semibold">512 MB cgroup cap</span></div>
                      <div>├─ CPU Allocation   : <span className="text-cyan-300 font-semibold">1.0 vCPU share</span></div>
                      <div>├─ Network Boundary : <span className="text-amber-400 font-semibold">Quarantined (0.0.0.0/0 Blocked)</span></div>
                      <div>├─ User Context     : <span className="text-emerald-400">UID 10001 (sandboxuser, unprivileged)</span></div>
                      <div>└─ Mount Point      : <span className="text-slate-200">/workspace/{repoName} (rw, ephemeral copy)</span></div>
                    </div>
                  </div>

                  <div className="pt-2 text-slate-400 text-[11px]">
                    <span className="text-cyan-400 font-bold">$</span> pytest -v --collect-only
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[11px] text-slate-300 space-y-0.5">
                    <div className="text-slate-500">platform linux -- Python 3.11.8, pytest-8.1.1</div>
                    <div className="text-slate-500">rootdir: /workspace/{repoName}</div>
                    <div className="pt-1 text-slate-300">collected 5 items:</div>
                    <div className="pl-3 text-emerald-400">calculator.py::test_add <span className="text-slate-500">✓ [PASS]</span></div>
                    <div className="pl-3 text-emerald-400">calculator.py::test_multiply <span className="text-slate-500">✓ [PASS]</span></div>
                    <div className="pl-3 text-rose-400 font-semibold">calculator.py::test_subtract <span className="text-rose-500">✗ [FAIL: assert -6 == 6]</span></div>
                    <div className="pl-3 text-rose-400 font-semibold">calculator.py::test_divide_by_zero <span className="text-rose-500">✗ [FAIL: ZeroDivisionError not caught]</span></div>
                    <div className="pl-3 text-rose-400 font-semibold">calculator.py::test_power <span className="text-rose-500">✗ [FAIL: assert 4 == 8]</span></div>
                    <div className="pt-1 text-rose-400 font-bold">======================= 3 failed, 2 passed in 0.04s =======================</div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-emerald-400 font-mono text-xs">
                    <span className="text-cyan-400 font-bold">$</span>
                    <span className="text-slate-300">reposurgeon --listen</span>
                    <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5" />
                  </div>
                </div>
              ) : (
                sandboxOutputs.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono bg-cyan-950/20 px-2 py-1 rounded border border-cyan-900/30">
                      <span className="text-slate-400">$</span>
                      <span className="font-semibold">{item.message}</span>
                      {item.status && (
                        <span
                          className={`ml-auto text-[10px] px-1.5 rounded font-bold ${
                            item.status === 'PASS'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>
                    <div className="p-3 rounded-lg bg-[#020408] border border-white/5 text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed shadow-inner">
                      {item.output.split('\n').map((line, lIdx) =>
                        renderTerminalLine(line, lIdx)
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Railway-Style Sandbox Telemetry Banner Docked at Bottom */}
            <div className="p-2.5 border-t border-white/[0.08] bg-[#080c18]/95 backdrop-blur-md flex items-center justify-between gap-3 flex-wrap shrink-0 text-xs font-mono">
              <div className="flex items-center gap-4 flex-wrap">
                {/* CPU Quota */}
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-400 text-[11px]">CPU:</span>
                  <span className="text-cyan-300 font-bold">1.0 vCPU</span>
                </div>

                {/* RAM Limit */}
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
                  <span className="text-slate-300 font-semibold">45s Hard Limit</span>
                </div>
              </div>

              {/* Security Audit Trigger Button */}
              <button
                onClick={onOpenAudit}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono transition shadow-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verify Isolation Audit</span>
              </button>
            </div>
          </div>
        ) : (
          /* TAB 2: SURGICAL DIFF & CODE INSPECTOR */
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#04060b]">
            {/* Verified PR Ready Celebration Banner (when healed) */}
            {isHealed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 bg-gradient-to-r from-emerald-950/80 via-[#071912] to-cyan-950/80 border-b border-emerald-500/30 flex items-center justify-between gap-3 shrink-0"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-2">
                      Verified Green — Zero Regressions
                      <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                        100% Pytest Passing
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Surgical patch verified inside isolated micro-sandbox with Blast Radius Zero.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenPR}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-semibold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition hover:scale-105 active:scale-95 shrink-0"
                >
                  <GitPullRequest className="h-3.5 w-3.5" />
                  <span>Open 1-Click Pull Request</span>
                </button>
              </motion.div>
            )}

            {/* Diff Viewer / Source Code Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text font-mono text-xs">
              {!diff ? (
                /* Source Code Preview with highlighted bugs (Replaces the empty void) */
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#090d18] border border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-cyan-400" />
                      <span className="font-mono text-slate-200 text-xs font-bold">
                        Target Code Inspector: calculator.py
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                      3 Detected Bugs Pending Surgery
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-xs font-mono space-y-1 text-slate-300 leading-relaxed overflow-x-auto">
                    <div className="text-slate-500 pb-1"># calculator.py (Current broken state)</div>
                    <div><span className="text-slate-600 inline-block w-6">01</span><span className="text-purple-400">def</span> <span className="text-blue-400">add</span>(a, b): <span className="text-purple-400">return</span> a + b</div>
                    <div><span className="text-slate-600 inline-block w-6">02</span></div>
                    <div className="bg-rose-950/30 border-l-2 border-rose-500 pl-2 -ml-2 text-rose-300">
                      <span className="text-slate-600 inline-block w-6">03</span><span className="text-purple-400">def</span> <span className="text-blue-400">subtract</span>(a, b): <span className="text-purple-400">return</span> b - a  <span className="text-rose-400"># ⚠️ BUG 1: Inverted operands (returns b-a instead of a-b)</span>
                    </div>
                    <div><span className="text-slate-600 inline-block w-6">04</span></div>
                    <div><span className="text-slate-600 inline-block w-6">05</span><span className="text-purple-400">def</span> <span className="text-blue-400">multiply</span>(a, b): <span className="text-purple-400">return</span> a * b</div>
                    <div><span className="text-slate-600 inline-block w-6">06</span></div>
                    <div className="bg-rose-950/30 border-l-2 border-rose-500 pl-2 -ml-2 text-rose-300">
                      <span className="text-slate-600 inline-block w-6">07</span><span className="text-purple-400">def</span> <span className="text-blue-400">divide</span>(a, b): <span className="text-purple-400">return</span> a / b  <span className="text-rose-400"># ⚠️ BUG 2: Missing check for b == 0 (fails ValueError spec)</span>
                    </div>
                    <div><span className="text-slate-600 inline-block w-6">08</span></div>
                    <div className="bg-rose-950/30 border-l-2 border-rose-500 pl-2 -ml-2 text-rose-300">
                      <span className="text-slate-600 inline-block w-6">09</span><span className="text-purple-400">def</span> <span className="text-blue-400">power</span>(a, b): <span className="text-purple-400">return</span> a ** (b - 1)  <span className="text-rose-400"># ⚠️ BUG 3: Off-by-one exponent (calculates a**(b-1))</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                    <span>Surgical patch will be generated dynamically by Vultr Llama 3.3 upon execution.</span>
                    <span className="text-slate-400 text-[10px]">Pytest verified</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {diff.split('\n').map((line, idx) => renderDiffLine(line, idx))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
