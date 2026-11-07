import React from 'react';
import { Stethoscope, ShieldCheck, Github, ExternalLink } from 'lucide-react';

export default function Header({ onOpenAudit }) {
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
        className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-blue-400">
          <Stethoscope className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1.5 font-sans">
          <span className="font-bold text-white tracking-tight text-sm">RepoSurgeon</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">v1.0</span>
        </div>
      </div>

      {/* Right: Clean, Minimal Navigation Links like bolt.new */}
      <nav className="flex items-center gap-6 text-xs font-sans text-zinc-400">
        <button
          onClick={() => scrollTo('workbench')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Workbench
        </button>

        <button
          onClick={() => scrollTo('isolation-enclave')}
          className="hover:text-white transition-colors cursor-pointer hidden sm:block"
        >
          Isolation Enclave
        </button>

        <button
          onClick={() => scrollTo('healing-analytics')}
          className="hover:text-white transition-colors cursor-pointer hidden md:block"
        >
          Analytics
        </button>

        <button
          onClick={() => scrollTo('audit-trail')}
          className="hover:text-white transition-colors cursor-pointer hidden lg:block"
        >
          Audit Trail
        </button>

        <button
          onClick={onOpenAudit}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Security Audit</span>
        </button>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/40 text-blue-400 border border-blue-500/20 text-[11px] font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-status-pulse" />
          <span>Vultr Llama 3.3</span>
        </div>
      </nav>
    </header>
  );
}
