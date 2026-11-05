import React from 'react';
import { ShieldCheck, Cpu, Activity, Stethoscope } from 'lucide-react';

export default function Header({ status }) {
  return (
    <header className="border-b border-slate-800 bg-[#090d1a]/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">RepoSurgeon</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                v1.0 • Vultr Agent Rush
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Code Doctor & Test Runner inside Secure Vultr Micro-Sandboxes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Vultr Inference Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/80 text-xs text-blue-300">
            <Cpu className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span>Vultr Serverless Inference</span>
          </div>

          {/* Blast Radius Zero Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Blast Radius Zero: Quarantined</span>
          </div>

          {/* Live Activity Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Activity className={`h-3.5 w-3.5 ${status === 'running' ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
            <span className="capitalize">{status}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
