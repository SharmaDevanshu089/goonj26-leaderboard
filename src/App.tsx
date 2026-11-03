import React, { useState } from 'react';
import { useLeaderboard } from './context/LeaderboardContext';
import { Navbar } from './components/Navbar';
import { LeaderboardBanner } from './components/LeaderboardBanner';
import { EventBreakdown } from './components/EventBreakdown';
import { ArchiveViewer } from './components/ArchiveViewer';
import { AdminModal } from './components/AdminModal';

export const App: React.FC = () => {
  const { activeEdition } = useLeaderboard();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-150">
      
      {/* Header Navigation */}
      <Navbar onOpenAdmin={() => setIsAdminModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        
        {/* Notice Board Header */}
        <section className="max-w-4xl mx-auto px-4 pt-8 pb-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {activeEdition.isLive ? "Goonj '26" : activeEdition.name}
          </h1>
        </section>

        {/* Archive Banner (If not live) */}
        <ArchiveViewer edition={activeEdition} />

        {/* Dynamic 2-Slide Leaderboard Banner (Slide 1: Podium Top 3 | Slide 2: Table of Other Batches) */}
        <LeaderboardBanner teams={activeEdition.teams} />

        {/* Events Held Area */}
        <EventBreakdown events={activeEdition.events} teams={activeEdition.teams} />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span>Goonj '26</span>
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium hover:underline"
          >
            Admin Login
          </button>
        </div>
      </footer>

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

    </div>
  );
};

export default App;
