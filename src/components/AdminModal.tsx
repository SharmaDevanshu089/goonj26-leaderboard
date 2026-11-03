import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Save,
  Plus,
  Minus,
  RotateCcw,
  Download,
  Upload,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { useLeaderboard, ADMIN_PASSWORD } from '../context/LeaderboardContext';
import { EventCategory } from '../types/leaderboard';
import { formatBatchName } from '../utils/formatters';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    activeEdition,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    updateTeamScore,
    updateTeamMedals,
    addEventResult,
    updateLastUpdatedTime,
    resetToDefault,
    exportDataJson,
    importDataJson
  } = useLeaderboard();

  // Auth form state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'sports' | 'cultural' | 'literary'>('sports');
  const [winnerId, setWinnerId] = useState(activeEdition.teams[0]?.id || '');
  const [runnerUpId, setRunnerUpId] = useState(activeEdition.teams[1]?.id || '');
  const [pointsAwarded, setPointsAwarded] = useState(75);
  const [venue, setVenue] = useState('Main Ground');
  const [customTimestamp, setCustomTimestamp] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput.trim());
    if (success) {
      setAuthError(false);
      setPasswordInput('');
      setStatusMessage('Authentication successful! Welcome to Goonj 26 Admin Control.');
    } else {
      setAuthError(true);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addEventResult({
      title: eventTitle.trim(),
      category: eventCategory,
      winnerBatchId: winnerId,
      runnerUpBatchId: runnerUpId,
      pointsAwarded: Number(pointsAwarded),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      venue: venue.trim() || 'Campus',
      status: 'completed'
    });

    setEventTitle('');
    setStatusMessage(`Event "${eventTitle}" recorded & points credited to winner!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJson(content);
        if (ok) {
          setStatusMessage('Data imported successfully from backup JSON!');
        } else {
          setStatusMessage('Failed to import JSON: Invalid format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl glass-card-elevated border border-slate-300 dark:border-white/10 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-azad-600 text-white">
              {isAdminLoggedIn ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Goonj '26 Admin Control Console</span>
                {isAdminLoggedIn && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                    Live Session
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official tournament score verification & telemetry management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Alert Toast */}
          {statusMessage && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* ================= AUTHENTICATION GATE ================= */}
          {!isAdminLoggedIn ? (
            <div className="max-w-md mx-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-azad-100 dark:bg-azad-950/80 text-azad-600 dark:text-azad-400 flex items-center justify-center shadow-inner border border-azad-200 dark:border-azad-800">
                <KeyRound className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Admin Verification Required
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Please enter the authorized tournament administrator secret key to modify live scores and events.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setAuthError(false);
                      }}
                      placeholder="Enter Admin Password..."
                      className={`w-full px-4 py-3 rounded-xl glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white border ${
                        authError
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-azad-500'
                      } text-sm focus:outline-none focus:ring-2`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {authError && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Incorrect administrative password. Access denied.</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-azad-600 hover:bg-azad-500 text-white font-bold text-sm shadow-md shadow-azad-600/30 transition-all hover:scale-[1.01]"
                >
                  Authenticate & Unlock
                </button>
              </form>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                <span>🔒 Authorized Personnel Only</span>
              </div>
            </div>
          ) : (
            /* ================= LOGGED IN ADMIN DASHBOARD ================= */
            <div className="space-y-8">
              
              {/* SECTION 1: BATCH SCORE & MEDAL CONTROLS */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gold-500" />
                      Direct Batch Score & Medal Steppers
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Modifying scores immediately re-ranks all batches and updates the "Last Updated" timestamp.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeEdition.teams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 rounded-xl glass-card border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      {/* Batch Identity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{team.crest}</span>
                          <div>
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {formatBatchName(team.name || team.id)}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              Rank #{team.rank}
                            </span>
                          </div>
                        </div>

                        {/* Current Score Display */}
                        <div className="text-right">
                          <span className="text-xl font-black font-tabular text-azad-600 dark:text-azad-400">
                            {team.score}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-semibold">points</span>
                        </div>
                      </div>

                      {/* Quick Stepper Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Points:</span>
                        <button
                          onClick={() => updateTeamScore(team.id, 10, true)}
                          className="px-2 py-1 text-xs font-bold rounded-md bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => updateTeamScore(team.id, 25, true)}
                          className="px-2 py-1 text-xs font-bold rounded-md bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                        >
                          +25
                        </button>
                        <button
                          onClick={() => updateTeamScore(team.id, 50, true)}
                          className="px-2 py-1 text-xs font-bold rounded-md bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => updateTeamScore(team.id, -10, true)}
                          className="px-2 py-1 text-xs font-bold rounded-md bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800"
                        >
                          -10
                        </button>
                      </div>

                      {/* Medal Steppers */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Medals:</span>
                        <div className="flex items-center gap-3">
                          {/* Gold */}
                          <div className="flex items-center gap-1">
                            <span title="Gold Medals">🥇</span>
                            <span className="font-mono font-bold">{team.gold}</span>
                            <button
                              onClick={() => updateTeamMedals(team.id, team.gold + 1, team.silver, team.bronze)}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center hover:bg-slate-300"
                            >
                              +
                            </button>
                          </div>
                          {/* Silver */}
                          <div className="flex items-center gap-1">
                            <span title="Silver Medals">🥈</span>
                            <span className="font-mono font-bold">{team.silver}</span>
                            <button
                              onClick={() => updateTeamMedals(team.id, team.gold, team.silver + 1, team.bronze)}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center hover:bg-slate-300"
                            >
                              +
                            </button>
                          </div>
                          {/* Bronze */}
                          <div className="flex items-center gap-1">
                            <span title="Bronze Medals">🥉</span>
                            <span className="font-mono font-bold">{team.bronze}</span>
                            <button
                              onClick={() => updateTeamMedals(team.id, team.gold, team.silver, team.bronze + 1)}
                              className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 font-bold flex items-center justify-center hover:bg-slate-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: ADD NEW EVENT RESULT */}
              <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-azad-500" />
                  Log New Completed Competition
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Automatically calculates 1st, 2nd, and 3rd place points and credits the winner batches.
                </p>

                <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                      Event Title / Match Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Inter-Batch Cricket Final, Nukkad Natak, Medical Trivia..."
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-azad-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                      Category
                    </label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-azad-500"
                    >
                      <option value="sports">Sports Arena</option>
                      <option value="cultural">Cultural Euphoria</option>
                      <option value="literary">Literary & Quiz</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                      Winner (1st Place / Gold)
                    </label>
                    <select
                      value={winnerId}
                      onChange={(e) => setWinnerId(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-azad-500"
                    >
                      {activeEdition.teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {formatBatchName(t.name || t.id)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                      Runner-up (2nd Place / Silver)
                    </label>
                    <select
                      value={runnerUpId}
                      onChange={(e) => setRunnerUpId(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-azad-500"
                    >
                      {activeEdition.teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {formatBatchName(t.name || t.id)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                      Winner Points
                    </label>
                    <input
                      type="number"
                      value={pointsAwarded}
                      onChange={(e) => setPointsAwarded(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-azad-500"
                      min={10}
                      max={200}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main Ground, LT-1, Open Air Amphitheatre"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg glass-card bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-azad-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-azad-600 hover:bg-azad-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Commit Event & Award</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION 3: TIMESTAMP OVERRIDE & DATA BACKUP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Timestamp management */}
                <div className="p-4 rounded-xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Clock className="w-4 h-4 text-azad-500" />
                    <span>Timestamp Telemetry</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current recorded timestamp: <br />
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {activeEdition.lastUpdated}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateLastUpdatedTime();
                        setStatusMessage('Timestamp updated to current real-world time!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      Force Update to Now
                    </button>
                  </div>
                </div>

                {/* JSON Data Backup / Export / Import */}
                <div className="p-4 rounded-xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>Export / Import Backup</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Save tournament state or import across devices (useful for Vercel static deployments).
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={exportDataJson}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON</span>
                    </button>

                    <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to reset to initial seed data?')) {
                          resetToDefault();
                          setStatusMessage('Database reset to initial Goonj 26 seed data.');
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 text-xs font-semibold"
                      title="Reset all changes"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Authentication:</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
              {isAdminLoggedIn ? 'Active (Full Write)' : 'Locked'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={logoutAdmin}
                className="text-rose-500 hover:underline font-semibold"
              >
                Log Out
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
