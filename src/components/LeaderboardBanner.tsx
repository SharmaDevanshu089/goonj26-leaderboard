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

  // Touch gesture support for mobile phones
  const touchStartXRef = useRef<number | null>(null);

  // Sort teams descending by score
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const first = sortedTeams[0];
  const second = sortedTeams[1];
  const third = sortedTeams[2];

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left
        setActiveSlide(1);
      } else {
        // Swiped right
        setActiveSlide(0);
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className="w-full max-w-lg sm:max-w-xl mx-auto px-3 sm:px-4 my-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col justify-between min-h-[380px]">
        
        {/* Main Slide Content */}
        <div className="relative flex-1 p-3.5 sm:p-5 flex flex-col justify-center">
          
          {/* ================= PAGE 1: TOP THREE PODIUM ================= */}
          {activeSlide === 0 && (
            <div className="w-full flex flex-col items-center animate-fade-in">
              
              {/* GOONJ'26 Heading covering the full distance of the podium finish */}
              <div
                className="w-full flex justify-between items-center font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 dark:text-white uppercase select-none px-1 pt-1 pb-3 leading-none"
                aria-label="GOONJ'26"
              >
                <span>G</span>
                <span>O</span>
                <span>O</span>
                <span>N</span>
                <span>J</span>
                <span>’</span>
                <span>2</span>
                <span>6</span>
              </div>

              {/* Podium Columns */}
              <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 items-end justify-center pt-2 pb-1">
                
                {/* 2nd Place: Left side (Silver) */}
                {second && (
                  <div className="flex flex-col items-center">
                    <div className="w-full rounded-t-xl border border-slate-300 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90 p-2 sm:p-3 text-center h-40 sm:h-48 flex flex-col justify-between shadow-sm">
                      <div className="inline-flex items-center justify-center gap-0.5 self-center px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] sm:text-xs font-bold">
                        <span>🥈</span>
                        <span>2nd</span>
                      </div>
                      
                      <div className="my-auto py-1">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block tracking-tight">
                          {formatBatchName(second.name || second.id)}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/60">
                        <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 font-mono block">
                          {second.score.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium">pts</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place: Center (Elevated, Golden Background) */}
                {first && (
                  <div className="flex flex-col items-center -translate-y-2 sm:-translate-y-3 z-10">
                    <div className="w-full rounded-t-xl border-2 border-amber-400 dark:border-amber-500 bg-amber-100/90 dark:bg-amber-950/50 p-2.5 sm:p-4 text-center h-48 sm:h-56 flex flex-col justify-between shadow-md">
                      <div className="inline-flex items-center justify-center gap-1 self-center px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 text-[11px] sm:text-xs font-extrabold border border-amber-300 dark:border-amber-700">
                        <span>👑</span>
                        <span>1st</span>
                      </div>

                      <div className="my-auto py-1">
                        <span className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-100 block tracking-tight">
                          {formatBatchName(first.name || first.id)}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-amber-200/80 dark:border-amber-900/60">
                        <span className="text-sm sm:text-base font-black text-amber-950 dark:text-amber-200 font-mono block">
                          {first.score.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-amber-800 dark:text-amber-300 block font-bold">pts</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place: Right side (Bronze) */}
                {third && (
                  <div className="flex flex-col items-center">
                    <div className="w-full rounded-t-xl border border-amber-900/20 dark:border-amber-900/40 bg-orange-50/80 dark:bg-slate-800/60 p-2 sm:p-3 text-center h-34 sm:h-40 flex flex-col justify-between shadow-sm">
                      <div className="inline-flex items-center justify-center gap-0.5 self-center px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] sm:text-xs font-bold">
                        <span>🥉</span>
                        <span>3rd</span>
                      </div>

                      <div className="my-auto py-1">
                        <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 block tracking-tight">
                          {formatBatchName(third.name || third.id)}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/60">
                        <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono block">
                          {third.score.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-medium">pts</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ================= PAGE 2: COMPLETE POINTS TABLE ================= */}
          {activeSlide === 1 && (
            <div className="w-full flex flex-col justify-center animate-fade-in py-1">
              
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  GOONJ'26 POINTS TABLE
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Total Standings
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/80 overflow-hidden shadow-inner">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/70 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-2 px-2.5 sm:px-3 text-center w-10">#</th>
                      <th className="py-2 px-2.5 sm:px-3">Batch</th>
                      <th className="py-2 px-2.5 sm:px-3 text-right">Sports</th>
                      <th className="py-2 px-2.5 sm:px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
                    {sortedTeams.map((team, index) => {
                      const position = team.rank || index + 1;
                      const batchName = formatBatchName(team.name || team.id);

                      return (
                        <tr
                          key={team.id}
                          className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-2.5 px-2.5 sm:px-3 text-center font-bold text-slate-500 dark:text-slate-400 text-xs">
                            {position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `#${position}`}
                          </td>
                          <td className="py-2.5 px-2.5 sm:px-3 font-extrabold text-slate-900 dark:text-slate-100">
                            {batchName}
                          </td>
                          <td className="py-2.5 px-2.5 sm:px-3 text-right font-mono text-slate-600 dark:text-slate-400 text-xs">
                            {team.sportsScore?.toLocaleString() || 0}
                          </td>
                          <td className="py-2.5 px-2.5 sm:px-3 text-right font-bold text-slate-900 dark:text-white font-mono text-xs sm:text-sm">
                            {team.score.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">pts</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Banner Bottom Controls & Swipe/Pagination Dots */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/60">
          
          <button
            onClick={() => setActiveSlide(0)}
            className={`text-[11px] font-bold transition-colors ${
              activeSlide === 0
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Podium
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSlide(0)}
              aria-label="Podium Page"
              className={`h-1.5 rounded-full transition-all ${
                activeSlide === 0
                  ? 'w-5 bg-slate-900 dark:bg-white'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
            <button
              onClick={() => setActiveSlide(1)}
              aria-label="Points Table Page"
              className={`h-1.5 rounded-full transition-all ${
                activeSlide === 1
                  ? 'w-5 bg-slate-900 dark:bg-white'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          </div>

          <button
            onClick={() => setActiveSlide(1)}
            className={`text-[11px] font-bold transition-colors ${
              activeSlide === 1
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Points Table
          </button>

        </div>

      </div>
    </div>
  );
};
