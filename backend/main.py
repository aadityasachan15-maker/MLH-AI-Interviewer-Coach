import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

# Import our dedicated Gemma 4 Engine
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
    description="Adaptive AI Interview Coach powered by Google Gemma 4 (gemma-4-26b-a4b-it) & Gemini",
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
    role: str = Field(default="Software Development Engineer (SDE)", description="Target job title (SDE, Data Analyst, System Engineer, Junior System Engineer)")
    seniority: str = Field(default="Senior", description="Seniority level (Junior, Mid, Senior, Staff)")
    company: str = Field(default="Goldman Sachs", description="Target company (Goldman Sachs, Microsoft, Infosys, Deloitte, TCS, EPAM, Wipro, Google, Amazon)")
    topic: str = Field(default="Data Structures & Algorithms", description="Interview topic")
    round: str = Field(default="Technical Round", description="Interview Round (Technical Round vs HR / Managerial Round)")
    resume_context: Optional[str] = Field(default="", description="Resume claims or past project details")

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
    try:
        result = await generate_interview_question(
            role=req.role,
            seniority=req.seniority,
            company=req.company,
            topic=req.topic,
            resume_context=req.resume_context,
            round=req.round
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/adaptive-turn")
async def api_adaptive_turn(req: AdaptiveTurnRequest):
    """Simulates real FAANG interviewer probing weak assumptions or escalating trade-offs."""
    try:
        result = await evaluate_adaptive_turn(
            question=req.question,
            candidate_answer=req.candidate_answer,
            role=req.role,
            style=req.style,
            history=req.history
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/evaluate")
async def api_evaluate(req: EvaluateRequest):
    """Generates full FAANG Bar-Raiser scorecard: STAR Breakdown + Technical Depth."""
    try:
        result = await evaluate_candidate_scorecard(
            question=req.question,
            candidate_answer=req.candidate_answer,
            role=req.role
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/whiteboard-critique")
async def api_whiteboard_critique(req: WhiteboardCritiqueRequest):
    """Evaluates interactive system design whiteboard architecture and bottlenecks."""
    try:
        result = await critique_system_architecture(
            name=req.architecture_name,
            components=req.components,
            connections=req.connections,
            explanation=req.explanation
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
