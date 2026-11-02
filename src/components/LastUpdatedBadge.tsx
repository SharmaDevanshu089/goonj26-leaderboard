import React from 'react';
import { Clock, Radio } from 'lucide-react';
import { useLeaderboard } from '../context/LeaderboardContext';

export const LastUpdatedBadge: React.FC = () => {
  const { lastUpdated, activeEdition } = useLeaderboard();

  return (
    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-card text-xs sm:text-sm font-medium shadow-sm transition-all duration-300">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          {activeEdition.isLive ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          )}
        </span>
        <span className="font-semibold tracking-wider uppercase text-[11px] text-slate-700 dark:text-slate-300">
          {activeEdition.isLive ? 'Live Standing' : 'Archived Record'}
        </span>
      </div>

      <span className="text-slate-300 dark:text-slate-700">|</span>

      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] sm:text-xs">
        <Clock className="w-3.5 h-3.5 text-azad-500" />
        <span>Updated:</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{lastUpdated}</span>
      </div>
    </div>
  );
};
