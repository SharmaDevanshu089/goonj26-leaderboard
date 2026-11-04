import React, { createContext, useContext, useEffect, useState } from 'react';
import { BatchTeam, EventResult, TournamentEdition, EventCategory, EventPlacement } from '../types/leaderboard';
import { INITIAL_GOONJ_26 } from '../data/initialData';
import { HISTORICAL_EDITIONS } from '../data/historicalData';
import { formatBatchName } from '../utils/formatters';

export const DEFAULT_ADMIN_PASSWORD = "I_AM_GONNA_GIVE_DEVANSHU_A_HUGE_PARTY";
export const ADMIN_PASSWORD = DEFAULT_ADMIN_PASSWORD;

const STORAGE_KEY = 'goonj26_noticeboard_v8';
const AUTH_STORAGE_KEY = 'goonj26_admin_auth';
const PWD_STORAGE_KEY = 'goonj26_admin_pwd';

export interface SaveEventParams {
  id?: string;
  title: string;
  category: 'sports' | 'cultural' | 'literary';
  batchPoints: Record<string, number>;
}

interface LeaderboardContextType {
  activeEdition: TournamentEdition;
  selectedEditionId: string;
  selectEdition: (id: string) => void;
  availableEditions: { id: string; name: string; isLive: boolean; year: number }[];
  activeCategory: EventCategory;
  setActiveCategory: (cat: EventCategory) => void;
  lastUpdated: string;
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => boolean;
  saveEventResult: (params: SaveEventParams) => void;
  deleteEventResult: (eventId: string) => void;
  updateTeamScore: (teamId: string, deltaOrExact: number, isDelta?: boolean) => void;
  updateTeamMedals: (teamId: string, gold: number, silver: number, bronze: number) => void;
  addEventResult: (event: Omit<EventResult, 'id'>) => void;
  updateLastUpdatedTime: (customTime?: string) => void;
  resetToDefault: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

function getFormattedCurrentTimestamp(): string {
  const now = new Date();
  return now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) + ' IST';
}

function calculateRanks(teams: BatchTeam[]): BatchTeam[] {
  // Sort teams descending by score, tiebreak by gold, then silver
  const sorted = [...teams].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.gold !== a.gold) return b.gold - a.gold;
    return b.silver - a.silver;
  });

  return sorted.map((team, index) => ({
    ...team,
    prevRank: team.rank || index + 1,
    rank: index + 1
  }));
}

