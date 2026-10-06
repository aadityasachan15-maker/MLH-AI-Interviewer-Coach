# 🎯 GemmaCoach AI — Adaptive Fullstack Interview Coach Platform

> **Supercharge your interview preparation with real-time adaptive probing, multi-company calibration, interactive system design whiteboards, and rapid 2-minute micro-drills.**  
> Powered by **React.js + Tailwind CSS** frontend, **Python FastAPI** backend, and **Google Gemma 4 (`gemma-4-26b-a4b-it`) & Gemini 3.8**.

---

## 🚀 Why GemmaCoach AI is Different (The Market Gap)

Existing mock interview platforms (such as Google Interview Warmup, Yoodli, or generic ChatGPT wrappers) suffer from three fatal flaws:
1. **Scripted Linear Q&A:** They ask Question 1, wait for your answer, and mechanically move to Question 2 without verifying depth.
2. **Zero Follow-Up Probing:** In real interviews at top firms (Goldman Sachs, Microsoft, Infosys, Deloitte), when a candidate says *"I used Redis"*, a real Bar-Raiser immediately probes: *"Why Redis over Memcached? How did you handle cache stampedes and stale keys on failover?"*
3. **No Dual-Track Technical & HR Calibration:** Candidates are either given LeetCode pass/fail tests or soft-skill filler word counts, missing the critical connection between **Technical Scalability** and **STAR Behavioral Agency ("I" vs "we")**.

**GemmaCoach AI** closes these gaps with an adversarial, stateful Bar-Raiser probing state machine and multi-company cultural calibration.

---

## 🌟 Core Features

### 1. 🎙️ Live Mock Interview & Adaptive Probing Studio
* **Round Switcher:** Seamlessly toggle between **Technical Round** and **HR / Managerial Round**.
* **Role Calibration:**
  * **Software Development Engineer (SDE / SWE):** DSA, OOPs, DBMS, Operating Systems, Concurrency, High/Low-Level System Design.
  * **Data Analyst / BI Engineer:** SQL (Window Functions `DENSE_RANK`, `LEAD/LAG`, CTEs), Python/Pandas, Statistics & Probability, Data Modeling, A/B testing.
  * **System Engineer:** Linux administration (`top`, `ps`, memory/CPU triage), Networking (TCP/IP, DNS, Subnetting, OSI), Shell scripting, P1 Incident Root Cause Analysis (RCA).
  * **Junior System Engineer / Graduate Engineer Trainee (GET):** Core Linux commands (`chmod`, `grep`, `awk`), IP addressing, basic SQL, VM troubleshooting, rotational shift readiness.
* **Company Calibration:**
  * **Goldman Sachs:** Low-latency concurrency, lock-free data structures, financial ledger integrity, high-pressure problem solving.
  * **Microsoft:** Azure cloud scale, clean architecture, SOLID principles, Satya Nadella's "Growth Mindset".
  * **Infosys:** InfyTQ / HackWithInfy patterns, core Java/Python, DBMS normalization, Mysore training & relocation readiness.
  * **Deloitte:** Advanced SQL, ERP/Cloud integration, stakeholder management, business case structuring.
  * **TCS:** Ninja vs Digital, Tata Code of Conduct, versatility, SDLC fundamentals.
  * **EPAM Systems:** Extreme clean code bar, Gang of Four (GoF) design patterns, TDD & unit testing.
  * **Wipro:** Turbo vs Elite, debugging, client adaptability, shift flexibility.
  * Plus **Google** (Googleyness & Systems) and **Amazon** (16 Leadership Principles).
* **Live Speech-to-Text Voice Recording:** Web Speech API integration with timer and waveform indicators.

### 2. 📐 Interactive System Design Whiteboard
* Drag-and-drop architectural blocks: **Client, Load Balancer, API Gateway, Microservice Worker, Redis Cache, PostgreSQL (Primary/Replica), Kafka Queue**.
* Live diagram pipeline visualizer.
* **AI Architecture Critique:** Detects **Single Point of Failure (SPOF)**, database bottlenecks, cache race conditions, and awards an architecture grade (A to D) with Scalability Scores.

### 3. ⚡ 2-Minute Micro-Drills Studio (Athletic Practice Loop)
* Rapid 45s–60s countdown drills with instant AI scoring:
  * *Drill 1:* "Nail the STAR Result in 45 Seconds" (Quantified metrics).
  * *Drill 2:* "Explain Distributed Cache Invalidation in 60s" (Cache-aside vs write-through).
  * *Drill 3:* "Saying 'I' Instead of Hiding Behind 'We'" (Personal technical agency).
  * *Drill 4:* "Diagnosing 100% CPU on Linux in 60s" (System Engineer workflow).
  * *Drill 5:* "DENSE_RANK vs RANK in 45s" (Data Analyst).
