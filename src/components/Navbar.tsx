import React from 'react';
import { 
  Zap, 
  BrainCircuit, 
  Layers, 
  Award, 
  FileCode, 
  TrendingUp, 
  Sparkles,
  BarChart3,
  Cpu,
  Github,
  Download
} from 'lucide-react';

export type ActiveAppTab = 
  | 'interview' 
  | 'whiteboard' 
  | 'drills' 
  | 'scorecard' 
  | 'backend' 
  | 'market';

interface NavbarProps {
  activeTab: ActiveAppTab;
  setActiveTab: (tab: ActiveAppTab) => void;
  serverOnline?: boolean;
  onOpenGitHubSync?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  serverOnline = true,
  onOpenGitHubSync,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('interview')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <BrainCircuit className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-100 text-lg tracking-tight">
                  GemmaCoach <span className="text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Gemma 4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
                Adaptive Bar-Raiser Probing Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'interview'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>Live Mock</span>
            </button>

            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'whiteboard'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">System Whiteboard</span>
              <span className="sm:hidden">Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab('drills')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'drills'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Micro-Drills</span>
            </button>

            <button
              onClick={() => setActiveTab('scorecard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scorecard'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Scorecard</span>
            </button>

            <button
              onClick={() => setActiveTab('backend')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'backend'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-4 h-4 text-purple-400" />
              <span className="hidden md:inline">FastAPI & Gemma 4 Files</span>
              <span className="md:hidden">Backend</span>
            </button>

            <button
              onClick={() => setActiveTab('market')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'market'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="hidden lg:inline">Market Gaps</span>
            </button>

            <a
              href="/api/project/download-zip"
              download="interview-coach-fullstack.zip"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
              title="Download all project files as ZIP"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download ZIP</span>
              <span className="sm:hidden">ZIP</span>
            </a>

            {onOpenGitHubSync && (
              <button
                onClick={onOpenGitHubSync}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 shadow-sm shrink-0"
                title="Sync and push code to your GitHub repository"
              >
                <Github className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Sync to GitHub</span>
                <span className="sm:hidden">GitHub</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
