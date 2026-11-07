import React, { useState, useRef } from 'react';
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
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function HeroRepoSubmit({
  repoUrl = '',
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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const presets = [
    {
      id: 'calculator',
      name: 'Calculator',
      category: 'Logic Bugs',
      icon: Bug,
      badge: 'Popular',
      badgeColor: 'bg-blue-950/90 text-blue-300 border-blue-500/60',
      description: '3 failing pytest assertions'
    },
    {
      id: 'sanitizer',
      name: 'Sanitizer',
      category: 'Security Trap',
      icon: ShieldAlert,
      badge: 'New',
      badgeColor: 'bg-purple-950/90 text-purple-300 border-purple-500/60',
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

  const handleCardClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-48px)] bolt-hero-gradient flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden select-none">
      {/* Living Multi-Layered Bolt.new Ambient Lighting Atmosphere */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle dot background grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

        {/* Primary Upper Radial Spotlight (Sampled #069ee9 / #009bf7 with Breathing Motion) */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.55, 0.8, 0.55]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1500px] h-[750px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#009bf7]/50 via-[#01409b]/35 to-transparent blur-3xl"
        />

        {/* Center-Right Glowing Flare (Sampled #a2d0f2 from Bolt.new screenshot) */}
        <div className="absolute -right-[10%] top-[20%] w-[600px] sm:w-[850px] h-[550px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#a2d0f2]/30 via-[#069ee9]/15 to-transparent blur-3xl pointer-events-none" />

        {/* Center-Left Ambient Royal Blue Pool (Sampled #01409b from Bolt.new screenshot) */}
        <div className="absolute -left-[10%] top-[25%] w-[600px] sm:w-[850px] h-[550px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#01409b]/45 via-[#0c2e5e]/25 to-transparent blur-3xl pointer-events-none" />

        {/* Bottom Horizon Fade meeting dark canvas */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#090A0F] to-transparent pointer-events-none" />
      </div>

      {/* Spacer for balanced vertical centering */}
      <div className="hidden sm:block h-2" />

      {/* Main Center Content Container */}
      <div className="my-auto w-full max-w-4xl space-y-8 sm:space-y-10 relative z-10 flex flex-col items-center">
        {/* Main Heading & Subtitle: Exactly like Photo 1 */}
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight font-sans drop-shadow-md"
          >
            What repository will you heal today?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl text-blue-100/90 font-sans max-w-2xl mx-auto leading-relaxed drop-shadow-sm"
          >
            Autonomous code doctor &amp; test repair powered by Vultr Serverless Inference.
          </motion.p>
        </div>

        {/* Hero Prompt Card: Dark Translucent Glass Floating in Blue Light */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.35, type: 'spring', stiffness: 350, damping: 25 }}
          onClick={handleCardClick}
          className="w-full max-w-3xl rounded-3xl bg-[#0e111d]/90 hover:bg-[#111524]/95 border border-white/[0.12] hover:border-blue-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(37,99,235,0.2)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_50px_rgba(6,158,233,0.3)] p-6 sm:p-7 space-y-4 backdrop-blur-2xl relative focus-within:border-blue-400/80 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all cursor-text group"
        >
          {/* Top Label */}
          <div className="flex items-center justify-between text-xs font-mono select-none">
            <div className="flex items-center gap-2 text-blue-300">
              <FolderGit2 className="h-4 w-4 text-cyan-400" />
              <span className="font-semibold tracking-wide text-zinc-200">Public GitHub Repository URL:</span>
            </div>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">paste URL or pick a template</span>
          </div>

          {/* Main Input Area with Animated Blinking Cursor */}
          <div className="relative flex items-center min-h-[46px]">
            {/* Blinking Cursor: visible when input is empty or focused */}
            {(!repoUrl || isFocused) && (
              <span className="inline-block w-[2.5px] h-6 bg-cyan-400 rounded-sm animate-blink-cursor mr-2.5 shrink-0 select-none shadow-[0_0_10px_rgba(6,182,212,0.9)]" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={repoUrl}
              onChange={(e) => onRepoUrlChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isRunning}
              placeholder="Paste public GitHub repository URL (e.g. https://github.com/username/repository)..."
              className="w-full bg-transparent text-white font-mono text-base sm:text-lg placeholder-zinc-500 outline-none py-1 selection:bg-blue-600/40 tracking-tight"
            />
          </div>

          {/* Bottom Toolbar: Aesthetic Pills on Left, Start Surgery on FAR RIGHT */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 w-full">
            {/* Left Controls: Aesthetic File, Cmd, and Model Pills */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Aesthetic Target File Pill */}
              <div className="group/chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080d1e]/85 hover:bg-[#0e1633] border border-blue-500/25 hover:border-blue-400/60 shadow-sm transition-all backdrop-blur-md">
                <FileCode className="h-3.5 w-3.5 text-cyan-400 group-hover/chip:text-cyan-300 transition-colors shrink-0" />
                <span className="text-zinc-400 text-[11px] font-mono select-none font-medium">file:</span>
                <input
                  type="text"
                  value={targetFile}
                  onChange={(e) => onTargetFileChange(e.target.value)}
                  disabled={isRunning}
                  placeholder="calculator.py"
                  className="bg-transparent outline-none text-white w-28 text-xs font-mono placeholder-zinc-500 focus:text-cyan-200"
                />
              </div>

              {/* Aesthetic Test Command Pill */}
              <div className="group/chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080d1e]/85 hover:bg-[#0e1633] border border-emerald-500/25 hover:border-emerald-400/60 shadow-sm transition-all backdrop-blur-md">
                <Terminal className="h-3.5 w-3.5 text-emerald-400 group-hover/chip:text-emerald-300 transition-colors shrink-0" />
                <span className="text-zinc-400 text-[11px] font-mono select-none font-medium">cmd:</span>
                <input
                  type="text"
                  value={testCmd}
                  onChange={(e) => onTestCmdChange(e.target.value)}
                  disabled={isRunning}
                  placeholder="pytest -v"
                  className="bg-transparent outline-none text-white w-24 text-xs font-mono placeholder-zinc-500 focus:text-emerald-200"
                />
              </div>

              {/* Aesthetic Vultr Llama 3.3 Pill */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080d1e]/85 border border-white/[0.08] text-xs font-mono text-zinc-300 backdrop-blur-md select-none shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <span>Vultr Llama 3.3</span>
              </div>
            </div>

            {/* Right Action Button: FIRMLY ALIGNED TO THE FAR RIGHT CORNER (Never in middle) */}
            <div className="shrink-0 ml-auto pl-2">
              {isHealed ? (
                <motion.button
                  onClick={onOpenPR}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs sm:text-sm font-bold shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400/50 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>View Healed PR</span>
                </motion.button>
              ) : isRunning ? (
                <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/50 font-sans text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/15 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Healing repo (Turn {iteration}/{maxIterations})...</span>
                </div>
              ) : (
                <motion.button
                  onClick={onStartSurgery}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:brightness-110 text-white font-sans text-xs sm:text-sm font-bold shadow-xl shadow-blue-500/35 ring-2 ring-blue-500/50 hover:ring-cyan-400 cursor-pointer transition-all"
                >
                  <span>Start surgery</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Preset Cards: Styled like Bolt.new Website / Slides / App / Prototype Tiles */}
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
                className="relative group p-4 sm:p-5 rounded-2xl bg-[#0c1328]/80 hover:bg-[#121c3d] border border-white/[0.1] hover:border-blue-400/60 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all flex flex-col items-center text-center space-y-3 w-32 sm:w-36 md:w-40 cursor-pointer backdrop-blur-md"
              >
                {preset.badge && (
                  <span className={`absolute -top-2.5 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                )}
                <div className="h-12 w-12 rounded-xl bg-gradient-to-b from-[#182348] to-[#0d1633] border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
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
        <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-sans text-blue-200/80 flex-wrap pt-1">
          <span className="text-zinc-400">or start from</span>

          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onQuickFillSample('calculator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0c142b]/90 hover:bg-[#121f42] border border-blue-500/30 hover:border-blue-400/60 text-zinc-200 hover:text-white transition cursor-pointer font-mono text-[11px] shadow-sm backdrop-blur-md"
          >
            <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>GitHub Sample</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0c142b]/90 hover:bg-[#121f42] border border-blue-500/30 hover:border-blue-400/60 text-zinc-200 hover:text-white transition cursor-pointer font-mono text-[11px] shadow-sm backdrop-blur-md"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Security Audit</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={scrollToWorkbench}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0c142b]/90 hover:bg-[#121f42] border border-blue-500/30 hover:border-blue-400/60 text-zinc-200 hover:text-white transition cursor-pointer font-mono text-[11px] shadow-sm backdrop-blur-md"
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
        className="relative z-10 pt-4 pb-1 flex flex-col items-center gap-1 text-[11px] font-mono text-blue-200/60 hover:text-cyan-300 transition-colors cursor-pointer select-none group"
      >
        <span className="tracking-wider uppercase text-[10px] text-zinc-400 group-hover:text-cyan-300 transition-colors">
          Scroll to open Live Workbench
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-cyan-300 transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
}
