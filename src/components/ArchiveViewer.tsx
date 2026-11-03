import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import { TournamentEdition } from '../types/leaderboard';
import { useLeaderboard } from '../context/LeaderboardContext';
import { formatBatchName } from '../utils/formatters';

interface ArchiveViewerProps {
  edition: TournamentEdition;
}

export const ArchiveViewer: React.FC<ArchiveViewerProps> = ({ edition }) => {
  const { selectEdition } = useLeaderboard();

  if (edition.isLive) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 my-4">
      <div className="rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <History className="w-3.5 h-3.5" />
            <span>Archive • {edition.name}</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
            {edition.championBatchName && (
              <span>1st: <strong>{formatBatchName(edition.championBatchName)}</strong></span>
            )}
            {edition.runnerUpBatchName && (
              <span>2nd: <strong>{formatBatchName(edition.runnerUpBatchName)}</strong></span>
            )}
          </div>
        </div>

        <button
          onClick={() => selectEdition('goonj26')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors whitespace-nowrap"
        >
          <span>Live 2026</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
