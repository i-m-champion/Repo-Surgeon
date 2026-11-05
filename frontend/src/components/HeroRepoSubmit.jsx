import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  FileCode,
  Terminal,
  Play,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Bug,
  ShieldAlert,
  Cpu,
  Layers,
  Plus
} from 'lucide-react';

export default function HeroRepoSubmit({
  repoUrl = 'https://github.com/i-m-champion/broken-calculator',
  onRepoUrlChange,
  targetFile = 'calculator.py',
  onTargetFileChange,
  testCmd = 'pytest -v',
  onTestCmdChange,
  status = 'idle',
  iteration = 1,
  maxIterations = 3,
  onQuickFillSample,
  onStartSurgery,
  onOpenPR,
  onOpenAudit
}) {
  const isRunning = status === 'running';
  const isHealed = status === 'healed';

  const presets = [
    {
      id: 'calculator',
      name: 'Calculator',
      category: 'Logic Bugs',
      icon: Bug,
      badge: 'Popular',
      badgeColor: 'bg-blue-950 text-blue-400 border-blue-800',
      description: '3 failing pytest assertions'
    },
    {
      id: 'sanitizer',
      name: 'Sanitizer',
      category: 'Security Trap',
      icon: ShieldAlert,
      badge: 'New',
      badgeColor: 'bg-purple-950 text-purple-400 border-purple-800',
      description: 'Host credential theft attempt'
    },
    {
      id: 'pytest',
      name: 'Pytest Suite',
      category: 'Regression Test',
      icon: Terminal,
      description: 'Multi-turn autonomous repair'
    },
    {
      id: 'sandbox',
      name: 'Micro-Sandbox',
      category: 'Blast Radius Zero',
      icon: ShieldCheck,
      description: 'Quarantined loopback enclave'
    }
  ];

  return (
    <section className="relative w-full pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Bolt.new Blue Atmospheric Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-indigo-900/10 to-transparent pointer-events-none -z-10 blur-2xl" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Heading & Subtitle like Photo 1 */}
        <div className="text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-sans"
          >
            What repository will you heal today?
          </motion.h1>

          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl mx-auto">
            Autonomous code doctor & test repair powered by Vultr Serverless Inference.
          </p>
        </div>

        {/* Hero Prompt Card: Exactly like Photo 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl mx-auto rounded-3xl bg-[#141620]/95 border border-white/[0.09] shadow-2xl p-4 sm:p-5 space-y-4 backdrop-blur-xl relative focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
        >
          {/* Main GitHub Repository URL Input Area */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <FolderGit2 className="h-4 w-4 text-cyan-400" />
              <span>Public GitHub Repository URL:</span>
            </div>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => onRepoUrlChange(e.target.value)}
              disabled={isRunning}
              placeholder="https://github.com/username/repository..."
              className="w-full bg-transparent text-white font-mono text-sm sm:text-base placeholder-zinc-500 outline-none py-1"
            />
          </div>

          {/* Bottom Toolbar inside the prompt card: Exactly like Photo 1 */}
          <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            {/* Left Controls: Target file and test command chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Target File Chip */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300">
                <FileCode className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-zinc-500 text-[10px]">file:</span>
                <input
                  type="text"
                  value={targetFile}
                  onChange={(e) => onTargetFileChange(e.target.value)}
                  disabled={isRunning}
                  placeholder="calculator.py"
                  className="bg-transparent outline-none text-white w-24 text-xs font-mono"
                />
              </div>

              {/* Test Command Chip */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-zinc-500 text-[10px]">cmd:</span>
                <input
                  type="text"
                  value={testCmd}
                  onChange={(e) => onTestCmdChange(e.target.value)}
                  disabled={isRunning}
                  placeholder="pytest -v"
                  className="bg-transparent outline-none text-white w-20 text-xs font-mono"
                />
              </div>
            </div>

            {/* Right Controls: Start Surgery Button (Styled like 'Build now >' in Photo 1) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                <Sparkles className="h-3 w-3 text-blue-400" />
                <span>Vultr Llama 3.3</span>
              </div>

              {isHealed ? (
                <button
                  onClick={onOpenPR}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-sm font-semibold shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>View Healed PR</span>
                </button>
              ) : isRunning ? (
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-sans text-sm font-semibold shadow-md animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Healing repo (Turn {iteration}/{maxIterations})...</span>
                </div>
              ) : (
                <motion.button
                  onClick={onStartSurgery}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:brightness-110 text-white font-sans text-sm font-semibold shadow-lg shadow-blue-500/30 transition cursor-pointer"
                >
                  <span>Start surgery</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Preset Cards: Exactly like Photo 1 (Website, Slides, App, Prototype) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          {presets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => onQuickFillSample(preset.id)}
                disabled={isRunning}
                className="relative group p-3.5 sm:p-4 rounded-2xl bg-[#141620]/80 hover:bg-[#1A1D2C] border border-white/[0.06] hover:border-blue-500/40 transition-all flex flex-col items-center text-center space-y-2 w-28 sm:w-32 shadow-sm cursor-pointer"
              >
                {preset.badge && (
                  <span className={`absolute -top-2 right-2 text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                )}
                <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-sans">{preset.name}</div>
                  <div className="text-[10px] text-zinc-400 font-sans">{preset.category}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* "or start from" Chips: Exactly like Photo 1 */}
        <div className="flex items-center justify-center gap-2 text-xs font-sans text-zinc-400 flex-wrap">
          <span className="text-zinc-500">or start from</span>

          <button
            onClick={() => onQuickFillSample('calculator')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer font-mono text-[11px]"
          >
            <FolderGit2 className="h-3 w-3 text-cyan-400" />
            <span>GitHub Sample</span>
          </button>

          <button
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer font-mono text-[11px]"
          >
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>Security Audit</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('workbench');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer font-mono text-[11px]"
          >
            <Terminal className="h-3 w-3 text-purple-400" />
            <span>Interactive Workbench</span>
          </button>
        </div>
      </div>
    </section>
  );
}
