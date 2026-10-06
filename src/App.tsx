/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveAppTab } from './components/Navbar';
import { LiveInterviewStudio } from './components/LiveInterviewStudio';
import { SystemDesignWhiteboard } from './components/SystemDesignWhiteboard';
import { MicroDrillsStudio } from './components/MicroDrillsStudio';
import { ScorecardTab } from './components/ScorecardTab';
import { FastApiGemmaBackendTab } from './components/FastApiGemmaBackendTab';
import { MarketGapTab } from './components/MarketGapTab';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { CandidateScorecard } from './types';
import { BrainCircuit, Cpu, Sparkles, Github, Download } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveAppTab>('interview');
  const [activeScorecard, setActiveScorecard] = useState<CandidateScorecard | null>(null);
  const [serverStatus, setServerStatus] = useState<string>('checking');
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (res.ok) setServerStatus('online');
        else setServerStatus('offline');
      })
      .catch(() => setServerStatus('offline'));
  }, []);

  const handleOpenScorecard = (card: CandidateScorecard) => {
    setActiveScorecard(card);
    setActiveTab('scorecard');
  };

  const handleGoToDrill = () => {
    setActiveTab('drills');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverOnline={serverStatus === 'online'}
        onOpenGitHubSync={() => setIsGitHubModalOpen(true)}
      />

      {/* Quick 1-Click Codebase ZIP Download Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border-b border-emerald-500/20 px-4 py-2.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-100">
              Fullstack Project Source Package Ready:
            </span>
            <span className="text-slate-400 hidden sm:inline">
              React + Tailwind + Python FastAPI + Google Gemma 4 Engine (All 32 files)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="/api/project/download-zip"
              download="interview-coach-fullstack.zip"
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download interview-coach-fullstack.zip</span>
            </a>
          </div>
        </div>
      </div>

      {/* GitHub Sync Modal */}
      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'interview' && (
          <LiveInterviewStudio onOpenScorecard={handleOpenScorecard} />
        )}

        {activeTab === 'whiteboard' && <SystemDesignWhiteboard />}

        {activeTab === 'drills' && <MicroDrillsStudio />}

        {activeTab === 'scorecard' && (
          <ScorecardTab scorecard={activeScorecard} onGoToDrill={handleGoToDrill} />
        )}

        {activeTab === 'backend' && <FastApiGemmaBackendTab />}

        {activeTab === 'market' && <MarketGapTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>GemmaCoach AI — Fullstack Python FastAPI & Google Gemma 4 Engine</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <button onClick={() => setActiveTab('interview')} className="hover:text-slate-300 transition-colors">
              Live Mock
            </button>
            <button onClick={() => setActiveTab('whiteboard')} className="hover:text-slate-300 transition-colors">
              Whiteboard
            </button>
            <button onClick={() => setActiveTab('drills')} className="hover:text-slate-300 transition-colors">
              Micro-Drills
            </button>
            <button onClick={() => setActiveTab('backend')} className="hover:text-slate-300 transition-colors">
              Python FastAPI Backend
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
