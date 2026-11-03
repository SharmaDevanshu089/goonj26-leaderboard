import React from 'react';
import { Moon, Sun, Lock, Unlock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLeaderboard } from '../context/LeaderboardContext';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAdminLoggedIn, logoutAdmin } = useLeaderboard();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-2xl mx-auto px-4 h-13 py-2.5 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            Goonj '26
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white transition-colors"
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
