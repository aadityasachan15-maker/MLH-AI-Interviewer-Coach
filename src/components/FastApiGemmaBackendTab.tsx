import React, { useState } from 'react';
import { 
  FileCode, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Server, 
  Cpu, 
  Layers, 
  BookOpen, 
  CheckCircle2,
  FolderGit2
} from 'lucide-react';
import { CodeViewer } from './CodeViewer';

const MAIN_PY_CODE = `import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

# Import Gemma 4 Engine
from gemma_engine import (
    gemma_engine,
    generate_interview_question,
    evaluate_adaptive_turn,
    evaluate_candidate_scorecard,
    critique_system_architecture
)

load_dotenv()

app = FastAPI(
    title="GemmaCoach AI - FastAPI Backend",
    description="Adaptive AI Interview Coach powered by Google Gemma 4 (gemma-4-26b-a4b-it)",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Models -----------------
class QuestionGenRequest(BaseModel):
    role: str = Field(default="Software Development Engineer (SDE)")
    seniority: str = Field(default="Senior")
    company: str = Field(default="Goldman Sachs")
    topic: str = Field(default="Data Structures & Algorithms")
    round: str = Field(default="Technical Round")
    resume_context: Optional[str] = Field(default="")

class AdaptiveTurnRequest(BaseModel):
    question: str
    candidate_answer: str
    role: str = "Software Engineer"
    style: str = "Bar-Raiser, Probing"
    history: Optional[List[Dict[str, str]]] = []

class EvaluateRequest(BaseModel):
    question: str
    candidate_answer: str
    role: str = "Software Engineer"

class WhiteboardCritiqueRequest(BaseModel):
    architecture_name: str
    components: List[Dict[str, Any]]
    connections: List[Dict[str, Any]]
    explanation: str

# ----------------- Endpoints -----------------

@app.get("/")
async def root():
    """Health check & endpoint directory (Fixes 404 Not Found error)."""
    return {
        "status": "online",
        "service": "GemmaCoach AI Engine",
        "model_id": gemma_engine.model_id,
        "endpoints": {
            "generate_question": "POST /api/interview/generate-question",
            "adaptive_turn": "POST /api/interview/adaptive-turn",
            "evaluate": "POST /api/interview/evaluate",
            "critique_whiteboard": "POST /api/interview/whiteboard-critique",
            "docs": "GET /docs"
        }
    }

@app.post("/api/interview/generate-question")
async def api_generate_question(req: QuestionGenRequest):
    """Generates tailored, resume-grounded interview question using Gemma 4."""
    return await generate_interview_question(
        role=req.role,
        seniority=req.seniority,
        company=req.company,
        topic=req.topic,
        resume_context=req.resume_context
    )

@app.post("/api/interview/adaptive-turn")
async def api_adaptive_turn(req: AdaptiveTurnRequest):
    """Simulates real FAANG interviewer probing weak assumptions."""
    return await evaluate_adaptive_turn(
        question=req.question,
        candidate_answer=req.candidate_answer,
        role=req.role,
        style=req.style,
        history=req.history
    )

@app.post("/api/interview/evaluate")
async def api_evaluate(req: EvaluateRequest):
    """Generates full FAANG Bar-Raiser scorecard."""
    return await evaluate_candidate_scorecard(
        question=req.question,
        candidate_answer=req.candidate_answer,
        role=req.role
    )

@app.post("/api/interview/whiteboard-critique")
async def api_whiteboard_critique(req: WhiteboardCritiqueRequest):
    """Evaluates interactive system design whiteboard architecture and bottlenecks."""
    return await critique_system_architecture(
        name=req.architecture_name,
        components=req.components,
        connections=req.connections,
        explanation=req.explanation
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)`;

