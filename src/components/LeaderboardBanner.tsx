import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BatchTeam } from '../types/leaderboard';
import { formatBatchName } from '../utils/formatters';

interface LeaderboardBannerProps {
  teams: BatchTeam[];
}

export const LeaderboardBanner: React.FC<LeaderboardBannerProps> = ({ teams }) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sort teams descending by score
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const top3 = sortedTeams.slice(0, 3);
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];
  const otherTeams = sortedTeams.slice(3);

  // Auto-advance slides every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const goToSlide = (slideIndex: number) => {
    setActiveSlide(slideIndex);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? 1 : 0));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4 my-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col justify-between min-h-[350px]">
        
        {/* Banner Top Navigation Bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {activeSlide === 0 ? "Podium Finish • Top 3" : "Standings • Other Batches"}
            </span>
          </div>

          {/* Slide Indicator Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goToSlide(0)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeSlide === 0
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              Top 3
            </button>
            <button
              onClick={() => goToSlide(1)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeSlide === 1
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              Other Batches
            </button>

            <div className="hidden sm:flex items-center gap-0.5 ml-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Banner Content Area */}
        <div className="relative flex-1 p-4 sm:p-6 flex items-center justify-center">
          
          {/* ================= SLIDE 1: PODIUM FINISH ================= */}
          {activeSlide === 0 && (
            <div className="w-full max-w-2xl mx-auto transition-opacity duration-300">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end justify-center pt-2 pb-1">
                
                {/* 2nd Place: Left side (Silver) */}
                {second && (
                  <div className="flex flex-col items-center">
                    <div className="w-full rounded-t-xl border border-slate-300 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/80 p-3 sm:p-4 text-center h-44 sm:h-48 flex flex-col justify-between shadow-sm">
                      <div className="inline-flex items-center justify-center gap-1 self-center px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold">
                        <span>🥈</span>
                        <span>2nd</span>
                      </div>
                      
                      <div className="my-auto">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block tracking-tight">
                          {formatBatchName(second.name || second.id)}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                        <span className="text-sm sm:text-base font-extrabold text-slate-700 dark:text-slate-300 font-mono">
                          {second.score.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">pts</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place: Center (Elevated, Golden Background) */}
                {first && (
                  <div className="flex flex-col items-center -translate-y-2 sm:-translate-y-3 z-10">
                    <div className="w-full rounded-t-xl border-2 border-amber-400 dark:border-amber-500 bg-amber-100 dark:bg-amber-950/40 p-3.5 sm:p-5 text-center h-52 sm:h-56 flex flex-col justify-between shadow-md">
                      <div className="inline-flex items-center justify-center gap-1 self-center px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-300 dark:border-amber-700">
                        <span>👑</span>
                        <span>1st Place</span>
                      </div>

                      <div className="my-auto">
                        <span className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-100 block tracking-tight">
                          {formatBatchName(first.name || first.id)}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-amber-200/80 dark:border-amber-900/60">
                        <span className="text-base sm:text-lg font-black text-amber-900 dark:text-amber-200 font-mono">
                          {first.score.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-300 block font-semibold">pts</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place: Right side (Bronze) */}
                {third && (
                  <div className="flex flex-col items-center">
                    <div className="w-full rounded-t-xl border border-amber-900/20 dark:border-amber-900/40 bg-orange-50/70 dark:bg-slate-800/50 p-3 sm:p-4 text-center h-36 sm:h-40 flex flex-col justify-between shadow-sm">
                      <div className="inline-flex items-center justify-center gap-1 self-center px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
                        <span>🥉</span>
                        <span>3rd</span>
                      </div>

                      <div className="my-auto">
                        <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 block tracking-tight">
                          {formatBatchName(third.name || third.id)}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/60">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300 font-mono">
                          {third.score.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">pts</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ================= SLIDE 2: OTHER BATCHES TABLE ================= */}
          {activeSlide === 1 && (
            <div className="w-full max-w-2xl mx-auto transition-opacity duration-300 py-1">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 overflow-hidden shadow-inner">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4 text-center w-20">Position</th>
                      <th className="py-2.5 px-4">Batch</th>
                      <th className="py-2.5 px-4 text-right">Total Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                    {otherTeams.length > 0 ? (
                      otherTeams.map((team, index) => {
                        const position = team.rank || index + 4;
                        const batchName = formatBatchName(team.name || team.id);

                        return (
                          <tr
                            key={team.id}
                            className="hover:bg-slate-100/40 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-3 px-4 text-center font-medium text-slate-500 dark:text-slate-400 text-xs">
                              #{position}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                              {batchName}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">
                              {team.score.toLocaleString()} pts
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-xs text-slate-400">
                          No other batches recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Banner Bottom Dots & Auto-play Status */}
        <div className="flex items-center justify-center gap-1.5 py-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40">
          <button
            onClick={() => goToSlide(0)}
            aria-label="Go to Slide 1"
            className={`h-2 rounded-full transition-all ${
              activeSlide === 0
                ? 'w-6 bg-slate-800 dark:bg-slate-200'
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
          />
          <button
            onClick={() => goToSlide(1)}
            aria-label="Go to Slide 2"
            className={`h-2 rounded-full transition-all ${
              activeSlide === 1
                ? 'w-6 bg-slate-800 dark:bg-slate-200'
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
          />
        </div>

      </div>
    </div>
  );
};
