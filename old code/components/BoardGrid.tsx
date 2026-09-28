
import React, { useState, useEffect, useRef } from 'react';
import { PREMIUM_MAP, BOARD_SIZE, WWF_LETTER_VALUES } from '../constants';
import { BoardState, MoveSuggestion } from '../types';
import { Star, Trash2, ArrowRight, ArrowDown } from 'lucide-react';

interface BoardGridProps {
  boardState: BoardState;
  onChange: (newState: BoardState) => void;
  highlightMove?: MoveSuggestion;
}

const BoardGrid: React.FC<BoardGridProps> = ({ boardState, onChange, highlightMove }) => {
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [entryDirection, setEntryDirection] = useState<'across' | 'down'>('across');
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedCell]);

  useEffect(() => {
    if (highlightMove && highlightMove.word) {
      setRevealedIndex(0);
      const wordLen = highlightMove.word.length;
      const intervalTime = Math.max(50, 1000 / wordLen);
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setRevealedIndex(current);
        if (current >= wordLen) clearInterval(interval);
      }, intervalTime);
      return () => clearInterval(interval);
    } else {
      setRevealedIndex(-1);
    }
  }, [highlightMove]);

  const handleCellClick = (r: number, c: number) => {
    if (selectedCell?.r === r && selectedCell?.c === c) {
      setEntryDirection(prev => (prev === 'across' ? 'down' : 'across'));
    } else {
      setSelectedCell({ r, c });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const keyCoord = `${r},${c}`;

    if (e.key === 'ArrowRight') { setEntryDirection('across'); if (c < BOARD_SIZE - 1) setSelectedCell({ r, c: c + 1 }); return; }
    if (e.key === 'ArrowLeft') { setEntryDirection('across'); if (c > 0) setSelectedCell({ r, c: c - 1 }); return; }
    if (e.key === 'ArrowDown') { setEntryDirection('down'); if (r < BOARD_SIZE - 1) setSelectedCell({ r: r + 1, c }); return; }
    if (e.key === 'ArrowUp') { setEntryDirection('down'); if (r > 0) setSelectedCell({ r: r - 1, c }); return; }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      const newState = { ...boardState };
      const hadValue = !!newState[keyCoord];
      delete newState[keyCoord];
      onChange(newState);
      if (!hadValue) {
        if (entryDirection === 'across' && c > 0) setSelectedCell({ r, c: c - 1 });
        else if (entryDirection === 'down' && r > 0) setSelectedCell({ r: r - 1, c });
      }
      return;
    }

    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key) || key === '?') {
      onChange({ ...boardState, [keyCoord]: key });
      if (entryDirection === 'across' && c < BOARD_SIZE - 1) setSelectedCell({ r, c: c + 1 });
      else if (entryDirection === 'down' && r < BOARD_SIZE - 1) setSelectedCell({ r: r + 1, c });
    }
  };

  const getMoveInfoAt = (r: number, c: number) => {
    if (!highlightMove || !highlightMove.word) return null;
    const { row, col, direction, word } = highlightMove;
    const len = word.length;
    let index = -1;
    if (direction === 'across') { if (r === row && c >= col && c < col + len) index = c - col; }
    else { if (c === col && r >= row && r < row + len) index = r - row; }
    return index >= 0 ? { char: word[index], index } : null;
  };

  const getCellContent = (r: number, c: number) => {
    const coord = `${r},${c}`;
    const letter = boardState[coord];
    const premium = PREMIUM_MAP[coord];
    const isSelected = selectedCell?.r === r && selectedCell?.c === c;
    const moveInfo = getMoveInfoAt(r, c);
    
    const isPartOfMove = moveInfo !== null;
    const isRevealed = isPartOfMove && moveInfo.index < revealedIndex;
    const isNewPlacement = isRevealed && !letter;
    const isExistingInMove = isRevealed && letter;

    let bgClass = 'bg-slate-50';
    let textClass = 'text-slate-300';
    let label = '';
    let borderClass = 'border-[0.5px] border-slate-200';
    let textContentColor = 'text-amber-900';

    if (!letter && !isNewPlacement) {
      switch (premium) {
        case 'TW': bgClass = 'bg-orange-400'; label = 'TW'; textClass = 'text-orange-100'; break;
        case 'DW': bgClass = 'bg-red-400'; label = 'DW'; textClass = 'text-red-100'; break;
        case 'TL': bgClass = 'bg-green-500'; label = 'TL'; textClass = 'text-green-100'; break;
        case 'DL': bgClass = 'bg-blue-400'; label = 'DL'; textClass = 'text-blue-100'; break;
        default: if (r === 7 && c === 7) return <Star size={12} className="text-slate-400 fill-slate-300" />; break;
      }
    } else if (letter) {
      bgClass = 'bg-[#fff5d6] shadow-sm border-amber-200';
      borderClass = 'border';
    }

    if (isNewPlacement) {
        bgClass = `bg-indigo-600 shadow-md transition-all duration-300`;
        textContentColor = 'text-white';
        borderClass = 'border border-indigo-700';
    } else if (isExistingInMove) {
        borderClass = `ring-2 ring-indigo-600 border-amber-200 z-10`;
    }

    return (
      <div
        onClick={() => handleCellClick(r, c)}
        className={`
          relative w-full h-full flex items-center justify-center select-none cursor-pointer
          text-[8px] sm:text-[10px] font-bold transition-all
          ${bgClass} ${borderClass}
          ${isSelected ? 'ring-2 ring-amber-400 z-20' : ''}
        `}
      >
        {isSelected && (
          <div className="absolute top-0 right-0 p-0.5 opacity-40">
            {entryDirection === 'across' ? <ArrowRight size={8} /> : <ArrowDown size={8} />}
          </div>
        )}
        {(letter || (isNewPlacement && isRevealed)) ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <span className={`text-sm sm:text-base font-bold leading-none ${textContentColor}`}>
                {isNewPlacement ? moveInfo.char : letter}
            </span>
            <span className={`text-[6px] opacity-70 absolute bottom-0.5 right-0.5 ${textContentColor === 'text-white' ? 'text-indigo-200' : 'text-amber-800'}`}>
               {WWF_LETTER_VALUES[(isNewPlacement ? moveInfo.char! : letter!).toUpperCase()] || 0}
            </span>
          </div>
        ) : (
          <span className={textClass}>{label}</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full bg-slate-800 p-1 rounded-lg shadow-inner overflow-hidden relative">
          <input ref={inputRef} type="text" className="opacity-0 absolute top-0 left-0 w-1 h-1" onKeyDown={handleKeyDown} readOnly />

          <div 
            className="grid gap-[1px] bg-slate-300"
            style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`, aspectRatio: '1/1' }}
          >
            {Array.from({ length: BOARD_SIZE }).map((_, r) => 
              Array.from({ length: BOARD_SIZE }).map((_, c) => (
                <div key={`${r}-${c}`} className="aspect-square bg-slate-100">
                  {getCellContent(r, c)}
                </div>
              ))
            )}
          </div>
      </div>
      
      <div className="text-[10px] text-slate-500 flex flex-wrap justify-between w-full px-2 gap-y-2">
         <div className="flex items-center gap-3">
           <span className="font-medium">Direction: <span className="text-indigo-600 font-bold uppercase">{entryDirection}</span></span>
           <button onClick={() => onChange({})} className="text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors font-bold uppercase">
              <Trash2 size={12}/> Clear
           </button>
         </div>
      </div>
    </div>
  );
};

export default BoardGrid;
