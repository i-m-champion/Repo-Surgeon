import React from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Play,
  RotateCcw,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  GitPullRequest,
  AlertTriangle,
  FileCode,
  Flame,
  Bug,
  ShieldAlert
} from 'lucide-react';

export default function Header({
  status,
  repoName,
  demos,
  onRepoChange,
  targetFile,
  onTargetFileChange,
  iteration,
  maxIterations,
  onReset,
  onStartSurgery,
  onOpenAudit,
  onOpenPR
}) {
  const isRunning = status === 'running';
  const isHealed = status === 'healed';
  const isCalculator = repoName === 'broken-calculator';

  return (
    <header className="sticky top-0 z-50 w-full min-h-[64px] border-b border-zinc-800 bg-[#090A0F]/95 backdrop-blur-md px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 select-none">
      {/* Left: Brand Identity & Active Target File */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Stethoscope className="h-5 w-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono text-base tracking-tight">RepoSurgeon</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950/70 text-blue-400 border border-blue-500/30 text-[10px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-status-pulse" />
              Vultr Llama 3.3 70B
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span>Target:</span>
            <span className="text-zinc-200 bg-zinc-900 border border-zinc-700/80 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
              <FileCode className="h-3 w-3 text-cyan-400" />
              {targetFile}
            </span>
            <button
              onClick={onReset}
              disabled={isRunning}
              title="Reset target repo to broken baseline"
              className="p-1 text-slate-400 hover:text-white hover:bg-zinc-800 rounded transition-colors disabled:opacity-30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Center: Large, Self-Explanatory Scenario Toggle Cards */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
        {/* Scenario A: Code Logic Bugs */}
        <button
          onClick={() => !isRunning && onRepoChange('broken-calculator')}
          disabled={isRunning}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all text-left ${
            isCalculator
              ? 'bg-blue-950/40 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50'
              : 'bg-zinc-900/80 border-zinc-800 text-slate-300 hover:bg-zinc-850 hover:text-white hover:border-zinc-700'
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
            isCalculator ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-blue-400'
          }`}>
            <Bug className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold font-sans text-xs flex items-center gap-1.5">
              <span>Scenario A: Code Bugs</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">Calculator</span>
            </div>
            <div className="text-[11px] text-slate-300 font-sans">
              Heals 3 failing pytest regressions
            </div>
          </div>
        </button>

        {/* Scenario B: Adversarial Security Trap */}
        <button
          onClick={() => !isRunning && onRepoChange('auth-sanitizer')}
          disabled={isRunning}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all text-left ${
            !isCalculator
              ? 'bg-purple-950/40 border-purple-500 text-white shadow-md shadow-purple-500/10 ring-1 ring-purple-500/50'
              : 'bg-zinc-900/80 border-zinc-800 text-slate-300 hover:bg-zinc-850 hover:text-white hover:border-zinc-700'
          }`}
        >
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
            !isCalculator ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-purple-400'
          }`}>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold font-sans text-xs flex items-center gap-1.5">
              <span>Scenario B: Security Exploit</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">Sanitizer</span>
            </div>
            <div className="text-[11px] text-slate-300 font-sans">
              Catches malicious credential theft
            </div>
          </div>
        </button>
      </div>

      {/* Right: Security Audit & Hero "Start Surgery" Button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenAudit}
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900/90 text-xs font-mono font-medium text-slate-200 hover:text-white hover:bg-zinc-800 transition shadow-sm"
          title="Inspect sandbox isolation telemetry & secret hygiene"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Security Audit</span>
        </button>

        {/* Unmissable Hero Primary Action Button */}
        {isHealed ? (
          <motion.button
            onClick={onOpenPR}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-mono text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400/60 transition cursor-pointer"
          >
            <GitPullRequest className="h-4 w-4 text-white" />
            <span>Verified Green (100% Passed) • View PR</span>
          </motion.button>
        ) : isRunning ? (
          <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-mono text-sm font-bold text-amber-300 bg-amber-500/20 border-2 border-amber-500/60 shadow-lg shadow-amber-500/20 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Surgery in Progress (Turn {iteration}/{maxIterations})...</span>
          </div>
        ) : (
          <motion.button
            onClick={onStartSurgery}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-mono text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/30 hover:shadow-cyan-500/40 ring-2 ring-blue-500/50 hover:ring-cyan-400 transition cursor-pointer"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Start Surgery</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}
