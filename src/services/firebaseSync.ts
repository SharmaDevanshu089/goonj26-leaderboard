import { TournamentEdition } from '../types/leaderboard';

export const FIREBASE_DB_URL = 'https://goonj26-leaderboard-default-rtdb.firebaseio.com';
const EDITIONS_ENDPOINT = `${FIREBASE_DB_URL}/editions.json`;

/**
 * Fetch the latest consolidated tournament data from Firebase Realtime Database
 */
export async function fetchCloudLeaderboard(): Promise<Record<string, TournamentEdition> | null> {
  try {
    const res = await fetch(EDITIONS_ENDPOINT, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn(`[Firebase] Fetch error status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (data && data.goonj26 && Array.isArray(data.goonj26.teams)) {
      return data;
    }
    return null;
  } catch (error) {
    console.warn('[Firebase] Network error fetching cloud data:', error);
    return null;
  }
}

/**
 * Save consolidated tournament data to Firebase Realtime Database
 */
export async function saveCloudLeaderboard(editions: Record<string, TournamentEdition>): Promise<boolean> {
  try {
    const res = await fetch(EDITIONS_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editions),
    });

    return res.ok;
  } catch (error) {
    console.error('[Firebase] Failed to push data to cloud:', error);
    return false;
  }
}

/**
 * Subscribe to real-time updates from Firebase using Server-Sent Events (SSE)
 * with periodic polling & window visibility focus as robust fallbacks for mobile browsers.
 */
export function subscribeToCloudLeaderboard(
  onUpdate: (editions: Record<string, TournamentEdition>) => void
): () => void {
  let eventSource: EventSource | null = null;
  let isClosed = false;

  const pullLatest = async () => {
    if (isClosed) return;
    const latest = await fetchCloudLeaderboard();
    if (latest && latest.goonj26 && !isClosed) {
      onUpdate(latest);
    }
  };

  // 1. Native Realtime Streaming via SSE
  try {
    eventSource = new EventSource(EDITIONS_ENDPOINT);

    eventSource.addEventListener('put', (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.path === '/' && payload.data && payload.data.goonj26) {
          onUpdate(payload.data);
        } else if (payload && payload.data && payload.data.goonj26) {
          onUpdate(payload.data);
        } else if (payload && payload.path?.startsWith('/goonj26')) {
          // Sub-path updated; refresh whole dataset to ensure state consistency
          pullLatest();
        }
      } catch (err) {
        console.warn('[Firebase SSE] JSON parse error:', err);
      }
    });

    eventSource.addEventListener('patch', () => {
      pullLatest();
    });

    eventSource.onerror = () => {
      // EventSource auto-reconnects on mobile/network drops
    };
  } catch (e) {
    console.warn('[Firebase] EventSource not available in this environment, falling back to polling.', e);
  }

  // 2. Mobile Friendly Background Pull: Re-sync every 8 seconds
  const intervalId = setInterval(pullLatest, 8000);

  // 3. Re-sync immediately whenever the browser tab becomes visible / focused
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      pullLatest();
    }
  };

  const handleFocus = () => {
    pullLatest();
  };

  window.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleFocus);

  // Cleanup handler
  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    clearInterval(intervalId);
    window.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleFocus);
  };
}
