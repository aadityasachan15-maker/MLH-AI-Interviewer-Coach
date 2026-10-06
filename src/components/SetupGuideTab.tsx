import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Terminal, 
  FileText, 
  ExternalLink, 
  Key, 
  Copy, 
  Check, 
  AlertTriangle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { REQUIREMENTS_TXT, DOTENV_TEMPLATE } from '../data/codeSnippets';
import { CodeViewer } from './CodeViewer';

export const SetupGuideTab: React.FC = () => {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedReqs, setCopiedReqs] = useState(false);

  const handleCopyEnv = async () => {
    await navigator.clipboard.writeText(DOTENV_TEMPLATE);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleCopyReqs = async () => {
    await navigator.clipboard.writeText(REQUIREMENTS_TXT);
    setCopiedReqs(true);
    setTimeout(() => setCopiedReqs(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Local Environment Setup Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Step-by-Step: Run FastAPI & Google GenAI Locally
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Follow this 4-step checklist to run your fixed FastAPI service locally on your terminal without any errors or 404 responses.
        </p>
      </div>

      {/* Step by step cards */}
      <div className="space-y-6">
        {/* Step 1: Virtual Environment */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
              1
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Create & Activate a Python Virtual Environment</h3>
              <p className="text-xs text-slate-400">Keeps dependencies isolated from global system packages</p>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 space-y-1">
              <p className="text-slate-500"># macOS / Linux:</p>
              <p className="text-emerald-400">python3 -m venv venv</p>
              <p className="text-emerald-400">source venv/bin/activate</p>
              <p className="text-slate-500 pt-2"># Windows (Command Prompt or PowerShell):</p>
              <p className="text-emerald-400">python -m venv venv</p>
              <p className="text-emerald-400">venv\Scripts\activate</p>
            </div>
          </div>
        </div>

        {/* Step 2: Install Packages */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
              2
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Install Required Python Packages</h3>
              <p className="text-xs text-slate-400">FastAPI, Uvicorn, Google GenAI SDK, and Dotenv</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
              <p className="text-slate-500"># Direct installation via pip:</p>
              <p className="text-emerald-400 font-bold">
                pip install fastapi "uvicorn[standard]" google-genai python-dotenv pydantic
              </p>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Or use requirements.txt
                </span>
                <button
                  onClick={handleCopyReqs}
                  className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-mono"
                >
                  {copiedReqs ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReqs ? 'Copied' : 'Copy requirements.txt'}</span>
                </button>
              </div>
              <CodeViewer
                code={REQUIREMENTS_TXT}
                language="text"
                filename="requirements.txt"
                title="requirements.txt"
              />
            </div>
          </div>
        </div>

        {/* Step 3: .env file */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
              3
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Create .env Configuration File</h3>
              <p className="text-xs text-slate-400">Safely store your Gemini API key instead of hardcoding it</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-900/40">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Never commit API keys into Git repositories!</span>
              </div>

              <button
                onClick={handleCopyEnv}
                className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-mono"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'Copied' : 'Copy .env Template'}</span>
              </button>
            </div>

            <CodeViewer
              code={DOTENV_TEMPLATE}
              language="ini"
              filename=".env"
              title=".env file"
            />
          </div>
        </div>

        {/* Step 4: Run & Open Docs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
              4
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Start Server & Test via Swagger UI</h3>
              <p className="text-xs text-slate-400">Launch with live auto-reloading</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div>
                <p className="text-slate-500"># Start Uvicorn with auto-reload:</p>
                <p className="text-emerald-400 font-bold">uvicorn main:app --reload --port 8000</p>
              </div>
              <div>
                <p className="text-slate-500"># Or run via Python directly (now that __main__ is fixed):</p>
                <p className="text-emerald-400 font-bold">python main.py</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>How to test in your web browser:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>
                  Visit <strong className="text-white font-mono">http://127.0.0.1:8000/</strong> → Confirms <code className="text-emerald-400">200 OK</code> status with endpoint list.
                </li>
                <li>
                  Visit <strong className="text-white font-mono">http://127.0.0.1:8000/docs</strong> → Opens interactive Swagger documentation where you can click <em>"Try it out"</em> on <code className="text-indigo-300">/chat</code> and <code className="text-indigo-300">/think</code> to send JSON bodies and test without terminal tools!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
