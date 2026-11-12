import React from 'react';
import { ShieldCheck, Command } from 'lucide-react';
import { MagneticButton } from './KineticPrimitives';

export default function Header({ onOpenAudit, onOpenCommandPalette }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-12 border-b border-zinc-800/80 bg-[#090A0F]/90 backdrop-blur-md px-6 flex items-center justify-between select-none">
      {/* Left: Clean Brand Logo like bolt.new */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        data-cursor="TOP"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="relative h-7 w-7 rounded-full overflow-hidden border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.4)] shrink-0">
          <img
            src="/logo.png"
            alt="RepoSurgeon Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5 font-display">
          <span className="font-bold text-white tracking-tight text-sm">RepoSurgeon</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">v1.0</span>
        </div>
      </div>

      {/* Right: Clean, Minimal Navigation Links + ⌘K Trigger */}
      <nav className="flex items-center gap-5 text-xs font-sans text-zinc-400">
        <button
          onClick={() => scrollTo('workbench')}
          data-cursor="WORKBENCH"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Workbench
        </button>

        <button
          onClick={() => scrollTo('isolation-enclave')}
          data-cursor="ENCLAVE"
          className="hover:text-white transition-colors cursor-pointer hidden sm:block"
        >
          Isolation Enclave
        </button>

        <button
          onClick={() => scrollTo('healing-analytics')}
          data-cursor="METRICS"
          className="hover:text-white transition-colors cursor-pointer hidden md:block"
        >
          Analytics
        </button>

        <button
          onClick={() => scrollTo('audit-trail')}
          data-cursor="AUDIT"
          className="hover:text-white transition-colors cursor-pointer hidden lg:block"
        >
          Audit Trail
        </button>

        <button
          onClick={onOpenCommandPalette}
          data-cursor="CMD"
          title="Open Command Palette (⌘K)"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer font-mono text-[11px]"
        >
          <Command className="h-3 w-3 text-blue-400" />
          <span>K</span>
        </button>

        <MagneticButton
          strength={0.18}
          onClick={onOpenAudit}
          data-cursor="SECURITY"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Security Audit</span>
        </MagneticButton>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/40 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-status-pulse" />
          <span>Vultr Llama 3.3</span>
        </div>
      </nav>
    </header>
  );
}
