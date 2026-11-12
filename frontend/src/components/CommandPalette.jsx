import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Play,
  Bug,
  ShieldAlert,
  Layout,
  ShieldCheck,
  Activity,
  Layers,
  GitPullRequest,
  ArrowUp,
  CornerDownLeft,
  X
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  onStartSurgery,
  onQuickFillSample,
  onOpenAudit,
  onOpenPR,
  isHealed,
  status
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const scrollTo = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const actions = [
    {
      id: 'start-surgery',
      label: status === 'running' ? 'Surgery Running...' : 'Start Automated Surgery',
      hint: 'Run Vultr Llama 3.3 diagnostic & repair',
      icon: Play,
      color: 'text-blue-400',
      shortcut: 'RUN',
      disabled: status === 'running',
      run: () => onStartSurgery()
    },
    {
      id: 'sample-calculator',
      label: 'Load Sample: Broken Calculator',
      hint: '3 pytest logic regressions (Operand, ZeroDivision, Exponent)',
      icon: Bug,
      color: 'text-cyan-400',
      shortcut: 'DEMO A',
      run: () => onQuickFillSample('calculator')
    },
    {
      id: 'sample-sanitizer',
      label: 'Load Sample: Auth Sanitizer',
      hint: 'Security exploit & credential theft trap defense',
      icon: ShieldAlert,
      color: 'text-purple-400',
      shortcut: 'DEMO B',
      run: () => onQuickFillSample('sanitizer')
    },
    ...(isHealed
      ? [
          {
            id: 'open-pr',
            label: 'Inspect Healed Pull Request',
            hint: 'Review surgical unified diff & verification badge',
            icon: GitPullRequest,
            color: 'text-emerald-400',
            shortcut: 'PR',
            run: () => onOpenPR()
          }
        ]
      : []),
    {
      id: 'open-audit',
      label: 'Open Sandbox Isolation Security Audit',
      hint: 'Inspect kernel namespace, egress lock, & UID 10001 report',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      shortcut: 'AUDIT',
      run: () => onOpenAudit()
    },
    {
      id: 'jump-workbench',
      label: 'Jump to Split Workbench',
      hint: 'Agent reasoning stream, code editor, diff & terminal',
      icon: Layout,
      color: 'text-zinc-300',
      shortcut: 'NAV',
      run: () => scrollTo('workbench')
    },
    {
      id: 'jump-enclave',
      label: 'Jump to Isolation Enclave',
      hint: 'Live topology & kernel containment proof cards',
      icon: ShieldCheck,
      color: 'text-emerald-300',
      shortcut: 'NAV',
      run: () => scrollTo('isolation-enclave')
    },
    {
      id: 'jump-analytics',
      label: 'Jump to Analytics & Test Matrix',
      hint: 'Zero-regression telemetry & assertion pass/fail breakdown',
      icon: Activity,
      color: 'text-violet-400',
      shortcut: 'NAV',
      run: () => scrollTo('healing-analytics')
    },
    {
      id: 'jump-audit',
      label: 'Jump to Cryptographic Audit Trail',
      hint: 'Raw IPC & sandbox execution event history',
      icon: Layers,
      color: 'text-amber-400',
      shortcut: 'NAV',
      run: () => scrollTo('audit-trail')
    },
    {
      id: 'jump-top',
      label: 'Back to Hero Prompt',
      hint: 'Return to top URL intake screen',
      icon: ArrowUp,
      color: 'text-zinc-400',
      shortcut: 'TOP',
      run: () => scrollTo('top')
    }
  ];

  const filtered = actions.filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.hint.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        const item = filtered[selectedIndex];
        if (!item.disabled) {
          item.run();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="relative z-10 w-full max-w-xl rounded-2xl border border-white/[0.12] bg-[#12131A]/95 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.75),0_0_40px_rgba(37,99,235,0.2)] overflow-hidden"
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
              <Search className="h-4 w-4 text-blue-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, demo scenario, or jump section..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-sans"
              />
              <button
                onClick={onClose}
                data-cursor="CLOSE"
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Action List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-xs font-mono text-zinc-500">
                  No matching commands for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        if (!item.disabled) {
                          item.run();
                          onClose();
                        }
                      }}
                      disabled={item.disabled}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                        isActive
                          ? 'bg-blue-600/15 border border-blue-500/40 text-white'
                          : 'border border-transparent text-zinc-300 hover:bg-zinc-800/50'
                      } ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-8 w-8 rounded-lg bg-[#090A0F] border border-white/[0.08] flex items-center justify-center shrink-0 ${item.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold font-sans truncate">{item.label}</div>
                          <div className="text-[11px] text-zinc-400 font-sans truncate">{item.hint}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/70 text-zinc-400 shrink-0">
                        {item.shortcut}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Key Hints */}
            <div className="px-4 py-2.5 border-t border-white/[0.06] bg-[#0D0E12] flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">↑↓</kbd> navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    <CornerDownLeft className="h-2.5 w-2.5 inline" />
                  </kbd> execute
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">ESC</kbd> close
                </span>
              </div>
              <span className="text-blue-400">RepoSurgeon Command Mesh</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
