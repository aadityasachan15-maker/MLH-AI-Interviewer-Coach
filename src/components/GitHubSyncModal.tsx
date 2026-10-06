import React, { useState } from 'react';
import { 
  Github, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Terminal, 
  X, 
  Key,
  ShieldCheck,
  Send,
  RefreshCw,
  FolderArchive,
  ExternalLink
} from 'lucide-react';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose }) => {
  const [activeMethod, setActiveMethod] = useState<'zip' | 'direct' | 'terminal'>('zip');
  const [repoUrl, setRepoUrl] = useState('https://github.com/aadityasachan15/interview-coach-ai.git');
  const [githubToken, setGithubToken] = useState('');
  const [commitMessage, setCommitMessage] = useState('feat: Complete GemmaCoach AI Interview Coach fullstack platform');
  
  // States for direct push
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string } | null>(null);

  // States for copied scripts
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedFixScript, setCopiedFixScript] = useState(false);

  if (!isOpen) return null;

  const sanitizedUrl = repoUrl.trim().replace(/['"]/g, '');

  const syncScript = `# 1. Go to your project directory
git branch -M main

# 2. Remove any old or broken remote
git remote remove origin 2>/dev/null || true

# 3. Add your clean repository URL (WITHOUT single quotes)
git remote add origin ${sanitizedUrl || 'https://github.com/aadityasachan15/YOUR_REPO_NAME.git'}

# 4. Stage and commit all files
git add .
git commit -m "${commitMessage}" || true

# 5. Push directly to GitHub
git push -u origin main --force`;

  const windowsFixSnippet = `# Windows PowerShell / CMD Clean Push:
git branch -M main
git remote remove origin
git remote add origin ${sanitizedUrl || 'https://github.com/aadityasachan15/YOUR_REPO_NAME.git'}
git push -u origin main`;

  const handleCopy = async (text: string, isFix: boolean) => {
    await navigator.clipboard.writeText(text);
    if (isFix) {
      setCopiedFixScript(true);
      setTimeout(() => setCopiedFixScript(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleDirectPush = async () => {
    if (!sanitizedUrl) return;
    setIsPushing(true);
    setPushResult(null);

    try {
      const res = await fetch('/api/github/direct-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: sanitizedUrl,
          githubToken: githubToken.trim(),
          commitMessage: commitMessage.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPushResult({
          success: true,
          message: data.message || 'All project files successfully pushed to your GitHub repository on branch main!'
        });
      } else {
        setPushResult({
          success: false,
          message: data.error || data.detail || 'Push failed. Please check your GitHub token and repository URL.'
        });
      }
    } catch (err: any) {
      setPushResult({
        success: false,
        message: err.message || 'Network error while attempting GitHub push.'
      });
    } finally {
      setIsPushing(false);
    }
  };

  const handleDownloadZip = () => {
    window.location.href = '/api/project/download-zip';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col scrollbar-thin scrollbar-thumb-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
              <Github className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Sync Project Files to GitHub</span>
              </h3>
              <p className="text-xs text-slate-400">
                Download all files as ZIP or push directly to your repository
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="px-6 pt-4 border-b border-slate-800 bg-slate-900/40 flex items-center space-x-2">
          <button
            onClick={() => setActiveMethod('zip')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeMethod === 'zip'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>1. Download Full Project (ZIP)</span>
          </button>

          <button
            onClick={() => setActiveMethod('direct')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeMethod === 'direct'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>2. Direct In-App Push</span>
          </button>

          <button
            onClick={() => setActiveMethod('terminal')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              activeMethod === 'terminal'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>3. Terminal Commands</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* TAB 1: 1-CLICK ZIP DOWNLOAD */}
          {activeMethod === 'zip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <FolderArchive className="w-5 h-5" />
                  <span>Instant Full Codebase Download (No Git Commands Needed)</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Aap bina kisi terminal ya GitHub token ke directly poori project files ko ek single <strong>ZIP archive</strong> mein download kar sakte hain. Isme aapka:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 font-mono text-[11px] pl-1">
                  <li>React + Tailwind frontend (All components, whiteboard, studio, drills)</li>
                  <li>Python FastAPI backend (<code>backend/main.py</code>, <code>backend/gemma_engine.py</code>)</li>
                  <li>Dependencies & configs (<code>package.json</code>, <code>requirements.txt</code>, <code>vite.config.ts</code>)</li>
                </ul>

                <button
                  onClick={handleDownloadZip}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download interview-coach-fullstack.zip (1-Click)</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-slate-400">
                <span className="font-bold text-slate-300 block">How to push to GitHub after downloading:</span>
                <p className="text-[11px]">
                  1. ZIP ko apne laptop par extract karein.<br />
                  2. GitHub par naya repository banayein aur files ko direct drag-and-drop karke commit kar dein!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT IN-APP GITHUB PUSH */}
          {activeMethod === 'direct' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-slate-300 space-y-1">
                <span className="font-bold text-indigo-400 block text-xs">Direct Server-Side Git Push</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Enter your GitHub Repository URL and a Personal Access Token. Our server will execute the git push directly to your GitHub repository on the <code>main</code> branch!
                </p>
              </div>

              {/* Repo URL */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  GitHub Repository URL:
                </label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/aadityasachan15/interview-coach-ai.git"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* GitHub Token */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                    GitHub Personal Access Token (PAT):
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 text-[11px] hover:underline flex items-center space-x-1"
                  >
                    <span>Generate token on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Requires 'repo' permission)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Push Result Alert */}
              {pushResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    pushResult.success
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold mb-1">
                    {pushResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{pushResult.success ? 'Success!' : 'Push Error'}</span>
                  </div>
                  <p className="font-mono text-[11px] whitespace-pre-wrap">{pushResult.message}</p>
                </div>
              )}

              {/* Push Trigger Button */}
              <button
                onClick={handleDirectPush}
                disabled={isPushing || !sanitizedUrl}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-40"
              >
                {isPushing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Pushing All Files to GitHub...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    <span>Push to My GitHub Repository Now</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: TERMINAL COMMANDS */}
          {activeMethod === 'terminal' && (
            <div className="space-y-4">
              {/* Explanation of "Invalid Argument" */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                <span className="text-rose-400 font-bold text-xs flex items-center space-x-1.5 uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Fixing "fatal: invalid argument" on Windows:</span>
                </span>
                <p className="text-rose-200/90 text-xs leading-relaxed">
                  Windows PowerShell / CMD mein single quotes <code>'https://...'</code> use karne se invalid argument error aata hai. Neeche diye gaye commands mein quotes remove kar diye gaye hain.
                </p>
              </div>

              {/* Command block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                    Run in your project directory:
                  </span>
                  <button
                    onClick={() => handleCopy(syncScript, false)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center space-x-1"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied' : 'Copy All Commands'}</span>
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                  {syncScript}
                </pre>
              </div>

              {/* Windows CMD Quick fix */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-[11px] font-mono">
                    Windows CMD Quick Fix:
                  </span>
                  <button
                    onClick={() => handleCopy(windowsFixSnippet, true)}
                    className="text-xs text-slate-400 hover:text-slate-200 font-mono flex items-center space-x-1"
                  >
                    {copiedFixScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFixScript ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                  {windowsFixSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Fullstack: React + FastAPI + Gemma 4 Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
