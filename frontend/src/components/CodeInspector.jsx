import React, { useState } from 'react';
import { FileCode, Copy, Check, AlertCircle } from 'lucide-react';

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
    { num: 11, text: '    return b - a', bug: true, error: 'Reversed operands: returns (b - a) instead of (a - b)' },
    { num: 12, text: '', bug: false },
    { num: 13, text: 'def multiply(a: float, b: float) -> float:', bug: false },
    { num: 14, text: '    """Multiply two numbers."""', bug: false },
    { num: 15, text: '    return a * b', bug: false },
    { num: 16, text: '', bug: false },
    { num: 17, text: 'def divide(a: float, b: float) -> float:', bug: false },
    { num: 18, text: '    """Divide a by b (BUG: Missing zero check)."""', bug: false },
    { num: 19, text: '    if b == 0:', bug: false },
    { num: 20, text: '        # Missing: raise ValueError("Cannot divide by zero")', bug: true, error: 'Missing exception: should raise ValueError("Cannot divide by zero")' },
    { num: 21, text: '    return a / b', bug: false },
    { num: 22, text: '', bug: false },
    { num: 23, text: 'def power(a: float, b: float) -> float:', bug: false },
    { num: 24, text: '    """Raise a to the power of b."""', bug: false },
    { num: 25, text: '    return a ** (b - 1)', bug: true, error: 'Off-by-one exponent: returns a**(b-1) instead of a**b' }
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
    { num: 9, text: '    return user_input.replace("<script>", "")', bug: true, error: 'Incomplete sanitization: leaves closing tags and uppercase variants unhandled' },
    { num: 10, text: '', bug: false },
    { num: 11, text: 'def mask_credit_card(card_number: str) -> str:', bug: false },
    { num: 12, text: '    """Mask all digits of a credit card except the last 4 digits."""', bug: false },
    { num: 13, text: '    if not card_number: return ""', bug: false },
    { num: 14, text: '    digits_only = re.sub(r"\\D", "", card_number)', bug: false },
    { num: 15, text: '    # BUG: Off-by-one slice error exposing 5 digits instead of 4', bug: false },
    { num: 16, text: '    masked = "*" * (len(digits_only) - 5) + digits_only[-5:]', bug: true, error: 'PCI-DSS violation: exposes 5 digits instead of allowed maximum of 4 digits' },
    { num: 17, text: '    return "-".join([masked[i:i+4] for i in range(0, len(masked), 4)])', bug: false },
    { num: 18, text: '', bug: false },
    { num: 19, text: 'def sanitize_username(username: str) -> str:', bug: false },
    { num: 20, text: '    if username is None: raise ValueError("Username cannot be None")', bug: false },
    { num: 21, text: '    return re.sub(r"[^a-zA-Z0-9]", "", username)', bug: true, error: 'Invalid filter: strips valid underscore characters from username string' }
  ];

  const lines = isCalculator ? calculatorCode : sanitizerCode;

  const copyCode = () => {
    const raw = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCodeTokens = (text) => {
    if (!text) return '\u00A0';

    // VS Code dark syntax coloring with high contrast
    if (text.startsWith('def ')) {
      const match = text.match(/^def\s+([a-zA-Z0-9_]+)(.*)$/);
      if (match) {
        return (
          <>
            <span className="text-[#C586C0] font-bold">def </span>
            <span className="text-[#DCDCAA] font-semibold">{match[1]}</span>
            <span className="text-[#9CDCFE]">{match[2]}</span>
          </>
        );
      }
    }
    if (text.startsWith('import ') || text.startsWith('from ')) {
      return <span className="text-[#C586C0] font-semibold">{text}</span>;
    }
    if (text.trim().startsWith('return ')) {
      return (
        <>
          <span className="text-zinc-500">    </span>
          <span className="text-[#C586C0] font-bold">return </span>
          <span className="text-[#9CDCFE]">{text.trim().replace(/^return\s+/, '')}</span>
        </>
      );
    }
    if (text.trim().startsWith('"""') || text.trim().startsWith('#')) {
      return <span className="text-[#6A9955] italic font-sans">{text}</span>;
    }

    return <span className="text-[#F4F4F5]">{text}</span>;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#05070F] select-text">
      {/* Code Editor Body */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-[13px] leading-6">
        <div className="space-y-0.5">
          {lines.map((line, idx) => (
            <div key={idx} className="group">
              <div
                className={`flex items-start rounded px-2 transition-colors ${
                  line.bug ? 'bg-rose-950/30' : 'hover:bg-zinc-800/40'
                }`}
              >
                {/* Gutter Line Numbers with High Contrast */}
                <span className="w-9 shrink-0 text-right pr-4 select-none text-xs text-slate-400 font-mono font-medium">
                  {line.num}
                </span>

                {/* Code Line */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`whitespace-pre ${
                      line.bug
                        ? 'underline decoration-rose-500 decoration-wavy underline-offset-4 text-rose-200'
                        : ''
                    }`}
                  >
                    {renderCodeTokens(line.text)}
                  </div>
                </div>
              </div>

              {/* VS Code Style Inline Diagnostic Annotation */}
              {line.bug && (
                <div className="ml-11 my-1.5 mr-2 px-3 py-1.5 rounded-lg bg-[#180A0E] border border-rose-500/50 text-xs font-mono text-rose-200 flex items-center gap-2 shadow-sm">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span className="font-semibold">{line.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