export function recalculateEditionFromEvents(currentTeams: BatchTeam[], events: EventResult[]): BatchTeam[] {
  const batchYearList = ['2021', '2022', '2023', '2024', '2025', '2026'];

  const statsMap: Record<string, {
    score: number;
    sportsScore: number;
    culturalScore: number;
    literaryScore: number;
    gold: number;
    silver: number;
    bronze: number;
  }> = {};

  for (const year of batchYearList) {
    statsMap[year] = {
      score: 0,
      sportsScore: 0,
      culturalScore: 0,
      literaryScore: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
    };
  }

  for (const ev of events) {
    const placements = ev.placements && ev.placements.length > 0
      ? ev.placements
      : [
          ...(ev.winnerBatchId ? [{ batchId: ev.winnerBatchId, points: ev.pointsAwarded || 0 }] : []),
          ...(ev.runnerUpBatchId ? [{ batchId: ev.runnerUpBatchId, points: Math.floor((ev.pointsAwarded || 0) * 0.5) }] : []),
          ...(ev.thirdPlaceBatchId ? [{ batchId: ev.thirdPlaceBatchId, points: Math.floor((ev.pointsAwarded || 0) * 0.25) }] : [])
        ];

    // Aggregate by batch year
    const aggregated: Record<string, number> = {};
    for (const p of placements) {
      const year = formatBatchName(p.batchId);
      aggregated[year] = (aggregated[year] || 0) + (Number(p.points) || 0);
    }

    // Sort descending by points
    const sorted = Object.entries(aggregated).sort((a, b) => b[1] - a[1]);

    sorted.forEach(([year, pts], idx) => {
      if (!statsMap[year]) {
        statsMap[year] = { score: 0, sportsScore: 0, culturalScore: 0, literaryScore: 0, gold: 0, silver: 0, bronze: 0 };
      }

      statsMap[year].score += pts;
      if (ev.category === 'sports') {
        statsMap[year].sportsScore += pts;
      } else if (ev.category === 'literary') {
        statsMap[year].literaryScore += pts;
      } else {
        statsMap[year].culturalScore += pts;
      }

      // Medals for top 3
      if (idx === 0 && pts > 0) statsMap[year].gold += 1;
      else if (idx === 1 && pts > 0) statsMap[year].silver += 1;
      else if (idx === 2 && pts > 0) statsMap[year].bronze += 1;
    });
  }

  const updatedTeams = currentTeams.map(team => {
    const year = formatBatchName(team.name || team.id);
    const stats = statsMap[year] || { score: 0, sportsScore: 0, culturalScore: 0, literaryScore: 0, gold: 0, silver: 0, bronze: 0 };
    return {
      ...team,
      score: stats.score,
      sportsScore: stats.sportsScore,
      culturalScore: stats.culturalScore,
      literaryScore: stats.literaryScore,
      gold: stats.gold,
      silver: stats.silver,
      bronze: stats.bronze
    };
  });

  return calculateRanks(updatedTeams);
}

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editions, setEditions] = useState<Record<string, TournamentEdition>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.goonj26) {
          return {
            ...HISTORICAL_EDITIONS,
            ...parsed
          };
        }
      }
    } catch (e) {
      console.error('Failed to load saved leaderboard data', e);
    }
    return {
      goonj26: INITIAL_GOONJ_26,
      ...HISTORICAL_EDITIONS
    };
  });

  const [selectedEditionId, setSelectedEditionId] = useState<string>('goonj26');
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all');
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(PWD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editions));
    } catch (e) {
      console.error('Failed to save leaderboard data', e);
    }
  }, [editions]);

  const activeEdition = editions[selectedEditionId] || editions.goonj26;

  const selectEdition = (id: string) => {
    if (editions[id]) {
      setSelectedEditionId(id);
    }
  };

  const availableEditions = [
    { id: 'goonj26', name: "Goonj '26 (Live Current)", isLive: true, year: 2026 },
    { id: 'goonj25', name: "Goonj '25 (Past Edition)", isLive: false, year: 2025 },
    { id: 'goonj24', name: "Goonj '24 (Past Edition)", isLive: false, year: 2024 }
  ];

  const loginAdmin = (password: string): boolean => {
    const trimmed = password.trim();
    if (trimmed === adminPassword || trimmed === DEFAULT_ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const changeAdminPassword = (newPassword: string): boolean => {
    if (!newPassword || newPassword.trim().length === 0) return false;
    const trimmed = newPassword.trim();
    setAdminPassword(trimmed);
    localStorage.setItem(PWD_STORAGE_KEY, trimmed);
    return true;
  };

  const updateLastUpdatedTime = (customTime?: string) => {
    const timestamp = customTime || getFormattedCurrentTimestamp();
    setEditions(prev => {
      const cur = prev.goonj26;
      return {
        ...prev,
        goonj26: {
          ...cur,
          lastUpdated: timestamp
        }
      };
    });
  };

  const saveEventResult = (params: SaveEventParams) => {
    const newTimestamp = getFormattedCurrentTimestamp();
    const eventCategory = params.category || 'cultural';

    // Convert batchPoints into sorted placements (> 0, descending)
    const placements: EventPlacement[] = Object.entries(params.batchPoints)
      .map(([batchId, points]) => ({
        batchId: formatBatchName(batchId),
        points: Number(points) || 0
      }))
      .filter(p => p.points > 0)
      .sort((a, b) => b.points - a.points);

    const winnerBatchId = placements[0]?.batchId || '';
    const runnerUpBatchId = placements[1]?.batchId || '';
    const thirdPlaceBatchId = placements[2]?.batchId || '';
    const pointsAwarded = placements[0]?.points || 0;

    const eventId = params.id || `ev-${Date.now()}`;
    const targetEvent: EventResult = {
      id: eventId,
      title: params.title.trim(),
      category: eventCategory,
      winnerBatchId,
      runnerUpBatchId,
      thirdPlaceBatchId,
      pointsAwarded,
      placements,
      status: 'completed',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setEditions(prev => {
      const cur = prev.goonj26;
      let newEvents: EventResult[];

      if (params.id) {
        // Update existing event
        newEvents = cur.events.map(ev => (ev.id === params.id ? targetEvent : ev));
      } else {
        // Add new event
        newEvents = [targetEvent, ...cur.events];
      }

      const updatedTeams = recalculateEditionFromEvents(cur.teams, newEvents);

      return {
        ...prev,
        goonj26: {
          ...cur,
          lastUpdated: newTimestamp,
          teams: updatedTeams,
          events: newEvents
        }
      };
    });
  };

  const deleteEventResult = (eventId: string) => {
    const newTimestamp = getFormattedCurrentTimestamp();
    setEditions(prev => {
      const cur = prev.goonj26;
      const newEvents = cur.events.filter(ev => ev.id !== eventId);
      const updatedTeams = recalculateEditionFromEvents(cur.teams, newEvents);

      return {
        ...prev,
        goonj26: {
          ...cur,
          lastUpdated: newTimestamp,
          teams: updatedTeams,
          events: newEvents
        }
      };
    });
  };

  const updateTeamScore = (teamId: string, deltaOrExact: number, isDelta: boolean = true) => {
    const newTimestamp = getFormattedCurrentTimestamp();
    setEditions(prev => {
      const cur = prev.goonj26;
      const updatedTeams = cur.teams.map(t => {
        if (t.id === teamId || formatBatchName(t.name || t.id) === formatBatchName(teamId)) {
          const newScore = isDelta ? Math.max(0, t.score + deltaOrExact) : Math.max(0, deltaOrExact);
          return {
            ...t,
            score: newScore
          };
        }
        return t;
      });

      const ranked = calculateRanks(updatedTeams);

      return {
        ...prev,
        goonj26: {
          ...cur,
          lastUpdated: newTimestamp,
          teams: ranked
        }
      };
    });
  };

  const updateTeamMedals = (teamId: string, gold: number, silver: number, bronze: number) => {
    const newTimestamp = getFormattedCurrentTimestamp();
    setEditions(prev => {
      const cur = prev.goonj26;
      const updatedTeams = cur.teams.map(t => {
        if (t.id === teamId || formatBatchName(t.name || t.id) === formatBatchName(teamId)) {
          return {
            ...t,
            gold: Math.max(0, gold),
            silver: Math.max(0, silver),
            bronze: Math.max(0, bronze)
          };
        }
        return t;
      });

      const ranked = calculateRanks(updatedTeams);

      return {
        ...prev,
        goonj26: {
          ...cur,
          lastUpdated: newTimestamp,
          teams: ranked
        }
      };
    });
  };

  const addEventResult = (eventData: Omit<EventResult, 'id'>) => {
    // Adapter for backward compatibility
    const batchPoints: Record<string, number> = {};
    if (eventData.placements && eventData.placements.length > 0) {
      eventData.placements.forEach(p => {
        batchPoints[p.batchId] = p.points;
      });
    } else {
      if (eventData.winnerBatchId) batchPoints[eventData.winnerBatchId] = eventData.pointsAwarded || 0;
      if (eventData.runnerUpBatchId) batchPoints[eventData.runnerUpBatchId] = Math.floor((eventData.pointsAwarded || 0) * 0.5);
      if (eventData.thirdPlaceBatchId) batchPoints[eventData.thirdPlaceBatchId] = Math.floor((eventData.pointsAwarded || 0) * 0.25);
    }

    saveEventResult({
      title: eventData.title,
      category: eventData.category || 'cultural',
      batchPoints
    });
  };

  const resetToDefault = () => {
    const fresh = {
      goonj26: {
        ...INITIAL_GOONJ_26,
        lastUpdated: getFormattedCurrentTimestamp()
      },
      ...HISTORICAL_EDITIONS
    };
    setEditions(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportDataJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `goonj26_leaderboard_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.goonj26 && parsed.goonj26.teams) {
        setEditions(parsed);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  return (
    <LeaderboardContext.Provider
      value={{
        activeEdition,
        selectedEditionId,
        selectEdition,
        availableEditions,
        activeCategory,
        setActiveCategory,
        lastUpdated: activeEdition.lastUpdated,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        saveEventResult,
        deleteEventResult,
        updateTeamScore,
        updateTeamMedals,
        addEventResult,
        updateLastUpdatedTime,
        resetToDefault,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = (): LeaderboardContextType => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};
