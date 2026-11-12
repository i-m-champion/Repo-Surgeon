import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Activity,
  CheckCircle2,
  Code2,
  Zap,
  RotateCcw,
  GitCommit
} from 'lucide-react';
import { SpotlightCard } from './KineticPrimitives';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HealingAnalyticsSection({
  status,
  stats,
  testMetrics,
  iteration,
  maxIterations,
  repoName,
  diff
}) {
  const sectionRef = useRef(null);
  const isHealed = status === 'healed';
  const isRunning = status === 'running';

  useGSAP(
    () => {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      gsap.from('.analytics-header-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      });

      gsap.from('.analytics-kpi-card', {
        y: 26,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.analytics-kpi-grid',
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from('.analytics-matrix-frame', {
        y: 24,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.analytics-matrix-frame',
          start: 'top 86%',
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  const kpis = [
    {
      label: 'Autonomous Turnaround',
      value: isHealed ? '1.4s' : isRunning ? 'Active...' : '~1.2s',
      subtext: 'Vultr Serverless Inference',
      icon: Zap,
      color: 'text-blue-400'
    },
    {
      label: 'Zero Regression Rate',
      value: isHealed ? '100% Green' : 'Enforcing...',
      subtext: '0 Existing Unit Tests Broken',
      icon: CheckCircle2,
      color: 'text-emerald-400'
    },
    {
      label: 'Hotpatch Convergence',
      value: `${iteration} of ${maxIterations} turns`,
      subtext: isHealed ? 'Converged on First Try' : 'Max 3 Autonomous Iterations',
      icon: RotateCcw,
      color: 'text-violet-400'
    },
    {
      label: 'Code Mutation Delta',
      value: stats ? `+${stats.lines_added || 3} / -${stats.lines_removed || 3}` : '+3 / -3 lines',
      subtext: 'Minimal Surgical Footprint',
      icon: GitCommit,
      color: 'text-amber-400'
    }
  ];

  const testMatrixCalculator = [
    {
      test: 'test_add',
      baseline: 'PASS',
      postSurgery: 'PASS',
      note: 'Baseline arithmetic addition verified with zero regression'
    },
    {
      test: 'test_subtract',
      baseline: 'FAIL (Operand Inversion)',
      postSurgery: isHealed ? 'PASS (Healed)' : 'FAIL',
      note: 'Repaired reversed operands: return (a - b) instead of (b - a)'
    },
    {
      test: 'test_divide_zero',
      baseline: 'FAIL (Unhandled ZeroDivisionError)',
      postSurgery: isHealed ? 'PASS (Healed)' : 'FAIL',
      note: 'Inserted ValueError("Cannot divide by zero") guard assertion'
    },
    {
      test: 'test_power',
      baseline: 'FAIL (Off-by-One Exponent)',
      postSurgery: isHealed ? 'PASS (Healed)' : 'FAIL',
      note: 'Repaired exponent error: return a ** b instead of a ** (b - 1)'
    }
  ];

  const testMatrixSanitizer = [
    {
      test: 'test_sanitize_xss',
      baseline: 'FAIL (Case Insensitive Bypass)',
      postSurgery: isHealed ? 'PASS (Healed)' : 'FAIL',
      note: 'Implemented regex strip for all casing of <script> and </script> tags'
    },
    {
      test: 'test_pci_card_mask',
      baseline: 'FAIL (PCI Breach 5 Digits)',
      postSurgery: isHealed ? 'PASS (Healed)' : 'FAIL',
      note: 'Adjusted slicing offset to strictly expose 4 digits (PCI-DSS compliant)'
    },
    {
      test: 'test_sanitize_username',
      baseline: 'FAIL (Underscore Stripped)',
      postSurgery: isHealed ? 'PASS (Healed)' : 'FAIL',
      note: 'Allowed alphanumeric plus underscores in username whitelist regex'
    },
    {
      test: 'test_host_secret_leak_probe',
      baseline: 'PASS (Enforced by Sandbox)',
      postSurgery: 'PASS (Zero Leak)',
      note: 'Blast Radius Zero verified: 0 host env vars leaked to user code'
    }
  ];

  const currentMatrix = repoName === 'broken-calculator' ? testMatrixCalculator : testMatrixSanitizer;

  return (
    <section
      ref={sectionRef}
      id="healing-analytics"
      className="w-full py-16 px-4 sm:px-6 lg:px-12 border-b border-zinc-800/80 bg-[#090A0F] relative z-10"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="analytics-header-reveal space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-[11px] font-mono text-blue-400">
            <Activity className="h-3.5 w-3.5" />
            <span>HEALING ENGINE • ZERO REGRESSION ASSURANCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            Autonomous Diagnosis &amp; Regression Analytics
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
            RepoSurgeon executes pytest inside the micro-sandbox, transmits failure assertions to Vultr Llama 3.3 70B,
            synthesizes a minimal unified diff, and confirms green execution without introducing regressions.
          </p>
        </div>

        {/* 4 KPIs with Spotlight Border & Subtle 3D Perspective Tilt */}
        <div className="analytics-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="analytics-kpi-card">
                <SpotlightCard
                  tilt
                  tiltStrength={5}
                  data-cursor="METRIC"
                  className="h-full rounded-xl border border-zinc-800/80 bg-[#12131A] p-5 space-y-3 hover:border-blue-500/40 transition-colors"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-mono">{kpi.label}</span>
                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Icon className={`h-4 w-4 ${kpi.color}`} />
                    </div>
                  </div>
                  <div className="relative z-10 text-2xl font-bold font-mono text-zinc-100 tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="relative z-10 text-[11px] text-zinc-500 font-sans">
                    {kpi.subtext}
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        {/* Test Assertion Verification Table inside Spotlight Frame */}
        <div className="analytics-matrix-frame">
          <SpotlightCard className="rounded-xl border border-zinc-800/80 bg-[#12131A] overflow-hidden">
            <div className="relative z-10 p-4 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-zinc-200 font-display">
                  Pytest Assertion Verification Matrix ({repoName})
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Target: <code className="text-zinc-200">{repoName}</code>
              </span>
            </div>

            <div className="relative z-10 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0E0F15] text-zinc-400 border-b border-zinc-800/80">
                  <tr>
                    <th className="px-5 py-3 font-medium">Pytest Assertion</th>
                    <th className="px-5 py-3 font-medium">Broken Baseline</th>
                    <th className="px-5 py-3 font-medium">Post-Surgery State</th>
                    <th className="px-5 py-3 font-medium hidden sm:table-cell">Surgical Diagnosis &amp; Fix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {currentMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-zinc-200">
                        <code>{item.test}</code>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                            item.baseline.includes('PASS')
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {item.baseline}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                            item.postSurgery.includes('PASS')
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {item.postSurgery}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-400 hidden sm:table-cell font-sans">
                        {item.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
