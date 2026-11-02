import React from 'react';
import { Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { EventResult, BatchTeam } from '../types/leaderboard';

interface EventBreakdownProps {
  events: EventResult[];
  teams: BatchTeam[];
}

export const EventBreakdown: React.FC<EventBreakdownProps> = ({ events, teams }) => {
  const getBatchName = (batchId: string) => {
    const found = teams.find(t => t.id === batchId);
    return found ? `${found.crest} ${found.name}` : batchId;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'sports':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'cultural':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'literary':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-azad-500" />
            Official Event Results & Point Log
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Verified match conclusions contributing to the overall Goonj '26 scoreboard
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing {events.length} Completed Competitions
        </div>
      </div>

      {/* Grid of Event Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-azad-400/50 transition-all duration-300 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(
                    ev.category
                  )}`}
                >
                  {ev.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Certified</span>
                </span>
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {ev.title}
              </h4>

              {/* Date & Venue */}
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ev.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {ev.venue}
                </span>
              </div>
            </div>

            {/* Results Pill */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                  🥇 Winner:
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {getBatchName(ev.winnerBatchId)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                  🥈 Runner-up:
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {getBatchName(ev.runnerUpBatchId)}
                </span>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-azad-600 dark:text-azad-400">
                <span>Points Awarded to Winner:</span>
                <span className="font-mono text-xs">+{ev.pointsAwarded} pts</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
