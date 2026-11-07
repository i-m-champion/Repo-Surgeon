import React from 'react';
import { ArrowUp, ShieldCheck, Zap, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#090A0F] py-12 px-4 sm:px-6 lg:px-12 text-zinc-400 font-sans text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0">
            <img src="/logo.png" alt="RepoSurgeon Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-mono text-sm tracking-tight">RepoSurgeon</span>
              <span className="text-[10px] bg-blue-950/60 text-blue-400 border border-blue-800/50 px-2 py-0.2 rounded-full font-mono">
                v1.0.0
              </span>
            </div>
            <p className="text-zinc-500 text-[11px] font-sans">
              Autonomous Code Doctor & Ephemeral Micro-Sandbox Repair Mesh
            </p>
          </div>
        </div>

        {/* Center: Quick Anchor Links */}
        <div className="flex items-center gap-6 font-mono text-[11px] text-zinc-400">
          <button
            onClick={() => scrollTo('workbench')}
            className="hover:text-white transition-colors"
          >
            Workbench
          </button>
          <button
            onClick={() => scrollTo('isolation-enclave')}
            className="hover:text-white transition-colors"
          >
            Isolation Enclave
          </button>
          <button
            onClick={() => scrollTo('healing-analytics')}
            className="hover:text-white transition-colors"
          >
            Healing Analytics
          </button>
          <button
            onClick={() => scrollTo('audit-trail')}
            className="hover:text-white transition-colors"
          >
            Audit Trail
          </button>
        </div>

        {/* Right: Status & Back to Top */}
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Vultr Llama 3.3 Ready</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Back to Top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

