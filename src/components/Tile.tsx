import React from 'react';
import { WWF_LETTER_VALUES } from '../constants';

interface TileProps {
  letter: string;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

const Tile: React.FC<TileProps> = ({ letter, size = 'md', highlight = false }) => {
  const displayLetter = letter.toUpperCase();
  const value = WWF_LETTER_VALUES[displayLetter] ?? 0;
  const isBlank = letter === '?' || letter === ' ';

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm rounded-md',
    md: 'w-10 h-10 text-lg rounded-lg',
    lg: 'w-14 h-14 text-2xl rounded-xl',
  };

  const valueSizeClasses = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  };

  return (
    <div
      className={`
        relative flex items-center justify-center font-bold shadow-md select-none
        border border-amber-200
        ${sizeClasses[size]}
        ${highlight ? 'bg-green-100 ring-2 ring-green-500' : 'bg-[#fff5d6]'}
        text-amber-900
      `}
    >
      <span>{isBlank ? '' : displayLetter}</span>
      <span className={`absolute bottom-0.5 right-1 ${valueSizeClasses[size]} font-normal opacity-70`}>
        {value}
      </span>
    </div>
  );
};

export default Tile;
