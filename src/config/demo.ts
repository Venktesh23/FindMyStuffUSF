import type { LostItem } from '../types/supabase';

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

/** Fake lost items with full details for demo */
export const FAKE_ITEMS: LostItem[] = [
  {
    id: 'item-1',
    user_id: 'demo-user',
    name: 'Black AirPods Pro',
    category: 'electronics',
    location_lat: 28.0595,
    location_lng: -82.4143,
    image_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
    contact_info: 'john.doe@usf.edu | 813-555-0101',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'item-2',
    user_id: 'demo-user',
    name: 'Green Hydro Flask',
    category: 'accessories',
    location_lat: 28.0577,
    location_lng: -82.4132,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    contact_info: 'jane.smith@usf.edu | 813-555-0102',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'item-3',
    user_id: 'demo-user',
    name: 'Brown Leather Wallet',
    category: 'accessories',
    location_lat: 28.0603,
    location_lng: -82.4145,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    contact_info: 'michael.brown@usf.edu | 813-555-0103',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'item-4',
    user_id: 'demo-user',
    name: 'TI-84 Calculator',
    category: 'electronics',
    location_lat: 28.0615,
    location_lng: -82.4127,
    image_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=400&fit=crop',
    contact_info: 'sarah.williams@usf.edu | 813-555-0104',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: 'item-5',
    user_id: 'demo-user',
    name: 'Keys with USF Lanyard',
    category: 'accessories',
    location_lat: 28.0593,
    location_lng: -82.4156,
    image_url: 'https://images.unsplash.com/photo-1609708536573-69742d3cdbdd?w=400&h=400&fit=crop',
    contact_info: 'alex.johnson@usf.edu | 813-555-0105',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'found',
  },
];

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
      item_id: 'item-1',
      created_at: new Date(now - 2 * hour).toISOString(),
    },
    {
      id: 'demo-2',
      user_id: 'demo-user',
      type: 'ITEM_REPORTED',
      title: 'Green Hydro Flask',
      description: 'USF Library',
      item_id: 'item-2',
      created_at: new Date(now - 1 * day).toISOString(),
    },
    {
      id: 'demo-3',
      user_id: 'demo-user',
      type: 'POSSIBLE_MATCH',
      title: 'Wallet (Brown leather)',
      description: 'Near: The Hub',
      item_id: 'item-3',
      created_at: new Date(now - 2 * day).toISOString(),
    },
  ];
}
