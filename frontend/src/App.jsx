import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ContainmentCard from './components/ContainmentCard';
import TerminalLogs from './components/TerminalLogs';
import DiffViewer from './components/DiffViewer';
import { Play, RotateCcw, FolderGit2, FileText, Terminal as TerminalIcon } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState('idle'); // idle, running, healed, error
  const [logs, setLogs] = useState([]);
  const [diff, setDiff] = useState('');
  const [isHealed, setIsHealed] = useState(false);
  const [telemetry, setTelemetry] = useState(null);

  const [repoName, setRepoName] = useState('broken-calculator');
  const [targetFile, setTargetFile] = useState('calculator.py');
  const [testCmd, setTestCmd] = useState('pytest -v');

  const startSurgery = () => {
    setStatus('running');
    setLogs([]);
    setDiff('');
    setIsHealed(false);

    // Establish WebSocket connection to backend
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8001/ws/heal`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        repo_name: repoName,
        target_file: targetFile,
        test_command: testCmd
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => [...prev, data]);

        if (data.payload?.isolation_mode) {
          setTelemetry(data.payload);
        }

        if (data.payload?.diff) {
          setDiff(data.payload.diff);
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
    try {
      await fetch(`http://${window.location.hostname}:8001/api/demos/${repoName}/reset`, {
        method: 'POST',
      });
    } catch (e) {
      console.warn('Could not reset demo repo on backend:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col">
      <Header status={status} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Control Bar */}
        <div className="rounded-xl border border-slate-800 bg-[#0d1326] p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap w-full md:w-auto">
            {/* Repo Select */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs">
              <FolderGit2 className="h-4 w-4 text-cyan-400" />
              <span className="text-slate-400">Target Repo:</span>
              <select
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                disabled={status === 'running'}
                className="bg-transparent font-medium text-slate-200 outline-none cursor-pointer"
              >
                <option value="broken-calculator" className="bg-slate-900">broken-calculator (Python/Pytest)</option>
              </select>
            </div>

            {/* Target File */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-slate-400">Target File:</span>
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
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={resetState}
              disabled={status === 'running'}
              className="px-3.5 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            <button
              onClick={startSurgery}
              disabled={status === 'running'}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              {status === 'running' ? 'Operating in Sandbox...' : 'Start Surgery (Auto-Heal)'}
            </button>
          </div>
        </div>

        {/* Workspace Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Containment + Diff) */}
          <div className="lg:col-span-5 space-y-6">
            <ContainmentCard telemetry={telemetry} />
            <DiffViewer diff={diff} isHealed={isHealed} />
          </div>

          {/* Right Column (Terminal & Reasoning Stream) */}
          <div className="lg:col-span-7">
            <TerminalLogs logs={logs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Built for the <span className="text-cyan-400 font-medium">Vultr: Agent Rush Hackathon</span> • Powered by <span className="text-blue-400 font-medium">Vultr Serverless Inference</span> & Docker Micro-Sandboxes
      </footer>
    </div>
  );
}
