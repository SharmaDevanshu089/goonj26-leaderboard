import React, { useState } from 'react';
import { Trophy, Activity, Users, Flame, Shield, Sparkles, HeartPulse } from 'lucide-react';
import { useLeaderboard } from './context/LeaderboardContext';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { LastUpdatedBadge } from './components/LastUpdatedBadge';
import { Podium } from './components/Podium';
import { ScoreTable } from './components/ScoreTable';
import { EventBreakdown } from './components/EventBreakdown';
import { ArchiveViewer } from './components/ArchiveViewer';
import { AdminModal } from './components/AdminModal';

export const App: React.FC = () => {
  const { activeEdition } = useLeaderboard();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Compute summary stats
  const totalPoints = activeEdition.teams.reduce((acc, t) => acc + t.score, 0);
  const totalEventsCompleted = activeEdition.events.length;
  const currentLeader = activeEdition.teams[0];

  return (
    <div className="relative min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-azad-500 selection:text-white">
      
      {/* Dynamic Interactive HTML5 Canvas Particle Engine */}
      <ParticleBackground />

      {/* Main Navigation Header */}
      <Navbar onOpenAdmin={() => setIsAdminModalOpen(true)} />

      {/* Primary Page Container */}
      <main className="relative z-10 flex-1 pb-16">
        
        {/* ================= HERO SECTION ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 text-center">
          
          {/* Top Live Badge */}
          <div className="flex justify-center mb-4">
            <LastUpdatedBadge />
          </div>

          {/* Festival Title & Identity */}
          <div className="relative inline-block">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-azad-600 dark:text-azad-400 mb-2">
              <HeartPulse className="w-4 h-4 text-crimson-500 animate-pulse" />
              <span>Maulana Azad Medical College • New Delhi</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {activeEdition.isLive ? (
                <>
                  GOONJ <span className="text-gradient-blue">'26</span>
                </>
              ) : (
                <>
                  {activeEdition.name}
                </>
              )}
            </h1>

            <p className="mt-3 text-base sm:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {activeEdition.isLive
                ? "The official intra-college sports, cultural & literary championship leaderboard. Real-time batch telemetry & podium standings."
                : `Official historical records from ${activeEdition.year} intra-college championship.`}
            </p>
          </div>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-8">
            
            {/* Metric 1 */}
            <div className="glass-card p-3.5 sm:p-4 rounded-xl text-center border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                <Users className="w-3.5 h-3.5 text-azad-500" />
                <span>Batches</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-tabular">
                {activeEdition.teams.length}
              </div>
            </div>

            {/* Metric 2 */}
            <div className="glass-card p-3.5 sm:p-4 rounded-xl text-center border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Events Done</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-tabular">
                {totalEventsCompleted}
              </div>
            </div>

            {/* Metric 3 */}
            <div className="glass-card p-3.5 sm:p-4 rounded-xl text-center border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                <Flame className="w-3.5 h-3.5 text-crimson-500" />
                <span>Total Points</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-tabular">
                {totalPoints.toLocaleString()}
              </div>
            </div>

            {/* Metric 4 */}
            <div className="glass-card p-3.5 sm:p-4 rounded-xl text-center border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
                <Trophy className="w-3.5 h-3.5 text-gold-500" />
                <span>Leading Batch</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-gold-600 dark:text-gold-400 truncate">
                {currentLeader?.crest} {currentLeader?.name}
              </div>
            </div>

          </div>

        </div>

        {/* ================= ARCHIVE BANNER (If not Live) ================= */}
        <ArchiveViewer edition={activeEdition} />

        {/* ================= 3D ANIMATED PODIUM ================= */}
        <Podium teams={activeEdition.teams} />

        {/* ================= DETAILED STANDINGS TABLE ================= */}
        <ScoreTable teams={activeEdition.teams} />

        {/* ================= EVENT RESULTS BREAKDOWN ================= */}
        <EventBreakdown events={activeEdition.events} teams={activeEdition.teams} />

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 glass-card border-t border-slate-200/80 dark:border-white/10 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-azad-600 text-white flex items-center justify-center text-xs font-bold">
              M
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                Maulana Azad Medical College (MAMC Delhi)
              </span>
              <span className="text-[11px] text-slate-400">
                Goonj '26 Annual Sports & Cultural Fest
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span>Pulse of Azad</span>
            <span>•</span>
            <span>Dean's Trophy</span>
            <span>•</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-azad-600 dark:text-azad-400 hover:underline font-semibold"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>

      {/* ================= ADMIN MANAGEMENT MODAL ================= */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

    </div>
  );
};
export default App;
