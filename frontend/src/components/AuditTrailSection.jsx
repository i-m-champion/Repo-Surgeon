import React, { useState } from 'react';
import {
  Layers,
  Terminal,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Search,
  Filter
} from 'lucide-react';

export default function AuditTrailSection({ logs = [], status = 'idle', repoName }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedIndices, setExpandedIndices] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const copyPayload = (payload, key) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadAuditLog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `reposurgeon-audit-${repoName || 'session'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'AI' && !log.step?.startsWith('AI_') && !log.payload?.raw_response) {
      return false;
    }
    if (filter === 'SANDBOX' && !log.step?.startsWith('SANDBOX_') && !log.payload?.output) {
      return false;
    }
    if (filter === 'ERRORS' && log.step !== 'ERROR' && log.payload?.status !== 'FAILED') {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchStep = log.step?.toLowerCase().includes(q);
      const matchMsg = log.message?.toLowerCase().includes(q);
      const matchOutput = typeof log.payload?.output === 'string' && log.payload.output.toLowerCase().includes(q);
      return matchStep || matchMsg || matchOutput;
    }
    return true;
  });

  return (
    <section id="audit-trail" className="w-full py-16 px-4 sm:px-6 lg:px-12 border-b border-zinc-800/80 bg-[#0A0B10]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] font-mono text-zinc-300">
              <Layers className="h-3.5 w-3.5" />
              <span>CRYPTOGRAPHIC LOGS • REAL-TIME AUDIT STREAM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              System Audit Trail & Event History
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Every IPC event, isolated sandbox sub-process launch, model token generation, 
              and patch verification checksum is immutably logged for post-mortem analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadAuditLog}
              disabled={logs.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-800 bg-[#12131A] text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5 text-blue-400" />
              <span>Export Session Audit JSON</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-3 rounded-xl border border-zinc-800/80 bg-[#12131A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'AI', 'SANDBOX', 'ERRORS'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                  filter === f
                    ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {f} {f === 'ALL' && `(${logs.length})`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by step or keyword..."
              className="w-full bg-[#0E0F15] border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Logs Explorer List */}
        <div className="rounded-xl border border-zinc-800/80 bg-[#12131A] overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-zinc-500">
                <Terminal className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold text-zinc-300 font-sans">
                {logs.length === 0 ? 'Audit Stream Standing By' : 'No matching audit records found'}
              </div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto font-sans">
                {logs.length === 0
                  ? 'Trigger surgery from the workbench above to start streaming live cryptographic telemetry and pytest execution traces.'
                  : 'Adjust your search query or filter parameters to view other recorded session events.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80 max-h-[500px] overflow-y-auto font-mono text-xs">
              {filteredLogs.map((log, idx) => {
                const isExpanded = !!expandedIndices[idx];
                const hasPayload = log.payload && Object.keys(log.payload).length > 0;

                return (
                  <div key={idx} className="hover:bg-zinc-900/40 transition-colors">
                    <div
                      onClick={() => hasPayload && toggleExpand(idx)}
                      className={`p-4 flex items-center justify-between gap-4 cursor-pointer ${
                        hasPayload ? '' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {hasPayload ? (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-zinc-500 shrink-0" />
                          )
                        ) : (
                          <div className="w-4 shrink-0" />
                        )}

                        <span className="text-zinc-600 text-[11px] shrink-0">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 border ${
                          log.step === 'HEALED' || log.step === 'SUCCESS'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : log.step === 'ERROR'
                            ? 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                            : log.step?.startsWith('AI_')
                            ? 'bg-blue-950/40 text-blue-400 border-blue-500/30'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                        }`}>
                          {log.step}
                        </span>

                        <span className="text-zinc-300 truncate font-sans text-xs">
                          {log.message}
                        </span>
                      </div>

                      {hasPayload && (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-zinc-500 hidden sm:inline">
                            {Object.keys(log.payload).length} payload keys
                          </span>
                        </div>
                      )}
                    </div>

                    {isExpanded && hasPayload && (
                      <div className="px-5 pb-4 pt-1 bg-[#0E0F15] border-t border-zinc-800/60 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-zinc-500">
                          <span>Raw Event Payload:</span>
                          <button
                            onClick={() => copyPayload(log.payload, `payload-${idx}`)}
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                          >
                            {copiedKey === `payload-${idx}` ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy JSON</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-black/60 border border-zinc-800 text-zinc-300 text-[11px] overflow-x-auto whitespace-pre-wrap max-h-60 overflow-y-auto">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

