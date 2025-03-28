import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { LostItem } from '../types/supabase';

export const useRealtimeItems = () => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
    
    const channel = supabase
      .channel('lost_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lost_items'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems(prev => [payload.new as LostItem, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setItems(prev => 
              prev.map(item => 
                item.id === payload.new.id ? payload.new as LostItem : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchItems = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('lost_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error };
};