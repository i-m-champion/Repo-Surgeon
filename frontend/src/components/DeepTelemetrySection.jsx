import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Cpu,
  EyeOff,
  Terminal,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import TopologyVisualizer from './TopologyVisualizer';

export default function DeepTelemetrySection({
  status,
  telemetry,
  auditData,
  repoName,
  iteration,
  onOpenAudit
}) {
  const isRunning = status === 'running';
  const isHealed = status === 'healed';

  const proofCards = [
    {
      title: 'Quarantined Network Namespace',
      status: '0 Egress / 0 Ingress',
      statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
      icon: Lock,
      iconColor: 'text-emerald-400',
      description:
        'Socket communication is cryptographically locked to local loopback (127.0.0.1). Outbound raw TCP/UDP packet synthesis dropped at kernel boundary.',
      metricLabel: 'Packets Leaked',
      metricValue: '0 pkts'
    },
    {
      title: 'Host Secret Hygiene',
      status: '8 Tokens Scrubbed',
      statusColor: 'text-blue-400 bg-blue-950/40 border-blue-500/30',
      icon: EyeOff,
      iconColor: 'text-blue-400',
      description:
        'Host environment stripped before micro-sandbox container creation. VULTR_API_KEY, SSH_AUTH_SOCK, and cloud credentials zeroed out.',
      metricLabel: 'Host Env Leaks',
      metricValue: '0 bytes'
    },
    {
      title: 'Kernel Cgroup Quota Limits',
      status: 'Enforced',
      statusColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
      icon: Cpu,
      iconColor: 'text-amber-400',
      description:
        'Strict 512MB RAM memory threshold, 1.0 vCPU quota ceiling, and a 45-second hardware watchdog timeout daemon preventing fork-bombs.',
      metricLabel: 'RAM / CPU Cap',
      metricValue: '512MB / 1.0'
    },
    {
      title: 'Non-Root Least Privilege',
      status: 'UID 10001 Active',
      statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
      icon: Terminal,
      iconColor: 'text-emerald-400',
      description:
        'Executed under unprivileged sandboxuser (UID 10001). no-new-privileges bit permanently set; root filesystem mounted strictly read-only.',
      metricLabel: 'Root Elevation',
      metricValue: 'DENIED'
    }
  ];

  return (
    <section id="isolation-enclave" className="w-full py-16 px-4 sm:px-6 lg:px-12 border-b border-zinc-800/80 bg-[#0A0B10]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>BLAST RADIUS ZERO • ISOLATION ENCLAVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              Ephemeral Micro-Sandbox Architecture
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Every surgical repair runs in a freshly minted, quarantined Linux process sandbox. 
              The target code has zero access to host credentials, the local filesystem, or external networks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAudit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-[#12131A] text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition shadow-sm"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Inspect Cryptographic Audit Proof</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* 4 Proof Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {proofCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800/80 bg-[#12131A] p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center">
                      <Icon className={`h-5 w-5 ${card.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${card.statusColor}`}>
                      {card.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-100 font-sans">
                    {card.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">{card.metricLabel}</span>
                  <span className="font-semibold text-zinc-200">{card.metricValue}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Topology Visualizer Deep View */}
        <div className="rounded-xl border border-zinc-800/80 bg-[#12131A] overflow-hidden p-1 shadow-lg">
          <TopologyVisualizer
            status={status}
            telemetry={telemetry}
            repoName={repoName}
            iteration={iteration}
          />
        </div>
      </div>
    </section>
  );
}

