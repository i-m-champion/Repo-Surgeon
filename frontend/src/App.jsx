import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ContainmentCard from './components/ContainmentCard';
import TerminalLogs from './components/TerminalLogs';
import DiffViewer from './components/DiffViewer';
import PullRequestModal from './components/PullRequestModal';
import SecurityAuditModal from './components/SecurityAuditModal';
import { Play, RotateCcw, FolderGit2, FileText, Terminal as TerminalIcon, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState('idle'); // idle, running, healed, error
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

  // Demos
  const [demos, setDemos] = useState([]);
  const [repoName, setRepoName] = useState('broken-calculator');
  const [targetFile, setTargetFile] = useState('calculator.py');
  const [testCmd, setTestCmd] = useState('pytest -v');

  useEffect(() => {
    // Fetch available demo repositories from backend
    fetch(`http://${window.location.hostname}:8001/api/demos`)
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

    // Establish WebSocket connection to backend
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8001/ws/heal`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        repo_name: repoName,
        target_file: targetFile,
        test_command: testCmd,
        max_iterations: maxIterations
      }));
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

        if (data.step === 'HEALED') {
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
          message: 'Unable to connect to RepoSurgeon backend (port 8001). Ensure the backend is running.'
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
      await fetch(`http://${window.location.hostname}:8001/api/demos/${repoName}/reset`, {
        method: 'POST',
      });
    } catch (e) {
      console.warn('Could not reset demo repo on backend:', e);
    }
  };

  const selectedDemoObj = demos.find((d) => d.id === repoName);

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Header status={status} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Repo Banner / Context Info */}
        {selectedDemoObj && (
          <div className="rounded-xl border border-slate-800/80 bg-gradient-to-r from-blue-950/20 via-slate-900/40 to-cyan-950/20 p-3.5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-cyan-400">Target Scenario:</span>
              <span className="text-slate-300">{selectedDemoObj.description}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(selectedDemoObj.tags || []).map((tag, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Control Bar */}
        <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
            {/* Repo Select */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs">
              <FolderGit2 className="h-4 w-4 text-cyan-400" />
              <span className="text-slate-400">Target Repo:</span>
              <select
                value={repoName}
                onChange={(e) => handleRepoChange(e.target.value)}
                disabled={status === 'running'}
                className="bg-transparent font-medium text-slate-200 outline-none cursor-pointer"
              >
                <option value="broken-calculator" className="bg-slate-900">broken-calculator (Arithmetic/Pytest)</option>
                <option value="auth-sanitizer" className="bg-slate-900">auth-sanitizer (Security & SQL Injection)</option>
              </select>
            </div>

            {/* Target File */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-slate-400">File:</span>
              <input
                type="text"
                value={targetFile}
                onChange={(e) => setTargetFile(e.target.value)}
                disabled={status === 'running'}
                className="bg-transparent font-medium text-slate-200 outline-none w-28"
              />
            </div>

            {/* Test Command */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs">
              <TerminalIcon className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-400">Command:</span>
              <input
                type="text"
                value={testCmd}
                onChange={(e) => setTestCmd(e.target.value)}
                disabled={status === 'running'}
                className="bg-transparent font-medium text-slate-200 outline-none w-24"
              />
            </div>

            {/* Max Iterations */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-slate-400">Max Iterations:</span>
              <select
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
                disabled={status === 'running'}
                className="bg-transparent font-medium text-slate-200 outline-none cursor-pointer"
              >
                <option value={1} className="bg-slate-900">1 (Single-Shot)</option>
                <option value={2} className="bg-slate-900">2 (Refinement)</option>
                <option value={3} className="bg-slate-900">3 (Autonomous Multi-Turn)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={resetState}
              disabled={status === 'running'}
              className="px-3.5 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Broken State
            </button>

            <button
              onClick={startSurgery}
              disabled={status === 'running'}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              {status === 'running' ? `Surgery in Sandbox (Attempt ${iteration}/${maxIterations})...` : 'Start Surgery (Auto-Heal)'}
            </button>
          </div>
        </div>

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Containment + Diff) */}
          <div className="lg:col-span-5 space-y-6">
            <ContainmentCard
              telemetry={telemetry}
              testMetrics={testMetrics}
              onOpenAudit={() => setIsAuditOpen(true)}
            />
            <DiffViewer
              diff={diff}
              isHealed={isHealed}
              stats={stats}
              repoName={repoName}
              onOpenPR={() => setIsPROpen(true)}
            />
          </div>

          {/* Right Column (Terminal & Reasoning Stream) */}
          <div className="lg:col-span-7">
            <TerminalLogs logs={logs} />
          </div>
        </div>
      </main>

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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Built for the <span className="text-cyan-400 font-medium">Vultr: Agent Rush Hackathon</span> (Blast Radius Zero Track) • Powered by <span className="text-blue-400 font-medium">Vultr Serverless Inference</span> & Docker Micro-Sandboxes
      </footer>
    </div>
  );
}
