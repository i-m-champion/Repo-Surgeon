import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
  Command
} from 'lucide-react';
import HeroWebGLCanvas from './HeroWebGLCanvas';
import { SpotlightCard, MagneticButton } from './KineticPrimitives';

gsap.registerPlugin(useGSAP);

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
  onOpenAudit,
  onOpenCommandPalette
}) {
  const isRunning = status === 'running';
  const isHealed = status === 'healed';
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const heroScopeRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: -14,
        opacity: 0,
        duration: 0.5,
      })
        .from(
          '.hero-headline-word',
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.72,
            stagger: 0.06,
          },
          '-=0.28'
        )
        .from(
          '.hero-subtitle',
          {
            y: 16,
            opacity: 0,
            duration: 0.55,
          },
          '-=0.45'
        )
        .from(
          '.hero-prompt-shell',
          {
            y: 22,
            scale: 0.97,
            opacity: 0,
            duration: 0.65,
          },
          '-=0.35'
        )
        .from(
          '.hero-preset-tile',
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.07,
          },
          '-=0.38'
        )
        .from(
          '.hero-bottom-meta',
          {
            y: 10,
            opacity: 0,
            duration: 0.45,
          },
          '-=0.25'
        );
    },
    { scope: heroScopeRef }
  );

  const presets = [
    {
      id: 'calculator',
      name: 'Calculator',
      category: 'Logic Bugs',
      icon: Bug,
      badge: 'Popular',
      badgeColor: 'bg-blue-950/90 text-blue-300 border-blue-500/60',
      cursor: 'DEMO A'
    },
    {
      id: 'sanitizer',
      name: 'Sanitizer',
      category: 'Security Trap',
      icon: ShieldAlert,
      badge: 'New',
      badgeColor: 'bg-purple-950/90 text-purple-300 border-purple-500/60',
      cursor: 'DEMO B'
    },
    {
      id: 'pytest',
      name: 'Pytest Suite',
      category: 'Regression Test',
      icon: Terminal,
      cursor: 'LOAD SUITE'
    },
    {
      id: 'sandbox',
      name: 'Micro-Sandbox',
      category: 'Blast Radius Zero',
      icon: ShieldCheck,
      cursor: 'ISOLATION'
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
    <section
      ref={heroScopeRef}
      className="relative w-full min-h-[calc(100vh-48px)] bolt-hero-gradient flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-hidden select-none"
    >
      {/* Layer 1: Live 60fps Three.js Custom GLSL FBM Volumetric Backdrop */}
      <HeroWebGLCanvas />

      {/* Subtle atmospheric dot grid & horizon blend above WebGL */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#090A0F] to-transparent" />
      </div>

      {/* Spacer for vertical balance */}
      <div className="hidden sm:block h-2" />

      {/* Main Center Content Container */}
      <div className="my-auto w-full max-w-4xl space-y-8 sm:space-y-9 relative z-10 flex flex-col items-center">
        {/* Heading & Emblem */}
        <div className="text-center space-y-4 flex flex-col items-center">
          <div className="hero-badge inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0a1228]/85 border border-cyan-400/35 shadow-[0_0_24px_rgba(6,182,212,0.28)] backdrop-blur-md mb-1 hover:border-cyan-400/60 transition-colors">
            <div className="relative h-5 w-5 rounded-full overflow-hidden border border-cyan-400/50 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              <img src="/logo.png" alt="RepoSurgeon Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-xs font-mono font-medium tracking-wide text-cyan-300">
              RepoSurgeon • Autonomous Code Doctor
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight drop-shadow-md leading-[1.06]">
            <span className="reveal-mask mr-[0.22em]">
              <span className="hero-headline-word inline-block">What</span>
            </span>
            <span className="reveal-mask mr-[0.22em]">
              <span className="hero-headline-word inline-block">repository</span>
            </span>
            <span className="reveal-mask mr-[0.22em]">
              <span className="hero-headline-word inline-block">will</span>
            </span>
            <span className="reveal-mask mr-[0.22em]">
              <span className="hero-headline-word inline-block">you</span>
            </span>
            <span className="reveal-mask mr-[0.22em]">
              <span className="hero-headline-word inline-block font-serif italic font-normal text-cyan-300 text-[1.08em]">
                heal
              </span>
            </span>
            <span className="reveal-mask">
              <span className="hero-headline-word inline-block">today?</span>
            </span>
          </h1>

          <p className="hero-subtitle text-base sm:text-lg md:text-xl text-blue-100/90 font-sans max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Autonomous code doctor &amp; test repair powered by Vultr Serverless Inference.
          </p>
        </div>

        {/* Hero Prompt Card: Pointer-Tracked Spotlight Border + Dark Glass */}
        <div className="hero-prompt-shell w-full max-w-3xl">
          <SpotlightCard
            onClick={handleCardClick}
            data-cursor="PASTE URL"
            className="w-full rounded-3xl bg-[#0e111d]/92 hover:bg-[#111524]/95 border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_40px_rgba(37,99,235,0.2)] p-6 sm:p-7 space-y-4 backdrop-blur-2xl focus-within:border-blue-400/80 focus-within:ring-2 focus-within:ring-blue-500/30 transition-colors cursor-text"
          >
            {/* Top Label */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono select-none">
              <div className="flex items-center gap-2 text-blue-300">
                <FolderGit2 className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold tracking-wide text-zinc-200">Public GitHub Repository URL:</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCommandPalette?.();
                }}
                data-cursor="COMMAND"
                className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <Command className="h-2.5 w-2.5 text-cyan-400" />
                <span>⌘K quick actions</span>
              </button>
            </div>

            {/* Main Input Area with Animated Blinking Cursor */}
            <div className="relative z-10 flex items-center min-h-[46px]">
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

            {/* Bottom Toolbar: Aesthetic Pills Left, Magnetic CTA Right */}
            <div className="relative z-10 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 w-full">
              {/* Left Controls: Aesthetic File, Cmd, and Model Pills */}
              <div className="flex items-center gap-2.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="group/chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080d1e]/85 hover:bg-[#0e1633] border border-blue-500/25 hover:border-blue-400/60 shadow-sm transition-colors backdrop-blur-md">
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

                <div className="group/chip flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080d1e]/85 hover:bg-[#0e1633] border border-emerald-500/25 hover:border-emerald-400/60 shadow-sm transition-colors backdrop-blur-md">
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

                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080d1e]/85 border border-white/[0.08] text-xs font-mono text-zinc-300 backdrop-blur-md select-none shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  <span>Vultr Llama 3.3</span>
                </div>
              </div>

              {/* Right Magnetic Action Button */}
              <div className="shrink-0 ml-auto pl-2" onClick={(e) => e.stopPropagation()}>
                {isHealed ? (
                  <MagneticButton
                    onClick={onOpenPR}
                    data-cursor="VIEW PR"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs sm:text-sm font-bold shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400/50 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>View Healed PR</span>
                  </MagneticButton>
                ) : isRunning ? (
                  <div
                    data-cursor="OPERATING"
                    className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/50 font-sans text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/15 animate-pulse"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                    <span>Healing repo (Turn {iteration}/{maxIterations})...</span>
                  </div>
                ) : (
                  <MagneticButton
                    onClick={onStartSurgery}
                    data-cursor="OPERATE"
                    className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:brightness-110 text-white font-sans text-xs sm:text-sm font-bold shadow-xl shadow-blue-500/35 ring-2 ring-blue-500/50 hover:ring-cyan-400 cursor-pointer transition-[filter,box-shadow]"
                  >
                    <span>Start surgery</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </MagneticButton>
                )}
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Preset Cards: 3D Perspective Tilt + Spotlight Borders */}
        <div className="flex items-center justify-center gap-3.5 sm:gap-5 flex-wrap">
          {presets.map((preset) => {
            const Icon = preset.icon;
            return (
              <div key={preset.id} className="hero-preset-tile">
                <SpotlightCard
                  tilt
                  tiltStrength={8}
                  data-cursor={preset.cursor}
                  onClick={() => !isRunning && onQuickFillSample(preset.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isRunning) {
                      e.preventDefault();
                      onQuickFillSample(preset.id);
                    }
                  }}
                  className={`relative group p-4 sm:p-5 rounded-2xl bg-[#0c1328]/85 hover:bg-[#121c3d] border border-white/[0.1] shadow-lg hover:shadow-xl hover:shadow-blue-500/20 flex flex-col items-center text-center space-y-3 w-32 sm:w-36 md:w-40 backdrop-blur-md transition-colors ${
                    isRunning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {preset.badge && (
                    <span
                      className={`relative z-10 -mt-1 self-end text-[9px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${preset.badgeColor}`}
                    >
                      {preset.badge}
                    </span>
                  )}
                  <div className="relative z-10 h-12 w-12 rounded-xl bg-gradient-to-b from-[#182348] to-[#0d1633] border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-xs sm:text-sm font-bold text-white font-display group-hover:text-blue-300 transition-colors">
                      {preset.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-zinc-400 font-sans mt-0.5">
                      {preset.category}
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        {/* "or start from" Chips */}
        <div className="hero-bottom-meta flex items-center justify-center gap-3 text-xs sm:text-sm font-sans text-blue-200/80 flex-wrap pt-1">
          <span className="text-zinc-400">or start from</span>

          <MagneticButton
            strength={0.18}
            data-cursor="FILL"
            onClick={() => onQuickFillSample('calculator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0c142b]/90 hover:bg-[#121f42] border border-blue-500/30 hover:border-blue-400/60 text-zinc-200 hover:text-white transition-colors cursor-pointer font-mono text-[11px] shadow-sm backdrop-blur-md"
          >
            <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>GitHub Sample</span>
          </MagneticButton>

          <MagneticButton
            strength={0.18}
            data-cursor="AUDIT"
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0c142b]/90 hover:bg-[#121f42] border border-blue-500/30 hover:border-blue-400/60 text-zinc-200 hover:text-white transition-colors cursor-pointer font-mono text-[11px] shadow-sm backdrop-blur-md"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Security Audit</span>
          </MagneticButton>

          <MagneticButton
            strength={0.18}
            data-cursor="OPEN"
            onClick={scrollToWorkbench}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0c142b]/90 hover:bg-[#121f42] border border-blue-500/30 hover:border-blue-400/60 text-zinc-200 hover:text-white transition-colors cursor-pointer font-mono text-[11px] shadow-sm backdrop-blur-md"
          >
            <Terminal className="h-3.5 w-3.5 text-purple-400" />
            <span>Interactive Workbench</span>
          </MagneticButton>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={scrollToWorkbench}
        data-cursor="EXPLORE"
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
