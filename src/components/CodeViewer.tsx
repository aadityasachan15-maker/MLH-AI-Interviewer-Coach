import React, { useState } from 'react';
import { Check, Copy, Download, Code2 } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: string;
  title?: string;
  filename?: string;
  highlightLines?: number[];
  className?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language = 'python',
  title,
  filename,
  highlightLines = [],
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'script.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = code.split('\n');

  return (
    <div className={`rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col font-mono text-sm ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">{title || filename || language}</span>
          <span className="text-slate-500 text-[11px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
            {lines.length} lines
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {filename && (
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto p-4 max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <pre className="text-slate-300 font-mono text-[13px] leading-relaxed select-text">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightLines.includes(lineNum);
            return (
              <div
                key={idx}
                className={`flex hover:bg-slate-900/60 -mx-4 px-4 py-0.5 transition-colors ${
                  isHighlighted ? 'bg-amber-500/15 border-l-2 border-amber-400' : ''
                }`}
              >
                <span className="w-9 shrink-0 select-none text-slate-600 text-right pr-4 text-xs font-mono">
                  {lineNum}
                </span>
                <span className="flex-1 whitespace-pre">{line || ' '}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};
