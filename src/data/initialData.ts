import { TournamentEdition } from '../types/leaderboard';

export const INITIAL_GOONJ_26: TournamentEdition = {
  id: 'goonj26',
  name: "Goonj '26",
  shortName: 'G26',
  year: 2026,
  isLive: true,
  themeTitle: 'The Annual Medical Renaissance',
  lastUpdated: new Date().toLocaleString('en-IN', {
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
        "id": "b2023",
        "name": "2023",
        "subname": "Batch 2023",
        "crest": "",
        "tagline": "",
        "score": 26350,
        "rank": 1,
        "prevRank": 1,
        "gold": 5,
        "silver": 7,
        "bronze": 2,
        "sportsScore": 18700,
        "culturalScore": 7650,
        "literaryScore": 0
    },
    {
        "id": "b2024",
        "name": "2024",
        "subname": "Batch 2024",
        "crest": "",
        "tagline": "",
        "score": 18800,
        "rank": 2,
        "prevRank": 2,
        "gold": 7,
        "silver": 5,
        "bronze": 9,
        "sportsScore": 8300,
        "culturalScore": 10500,
        "literaryScore": 0
    },
    {
        "id": "b2025",
        "name": "2025",
        "subname": "Batch 2025",
        "crest": "",
        "tagline": "",
        "score": 15500,
        "rank": 3,
        "prevRank": 3,
        "gold": 3,
        "silver": 5,
        "bronze": 9,
        "sportsScore": 6200,
        "culturalScore": 9300,
        "literaryScore": 0
    },
    {
        "id": "b2026",
        "name": "2026",
        "subname": "Batch 2026",
        "crest": "",
        "tagline": "",
        "score": 12925,
        "rank": 4,
        "prevRank": 4,
        "gold": 6,
        "silver": 5,
        "bronze": 2,
        "sportsScore": 4500,
        "culturalScore": 8425,
        "literaryScore": 0
    },
    {
        "id": "b2022",
        "name": "2022",
        "subname": "Batch 2022",
        "crest": "",
        "tagline": "",
        "score": 11850,
        "rank": 5,
        "prevRank": 5,
        "gold": 4,
        "silver": 1,
        "bronze": 2,
        "sportsScore": 7300,
        "culturalScore": 4550,
        "literaryScore": 0
    },
    {
        "id": "b2021",
        "name": "2021",
        "subname": "Batch 2021",
        "crest": "",
        "tagline": "",
        "score": 6600,
        "rank": 6,
        "prevRank": 6,
        "gold": 0,
        "silver": 2,
        "bronze": 0,
        "sportsScore": 5400,
        "culturalScore": 1200,
        "literaryScore": 0
    }
],
  events: [
    {
        "id": "ev-sports",
        "title": "Sports",
        "category": "sports",
        "winnerBatchId": "b2023",
        "runnerUpBatchId": "b2024",
        "thirdPlaceBatchId": "b2022",
        "pointsAwarded": 18700,
        "placements": [
            {
                "batchId": "2023",
                "points": 18700
            },
            {
                "batchId": "2024",
                "points": 8300
            },
            {
                "batchId": "2022",
                "points": 7300
            },
            {
                "batchId": "2025",
                "points": 6200
            },
            {
                "batchId": "2021",
                "points": 5400
            },
            {
                "batchId": "2026",
                "points": 4500
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-color-quest",
        "title": "Color Quest",
        "category": "cultural",
        "winnerBatchId": "b2026",
        "runnerUpBatchId": "b2025",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 900,
        "placements": [
            {
                "batchId": "2026",
                "points": 900
            },
            {
                "batchId": "2025",
                "points": 300
            },
            {
                "batchId": "2024",
                "points": 200
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-nach-o-mania",
        "title": "Nach-o-mania",
        "category": "cultural",
        "winnerBatchId": "b2024",
        "runnerUpBatchId": "b2023",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 1100,
        "placements": [
            {
                "batchId": "2024",
                "points": 1100
            },
            {
                "batchId": "2023",
                "points": 900
            },
            {
                "batchId": "2025",
                "points": 700
            },
            {
                "batchId": "2021",
                "points": 100
            },
            {
                "batchId": "2022",
                "points": 100
            },
            {
                "batchId": "2026",
                "points": 100
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-groove-gala",
        "title": "Groove Gala",
        "category": "cultural",
        "winnerBatchId": "b2024",
        "runnerUpBatchId": "b2025",
        "thirdPlaceBatchId": "b2023",
        "pointsAwarded": 1100,
        "placements": [
            {
                "batchId": "2024",
                "points": 1100
            },
            {
                "batchId": "2025",
                "points": 900
            },
            {
                "batchId": "2023",
                "points": 700
            },
            {
                "batchId": "2026",
                "points": 100
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-tap-n-tint",
        "title": "Tap n Tint",
        "category": "cultural",
        "winnerBatchId": "b2026",
        "runnerUpBatchId": "b2024",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 700,
        "placements": [
            {
                "batchId": "2026",
                "points": 700
            },
            {
                "batchId": "2024",
                "points": 500
            },
            {
                "batchId": "2025",
                "points": 300
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-medbuild",
        "title": "MedBuild",
        "category": "cultural",
        "winnerBatchId": "b2025",
        "runnerUpBatchId": "b2024",
        "pointsAwarded": 1200,
        "placements": [
            {
                "batchId": "2025",
                "points": 1200
            },
            {
                "batchId": "2024",
                "points": 600
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-short-film-competition",
        "title": "Short Film Competition",
        "category": "cultural",
        "winnerBatchId": "b2026",
        "runnerUpBatchId": "b2021",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 850,
        "placements": [
            {
                "batchId": "2026",
                "points": 850
            },
            {
                "batchId": "2021",
                "points": 500
            },
            {
                "batchId": "2024",
                "points": 150
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-tug-of-war-boys",
        "title": "Tug of War (Boys)",
        "category": "cultural",
        "winnerBatchId": "b2024",
        "runnerUpBatchId": "b2023",
        "thirdPlaceBatchId": "b2026",
        "pointsAwarded": 1000,
        "placements": [
            {
                "batchId": "2024",
                "points": 1000
            },
            {
                "batchId": "2023",
                "points": 800
            },
            {
                "batchId": "2026",
                "points": 600
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-tug-of-war-girls",
        "title": "Tug of War (Girls)",
        "category": "cultural",
        "winnerBatchId": "b2023",
        "runnerUpBatchId": "b2026",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 500,
        "placements": [
            {
                "batchId": "2023",
                "points": 500
            },
            {
                "batchId": "2026",
                "points": 500
            },
            {
                "batchId": "2024",
                "points": 400
            },
            {
                "batchId": "2025",
                "points": 300
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-fifa",
        "title": "FIFA",
        "category": "cultural",
        "winnerBatchId": "b2022",
        "runnerUpBatchId": "b2021",
        "thirdPlaceBatchId": "b2023",
        "pointsAwarded": 1200,
        "placements": [
            {
                "batchId": "2022",
                "points": 1200
            },
            {
                "batchId": "2021",
                "points": 600
            },
            {
                "batchId": "2023",
                "points": 450
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-pes",
        "title": "PES",
        "category": "cultural",
        "winnerBatchId": "b2022",
        "runnerUpBatchId": "b2023",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 600,
        "placements": [
            {
                "batchId": "2022",
                "points": 600
            },
            {
                "batchId": "2023",
                "points": 300
            },
            {
                "batchId": "2024",
                "points": 200
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-bgmi-tdm",
        "title": "BGMI TDM",
        "category": "cultural",
        "winnerBatchId": "b2026",
        "runnerUpBatchId": "b2023",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 400,
        "placements": [
            {
                "batchId": "2026",
                "points": 400
            },
            {
                "batchId": "2023",
                "points": 300
            },
            {
                "batchId": "2025",
                "points": 200
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-bgmi-classic",
        "title": "BGMI Classic",
        "category": "cultural",
        "winnerBatchId": "b2023",
        "runnerUpBatchId": "b2025",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 450,
        "placements": [
            {
                "batchId": "2023",
                "points": 450
            },
            {
                "batchId": "2025",
                "points": 400
            },
            {
                "batchId": "2024",
                "points": 50
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-clash-royale",
        "title": "Clash Royale",
        "category": "cultural",
        "winnerBatchId": "b2024",
        "runnerUpBatchId": "b2023",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 400,
        "placements": [
            {
                "batchId": "2024",
                "points": 400
            },
            {
                "batchId": "2023",
                "points": 300
            },
            {
                "batchId": "2025",
                "points": 200
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-grab-n-glam",
        "title": "Grab n Glam",
        "category": "cultural",
        "winnerBatchId": "b2025",
        "runnerUpBatchId": "b2024",
        "thirdPlaceBatchId": "b2026",
        "pointsAwarded": 1050,
        "placements": [
            {
                "batchId": "2025",
                "points": 1050
            },
            {
                "batchId": "2024",
                "points": 450
            },
            {
                "batchId": "2026",
                "points": 75
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-blind-karaoke",
        "title": "Blind Karaoke",
        "category": "cultural",
        "winnerBatchId": "b2024",
        "runnerUpBatchId": "b2025",
        "thirdPlaceBatchId": "b2022",
        "pointsAwarded": 775,
        "placements": [
            {
                "batchId": "2024",
                "points": 775
            },
            {
                "batchId": "2025",
                "points": 575
            },
            {
                "batchId": "2022",
                "points": 375
            },
            {
                "batchId": "2023",
                "points": 75
            },
            {
                "batchId": "2026",
                "points": 75
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-jam",
        "title": "JAM",
        "category": "cultural",
        "winnerBatchId": "b2025",
        "runnerUpBatchId": "b2026",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 700,
        "placements": [
            {
                "batchId": "2025",
                "points": 700
            },
            {
                "batchId": "2026",
                "points": 500
            },
            {
                "batchId": "2024",
                "points": 300
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-poker-finals",
        "title": "Poker Finals",
        "category": "cultural",
        "winnerBatchId": "b2026",
        "runnerUpBatchId": "b2023",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 700,
        "placements": [
            {
                "batchId": "2026",
                "points": 700
            },
            {
                "batchId": "2023",
                "points": 500
            },
            {
                "batchId": "2025",
                "points": 300
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-mystery-business-challenge",
        "title": "Mystery Business Challenge",
        "category": "cultural",
        "winnerBatchId": "b2023",
        "runnerUpBatchId": "b2025",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 1000,
        "placements": [
            {
                "batchId": "2023",
                "points": 1000
            },
            {
                "batchId": "2025",
                "points": 800
            },
            {
                "batchId": "2024",
                "points": 600
            },
            {
                "batchId": "2026",
                "points": 100
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-quiz-quiz-hota-hai",
        "title": "Quiz Quiz Hota Hai",
        "category": "cultural",
        "winnerBatchId": "b2022",
        "runnerUpBatchId": "b2026",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 1000,
        "placements": [
            {
                "batchId": "2022",
                "points": 1000
            },
            {
                "batchId": "2026",
                "points": 950
            },
            {
                "batchId": "2024",
                "points": 100
            },
            {
                "batchId": "2025",
                "points": 100
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-cod",
        "title": "COD",
        "category": "cultural",
        "winnerBatchId": "b2022",
        "runnerUpBatchId": "b2023",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 400,
        "placements": [
            {
                "batchId": "2022",
                "points": 400
            },
            {
                "batchId": "2023",
                "points": 300
            },
            {
                "batchId": "2025",
                "points": 200
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-free-fire",
        "title": "Free Fire",
        "category": "cultural",
        "winnerBatchId": "b2024",
        "runnerUpBatchId": "b2026",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 400,
        "placements": [
            {
                "batchId": "2024",
                "points": 400
            },
            {
                "batchId": "2026",
                "points": 300
            },
            {
                "batchId": "2025",
                "points": 200
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-unusual-palette",
        "title": "Unusual Palette",
        "category": "cultural",
        "winnerBatchId": "b2024",
        "runnerUpBatchId": "b2026",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 775,
        "placements": [
            {
                "batchId": "2024",
                "points": 775
            },
            {
                "batchId": "2026",
                "points": 575
            },
            {
                "batchId": "2025",
                "points": 375
            },
            {
                "batchId": "2022",
                "points": 75
            },
            {
                "batchId": "2023",
                "points": 75
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-ad-mad",
        "title": "Ad Mad",
        "category": "cultural",
        "winnerBatchId": "b2026",
        "runnerUpBatchId": "b2024",
        "thirdPlaceBatchId": "b2025",
        "pointsAwarded": 1000,
        "placements": [
            {
                "batchId": "2026",
                "points": 1000
            },
            {
                "batchId": "2024",
                "points": 800
            },
            {
                "batchId": "2025",
                "points": 500
            }
        ],
        "status": "completed"
    },
    {
        "id": "ev-battle-of-bands",
        "title": "Battle of Bands",
        "category": "cultural",
        "winnerBatchId": "b2023",
        "runnerUpBatchId": "b2022",
        "thirdPlaceBatchId": "b2024",
        "pointsAwarded": 1000,
        "placements": [
            {
                "batchId": "2023",
                "points": 1000
            },
            {
                "batchId": "2022",
                "points": 800
            },
            {
                "batchId": "2024",
                "points": 600
            }
        ],
        "status": "completed"
    }
]
};
