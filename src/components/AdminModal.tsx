import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Plus,
  RotateCcw,
  Download,
  Upload,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Check
} from 'lucide-react';
import { useLeaderboard } from '../context/LeaderboardContext';
import { formatBatchName } from '../utils/formatters';
import { EventResult } from '../types/leaderboard';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_BATCH_YEARS = ['2021', '2022', '2023', '2024', '2025', '2026'];

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    activeEdition,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    saveEventResult,
    deleteEventResult,
    updateTeamScore,
    updateTeamMedals,
    updateLastUpdatedTime,
    resetToDefault,
    exportDataJson,
    importDataJson
  } = useLeaderboard();

  // Navigation tab in Admin
  const [activeTab, setActiveTab] = useState<'events' | 'standings' | 'backup'>('events');

  // Auth form state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Status Toast Message
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Event Form State (Add / Edit)
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'sports' | 'cultural'>('cultural');
  const [batchPoints, setBatchPoints] = useState<Record<string, string>>({
    '2021': '',
    '2022': '',
    '2023': '',
    '2024': '',
    '2025': '',
    '2026': ''
  });
  const [eventSearchQuery, setEventSearchQuery] = useState('');

  const formRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss status toast after 4s
  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (success) {
      setAuthError(false);
      setPasswordInput('');
      showToast('Admin verification successful! Welcome to Control Console.');
    } else {
      setAuthError(true);
    }
  };

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventTitle('');
    setEventCategory('cultural');
    setBatchPoints({
      '2021': '',
      '2022': '',
      '2023': '',
      '2024': '',
      '2025': '',
      '2026': ''
    });
  };

  const handleEditClick = (event: EventResult) => {
    setEditingEventId(event.id);
    setEventTitle(event.title);
    setEventCategory(event.category === 'sports' ? 'sports' : 'cultural');

    const pointsMap: Record<string, string> = {
      '2021': '',
      '2022': '',
      '2023': '',
      '2024': '',
      '2025': '',
      '2026': ''
    };

    if (event.placements && event.placements.length > 0) {
      event.placements.forEach(p => {
        const year = formatBatchName(p.batchId);
        if (pointsMap[year] !== undefined) {
          const currentPts = Number(pointsMap[year]) || 0;
          pointsMap[year] = String(currentPts + p.points);
        }
      });
    } else {
      if (event.winnerBatchId) {
        const y = formatBatchName(event.winnerBatchId);
        if (pointsMap[y] !== undefined) pointsMap[y] = String(event.pointsAwarded || 0);
      }
      if (event.runnerUpBatchId) {
        const y = formatBatchName(event.runnerUpBatchId);
        if (pointsMap[y] !== undefined) pointsMap[y] = String(Math.floor((event.pointsAwarded || 0) * 0.5));
      }
      if (event.thirdPlaceBatchId) {
        const y = formatBatchName(event.thirdPlaceBatchId);
        if (pointsMap[y] !== undefined) pointsMap[y] = String(Math.floor((event.pointsAwarded || 0) * 0.25));
      }
    }

    setBatchPoints(pointsMap);
    setActiveTab('events');

    // Scroll smoothly to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      showToast('Please enter an event title.', 'error');
      return;
    }

    const numericPoints: Record<string, number> = {};
    let totalAssigned = 0;

    ALL_BATCH_YEARS.forEach(yr => {
      const val = Number(batchPoints[yr]) || 0;
      numericPoints[yr] = val;
      if (val > 0) totalAssigned += val;
    });

    if (totalAssigned === 0) {
      showToast('Please enter points for at least one batch.', 'error');
      return;
    }

    saveEventResult({
      id: editingEventId || undefined,
      title: eventTitle.trim(),
      category: eventCategory,
      batchPoints: numericPoints
    });

    showToast(
      editingEventId
        ? `Event "${eventTitle.trim()}" successfully updated & standings recalculated!`
        : `Event "${eventTitle.trim()}" recorded & standings recalculated!`
    );

    resetEventForm();
  };

  const handleDeleteEvent = (event: EventResult) => {
    if (confirm(`Are you sure you want to delete "${event.title}"? Points and standings will be recalculated.`)) {
      deleteEventResult(event.id);
      showToast(`Event "${event.title}" deleted.`);
      if (editingEventId === event.id) {
        resetEventForm();
      }
    }
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
          showToast('Data imported successfully from JSON backup!');
        } else {
          showToast('Failed to import JSON: Invalid format.', 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  // Compute live preview of descending order from batchPoints input
  const liveSortedPreview = Object.entries(batchPoints)
    .map(([year, pts]) => ({ year, points: Number(pts) || 0 }))
    .filter(item => item.points > 0)
    .sort((a, b) => b.points - a.points);

  const medalEmojis = ['🥇', '🥈', '🥉'];

  // Filter events by search query
  const filteredEvents = activeEdition.events.filter(ev =>
    ev.title.toLowerCase().includes(eventSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900">
              {isAdminLoggedIn ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 leading-none">
                <span>Goonj '26 Admin Console</span>
                {isAdminLoggedIn && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                    Live Session
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Official tournament score verification & notice board management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Admin Modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Toast Alert */}
        {statusMessage && (
          <div
            className={`px-5 py-2.5 flex items-center gap-2 text-xs font-semibold ${
              statusMessage.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-b border-rose-200 dark:border-rose-900'
                : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-b border-emerald-200 dark:border-emerald-900'
            }`}
          >
            {statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* ================= UNAUTHENTICATED STATE ================= */}
        {!isAdminLoggedIn ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-inner border border-slate-200 dark:border-slate-700">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Admin Verification Required
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter the administrator secret password to access and update live points.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError(false);
                    }}
                    placeholder="Enter Admin Password..."
                    className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white border ${
                      authError
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-slate-800'
                    } text-sm focus:outline-none focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authError && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-500 text-left">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Incorrect password. Access denied.</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow transition-all"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        ) : (
          /* ================= AUTHENTICATED STATE ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 px-4 pt-2 gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x ${
                  activeTab === 'events'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white -mb-px'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Events Manager</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800">
                  {activeEdition.events.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('standings')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x ${
                  activeTab === 'standings'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white -mb-px'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Batch Standings</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-lg transition-colors border-t border-x ${
                  activeTab === 'backup'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white -mb-px'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup & Reset</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* ================= TAB 1: EVENTS MANAGER ================= */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  
                  {/* ADD / EDIT EVENT CARD */}
                  <div
                    ref={formRef}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
                      editingEventId
                        ? 'border-amber-400 dark:border-amber-500/60 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            editingEventId
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          }`}
                        >
                          {editingEventId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {editingEventId ? `Editing Event: ${eventTitle || 'Untitled'}` : 'Add / Log Event'}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Enter points for each batch. Batches are automatically ordered from highest to lowest!
                          </p>
                        </div>
                      </div>

                      {editingEventId && (
                        <button
                          type="button"
                          onClick={resetEventForm}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveEvent} className="space-y-4">
                      
                      {/* Event Title & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Event Title *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Table Tennis, Nukkad Natak, Cricket Final..."
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            required
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                            Event Category
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setEventCategory('cultural')}
                              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                eventCategory === 'cultural'
                                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                              }`}
                            >
                              🎭 Cultural
                            </button>
                            <button
                              type="button"
                              onClick={() => setEventCategory('sports')}
                              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                                eventCategory === 'sports'
                                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                              }`}
                            >
                              ⚽ Sports
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* BATCH POINTS GRID */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Points Scored By Each Batch
                          </label>
                          <span className="text-[10px] text-slate-400">
                            Leave 0 or blank for batches that didn't score
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                          {ALL_BATCH_YEARS.map((year) => (
                            <div
                              key={year}
                              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex flex-col justify-between"
                            >
                              <span className="text-xs font-black text-slate-800 dark:text-slate-200 mb-1.5">
                                Batch {year}
                              </span>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={batchPoints[year]}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setBatchPoints((prev) => ({
                                      ...prev,
                                      [year]: val
                                    }));
                                  }}
                                  className="w-full pl-2.5 pr-8 py-1.5 text-xs sm:text-sm font-bold font-mono rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-800 dark:focus:ring-white"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                                  pts
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* LIVE DESCENDING ORDER PREVIEW */}
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Automatic Descending Order Preview
                        </span>
                        {liveSortedPreview.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {liveSortedPreview.map((item, idx) => (
                              <div
                                key={item.year}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs"
                              >
                                <span>{medalEmojis[idx] || `#${idx + 1}`}</span>
                                <span className="font-extrabold text-slate-900 dark:text-white">{item.year}</span>
                                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                                  {item.points.toLocaleString()} pts
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Enter points in any batch box above to preview automatic order
                          </span>
                        )}
                      </div>

                      {/* SUBMIT BUTTON */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        {editingEventId && (
                          <button
                            type="button"
                            onClick={resetEventForm}
                            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>{editingEventId ? 'Update Event & Recalculate' : 'Save Event & Update Standings'}</span>
                        </button>
                      </div>

                    </form>
                  </div>

                  {/* EXISTING EVENTS LIST */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          Recorded Events ({activeEdition.events.length})
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Click "Edit" on any event to modify points or title.
                        </p>
                      </div>

                      {/* Search Filter */}
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search events..."
                          value={eventSearchQuery}
                          onChange={(e) => setEventSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-800 dark:focus:ring-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {filteredEvents.map((ev) => {
                        const placements = ev.placements && ev.placements.length > 0
                          ? ev.placements
                          : [
                              ...(ev.winnerBatchId ? [{ batchId: ev.winnerBatchId, points: ev.pointsAwarded || 0 }] : []),
                              ...(ev.runnerUpBatchId ? [{ batchId: ev.runnerUpBatchId, points: Math.floor((ev.pointsAwarded || 0) * 0.5) }] : []),
                              ...(ev.thirdPlaceBatchId ? [{ batchId: ev.thirdPlaceBatchId, points: Math.floor((ev.pointsAwarded || 0) * 0.25) }] : [])
                            ];

                        const isBeingEdited = editingEventId === ev.id;

                        return (
                          <div
                            key={ev.id}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isBeingEdited
                                ? 'border-amber-400 bg-amber-50/30 dark:border-amber-500/60 dark:bg-amber-950/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                    {ev.title}
                                  </h5>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      ev.category === 'sports'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900'
                                    }`}
                                  >
                                    {ev.category === 'sports' ? '⚽ Sports' : '🎭 Cultural'}
                                  </span>
                                </div>

                                {/* Placements preview in order */}
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {placements.map((p, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300"
                                    >
                                      <span>{medalEmojis[idx] || `#${idx + 1}`}</span>
                                      <span className="font-bold">{formatBatchName(p.batchId)}:</span>
                                      <span className="font-mono text-slate-600 dark:text-slate-400">
                                        {p.points.toLocaleString()} pts
                                      </span>
                                      {idx < placements.length - 1 && <span className="text-slate-300 dark:text-slate-700">•</span>}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Edit & Delete Action Buttons */}
                              <div className="flex items-center gap-1.5 self-end sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(ev)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEvent(ev)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* ================= TAB 2: BATCH STANDINGS ================= */}
              {activeTab === 'standings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Batch Standings & Manual Overrides
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Scores automatically reflect all recorded events. Use steppers below for manual delta tweaks if needed.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeEdition.teams.map((team) => (
                      <div
                        key={team.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {team.rank === 1 ? '🥇' : team.rank === 2 ? '🥈' : team.rank === 3 ? '🥉' : `#${team.rank}`}
                            </span>
                            <div>
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                                Batch {formatBatchName(team.name || team.id)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Sports: {team.sportsScore?.toLocaleString() || 0} pts
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                              {team.score.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">pts total</span>
                          </div>
                        </div>

                        {/* Quick Steppers */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Manual Points:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateTeamScore(team.id, 50, true)}
                              className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200"
                            >
                              +50
                            </button>
                            <button
                              onClick={() => updateTeamScore(team.id, 10, true)}
                              className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => updateTeamScore(team.id, -10, true)}
                              className="px-2 py-0.5 text-xs font-bold rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 hover:bg-rose-200"
                            >
                              -10
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: BACKUP & RESET ================= */}
              {activeTab === 'backup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Timestamp override */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span>Last Updated Timestamp</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Current recorded timestamp: <br />
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {activeEdition.lastUpdated}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        updateLastUpdatedTime();
                        showToast('Timestamp updated to current real-world time!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      Update Timestamp to Now
                    </button>
                  </div>

                  {/* Data JSON Backup / Export / Import */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <Download className="w-4 h-4 text-emerald-500" />
                      <span>JSON Backup & Sync</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Save tournament state to JSON or import on another device.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={exportDataJson}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export JSON</span>
                      </button>

                      <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer">
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
                            showToast('Database reset to initial Goonj 26 seed data.');
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                        title="Reset all changes"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Footer */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>Session:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Authenticated Administrator
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={logoutAdmin}
                  className="text-rose-500 hover:underline font-semibold"
                >
                  Log Out
                </button>
                <button
                  onClick={onClose}
                  className="px-3.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
