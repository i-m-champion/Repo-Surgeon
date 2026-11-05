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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-xl border border-zinc-800 bg-[#12131A] p-6 shadow-2xl space-y-5 z-10 overflow-hidden select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-blue-400">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100 font-sans">
                    1-Click Pull Request Bundle
                  </h3>
                  <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                    Verified Green
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  Autonomous surgical patch ready for upstream review
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* PR Details */}
          <div className="space-y-4">
            {/* PR Title */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
                <span>PR Title</span>
                <button
                  onClick={() => copyToClipboard(prData.title, 'title')}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                >
                  {copiedField === 'title' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-200">
                {prData.title}
              </div>
            </div>

            {/* Target Branch & Files */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[11px] mb-1">Target Branch</span>
                <span className="text-blue-400 font-semibold">{prData.branch}</span>
              </div>
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[11px] mb-1">Files Changed</span>
                <span className="text-zinc-200 font-semibold">
                  {prData.files_changed ? prData.files_changed.join(', ') : '1 file'}
                </span>
              </div>
            </div>

            {/* Description Body */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
                <span>PR Description (Markdown)</span>
                <button
                  onClick={() => copyToClipboard(prData.body, 'body')}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                >
                  {copiedField === 'body' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 max-h-44 overflow-y-auto whitespace-pre-wrap select-text">
                {prData.body}
              </pre>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={downloadPatch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-850 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-blue-400" />
              <span>Download .patch File</span>
            </button>

            <button
              onClick={() => {
                copyToClipboard(prData.body, 'all');
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-xs font-mono font-medium text-white hover:brightness-110 transition shadow-sm"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Full PR Details</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
