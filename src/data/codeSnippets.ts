import { BugItem, ApiEndpointSpec } from '../types';

export const ORIGINAL_CODE = `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS allow necessary 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("GEMINI_API_KEY", "your-api-key-here")
client = genai.Client(api_key=API_KEY)

# Model Name - Gemma 4 latest variant
MODEL_ID = "gemma-4-26b-a4b-it"

class ChatRequest(BaseModel):
    prompt: str
    system_instruction: str = "You are a helpful AI assistant."

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            config=types.GenerateContentConfig(
                system_instruction=request.system_instruction
            ),
            contents=request.prompt,
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/think")
async def chat_with_thinking(request: ChatRequest):
    """Use it to solve complex logic problems and reasoning tasks along wit
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            config=types.GenerateContentConfig(
                system_instruction=request.system_instruction,
                thinking_config=types.ThinkingConfig(thinking_level="high")
            ),
            contents=request.prompt,
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__m1__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`;

export const FIXED_CODE = `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Gemini & Gemma AI API",
    description="FastAPI service with /chat and /think reasoning endpoints",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get API key safely from environment variable (.env)
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    # Fallback or warning if key is not configured in environment
    print("[WARNING] GEMINI_API_KEY environment variable is not set!")

client = genai.Client(api_key=API_KEY) if API_KEY else None

# Recommended model ID (Gemma or Gemini model)
MODEL_ID = os.getenv("MODEL_ID", "gemini-2.5-flash")

class ChatRequest(BaseModel):
    prompt: str = Field(..., description="The user prompt or query to process")
    system_instruction: str = Field(
        default="You are a helpful AI assistant.",
        description="System instruction or persona definition"
    )

# FIX 1: Root route to prevent "GET / HTTP/1.1 404 Not Found"
@app.get("/")
async def root():
    """Root health check and endpoint directory."""
    return {
        "status": "online",
        "message": "AI Assistant API is running successfully!",
        "endpoints": {
            "chat": "POST /chat",
            "think": "POST /think",
            "docs": "GET /docs (Interactive Swagger UI)",
            "redoc": "GET /redoc"
        }
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    """Standard conversational endpoint."""
    if not client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            config=types.GenerateContentConfig(
                system_instruction=request.system_instruction
            ),
            contents=request.prompt,
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/think")
async def chat_with_thinking(request: ChatRequest):
    """Use it to solve complex logic problems and reasoning tasks."""
    # FIX 2: Closed the docstring above with triple quotes!
    if not client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured.")
    try:
        # Note: thinking_config is supported on Gemini reasoning models
        config_params = {
            "system_instruction": request.system_instruction
        }
        # Add thinking_config if using a supported model (e.g., gemini-2.5-flash or gemini-2.5-pro)
        try:
            config_params["thinking_config"] = types.ThinkingConfig(thinking_level="high")
        except Exception:
            pass

        response = client.models.generate_content(
            model=MODEL_ID,
            config=types.GenerateContentConfig(**config_params),
            contents=request.prompt,
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# FIX 3: Corrected '__m1__' to '__main__'
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)`;

export const BUGS_LIST: BugItem[] = [
  {
    id: 'missing-root-route',
    title: 'Missing GET / Route (Root 404 Not Found)',
    severity: 'critical',
    errorType: '404 Not Found (Terminal Log)',
    lineNumbersOriginal: 'Line 12 (None)',
    lineNumbersFixed: 'Lines 41-53',
    originalSnippet: `# Only @app.post("/chat") and @app.post("/think") were defined
# No @app.get("/") was defined in the application!`,
    fixedSnippet: `@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "AI Assistant API is running successfully!",
        "endpoints": {
            "chat": "POST /chat",
            "think": "POST /think",
            "docs": "GET /docs"
        }
    }`,
    description: 'When running `uvicorn` and navigating to `http://localhost:8000/` or `http://127.0.0.1:8000/` in a web browser, the browser issues a `GET /` request.',
    whyItFailed: 'FastAPI has strict routing. Because you only declared POST endpoints (`/chat` and `/think`), requesting `GET /` matches zero routes, so FastAPI immediately responds with `404 Not Found`.',
    howItIsFixed: 'Define `@app.get("/")` returning a welcome/status payload, and navigate to `/docs` in the browser to view the interactive Swagger interface.'
  },
  {
    id: 'unclosed-docstring',
    title: 'Unclosed Docstring SyntaxError in /think',
    severity: 'critical',
    errorType: 'SyntaxError: unterminated triple-quoted string',
    lineNumbersOriginal: 'Line 44',
    lineNumbersFixed: 'Line 69',
    originalSnippet: `@app.post("/think")
async def chat_with_thinking(request: ChatRequest):
    """Use it to solve complex logic problems and reasoning tasks along wit
    try:
        response = client.models.generate_content(...)`,
    fixedSnippet: `@app.post("/think")
async def chat_with_thinking(request: ChatRequest):
    """Use it to solve complex logic problems and reasoning tasks."""
    try:
        response = client.models.generate_content(...)`,
    description: 'The docstring inside `chat_with_thinking` was left unclosed without the ending triple quotes `"""`.',
    whyItFailed: 'Python interprets the rest of the file (including `try:`, `return`, `if __name__`) as part of the multiline string, causing a fatal `SyntaxError: unterminated triple-quoted string literal`.',
    howItIsFixed: 'Properly closed the string literal with `"""` at the end of the summary.'
  },
  {
    id: 'main-typo',
    title: 'Typo in Entrypoint: __m1__ instead of __main__',
    severity: 'critical',
    errorType: 'Silent Failure: Server Never Starts',
    lineNumbersOriginal: 'Line 59',
    lineNumbersFixed: 'Lines 96-98',
    originalSnippet: `if __name__ == "__m1__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`,
    fixedSnippet: `if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)`,
    description: 'The standard Python script entry point is `__main__`, but the code had `__m1__`.',
    whyItFailed: 'When executing `python main.py`, Python sets `__name__` to `"__main__"`. Because `__name__ == "__m1__"` evaluates to `False`, the code block inside `if` is skipped entirely, and uvicorn never launches!',
    howItIsFixed: 'Replaced `"__m1__"` with `"__main__"` and enabled `reload=True` for smooth development.'
  },
  {
    id: 'hardcoded-api-key',
    title: 'Hardcoded API Key & Insecure Key Exposure',
    severity: 'warning',
    errorType: 'Security & Configuration Risk',
    lineNumbersOriginal: 'Line 22',
    lineNumbersFixed: 'Lines 27-32',
    originalSnippet: `API_KEY = "YOUR_GEMINI_API_KEY"
client = genai.Client(api_key=API_KEY)`,
    fixedSnippet: `API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("[WARNING] GEMINI_API_KEY environment variable is not set!")
client = genai.Client(api_key=API_KEY) if API_KEY else None`,
    description: 'Hardcoding sensitive API keys directly in source code risks credential leaks and invalidates portability.',
    whyItFailed: 'If the hardcoded key is invalid or leaked, git commits expose it to everyone. Also, if `.env` is loaded via `load_dotenv()`, the code was not even reading from `os.getenv()`.',
    howItIsFixed: 'Read the key from `os.getenv("GEMINI_API_KEY")` and provide informative fallback warnings.'
  },
  {
    id: 'browser-post-mismatch',
    title: 'Browser Navigation (GET) vs Endpoint Method (POST)',
    severity: 'info',
    errorType: '405 Method Not Allowed if hitting /chat or /think directly',
    lineNumbersOriginal: 'Lines 30, 43',
    lineNumbersFixed: 'Interactive Docs at /docs',
    originalSnippet: `# In browser address bar: typing http://localhost:8000/chat
# causes "Method Not Allowed" (405) because address bars send GET!`,
    fixedSnippet: `# Visit http://localhost:8000/docs
# Or use cURL / Python requests with POST and a JSON body!`,
    description: 'Web browsers send HTTP GET requests when you type an address in the search/URL bar.',
    whyItFailed: 'Your AI endpoints are `@app.post("/chat")` and `@app.post("/think")`. They require an HTTP POST method with an `application/json` payload `{ "prompt": "..." }`.',
    howItIsFixed: 'Use the built-in Swagger UI at `http://127.0.0.1:8000/docs`, or use tools like cURL, Postman, or our live playground below.'
  }
];

