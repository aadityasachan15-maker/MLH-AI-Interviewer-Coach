import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  ChevronRight, 
  Trophy, 
  Target,
  Flame,
  Award,
  RefreshCw
} from 'lucide-react';
import { PRESET_MICRO_DRILLS } from '../data/interviewCoachData';
import { MicroDrillItem } from '../types';

export const MicroDrillsStudio: React.FC = () => {
  const [selectedDrill, setSelectedDrill] = useState<MicroDrillItem>(PRESET_MICRO_DRILLS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(PRESET_MICRO_DRILLS[0].timeSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [candidateAttempt, setCandidateAttempt] = useState('');
  const [isScoring, setIsScoring] = useState(false);
  const [drillFeedback, setDrillFeedback] = useState<any | null>(null);

  useEffect(() => {
    setTimeLeft(selectedDrill.timeSeconds);
    setIsTimerRunning(false);
    setCandidateAttempt('');
    setDrillFeedback(null);
  }, [selectedDrill]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(selectedDrill.timeSeconds);
  };

  const handleScoreAttempt = async () => {
    if (!candidateAttempt.trim()) return;
    setIsScoring(true);

    try {
      const res = await fetch('/api/interview/adaptive-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `MICRO-DRILL PROMPT: ${selectedDrill.prompt}. TARGET: ${selectedDrill.whatToFocusOn.join(', ')}`,
          candidateAnswer: candidateAttempt,
          role: 'Candidate doing 60s drill',
          style: 'Direct, Crisp, Rubric-focused'
        })
      });
      const data = await res.json();
      setDrillFeedback(data);
    } catch (err) {
      console.error('Failed to score drill:', err);
    } finally {
      setIsScoring(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              Athletic Practice Loop
            </span>
            <span className="text-xs font-mono text-slate-500">Rapid 60-Second Micro-Drills</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Instant 2-Minute Micro-Drills Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Stop waiting through 45-minute interviews just to fix one communication flaw. Practice rapid repetition of high-stakes interview pivots under strict countdown pressure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drill Selector */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Choose Drill Routine
          </span>

          <div className="space-y-2.5">
            {PRESET_MICRO_DRILLS.map((drill) => {
              const isSelected = drill.id === selectedDrill.id;
              return (
                <div
                  key={drill.id}
                  onClick={() => setSelectedDrill(drill)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 hover:bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                      {drill.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {drill.timeSeconds}s
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold mt-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {drill.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {drill.prompt}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Drill Stage */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Drill Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-amber-400 font-bold">
                  {selectedDrill.category} • {selectedDrill.timeSeconds}s Challenge
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedDrill.title}
                </h3>
              </div>

              {/* Countdown Timer Display */}
              <div className="flex items-center space-x-2">
                <div
                  className={`px-3 py-1.5 rounded-xl font-mono text-base font-extrabold flex items-center space-x-2 border ${
                    timeLeft <= 10 && timeLeft > 0
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                      : timeLeft === 0
                      ? 'bg-rose-500/30 text-rose-300 border-rose-500/50'
                      : 'bg-slate-950 text-amber-400 border-slate-800'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft}s</span>
                </div>

                {!isTimerRunning ? (
                  <button
                    onClick={handleStartTimer}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    Start Timer
                  </button>
                ) : (
                  <button
                    onClick={() => setIsTimerRunning(false)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors"
                  >
                    Pause
                  </button>
                )}

                <button
                  onClick={handleResetTimer}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drill Prompt */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              <strong className="text-amber-400 block mb-1">Scenario to Deliver:</strong>
              {selectedDrill.prompt}
            </div>

            {/* Checklist of what to focus on */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Key Deliverables in this Drill:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {selectedDrill.whatToFocusOn.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-2 rounded border border-slate-800 text-slate-300 flex items-start space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Rapid Delivery Input */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Deliver Your 45-60 Second Response:
              </label>
              <textarea
                value={candidateAttempt}
                onChange={(e) => {
                  setCandidateAttempt(e.target.value);
                  if (!isTimerRunning && e.target.value.length > 0) {
                    setIsTimerRunning(true);
                  }
                }}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans leading-relaxed"
                placeholder="Deliver concise, metric-dense sentences. Start timer and go!"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                {candidateAttempt.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                onClick={handleScoreAttempt}
                disabled={isScoring || !candidateAttempt.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-600/20 disabled:opacity-40"
              >
                {isScoring ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isScoring ? 'Grading Drill...' : 'Score My Attempt with Gemma 4'}</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Comparison: Attempt vs Top 1% Benchmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feedback / Critique Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Your Attempt Grade</span>
                </span>
                {drillFeedback && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300">
                    {drillFeedback.answerStrength}
                  </span>
                )}
              </div>

              {drillFeedback ? (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 font-mono">
                    "{drillFeedback.feedbackSnippet}"
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Follow-up test:</strong> {drillFeedback.followUpQuestion}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-6 text-center">
                  Submit your attempt above to see how Gemma 4 grades your agency, metrics, and conciseness.
                </p>
              )}
            </div>

            {/* FAANG Staff Benchmark Answer Card */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                  <span>Top 1% Staff Model Answer</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">FAANG Calibrated</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-100 text-xs leading-relaxed font-sans">
                {selectedDrill.benchmarkModelAnswer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
