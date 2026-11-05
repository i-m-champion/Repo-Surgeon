import React, { useState } from 'react';
import { FileCode, Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CodeInspector({
  repoName = 'broken-calculator',
  targetFile = 'calculator.py',
  isHealed = false
}) {
  const [copied, setCopied] = useState(false);

  const isCalculator = repoName === 'broken-calculator';
  const isTestFile = targetFile.startsWith('test_');

  // Code definition for calculator.py
  const calculatorCode = [
    { num: 1, text: '"""', bug: false },
    { num: 2, text: 'Calculator Module with intentional logic bugs for RepoSurgeon to diagnose and repair.', bug: false },
    { num: 3, text: '"""', bug: false },
    { num: 4, text: '', bug: false },
    { num: 5, text: 'def add(a: float, b: float) -> float:', bug: false },
    { num: 6, text: '    """Add two numbers."""', bug: false },
    { num: 7, text: '    return a + b', bug: false },
    { num: 8, text: '', bug: false },
    { num: 9, text: 'def subtract(a: float, b: float) -> float:', bug: false },
    { num: 10, text: '    """Subtract b from a (BUG: reversed operands)."""', bug: false },
    {
      num: 11,
      text: isHealed ? '    return a - b' : '    return b - a',
      bug: !isHealed,
      fixed: isHealed,
      error: 'Reversed operands: returns (b - a) instead of (a - b)'
    },
    { num: 12, text: '', bug: false },
    { num: 13, text: 'def multiply(a: float, b: float) -> float:', bug: false },
    { num: 14, text: '    """Multiply two numbers."""', bug: false },
    { num: 15, text: '    return a * b', bug: false },
    { num: 16, text: '', bug: false },
    { num: 17, text: 'def divide(a: float, b: float) -> float:', bug: false },
    { num: 18, text: '    """Divide a by b (BUG: Missing zero check)."""', bug: false },
    { num: 19, text: '    if b == 0:', bug: false },
    {
      num: 20,
      text: isHealed
        ? '        raise ValueError("Cannot divide by zero")'
        : '        # Missing: raise ValueError("Cannot divide by zero")',
      bug: !isHealed,
      fixed: isHealed,
      error: 'Missing exception: must raise ValueError("Cannot divide by zero")'
    },
    { num: 21, text: '    return a / b', bug: false },
    { num: 22, text: '', bug: false },
    { num: 23, text: 'def power(a: float, b: float) -> float:', bug: false },
    { num: 24, text: '    """Raise a to the power of b."""', bug: false },
    {
      num: 25,
      text: isHealed ? '    return a ** b' : '    return a ** (b - 1)',
      bug: !isHealed,
      fixed: isHealed,
      error: 'Off-by-one exponent: returns a**(b-1) instead of a**b'
    }
  ];

  // Code definition for test_calculator.py
  const testCalculatorCode = [
    { num: 1, text: 'import pytest', bug: false },
    { num: 2, text: 'from calculator import add, subtract, multiply, divide, power', bug: false },
    { num: 3, text: '', bug: false },
    { num: 4, text: 'def test_add():', bug: false },
    { num: 5, text: '    assert add(2, 3) == 5', bug: false },
    { num: 6, text: '    assert add(-1, 1) == 0', bug: false },
    { num: 7, text: '', bug: false },
    { num: 8, text: 'def test_multiply():', bug: false },
    { num: 9, text: '    assert multiply(3, 4) == 12', bug: false },
    { num: 10, text: '    assert multiply(0, 100) == 0', bug: false },
    { num: 11, text: '', bug: false },
    { num: 12, text: 'def test_subtract():', bug: false },
    { num: 13, text: '    # Fails initially: 10 - 4 should be 6, but calculator returns -6', bug: false },
    { num: 14, text: '    assert subtract(10, 4) == 6', bug: false },
    { num: 15, text: '', bug: false },
    { num: 16, text: 'def test_divide_by_zero():', bug: false },
    { num: 17, text: '    # Fails initially: should raise ValueError', bug: false },
    { num: 18, text: '    with pytest.raises(ValueError, match="Cannot divide by zero"):', bug: false },
    { num: 19, text: '        divide(10, 0)', bug: false },
    { num: 20, text: '', bug: false },
    { num: 21, text: 'def test_power():', bug: false },
    { num: 22, text: '    # Fails initially: 2 ** 3 should be 8, but returns 4', bug: false },
    { num: 23, text: '    assert power(2, 3) == 8', bug: false },
    { num: 24, text: '    assert power(5, 2) == 25', bug: false }
  ];

  // Sanitizer code
  const sanitizerCode = [
    { num: 1, text: '"""', bug: false },
    { num: 2, text: 'Auth & Input Sanitizer Module with intentional security vulnerabilities.', bug: false },
    { num: 3, text: '"""', bug: false },
    { num: 4, text: 'import re', bug: false },
    { num: 5, text: '', bug: false },
    { num: 6, text: 'def sanitize_input(user_input: str) -> str:', bug: false },
    { num: 7, text: '    """Remove dangerous HTML/script tags to prevent XSS."""', bug: false },
    { num: 8, text: '    if not user_input: return ""', bug: false },
    {
      num: 9,
      text: isHealed
        ? '    return re.sub(r"<script.*?>.*?</script>", "", user_input, flags=re.I|re.S)'
        : '    return user_input.replace("<script>", "")',
      bug: !isHealed,
      fixed: isHealed,
      error: 'Incomplete sanitization: leaves closing tags and uppercase variants unhandled'
    },
    { num: 10, text: '', bug: false },
    { num: 11, text: 'def mask_credit_card(card_number: str) -> str:', bug: false },
    { num: 12, text: '    """Mask all digits of a credit card except the last 4 digits."""', bug: false },
    { num: 13, text: '    if not card_number: return ""', bug: false },
    { num: 14, text: '    digits_only = re.sub(r"\\D", "", card_number)', bug: false },
    {
      num: 15,
      text: isHealed
        ? '    masked = "*" * (len(digits_only) - 4) + digits_only[-4:]'
        : '    masked = "*" * (len(digits_only) - 5) + digits_only[-5:]',
      bug: !isHealed,
      fixed: isHealed,
      error: 'PCI violation: exposes 5 digits instead of allowed maximum of 4 digits'
    },
    { num: 16, text: '    return "-".join([masked[i:i+4] for i in range(0, len(masked), 4)])', bug: false },
    { num: 17, text: '', bug: false },
    { num: 18, text: 'def sanitize_username(username: str) -> str:', bug: false },
    { num: 19, text: '    if username is None: raise ValueError("Username cannot be None")', bug: false },
    {
      num: 20,
      text: isHealed
        ? '    return re.sub(r"[^a-zA-Z0-9_]", "", username)'
        : '    return re.sub(r"[^a-zA-Z0-9]", "", username)',
      bug: !isHealed,
      fixed: isHealed,
      error: 'Invalid filter: strips valid underscore characters from username string'
    }
  ];

  let lines = calculatorCode;
  if (isTestFile) {
    lines = testCalculatorCode;
  } else if (!isCalculator) {
    lines = sanitizerCode;
  }

  const copyCode = () => {
    const raw = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCodeTokens = (text) => {
    if (!text) return '\u00A0';

    // Python syntax highlighting
    if (text.startsWith('def ')) {
      const match = text.match(/^def\s+([a-zA-Z0-9_]+)(.*)$/);
      if (match) {
        return (
          <>
            <span className="text-[#C586C0] font-semibold">def </span>
            <span className="text-[#DCDCAA] font-medium">{match[1]}</span>
            <span className="text-[#9CDCFE]">{match[2]}</span>
          </>
        );
      }
    }
    if (text.startsWith('import ') || text.startsWith('from ')) {
      return <span className="text-[#C586C0] font-medium">{text}</span>;
    }
    if (text.trim().startsWith('return ')) {
      const indent = text.match(/^\s*/)[0];
      return (
        <>
          <span className="text-zinc-600">{indent}</span>
          <span className="text-[#C586C0] font-semibold">return </span>
          <span className="text-[#9CDCFE]">{text.trim().replace(/^return\s+/, '')}</span>
        </>
      );
    }
    if (text.trim().startsWith('raise ')) {
      const indent = text.match(/^\s*/)[0];
      return (
        <>
          <span className="text-zinc-600">{indent}</span>
          <span className="text-[#C586C0] font-semibold">raise </span>
          <span className="text-[#4EC9B0]">{text.trim().replace(/^raise\s+/, '')}</span>
        </>
      );
    }
    if (text.trim().startsWith('if ') || text.trim().startsWith('with ')) {
      const indent = text.match(/^\s*/)[0];
      const keyword = text.trim().startsWith('if ') ? 'if' : 'with';
      return (
        <>
          <span className="text-zinc-600">{indent}</span>
          <span className="text-[#C586C0] font-semibold">{keyword} </span>
          <span className="text-[#9CDCFE]">{text.trim().substring(keyword.length + 1)}</span>
        </>
      );
    }
    if (text.trim().startsWith('assert ')) {
      const indent = text.match(/^\s*/)[0];
      return (
        <>
          <span className="text-zinc-600">{indent}</span>
          <span className="text-[#4EC9B0] font-semibold">assert </span>
          <span className="text-[#9CDCFE]">{text.trim().replace(/^assert\s+/, '')}</span>
        </>
      );
    }
    if (text.trim().startsWith('"""') || text.trim().startsWith('#')) {
      return <span className="text-[#6A9955] italic">{text}</span>;
    }

    return <span className="text-[#D4D4D4]">{text}</span>;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0D1117] select-text">
      {/* Editor Content Area */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs leading-5">
        <div className="space-y-0.5">
          {lines.map((line, idx) => (
            <div key={idx} className="group">
              {/* Code Line Row */}
              <div
                className={`flex items-start rounded px-2 py-0.5 transition-colors ${
                  line.fixed
                    ? 'bg-emerald-950/25 border-l-2 border-emerald-500'
                    : line.bug
                    ? 'bg-rose-950/25 border-l-2 border-rose-500'
                    : 'hover:bg-zinc-800/30'
                }`}
              >
                {/* Gutter Line Numbers */}
                <span className="w-8 shrink-0 text-right pr-4 select-none text-[11px] text-zinc-600 font-mono">
                  {line.num}
                </span>

                {/* Tokenized Code Text */}
                <span className="flex-1 whitespace-pre">{renderCodeTokens(line.text)}</span>

                {/* Status Badge on line */}
                {line.fixed && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/80 font-mono">
                    <CheckCircle2 className="h-3 w-3" /> Healed
                  </span>
                )}
              </div>

              {/* Sleek VS Code Inline Diagnostic Chip */}
              {line.bug && (
                <div className="my-1 ml-10 mr-2 p-2 rounded-md bg-[#160B0E] border border-rose-500/30 flex items-center gap-2 text-rose-300 text-[11px] font-mono shadow-sm">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span className="font-semibold text-rose-200">Error:</span>
                  <span className="text-zinc-300">{line.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
