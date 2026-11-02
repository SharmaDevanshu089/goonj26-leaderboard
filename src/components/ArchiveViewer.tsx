import React from 'react';
import { History, Award, ArrowRight, Sparkles } from 'lucide-react';
import { TournamentEdition } from '../types/leaderboard';
import { useLeaderboard } from '../context/LeaderboardContext';

interface ArchiveViewerProps {
  edition: TournamentEdition;
}

export const ArchiveViewer: React.FC<ArchiveViewerProps> = ({ edition }) => {
  const { selectEdition } = useLeaderboard();

  if (edition.isLive) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-6">
      <div className="glass-card-elevated rounded-2xl p-6 border-2 border-amber-500/40 shadow-glow-gold relative overflow-hidden">
        
        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-extrabold uppercase tracking-widest border border-amber-300 dark:border-amber-700 mb-2">
              <History className="w-3.5 h-3.5" />
              Historical Tournament Archive • Year {edition.year}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {edition.name} — <span className="text-gradient-gold">"{edition.themeTitle}"</span>
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold">
                <span>🏆 Grand Champion:</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">
                  {edition.championBatchName || 'N/A'}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <span>🥈 Runner-Up:</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300">
                  {edition.runnerUpBatchName || 'N/A'}
                </span>
              </div>
              <span>•</span>
              <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                Archived on: {edition.lastUpdated}
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => selectEdition('goonj26')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-azad-600 hover:bg-azad-500 text-white shadow-lg shadow-azad-600/30 transition-all hover:scale-105"
            >
              <span>Back to Goonj '26 Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
