import React from 'react';
import { BatchTeam } from '../types/leaderboard';
import { formatBatchName } from '../utils/formatters';

interface ScoreTableProps {
  teams: BatchTeam[];
}

export const ScoreTable: React.FC<ScoreTableProps> = ({ teams }) => {
  // Sort teams by position/score
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 my-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5 text-center w-20">Position</th>
              <th className="py-3 px-5">Batch</th>
              <th className="py-3 px-5 text-right">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
            {sortedTeams.map((team, index) => {
              const position = team.rank || index + 1;
              const batchName = formatBatchName(team.name || team.id);

              return (
                <tr
                  key={team.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-5 text-center font-medium text-slate-600 dark:text-slate-400">
                    {position}
                  </td>
                  <td className="py-3 px-5 font-semibold text-slate-900 dark:text-slate-100">
                    {batchName}
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {team.score.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
