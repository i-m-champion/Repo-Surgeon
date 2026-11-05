import React from 'react';
import { Shield, Box, Lock, Zap, Clock } from 'lucide-react';

export default function ContainmentCard({ telemetry }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Sandbox Isolation Boundary
          </h2>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800">
          Blast Radius Zero
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Box className="h-3.5 w-3.5 text-blue-400" />
            <span>Container Runtime</span>
          </div>
          <div className="text-sm font-mono font-medium text-slate-200">
            {telemetry?.isolation_mode || 'Docker Micro-Sandbox'}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Network Boundary</span>
          </div>
          <div className="text-sm font-mono font-medium text-amber-300">
            Quarantined (None)
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Zap className="h-3.5 w-3.5 text-purple-400" />
            <span>Resource Cap</span>
          </div>
          <div className="text-sm font-mono font-medium text-slate-200">
            512 MB RAM • 1.0 CPU
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="h-3.5 w-3.5 text-rose-400" />
            <span>Auto-Kill Timeout</span>
          </div>
          <div className="text-sm font-mono font-medium text-slate-200">
            45s Hard Limit
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
        <span>Secret Hygiene: Sanitized ENV</span>
        <span className="text-emerald-400 font-mono">100% Ephemeral Wipe</span>
      </div>
    </div>
  );
}
