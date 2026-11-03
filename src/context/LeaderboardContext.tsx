import React, { createContext, useContext, useEffect, useState } from 'react';
import { BatchTeam, EventResult, TournamentEdition, EventCategory } from '../types/leaderboard';
import { INITIAL_GOONJ_26 } from '../data/initialData';
import { HISTORICAL_EDITIONS } from '../data/historicalData';

export const ADMIN_PASSWORD = "I_AM_GONNA_GIVE_DEVANSHU_A_HUGE_PARTY";
const STORAGE_KEY = 'goonj26_noticeboard_v4';
const AUTH_STORAGE_KEY = 'goonj26_admin_auth';

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
    if (password === ADMIN_PASSWORD) {
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

  const updateTeamScore = (teamId: string, deltaOrExact: number, isDelta: boolean = true) => {
    const newTimestamp = getFormattedCurrentTimestamp();
    setEditions(prev => {
      const cur = prev.goonj26;
      const updatedTeams = cur.teams.map(t => {
        if (t.id === teamId) {
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
        if (t.id === teamId) {
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
    const newTimestamp = getFormattedCurrentTimestamp();
    const newEvent: EventResult = {
      ...eventData,
      id: `ev-${Date.now()}`
    };

    setEditions(prev => {
      const cur = prev.goonj26;
      // Add points to winner
      const points = newEvent.pointsAwarded;
      const updatedTeams = cur.teams.map(t => {
        if (t.id === newEvent.winnerBatchId) {
          const cat = newEvent.category;
          return {
            ...t,
            score: t.score + points,
            gold: t.gold + 1,
            sportsScore: cat === 'sports' ? t.sportsScore + points : t.sportsScore,
            culturalScore: cat === 'cultural' ? t.culturalScore + points : t.culturalScore,
            literaryScore: cat === 'literary' ? t.literaryScore + points : t.literaryScore
          };
        }
        if (t.id === newEvent.runnerUpBatchId) {
          const runnerPoints = Math.floor(points * 0.5);
          const cat = newEvent.category;
          return {
            ...t,
            score: t.score + runnerPoints,
            silver: t.silver + 1,
            sportsScore: cat === 'sports' ? t.sportsScore + runnerPoints : t.sportsScore,
            culturalScore: cat === 'cultural' ? t.culturalScore + runnerPoints : t.culturalScore,
            literaryScore: cat === 'literary' ? t.literaryScore + runnerPoints : t.literaryScore
          };
        }
        if (newEvent.thirdPlaceBatchId && t.id === newEvent.thirdPlaceBatchId) {
          const thirdPoints = Math.floor(points * 0.25);
          const cat = newEvent.category;
          return {
            ...t,
            score: t.score + thirdPoints,
            bronze: t.bronze + 1,
            sportsScore: cat === 'sports' ? t.sportsScore + thirdPoints : t.sportsScore,
            culturalScore: cat === 'cultural' ? t.culturalScore + thirdPoints : t.culturalScore,
            literaryScore: cat === 'literary' ? t.literaryScore + thirdPoints : t.literaryScore
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
          teams: ranked,
          events: [newEvent, ...cur.events]
        }
      };
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