* Instant side-by-side comparison against **Top 1% FAANG Staff Engineer Benchmark Answers**.

### 4. 📊 FAANG & Enterprise Diagnostic Scorecard
* Overall Bar-Raiser Score (/100) and Verdict (*Strong Hire, Hire, Leaning Hire, No Hire*).
* Dual-track meters: Technical Rigor, Communication Structure, Personal Agency, and Red Flags.
* Full STAR framework analysis (Situation, Task, Action, Result).

### 5. 📦 One-Click Project ZIP Export & GitHub Sync
* Download the complete 32-file codebase as a single `.zip` archive directly from the UI.
* Automated in-app direct push to GitHub using Personal Access Tokens.

---

## 🏗️ System Architecture

```text
[User Browser (React + Tailwind + Web Speech API)]
               │
               ├── (1) Real-Time Transcript & Audio Stream
               ├── (2) Whiteboard Canvas Nodes & Links
               └── (3) Resume & Target Company Parameters
               ▼
[Server: Python FastAPI / Express API Gateway]
               │
               ├── [Bar-Raiser Probing Engine]
               ├── [Whiteboard Graph Validator]
               └── [STAR & Technical Rubric Evaluator]
               ▼
[AI Model: Google Gemma 4 (gemma-4-26b-a4b-it) & Gemini 3.8]
```

---

## 📁 Repository Directory Structure

```text
├── backend/
│   ├── main.py              # Production FastAPI server with all routes & models
│   ├── gemma_engine.py      # Google Gemma 4 integration module using google-genai SDK
│   ├── requirements.txt     # Python dependencies (fastapi, uvicorn, google-genai, etc.)
│   └── .env.example         # GEMINI_API_KEY and GEMMA_MODEL_ID template
│
├── src/
│   ├── components/
│   │   ├── LiveInterviewStudio.tsx       # Live Interview room (Tech & HR rounds)
│   │   ├── SystemDesignWhiteboard.tsx    # Drag-and-drop architecture canvas
│   │   ├── MicroDrillsStudio.tsx         # 2-Min countdown rapid micro-drills
│   │   ├── ScorecardTab.tsx              # Diagnostic FAANG Scorecard
│   │   ├── FastApiGemmaBackendTab.tsx    # Interactive Python backend explorer
│   │   ├── MarketGapTab.tsx              # Competitor analysis matrix
│   │   ├── GitHubSyncModal.tsx           # GitHub push & ZIP export modal
│   │   └── Navbar.tsx                    # Top navigation bar
│   │
│   ├── data/
│   │   └── interviewCoachData.ts         # Companies, roles, topics, and drills
│   ├── types.ts                          # TypeScript types & contracts
│   ├── App.tsx                           # Main application component
│   └── index.css                         # Tailwind CSS styling
│
├── public/
│   └── interview-coach-fullstack.zip     # Pre-packaged ready-to-download project archive
├── index.html                            # HTML entrypoint
├── package.json                          # Node.js dependencies
├── server.ts                             # Express server + GenAI bridge + ZIP streaming
├── tsconfig.json                         # TypeScript configuration
├── vite.config.ts                        # Vite bundler configuration
└── README.md                             # Project documentation
```

---

## 🛠️ Local Development & Setup

### Prerequisites
* Node.js 18+ & npm
* Python 3.10+ (for FastAPI backend)
* Google GenAI API key ([Get free key from Google AI Studio](https://aistudio.google.com/))

### 1. Frontend & Fullstack Dev Server (Node.js)
```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Standalone Python FastAPI Backend
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure your API key
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY

# Run FastAPI server
uvicorn main:app --reload --port 8000
```
Open interactive Swagger API docs at `http://localhost:8000/docs`.

---

## 🌐 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/interview/generate-question` | Generates authentic question tailored to role, company, and round |
| `POST` | `/api/interview/adaptive-turn` | Probes candidate answer for weak assumptions and trade-offs |
| `POST` | `/api/interview/evaluate` | Generates comprehensive FAANG Bar-Raiser scorecard |
| `POST` | `/api/interview/whiteboard-critique` | Evaluates system design whiteboard for SPOF & bottlenecks |
| `GET`  | `/api/project/download-zip` | Downloads full project source code as a ZIP archive |
| `POST` | `/api/github/direct-push` | Directly pushes project files to user's GitHub repository |

---

## 🤝 Contributing & License
Distributed under the Apache 2.0 License. Contributions, feedback, and pull requests are welcome!
