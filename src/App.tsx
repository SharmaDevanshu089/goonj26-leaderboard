import React, { useState } from 'react';
import { useLeaderboard } from './context/LeaderboardContext';
import { Navbar } from './components/Navbar';
import { LeaderboardBanner } from './components/LeaderboardBanner';
import { EventBreakdown } from './components/EventBreakdown';
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
        {/* Dynamic 2-Slide Mobile Leaderboard Banner (Slide 1: Podium Top 3 with Full-width GOONJ'26 | Slide 2: Points Table) */}
        <LeaderboardBanner teams={activeEdition.teams} />

        {/* Events Held Area */}
        <EventBreakdown events={activeEdition.events} teams={activeEdition.teams} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
        <div className="max-w-lg sm:max-w-xl mx-auto flex items-center justify-between">
          <span className="font-semibold">GOONJ '26</span>
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
