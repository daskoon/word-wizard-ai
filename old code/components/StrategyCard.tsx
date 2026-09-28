
import React, { useState } from 'react';
import { Lightbulb, Zap, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { AnalysisResult } from '../types';

interface StrategyCardProps {
  analysis: AnalysisResult;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { best, nextRackAdvice } = analysis;
  
  // Safe fallback if strategy is missing
  const strategyPoints = (best.strategy && Array.isArray(best.strategy) && best.strategy.length > 0)
    ? best.strategy
    : ["Maximizes points based on board geometry", "Balances scoring with rack management"];

  const explanation = best.detailedStrategy || "No detailed explanation available for this move.";

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
          <Zap size={20} />
        </div>
        <div>
          <h3 className="font-bold text-indigo-900">Why this move?</h3>
          <ul className="mt-2 space-y-2">
            {strategyPoints.map((point, i) => (
              <li key={i} className="text-sm text-indigo-800 flex gap-2">
                <span className="text-indigo-400">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-px bg-indigo-200/50" />

      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
          <Lightbulb size={20} />
        </div>
        <div>
           <h3 className="font-bold text-emerald-900">Next Rack Prep</h3>
           <p className="text-sm text-emerald-800 mt-1">{nextRackAdvice || "Keep a balanced mix of vowels and consonants for the next turn."}</p>
        </div>
      </div>

      {/* New Collapsible Detailed Strategy Section */}
      <div className="pt-2 border-t border-indigo-200/50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors py-1"
        >
          {isExpanded ? (
            <>Hide Explanation <ChevronUp size={14} /></>
          ) : (
            <><BookOpen size={14} /> Read Strategy Deep Dive <ChevronDown size={14} /></>
          )}
        </button>
        
        {isExpanded && (
           <div className="mt-3 text-sm text-indigo-900/90 leading-relaxed bg-white/60 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
             {explanation}
           </div>
        )}
      </div>
    </div>
  );
};

export default StrategyCard;
