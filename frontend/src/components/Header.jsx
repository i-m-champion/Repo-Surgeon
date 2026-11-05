import React from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Play,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  FolderGit2
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
}) {
  const isRunning = status === 'running';

  return (
    <header className="sticky top-0 z-50 w-full h-12 border-b border-zinc-800/80 bg-[#090A0F]/90 backdrop-blur-md px-4 flex items-center justify-between gap-4 shrink-0 select-none">
      {/* Left: Logo & Bolt-Style Breadcrumbs */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-blue-400">
          <Stethoscope className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-semibold text-zinc-100 font-sans tracking-tight">RepoSurgeon</span>
          <span className="text-zinc-600">/</span>

          {/* Repo Dropdown */}
          <div className="relative flex items-center">
            <select
              value={repoName}
              onChange={(e) => onRepoChange(e.target.value)}
              disabled={isRunning}
              className="appearance-none bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-300 hover:text-white font-mono text-[11px] px-2.5 py-1 pr-6 rounded-md border border-zinc-800 transition-colors cursor-pointer outline-none"
            >
              {demos && demos.length > 0 ? (
                demos.map((d) => (
                  <option key={d.id} value={d.id} className="bg-zinc-900 text-zinc-200">
                    {d.name || d.id}
                  </option>
                ))
              ) : (
                <>
                  <option value="broken-calculator" className="bg-zinc-900 text-zinc-200">
                    broken-calculator
                  </option>
                  <option value="auth-sanitizer" className="bg-zinc-900 text-zinc-200">
                    auth-sanitizer
                  </option>
                </>
              )}
            </select>
            <ChevronDown className="absolute right-2 h-3 w-3 text-zinc-500 pointer-events-none" />
          </div>

          <span className="text-zinc-600">/</span>

          {/* Target File Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 text-[11px]">
            <FileCode className="h-3 w-3 text-zinc-500" />
            {targetFile}
          </span>

          {/* Reset Baseline Icon Button */}
          <button
            onClick={onReset}
            disabled={isRunning}
            title="Reset repository to broken baseline"
            className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 rounded transition-colors disabled:opacity-30 ml-0.5"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Center: Unified Bolt.new Status Pill */}
      <div className="hidden md:flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300">
          {status === 'running' ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
              <span>Analyzing & Healing (Iteration {iteration}/{maxIterations})...</span>
            </>
          ) : status === 'healed' ? (
            <>
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Verified Green • Blast Radius Zero</span>
            </>
          ) : status === 'error' ? (
            <>
              <AlertTriangle className="h-3 w-3 text-rose-400" />
              <span className="text-rose-400">Diagnosis Alert</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-status-pulse" />
              <span>Vultr Llama 3.3 70B • Ephemeral Sandbox Ready</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Security Audit & Primary Action Button */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenAudit}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
          title="Inspect sandbox isolation telemetry & secret hygiene"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Security Audit</span>
        </button>

        <motion.button
          onClick={onStartSurgery}
          disabled={isRunning}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-medium text-white transition disabled:opacity-50 ${
            isRunning
              ? 'bg-zinc-800 cursor-not-allowed text-zinc-400'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:brightness-110 shadow-sm'
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Operating...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start Surgery</span>
            </>
          )}
        </motion.button>
      </div>
    </header>
  );
}
