import React from 'react';
import Tile from './Tile';

interface RackInputProps {
  value: string;
  onChange: (val: string) => void;
}

const RackInput: React.FC<RackInputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // limit to 7 chars, allow letters and ?
    const val = e.target.value.toUpperCase().replace(/[^A-Z?]/g, '').slice(0, 7);
    onChange(val);
  };

  // Pad the visual representation to always show 7 slots
  const slots = Array(7).fill(null).map((_, i) => value[i] || null);

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
      <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Rack</label>
      
      <div className="flex justify-between gap-1 sm:gap-2 mb-2">
        {slots.map((char, idx) => (
          <div key={idx} className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
             {char ? <Tile letter={char} size="lg" /> : <span className="text-slate-300 font-bold opacity-30 text-xl">+</span>}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type letters (use ? for blank)..."
        className="w-full px-4 py-3 text-lg font-bold tracking-widest uppercase bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
      />
    </div>
  );
};

export default RackInput;
