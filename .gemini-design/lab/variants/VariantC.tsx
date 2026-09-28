
import React from 'react';
import { Camera, RefreshCw, Play, ChevronRight, Edit3, Shield } from 'lucide-react';

export const VariantC: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 flex flex-col">
      {/* Compact Header */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 h-12 flex items-center justify-between sticky top-0 z-50">
        <span className="font-black text-indigo-600 tracking-tight">WORDWIZARD</span>
        <div className="flex gap-4 text-xs font-bold text-slate-400">
           <span className="text-slate-900">Scan</span>
           <span>Verify</span>
           <span>Result</span>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        
        {/* Hero Upload Area */}
        <div className="flex-1 bg-white border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 min-h-[300px]">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center shadow-inner">
             <Camera size={32} className="text-slate-300" />
           </div>
           <button className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-black transition-transform active:scale-95">
             Upload Screenshot
           </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-between h-24">
              <Edit3 className="text-indigo-400" size={20}/>
              <span className="font-bold text-indigo-900 text-sm">Manual Entry</span>
           </div>
           <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-between h-24">
              <Shield className="text-emerald-400" size={20}/>
              <span className="font-bold text-emerald-900 text-sm">Dictionary Check</span>
           </div>
        </div>

      </main>
    </div>
  );
};
