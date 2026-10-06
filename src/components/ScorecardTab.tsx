import React from 'react';
import { 
  BarChart3, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Trophy, 
  Target, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { CandidateScorecard } from '../types';

interface ScorecardTabProps {
  scorecard: CandidateScorecard | null;
  onGoToDrill: () => void;
}

export const ScorecardTab: React.FC<ScorecardTabProps> = ({ scorecard, onGoToDrill }) => {
  // Default mock scorecard if none generated yet
  const data: CandidateScorecard = scorecard || {
    overallScore: 84,
    verdict: 'Hire',
    starBreakdown: {
      situation: 'Clearly defined context: Payment service scaling to 45k RPS under high write contention.',
      task: 'Identified the core engineering problem: Database row lock deadlocks during flash sales.',
      action: 'Demonstrated strong personal agency: Personally architected distributed Token-Bucket in Go with Redis caching.',
      result: 'Good quantified impact: Reduced database write locks by 65% with zero dropped transactions.'
    },
    technicalDepth: {
      score: 8,
      notes: 'Strong understanding of in-memory caching and Redis TTL strategies. Could improve on explaining multi-region cache replication.'
    },
    communicationClarity: {
      score: 8,
      notes: 'Concise delivery, avoided excessive filler words. Structured thoughts with clear architectural headers.'
    },
    redFlagsDetected: [],
    modelAnswerFramework: '1. Establish traffic constraints (45k RPS). 2. Detail in-memory token replenishment with Lua scripts for atomic execution. 3. Detail failover fallback to local rate limiting if Redis cluster partitioned.',
    microDrillRecommendation: 'Practice the 60-second Distributed Cache Invalidation drill to sharpen multi-region consistency.'
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Strong Hire':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Hire':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/40';
      case 'Leaning Hire':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'Leaning No Hire':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                FAANG & Enterprise Calibration
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {data.round || 'Technical Round'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {data.round === 'HR / Managerial Round' ? 'HR & Behavioral Evaluation Scorecard' : 'Technical & Architecture Diagnostic Scorecard'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dual-track evaluation combining <strong className="text-white">Behavioral Ownership (STAR)</strong> with <strong className="text-white">Technical Architecture Rigor</strong>.
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center space-x-4 shrink-0 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                {data.overallScore}
                <span className="text-slate-600 text-lg">/100</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Bar-Raiser Score
              </span>
            </div>

            <div className="border-l border-slate-800 pl-4 space-y-1">
              <span className="text-[11px] text-slate-500 font-mono block">Final Committee Verdict</span>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getVerdictColor(data.verdict)}`}>
                {data.verdict}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Technical Depth:</span>
            <span className="text-emerald-400 font-bold">{data.technicalDepth.score}/10</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.technicalDepth.score * 10}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">{data.technicalDepth.notes}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Communication & Structure:</span>
            <span className="text-indigo-400 font-bold">{data.communicationClarity.score}/10</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${data.communicationClarity.score * 10}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">{data.communicationClarity.notes}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Agency ("I" vs "We"):</span>
            <span className="text-teal-400 font-bold">Strong</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full w-[85%]"></div>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">Demonstrated personal technical leadership without hiding behind the team.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Red Flags:</span>
            <span className="text-emerald-400 font-bold">
              {data.redFlagsDetected.length === 0 ? 'None' : `${data.redFlagsDetected.length} Found`}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-full"></div>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {data.redFlagsDetected.length === 0
              ? 'Zero behavioral or technical red flags detected.'
              : data.redFlagsDetected.join(', ')}
          </p>
        </div>
      </div>

      {/* STAR Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <span>STAR Method Breakdown Analysis</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-blue-400 uppercase text-[11px]">S - Situation</span>
            <p className="text-slate-300 leading-relaxed">{data.starBreakdown.situation}</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-400 uppercase text-[11px]">T - Task & Ownership</span>
            <p className="text-slate-300 leading-relaxed">{data.starBreakdown.task}</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-teal-400 uppercase text-[11px]">A - Action (Personal Agency)</span>
            <p className="text-slate-300 leading-relaxed">{data.starBreakdown.action}</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 uppercase text-[11px]">R - Result & Quantified Impact</span>
            <p className="text-slate-300 leading-relaxed">{data.starBreakdown.result}</p>
          </div>
        </div>
      </div>

      {/* Model Answer & Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Answer Framework */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Top 1% Staff Engineer Model Answer Framework</span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
            {data.modelAnswerFramework}
          </div>
        </div>

        {/* Micro-Drill Recommendation */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Recommended Micro-Drill Workout</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans">
              {data.microDrillRecommendation}
            </p>
          </div>

          <button
            onClick={onGoToDrill}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-600/20"
          >
            <Zap className="w-4 h-4" />
            <span>Start This 2-Minute Drill Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
