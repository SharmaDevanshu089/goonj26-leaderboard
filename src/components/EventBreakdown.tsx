import React from 'react';
import { EventResult, BatchTeam } from '../types/leaderboard';
import { formatBatchName } from '../utils/formatters';

interface EventBreakdownProps {
  events: EventResult[];
  teams: BatchTeam[];
}

export const EventBreakdown: React.FC<EventBreakdownProps> = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
        Events Held
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => {
          const winnerPoints = ev.pointsAwarded;
          const runnerPoints = Math.floor(ev.pointsAwarded * 0.5);
          const thirdPoints = Math.floor(ev.pointsAwarded * 0.25);

          return (
            <div
              key={ev.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">
                {ev.title}
              </h3>

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>🥇</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatBatchName(ev.winnerBatchId)}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-xs">
                    {winnerPoints} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>🥈</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {formatBatchName(ev.runnerUpBatchId)}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-xs">
                    {runnerPoints} pts
                  </span>
                </div>

                {ev.thirdPlaceBatchId && (
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span>🥉</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {formatBatchName(ev.thirdPlaceBatchId)}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-xs">
                      {thirdPoints} pts
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
