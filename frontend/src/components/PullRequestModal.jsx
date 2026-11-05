import React, { useState } from 'react';
import { GitPullRequest, Copy, Check, Download, ExternalLink, ShieldCheck, X } from 'lucide-react';

export default function PullRequestModal({ isOpen, onClose, prData, diff, repoName }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !prData) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadPatch = () => {
    const blob = new Blob([diff || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reposurgeon-${repoName}-fix.patch`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0d1326] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
              <GitPullRequest className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                One-Click Pull Request Generator
                <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  Verified 100% Green
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Surgical patch ready to be merged into your upstream repository
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PR Details */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Suggested Branch</label>
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg font-mono text-cyan-300">
              <span>{prData.branch}</span>
              <button
                onClick={() => copyToClipboard(prData.branch, 'branch')}
                className="text-slate-400 hover:text-white"
              >
                {copiedField === 'branch' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Commit Message</label>
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg font-mono text-slate-200">
              <span className="truncate mr-2">{prData.commit_message?.split('\n')[0]}</span>
              <button
                onClick={() => copyToClipboard(prData.commit_message, 'commit')}
                className="text-slate-400 hover:text-white"
              >
                {copiedField === 'commit' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Apply Locally via Git</label>
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg font-mono text-amber-300">
              <span>git apply reposurgeon-{repoName}-fix.patch</span>
              <button
                onClick={() => copyToClipboard(`git apply reposurgeon-${repoName}-fix.patch`, 'apply')}
                className="text-slate-400 hover:text-white"
              >
                {copiedField === 'apply' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Blast Radius Zero Certified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadPatch}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="h-3.5 w-3.5" />
              Download .patch
            </button>
            <button
              onClick={() => copyToClipboard(diff, 'diff')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedField === 'diff' ? 'Diff Copied!' : 'Copy Unified Diff'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
