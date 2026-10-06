import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown,
  Terminal, 
  FileCode, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BUGS_LIST, ORIGINAL_CODE, FIXED_CODE, REQUIREMENTS_TXT, DOTENV_TEMPLATE } from '../data/codeSnippets';
import { CodeViewer } from './CodeViewer';

interface BugAnalysisTabProps {
  onGoToTester: () => void;
}

export const BugAnalysisTab: React.FC<BugAnalysisTabProps> = ({ onGoToTester }) => {
  const [selectedBugId, setSelectedBugId] = useState<string>(BUGS_LIST[0].id);
  const [activeCodeView, setActiveCodeView] = useState<'fixed' | 'original' | 'diff'>('fixed');
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedReqs, setCopiedReqs] = useState(false);

  const selectedBug = BUGS_LIST.find((b) => b.id === selectedBugId) || BUGS_LIST[0];

  const handleCopyScript = async () => {
    await navigator.clipboard.writeText(FIXED_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

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
    <div className="space-y-8 pb-12">
      {/* Hero Banner: Explaining the Terminal 404 Error */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Root Cause Identified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why you saw: <code className="text-rose-400 font-mono text-xl sm:text-2xl bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">127.0.0.1:59530 - "GET / HTTP/1.1" 404 Not Found</code>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              When you launch Uvicorn and open <span className="font-mono text-emerald-400">http://127.0.0.1:8000/</span> in your web browser, 
              the browser automatically issues an <strong className="text-white">HTTP GET request to the root path (<code className="text-emerald-400">/</code>)</strong>. 
              Because your FastAPI code only defined <code className="text-indigo-300">POST /chat</code> and <code className="text-indigo-300">POST /think</code>, 
              FastAPI found no matching route and correctly responded with <strong className="text-rose-400">404 Not Found</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleCopyScript}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20"
              >
                {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'Copied fixed main.py!' : 'Copy Full Fixed main.py'}</span>
              </button>

              <button
                onClick={onGoToTester}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Test Live Endpoints Now</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>

          {/* Quick Stats Badge Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shrink-0 w-full lg:w-72 space-y-3 font-mono text-xs">
            <div className="text-slate-400 font-sans font-semibold border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Code Audit Summary</span>
              <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[11px]">5 Issues Found</span>
            </div>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Route 404:</span>
                <span className="text-rose-400 font-bold">Missing GET /</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SyntaxError:</span>
                <span className="text-rose-400 font-bold">Unclosed Docstring</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Entrypoint:</span>
                <span className="text-rose-400 font-bold">Typo "__m1__"</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security:</span>
                <span className="text-amber-400 font-bold">Hardcoded Key</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Browser test:</span>
                <span className="text-indigo-400 font-bold">GET vs POST payload</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bug Catalog & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bug Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Issues Diagnosed ({BUGS_LIST.length})
            </h2>
            <span className="text-xs text-slate-500">Click to inspect fix</span>
          </div>

          <div className="space-y-2.5">
            {BUGS_LIST.map((bug, index) => {
              const isSelected = bug.id === selectedBugId;
              return (
                <div
                  key={bug.id}
                  onClick={() => setSelectedBugId(bug.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 hover:bg-slate-900/50 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {bug.severity === 'critical' ? (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        ) : bug.severity === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            #{index + 1}
                          </span>
                          <h3 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {bug.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {bug.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'rotate-90 text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono border-t border-slate-800/60 pt-2 text-slate-500">
                    <span>{bug.errorType}</span>
                    <span className="text-emerald-400 font-medium">Click for details</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Helper Cards */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Project Files to Create</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleCopyEnv}
                className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
              >
                <span className="font-mono">.env</span>
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </button>
              <button
                onClick={handleCopyReqs}
                className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
              >
                <span className="font-mono">requirements.txt</span>
                {copiedReqs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Explanation of Selected Bug */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                    {selectedBug.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Orig: {selectedBug.lineNumbersOriginal} → Fixed: {selectedBug.lineNumbersFixed}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedBug.title}</h3>
              </div>
            </div>

            {/* Why it Failed */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Why it failed & what error it causes</span>
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-rose-950/20 p-3.5 rounded-lg border border-rose-900/30">
                {selectedBug.whyItFailed}
              </p>
            </div>

            {/* How it is Fixed */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>How the fixed version resolves this</span>
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-900/30">
                {selectedBug.howItIsFixed}
              </p>
            </div>

            {/* Before vs After Snippet */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Before & After Code Comparison
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                {/* Original Snippet */}
                <div className="rounded-lg bg-slate-950 border border-rose-500/30 p-3 space-y-2">
                  <div className="flex items-center justify-between text-rose-400 border-b border-slate-800 pb-1.5 text-[11px] font-bold">
                    <span>❌ Original Code</span>
                    <span className="text-slate-500">{selectedBug.lineNumbersOriginal}</span>
                  </div>
                  <pre className="text-rose-200/90 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                    {selectedBug.originalSnippet}
                  </pre>
                </div>

                {/* Fixed Snippet */}
                <div className="rounded-lg bg-slate-950 border border-emerald-500/30 p-3 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 border-b border-slate-800 pb-1.5 text-[11px] font-bold">
                    <span>✅ Corrected Code</span>
                    <span className="text-slate-500">{selectedBug.lineNumbersFixed}</span>
                  </div>
                  <pre className="text-emerald-200/90 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
                    {selectedBug.fixedSnippet}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Full Code Explorer with Toggle Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200">Full Source Code Inspector</h3>
              </div>

              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveCodeView('fixed')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    activeCodeView === 'fixed'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Fixed (main.py)
                </button>
                <button
                  onClick={() => setActiveCodeView('original')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    activeCodeView === 'original'
                      ? 'bg-rose-500/20 text-rose-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Original (Buggy)
                </button>
              </div>
            </div>

            {activeCodeView === 'fixed' ? (
              <CodeViewer
                code={FIXED_CODE}
                filename="main.py"
                title="Fixed main.py (FastAPI + Google GenAI)"
              />
            ) : (
              <CodeViewer
                code={ORIGINAL_CODE}
                filename="main_original.py"
                title="Original main.py (Contains 5 bugs)"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
