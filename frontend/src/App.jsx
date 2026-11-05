import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReasoningFeed from './components/ReasoningFeed';
import Workstation from './components/Workstation';
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

  // Repos / Scenarios
  const [demos, setDemos] = useState([]);
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

  // Resolve API Base
  const isDev =
    window.location.port === '5173' || window.location.port === '3000';
  const apiBase = isDev ? '' : `http://${window.location.hostname}:8001`;

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

  const handleRepoChange = (selectedId) => {
    setRepoName(selectedId);
    const demo = demos.find((d) => d.id === selectedId);
    if (demo) {
      setTargetFile(demo.target_file || 'calculator.py');
      setTestCmd(demo.test_command || 'pytest -v');
    } else if (selectedId === 'auth-sanitizer') {
      setTargetFile('sanitizer.py');
      setTestCmd('pytest -v');
    } else {
      setTargetFile('calculator.py');
      setTestCmd('pytest -v');
    }
    resetState();
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

    // Establish WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = isDev ? window.location.host : `${window.location.hostname}:8001`;
    const wsUrl = `${protocol}//${wsHost}/ws/heal`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
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
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#090A0F] relative text-zinc-100 select-none">
      {/* Background Micro Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none z-0" />

      {/* Top Bolt Navigation & Control Bar */}
      <Header
        status={status}
        repoName={repoName}
        demos={demos}
        onRepoChange={handleRepoChange}
        targetFile={targetFile}
        onTargetFileChange={setTargetFile}
        testCmd={testCmd}
        onTestCmdChange={setTestCmd}
        maxIterations={maxIterations}
        onMaxIterationsChange={setMaxIterations}
        iteration={iteration}
        onReset={resetState}
        onStartSurgery={startSurgery}
        onOpenAudit={() => setIsAuditOpen(true)}
      />

      {/* Split Workbench Main Canvas (100% height minus header) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full relative z-10">
        {/* Left Panel (40% width): Bolt AI Agent Assistant Feed */}
        <ReasoningFeed
          logs={logs}
          status={status}
          iteration={iteration}
          maxIterations={maxIterations}
          selectedDemoObj={selectedDemoObj}
          testMetrics={testMetrics}
          onStartSurgery={startSurgery}
          onSelectScenario={handleRepoChange}
        />

        {/* Right Panel (60% width): Bolt IDE Workstation */}
        <Workstation
          logs={logs}
          diff={diff}
          status={status}
          isHealed={isHealed}
          stats={stats}
          telemetry={telemetry}
          testMetrics={testMetrics}
          repoName={repoName}
          targetFile={targetFile}
          iteration={iteration}
          onOpenPR={() => setIsPROpen(true)}
          onOpenAudit={() => setIsAuditOpen(true)}
        />
      </div>

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
