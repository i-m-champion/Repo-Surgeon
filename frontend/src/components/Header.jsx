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
  Flame,
  ArrowRight
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
    <header className="sticky top-0 z-50 w-full h-14 border-b border-white/[0.08] bg-[#070a14]/95 backdrop-blur-xl px-4 flex items-center justify-between gap-3 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-60 blur-sm group-hover:opacity-100 transition duration-300" />
          <div className="relative h-9 w-9 rounded-xl bg-[#090e1f] border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Stethoscope className="h-5 w-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent font-mono">
              RepoSurgeon
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Vultr Agent Rush
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden md:block">
            Autonomous Code Doctor in Ephemeral Sandboxes
          </span>
        </div>
      </div>

      {/* Center: Sleek Glass Control Bar */}
      <div className="flex items-center gap-1.5 bg-[#050811]/90 border border-white/[0.1] px-3 py-1 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] text-xs">
        {/* Repo Selector */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.04] transition">
          <FolderGit2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <select
            value={repoName}
            onChange={(e) => onRepoChange(e.target.value)}
            disabled={isRunning}
            className="bg-transparent text-slate-200 font-mono text-[11px] font-medium outline-none cursor-pointer hover:text-cyan-300 transition max-w-[130px] sm:max-w-none"
          >
            {demos && demos.length > 0 ? (
              demos.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#0a0f1d] text-slate-200">
                  {d.name || d.id}
                </option>
              ))
            ) : (
              <>
                <option value="broken-calculator" className="bg-[#0a0f1d]">
                  broken-calculator
                </option>
                <option value="auth-sanitizer" className="bg-[#0a0f1d]">
                  auth-sanitizer
                </option>
              </>
            )}
          </select>
        </div>

        <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

        {/* Target File Input */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.04] transition">
          <FileCode className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={targetFile}
            onChange={(e) => onTargetFileChange(e.target.value)}
            disabled={isRunning}
            placeholder="file.py"
            className="bg-transparent text-slate-200 font-mono text-[11px] outline-none w-24 hover:text-white focus:text-white transition"
          />
        </div>

        <div className="h-3.5 w-px bg-white/10 hidden md:block" />

        {/* Test Command Input */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.04] transition">
          <TerminalIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={testCmd}
            onChange={(e) => onTestCmdChange(e.target.value)}
            disabled={isRunning}
            placeholder="pytest -v"
            className="bg-transparent text-slate-200 font-mono text-[11px] outline-none w-20 hover:text-white focus:text-white transition"
          />
        </div>

        <div className="h-3.5 w-px bg-white/10 hidden lg:block" />

        {/* Max Iterations */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/[0.04] transition">
          <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
          <select
            value={maxIterations}
            onChange={(e) => onMaxIterationsChange(Number(e.target.value))}
            disabled={isRunning}
            className="bg-transparent text-slate-200 font-mono text-[11px] outline-none cursor-pointer hover:text-purple-300 transition"
          >
            <option value={1} className="bg-[#0a0f1d]">1 Turn</option>
            <option value={2} className="bg-[#0a0f1d]">2 Turns</option>
            <option value={3} className="bg-[#0a0f1d]">3 Turns</option>
          </select>
        </div>

        {/* Reset Broken State */}
        <button
          onClick={onReset}
          disabled={isRunning}
          title="Reset target repository to intentional broken baseline"
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/[0.06] disabled:opacity-30 transition-all duration-200 hover:rotate-180"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right: Railway Animated Status Badges & Glow Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Vultr Inference Radar Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 shadow-sm shadow-blue-500/5">
          <div className="relative flex h-2 w-2">
            <span className="animate-radar-ring absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
          </div>
          <Cpu className="h-3.5 w-3.5 text-blue-400" />
          <span className="font-mono text-[11px] font-semibold">Vultr Llama 3.3</span>
        </div>

        {/* Blast Radius Zero Radar Badge */}
        <button
          onClick={onOpenAudit}
          title="Click to view Blast Radius Zero containment security audit"
          className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-xs text-emerald-300 transition-all duration-200 shadow-sm shadow-emerald-500/5 group"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-radar-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-[11px] font-semibold group-hover:text-emerald-200">Blast Radius Zero</span>
        </button>

        {/* Primary Action Button: High Glow Railway Aura */}
        <button
          onClick={onStartSurgery}
          disabled={isRunning}
          className={`relative group px-4 py-1.5 rounded-xl font-mono text-xs font-semibold text-white flex items-center gap-2 transition-all duration-300 shadow-lg ${
            isRunning
              ? 'bg-slate-800 border border-slate-700 opacity-70 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-[0.97] border border-cyan-300/40'
          }`}
        >
          {/* Subtle animated aura behind button */}
          {!isRunning && (
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-50 blur-md group-hover:opacity-85 transition duration-300 -z-10 animate-pulse" />
          )}

          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-200" />
              <span>Surgery in Progress...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>Start Surgery</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
