import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  RefreshCw, 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Clock, 
  FileText, 
  Building2, 
  ChevronRight, 
  BarChart3, 
  HelpCircle,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Users,
  Compass
} from 'lucide-react';
import { 
  GeneratedQuestion, 
  AdaptiveTurnResponse, 
  InterviewTurn, 
  CandidateScorecard,
  InterviewRound 
} from '../types';
import { TARGET_COMPANIES, CAREER_ROLES } from '../data/interviewCoachData';

interface LiveInterviewStudioProps {
  onOpenScorecard: (scorecard: CandidateScorecard) => void;
}

export const LiveInterviewStudio: React.FC<LiveInterviewStudioProps> = ({ onOpenScorecard }) => {
  // Round state
  const [round, setRound] = useState<InterviewRound>('Technical Round');

  // Role and Company selections
  const [selectedRoleId, setSelectedRoleId] = useState<string>('sde');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('goldman-sachs');
  
  const currentRole = CAREER_ROLES.find((r) => r.id === selectedRoleId) || CAREER_ROLES[0];
  const currentCompany = TARGET_COMPANIES.find((c) => c.id === selectedCompanyId) || TARGET_COMPANIES[0];

  // Topics dynamically populated based on Role & Round
  const currentTopics = round === 'Technical Round' 
    ? currentRole.technicalTopics 
    : currentRole.hrTopics;

  const [topic, setTopic] = useState<string>(currentTopics[0]);
  const [resumeSnippet, setResumeSnippet] = useState<string>(currentRole.defaultResumeContext);

  // When role or round changes, update default topic and resume
  useEffect(() => {
    const topics = round === 'Technical Round' ? currentRole.technicalTopics : currentRole.hrTopics;
    setTopic(topics[0]);
    if (!resumeSnippet || resumeSnippet === CAREER_ROLES.find(r => r.id !== selectedRoleId)?.defaultResumeContext) {
      setResumeSnippet(currentRole.defaultResumeContext);
    }
  }, [selectedRoleId, round]);

  // Question & Session states
  const [questionData, setQuestionData] = useState<GeneratedQuestion>({
    question: 'At Goldman Sachs, how would you design an ultra-low-latency in-memory order matching engine in Java/C++ handling 100,000 orders/sec without garbage collection pauses?',
    contextOrScenario: 'Sub-millisecond P99 execution SLA. Financial ledger must remain strictly ACID compliant with zero lost trade orders.',
    interviewerGoal: 'Tests low-latency data structures (Ring Buffers / LMAX Disruptor), cache line alignment, memory off-heaping, and lock-free concurrency.',
    keyPitfalls: ['Relying on standard synchronized blocks causing lock contention', 'Ignoring JVM stop-the-world GC pauses under load'],
    sampleFollowUps: [
      'Why use a lock-free ring buffer instead of a traditional BlockingQueue?',
      'How do you guarantee audit recovery if the server undergoes a power outage?'
    ],
    round: 'Technical Round'
  });

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeFollowUp, setActiveFollowUp] = useState<AdaptiveTurnResponse | null>(null);

  // Speech to text states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setCandidateAnswer((prev) => prev + ' ' + currentTranscript);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setIsTimerRunning(true);
      } catch (err) {
        console.error('Failed to start microphone:', err);
      }
    }
  };

  const handleGenerateQuestion = async () => {
    setLoadingQuestion(true);
    setActiveFollowUp(null);
    setCandidateAnswer('');
    setTurns([]);
    setTimerSeconds(0);
    setIsTimerRunning(false);

    try {
      const res = await fetch('/api/interview/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: currentRole.title,
          seniority: currentRole.experienceLevel,
          company: currentCompany.name,
          topic: topic || currentTopics[0],
          resumeContext: resumeSnippet.trim(),
          round
        })
      });
      const data = await res.json();
      if (data.question) {
        setQuestionData({ ...data, round });
      }
    } catch (err) {
      console.error('Failed to generate question:', err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim()) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setIsTimerRunning(false);
    setIsSubmittingAnswer(true);

    const newCandidateTurn: InterviewTurn = {
      id: Math.random().toString(36).substring(7),
      role: 'candidate',
      text: candidateAnswer.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedTurns = [...turns, newCandidateTurn];
    setTurns(updatedTurns);

    try {
      const res = await fetch('/api/interview/adaptive-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeFollowUp?.followUpQuestion || questionData.question,
          candidateAnswer: candidateAnswer.trim(),
          role: currentRole.title,
          style: round === 'HR / Managerial Round' ? 'Behavioral STAR Calibration' : 'Bar-Raiser, Probing',
          history: updatedTurns.map((t) => ({ role: t.role, text: t.text }))
        })
      });

      const data: AdaptiveTurnResponse = await res.json();
      setActiveFollowUp(data);

      const newInterviewerTurn: InterviewTurn = {
        id: Math.random().toString(36).substring(7),
        role: 'interviewer',
        text: data.interviewerReaction + ' ' + data.followUpQuestion,
        timestamp: new Date().toLocaleTimeString(),
        probingFocus: data.probingFocus,
        answerStrength: data.answerStrength,
        feedbackSnippet: data.feedbackSnippet
      };

      setTurns([...updatedTurns, newInterviewerTurn]);
      setCandidateAnswer('');
      setTimerSeconds(0);
    } catch (err) {
      console.error('Failed adaptive turn:', err);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleRequestEvaluation = async () => {
    setIsEvaluating(true);
    const fullTranscript = turns.map((t) => `${t.role.toUpperCase()}: ${t.text}`).join('\n\n');

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionData.question,
          candidateAnswer: fullTranscript || candidateAnswer,
          role: currentRole.title,
          round
        })
      });
      const data: CandidateScorecard = await res.json();
      onOpenScorecard({ ...data, round });
    } catch (err) {
      console.error('Failed to evaluate scorecard:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Session Header / Grounding Configurator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        {/* Top bar with Round Switcher & Generate Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <BrainCircuit className="w-3.5 h-3.5 mr-1" />
                Adaptive Bar-Raiser Engine
              </span>
              <span className="text-xs font-mono text-slate-400">
                Gemma 4 & Gemini Multi-Role Intelligence
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Realistic Interview Simulator (Technical & HR Rounds)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Calibrated for top engineering & service firms with authentic round-specific questioning.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Round Switcher Pill */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setRound('Technical Round')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  round === 'Technical Round'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Technical Round</span>
              </button>

              <button
                onClick={() => setRound('HR / Managerial Round')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  round === 'HR / Managerial Round'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>HR / Managerial</span>
              </button>
            </div>

            <button
              onClick={handleGenerateQuestion}
              disabled={loadingQuestion}
              className="shrink-0 flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              {loadingQuestion ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{loadingQuestion ? 'Generating...' : 'Ask Realistic Question'}</span>
            </button>
          </div>
        </div>

        {/* Configuration Row: Career Role, Target Company, Topic, Resume Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Career Role */}
          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center space-x-1">
              <Briefcase className="w-3 h-3 text-emerald-400" />
              <span>Career Track</span>
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            >
              {CAREER_ROLES.map((roleOption) => (
                <option key={roleOption.id} value={roleOption.id}>
                  {roleOption.title}
                </option>
              ))}
            </select>
          </div>

          {/* Company Target */}
          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-indigo-400" />
              <span>Target Company</span>
            </label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-semibold"
            >
              {TARGET_COMPANIES.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Topics for Role & Round */}
          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center space-x-1">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>{round === 'Technical Round' ? 'Technical Focus' : 'HR Focus Topic'}</span>
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-[11px]"
            >
              {currentTopics.map((top, idx) => (
                <option key={idx} value={top}>
                  {top}
                </option>
              ))}
            </select>
          </div>

          {/* Resume Grounding Context */}
          <div className="space-y-1">
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Resume / Background Claim</span>
              <span className="text-emerald-400 font-normal">Active</span>
            </label>
            <input
              type="text"
              value={resumeSnippet}
              onChange={(e) => setResumeSnippet(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-[11px]"
              placeholder="e.g. Completed Bachelor in CS, managed Linux server fleet..."
            />
          </div>
        </div>

        {/* Company Cultural Insight Banner */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-start sm:items-center space-x-2 text-slate-300">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase shrink-0">
              {currentCompany.name} Culture Tip
            </span>
            <p className="text-slate-400 text-[11px] font-sans">
              {currentCompany.cultureTips}
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono shrink-0">
            Tier: {currentCompany.tier}
          </span>
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interviewer & Question Stage */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-slate-950 font-bold shadow-md ${
                  round === 'HR / Managerial Round' 
                    ? 'bg-gradient-to-tr from-purple-500 to-pink-400' 
                    : 'bg-gradient-to-tr from-emerald-500 to-teal-400'
                }`}>
                  {round === 'HR / Managerial Round' ? 'HR' : 'TR'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {currentCompany.name} {round === 'HR / Managerial Round' ? 'HR Manager' : 'Technical Lead'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Evaluating for {currentRole.title} ({round})
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  round === 'HR / Managerial Round'
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                }`}>
                  {round}
                </span>
              </div>
            </div>

            {/* The Question */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Interview Question:
              </span>
              <p className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
                {questionData.question}
              </p>
            </div>

            {/* Context & Scenario constraints */}
            {questionData.contextOrScenario && (
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-slate-400 text-[11px]">Context / Scenario:</span>
                <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                  {questionData.contextOrScenario}
                </p>
              </div>
            )}

            {/* Hidden Interviewer Goal & Pitfalls Dropdown */}
            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interviewer Secret Metric: <strong className="text-slate-300 font-normal">{questionData.interviewerGoal}</strong></span>
              </div>
            </div>
          </div>

          {/* Transcript History Feed */}
          {turns.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <span>Live Transcript ({turns.length} turns)</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">{round}</span>
              </div>

              <div className="space-y-4 max-h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-2">
                {turns.map((turn) => {
                  const isCandidate = turn.role === 'candidate';
                  return (
                    <div
                      key={turn.id}
                      className={`flex flex-col space-y-1.5 ${
                        isCandidate ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                        <span className="font-bold uppercase tracking-wider text-slate-400">
                          {isCandidate ? 'You (Candidate)' : `${currentCompany.name} Interviewer`}
                        </span>
                        <span>{turn.timestamp}</span>
                        {turn.answerStrength && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              turn.answerStrength === 'Staff-Level' || turn.answerStrength === 'Strong'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {turn.answerStrength}
                          </span>
                        )}
                      </div>

                      <div
                        className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed max-w-[92%] ${
                          isCandidate
                            ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-100 rounded-tr-none'
                            : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-mono text-[13px]'
                        }`}
                      >
                        {turn.text}
                      </div>

                      {turn.feedbackSnippet && (
                        <div className="text-[11px] text-indigo-300 bg-indigo-950/20 px-2.5 py-1 rounded border border-indigo-900/30 max-w-[90%]">
                          💡 <em>Critique: {turn.feedbackSnippet}</em>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Candidate Answer Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold uppercase tracking-wider text-slate-300">
                  Your Response
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {round === 'HR / Managerial Round' ? '(Deliver structured STAR response)' : '(Explain technical logic & trade-offs)'}
                </span>
              </div>

              {/* Dynamic Word Count & Quality Badge */}
              <div className="flex items-center space-x-2">
                {candidateAnswer.trim() && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    candidateAnswer.trim().split(/\s+/).filter(Boolean).length < 15
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : candidateAnswer.trim().split(/\s+/).filter(Boolean).length < 45
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {candidateAnswer.trim().split(/\s+/).filter(Boolean).length} words · {
                      candidateAnswer.trim().split(/\s+/).filter(Boolean).length < 15 ? 'Too brief' :
                      candidateAnswer.trim().split(/\s+/).filter(Boolean).length < 45 ? 'Basic' : 'Detailed'
                    }
                  </span>
                )}

                {/* Timer indicator */}
                <div className="flex items-center space-x-1.5 font-mono text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatTimer(timerSeconds)}</span>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Test Response Samples */}
            <div className="flex items-center space-x-2 py-1 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-slate-500 shrink-0">Try Sample Answers:</span>
              <button
                onClick={() => setCandidateAnswer("i don't know the exact answer to this question, skip please.")}
                className="px-2 py-0.5 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 transition-colors shrink-0"
                title="Test how AI handles evasive answers"
              >
                🧪 Test Evasive ("I don't know")
              </button>
              <button
                onClick={() => setCandidateAnswer("I will use a database to store it and run regular queries.")}
                className="px-2 py-0.5 rounded bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/50 transition-colors shrink-0"
                title="Test how AI handles brief answers"
              >
                🧪 Test Brief (1-liner)
              </button>
              <button
                onClick={() => {
                  if (round === 'HR / Managerial Round') {
                    setCandidateAnswer("In our client release, my lead wanted to bypass automated integration tests. I scheduled a 1-on-1, showed historical data that skipping tests led to 35% higher rollback rates, and proposed writing critical path tests together. We completed the release on time with zero production incidents.");
                  } else {
                    setCandidateAnswer("I would design this using an in-memory Redis cluster with read replicas and consistent hashing. For write operations, I deploy an asynchronous Kafka queue with transactional outbox pattern to prevent database connection saturation, guaranteeing sub-15ms P99 latency with 99.99% SLA.");
                  }
                }}
                className="px-2 py-0.5 rounded bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/50 transition-colors shrink-0"
                title="Test how AI handles thorough answers"
              >
                🧪 Test Detailed ({round === 'HR / Managerial Round' ? 'STAR' : 'Architecture'})
              </button>
            </div>

            <textarea
              value={candidateAnswer}
              onChange={(e) => {
                setCandidateAnswer(e.target.value);
                if (!isTimerRunning && e.target.value.length > 0) {
                  setIsTimerRunning(true);
                }
              }}
              rows={5}
              placeholder={
                round === 'HR / Managerial Round'
                  ? `Deliver your answer using STAR: Situation (set context), Task (your goal), Action (what YOU specifically did, avoiding passive 'we'), Result (quantified business impact or lesson learned)...`
                  : `Detail your technical solution: State core algorithms/tools chosen, address edge cases, explain trade-offs (why X over Y), and defend scalability/error handling...`
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed resize-none"
            />

            {/* Helper Starter Chips based on Round */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 mr-1">Framework tags:</span>
              {round === 'HR / Managerial Round' ? (
                <>
                  <button
                    onClick={() => setCandidateAnswer((prev) => prev + ' [Situation: In my previous university/client project, our team faced...]')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    + Situation
                  </button>
                  <button
                    onClick={() => setCandidateAnswer((prev) => prev + ' [Task: My specific responsibility was to ensure...]')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    + Task
                  </button>
                  <button
                    onClick={() => setCandidateAnswer((prev) => prev + ' [Action: I scheduled a 1-on-1 alignment session and proposed a prototype...]')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    + Action (I, not we)
                  </button>
                  <button
                    onClick={() => setCandidateAnswer((prev) => prev + ' [Result: We delivered 3 days before deadline and improved client NPS by 22%...]')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    + Quantified Result
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCandidateAnswer((prev) => prev + ' [Architecture: The system uses a stateless worker tier with Redis caching...]')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    + Architecture
                  </button>
                  <button
                    onClick={() => setCandidateAnswer((prev) => prev + ' [Trade-off: I chose PostgreSQL with read replicas because strict ACID transactions were mandatory...]')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    + Trade-offs
                  </button>
                  <button
                    onClick={() => setCandidateAnswer((prev) => prev + ' [Failover: If the primary node crashes, a secondary replica is promoted within 15 seconds...]')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  >
                    + Failover
                  </button>
                </>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {/* Mic Toggle Button */}
              <button
                onClick={toggleMic}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
                title={speechSupported ? 'Record audio via mic' : 'Mic speech recognition not available'}
              >
                {isListening ? (
                  <>
                    <Mic className="w-4 h-4 text-rose-400" />
                    <span>Listening... (Click to stop)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-slate-400" />
                    <span>Record Voice</span>
                  </>
                )}
              </button>

              {/* Submit Answer */}
              <button
                onClick={handleSubmitAnswer}
                disabled={isSubmittingAnswer || !candidateAnswer.trim()}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-40 active:scale-95"
              >
                {isSubmittingAnswer ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmittingAnswer ? 'Probing response...' : 'Submit & Trigger Probing'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Probing Card & Bar-Raiser Intelligence */}
        <div className="lg:col-span-5 space-y-5">
          {/* Probing Alert Card */}
          {activeFollowUp ? (
            <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {currentCompany.name} Probing Follow-Up
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    activeFollowUp.answerStrength === 'Staff-Level' || activeFollowUp.answerStrength === 'Strong'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  Grade: {activeFollowUp.answerStrength}
                </span>
              </div>

              {/* Spoken Reaction */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                  Interviewer Spoken Reaction:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 italic font-mono bg-purple-950/20 p-3 rounded-lg border border-purple-900/30">
                  "{activeFollowUp.interviewerReaction}"
                </p>
              </div>

              {/* The Follow-Up Question */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                  <span>Probing Focus ({activeFollowUp.probingFocus}):</span>
                </span>
                <p className="text-sm font-semibold text-white bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                  {activeFollowUp.followUpQuestion}
                </p>
              </div>

              {/* Immediate Critique */}
              <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="font-bold text-slate-400 text-[11px]">Critique on Previous Answer:</span>
                <p className="text-slate-300">{activeFollowUp.feedbackSnippet}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Type your follow-up answer in the box to continue grilling!
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{currentCompany.name} Hiring Expectations</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {currentCompany.description}
              </p>

              <div className="space-y-2.5 font-mono text-xs text-slate-300">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-emerald-400 font-bold">Technical Priorities:</span>
                  <ul className="text-slate-400 text-[11px] space-y-0.5 list-disc list-inside">
                    {currentCompany.technicalFocus.slice(0, 2).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-purple-400 font-bold">HR & Behavioral Priorities:</span>
                  <ul className="text-slate-400 text-[11px] space-y-0.5 list-disc list-inside">
                    {currentCompany.hrFocus.slice(0, 2).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* End Session & Request Full FAANG Scorecard */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-indigo-950/30 border border-emerald-500/30 rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Generate Final {round} Scorecard</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluates {round === 'HR / Managerial Round' ? 'Culture fit, STAR metrics, and communication' : 'Technical depth, system trade-offs, and scalability'}.
                </p>
              </div>
            </div>

            <button
              onClick={handleRequestEvaluation}
              disabled={isEvaluating || (turns.length === 0 && !candidateAnswer.trim())}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-40"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating with {currentCompany.name} Calibration...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span>Generate {round} Diagnostic Scorecard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
