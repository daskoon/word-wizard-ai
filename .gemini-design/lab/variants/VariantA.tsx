
import React from 'react';
import { Camera, RefreshCw, AlertCircle, Loader2, Play, ChevronRight, Edit3 } from 'lucide-react';

export const VariantA: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">W</div>
          <span className="font-bold tracking-tight">WordWizard</span>
        </div>
        <button className="p-2 text-slate-400 hover:text-black transition-colors">
          <RefreshCw size={18} />
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Status Bar */}
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
          <span className="text-black">1. Upload</span>
          <ChevronRight size={14} />
          <span>2. Verify</span>
          <ChevronRight size={14} />
          <span>3. Solve</span>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:border-indigo-500 transition-all group">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Camera size={28} />
          </div>
          <div>
            <p className="font-bold text-slate-700">Tap to Scan Board</p>
            <p className="text-xs text-slate-400 mt-1">Supports 11x11 Solo Board</p>
          </div>
        </div>

        {/* Mock Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
           <div className="aspect-square bg-slate-100 rounded-xl grid grid-cols-11 gap-[1px] p-[1px]">
              {Array.from({ length: 121 }).map((_, i) => (
                <div key={i} className={`bg-white rounded-sm ${i === 60 ? 'bg-indigo-600 text-white flex items-center justify-center font-bold text-xs' : ''}`}>
                  {i === 60 && '★'}
                </div>
              ))}
           </div>
        </div>

        {/* Rack Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Rack</label>
           <div className="flex gap-2">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((char, i) => (
                <div key={i} className="flex-1 aspect-square bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-sm">
                  {char}
                </div>
              ))}
           </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          <Play size={20} fill="currentColor"/> Find Best Move
        </button>

      </main>
    </div>
  );
};
