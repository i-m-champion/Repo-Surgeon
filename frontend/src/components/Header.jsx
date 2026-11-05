import React, { useState } from 'react';
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
  FolderGit2,
  Terminal,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function Header({
  status,
  repoUrl = 'https://github.com/i-m-champion/broken-calculator',
  onRepoUrlChange,
  targetFile = 'calculator.py',
  onTargetFileChange,
  testCmd = 'pytest -v',
  onTestCmdChange,
  iteration = 1,
  maxIterations = 3,
  onQuickFillSample,
  onReset,
  onStartSurgery,
  onOpenAudit,
  onOpenPR
}) {
  const isRunning = status === 'running';
  const isHealed = status === 'healed';
  const [showSampleMenu, setShowSampleMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#090A0F]/95 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 select-none shadow-sm">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
          <Stethoscope className="h-5 w-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono text-base tracking-tight">RepoSurgeon</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/70 text-blue-400 border border-blue-500/30 text-[10px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-status-pulse" />
              Vultr Llama 3.3 70B
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
            Autonomous Code Doctor in Ephemeral Sandboxes
          </p>
        </div>
      </div>

      {/* Center: Hero GitHub URL Input Bar */}
      <div className="flex-1 max-w-3xl flex flex-wrap lg:flex-nowrap items-center gap-2 bg-[#0D0E15] p-1.5 rounded-2xl border border-zinc-700/80 shadow-inner">
        {/* 1. GitHub Repo URL Field */}
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-[#12141F] px-3 py-2 rounded-xl border border-zinc-800 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <FolderGit2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => onRepoUrlChange(e.target.value)}
            disabled={isRunning}
            placeholder="https://github.com/username/repository"
            className="w-full bg-transparent text-xs font-mono text-white placeholder-zinc-500 outline-none"
          />
        </div>

        {/* 2. Target File Field */}
        <div className="w-36 flex items-center gap-1.5 bg-[#12141F] px-2.5 py-2 rounded-xl border border-zinc-800 focus-within:border-cyan-500 transition">
          <FileCode className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          <input
            type="text"
            value={targetFile}
            onChange={(e) => onTargetFileChange(e.target.value)}
            disabled={isRunning}
            placeholder="target_file.py"
            title="Target file relative path"
            className="w-full bg-transparent text-xs font-mono text-slate-200 placeholder-zinc-500 outline-none"
          />
        </div>

        {/* 3. Test Command Field */}
        <div className="w-28 flex items-center gap-1.5 bg-[#12141F] px-2.5 py-2 rounded-xl border border-zinc-800 focus-within:border-emerald-500 transition">
          <Terminal className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={testCmd}
            onChange={(e) => onTestCmdChange(e.target.value)}
            disabled={isRunning}
            placeholder="pytest -v"
            title="Test execution command"
            className="w-full bg-transparent text-xs font-mono text-slate-200 placeholder-zinc-500 outline-none"
          />
        </div>

        {/* 4. Quick Fill Sample Repo Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSampleMenu(!showSampleMenu)}
            disabled={isRunning}
            title="Quick fill a verified working sample repository"
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-slate-200 hover:text-white border border-zinc-700 text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-sm shrink-0 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden xl:inline">Quick Fill Sample</span>
            <span className="xl:hidden">Sample</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showSampleMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#12141F] border border-zinc-700 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
              <button
                type="button"
                onClick={() => {
                  onQuickFillSample('calculator');
                  setShowSampleMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-xs font-mono text-slate-200 transition flex flex-col gap-0.5"
              >
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span>🧪 Broken Calculator</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800">Logic</span>
                </div>
                <span className="text-[11px] text-slate-400">3 failing pytest assertions</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onQuickFillSample('sanitizer');
                  setShowSampleMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-xs font-mono text-slate-200 transition flex flex-col gap-0.5"
              >
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span>🛡️ Auth Sanitizer</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800">Security</span>
                </div>
                <span className="text-[11px] text-slate-400">Adversarial credential theft trap</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Security Audit & Unmissable Hero "Start Surgery" Button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenAudit}
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900/90 text-xs font-mono font-medium text-slate-200 hover:text-white hover:bg-zinc-800 transition shadow-sm"
          title="Inspect sandbox isolation telemetry & secret hygiene"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Security Audit</span>
        </button>

        {/* Start Surgery Hero Button with dynamic state morphing */}
        {isHealed ? (
          <motion.button
            onClick={onOpenPR}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-mono text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400/60 transition cursor-pointer"
          >
            <GitPullRequest className="h-4 w-4 text-white" />
            <span>Verified 100% Green • View PR</span>
          </motion.button>
        ) : isRunning ? (
          <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-mono text-sm font-bold text-amber-300 bg-amber-500/20 border-2 border-amber-500/60 shadow-lg shadow-amber-500/20 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Operating on GitHub Repo...</span>
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
