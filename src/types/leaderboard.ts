export interface BatchTeam {
  id: string;
  name: string;
  subname: string;
  crest: string;
  tagline: string;
  score: number;
  rank: number;
  prevRank: number;
  gold: number;
  silver: number;
  bronze: number;
  sportsScore: number;
  culturalScore: number;
  literaryScore: number;
}

export type EventCategory = 'all' | 'sports' | 'cultural' | 'literary';

export interface EventPlacement {
  batchId: string;
  points: number;
}

export interface EventResult {
  id: string;
  title: string;
  category?: 'sports' | 'cultural' | 'literary';
  winnerBatchId?: string;
  runnerUpBatchId?: string;
  thirdPlaceBatchId?: string;
  pointsAwarded?: number;
  placements?: EventPlacement[];
  date?: string;
  venue?: string;
  status?: 'completed' | 'ongoing' | 'upcoming';
}

export interface TournamentEdition {
  id: string;
  name: string;
  shortName: string;
  year: number;
  isLive: boolean;
  themeTitle: string;
  lastUpdated: string;
  championBatchName?: string;
  runnerUpBatchName?: string;
  teams: BatchTeam[];
  events: EventResult[];
}

export interface LeaderboardState {
  currentEditionId: string;
  editions: Record<string, TournamentEdition>;
  lastUpdated: string;
}
