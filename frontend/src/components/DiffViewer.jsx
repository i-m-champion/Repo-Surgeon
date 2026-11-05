import React from 'react';
import { GitPullRequest, FileCode, CheckCircle } from 'lucide-react';

export default function DiffViewer({ diff, isHealed }) {
  if (!diff) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-6 text-center text-slate-500 shadow-xl flex flex-col items-center justify-center h-[260px]">
        <FileCode className="h-10 w-10 text-slate-600 mb-2 stroke-[1.5]" />
        <p className="text-sm">No patch applied yet.</p>
        <p className="text-xs text-slate-600 mt-1">Surgical diffs will appear here once the agent diagnoses failing tests.</p>
      </div>
    );
  }

  const renderDiffLine = (line, idx) => {
    let lineClass = 'text-slate-300';
    if (line.startsWith('+') && !line.startsWith('+++')) {
      lineClass = 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 pl-1';
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      lineClass = 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 pl-1';
    } else if (line.startsWith('@')) {
      lineClass = 'text-cyan-400 font-semibold bg-cyan-950/20 py-0.5';
    }

    return (
      <div key={idx} className={`font-mono text-xs whitespace-pre py-0.5 ${lineClass}`}>
        {line}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d1326] shadow-xl overflow-hidden flex flex-col">
      <div className="bg-[#0e1424] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Surgical Patch (Unified Diff)
          </span>
        </div>
        {isHealed && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800">
            <CheckCircle className="h-3.5 w-3.5" />
            PR Ready & Verified Green
          </span>
        )}
      </div>

      <div className="p-4 overflow-x-auto max-h-[300px] overflow-y-auto bg-[#070b14] divide-y divide-transparent">
        {diff.split('\n').map((line, idx) => renderDiffLine(line, idx))}
      </div>
    </div>
  );
}
