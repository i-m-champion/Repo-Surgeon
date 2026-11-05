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
    <div className="relative w-full h-full min-h-[380px] bg-[#03060d] rounded-2xl border border-white/[0.08] p-6 overflow-hidden flex flex-col justify-between select-none">
      {/* Background SVG Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Topology Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
            <Server className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-mono flex items-center gap-2">
              Railway Sandbox Topology
              <span className="text-[9px] px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                Isolated Infrastructure
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Real-time node telemetry & Blast Radius Zero network quarantine boundary
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            0 Network Egress
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/10">
            UID: 10001 (sandboxuser)
          </span>
        </div>
      </div>

      {/* Interactive Infrastructure Canvas with Connected Nodes */}
      <div className="relative z-10 flex-1 my-6 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        {/* Node 1: Vultr Serverless Inference */}
        <motion.div
          animate={isRunning ? { scale: [1, 1.03, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative flex-1 min-w-[160px] p-4 rounded-2xl bg-[#070b16] border border-blue-500/30 shadow-lg shadow-blue-500/5 flex flex-col items-center text-center space-y-2 group hover:border-blue-500/60 transition"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-md group-hover:opacity-100 transition" />
            <div className="relative h-12 w-12 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
              <Cpu className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white font-mono">Vultr Inference</div>
            <div className="text-[10px] text-cyan-400 font-mono">Llama 3.3 70B</div>
          </div>
          <div className="w-full pt-2 border-t border-white/5 text-[9px] font-mono text-slate-400 flex items-center justify-between">
            <span>Latency</span>
            <span className="text-cyan-300 font-bold">~124ms</span>
          </div>
        </motion.div>

        {/* Animated Connecting Energy Beam 1 -> 2 */}
        <div className="hidden sm:flex flex-col items-center justify-center flex-1 max-w-[120px] relative">
          <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400 relative overflow-hidden">
            {isRunning && (
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="absolute inset-0 bg-white shadow-[0_0_8px_#fff]"
              />
            )}
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
            {isRunning ? 'Hotpatching...' : 'TLS Enclave'}
          </span>
        </div>

        {/* Node 2: Ephemeral Micro-Sandbox Boundary */}
        <motion.div
          animate={isRunning ? { borderColor: ['rgba(6,182,212,0.4)', 'rgba(16,185,129,0.7)', 'rgba(6,182,212,0.4)'] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative flex-1 min-w-[200px] p-4 rounded-2xl bg-[#060a16] border border-cyan-500/40 shadow-xl shadow-cyan-500/10 flex flex-col items-center text-center space-y-2 group"
        >
          <div className="relative">
            <div className="relative h-14 w-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              <ShieldCheck className="h-7 w-7 text-cyan-400" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5 justify-center">
              Micro-Sandbox
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-semibold">
              Blast Radius Zero
            </div>
          </div>
          <div className="w-full pt-2 border-t border-white/5 grid grid-cols-2 gap-1 text-[9px] font-mono text-slate-400 text-left">
            <div>RAM: <strong className="text-white">512MB</strong></div>
            <div>CPU: <strong className="text-white">1.0 Core</strong></div>
            <div>Network: <strong className="text-amber-400">NONE</strong></div>
            <div>Auto-kill: <strong className="text-rose-400">45s</strong></div>
          </div>
        </motion.div>

        {/* Animated Connecting Energy Beam 2 -> 3 */}
        <div className="hidden sm:flex flex-col items-center justify-center flex-1 max-w-[120px] relative">
          <div className="h-0.5 w-full bg-gradient-to-r from-cyan-400 to-emerald-400 relative overflow-hidden">
            {isHealed && (
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="absolute inset-0 bg-emerald-300 shadow-[0_0_8px_#10b981]"
              />
            )}
          </div>
          <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
            {isHealed ? 'Verified 100%' : 'Pytest Gate'}
          </span>
        </div>

        {/* Node 3: Target Repository */}
        <div className="relative flex-1 min-w-[160px] p-4 rounded-2xl bg-[#070b16] border border-white/10 shadow-lg flex flex-col items-center text-center space-y-2 group hover:border-purple-500/40 transition">
          <div className="relative">
            <div className="relative h-12 w-12 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
              <FolderGit2 className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white font-mono truncate max-w-[130px]">
              {repoName}
            </div>
            <div className="text-[10px] text-purple-300 font-mono">
              {isHealed ? 'Clean / Healed' : 'Failing Tests'}
            </div>
          </div>
          <div className="w-full pt-2 border-t border-white/5 text-[9px] font-mono text-slate-400 flex items-center justify-between">
            <span>Isolation</span>
            <span className="text-emerald-400 font-bold">Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Metrics Strip */}
      <div className="relative z-10 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Host Secret Hygiene: <strong className="text-emerald-400">0 Leaked (8 Scrubbed)</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px]">Runtime:</span>
          <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
            Docker / Isolated Subprocess Micro-Sandbox
          </span>
        </div>
      </div>
    </div>
  );
}

