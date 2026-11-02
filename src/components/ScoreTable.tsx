import React, { useState } from 'react';
import { Search, Trophy, ArrowUp, ArrowDown, Minus, Filter, Sparkles, Activity, BookOpen, Music } from 'lucide-react';
import { BatchTeam, EventCategory } from '../types/leaderboard';
import { useLeaderboard } from '../context/LeaderboardContext';

interface ScoreTableProps {
  teams: BatchTeam[];
}

export const ScoreTable: React.FC<ScoreTableProps> = ({ teams }) => {
  const { activeCategory, setActiveCategory } = useLeaderboard();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = teams.filter(team => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.subname.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getDisplayedScore = (team: BatchTeam) => {
    if (activeCategory === 'sports') return team.sportsScore;
    if (activeCategory === 'cultural') return team.culturalScore;
    if (activeCategory === 'literary') return team.literaryScore;
    return team.score;
  };

  const categories: { id: EventCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Overall Standings', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'sports', label: 'Sports Arena', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'cultural', label: 'Cultural Euphoria', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'literary', label: 'Literary & Quiz', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-8">
      
      {/* Controls Bar: Categories & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-card overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-azad-600 text-white shadow-md shadow-azad-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search batch or year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl glass-card bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-azad-500 shadow-sm"
          />
        </div>
      </div>

      {/* Standings Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/50 text-[11px] sm:text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                <th className="py-4 px-4 sm:px-6 w-16 text-center">Rank</th>
                <th className="py-4 px-3 w-16 text-center">Trend</th>
                <th className="py-4 px-4">Batch / House</th>
                <th className="py-4 px-4 text-center hidden md:table-cell">Medals (G / S / B)</th>
                <th className="py-4 px-4 text-center hidden lg:table-cell">Sports</th>
                <th className="py-4 px-4 text-center hidden lg:table-cell">Cultural</th>
                <th className="py-4 px-4 text-center hidden lg:table-cell">Literary</th>
                <th className="py-4 px-6 text-right font-extrabold text-slate-700 dark:text-slate-200">
                  {activeCategory === 'all' ? 'Total Points' : 'Category Points'}
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm">
              {filteredTeams.map((team) => {
                const delta = team.prevRank - team.rank;
                const isFirst = team.rank === 1;
                const isSecond = team.rank === 2;
                const isThird = team.rank === 3;

                return (
                  <tr
                    key={team.id}
                    className={`transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                      isFirst
                        ? 'bg-amber-500/5'
                        : isSecond
                        ? 'bg-slate-500/5'
                        : isThird
                        ? 'bg-orange-500/5'
                        : ''
                    }`}
                  >
                    
                    {/* Rank Badge */}
                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center">
                        {isFirst ? (
                          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-600 to-amber-400 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                            1
                          </span>
                        ) : isSecond ? (
                          <span className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                            2
                          </span>
                        ) : isThird ? (
                          <span className="w-8 h-8 rounded-full bg-amber-700 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                            3
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold text-sm flex items-center justify-center font-mono">
                            {team.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rank Trend Delta */}
                    <td className="py-4 px-3 text-center">
                      {delta > 0 ? (
                        <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400" title={`Up ${delta} ranks`}>
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>{delta}</span>
                        </span>
                      ) : delta < 0 ? (
                        <span className="inline-flex items-center text-[11px] font-bold text-rose-600 dark:text-rose-400" title={`Down ${Math.abs(delta)} ranks`}>
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span>{Math.abs(delta)}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-400 dark:text-slate-600" title="No change in rank">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Batch Name & Crest */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-slate-100 dark:bg-slate-800/60 rounded-lg">
                          {team.crest}
                        </span>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{team.name}</span>
                            {isFirst && (
                              <span className="text-[10px] font-bold text-gold-600 dark:text-gold-400 bg-gold-100 dark:bg-gold-950/80 px-1.5 py-0.2 rounded border border-gold-300 dark:border-gold-800">
                                LEADER
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {team.subname}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Medals */}
                    <td className="py-4 px-4 text-center hidden md:table-cell">
                      <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/60 px-3 py-1 rounded-lg">
                        <span className="text-amber-600 dark:text-amber-400">🥇 {team.gold}</span>
                        <span className="text-slate-500 dark:text-slate-400">🥈 {team.silver}</span>
                        <span className="text-orange-700 dark:text-orange-400">🥉 {team.bronze}</span>
                      </div>
                    </td>

                    {/* Sports Points */}
                    <td className="py-4 px-4 text-center hidden lg:table-cell font-mono text-slate-700 dark:text-slate-300">
                      {team.sportsScore} pts
                    </td>

                    {/* Cultural Points */}
                    <td className="py-4 px-4 text-center hidden lg:table-cell font-mono text-slate-700 dark:text-slate-300">
                      {team.culturalScore} pts
                    </td>

                    {/* Literary Points */}
                    <td className="py-4 px-4 text-center hidden lg:table-cell font-mono text-slate-700 dark:text-slate-300">
                      {team.literaryScore} pts
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-6 text-right">
                      <span className="text-base sm:text-lg font-black font-tabular text-slate-900 dark:text-white">
                        {getDisplayedScore(team)}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 ml-1">pts</span>
                    </td>

                  </tr>
                );
              })}

              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No batches match "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};
