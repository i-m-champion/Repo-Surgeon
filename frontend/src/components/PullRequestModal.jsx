import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitPullRequest,
  Copy,
  Check,
  Download,
  ShieldCheck,
  X,
  FileCode,
  Terminal,
  ExternalLink,
  Sparkles
} from 'lucide-react';

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
    a.download = `reposurgeon-${repoName || 'fix'}.patch`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0a0d18] p-6 shadow-2xl shadow-cyan-500/10 space-y-5 z-10 overflow-hidden"
        >
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
                <GitPullRequest className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-mono">
                    1-Click Pull Request Ready
                  </h3>
                  <span className="text-[10px] bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-semibold">
                    100% Green
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Verified surgical patch ready to merge into upstream repository
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* PR Details */}
          <div className="space-y-3.5 text-xs">
            {/* Branch */}
            <div>
              <label className="text-slate-400 font-mono text-[11px] mb-1.5 block">
                Suggested Git Branch
              </label>
              <div className="flex items-center justify-between bg-[#05070f] border border-white/10 px-3 py-2 rounded-xl font-mono text-cyan-300 shadow-inner">
                <span className="truncate mr-2">{prData.branch}</span>
                <button
                  onClick={() => copyToClipboard(prData.branch, 'branch')}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition shrink-0"
                >
                  {copiedField === 'branch' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Commit Message */}
            <div>
              <label className="text-slate-400 font-mono text-[11px] mb-1.5 block">
                Generated Commit Message
              </label>
              <div className="flex items-center justify-between bg-[#05070f] border border-white/10 px-3 py-2 rounded-xl font-mono text-slate-200 shadow-inner">
                <span className="truncate mr-2">
                  {prData.commit_message?.split('\n')[0]}
                </span>
                <button
                  onClick={() => copyToClipboard(prData.commit_message, 'commit')}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition shrink-0"
                >
                  {copiedField === 'commit' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Apply via Git */}
            <div>
              <label className="text-slate-400 font-mono text-[11px] mb-1.5 block">
                Apply Locally via Git CLI
              </label>
              <div className="flex items-center justify-between bg-[#04060b] border border-emerald-500/30 px-3 py-2 rounded-xl font-mono text-emerald-300 shadow-inner">
                <span className="truncate mr-2">
                  git apply reposurgeon-{repoName || 'fix'}.patch
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `git apply reposurgeon-${repoName || 'fix'}.patch`,
                      'apply'
                    )
                  }
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition shrink-0"
                >
                  {copiedField === 'apply' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="h-4 w-4" />
              <span>Blast Radius Zero Certified</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadPatch}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 border border-white/10 transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .patch</span>
              </button>
              <button
                onClick={() => copyToClipboard(diff, 'diff')}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedField === 'diff' ? 'Diff Copied!' : 'Copy Unified Diff'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
