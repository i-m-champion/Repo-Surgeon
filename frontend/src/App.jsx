import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroRepoSubmit from './components/HeroRepoSubmit';
import SubNavBar from './components/SubNavBar';
import ReasoningFeed from './components/ReasoningFeed';
import Workstation from './components/Workstation';
import DeepTelemetrySection from './components/DeepTelemetrySection';
import HealingAnalyticsSection from './components/HealingAnalyticsSection';
import AuditTrailSection from './components/AuditTrailSection';
import Footer from './components/Footer';
import PullRequestModal from './components/PullRequestModal';
import SecurityAuditModal from './components/SecurityAuditModal';

export default function App() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'healed' | 'error'
  const [logs, setLogs] = useState([]);
  const [diff, setDiff] = useState('');
  const [isHealed, setIsHealed] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [testMetrics, setTestMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [prData, setPrData] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [iteration, setIteration] = useState(1);
  const [maxIterations, setMaxIterations] = useState(3);

  // Modals
  const [isPROpen, setIsPROpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Repos / Scenarios / GitHub URLs
  const [demos, setDemos] = useState([]);
  const [repoUrl, setRepoUrl] = useState('https://github.com/i-m-champion/broken-calculator');
  const [repoName, setRepoName] = useState('broken-calculator');
  const [targetFile, setTargetFile] = useState('calculator.py');
  const [testCmd, setTestCmd] = useState('pytest -v');

  // Mouse tracking for Railway-style ambient cursor spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Direct backend connection (FastAPI has CORS enabled for all origins)
  const apiBase = `http://${window.location.hostname || 'localhost'}:8001`;

  useEffect(() => {
    // Fetch available demo repositories from backend
    fetch(`${apiBase}/api/demos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.demos && data.demos.length > 0) {
          setDemos(data.demos);
        }
      })
      .catch((err) => console.warn('Could not load demos from backend:', err));
  }, []);

  const handleRepoUrlChange = (url) => {
    setRepoUrl(url);
    const lower = url.toLowerCase();
    if (lower.includes('sanitizer')) {
      setRepoName('auth-sanitizer');
      setTargetFile('sanitizer.py');
      setTestCmd('pytest -v');
    } else {
      setRepoName('broken-calculator');
      setTargetFile('calculator.py');
      setTestCmd('pytest -v');
    }
  };

  const handleQuickFillSample = (scenario) => {
    if (scenario === 'sanitizer' || scenario === 'auth-sanitizer') {
      setRepoUrl('https://github.com/i-m-champion/auth-sanitizer');
      setRepoName('auth-sanitizer');
      setTargetFile('sanitizer.py');
      setTestCmd('pytest -v');
    } else {
      setRepoUrl('https://github.com/i-m-champion/broken-calculator');
      setRepoName('broken-calculator');
      setTargetFile('calculator.py');
      setTestCmd('pytest -v');
    }
    resetState();
  };

  const handleRepoChange = (selectedId) => {
    handleQuickFillSample(selectedId);
  };

  const startSurgery = () => {
    setStatus('running');
    setLogs([]);
    setDiff('');
    setIsHealed(false);
    setStats(null);
    setTestMetrics(null);
    setPrData(null);
    setIteration(1);

    // Smoothly scroll down to workbench so live progress is visible
    setTimeout(() => {
      const el = document.getElementById('workbench');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    // Establish WebSocket connection directly to FastAPI backend on port 8001
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const hostName = window.location.hostname || 'localhost';
    const wsUrl = `${protocol}//${hostName}:8001/ws/heal`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          repo_url: repoUrl,
          repo_name: repoName,
          target_file: targetFile,
          test_command: testCmd,
          max_iterations: maxIterations
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => [...prev, data]);

        if (data.payload?.isolation_mode) {
          setTelemetry(data.payload);
        }

        if (data.payload?.security_audit) {
          setAuditData(data.payload.security_audit);
        }

        if (data.payload?.test_metrics) {
          setTestMetrics(data.payload.test_metrics);
        }

        if (data.payload?.iteration) {
          setIteration(data.payload.iteration);
        }

        if (data.payload?.stats) {
          setStats(data.payload.stats);
        }

        if (data.payload?.diff) {
          setDiff(data.payload.diff);
        }

        if (data.payload?.pr_metadata) {
          setPrData(data.payload.pr_metadata);
        }

        if (data.step === 'HEALED' || data.step === 'VERIFIED_GREEN') {
          setStatus('healed');
          setIsHealed(true);
        } else if (data.step === 'ERROR') {
          setStatus('error');
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setStatus('error');
      setLogs((prev) => [
        ...prev,
        {
          step: 'ERROR',
          message:
            'Unable to connect to RepoSurgeon backend (port 8001). Please ensure backend is running.'
        }
      ]);
    };

    ws.onclose = () => {
      if (status === 'running') {
        setStatus('idle');
      }
    };
  };

  const resetState = async () => {
    setStatus('idle');
    setLogs([]);
    setDiff('');
    setIsHealed(false);
    setStats(null);
    setTestMetrics(null);
    setPrData(null);
    setIteration(1);
    try {
      await fetch(`${apiBase}/api/demos/${repoName}/reset`, {
        method: 'POST'
      });
    } catch (e) {
      console.warn('Could not reset demo repo on backend:', e);
    }
  };

  const selectedDemoObj = demos.find((d) => d.id === repoName);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#090A0F] relative text-zinc-100 font-sans selection:bg-blue-600/30 selection:text-white">
      {/* Background Micro Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />

      {/* 1. Clean, Minimal Bolt.new Header (like Photo 3) */}
      <Header onOpenAudit={() => setIsAuditOpen(true)} />

      {/* 2. Hero GitHub Repository Submitting Section (like Photo 1) */}
      <HeroRepoSubmit
        repoUrl={repoUrl}
        onRepoUrlChange={handleRepoUrlChange}
        targetFile={targetFile}
        onTargetFileChange={setTargetFile}
        testCmd={testCmd}
        onTestCmdChange={setTestCmd}
        status={status}
        iteration={iteration}
        maxIterations={maxIterations}
        onQuickFillSample={handleQuickFillSample}
        onStartSurgery={startSurgery}
        onOpenPR={() => setIsPROpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      {/* Sub-Navigation Quick Anchor Bar */}
      <SubNavBar status={status} onStartSurgery={startSurgery} />

      {/* Main Split Workbench (#workbench) */}
      <section id="workbench" className="w-full flex-1 flex flex-col lg:flex-row border-b border-zinc-800/80 min-h-[720px] lg:h-[820px] relative z-10">
        {/* Left Panel: Bolt AI Agent Assistant Feed */}
        <ReasoningFeed
          logs={logs}
          status={status}
          iteration={iteration}
          maxIterations={maxIterations}
          selectedDemoObj={selectedDemoObj}
          testMetrics={testMetrics}
          repoUrl={repoUrl}
          targetFile={targetFile}
          onQuickFillSample={handleQuickFillSample}
          onStartSurgery={startSurgery}
          onSelectScenario={handleRepoChange}
        />

        {/* Right Panel: Bolt IDE Workstation */}
        <Workstation
          logs={logs}
          diff={diff}
          status={status}
          isHealed={isHealed}
          stats={stats}
          telemetry={telemetry}
          testMetrics={testMetrics}
          repoName={repoName}
          repoUrl={repoUrl}
          targetFile={targetFile}
          iteration={iteration}
          onOpenPR={() => setIsPROpen(true)}
          onOpenAudit={() => setIsAuditOpen(true)}
          onQuickFillSample={handleQuickFillSample}
          onStartSurgery={startSurgery}
        />
      </section>

      {/* Section 2: Deep Isolation & Ephemeral Sandbox Security Enclave */}
      <DeepTelemetrySection
        status={status}
        telemetry={telemetry}
        auditData={auditData}
        repoName={repoName}
        iteration={iteration}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      {/* Section 3: Autonomous Diagnosis & Zero Regression Analytics */}
      <HealingAnalyticsSection
        status={status}
        stats={stats}
        testMetrics={testMetrics}
        iteration={iteration}
        maxIterations={maxIterations}
        repoName={repoName}
        diff={diff}
      />

      {/* Section 4: Real-Time Audit Trail & Chronological Event Explorer */}
      <AuditTrailSection
        logs={logs}
        status={status}
        repoName={repoName}
      />

      {/* Section 5: Sleek Developer Footer */}
      <Footer />

      {/* Modals */}
      <PullRequestModal
        isOpen={isPROpen}
        onClose={() => setIsPROpen(false)}
        prData={prData}
        diff={diff}
        repoName={repoName}
      />

      <SecurityAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        auditData={auditData}
      />
    </div>
  );
}
