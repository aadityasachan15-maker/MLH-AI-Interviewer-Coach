"""
Gemma 4 Engine Integration Module
Handles interactions with Google's Gemma 4 model variant (gemma-4-26b-a4b-it)
using the modern google-genai SDK.
"""

import os
import json
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Gemma 4 latest variant ID specified by user
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
            # Fallback to general reasoning model if the specific Gemma preview checkpoint requires special routing
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

async def generate_interview_question(role: str, seniority: str, company: str, topic: str, resume_context: str = "", round: str = "Technical Round") -> dict:
    is_hr = round == "HR / Managerial Round"
    prompt = f"""You are an Expert Interviewer and Bar Raiser at {company}.
Interview Round: {round}.
Target Role: {seniority} {role}.
Topic: {topic}.
{f"Candidate Resume Details: {resume_context}" if resume_context else ""}

{
    "Generate a realistic HR / Managerial behavioral question authentic to " + company + ". Focus on conflict resolution, high stress, shift/relocation flexibility, ethics, or why " + company + "." if is_hr else
    "Generate an authentic Technical round question asked at " + company + " for a " + role + ". Cover DSA/System Design for SDE, SQL/Pandas/Stats for Data Analyst, and Linux/Networking/Triage for System Engineer."
}

Output strictly valid JSON with keys:
{{
  "question": "The interview question",
  "contextOrScenario": "Specific scenario constraints or behavioral context",
  "interviewerGoal": "What you are looking for in this round",
  "keyPitfalls": ["Common pitfall 1", "Common pitfall 2"],
  "sampleFollowUps": ["Probing question if answer is too generic", "Deep dive follow-up"]
}}"""

    system_instruction = "You are an elite FAANG hiring manager who designs rigorous technical and behavioral questions."
    raw = gemma_engine.generate(prompt=prompt, system_instruction=system_instruction, temperature=0.7)
    clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(clean)

async def evaluate_adaptive_turn(question: str, candidate_answer: str, role: str, style: str = "Bar-Raiser", history: list = None) -> dict:
    prompt = f"""You are an elite interviewer conducting an adaptive technical round for a {role}.
Style: {style}.
Question: "{question}"
Candidate Answer: "{candidate_answer}"
{f"Prior turns: {json.dumps(history)}" if history else ""}

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
    try:
        raw = gemma_engine.generate(prompt=prompt, system_instruction=system_instruction, temperature=0.6)
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(clean)
    except Exception as e:
        print(f"[gemma_engine] Adaptive turn dynamic fallback: {e}")
        words = candidate_answer.strip().split()
        word_count = len(words)
        lower = candidate_answer.lower()

        if word_count < 6 or "don't know" in lower or "dont know" in lower or "idk" in lower:
            return {
                "feedbackSnippet": f"Your answer was evasive or too brief ({word_count} words). In real interviews, passing leads to immediate rejection.",
                "interviewerReaction": "Passing or stating you don't know without attempting first-principles deduction is a serious red flag.",
                "followUpQuestion": "If you had to construct a basic minimal prototype without external dependencies, what fundamental logic would you write first?",
                "probingFocus": "Problem-Solving Under Uncertainty",
                "answerStrength": "Weak"
            }

        if "top" in lower or "htop" in lower or "pidstat" in lower:
            return {
                "feedbackSnippet": "Solid triage methodology using system diagnostic utilities.",
                "interviewerReaction": "Good initial triage isolating process thread utilization.",
                "followUpQuestion": "If you discover that I/O wait is 90% because of disk controller saturation, what command do you run to isolate the offending thread?",
                "probingFocus": "Linux Kernel & I/O Contention",
                "answerStrength": "Staff-Level" if word_count > 30 else "Strong"
            }

        if "cache" in lower or "redis" in lower:
            return {
                "feedbackSnippet": "Caching tier identified, but failure modes and consistency must be addressed.",
                "interviewerReaction": "Redis provides fast reads, but concurrent updates create race conditions.",
                "followUpQuestion": "How do you mitigate cache thundering herds when a high-traffic key expires during peak traffic?",
                "probingFocus": "Cache Invalidation & Consistency",
                "answerStrength": "Strong" if word_count > 40 else "Mediocre"
            }

        snippet = " ".join(words[:5])
        return {
            "feedbackSnippet": f"You suggested '{snippet}...', but senior technical rounds require defending failure modes.",
            "interviewerReaction": f"You outlined {snippet}, but how does this handle network partitions or node failover?",
            "followUpQuestion": "What is the single biggest bottleneck in this design, and how would you monitor for it in production?",
            "probingFocus": "Failure Modes & System Resiliency",
            "answerStrength": "Mediocre" if word_count > 40 else "Weak"
        }

async def evaluate_candidate_scorecard(question: str, candidate_answer: str, role: str) -> dict:
    prompt = f"""Act as a FAANG Hiring Evaluation Panel.
Analyze this candidate response for a {role}:
Question: "{question}"
Candidate Answer: "{candidate_answer}"

