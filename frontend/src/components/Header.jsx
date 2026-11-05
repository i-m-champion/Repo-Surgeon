import React from 'react';
import {
  Stethoscope,
  Play,
  RotateCcw,
  FolderGit2,
  FileCode,
  Terminal as TerminalIcon,
  Sparkles,
  ShieldCheck,
  Cpu,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

export default function Header({
  status,
  repoName,
  demos,
  onRepoChange,
  targetFile,
  onTargetFileChange,
  testCmd,
  onTestCmdChange,
  maxIterations,
  onMaxIterationsChange,
  iteration,
  onReset,
  onStartSurgery,
  onOpenAudit,
}) {
  const isRunning = status === 'running';

  return (
    <header className="relative z-30 h-14 border-b border-white/[0.08] bg-[#080a10]/90 backdrop-blur-xl px-4 flex items-center justify-between gap-3 shrink-0">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
              RepoSurgeon
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-medium">
                v1.0
              </span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-500/30">
              Vultr Agent Rush
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden md:block">
            Autonomous Test Healer • Blast Radius Zero
          </span>
        </div>
      </div>

      {/* Center: Sleek Breadcrumb / Target Config Bar */}
      <div className="flex items-center gap-1.5 bg-[#0b0e17] border border-white/[0.08] px-2.5 py-1 rounded-xl shadow-inner text-xs">
        {/* Repo Selector */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
          <FolderGit2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <select
            value={repoName}
            onChange={(e) => onRepoChange(e.target.value)}
            disabled={isRunning}
            className="bg-transparent text-slate-200 font-mono text-[11px] outline-none cursor-pointer hover:text-white transition"
          >
            {demos && demos.length > 0 ? (
              demos.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#0b101d] text-slate-200">
                  {d.name || d.id}
                </option>
              ))
            ) : (
              <>
                <option value="broken-calculator" className="bg-[#0b101d]">
                  broken-calculator
                </option>
                <option value="auth-sanitizer" className="bg-[#0b101d]">
                  auth-sanitizer
                </option>
              </>
            )}
          </select>
        </div>

        {/* Target File */}
        <div className="hidden sm:flex items-center gap-1 px-1.5 border-r border-white/10">
          <FileCode className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={targetFile}
            onChange={(e) => onTargetFileChange(e.target.value)}
            disabled={isRunning}
            placeholder="file.py"
            className="bg-transparent text-slate-300 font-mono text-[11px] outline-none w-24 hover:text-white focus:text-white transition"
          />
        </div>

        {/* Test Command */}
        <div className="hidden md:flex items-center gap-1 px-1.5 border-r border-white/10">
          <TerminalIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={testCmd}
            onChange={(e) => onTestCmdChange(e.target.value)}
            disabled={isRunning}
            placeholder="pytest -v"
            className="bg-transparent text-slate-300 font-mono text-[11px] outline-none w-20 hover:text-white focus:text-white transition"
          />
        </div>

        {/* Max Iterations */}
        <div className="hidden lg:flex items-center gap-1 px-1.5">
          <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
          <select
            value={maxIterations}
            onChange={(e) => onMaxIterationsChange(Number(e.target.value))}
            disabled={isRunning}
            className="bg-transparent text-slate-300 font-mono text-[11px] outline-none cursor-pointer"
          >
            <option value={1} className="bg-[#0b101d]">1 Turn</option>
            <option value={2} className="bg-[#0b101d]">2 Turns</option>
            <option value={3} className="bg-[#0b101d]">3 Turns</option>
          </select>
        </div>

        {/* Reset State Button */}
        <button
          onClick={onReset}
          disabled={isRunning}
          title="Reset target repository to broken state"
          className="ml-1 p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right: Telemetry Indicators + Primary Action Button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Vultr Serverless Inference Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300 shadow-sm">
          <div className="relative flex h-2 w-2">
            <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </div>
          <Cpu className="h-3.5 w-3.5 text-blue-400" />
          <span className="font-mono text-[11px]">Vultr Inference</span>
        </div>

        {/* Blast Radius Zero Badge */}
        <button
          onClick={onOpenAudit}
          title="Inspect Blast Radius Zero sandbox isolation telemetry"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-xs text-emerald-300 transition shadow-sm group"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-[11px] group-hover:text-emerald-200">Blast Radius Zero</span>
        </button>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-mono shrink-0">
          {status === 'running' && (
            <span className="flex items-center gap-1 text-amber-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Op {iteration}/{maxIterations}</span>
            </span>
          )}
          {status === 'healed' && (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              <span>Healed</span>
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-rose-400">
              <AlertTriangle className="h-3 w-3" />
              <span>Failed</span>
            </span>
          )}
          {status === 'idle' && (
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Ready</span>
            </span>
          )}
        </div>

        {/* Primary Action Button: Unclipped, Prominent, Glowing */}
        <button
          onClick={onStartSurgery}
          disabled={isRunning}
          className={`shrink-0 px-4 py-1.5 rounded-xl font-mono text-xs font-semibold text-white flex items-center gap-2 transition-all duration-200 shadow-md ${
            isRunning
              ? 'bg-slate-800 border border-slate-700 opacity-70 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:brightness-110 active:scale-95 border border-cyan-300/30'
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
              <span>Operating...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-white text-white" />
              <span>Start Surgery</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