const GEMMA_ENGINE_CODE = `import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Google Gemma 4 Latest Variant ID
GEMMA_4_MODEL_ID = os.getenv("GEMMA_MODEL_ID", "gemma-4-26b-a4b-it")
FALLBACK_MODEL_ID = "gemini-2.5-flash"

class GemmaEngine:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model_id = GEMMA_4_MODEL_ID
        self.client = None
        
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            print("[WARNING] GEMINI_API_KEY is not set in environment.")

    def generate(self, prompt: str, system_instruction: str = "You are a helpful AI assistant.", temperature: float = 0.7) -> str:
        """Standard generation using Gemma 4 with fallback support."""
        if not self.client:
            raise RuntimeError("API key is not configured. Please set GEMINI_API_KEY in .env file.")

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=temperature
                ),
                contents=prompt,
            )
            return response.text or ""
        except Exception as e:
            print(f"[Gemma Engine] Primary model {self.model_id} warning: {e}. Attempting fallback...")
            response = self.client.models.generate_content(
                model=FALLBACK_MODEL_ID,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=temperature
                ),
                contents=prompt,
            )
            return response.text or ""

gemma_engine = GemmaEngine()

async def generate_interview_question(role: str, seniority: str, company: str, topic: str, resume_context: str = "") -> dict:
    prompt = f"""You are a Principal Tech Lead and Bar Raiser at {company}.
Create an authentic, challenging interview question for a {seniority} {role}.
Topic: {topic}.
{f"Candidate Resume Details: {resume_context}" if resume_context else ""}

Output strictly valid JSON with keys:
{{
  "question": "The interview question",
  "contextOrScenario": "Specific constraints (e.g. 100k QPS, strict latency, network partitioning)",
  "interviewerGoal": "What you are looking for (ownership, trade-offs, edge cases)",
  "keyPitfalls": ["Common pitfall 1", "Common pitfall 2"],
  "sampleFollowUps": ["Probing question if answer is too generic", "Deep dive if candidate picks technology X"]
}}"""

    system_instruction = "You are an elite FAANG hiring manager who designs rigorous technical and behavioral questions."
    raw = gemma_engine.generate(prompt=prompt, system_instruction=system_instruction, temperature=0.7)
    clean = raw.strip().removeprefix("\`\`\`json").removeprefix("\`\`\`").removesuffix("\`\`\`").strip()
    return json.loads(clean)

async def evaluate_adaptive_turn(question: str, candidate_answer: str, role: str, style: str = "Bar-Raiser", history: list = None) -> dict:
    prompt = f"""You are an elite interviewer conducting an adaptive technical round for a {role}.
Style: {style}.
Question: "{question}"
Candidate Answer: "{candidate_answer}"

Real FAANG interviewers DO NOT just accept vague answers.
1. Find weak assumptions or hand-waving (e.g. "We used a cache" -> "How did you invalidate it?").
2. Probe a hard trade-off.
3. If the answer was solid, escalate difficulty.

Return strictly valid JSON:
{{
  "feedbackSnippet": "2 sentences of constructive critique on answer depth",
  "interviewerReaction": "Realistic spoken reaction from interviewer",
  "followUpQuestion": "The sharp probing follow-up question",
  "probingFocus": "Architecture | Concurrency | Failure Modes | Ownership",
  "answerStrength": "Weak" | "Mediocre" | "Strong" | "Staff-Level"
}}"""

    system_instruction = "You are a realistic, challenging technical interviewer probing for true mastery."
    raw = gemma_engine.generate(prompt=prompt, system_instruction=system_instruction, temperature=0.6)
    clean = raw.strip().removeprefix("\`\`\`json").removeprefix("\`\`\`").removesuffix("\`\`\`").strip()
    return json.loads(clean)

async def evaluate_candidate_scorecard(question: str, candidate_answer: str, role: str) -> dict:
    prompt = f"""Act as a FAANG Hiring Evaluation Panel.
Analyze this candidate response for a {role}:
Question: "{question}"
Candidate Answer: "{candidate_answer}"

Return strictly valid JSON:
{{
  "overallScore": 84,
  "verdict": "Strong Hire" | "Hire" | "Leaning Hire" | "Leaning No Hire" | "No Hire",
  "starBreakdown": {{
    "situation": "Evaluation of context clarity",
    "task": "Evaluation of core problem ownership",
    "action": "Evaluation of personal agency (did they say 'I' vs 'we'?)",
    "result": "Evaluation of quantified impact & business metrics"
  }},
  "technicalDepth": {{
    "score": 8,
    "notes": "Comments on technical trade-offs and edge cases"
  }},
  "communicationClarity": {{
    "score": 8,
    "notes": "Conciseness vs rambling, structure"
  }},
  "redFlagsDetected": [],
  "modelAnswerFramework": "How a Top 1% Senior candidate would structure and answer this question in 3 concise bullet points",
  "microDrillRecommendation": "A 2-minute targeted practice exercise to fix the biggest weakness"
}}"""

    system_instruction = "You are an objective hiring calibration committee member."
    raw = gemma_engine.generate(prompt=prompt, system_instruction=system_instruction, temperature=0.4)
    clean = raw.strip().removeprefix("\`\`\`json").removeprefix("\`\`\`").removesuffix("\`\`\`").strip()
    return json.loads(clean)

async def critique_system_architecture(name: str, components: list, connections: list, explanation: str) -> dict:
    prompt = f"""You are a Principal Distributed Systems Architect.
Review this candidate's system design whiteboard diagram:
Architecture Name: {name}
Candidate Explanation: "{explanation}"
Components on Canvas: {json.dumps(components)}
Connections/Flow: {json.dumps(connections)}

Evaluate scalability, single points of failure (SPOF), bottleneck points, and caching consistency.
Return strictly valid JSON:
{{
  "architectureGrade": "A" | "B" | "C" | "D",
  "scalabilityScore": 85,
  "identifiedBottlenecks": ["Bottleneck 1", "Bottleneck 2"],
  "singlePointOfFailure": ["SPOF 1"],
  "recommendedOptimizations": ["Optimization 1", "Optimization 2"],
  "staffEngineerCritique": "Detailed 3-4 sentence architectural assessment"
}}"""

    system_instruction = "You are an expert system design interviewer evaluating distributed architectures."
    raw = gemma_engine.generate(prompt=prompt, system_instruction=system_instruction, temperature=0.5)
    clean = raw.strip().removeprefix("\`\`\`json").removeprefix("\`\`\`").removesuffix("\`\`\`").strip()
    return json.loads(clean)`;

