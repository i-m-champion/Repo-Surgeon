import React, { useState, useEffect } from 'react';
import { Layout, ShieldCheck, Activity, Layers, Play, Sparkles } from 'lucide-react';

export default function SubNavBar({ status, onStartSurgery }) {
  const [activeSection, setActiveSection] = useState('workbench');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['workbench', 'isolation-enclave', 'healing-analytics', 'audit-trail'];
      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-12 z-40 w-full h-9 border-b border-zinc-800/80 bg-[#090A0F]/85 backdrop-blur-md px-4 flex items-center justify-between text-xs font-mono select-none">
      {/* Left: Section Anchor Tabs */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => scrollTo('workbench')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-colors ${
            activeSection === 'workbench'
              ? 'text-white bg-zinc-800/90 font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Layout className="h-3 w-3 text-blue-400" />
          <span>Workbench</span>
        </button>

        <button
          onClick={() => scrollTo('isolation-enclave')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-colors ${
            activeSection === 'isolation-enclave'
              ? 'text-white bg-zinc-800/90 font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          <span>Isolation Enclave</span>
        </button>

        <button
          onClick={() => scrollTo('healing-analytics')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-colors ${
            activeSection === 'healing-analytics'
              ? 'text-white bg-zinc-800/90 font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Activity className="h-3 w-3 text-purple-400" />
          <span>Analytics & Tests</span>
        </button>

        <button
          onClick={() => scrollTo('audit-trail')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-colors ${
            activeSection === 'audit-trail'
              ? 'text-white bg-zinc-800/90 font-medium'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Layers className="h-3 w-3 text-amber-400" />
          <span>Audit Trail</span>
        </button>
      </div>

      {/* Right: Quick Surgery Status indicator */}
      <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-status-pulse" />
          <span>Vultr Llama 3.3 70B Active</span>
        </span>
      </div>
    </div>
  );
}

