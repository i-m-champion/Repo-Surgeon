import React, { useState } from 'react';
import { FileCode, AlertTriangle, Copy, Check, Sparkles, ShieldAlert } from 'lucide-react';

export default function CodeInspector({ repoName = 'broken-calculator', targetFile = 'calculator.py' }) {
  const [copied, setCopied] = useState(false);

  const isCalculator = repoName === 'broken-calculator';

  const calculatorCode = [
    { num: 1, text: '"""', bug: false },
    { num: 2, text: 'Calculator Module with intentional bugs for RepoSurgeon to diagnose and repair.', bug: false },
    { num: 3, text: '"""', bug: false },
    { num: 4, text: '', bug: false },
    { num: 5, text: 'def add(a: float, b: float) -> float:', bug: false },
    { num: 6, text: '    """Add two numbers."""', bug: false },
    { num: 7, text: '    return a + b', bug: false },
    { num: 8, text: '', bug: false },
    { num: 9, text: 'def subtract(a: float, b: float) -> float:', bug: false },
    { num: 10, text: '    """Subtract b from a (BUG: reversed operands)."""', bug: false },
    { num: 11, text: '    return b - a', bug: true, note: '⚠️ BUG 1: Reversed operands (returns b - a instead of a - b)' },
    { num: 12, text: '', bug: false },
    { num: 13, text: 'def multiply(a: float, b: float) -> float:', bug: false },
    { num: 14, text: '    """Multiply two numbers."""', bug: false },
    { num: 15, text: '    return a * b', bug: false },
    { num: 16, text: '', bug: false },
    { num: 17, text: 'def divide(a: float, b: float) -> float:', bug: false },
    { num: 18, text: '    """Divide a by b (BUG: Missing zero check)."""', bug: false },
    { num: 19, text: '    if b == 0:', bug: false },
    { num: 20, text: '        # Missing: raise ValueError("Cannot divide by zero")', bug: true, note: '⚠️ BUG 2: Unhandled ZeroDivisionError (fails test_divide_zero specification)' },
    { num: 21, text: '    return a / b', bug: false },
    { num: 22, text: '', bug: false },
    { num: 23, text: 'def power(a: float, b: float) -> float:', bug: false },
    { num: 24, text: '    """Raise a to the power of b."""', bug: false },
    { num: 25, text: '    return a ** (b - 1)', bug: true, note: '⚠️ BUG 3: Off-by-one exponent error (returns a**(b-1) instead of a**b)' }
  ];

  const sanitizerCode = [
    { num: 1, text: '"""', bug: false },
    { num: 2, text: 'Auth & Input Sanitizer Module with intentional security bugs.', bug: false },
    { num: 3, text: '"""', bug: false },
    { num: 4, text: 'import re', bug: false },
    { num: 5, text: '', bug: false },
    { num: 6, text: 'def sanitize_input(user_input: str) -> str:', bug: false },
    { num: 7, text: '    """Remove dangerous HTML/script tags to prevent XSS."""', bug: false },
    { num: 8, text: '    if not user_input: return ""', bug: false },
    { num: 9, text: '    return user_input.replace("<script>", "")', bug: true, note: '⚠️ BUG 1: Incomplete regex (leaves closing & uppercase script tags intact)' },
    { num: 10, text: '', bug: false },
    { num: 11, text: 'def mask_credit_card(card_number: str) -> str:', bug: false },
    { num: 12, text: '    """Mask all digits of a credit card except the last 4 digits."""', bug: false },
    { num: 13, text: '    if not card_number: return ""', bug: false },
    { num: 14, text: '    digits_only = re.sub(r"\\D", "", card_number)', bug: false },
    { num: 15, text: '    # BUG: Off-by-one slice error exposing 5 digits instead of 4', bug: false },
    { num: 16, text: '    masked = "*" * (len(digits_only) - 5) + digits_only[-5:]', bug: true, note: '⚠️ BUG 2: Off-by-one slice exposing 5 digits (PCI-DSS compliance breach)' },
    { num: 17, text: '    return "-".join([masked[i:i+4] for i in range(0, len(masked), 4)])', bug: false },
    { num: 18, text: '', bug: false },
    { num: 19, text: 'def sanitize_username(username: str) -> str:', bug: false },
    { num: 20, text: '    if username is None: raise ValueError("Username cannot be None")', bug: false },
    { num: 21, text: '    return re.sub(r"[^a-zA-Z0-9]", "", username)', bug: true, note: '⚠️ BUG 3: Strips valid underscore characters from usernames' }
  ];

  const lines = isCalculator ? calculatorCode : sanitizerCode;

  const copyCode = () => {
    const raw = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#020409]">
      {/* File Header Bar */}
      <div className="px-4 py-2.5 bg-[#050812] border-b border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-cyan-400" />
          <span className="text-slate-200 font-semibold">{targetFile}</span>
          <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-mono">
            3 Failing Logic Bugs Detected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[10px] font-mono transition border border-white/10"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy Source</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-1 font-mono text-xs selection:bg-cyan-900 selection:text-white">
        <div className="p-3.5 rounded-2xl bg-[#010307] border border-white/[0.06] shadow-2xl space-y-1">
          {lines.map((line, idx) => {
            let syntaxClass = 'text-slate-300';
            if (line.text.startsWith('def ')) syntaxClass = 'text-purple-400 font-semibold';
            else if (line.text.startsWith('    return ')) syntaxClass = 'text-blue-300';
            else if (line.text.startsWith('    """') || line.text.startsWith('"""')) syntaxClass = 'text-slate-500 italic';
            else if (line.text.startsWith('import ')) syntaxClass = 'text-amber-400';

            return (
              <div
                key={idx}
                className={`flex items-start gap-2 py-0.5 px-1.5 rounded transition-colors ${
                  line.bug ? 'bg-rose-950/30 border-l-2 border-rose-500 text-rose-200' : 'hover:bg-white/[0.02]'
                }`}
              >
                <span className="w-8 shrink-0 text-right pr-2 select-none text-[10px] text-slate-600 font-mono">
                  {line.num < 10 ? `0${line.num}` : line.num}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`whitespace-pre ${syntaxClass}`}>{line.text}</span>
                  {line.note && (
                    <div className="text-[10px] text-rose-400 font-mono font-medium mt-0.5 pl-2 border-l border-rose-800/80">
                      {line.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint Strip */}
      <div className="p-3 border-t border-white/[0.08] bg-[#070b16]/90 backdrop-blur-xl flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Click <strong>Start Surgery</strong> above to trigger Vultr Llama 3.3 auto-heal</span>
        </span>
        <span className="text-[10px] text-slate-500">
          Target File: {targetFile} (Python 3.11)
        </span>
      </div>
    </div>
  );
}
