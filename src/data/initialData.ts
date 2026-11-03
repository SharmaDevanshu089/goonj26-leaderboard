import { TournamentEdition } from '../types/leaderboard';

export const INITIAL_GOONJ_26: TournamentEdition = {
  id: 'goonj26',
  name: "Goonj '26",
  shortName: "Goonj '26",
  year: 2026,
  isLive: true,
  themeTitle: "Annual Championship",
  lastUpdated: new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) + " IST",
  teams: [
    {
      id: 'b2023',
      name: '2023',
      subname: 'Batch 2023',
      crest: '',
      tagline: '',
      score: 11300,
      rank: 1,
      prevRank: 1,
      gold: 1,
      silver: 1,
      bronze: 1,
      sportsScore: 9700,
      culturalScore: 1600,
      literaryScore: 0
    },
    {
      id: 'b2024',
      name: '2024',
      subname: 'Batch 2024',
      crest: '',
      tagline: '',
      score: 7800,
      rank: 2,
      prevRank: 2,
      gold: 2,
      silver: 3,
      bronze: 0,
      sportsScore: 4500,
      culturalScore: 2700,
      literaryScore: 600
    },
    {
      id: 'b2025',
      name: '2025',
      subname: 'Batch 2025',
      crest: '',
      tagline: '',
      score: 6900,
      rank: 3,
      prevRank: 3,
      gold: 1,
      silver: 2,
      bronze: 2,
      sportsScore: 3600,
      culturalScore: 2100,
      literaryScore: 1200
    },
    {
      id: 'b2026',
      name: '2026',
      subname: 'Batch 2026',
      crest: '',
      tagline: '',
      score: 6450,
      rank: 4,
      prevRank: 4,
      gold: 3,
      silver: 0,
      bronze: 1,
      sportsScore: 3700,
      culturalScore: 2750,
      literaryScore: 0
    },
    {
      id: 'b2021',
      name: '2021',
      subname: 'Batch 2021',
      crest: '',
      tagline: '',
      score: 4500,
      rank: 5,
      prevRank: 5,
      gold: 0,
      silver: 1,
      bronze: 1,
      sportsScore: 4000,
      culturalScore: 500,
      literaryScore: 0
    },
    {
      id: 'b2022',
      name: '2022',
      subname: 'Batch 2022',
      crest: '',
      tagline: '',
      score: 0,
      rank: 6,
      prevRank: 6,
      gold: 0,
      silver: 0,
      bronze: 0,
      sportsScore: 0,
      culturalScore: 0,
      literaryScore: 0
    }
  ],
  events: [
    {
      id: 'ev-sports-meet',
      title: 'Annual Sports Meet (Overall Points)',
      category: 'sports',
      winnerBatchId: 'b2023',
      runnerUpBatchId: 'b2024',
      thirdPlaceBatchId: 'b2021',
      pointsAwarded: 9700,
      placements: [
        { batchId: '2023', points: 9700 },
        { batchId: '2024', points: 4500 },
        { batchId: '2021', points: 4000 }
      ],
      status: 'completed'
    },
    {
      id: 'ev-kapture',
      title: 'Kapture Color Quest',
      category: 'cultural',
      winnerBatchId: 'b2026',
      runnerUpBatchId: 'b2025',
      pointsAwarded: 1050,
      placements: [
        { batchId: '2026', points: 1050 },
        { batchId: '2025', points: 200 }
      ],
      status: 'completed'
    },
    {
      id: 'ev-nachomania',
      title: 'Nach-o-mania',
      category: 'cultural',
      winnerBatchId: 'b2024',
      runnerUpBatchId: 'b2023',
      thirdPlaceBatchId: 'b2025',
      pointsAwarded: 1100,
      placements: [
        { batchId: '2024', points: 1100 },
        { batchId: '2023', points: 900 },
        { batchId: '2025', points: 700 }
      ],
      status: 'completed'
    },
    {
      id: 'ev-groovegala',
      title: 'Groove Gala',
      category: 'cultural',
      winnerBatchId: 'b2024',
      runnerUpBatchId: 'b2025',
      thirdPlaceBatchId: 'b2023',
      pointsAwarded: 1100,
      placements: [
        { batchId: '2024', points: 1100 },
        { batchId: '2025', points: 900 },
        { batchId: '2023', points: 700 }
      ],
      status: 'completed'
    },
    {
      id: 'ev-tapandtint',
      title: 'Tap and Tint',
      category: 'cultural',
      winnerBatchId: 'b2026',
      runnerUpBatchId: 'b2024',
      thirdPlaceBatchId: 'b2025',
      pointsAwarded: 700,
      placements: [
        { batchId: '2026', points: 700 },
        { batchId: '2024', points: 500 },
        { batchId: '2025', points: 300 }
      ],
      status: 'completed'
    },
    {
      id: 'ev-medbuild',
      title: 'MedBuild',
      category: 'literary',
      winnerBatchId: 'b2025',
      runnerUpBatchId: 'b2024',
      pointsAwarded: 1200,
      placements: [
        { batchId: '2025', points: 1200 },
        { batchId: '2024', points: 600 }
      ],
      status: 'completed'
    },
    {
      id: 'ev-sfcompetition',
      title: 'SF Competition',
      category: 'cultural',
      winnerBatchId: 'b2026',
      runnerUpBatchId: 'b2021',
      thirdPlaceBatchId: 'b2026',
      pointsAwarded: 700,
      placements: [
        { batchId: '2026', points: 700 },
        { batchId: '2021', points: 500 },
        { batchId: '2026', points: 300 }
      ],
      status: 'completed'
    }
  ]
};
