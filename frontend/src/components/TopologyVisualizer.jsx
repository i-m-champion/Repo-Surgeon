import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  ShieldCheck,
  FolderGit2,
  Lock,
  Zap,
  Activity,
  CheckCircle2,
  Server,
  Terminal,
  ShieldAlert
} from 'lucide-react';

export default function TopologyVisualizer({ status, telemetry, repoName, iteration }) {
  const isRunning = status === 'running';
  const isHealed = status === 'healed';

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#0E1017] rounded-xl border border-zinc-800/80 p-6 overflow-hidden flex flex-col justify-between select-none">
      {/* Background SVG Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Top Topology Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-blue-400">
            <Server className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-100 font-sans flex items-center gap-2">
              Sandbox Infrastructure Topology
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-400 border border-blue-800/50 font-mono">
                Isolated Enclave
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">
              Live node execution mesh & Blast Radius Zero network quarantine boundary
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            0 Egress Quarantined
          </span>
          <span className="px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
            UID: 10001 (sandboxuser)
          </span>
        </div>
      </div>

      {/* Connected Nodes */}
      <div className="relative z-10 flex-1 my-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        {/* Node 1: Vultr Serverless Inference */}
        <div className="relative flex-1 min-w-[170px] p-4 rounded-xl bg-[#12131A] border border-zinc-800/80 flex flex-col items-center text-center space-y-2.5">
          <div className="h-11 w-11 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-blue-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-zinc-200 font-mono">Vultr Inference</div>
            <div className="text-[11px] text-zinc-400 font-mono">Llama 3.3 70B</div>
          </div>
          <div className="w-full pt-2 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Latency</span>
            <span className="text-blue-400 font-semibold">~124ms</span>
          </div>
        </div>

        {/* Animated Connecting Pipeline 1 -> 2 */}
        <div className="hidden sm:flex flex-col items-center justify-center flex-1 max-w-[120px] relative">
          <div className="h-0.5 w-full bg-zinc-800 relative overflow-hidden rounded-full">
            {isRunning && (
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="absolute inset-0 bg-blue-500"
              />
            )}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
            {isRunning ? 'Hotpatching...' : 'TLS Enclave'}
          </span>
        </div>

        {/* Node 2: Ephemeral Micro-Sandbox Boundary */}
        <div className="relative flex-1 min-w-[210px] p-4 rounded-xl bg-[#12131A] border border-zinc-700/80 shadow-sm flex flex-col items-center text-center space-y-2.5">
          <div className="h-12 w-12 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-zinc-100 font-mono flex items-center gap-1.5 justify-center">
              Micro-Sandbox
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-emerald-400 font-mono font-medium">
              Blast Radius Zero
            </div>
          </div>
          <div className="w-full pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-1.5 text-[10px] font-mono text-zinc-400 text-left">
            <div>RAM: <strong className="text-zinc-200">512MB</strong></div>
            <div>CPU: <strong className="text-zinc-200">1.0 Core</strong></div>
            <div>Network: <strong className="text-amber-400">NONE</strong></div>
            <div>Auto-kill: <strong className="text-zinc-400">45s</strong></div>
          </div>
        </div>

        {/* Animated Connecting Pipeline 2 -> 3 */}
        <div className="hidden sm:flex flex-col items-center justify-center flex-1 max-w-[120px] relative">
          <div className="h-0.5 w-full bg-zinc-800 relative overflow-hidden rounded-full">
            {isHealed && (
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="absolute inset-0 bg-emerald-500"
              />
            )}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
            {isHealed ? 'Verified' : 'Pytest Gate'}
          </span>
        </div>

        {/* Node 3: Target Repository */}
        <div className="relative flex-1 min-w-[170px] p-4 rounded-xl bg-[#12131A] border border-zinc-800/80 flex flex-col items-center text-center space-y-2.5">
          <div className="h-11 w-11 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-violet-400">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-zinc-200 font-mono truncate max-w-[140px]">
              {repoName}
            </div>
            <div className={`text-[11px] font-mono ${isHealed ? 'text-emerald-400' : 'text-zinc-400'}`}>
              {isHealed ? 'Clean / Healed' : 'Failing Baseline'}
            </div>
          </div>
          <div className="w-full pt-2 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Isolation</span>
            <span className="text-emerald-400 font-medium">Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Strip */}
      <div className="relative z-10 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Host Secret Hygiene: <strong className="text-emerald-400">0 Leaked (8 Scrubbed)</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[11px]">Runtime:</span>
          <span className="text-zinc-300 font-semibold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            Docker / Ephemeral Process Sandbox
          </span>
        </div>
      </div>
    </div>
  );
}
