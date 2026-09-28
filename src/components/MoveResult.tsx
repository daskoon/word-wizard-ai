
import React, { useState } from 'react';
import type { MoveSuggestion } from '../types';
import Tile from './Tile';
import { Trophy, ArrowRight, Star, ChevronDown, List, Eye, MapPin } from 'lucide-react';

interface MoveResultProps {
  move: MoveSuggestion;
  isBest?: boolean;
  onViewOnBoard: () => void;
}

const MoveResult: React.FC<MoveResultProps> = ({ move, isBest = false, onViewOnBoard }) => {
  const [viewMode, setViewMode] = useState<'summary' | 'instructions'>('summary');

  if (!move) return null;

  const { 
    word = "", 
    score, 
    row = 0, 
    col = 0, 
    direction = 'across', 
    textInstructions = "" 
  } = move;

  const rowLabel = row + 1;
  const colLabel = String.fromCharCode(65 + col);
  const coord = `${colLabel}${rowLabel}`;

  // Safe access for score properties
  const totalScore = score?.total ?? 0;
  const baseScore = score?.base ?? 0;
  const bingoBonus = score?.bingoBonus ?? 0;
  const crosswords = score?.crosswords ?? [];

  return (
    <div className={`
      relative overflow-hidden rounded-[2rem] border transition-all duration-300
      ${isBest 
        ? 'bg-white border-indigo-200 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' 
        : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'}
    `}>
      {isBest && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-5 py-2 rounded-bl-[1.5rem] flex items-center gap-2 z-10 shadow-lg uppercase tracking-wider">
          <Trophy size={14} className="text-indigo-200" /> Optimal Play
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5">
                <MapPin size={10} /> {coord}
              </span>
              <span className={`px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 uppercase ${direction === 'across' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {direction === 'across' ? <ArrowRight size={12} /> : <ArrowRight size={12} className="rotate-90" />}
                {direction}
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{word}</h2>
          </div>
          
          <div className="text-right">
             <div className="text-5xl font-black text-indigo-600 leading-none drop-shadow-sm">{totalScore}</div>
             <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">Total Points</div>
          </div>
        </div>

        {/* View Selection */}
        <div className="flex gap-2 mb-6">
           <button 
             onClick={() => setViewMode('summary')}
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'summary' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
           >
             <List size={16} /> Analysis
           </button>
           <button 
             onClick={() => setViewMode('instructions')}
             className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'instructions' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
           >
             <ChevronDown size={16} /> Placement
           </button>
           <button 
             onClick={onViewOnBoard}
             className="px-5 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-black transition-all shadow-lg flex items-center gap-2"
           >
             <Eye size={16} /> VISUALIZE
           </button>
        </div>

        {viewMode === 'summary' ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
               {word && word.split('').map((char, i) => <Tile key={i} letter={char} size="sm" />)}
            </div>

            <div className="bg-indigo-50/50 rounded-2xl p-4 text-xs space-y-2.5 border border-indigo-100/50">
               <div className="flex justify-between text-slate-500 font-bold uppercase text-[9px] tracking-wider border-b border-indigo-100/50 pb-2 mb-2">
                 <span>Score Component</span>
                 <span>Points</span>
               </div>
               <div className="flex justify-between text-slate-700">
                 <span className="font-medium">Base Letter Value</span>
                 <span className="font-bold">{baseScore}</span>
               </div>
               {bingoBonus > 0 && (
                 <div className="flex justify-between text-emerald-600 font-black italic">
                   <span className="flex items-center gap-1.5"><Star size={14} fill="currentColor"/> BINGO BONUS</span>
                   <span>+35</span>
                 </div>
               )}
               {crosswords.length > 0 && (
                 <div className="space-y-2 pt-2">
                   <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest">Cross words created</span>
                   {crosswords.map((cw, i) => (
                     <div key={i} className="flex justify-between text-slate-600 pl-2 border-l-2 border-indigo-200">
                       <span className="font-bold">{cw.word}</span>
                       <span className="font-bold text-indigo-500">+{cw.points}</span>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 animate-in fade-in zoom-in-95 duration-300">
             <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3 flex items-center gap-2">
               <MapPin size={12} /> Placement Strategy
             </h4>
             <p className="text-sm text-emerald-900 leading-relaxed font-bold italic">
               "{textInstructions}"
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveResult;
