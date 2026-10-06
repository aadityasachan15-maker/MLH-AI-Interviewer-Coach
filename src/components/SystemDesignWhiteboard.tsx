import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  ArrowRight, 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Globe, 
  Network,
  ShieldAlert
} from 'lucide-react';
import { WhiteboardComponent, WhiteboardConnection, WhiteboardCritique } from '../types';

const COMPONENT_PALETTE = [
  { type: 'client', label: 'Client (Web/Mobile)', icon: 'Globe', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
  { type: 'load_balancer', label: 'Load Balancer (Nginx/ALB)', icon: 'Network', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { type: 'api_gateway', label: 'API Gateway (Kong/Envoy)', icon: 'Server', color: 'bg-teal-500/20 text-teal-400 border-teal-500/40' },
  { type: 'service', label: 'Microservice Worker (Go/Java)', icon: 'Cpu', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
  { type: 'cache', label: 'Redis Cache Cluster', icon: 'HardDrive', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
  { type: 'database', label: 'PostgreSQL (Primary + Replica)', icon: 'Database', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  { type: 'queue', label: 'Kafka Message Queue', icon: 'Activity', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
];

export const SystemDesignWhiteboard: React.FC = () => {
  const [architectureName, setArchitectureName] = useState('Global URL Shortener & Analytics');
  const [explanation, setExplanation] = useState(
    'Traffic enters via geo-DNS and regional Load Balancers. The API gateway validates JWT tokens and routes to Go stateless services. Reads query the Redis cluster with 95% cache hit ratio. Writes publish to a Kafka topic for async database persistence to handle 50k RPS spikes.'
  );

  const [components, setComponents] = useState<WhiteboardComponent[]>([
    { id: '1', type: 'client', label: 'Client Apps (100k DAU)', x: 40, y: 40, icon: 'Globe', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    { id: '2', type: 'load_balancer', label: 'Regional Load Balancer', x: 260, y: 40, icon: 'Network', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { id: '3', type: 'service', label: 'URL Redirect Service (3 pods)', x: 480, y: 40, icon: 'Cpu', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
    { id: '4', type: 'cache', label: 'Redis Cache (LRU Eviction)', x: 700, y: 40, icon: 'HardDrive', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
    { id: '5', type: 'queue', label: 'Kafka Analytics Queue', x: 480, y: 160, icon: 'Activity', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
    { id: '6', type: 'database', label: 'PostgreSQL Primary (B-Tree index)', x: 700, y: 160, icon: 'Database', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
  ]);

  const [connections, setConnections] = useState<WhiteboardConnection[]>([
    { fromId: '1', toId: '2', label: 'HTTPS' },
    { fromId: '2', toId: '3', label: 'gRPC' },
    { fromId: '3', toId: '4', label: 'Read-through' },
    { fromId: '3', toId: '5', label: 'Async Publish' },
    { fromId: '5', toId: '6', label: 'Batch Ingestion' },
  ]);

  const [critique, setCritique] = useState<WhiteboardCritique | null>(null);
  const [loadingCritique, setLoadingCritique] = useState(false);

  const addComponent = (paletteItem: typeof COMPONENT_PALETTE[0]) => {
    const newComp: WhiteboardComponent = {
      id: Math.random().toString(36).substring(7),
      type: paletteItem.type,
      label: paletteItem.label,
      x: 100 + (components.length * 30) % 300,
      y: 80 + (components.length * 20) % 150,
      icon: paletteItem.icon,
      color: paletteItem.color
    };
    setComponents([...components, newComp]);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter((c) => c.id !== id));
    setConnections(connections.filter((c) => c.fromId !== id && c.toId !== id));
  };

  const handleCritique = async () => {
    setLoadingCritique(true);
    try {
      const res = await fetch('/api/interview/whiteboard-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          architecture_name: architectureName,
          components: components.map((c) => ({ type: c.type, label: c.label })),
          connections,
          explanation
        })
      });
      const data: WhiteboardCritique = await res.json();
      setCritique(data);
    } catch (err) {
      console.error('Failed to critique whiteboard:', err);
    } finally {
      setLoadingCritique(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              Interactive Architectural Co-Pilot
            </span>
            <span className="text-xs font-mono text-slate-500">Multimodal Design Critique</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            System Design Architecture Whiteboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real FAANG System Design rounds require sketching components while verbally defending concurrency, SPOF, and trade-offs. Design your architecture below and get an instant Staff Engineer evaluation.
          </p>
        </div>

        <button
          onClick={handleCritique}
          disabled={loadingCritique || components.length === 0}
          className="shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
        >
          {loadingCritique ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{loadingCritique ? 'Gemma 4 Analyzing Diagram...' : 'Critique Architecture with Gemma 4'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Canvas & Palette */}
        <div className="lg:col-span-8 space-y-4">
          {/* Component Palette Bar */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1 mr-2">
              Add Block:
            </span>
            {COMPONENT_PALETTE.map((item, idx) => (
              <button
                key={idx}
                onClick={() => addComponent(item)}
                className="shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all hover:scale-105"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>{item.label.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Interactive Canvas Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl relative min-h-[380px] overflow-hidden flex flex-col justify-between">
            {/* Canvas grid background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-400">
                  Canvas Architecture Graph ({components.length} nodes, {connections.length} links)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Click × to remove node</span>
            </div>

            {/* Rendered Nodes on Canvas */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {components.map((comp) => (
                <div
                  key={comp.id}
                  className={`p-3 rounded-xl border ${comp.color} shadow-lg backdrop-blur-sm flex items-start justify-between gap-2 transition-all hover:ring-1 hover:ring-emerald-400/50`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">
                      {comp.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100">{comp.label}</h4>
                  </div>
                  <button
                    onClick={() => removeComponent(comp.id)}
                    className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                    title="Remove component"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Data Flow Summary Bar */}
            <div className="relative z-10 mt-6 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="font-bold text-slate-500">Data Pipeline:</span>
              {connections.map((conn, idx) => {
                const fromNode = components.find((c) => c.id === conn.fromId);
                const toNode = components.find((c) => c.id === conn.toId);
                return (
                  <div key={idx} className="flex items-center space-x-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-[11px]">
                    <span className="text-slate-300">{fromNode?.label.split('(')[0] || 'Node'}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                    <span className="text-slate-300">{toNode?.label.split('(')[0] || 'Node'}</span>
                    {conn.label && <span className="text-slate-500 text-[10px]">({conn.label})</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidate Explanation Textarea */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Your Architectural Explanation & Concurrency Defense</span>
              <span className="text-[11px] text-slate-500">Evaluated by Gemma 4</span>
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans leading-relaxed"
              placeholder="Explain how traffic flows, how you prevent cache stampedes, failover replicas, and handle network partitions..."
            />
          </div>
        </div>

        {/* Right Column: Gemma 4 Architecture Critique Report */}
        <div className="lg:col-span-4 space-y-5">
          {critique ? (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Gemma 4 Architecture Review
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-400">Score:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Grade {critique.architectureGrade} ({critique.scalabilityScore}/100)
                  </span>
                </div>
              </div>

              {/* Staff Engineer Critique */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  Staff Architect Assessment:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                  "{critique.staffEngineerCritique}"
                </p>
              </div>

              {/* Single Point of Failure (SPOF) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Single Point of Failure (SPOF):</span>
                </span>
                <ul className="space-y-1 text-xs text-rose-200/90 font-mono">
                  {critique.singlePointOfFailure.map((spof, idx) => (
                    <li key={idx} className="bg-rose-950/20 p-2 rounded border border-rose-900/30">
                      ⚠️ {spof}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Identified Bottlenecks */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Identified Bottlenecks:</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-300 font-mono">
                  {critique.identifiedBottlenecks.map((btn, idx) => (
                    <li key={idx} className="bg-slate-950 p-2 rounded border border-slate-800">
                      • {btn}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Optimizations */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Recommended Optimizations:</span>
                </span>
                <ul className="space-y-1 text-xs text-emerald-200/90 font-mono">
                  {critique.recommendedOptimizations.map((opt, idx) => (
                    <li key={idx} className="bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                      ✓ {opt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Why This Whiteboard is Unique</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Existing mock interview platforms only support audio or text. They can never evaluate how you decompose systems visually.
              </p>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold">Real-time SPOF Detection</span>
                  <p className="text-slate-400 text-[11px]">Detects un-replicated load balancers or single database masters.</p>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-indigo-400 font-bold">Cache Invalidation Flaws</span>
                  <p className="text-slate-400 text-[11px]">Flags race conditions between concurrent DB writes and cache deletes.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
