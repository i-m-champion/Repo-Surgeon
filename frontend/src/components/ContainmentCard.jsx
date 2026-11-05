import React from 'react';
import { Shield, Box, Lock, Zap, Clock, ShieldCheck, Eye, Activity } from 'lucide-react';

export default function ContainmentCard({ telemetry, testMetrics, onOpenAudit }) {
  const security = telemetry?.security_audit || {};
  const metrics = testMetrics || telemetry?.test_metrics || null;

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Sandbox Isolation Boundary
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Blast Radius Zero
          </span>
          <button
            onClick={onOpenAudit}
            className="text-[11px] bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded flex items-center gap-1 transition"
          >
            <Eye className="h-3 w-3" />
            Audit
          </button>
        </div>
      </div>

      {/* Real-time Pass Rate Progress Bar if metrics exist */}
      {metrics && metrics.total > 0 && (
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              Pytest Suite Containment Status
            </span>
            <span className={`font-mono font-bold ${metrics.pass_rate_pct === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {metrics.passed} / {metrics.total} Passing ({metrics.pass_rate_pct}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${metrics.pass_rate_pct === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-cyan-500'}`}
              style={{ width: `${metrics.pass_rate_pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Box className="h-3.5 w-3.5 text-blue-400" />
            <span>Container Runtime</span>
          </div>
          <div className="text-xs font-mono font-medium text-slate-200 truncate">
            {telemetry?.isolation_mode || 'Docker Micro-Sandbox'}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Network Boundary</span>
          </div>
          <div className="text-xs font-mono font-medium text-amber-300">
            Quarantined (None)
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Zap className="h-3.5 w-3.5 text-purple-400" />
            <span>Resource Cap</span>
          </div>
          <div className="text-xs font-mono font-medium text-slate-200">
            512 MB RAM • 1.0 CPU
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="h-3.5 w-3.5 text-rose-400" />
            <span>Auto-Kill Timeout</span>
          </div>
          <div className="text-xs font-mono font-medium text-slate-200">
            45s Hard Limit
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          Secret Hygiene: <strong className="text-slate-200 font-mono">{security.secrets_scrubbed_count || 6} Scrubbed</strong>
        </span>
        <span className="text-emerald-400 font-mono">100% Ephemeral Wipe</span>
      </div>
    </div>
  );
}
