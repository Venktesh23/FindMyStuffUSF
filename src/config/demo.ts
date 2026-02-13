/**
 * Demo mode: when true, dashboard shows fake data only (no API calls).
 * Set to false for production or when using real backend.
 */
// DEMO-1: Single flag for all fake data — DEMO-# done
export const DEMO_MODE = true;

// DEMO-2: Realistic fake stats (Total = Found + Pending; Success Rate = (Found/Total)*100) — DEMO-# done
const TOTAL_ITEMS = 38;
const FOUND_ITEMS = 21;
const PENDING_ITEMS = 17; // TOTAL_ITEMS - FOUND_ITEMS
const SUCCESS_RATE = TOTAL_ITEMS > 0 ? Math.round((FOUND_ITEMS / TOTAL_ITEMS) * 1000) / 10 : 0;

export const FAKE_STATS = {
  totalItems: TOTAL_ITEMS,
  foundItems: FOUND_ITEMS,
  pendingItems: PENDING_ITEMS,
  successRate: SUCCESS_RATE,
};

/** Returns fake activity events (latest first). Timestamps computed at call time for correct relative time. */
// DEMO-3: Fake Recent Activity timeline — DEMO-# done
export function getFakeActivity(): Array<{
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string | null;
  item_id: string | null;
  created_at: string;
}> {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;
  return [
    {
      id: 'demo-1',
      user_id: 'demo-user',
      type: 'ITEM_FOUND_MARKED',
      title: 'Black AirPods Pro',
      description: 'Marshall Student Center',
      item_id: null,
      created_at: new Date(now - 2 * hour).toISOString(),
    },
    {
      id: 'demo-2',
      user_id: 'demo-user',
      type: 'ITEM_REPORTED',
      title: 'Green Hydro Flask',
      description: 'USF Library',
      item_id: null,
      created_at: new Date(now - 1 * day).toISOString(),
    },
    {
      id: 'demo-3',
      user_id: 'demo-user',
      type: 'POSSIBLE_MATCH',
      title: 'Wallet (Brown leather)',
      description: 'Near: The Hub',
      item_id: null,
      created_at: new Date(now - 2 * day).toISOString(),
    },
    {
      id: 'demo-4',
      user_id: 'demo-user',
      type: 'ITEM_REPORTED',
      title: 'TI-84 Calculator',
      description: 'ENG Building II',
      item_id: null,
      created_at: new Date(now - 3 * day).toISOString(),
    },
    {
      id: 'demo-5',
      user_id: 'demo-user',
      type: 'ITEM_FOUND_MARKED',
      title: 'Keys with USF lanyard',
      description: 'Recreation Center',
      item_id: null,
      created_at: new Date(now - 5 * day).toISOString(),
    },
  ];
}
