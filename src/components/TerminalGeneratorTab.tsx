import React, { useState } from 'react';
import { Terminal, Copy, Check, Code, Play, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CLIENT_SNIPPETS } from '../data/codeSnippets';
import { CodeViewer } from './CodeViewer';

export const TerminalGeneratorTab: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'curl' | 'requests' | 'httpx' | 'fetch'>('curl');
  const [copiedTerminal, setCopiedTerminal] = useState(false);

  const curlCombined = `# 1. Test health check (Fixes 404!)
${CLIENT_SNIPPETS.curl.get_root}

# 2. Test standard AI Chat
${CLIENT_SNIPPETS.curl.chat}

# 3. Test Deep Reasoning & Thinking
${CLIENT_SNIPPETS.curl.think}`;

  const handleCopyTerminal = async () => {
    await navigator.clipboard.writeText('uvicorn main:app --reload --port 8000');
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              Terminal & Client Integration
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            How to Test and Call Your FastAPI Endpoints
          </h2>
          <p className="text-sm text-slate-400">
            Because <code className="text-indigo-400">/chat</code> and <code className="text-indigo-400">/think</code> are <strong className="text-slate-200">POST</strong> routes requiring JSON payloads, typing them in a browser address bar will not work (browsers send GET). Use the commands below to test your local server.
          </p>
        </div>

        <button
          onClick={handleCopyTerminal}
          className="shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs transition-colors"
        >
          {copiedTerminal ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          <span>Copy Launch Command</span>
        </button>
      </div>

      {/* Terminal Comparison: Original 404 vs Fixed 200 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Terminal Log Comparison (Uvicorn)</span>
          </h3>
          <span className="text-xs text-slate-500">Live simulation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Before: 404 Error */}
          <div className="rounded-xl bg-slate-950 border border-rose-900/60 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-rose-400 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Original Code Output</span>
              </span>
              <span className="text-slate-600 text-[11px]">Browser hit http://localhost:8000/</span>
            </div>
            <div className="space-y-1 text-slate-400">
              <p className="text-slate-500">$ uvicorn main:app --port 8000</p>
              <p className="text-emerald-400/80">INFO: Started server process [28412]</p>
              <p className="text-emerald-400/80">INFO: Waiting for application startup.</p>
              <p className="text-emerald-400/80">INFO: Application startup complete.</p>
              <p className="text-emerald-400/80">INFO: Uvicorn running on http://0.0.0.0:8000</p>
              <p className="text-rose-400 bg-rose-950/40 p-1.5 rounded border border-rose-900/80 font-bold">
                INFO: 127.0.0.1:59530 - "GET / HTTP/1.1" 404 Not Found
              </p>
              <p className="text-slate-500 italic text-[11px] pt-1">
                // Reason: No route configured for GET /
              </p>
            </div>
          </div>

          {/* After: 200 OK */}
          <div className="rounded-xl bg-slate-950 border border-emerald-900/60 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Corrected Code Output</span>
              </span>
              <span className="text-slate-600 text-[11px]">With @app.get("/") added</span>
            </div>
            <div className="space-y-1 text-slate-400">
              <p className="text-slate-500">$ uvicorn main:app --reload --port 8000</p>
              <p className="text-emerald-400/80">INFO: Started server process [31048]</p>
              <p className="text-emerald-400/80">INFO: Waiting for application startup.</p>
              <p className="text-emerald-400/80">INFO: Application startup complete.</p>
              <p className="text-emerald-400/80">INFO: Uvicorn running on http://0.0.0.0:8000</p>
              <p className="text-emerald-400 bg-emerald-950/40 p-1 rounded border border-emerald-900/80 font-bold">
                INFO: 127.0.0.1:59530 - "GET / HTTP/1.1" 200 OK
              </p>
              <p className="text-emerald-400 bg-emerald-950/40 p-1 rounded border border-emerald-900/80 font-bold">
                INFO: 127.0.0.1:59534 - "POST /chat HTTP/1.1" 200 OK
              </p>
              <p className="text-emerald-400 bg-emerald-950/40 p-1 rounded border border-emerald-900/80 font-bold">
                INFO: 127.0.0.1:59539 - "POST /think HTTP/1.1" 200 OK
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippets for Various Clients */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span>Ready-to-Use Client Scripts</span>
          </h3>

          {/* Language Switcher */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveLang('curl')}
              className={`px-3 py-1 rounded transition-colors ${
                activeLang === 'curl'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              cURL (Terminal)
            </button>
            <button
              onClick={() => setActiveLang('requests')}
              className={`px-3 py-1 rounded transition-colors ${
                activeLang === 'requests'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python (requests)
            </button>
            <button
              onClick={() => setActiveLang('httpx')}
              className={`px-3 py-1 rounded transition-colors ${
                activeLang === 'httpx'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python (httpx async)
            </button>
            <button
              onClick={() => setActiveLang('fetch')}
              className={`px-3 py-1 rounded transition-colors ${
                activeLang === 'fetch'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JavaScript (fetch)
            </button>
          </div>
        </div>

        {activeLang === 'curl' && (
          <CodeViewer
            code={curlCombined}
            language="bash"
            filename="test_api.sh"
            title="cURL Test Commands"
          />
        )}

        {activeLang === 'requests' && (
          <CodeViewer
            code={CLIENT_SNIPPETS.python_requests}
            language="python"
            filename="client_requests.py"
            title="Python requests Client Script"
          />
        )}

        {activeLang === 'httpx' && (
          <CodeViewer
            code={CLIENT_SNIPPETS.python_httpx}
            language="python"
            filename="client_httpx.py"
            title="Python Async httpx Client Script"
          />
        )}

        {activeLang === 'fetch' && (
          <CodeViewer
            code={CLIENT_SNIPPETS.javascript_fetch}
            language="javascript"
            filename="client_fetch.js"
            title="JavaScript / Node Fetch Script"
          />
        )}
      </div>
    </div>
  );
};
