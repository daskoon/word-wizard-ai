
import React from 'react';
import { Camera, Play } from 'lucide-react';

export const VariantE: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-mono text-black pb-20 border-8 border-black">
      {/* High Contrast / Brutalist */}
      <header className="border-b-4 border-black px-4 h-16 flex items-center justify-between bg-yellow-300">
        <span className="font-black text-2xl tracking-tighter">WIZARD.AI</span>
      </header>

      <main className="p-4 space-y-8">
        
        <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white p-8 flex flex-col items-center gap-4 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
           <Camera size={48} strokeWidth={3} />
           <span className="font-bold text-lg uppercase">Scan Board</span>
        </div>

        <div className="space-y-2">
           <label className="font-bold uppercase bg-black text-white px-2 py-1 inline-block">Grid Preview</label>
           <div className="aspect-square border-4 border-black grid grid-cols-11 bg-slate-100">
              {/* Grid Lines */}
           </div>
        </div>

        <button className="w-full py-4 bg-indigo-600 text-white font-black text-xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
           CALCULATE
        </button>

      </main>
    </div>
  );
};
