import React from 'react';
import { Trophy, Moon, Sun, Lock, Unlock, History, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLeaderboard } from '../context/LeaderboardContext';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { theme, toggleTheme } = useTheme();
  const {
    activeEdition,
    selectedEditionId,
    selectEdition,
    availableEditions,
    isAdminLoggedIn,
    logoutAdmin
  } = useLeaderboard();

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-azad-600 via-azad-500 to-gold-400 p-[2px] shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-gold-400" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-crimson-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-obsidian-void">
              26
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                GOONJ <span className="text-azad-500 dark:text-azad-400">'26</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-azad-100 dark:bg-azad-950/80 text-azad-700 dark:text-azad-300 border border-azad-200 dark:border-azad-800">
                MAMC Delhi
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Maulana Azad Medical College Intra-College Championship
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Edition / Historical Archive Switcher */}
          <div className="relative">
            <div className="flex items-center">
              <select
                value={selectedEditionId}
                onChange={(e) => selectEdition(e.target.value)}
                className="appearance-none pl-8 pr-8 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-azad-400 focus:outline-none focus:ring-2 focus:ring-azad-500 transition-all cursor-pointer shadow-sm"
              >
                {availableEditions.map(ed => (
                  <option key={ed.id} value={ed.id}>
                    {ed.name}
                  </option>
                ))}
              </select>
              <History className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 sm:p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-azad-600 dark:hover:text-gold-400 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all border border-slate-200 dark:border-slate-700/80 shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-gold-400" />
            ) : (
              <Moon className="w-4 h-4 text-azad-600" />
            )}
          </button>

          {/* Admin Button */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin GUI</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="px-2.5 py-2 text-xs font-medium rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Logout Admin"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-azad-600 hover:bg-azad-500 dark:bg-azad-600 dark:hover:bg-azad-500 text-white shadow-md shadow-azad-600/20 hover:shadow-azad-500/30 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