const REQUIREMENTS_TXT = `fastapi>=0.115.0
uvicorn[standard]>=0.32.0
google-genai>=0.1.1
python-dotenv>=1.0.1
pydantic>=2.9.0
requests>=2.32.0`;

const ENV_TXT = `# Google GenAI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Gemma 4 Model ID Variant
GEMMA_MODEL_ID=gemma-4-26b-a4b-it

# Server Port
PORT=8000`;

export const FastApiGemmaBackendTab: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'main' | 'gemma' | 'reqs' | 'env'>('main');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Python FastAPI + Google Gemma 4
            </span>
            <span className="text-xs font-mono text-slate-500">gemma-4-26b-a4b-it Integration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Backend Architecture & Model Files Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Inspect and download the production Python FastAPI files powering this interview coach, complete with the Google GenAI SDK integration for Gemma 4.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Explorer Tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <span>Backend Project Structure</span>
            </div>

            <div className="space-y-1 font-mono text-xs">
              <button
                onClick={() => setActiveFile('main')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                  activeFile === 'main'
                    ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>backend/main.py</span>
                </div>
                <span className="text-[10px] text-slate-500">FastAPI</span>
              </button>

              <button
                onClick={() => setActiveFile('gemma')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                  activeFile === 'gemma'
                    ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>backend/gemma_engine.py</span>
                </div>
                <span className="text-[10px] text-purple-400">Gemma 4</span>
              </button>

              <button
                onClick={() => setActiveFile('reqs')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                  activeFile === 'reqs'
                    ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>backend/requirements.txt</span>
                </div>
                <span className="text-[10px] text-slate-500">pip</span>
              </button>

              <button
                onClick={() => setActiveFile('env')}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                  activeFile === 'env'
                    ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-blue-400" />
                  <span>backend/.env.example</span>
                </div>
                <span className="text-[10px] text-slate-500">Config</span>
              </button>
            </div>
          </div>

          {/* Quick Terminal Command helper */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Run Locally:
            </span>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-emerald-400 space-y-1">
              <p className="text-slate-500"># Install & start:</p>
              <p>pip install -r backend/requirements.txt</p>
              <p>uvicorn backend.main:app --reload --port 8000</p>
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8">
          {activeFile === 'main' && (
            <CodeViewer
              code={MAIN_PY_CODE}
              language="python"
              filename="main.py"
              title="backend/main.py (FastAPI Routes & Models)"
            />
          )}

          {activeFile === 'gemma' && (
            <CodeViewer
              code={GEMMA_ENGINE_CODE}
              language="python"
              filename="gemma_engine.py"
              title="backend/gemma_engine.py (Google Gemma 4 Integration)"
            />
          )}

          {activeFile === 'reqs' && (
            <CodeViewer
              code={REQUIREMENTS_TXT}
              language="text"
              filename="requirements.txt"
              title="backend/requirements.txt"
            />
          )}

          {activeFile === 'env' && (
            <CodeViewer
              code={ENV_TXT}
              language="ini"
              filename=".env.example"
              title="backend/.env.example"
            />
          )}
        </div>
      </div>
    </div>
  );
};
