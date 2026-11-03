import React, { useEffect, useRef } from 'react';
import { Trophy, Medal, Flame, ArrowUp, ArrowDown, Minus, Crown, LayoutList } from 'lucide-react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { BatchTeam } from '../types/leaderboard';
import { useLeaderboard } from '../context/LeaderboardContext';

interface PodiumProps {
  teams: BatchTeam[];
  onSwitchToTable?: () => void;
}

export const Podium: React.FC<PodiumProps> = ({ teams, onSwitchToTable }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const score1Ref = useRef<HTMLSpanElement | null>(null);
  const score2Ref = useRef<HTMLSpanElement | null>(null);
  const score3Ref = useRef<HTMLSpanElement | null>(null);

  const { selectedEditionId } = useLeaderboard();

  const first = teams[0];
  const second = teams[1];
  const third = teams[2];

  // GSAP Entrance Animation on edition switch or mount
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.podium-card', {
        y: 80,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: 'back.out(1.6)',
        clearProps: 'transform,opacity'
      });

      gsap.from('.podium-badge', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
        stagger: 0.1,
        ease: 'elastic.out(1.2, 0.4)'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selectedEditionId]);

  // GSAP Animated Score Ticker for 1st place
  useEffect(() => {
    if (!first || !score1Ref.current) return;
    const el = score1Ref.current;
    const startVal = parseInt(el.textContent?.replace(/,/g, '') || '0', 10);
    const targetVal = first.score;

    const counterObj = { val: isNaN(startVal) ? 0 : startVal };
    gsap.to(counterObj, {
      val: targetVal,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        if (el) el.textContent = Math.round(counterObj.val).toLocaleString();
      }
    });
  }, [first?.score]);

  // GSAP Animated Score Ticker for 2nd place
  useEffect(() => {
    if (!second || !score2Ref.current) return;
    const el = score2Ref.current;
    const startVal = parseInt(el.textContent?.replace(/,/g, '') || '0', 10);
    const targetVal = second.score;

    const counterObj = { val: isNaN(startVal) ? 0 : startVal };
    gsap.to(counterObj, {
      val: targetVal,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        if (el) el.textContent = Math.round(counterObj.val).toLocaleString();
      }
    });
  }, [second?.score]);

  // GSAP Animated Score Ticker for 3rd place
  useEffect(() => {
    if (!third || !score3Ref.current) return;
    const el = score3Ref.current;
    const startVal = parseInt(el.textContent?.replace(/,/g, '') || '0', 10);
    const targetVal = third.score;

    const counterObj = { val: isNaN(startVal) ? 0 : startVal };
    gsap.to(counterObj, {
      val: targetVal,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        if (el) el.textContent = Math.round(counterObj.val).toLocaleString();
      }
    });
  }, [third?.score]);

  const fireVictoryConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#3B82F6', '#EF4444', '#10B981']
    });
  };

  const renderRankDelta = (team: BatchTeam) => {
    const delta = team.prevRank - team.rank;
    if (delta > 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          <ArrowUp className="w-3 h-3 mr-0.5" /> +{delta}
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="inline-flex items-center text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800/60">
          <ArrowDown className="w-3 h-3 mr-0.5" /> {delta}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
        <Minus className="w-3 h-3 mr-0.5" /> Hold
      </span>
    );
  };

  return (
    <div ref={containerRef} className="w-full mt-2 mb-10">
      
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 dark:bg-gold-950/60 text-gold-700 dark:text-gold-300 border border-gold-200 dark:border-gold-800 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-gold-500" />
            Championship Podium
          </div>
          {onSwitchToTable && (
            <button
              onClick={onSwitchToTable}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-azad-100 dark:bg-azad-950/60 text-azad-700 dark:text-azad-300 border border-azad-200 dark:border-azad-800 text-xs font-bold hover:bg-azad-200 dark:hover:bg-azad-900 transition-all shadow-sm"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Full Standings Table</span>
            </button>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Current Tournament Leaders
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Top batches battling for the coveted Goonj '26 General Championship Trophy
        </p>
      </div>

      {/* 3D Tiered Podium Layout: 2nd (Left), 1st (Center/Elevated), 3rd (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-end max-w-5xl mx-auto px-4">
        
        {/* ================= 2ND PLACE ================= */}
        {second && (
          <div className="podium-card order-2 md:order-1 relative group">
            <div className="glass-card-elevated rounded-2xl p-6 sm:p-7 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300 shadow-glow-silver flex flex-col items-center text-center">
              
              {/* Podium Badge */}
              <div className="podium-badge -mt-12 mb-3 relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-700">
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">2</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 dark:bg-slate-500 flex items-center justify-center text-white text-xs">
                  🥈
                </div>
              </div>

              {/* Batch Info */}
              <span className="text-3xl mb-1">{second.crest}</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {second.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {second.subname}
              </p>
              <p className="text-[11px] italic text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                "{second.tagline}"
              </p>

              {/* Score Metric */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 w-full flex flex-col items-center">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  Total Points
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 font-tabular mt-1 flex items-baseline gap-1">
                  <span ref={score2Ref}>{second.score}</span>
                  <span className="text-xs font-semibold text-slate-400">pts</span>
                </div>
              </div>

              {/* Medals & Rank Delta */}
              <div className="mt-4 flex items-center justify-between w-full px-2">
                {renderRankDelta(second)}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  <span>🥇 {second.gold}</span>
                  <span>🥈 {second.silver}</span>
                  <span>🥉 {second.bronze}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= 1ST PLACE (CHAMPION) ================= */}
        {first && (
          <div className="podium-card order-1 md:order-2 relative group md:-translate-y-4">
            <div
              onClick={fireVictoryConfetti}
              title="Click to celebrate champion!"
              className="glass-card-elevated rounded-2xl p-6 sm:p-8 border-2 border-gold-400/80 dark:border-gold-500/60 transition-all duration-300 shadow-glow-gold hover:shadow-gold-500/40 flex flex-col items-center text-center cursor-pointer relative overflow-hidden"
            >
              {/* Subtle gold radiance gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Champion Crown / Podium Badge */}
              <div className="podium-badge -mt-14 mb-3 relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-300 flex items-center justify-center shadow-xl border-2 border-white dark:border-obsidian-void ring-4 ring-gold-400/30">
                  <Trophy className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold-600 flex items-center justify-center text-white text-sm shadow-md">
                  👑
                </div>
              </div>

              {/* Batch Info */}
              <span className="text-4xl mb-1">{first.crest}</span>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-100 dark:bg-gold-950/80 text-gold-700 dark:text-gold-300 text-[10px] font-extrabold uppercase tracking-widest mb-1 border border-gold-300 dark:border-gold-800">
                1st Place • Leader
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {first.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-azad-600 dark:text-azad-400 mt-0.5">
                {first.subname}
              </p>
              <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                "{first.tagline}"
              </p>

              {/* Score Metric */}
              <div className="mt-5 pt-4 border-t border-gold-200/80 dark:border-gold-800/50 w-full flex flex-col items-center">
                <span className="text-xs font-bold tracking-widest uppercase text-gold-600 dark:text-gold-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-gold-500" />
                  Grand Championship Score
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-tabular mt-1 flex items-baseline gap-1 text-gradient-gold">
                  <span ref={score1Ref}>{first.score}</span>
                  <span className="text-sm font-bold text-gold-600 dark:text-gold-400">pts</span>
                </div>
              </div>

              {/* Medals & Rank Delta */}
              <div className="mt-5 flex items-center justify-between w-full px-2">
                {renderRankDelta(first)}
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  <span className="bg-gold-100 dark:bg-gold-950/80 px-2 py-0.5 rounded text-gold-700 dark:text-gold-300">
                    🥇 {first.gold}
                  </span>
                  <span>🥈 {first.silver}</span>
                  <span>🥉 {first.bronze}</span>
                </div>
              </div>

              <div className="mt-3 text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <span>✨ Click card to celebrate victory!</span>
              </div>

            </div>
          </div>
        )}

        {/* ================= 3RD PLACE ================= */}
        {third && (
          <div className="podium-card order-3 relative group">
            <div className="glass-card-elevated rounded-2xl p-6 sm:p-7 border border-amber-900/20 dark:border-amber-700/30 hover:border-amber-500/50 transition-all duration-300 shadow-glow-bronze flex flex-col items-center text-center">
              
              {/* Podium Badge */}
              <div className="podium-badge -mt-12 mb-3 relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
                  <span className="text-2xl font-black text-white font-mono">3</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center text-white text-xs">
                  🥉
                </div>
              </div>

              {/* Batch Info */}
              <span className="text-3xl mb-1">{third.crest}</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {third.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {third.subname}
              </p>
              <p className="text-[11px] italic text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                "{third.tagline}"
              </p>

              {/* Score Metric */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 w-full flex flex-col items-center">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  Total Points
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 font-tabular mt-1 flex items-baseline gap-1">
                  <span ref={score3Ref}>{third.score}</span>
                  <span className="text-xs font-semibold text-slate-400">pts</span>
                </div>
              </div>

              {/* Medals & Rank Delta */}
              <div className="mt-4 flex items-center justify-between w-full px-2">
                {renderRankDelta(third)}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  <span>🥇 {third.gold}</span>
                  <span>🥈 {third.silver}</span>
                  <span>🥉 {third.bronze}</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
