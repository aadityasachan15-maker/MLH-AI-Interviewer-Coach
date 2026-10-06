export type InterviewRound = 'Technical Round' | 'HR / Managerial Round';

export interface InterviewTurn {
  id: string;
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  probingFocus?: string;
  answerStrength?: 'Weak' | 'Mediocre' | 'Strong' | 'Staff-Level';
  feedbackSnippet?: string;
}

export interface GeneratedQuestion {
  question: string;
  contextOrScenario: string;
  interviewerGoal: string;
  keyPitfalls: string[];
  sampleFollowUps: string[];
  round?: InterviewRound;
  suggestedAnswerPoints?: string[];
}

export interface AdaptiveTurnResponse {
  feedbackSnippet: string;
  interviewerReaction: string;
  followUpQuestion: string;
  probingFocus: string;
  answerStrength: 'Weak' | 'Mediocre' | 'Strong' | 'Staff-Level';
}

export interface CandidateScorecard {
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Leaning No Hire' | 'No Hire';
  round?: InterviewRound;
  starBreakdown: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  technicalDepth: {
    score: number;
    notes: string;
  };
  communicationClarity: {
    score: number;
    notes: string;
  };
  cultureFitAndHR?: {
    score: number;
    notes: string;
  };
  redFlagsDetected: string[];
  modelAnswerFramework: string;
  microDrillRecommendation: string;
}

export interface WhiteboardComponent {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  icon: string;
  color: string;
}

export interface WhiteboardConnection {
  fromId: string;
  toId: string;
  label?: string;
}

export interface WhiteboardCritique {
  architectureGrade: string;
  scalabilityScore: number;
  identifiedBottlenecks: string[];
  singlePointOfFailure: string[];
  recommendedOptimizations: string[];
  staffEngineerCritique: string;
}

export interface MicroDrillItem {
  id: string;
  title: string;
  category: 'Behavioral STAR' | 'System Design' | 'Leadership' | 'HR & Culture' | 'Core CS';
  timeSeconds: number;
  prompt: string;
  whatToFocusOn: string[];
  benchmarkModelAnswer: string;
}

export interface BugItem {
  id: string;
  title: string;
  severity: 'critical' | 'error' | 'warning' | 'info';
  errorType: string;
  originalSnippet: string;
  fixedSnippet: string;
  description: string;
  whyItFailed: string;
  howItIsFixed: string;
  lineNumbersOriginal: string;
  lineNumbersFixed: string;
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  summary: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  requestBodyExample?: Record<string, any>;
  responseExample: Record<string, any>;
}

export interface RequestLogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST';
  url: string;
  statusCode: number;
  durationMs: number;
  requestBody?: any;
  responseBody: any;
  statusText: string;
}
