import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  FileCode,
  Terminal,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Bug,
  ShieldAlert,
  ChevronDown
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
      badgeColor: 'bg-blue-950/90 text-blue-300 border-blue-600/60',
      description: '3 failing pytest assertions'
    },
    {
      id: 'sanitizer',
      name: 'Sanitizer',
      category: 'Security Trap',
      icon: ShieldAlert,
      badge: 'New',
      badgeColor: 'bg-purple-950/90 text-purple-300 border-purple-600/60',
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

  const scrollToWorkbench = () => {
    const el = document.getElementById('workbench');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-48px)] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden select-none">
      {/* Living Multi-Layered Bolt.new Ambient Atmosphere */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Primary Upper Radial Spotlight (Breathing Motion) */}
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.45, 0.7, 0.45]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1300px] h-[650px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/40 via-indigo-600/20 to-transparent blur-3xl"
        />

        {/* Secondary Core Ambient Aura Behind the Prompt Box */}
        <div className="absolute top-[32%] left-1/2 -translate-x-1/2 w-[550px] sm:w-[950px] h-[480px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/25 via-blue-600/10 to-transparent blur-3xl" />

        {/* Subtle Horizon Ground Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950/20 to-transparent pointer-events-none" />
      </div>

      {/* Spacer to balance vertical centering */}
      <div className="hidden sm:block h-2" />

      {/* Main Center Content Container */}
      <div className="my-auto w-full max-w-4xl space-y-8 sm:space-y-10 relative z-10 flex flex-col items-center">
        {/* Main Heading & Subtitle: Exactly like Photo 1 */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight font-sans drop-shadow-sm"
          >
            What repository will you heal today?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl text-zinc-300 font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Autonomous code doctor &amp; test repair powered by Vultr Serverless Inference.
          </motion.p>
        </div>

        {/* Hero Prompt Card: Spacious, Sleek & Tactile like Photo 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.35, type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-3xl rounded-3xl bg-[#141620]/95 border border-white/[0.1] hover:border-blue-500/40 shadow-2xl hover:shadow-blue-500/15 p-6 sm:p-7 space-y-5 backdrop-blur-2xl relative focus-within:border-blue-500/70 focus-within:ring-2 focus-within:ring-blue-500/25 transition-all group"
        >
          {/* Main GitHub Repository URL Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-cyan-400" />
                <span className="font-medium text-zinc-300">Public GitHub Repository URL:</span>
              </div>
              <span className="text-[11px] text-zinc-500 hidden sm:inline">public repo or sample</span>
            </div>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => onRepoUrlChange(e.target.value)}
              disabled={isRunning}
              placeholder="https://github.com/username/repository..."
              className="w-full bg-transparent text-white font-mono text-base sm:text-lg placeholder-zinc-500 outline-none py-1.5 selection:bg-blue-600/40 tracking-tight"
            />
          </div>

          {/* Bottom Toolbar inside prompt card: Exactly like Photo 1 */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            {/* Left Controls: Target file and test command chips */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Target File Chip */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-750 hover:border-zinc-600 transition text-xs font-mono text-zinc-200 shadow-sm">
                <FileCode className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-zinc-500 text-[11px]">file:</span>
                <input
                  type="text"
                  value={targetFile}
                  onChange={(e) => onTargetFileChange(e.target.value)}
                  disabled={isRunning}
                  placeholder="calculator.py"
                  className="bg-transparent outline-none text-white w-28 text-xs font-mono"
                />
              </div>

              {/* Test Command Chip */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-750 hover:border-zinc-600 transition text-xs font-mono text-zinc-200 shadow-sm">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-zinc-500 text-[11px]">cmd:</span>
                <input
                  type="text"
                  value={testCmd}
                  onChange={(e) => onTestCmdChange(e.target.value)}
                  disabled={isRunning}
                  placeholder="pytest -v"
                  className="bg-transparent outline-none text-white w-24 text-xs font-mono"
                />
              </div>
            </div>

            {/* Right Controls: Start Surgery Button (Styled like 'Build now >' in Photo 1) */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <span>Vultr Llama 3.3</span>
              </div>

              {isHealed ? (
                <motion.button
                  onClick={onOpenPR}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-sm font-bold shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400/50 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>View Healed PR</span>
                </motion.button>
              ) : isRunning ? (
                <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/50 font-sans text-sm font-bold shadow-lg shadow-amber-500/15 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Healing repo (Turn {iteration}/{maxIterations})...</span>
                </div>
              ) : (
                <motion.button
                  onClick={onStartSurgery}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:brightness-110 text-white font-sans text-sm font-bold shadow-xl shadow-blue-500/30 ring-2 ring-blue-500/50 hover:ring-cyan-400 cursor-pointer transition-all"
                >
                  <span>Start surgery</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Preset Cards: Exactly like Photo 1 with Staggered Entrance & Hover Spring Elevation */}
        <div className="flex items-center justify-center gap-3.5 sm:gap-5 flex-wrap">
          {presets.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <motion.button
                key={preset.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.08, type: 'spring', stiffness: 350, damping: 25 }}
                whileHover={{ y: -6, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onQuickFillSample(preset.id)}
                disabled={isRunning}
                className="relative group p-4 sm:p-5 rounded-2xl bg-[#141620]/90 hover:bg-[#1A1D2C] border border-white/[0.08] hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/15 transition-all flex flex-col items-center text-center space-y-3 w-32 sm:w-36 md:w-40 shadow-sm cursor-pointer"
              >
                {preset.badge && (
                  <span className={`absolute -top-2.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                )}
                <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white font-sans group-hover:text-blue-300 transition-colors">
                    {preset.name}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-zinc-400 font-sans mt-0.5">
                    {preset.category}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* "or start from" Chips: Exactly like Photo 1 with Micro-spring animations */}
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-sans text-zinc-400 flex-wrap pt-1">
          <span className="text-zinc-500">or start from</span>

          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onQuickFillSample('calculator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 text-zinc-200 hover:text-white transition cursor-pointer font-mono text-[11px] shadow-sm"
          >
            <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>GitHub Sample</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 text-zinc-200 hover:text-white transition cursor-pointer font-mono text-[11px] shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Security Audit</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={scrollToWorkbench}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-600 text-zinc-200 hover:text-white transition cursor-pointer font-mono text-[11px] shadow-sm"
          >
            <Terminal className="h-3.5 w-3.5 text-purple-400" />
            <span>Interactive Workbench</span>
          </motion.button>
        </div>
      </div>

      {/* Bottom Scroll Cue Indicator: Invites user to explore the live workbench below */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={scrollToWorkbench}
        className="relative z-10 pt-4 pb-1 flex flex-col items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-blue-400 transition-colors cursor-pointer select-none group"
      >
        <span className="tracking-wider uppercase text-[10px] text-zinc-500 group-hover:text-blue-300 transition-colors">
          Scroll to open Live Workbench
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
}
