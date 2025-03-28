import Fuse from 'fuse.js';
import { useMemo } from 'react';
import type { LostItem } from '../types/supabase';

const fuseOptions = {
  keys: ['name', 'category', 'contact_info'],
  threshold: 0.3,
  includeScore: true,
};

export const useFuzzySearch = (items: LostItem[]) => {
  const fuse = useMemo(() => new Fuse(items, fuseOptions), [items]);

  const search = (query: string) => {
    if (!query) return items;
    return fuse.search(query).map(result => result.item);
  };

  return search;
};