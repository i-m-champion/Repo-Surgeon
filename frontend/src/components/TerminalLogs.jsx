import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function TerminalLogs({ logs }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const renderStepBadge = (step) => {
    switch (step) {
      case 'HEALED':
      case 'SUCCESS':
        return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded text-xs border border-emerald-800"><CheckCircle2 className="h-3.5 w-3.5" /> {step}</span>;
      case 'ERROR':
        return <span className="flex items-center gap-1 text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded text-xs border border-rose-800"><XCircle className="h-3.5 w-3.5" /> {step}</span>;
      case 'AI_THINKING':
      case 'AI_PROPOSAL':
        return <span className="flex items-center gap-1 text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded text-xs border border-cyan-800"><Sparkles className="h-3.5 w-3.5" /> {step}</span>;
      default:
        return <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-xs font-mono">{step}</span>;
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#090d1a] shadow-xl overflow-hidden flex flex-col h-[520px]">
      <div className="bg-[#0e1424] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Agent Reasoning & Sandbox Execution Stream
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-3">
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-8 text-center">
            Ready to operate. Select a target repo and click "Start Surgery" to begin autonomous diagnosis.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="p-2.5 rounded bg-slate-950/60 border border-slate-800/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderStepBadge(log.step)}
                  <span className="text-slate-200 font-medium">{log.message}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-sans">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>

              {log.payload?.output && (
                <pre className="p-2.5 rounded bg-[#050811] text-slate-300 text-[11px] overflow-x-auto border border-slate-900 leading-relaxed">
                  {log.payload.output}
                </pre>
              )}

              {log.payload?.raw_response && (
                <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-900/40 text-cyan-200 text-[11px] whitespace-pre-wrap">
                  {log.payload.raw_response}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
