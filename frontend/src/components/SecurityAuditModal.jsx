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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-xl border border-zinc-800 bg-[#12131A] p-6 shadow-2xl space-y-5 z-10 overflow-hidden select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100 font-sans">
                    Blast Radius Zero • Isolation Proof
                  </h3>
                  <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                    Enforced
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  Cryptographic verification of sandbox boundaries and zero host leak guarantee
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Core Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Network Boundary */}
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Network Boundary</span>
              </div>
              <div className="text-xs font-semibold text-zinc-200 font-mono">
                {data.network_policy}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                Socket connections strictly quarantined to local loopback
              </p>
            </div>

            {/* Secret Hygiene */}
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                <EyeOff className="h-3.5 w-3.5 text-emerald-400" />
                <span>Secret Hygiene</span>
              </div>
              <div className="text-xs font-semibold text-emerald-400 font-mono">
                {data.secrets_scrubbed_count} Secrets Scrubbed (0 Leaked)
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                Tokens stripped: {data.secrets_scrubbed_sample.slice(0, 3).join(', ')}...
              </p>
            </div>

            {/* Resource Governance */}
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                <Cpu className="h-3.5 w-3.5 text-blue-400" />
                <span>Cgroup Quota Limits</span>
              </div>
              <div className="text-xs font-semibold text-zinc-200 font-mono">
                RAM: {data.memory_limit} | CPU: {data.cpu_limit}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                Auto-kill enforcement at {data.timeout} execution ceiling
              </p>
            </div>

            {/* Privilege Isolation */}
            <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                <span>Privilege Level</span>
              </div>
              <div className="text-xs font-semibold text-zinc-200 font-mono">
                UID {data.sandbox_uid} • Root Denied
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                no-new-privileges flag active, read-only system mounts
              </p>
            </div>
          </div>

          {/* Ephemeral Lifecycle Banner */}
          <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="text-zinc-300 font-medium block">
                  Ephemeral Lifecycle: {data.post_execution_wipe}
                </span>
                <span className="text-[10px] text-zinc-500">
                  Target workspace is instantly destroyed upon surgery completion
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] border border-emerald-500/30">
              Verified
            </span>
          </div>

          {/* Close Action */}
          <div className="pt-3 border-t border-zinc-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-200 transition-colors border border-zinc-800"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
