import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Layers, 
  Trophy, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { EXISTING_SYSTEMS, MISSING_FEATURE_GAPS } from '../data/interviewCoachData';

export const MarketGapTab: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Competitive Moat & Market Strategy</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How GemmaCoach AI Outperforms Existing Software Systems
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Existing interview tools are either dumb speech-to-text dictation machines (Google Warmup), expensive human markets (Interviewing.io), or risky live teleprompter cheats (Final Round AI). Here is the comprehensive gap matrix.
        </p>
      </div>

      {/* The 5 Missing Feature Gaps */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs">
            The 5 Critical Capabilities Missing in Current Market
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MISSING_FEATURE_GAPS.map((gap, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                    {gap.impactLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-500">Gap #{idx + 1}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-100">{gap.title}</h4>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30 text-rose-300/90">
                    <strong className="block text-[11px] text-rose-400 font-mono">Why Existing Tools Fail:</strong>
                    {gap.whyExistingFail}
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    <strong className="block text-[11px] text-slate-400 font-mono">What Users Actually Need:</strong>
                    {gap.whatUsersActuallyNeed}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-200/90 text-xs">
                <strong className="block text-[11px] text-emerald-400 font-mono">Your Competitive Moat:</strong>
                {gap.yourCompetitiveMoat}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Competitors Comparison Table */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Existing Software Systems & Flaws Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXISTING_SYSTEMS.map((sys, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{sys.name}</h4>
                    <span className="text-[11px] text-slate-500">{sys.category}</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                    {sys.pricing}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    What they built:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
                    {sys.whatTheyBuilt.map((item, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-slate-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Critical Flaws:</span>
                </span>
                <ul className="text-xs text-rose-200/80 space-y-1 font-mono text-[11px]">
                  {sys.criticalFlaws.slice(0, 2).map((flaw, i) => (
                    <li key={i}>⚠️ {flaw}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
