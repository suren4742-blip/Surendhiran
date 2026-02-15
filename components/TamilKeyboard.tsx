
import React from 'react';
import { Delete, CornerDownLeft, Space } from 'lucide-react';

interface TamilKeyboardProps {
  onKeyClick: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
}

const VOWELS = ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ", "ஃ"];
const CONSONANTS = [
  "க", "ங", "ச", "ஞ", "ட", "ண", 
  "த", "ந", "ப", "ம", "ய", "ர", 
  "ல", "வ", "ழ", "ள", "ற", "ன",
  "ஜ", "ஷ", "ஸ", "ஹ", "க்ஷ"
];
const MODIFIERS: Record<string, string> = {
  "அ": "",
  "ஆ": "ா",
  "இ": "ி",
  "ஈ": "ீ",
  "உ": "ு",
  "ஊ": "ூ",
  "எ": "ெ",
  "ஏ": "ே",
  "ஐ": "ை",
  "ஒ": "ொ",
  "ஓ": "ோ",
  "ஔ": "ௌ",
};

const TamilKeyboard: React.FC<TamilKeyboardProps> = ({ onKeyClick, onBackspace, onEnter, onSpace }) => {
  const vibrate = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
  };

  const handlePress = (action: () => void) => {
    vibrate();
    action();
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Vowels */}
      <div className="grid grid-cols-7 sm:grid-cols-13 gap-1 mb-3">
        {VOWELS.map(v => (
          <button
            key={v}
            onClick={() => handlePress(() => onKeyClick(v))}
            className="h-10 sm:h-12 bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-800 dark:text-slate-200 font-bold rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm active:scale-95 transition-all text-sm sm:text-base"
          >
            {v}
          </button>
        ))}
      </div>

      {/* Consonants */}
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-1 mb-3">
        {CONSONANTS.map(c => (
          <button
            key={c}
            onClick={() => handlePress(() => onKeyClick(c))}
            className="h-10 sm:h-12 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-800 dark:text-slate-200 font-bold rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm active:scale-95 transition-all text-sm sm:text-base"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Modifiers & Special */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(MODIFIERS).map(([v, m]) => m && (
          <button
            key={v}
            onClick={() => handlePress(() => onKeyClick(m))}
            className="flex-1 min-w-[40px] h-10 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-400 font-bold rounded-lg border border-orange-200 dark:border-orange-800/50 shadow-sm active:scale-95 transition-all text-xs"
          >
             {v} ({m})
          </button>
        ))}
        <button
          onClick={() => handlePress(() => onKeyClick("்"))}
          className="flex-1 min-w-[40px] h-10 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-bold rounded-lg border border-slate-300 dark:border-slate-500 shadow-sm active:scale-95 transition-all"
        >
          ்
        </button>
      </div>

      {/* Utilities */}
      <div className="grid grid-cols-4 gap-1 mt-3">
        <button
          onClick={() => handlePress(onSpace)}
          className="col-span-2 h-10 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm flex items-center justify-center active:scale-95 transition-all"
        >
          <Space className="w-5 h-5" />
        </button>
        <button
          onClick={() => handlePress(onBackspace)}
          className="h-10 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 shadow-sm flex items-center justify-center active:scale-95 transition-all"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          onClick={() => handlePress(onEnter)}
          className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg border-b-4 border-emerald-700 shadow-md flex items-center justify-center active:scale-95 transition-all"
        >
          <CornerDownLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TamilKeyboard;
