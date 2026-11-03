import React from 'react';
import { Moon, Sun, Lock, Unlock, History, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLeaderboard } from '../context/LeaderboardContext';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { theme, toggleTheme } = useTheme();
  const {
    selectedEditionId,
    selectEdition,
    availableEditions,
    isAdminLoggedIn,
    logoutAdmin
  } = useLeaderboard();

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Goonj '26
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Edition Switcher */}
          <div className="relative">
            <select
              value={selectedEditionId}
              onChange={(e) => selectEdition(e.target.value)}
              className="appearance-none pl-7 pr-7 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-400 focus:outline-none transition-colors cursor-pointer"
            >
              {availableEditions.map(ed => (
                <option key={ed.id} value={ed.id}>
                  {ed.name}
                </option>
              ))}
            </select>
            <History className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>

          {/* Admin Button */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white transition-colors"
              >
                <Unlock className="w-3 h-3" />
                <span>Admin</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Log Out Admin"
              >
                <Lock className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