export const REQUIREMENTS_TXT = `fastapi>=0.115.0
uvicorn[standard]>=0.32.0
google-genai>=0.1.1
python-dotenv>=1.0.1
pydantic>=2.9.0`;

export const DOTENV_TEMPLATE = `# Google Gemini API Key
# Get your key from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Optional model selection
MODEL_ID=gemini-2.5-flash`;

export const CLIENT_SNIPPETS = {
  curl: {
    get_root: `curl -X GET "http://127.0.0.1:8000/"`,
    chat: `curl -X POST "http://127.0.0.1:8000/chat" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Explain quantum computing in 2 sentences.", "system_instruction": "You are a concise physics professor."}'`,
    think: `curl -X POST "http://127.0.0.1:8000/think" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "A farmer has 17 sheep and all but 9 die. How many are left?", "system_instruction": "Analyze with step-by-step logic."}'`
  },
  python_requests: `import requests

BASE_URL = "http://127.0.0.1:8000"

# 1. Health check (GET /)
health = requests.get(f"{BASE_URL}/")
print("Health Check:", health.json())

# 2. Chat endpoint (POST /chat)
chat_res = requests.post(
    f"{BASE_URL}/chat",
    json={
        "prompt": "Hello! What are 3 healthy breakfast ideas?",
        "system_instruction": "You are a registered nutritionist."
    }
)
print("Chat Response:", chat_res.json()["response"])

# 3. Think endpoint (POST /think)
think_res = requests.post(
    f"{BASE_URL}/think",
    json={
        "prompt": "Solve this riddle: If 5 cats catch 5 mice in 5 minutes, how many cats catch 100 mice in 100 minutes?",
        "system_instruction": "Break down math problems step-by-step."
    }
)
print("Think Response:", think_res.json()["response"])`,
  python_httpx: `import httpx
import asyncio

async def test_api():
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        # GET /
        root_res = await client.get("/")
        print("Root Status:", root_res.status_code, root_res.json())

        # POST /chat
        chat_res = await client.post("/chat", json={
            "prompt": "Write a python function to check if a word is a palindrome.",
            "system_instruction": "Provide clean, commented code."
        })
        print("Chat Response:", chat_res.json()["response"])

        # POST /think
        think_res = await client.post("/think", json={
            "prompt": "Analyze the time complexity of quicksort vs mergesort.",
            "system_instruction": "Provide deep comparative computer science analysis."
        })
        print("Think Response:", think_res.json()["response"])

if __name__ == "__main__":
    asyncio.run(test_api())`,
  javascript_fetch: `// In JavaScript / TypeScript
async function queryAi() {
  const baseUrl = "http://127.0.0.1:8000";

  // Test root GET /
  const root = await fetch(\`\${baseUrl}/\`).then(res => res.json());
  console.log("Root:", root);

  // Test POST /chat
  const chatResponse = await fetch(\`\${baseUrl}/chat\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: "What is FastAPI and why is it popular?",
      system_instruction: "You are a technical educator."
    })
  });
  const chatData = await chatResponse.json();
  console.log("Chat:", chatData.response);
}

queryAi();`
};
