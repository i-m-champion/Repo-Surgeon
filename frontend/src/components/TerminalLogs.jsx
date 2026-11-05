import React, { useEffect, useRef, useState } from 'react';
import { Terminal, CheckCircle2, XCircle, AlertCircle, Sparkles, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';

export default function TerminalLogs({ logs }) {
  const endRef = useRef(null);
  const [filter, setFilter] = useState('ALL'); // ALL, AI, SANDBOX

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const renderStepBadge = (step) => {
    switch (step) {
      case 'HEALED':
      case 'SUCCESS':
        return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded text-xs border border-emerald-800 font-bold"><CheckCircle2 className="h-3.5 w-3.5" /> {step}</span>;
      case 'ERROR':
        return <span className="flex items-center gap-1 text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded text-xs border border-rose-800"><XCircle className="h-3.5 w-3.5" /> {step}</span>;
      case 'ITERATION_RETRY':
        return <span className="flex items-center gap-1 text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded text-xs border border-amber-800 animate-pulse"><RefreshCw className="h-3.5 w-3.5" /> RETRY</span>;
      case 'AI_THINKING':
      case 'AI_PROPOSAL':
        return <span className="flex items-center gap-1 text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded text-xs border border-cyan-800"><Sparkles className="h-3.5 w-3.5" /> {step}</span>;
      case 'SANDBOX_START':
      case 'SANDBOX_VERIFY':
      case 'SANDBOX_RESULT':
      case 'SANDBOX_VERIFY_RESULT':
        return <span className="flex items-center gap-1 text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded text-xs border border-blue-800"><ShieldCheck className="h-3.5 w-3.5" /> SANDBOX</span>;
      case 'PATCH_GENERATED':
        return <span className="text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded text-xs border border-purple-800 font-mono">DIFF</span>;
      default:
        return <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-xs font-mono">{step}</span>;
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'AI') {
      return log.step?.startsWith('AI_') || log.payload?.raw_response;
    }
    if (filter === 'SANDBOX') {
      return log.step?.startsWith('SANDBOX_') || log.payload?.output;
    }
    return true;
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-[#090d1a] shadow-xl overflow-hidden flex flex-col h-[520px]">
      <div className="bg-[#0e1424] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Agent Reasoning & Sandbox Execution Stream
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2 py-0.5 rounded transition ${filter === 'ALL' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilter('AI')}
            className={`px-2 py-0.5 rounded transition ${filter === 'AI' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Vultr AI
          </button>
          <button
            onClick={() => setFilter('SANDBOX')}
            className={`px-2 py-0.5 rounded transition ${filter === 'SANDBOX' ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sandbox
          </button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 italic py-12 text-center space-y-1">
            <p>Ready to operate.</p>
            <p className="text-[11px] text-slate-600">Select a target repository above and click "Start Surgery" to begin autonomous diagnosis.</p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div key={index} className="p-2.5 rounded bg-slate-950/60 border border-slate-800/60 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-2">
                  {renderStepBadge(log.step)}
                  <span className="text-slate-200 font-medium">{log.message}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {log.payload?.inference_telemetry?.latency_ms && (
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-0.5 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-900">
                      <Cpu className="h-2.5 w-2.5" />
                      {log.payload.inference_telemetry.latency_ms}ms
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-sans">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {log.payload?.output && (
                <pre className="p-2.5 rounded bg-[#050811] text-slate-300 text-[11px] overflow-x-auto border border-slate-900 leading-relaxed max-h-48 overflow-y-auto">
                  {log.payload.output}
                </pre>
              )}

              {log.payload?.raw_response && (
                <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-900/40 text-cyan-200 text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
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
