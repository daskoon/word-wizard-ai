
import React, { useState } from 'react';
import { VariantA } from '../variants/VariantA';
import { VariantB } from '../variants/VariantB';
import { VariantC } from '../variants/VariantC';
import { VariantD } from '../variants/VariantD';
import { VariantE } from '../variants/VariantE';

const variants = {
  A: VariantA,
  B: VariantB,
  C: VariantC,
  D: VariantD,
  E: VariantE,
};

export default function DesignLabPage() {
  const [current, setCurrent] = useState<keyof typeof variants>('A');
  const Component = variants[current];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-900 text-white font-sans">
      <aside className="w-64 border-r border-neutral-800 p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-indigo-400">Design Lab</h1>
          <p className="text-xs text-neutral-500 mt-1">WordWizard Refactor</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          {Object.keys(variants).map((key) => (
            <button
              key={key}
              onClick={() => setCurrent(key as any)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                current === key 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              Variant {key}
              <span className="block text-[10px] opacity-60 font-normal mt-0.5">
                {key === 'A' && 'Replica (Old Ver)'}
                {key === 'B' && 'Android Native'}
                {key === 'C' && 'Modern Hybrid'}
                {key === 'D' && 'Game Focus (Dark)'}
                {key === 'E' && 'High Contrast'}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-neutral-950 overflow-hidden relative flex items-center justify-center p-8">
        <div className="mockup-phone border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden rounded-[3rem] border-8 h-[800px] w-[400px] relative">
           <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 rounded-b-xl w-40 mx-auto"></div>
           <div className="h-full w-full bg-white overflow-y-auto">
             <Component />
           </div>
        </div>
      </main>
    </div>
  );
}