Evaluate using the FAANG Bar-Raiser Rubric.
Return strictly valid JSON:
{{
  "overallScore": 82,
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
    "score": 7,
    "notes": "Conciseness vs rambling, structure"
  }},
  "redFlagsDetected": ["List of red flags or empty list if none"],
  "modelAnswerFramework": "How a Top 1% Senior candidate would structure and answer this question in 3 concise bullet points",
  "microDrillRecommendation": "A 2-minute targeted practice exercise to fix the biggest weakness"
}}"""

    system_instruction = "You are an objective hiring calibration committee member."
    try:
        raw = gemma_engine.generate(prompt=prompt, system_instruction=system_instruction, temperature=0.4)
        clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(clean)
    except Exception as e:
        print(f"[gemma_engine] Scorecard dynamic strict evaluation: {e}")
        text = candidate_answer.strip()
        words = text.split()
        word_count = len(words)
        text_lower = text.lower()
        q_lower = question.lower()
        unique_words = len(set(text_lower.split()))

        # 1. Spam check
        if word_count > 6 and (unique_words / (word_count or 1)) < 0.45:
            return {
                "overallScore": 10,
                "verdict": "No Hire",
                "starBreakdown": {"situation": "N/A", "task": "N/A", "action": "Submitted spam text", "result": "None"},
                "technicalDepth": {"score": 1, "notes": "Spam / repeated words detected."},
                "communicationClarity": {"score": 1, "notes": "Incoherent repetitive text."},
                "redFlagsDetected": ["Candidate submitted spam/repeated text instead of a coherent response"],
                "modelAnswerFramework": "Immediate disqualification in technical rounds.",
                "microDrillRecommendation": "Practice the 60-second Micro-Drill."
            }

        # 2. Evasive check
        is_evasive = word_count < 6 or "don't know" in text_lower or "dont know" in text_lower or "idk" in text_lower or "skip" in text_lower
        if is_evasive:
            return {
                "overallScore": 12,
                "verdict": "No Hire",
                "starBreakdown": {"situation": "None", "task": "Unaddressed", "action": "Surrendered without problem solving", "result": "None"},
                "technicalDepth": {"score": 1, "notes": f"Surrendered question with only {word_count} words."},
                "communicationClarity": {"score": 2, "notes": "Evasive answer."},
                "redFlagsDetected": ["Candidate surrendered question with zero problem-solving attempt"],
                "modelAnswerFramework": "State clarifying assumptions and break down inputs/outputs.",
                "microDrillRecommendation": "Practice basic first-principles problem breakdown."
            }

        # 3. Off-topic check
        tech_terms = ["cache", "redis", "database", "postgres", "sql", "sharding", "replication", "kafka", "queue", "lock", "mutex", "latency", "api", "token", "bucket", "rps", "failover", "cluster", "index", "thread", "worker", "load", "balancer", "gateway", "window", "dense_rank", "rank", "partition", "top", "htop", "uptime", "pidstat", "strace", "iostat", "cpu", "memory", "disk"]
        hr_terms = ["conflict", "teammate", "colleague", "project", "disagreement", "deadline", "lead", "client", "discussion", "compromise", "schedule", "1-on-1", "resolution", "resolve", "delivered", "outcome", "result"]
        bank = hr_terms if ("conflict" in q_lower or "disagreement" in q_lower) else tech_terms

        hits = sum(1 for t in bank if t in text_lower)
        if hits == 0:
            return {
                "overallScore": 16,
                "verdict": "No Hire",
                "starBreakdown": {"situation": "Off-topic context.", "task": "Ignored core question.", "action": "Spoke off-topic.", "result": "Zero relevance."},
                "technicalDepth": {"score": 1, "notes": "Zero domain relevance to the question asked."},
                "communicationClarity": {"score": 2, "notes": "Off-topic rambling."},
                "redFlagsDetected": ["Response was completely off-topic and ignored the question prompt", "Zero domain terminology referenced"],
                "modelAnswerFramework": "Focus directly on the scenario asked in the prompt.",
                "microDrillRecommendation": "Practice active listening to ensure your solution directly answers the prompt."
            }

        # 4. Strict Scoring
        score = 25
        if hits >= 1: score += 12
        if hits >= 3: score += 12
        if hits >= 6: score += 12
        if any(k in text_lower for k in ["because", "instead of", "trade-off", "vs", "drawback"]): score += 12
        has_metrics = bool(re.search(r'\d+%|\$\d+|\d+\s*(ms|seconds|rps|qps|tb|gb|days|hours)', text))
        if has_metrics: score += 14

        if word_count < 18: score = min(score, 34)
        elif word_count < 35: score = min(score, 52)
        elif word_count < 60: score = min(score, 70)
        score = min(95, max(12, score))

        verdict = "Strong Hire" if score >= 85 else ("Hire" if score >= 75 else ("Leaning Hire" if score >= 62 else ("Leaning No Hire" if score >= 48 else "No Hire")))
        return {
            "overallScore": score,
            "verdict": verdict,
            "starBreakdown": {
                "situation": f"Context referenced: '{' '.join(words[:10])}...'" if word_count > 25 else "Too brief.",
                "task": "Addressed core problem." if word_count > 20 else "Problem unowned.",
                "action": "Demonstrated personal ownership." if "i " in text_lower else "Passive/team voice.",
                "result": "Quantified impact included." if has_metrics else "Lacked quantified numbers."
            },
            "technicalDepth": {"score": max(1, min(10, round(score / 10))), "notes": f"Candidate referenced {hits} domain concepts."},
            "communicationClarity": {"score": max(2, min(10, round(score / 10))), "notes": "Structured technical delivery."},
            "redFlagsDetected": ["Lacked concrete quantified numbers"] if not has_metrics else [],
            "modelAnswerFramework": "State SLA upfront, present architecture, defend trade-offs, and detail failover.",
            "microDrillRecommendation": "Practice the 60-second Micro-Drill."
        }

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
    clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(clean)
