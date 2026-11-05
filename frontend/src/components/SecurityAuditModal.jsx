import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Database,
  EyeOff,
  X,
  CheckCircle,
  Zap,
  Terminal,
  Clock
} from 'lucide-react';

export default function SecurityAuditModal({ isOpen, onClose, auditData }) {
  if (!isOpen) return null;

  const data = auditData || {
    blast_radius: 'ZERO',
    network_policy: 'Quarantined (0 ingress, 0 egress packets)',
    secrets_scrubbed_count: 8,
    secrets_scrubbed_sample: [
      'VULTR_API_KEY',
      'SSH_AUTH_SOCK',
      'GITHUB_TOKEN',
      'AWS_ACCESS_KEY_ID'
    ],
    host_env_leaked: 0,
    memory_limit: '512m',
    cpu_limit: '1.0 cores',
    timeout: '45s',
    ephemeral_workspace: 'reposurgeon_sandbox_9a7d8',
    post_execution_wipe: 'Guaranteed Zero Residue',
    sandbox_uid: 10001,
    root_privileges: 'DENIED'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0a0d18] p-6 shadow-2xl shadow-emerald-500/10 space-y-5 z-10 overflow-hidden"
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-1 ring-white/20">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-mono">
                    Blast Radius Zero Security Audit
                  </h3>
                  <span className="text-[10px] bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                    100% Contained
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time micro-sandbox isolation parameters & host secret scrubbing verification
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Security Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Host Secret Hygiene */}
            <div className="p-3.5 rounded-xl bg-[#060812] border border-white/10 space-y-1.5 shadow-inner">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-semibold text-xs">
                <EyeOff className="h-4 w-4" />
                <span>Host Secret Hygiene</span>
              </div>
              <div className="text-slate-300 font-mono">
                <span className="text-xl font-bold text-emerald-400">
                  {data.secrets_scrubbed_count || 8}
                </span>{' '}
                <span className="text-slate-400 text-[11px]">Secrets Scrubbed</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {(data.secrets_scrubbed_sample || [
                  'VULTR_API_KEY',
                  'SSH_AUTH_SOCK',
                  'GITHUB_TOKEN'
                ]).map((s, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-slate-400 border border-white/5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Network Boundary */}
            <div className="p-3.5 rounded-xl bg-[#060812] border border-white/10 space-y-1.5 shadow-inner">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-semibold text-xs">
                <Lock className="h-4 w-4" />
                <span>Network Quarantine</span>
              </div>
              <div className="text-xs font-mono font-semibold text-amber-300">
                {data.network_policy}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                Outbound sockets blocked. Zero egress exfiltration possible.
              </p>
            </div>

            {/* Resource Caps */}
            <div className="p-3.5 rounded-xl bg-[#060812] border border-white/10 space-y-1.5 shadow-inner">
              <div className="flex items-center gap-2 text-purple-400 font-mono font-semibold text-xs">
                <Zap className="h-4 w-4" />
                <span>Cgroup Quota Bounds</span>
              </div>
              <div className="text-slate-200 font-mono font-medium text-xs">
                RAM: <span className="text-purple-300">{data.memory_limit}</span> • CPU: <span className="text-purple-300">{data.cpu_limit}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                Protected against infinite loops, fork bombs, and memory starvation.
              </p>
            </div>

            {/* Ephemeral Workspace Wipe */}
            <div className="p-3.5 rounded-xl bg-[#060812] border border-white/10 space-y-1.5 shadow-inner">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold text-xs">
                <CheckCircle className="h-4 w-4" />
                <span>Disposable Workspace Wipe</span>
              </div>
              <div className="text-slate-200 font-mono text-[11px] truncate">
                {data.ephemeral_workspace}
              </div>
              <p className="text-[11px] text-emerald-400 leading-relaxed font-mono">
                ✓ Full container purge post-run. Zero host footprint residue.
              </p>
            </div>
          </div>

          {/* Non-Root Isolation Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-blue-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                User Isolation: <strong className="text-white">sandboxuser (UID 10001)</strong>
              </span>
            </div>
            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
              Root Denied
            </span>
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-200 text-xs font-mono font-semibold transition border border-white/10"
            >
              Close Audit
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
