
import React from 'react';
import { Camera, RefreshCw, Play, Trophy, Star } from 'lucide-react';

export const VariantD: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 pb-20">
      {/* Dark Game Focus */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-white tracking-wider">WIZARD</span>
        <div className="px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-bold">PRO MODE</div>
      </header>

      <main className="p-4 space-y-6">
        
        {/* The Board (Dark Theme) */}
        <div className="aspect-square bg-slate-800 rounded-lg border border-slate-700 p-1 relative shadow-2xl">
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center opacity-30">
                <Camera size={48} className="mx-auto mb-2"/>
                <p className="font-bold text-sm">Drop Image Here</p>
              </div>
           </div>
           <div className="w-full h-full grid grid-cols-11 gap-[1px] opacity-20">
              {Array.from({ length: 121 }).map((_, i) => <div key={i} className="bg-slate-700"></div>)}
           </div>
        </div>

        {/* Controls (Light Sheet) */}
        <div className="bg-slate-100 rounded-t-3xl p-6 -mx-4 -mb-20 min-h-[300px] text-slate-900">
           <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6"></div>
           
           <div className="flex justify-between items-end mb-4">
             <h2 className="text-xl font-black">Analysis</h2>
             <span className="text-xs font-bold text-slate-400">READY</span>
           </div>

           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Best Move</span>
                <span className="text-indigo-600 font-black text-xl">42 pts</span>
              </div>
              <div className="flex gap-1">
                 {['Q', 'U', 'I', 'Z'].map((l, i) => (
                   <div key={i} className="w-8 h-8 bg-amber-100 border border-amber-300 rounded flex items-center justify-center font-bold text-amber-900 shadow-sm">{l}</div>
                 ))}
              </div>
           </div>

           <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
             Solve Board
           </button>
        </div>

      </main>
    </div>
  );
};
