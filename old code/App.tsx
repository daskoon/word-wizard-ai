
import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Wand2, Edit3, ChevronRight, AlertCircle, Loader2, Play } from 'lucide-react';
import RackInput from './components/RackInput';
import MoveResult from './components/MoveResult';
import StrategyCard from './components/StrategyCard';
import BoardGrid from './components/BoardGrid';
import { scanFullScreenshot, solveBoardStream } from './services/geminiService';
import { AnalysisResult, GameMode, BoardState, MoveSuggestion } from './types';

// Optimize image for AI consumption (Grayscale + Resize)
// This happens instantly on the client CPU and saves seconds of upload/processing time.
const processImageForAI = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const MAX_WIDTH = 800; // 800px is sufficient for OCR, much faster than 4k
      const scale = MAX_WIDTH / img.width;
      const width = MAX_WIDTH;
      const height = img.height * scale;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = 'grayscale(100%) contrast(1.2)'; // Help the AI see better
        ctx.drawImage(img, 0, 0, width, height);
        // Low quality JPEG is fine for text, fast upload
        resolve(canvas.toDataURL('image/jpeg', 0.6)); 
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<'image' | 'manual'>('image');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [manualBoard, setManualBoard] = useState<BoardState>({});
  const [rack, setRack] = useState<string>('');
  const [mode, setMode] = useState<GameMode>(GameMode.MAX_SCORE);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'ready_to_solve' | 'thinking' | 'complete'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [highlightMove, setHighlightMove] = useState<MoveSuggestion | undefined>(undefined);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Immediate UI Feedback
      const rawReader = new FileReader();
      rawReader.onload = () => setUploadedImage(rawReader.result as string);
      rawReader.readAsDataURL(file);

      setStatus('scanning');
      setResult(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // 2. Client-Side Optimization (The real speed boost)
          const optimizedBase64 = await processImageForAI(reader.result as string);
          const base64Data = optimizedBase64.split(',')[1];

          // 3. Compact Request
          const visionResult = await scanFullScreenshot(base64Data);
          
          setManualBoard(visionResult.board);
          setRack(visionResult.rack);
          setInputMode('manual');
          setStatus('ready_to_solve');
        } catch (err: any) {
          setError("Could not read board. Please try again or edit manually.");
          setStatus('ready_to_solve');
          setInputMode('manual');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (rack.length === 0) {
      setError("Please enter your rack tiles.");
      return;
    }
    setStatus('thinking');
    setError(null);
    try {
      const analysis = await solveBoardStream(manualBoard, rack, mode, () => {});
      setResult(analysis);
      setHighlightMove(analysis.best);
      setStatus('complete');
    } catch (err: any) {
      setError("Analysis failed. Please check the board for validity.");
      setStatus('ready_to_solve');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans overflow-x-hidden text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">W</div>
          <span className="font-bold tracking-tight">WordWizard</span>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 text-slate-400 hover:text-black transition-colors">
          <RefreshCw size={18} />
        </button>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 space-y-6">
        
        {/* Status Bar */}
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
          <span className={status === 'idle' ? "text-black" : ""}>1. Upload</span>
          <ChevronRight size={14} />
          <span className={status === 'scanning' || status === 'ready_to_solve' ? "text-black" : ""}>2. Verify</span>
          <ChevronRight size={14} />
          <span className={status === 'thinking' || status === 'complete' ? "text-indigo-600" : ""}>3. Solve</span>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-6">
          {inputMode === 'image' && !uploadedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl h-48 flex flex-col items-center justify-center gap-3 hover:border-indigo-500 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <Camera size={24} />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700">Tap to Scan Board</p>
                <p className="text-xs text-slate-400 mt-1">Supports 11x11 Solo Board</p>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Edit3 size={16} className="text-indigo-600"/> 
                  {status === 'scanning' ? 'Processing Image...' : 'Verify Board'}
                </h2>
                <button 
                  onClick={() => {setUploadedImage(null); setInputMode('image'); setStatus('idle'); setManualBoard({}); setRack('');}}
                  className="text-xs font-bold text-slate-400 hover:text-red-600"
                >
                  Start Over
                </button>
              </div>

              {/* Show original image overlay while scanning */}
              {status === 'scanning' && uploadedImage && (
                 <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                   <img src={uploadedImage} className="w-full h-full object-cover opacity-50 blur-sm" alt="Scanning" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-xl">
                        <Loader2 size={14} className="animate-spin" /> Extracting Tiles...
                      </div>
                   </div>
                 </div>
              )}

              {/* Show Grid once ready */}
              {status !== 'scanning' && (
                <BoardGrid 
                  boardState={manualBoard} 
                  onChange={setManualBoard} 
                  highlightMove={highlightMove} 
                />
              )}
              
              <RackInput value={rack} onChange={setRack} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <select 
                   value={mode} 
                   onChange={(e) => setMode(e.target.value as GameMode)} 
                   className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500"
                 >
                    <option value={GameMode.MAX_SCORE}>Max Score</option>
                    <option value={GameMode.DEFENSIVE}>Defensive</option>
                    <option value={GameMode.BINGO}>Bingo</option>
                 </select>
                 <button 
                   onClick={handleSolve} 
                   disabled={status !== 'ready_to_solve'}
                   className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                 >
                   {status === 'thinking' ? <Loader2 className="animate-spin" size={18}/> : <Play size={18} fill="currentColor"/>}
                   {status === 'thinking' ? 'Analyzing...' : 'Solve'}
                 </button>
              </div>
            </div>
          )}
        </section>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {result && status === 'complete' && (
          <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <MoveResult move={result.best} isBest onViewOnBoard={() => setHighlightMove(result.best)} />
            <StrategyCard analysis={result} />
            {result.alternatives?.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alternatives</h3>
                {result.alternatives.map((alt, i) => (
                  <MoveResult key={i} move={alt} onViewOnBoard={() => setHighlightMove(alt)} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
