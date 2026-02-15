
import React from 'react';

interface PanchangamItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass?: string;
}

const PanchangamItem: React.FC<PanchangamItemProps> = ({ label, value, icon, colorClass = "bg-orange-50 text-orange-600" }) => {
  return (
    <div className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md dark:hover:shadow-black/40 hover:border-orange-100 dark:hover:border-orange-900 group">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center mr-4 transition-transform group-hover:scale-110 ${colorClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">{label}</p>
        <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
};

export default PanchangamItem;
