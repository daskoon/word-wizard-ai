
import React from 'react';
import { Camera, RefreshCw, Play, MoreVertical, Menu, Wand2 } from 'lucide-react';

export const VariantB: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-24">
      {/* Android Top Bar */}
      <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <Menu size={24} />
          <span className="font-bold text-lg">WordWizard</span>
        </div>
        <MoreVertical size={24} />
      </div>

      <main className="p-4 space-y-4">
        
        {/* Card Style Upload */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
             <Camera size={24} />
           </div>
           <div className="flex-1">
             <h3 className="font-bold text-slate-800">New Game</h3>
             <p className="text-sm text-slate-500">Scan screenshot</p>
           </div>
        </div>

        {/* Board Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
           <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <span className="font-bold text-sm text-slate-600">Board State</span>
             <span className="text-xs text-indigo-600 font-medium">Edit</span>
           </div>
           <div className="p-2">
              <div className="aspect-square bg-amber-100 rounded grid grid-cols-11 gap-[1px] border border-amber-200">
                 {/* Mock Grid */}
                 {Array.from({ length: 121 }).map((_, i) => <div key={i} className="bg-white/80"></div>)}
              </div>
           </div>
        </div>

        {/* Rack Card */}
        <div className="bg-white rounded-lg shadow p-4">
           <span className="font-bold text-sm text-slate-600 mb-2 block">Rack</span>
           <div className="flex justify-between bg-slate-100 p-2 rounded">
              <span className="font-mono text-xl tracking-widest text-slate-800">ABCDEFG</span>
           </div>
        </div>

      </main>

      {/* FAB */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-transform">
        <Wand2 size={24} />
      </button>
    </div>
  );
};
