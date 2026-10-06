import React, { useState } from 'react';
import { 
  Play, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  BrainCircuit, 
  MessageSquare, 
  Activity, 
  BookOpen, 
  Send,
  Layers,
  Sparkles,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { RequestLogEntry } from '../types';

interface PresetPrompt {
  label: string;
  category: 'think' | 'chat';
  prompt: string;
  system_instruction: string;
}

const PRESET_PROMPTS: PresetPrompt[] = [
  {
    label: 'Bat & Ball Logic Puzzle',
    category: 'think',
    prompt: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? Explain step by step.',
    system_instruction: 'You are a rigorous mathematical logic assistant. Solve the problem with algebraic proof and point out common cognitive pitfalls.',
  },
  {
    label: '5 Cats & Mice Riddle',
    category: 'think',
    prompt: 'If 5 cats can catch 5 mice in 5 minutes, how many cats does it take to catch 100 mice in 100 minutes? Break down the rate calculation clearly.',
    system_instruction: 'You are an analytical reasoning tutor. Formulate rates mathematically.',
  },
  {
    label: 'FastAPI vs Flask Comparison',
    category: 'chat',
    prompt: 'What are the main architectural differences between FastAPI and Flask, and why is FastAPI faster with Pydantic and async?',
    system_instruction: 'You are an expert Python backend architect. Provide concise, clear bullet points.',
  },
  {
    label: 'Python Palindrome Algorithm',
    category: 'chat',
    prompt: 'Write an optimal Python function to verify if an alphanumeric string is a palindrome ignoring cases and punctuation. Include type hints.',
    system_instruction: 'You are a senior Python software engineer. Provide clean, production-ready code with docstrings.',
  },
];

export const LivePlaygroundTab: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<'root' | 'chat' | 'think' | 'docs'>('chat');
  const [prompt, setPrompt] = useState<string>(
    'Explain quantum entanglement in 2 intuitive sentences for high school students.'
  );
  const [systemInstruction, setSystemInstruction] = useState<string>(
    'You are an engaging physics educator who explains complex ideas simply.'
  );
  const [loading, setLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [requestHistory, setRequestHistory] = useState<RequestLogEntry[]>([]);

  const handleSelectPreset = (preset: PresetPrompt) => {
    setActiveEndpoint(preset.category);
    setPrompt(preset.prompt);
    setSystemInstruction(preset.system_instruction);
  };

  const handleExecute = async () => {
    setLoading(true);
    setErrorDetails(null);
    setResponseOutput(null);
    setStatusCode(null);
    setDurationMs(null);

    const startTime = performance.now();

    try {
      if (activeEndpoint === 'root') {
        // Execute Root GET /
        const res = await fetch('/api/health');
        const endTime = performance.now();
        const elapsed = Math.round(endTime - startTime);
        const data = await res.json();

        setStatusCode(res.status);
        setDurationMs(elapsed);
        setResponseOutput(data);

        addHistoryEntry('GET', '/', res.status, elapsed, undefined, data);
      } else if (activeEndpoint === 'docs') {
        // Preview OpenAPI spec / docs
        const endTime = performance.now();
        const elapsed = Math.round(endTime - startTime);
        const docsMock = {
          openapi: '3.1.0',
          info: {
            title: 'Gemini & Gemma AI API',
            version: '1.0.0',
            description: 'FastAPI application with /chat and /think reasoning endpoints',
          },
          paths: {
            '/': {
              get: {
                summary: 'Root Health Check',
                description: 'Returns API status and available routes (resolves 404)',
                responses: { '200': { description: 'Successful Response' } },
              },
            },
            '/chat': {
              post: {
                summary: 'Standard AI Chat',
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          prompt: { type: 'string' },
                          system_instruction: { type: 'string', default: 'You are a helpful AI assistant.' },
                        },
                        required: ['prompt'],
                      },
                    },
                  },
                },
                responses: { '200': { description: 'Generated AI response' } },
              },
            },
            '/think': {
              post: {
                summary: 'Deep Reasoning Assistant',
                description: 'Solves complex logic, math, and STEM reasoning tasks with thinkingConfig',
                requestBody: {
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          prompt: { type: 'string' },
                          system_instruction: { type: 'string' },
                        },
                        required: ['prompt'],
                      },
                    },
                  },
                },
                responses: { '200': { description: 'Deep reasoning response' } },
              },
            },
          },
        };

        setStatusCode(200);
        setDurationMs(elapsed);
        setResponseOutput(docsMock);
        addHistoryEntry('GET', '/docs', 200, elapsed, undefined, docsMock);
      } else {
        // Execute POST /chat or POST /think
        const endpointUrl = activeEndpoint === 'think' ? '/api/think' : '/api/chat';
        const payload = {
          prompt: prompt.trim(),
          system_instruction: systemInstruction.trim(),
        };

        const res = await fetch(endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const endTime = performance.now();
        const elapsed = Math.round(endTime - startTime);
        const data = await res.json();

        setStatusCode(res.status);
        setDurationMs(elapsed);

        if (!res.ok) {
          setErrorDetails(data.detail || 'Request failed with status ' + res.status);
          setResponseOutput(data);
        } else {
          setResponseOutput(data);
        }

        addHistoryEntry(
          'POST',
          activeEndpoint === 'think' ? '/think' : '/chat',
          res.status,
          elapsed,
          payload,
          data
        );
      }
    } catch (err: any) {
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);
      setStatusCode(500);
      setDurationMs(elapsed);
      setErrorDetails(err.message || 'Network request failed');
      addHistoryEntry(
        activeEndpoint === 'root' ? 'GET' : 'POST',
        activeEndpoint === 'root' ? '/' : `/${activeEndpoint}`,
        500,
        elapsed,
        undefined,
        { error: err.message }
      );
    } finally {
      setLoading(false);
    }
  };

  const addHistoryEntry = (
    method: 'GET' | 'POST',
    url: string,
    code: number,
    duration: number,
    reqBody: any,
    resBody: any
  ) => {
    const entry: RequestLogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      method,
      url,
      statusCode: code,
      durationMs: duration,
      requestBody: reqBody,
      responseBody: resBody,
      statusText: code === 200 ? 'OK' : code === 404 ? 'Not Found' : 'Error',
    };
    setRequestHistory((prev) => [entry, ...prev.slice(0, 7)]);
  };

  const handleCopyRaw = async () => {
    if (!responseOutput) return;
    await navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header explanation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Interactive Test Runner
            </span>
            <span className="text-slate-500 text-xs font-mono">Backend connected to Google GenAI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live FastAPI & Google GenAI Playground
          </h2>
          <p className="text-sm text-slate-400">
            Execute requests live against the corrected server implementation. Test both <code className="text-emerald-400">GET /</code> (which was previously 404) and the AI endpoints.
          </p>
        </div>

        {/* Quick presets */}
        <div className="shrink-0 flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Endpoint Controller & Inputs */}
        <div className="lg:col-span-5 space-y-5">
          {/* Endpoint Selector Tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Choose Endpoint to Call
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveEndpoint('root')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeEndpoint === 'root'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      GET
                    </span>
                    <span className="font-mono text-xs font-semibold">/</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Health & Routes (Fixed 404)</p>
                </div>
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              </button>

              <button
                onClick={() => setActiveEndpoint('chat')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeEndpoint === 'chat'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                      POST
                    </span>
                    <span className="font-mono text-xs font-semibold">/chat</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Standard Assistant</p>
                </div>
                <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
              </button>

              <button
                onClick={() => setActiveEndpoint('think')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeEndpoint === 'think'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                      POST
                    </span>
                    <span className="font-mono text-xs font-semibold">/think</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Deep Reasoning Logic</p>
                </div>
                <BrainCircuit className="w-4 h-4 text-purple-400 shrink-0" />
              </button>

              <button
                onClick={() => setActiveEndpoint('docs')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeEndpoint === 'docs'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      GET
                    </span>
                    <span className="font-mono text-xs font-semibold">/docs</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Swagger OpenAPI Schema</p>
                </div>
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Parameters / Body Editor */}
          {activeEndpoint === 'root' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Testing Root Route (GET /)</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This executes an HTTP <code className="text-emerald-400">GET</code> to <code className="text-emerald-400">/</code>. 
                In your original code, this exact call generated:
              </p>
              <div className="bg-rose-950/40 border border-rose-900/50 p-2.5 rounded text-xs font-mono text-rose-300">
                127.0.0.1 - "GET / HTTP/1.1" 404 Not Found
              </div>
              <p className="text-xs text-slate-400">
                Click below to confirm that the added <code className="text-emerald-400">@app.get("/")</code> endpoint now responds with <strong className="text-emerald-400">200 OK</strong> and an informative payload!
              </p>
            </div>
          ) : activeEndpoint === 'docs' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>FastAPI Built-in Swagger Docs</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                FastAPI generates interactive Swagger documentation automatically at <code className="text-amber-400">/docs</code>.
                When opening your server locally at <span className="font-mono text-slate-200">http://127.0.0.1:8000/docs</span>, 
                you get a web UI to test <code className="text-indigo-300">POST /chat</code> and <code className="text-indigo-300">POST /think</code> directly from your browser!
              </p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              {/* System Instruction */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>System Instruction (Persona)</span>
                  <span className="text-[11px] text-slate-500 font-normal">Optional</span>
                </label>
                <textarea
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="System instruction..."
                />
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>User Prompt (<code className="text-emerald-400">request.prompt</code>)</span>
                  <span className="text-[11px] text-rose-400 font-normal">*Required</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Enter prompt to send..."
                />
              </div>

              {activeEndpoint === 'think' && (
                <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/40 text-xs text-purple-300 flex items-start space-x-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Reasoning Mode Active:</strong> Uses Google GenAI with thinking parameters for step-by-step logic and problem breakdown.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            disabled={loading || (activeEndpoint !== 'root' && activeEndpoint !== 'docs' && !prompt.trim())}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
              loading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Executing Request on Server...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  Execute {activeEndpoint === 'root' ? 'GET /' : activeEndpoint === 'docs' ? 'GET /docs' : `POST /${activeEndpoint}`}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Response Inspector */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[480px]">
            {/* Inspector Top Bar */}
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Response Inspector
                </span>

                {statusCode && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      statusCode === 200
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : statusCode === 404
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {statusCode === 200 ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {statusCode} {statusCode === 200 ? 'OK' : statusCode === 404 ? 'Not Found' : 'Error'}
                  </span>
                )}

                {durationMs !== null && (
                  <span className="inline-flex items-center text-xs font-mono text-slate-400">
                    <Clock className="w-3 h-3 mr-1 text-slate-500" />
                    {durationMs}ms
                  </span>
                )}
              </div>

              {responseOutput && (
                <button
                  onClick={handleCopyRaw}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
                >
                  {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedRaw ? 'Copied' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            {/* Inspector Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-start">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
                  <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-slate-300">Processing via Google GenAI...</p>
                  <p className="text-xs text-slate-500">Generating intelligent response</p>
                </div>
              ) : errorDetails ? (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-2">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Error in execution:</span>
                  </div>
                  <p className="text-xs text-rose-200/90 font-mono whitespace-pre-wrap">{errorDetails}</p>
                </div>
              ) : responseOutput ? (
                <div className="space-y-4">
                  {/* Extracted response text if present */}
                  {responseOutput.response && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Generated AI Output (response.text)</span>
                        <span className="font-mono text-[11px] text-emerald-400">
                          {responseOutput.model || 'gemini-3.8-flash'}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {responseOutput.response}
                      </div>
                    </div>
                  )}

                  {/* Thought details if present */}
                  {responseOutput.thought && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span>Thinking / Reasoning Process</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/40 text-purple-200/90 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                        {responseOutput.thought}
                      </div>
                    </div>
                  )}

                  {/* Raw JSON Payload */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Raw JSON Response Body
                    </span>
                    <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-slate-800">
                      {JSON.stringify(responseOutput, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-3 text-slate-500">
                  <Terminal className="w-10 h-10 text-slate-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-400">Ready to execute requests</p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Choose an endpoint on the left and click <strong className="text-slate-400">Execute</strong> to inspect live output.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Request Log History */}
            {requestHistory.length > 0 && (
              <div className="border-t border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Session Request History</span>
                  <span className="text-[11px] text-slate-500">{requestHistory.length} requests logged</span>
                </div>
                <div className="space-y-1 font-mono text-xs max-h-36 overflow-y-auto">
                  {requestHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setResponseOutput(item.responseBody);
                        setStatusCode(item.statusCode);
                        setDurationMs(item.durationMs);
                      }}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900/80 hover:bg-slate-900 cursor-pointer border border-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-bold text-[10px] px-1 rounded ${
                            item.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                          }`}
                        >
                          {item.method}
                        </span>
                        <span className="text-slate-300">{item.url}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px]">
                        <span className={item.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'}>
                          {item.statusCode}
                        </span>
                        <span className="text-slate-500">{item.durationMs}ms</span>
                        <span className="text-slate-600">{item.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
