import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, FileInput, Activity, FilePlus, Package, AlertCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { ActivityEvent } from '../types/supabase';
import { DEMO_MODE, FAKE_STATS, getFakeActivity } from '../config/demo';

interface Statistics {
  totalItems: number;
  foundItems: number;
  pendingItems: number;
  successRate: number;
}

const ACTIVITY_TYPE_ICONS: Record<string, React.ElementType> = {
  ITEM_REPORTED: FilePlus,
  ITEM_STATUS_CHANGED: Activity,
  ITEM_FOUND_MARKED: Package,
  POSSIBLE_MATCH: Search,
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const sec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) {
    const hours = Math.floor(sec / 3600);
    return hours === 1 ? '1h ago' : `${hours}h ago`;
  }
  const days = Math.floor(sec / 86400);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function getActivityTypeLabel(type: string): string {
  switch (type) {
    case 'ITEM_REPORTED': return 'Reported';
    case 'ITEM_STATUS_CHANGED': return 'Status Updated';
    case 'ITEM_FOUND_MARKED': return 'Marked as found';
    case 'POSSIBLE_MATCH': return 'Possible match';
    default: return type.replace(/_/g, ' ');
  }
}

const Home = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<Statistics>({
    totalItems: 0,
    foundItems: 0,
    pendingItems: 0,
    successRate: 0
  });
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      const { data: allData, error: allError } = await supabase
        .from('lost_items')
        .select('status');

      if (allError) throw allError;
      const list = allData ?? [];
      const total = list.length;
      const found = list.filter((r: { status: string }) => r.status === 'found').length;
      setStats({
        totalItems: total,
        foundItems: found,
        pendingItems: total - found,
        successRate: total > 0 ? (found / total) * 100 : 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // DASH10-9: Fetch in effects, limit 5, error UI — DASH10-# done
  const fetchActivity = useCallback(async () => {
    if (!user?.id) return;
    setActivityError(null);
    setActivityLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setActivity((data as ActivityEvent[]) ?? []);
    } catch (err) {
      setActivityError(err instanceof Error ? err.message : 'Failed to load activity');
      setActivity([]);
    } finally {
      setActivityLoading(false);
    }
  }, [user?.id]);

  // STEP 0: Stats from fetchStatistics (supabase lost_items); Activity from fetchActivity (supabase activity_events). DEMO: when DEMO_MODE, use fake data only.
  useEffect(() => {
    if (DEMO_MODE) {
      setStats(FAKE_STATS);
      setStatsLoading(false);
    } else {
      fetchStatistics();
    }
  }, [fetchStatistics]);

  useEffect(() => {
    if (DEMO_MODE) {
      setActivity(getFakeActivity() as ActivityEvent[]);
      setActivityLoading(false);
      setActivityError(null);
    } else {
      fetchActivity();
    }
  }, [fetchActivity]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.first_name
    || user?.email?.split('@')[0]?.split(/[._]/)[0]
    || 'Account';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar: FindMyStuff left; name + Sign out (with icon) right */}
      <nav className="relative z-10 w-full px-6 py-3 border-b bg-white" style={{ borderColor: '#d1d5db', borderBottomWidth: '1.5px' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 font-sans">
            <Search className="h-7 w-7 text-usf-green" aria-hidden />
            <span className="text-xl font-semibold">
              <span style={{ color: '#006747' }}>Find</span>
              <span className="text-slate-800">MyStuff</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 font-sans">
            <span className="text-sm font-medium text-slate-700">{displayName}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-usf-green focus-visible:ring-offset-2 rounded-lg px-2 py-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* DASH10-8: Interaction polish (hover/focus-visible on cards & buttons); reduced-motion in CSS — DASH10-# done */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 dashboard-fade-in font-sans">
        {/* Typography: page title (large, bold, USF green) → subtitle (smaller, neutral gray) → tagline (smallest, supportive) */}
        <div className="text-center mb-10">
          <h1
            className="font-sans font-bold text-usf-green mb-3 leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 2.75rem)' }}
          >
            Lost & Found
          </h1>
          <p className="text-gray-600 max-w-[700px] mx-auto mb-2 text-lg font-medium leading-relaxed">
            Connect lost items with their owners across USF campus
          </p>
          <p
            className="text-usf-green text-sm font-medium not-italic leading-relaxed"
            style={{ letterSpacing: '0.045em', opacity: 0.7 }}
          >
            Because Bulls Always Look Out for Each Other
          </p>
        </div>

        {/* DASH10-3: Stat cards meaning + hierarchy; DASH10-4: 8px spacing rhythm — DASH10-# done */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Overview statistics">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 leading-tight">Total Items</p>
            <p className="text-3xl font-bold text-slate-800 leading-tight">{statsLoading ? '—' : stats.totalItems}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" style={{ backgroundColor: 'rgba(0, 103, 71, 0.03)' }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 leading-tight">Found Items</p>
            <p className="text-3xl font-bold text-usf-green leading-tight">{statsLoading ? '—' : stats.foundItems}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.04)' }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 leading-tight">Pending Items</p>
            <p className="text-3xl font-bold text-amber-700 leading-tight">{statsLoading ? '—' : stats.pendingItems}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.04)' }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 leading-tight">Success Rate</p>
            {/* DEMO-5: Success rate matches FAKE_STATS (21/38 ≈ 55.3%); helper text unchanged — DEMO-# done */}
            <p className="text-3xl font-bold text-blue-600 leading-tight">{statsLoading ? '—' : `${stats.successRate.toFixed(1)}%`}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Based on resolved items</p>
          </div>
        </section>

        {/* Action cards: neutral default (white, gray border, equal elevation); USF green only on hover */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/report"
              className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-gray-200 shadow-sm cursor-pointer transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-usf-green/30 hover:bg-usf-green/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-usf-green focus-visible:ring-offset-2"
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-gray-100 transition-colors duration-150 group-hover:bg-usf-green/10">
                <FileInput className="w-8 h-8 text-slate-600 transition-colors duration-150 group-hover:text-usf-green" aria-hidden />
              </div>
              <h2 className="font-sans text-xl font-semibold text-slate-800 mb-2 leading-tight transition-colors duration-150 group-hover:text-usf-green">Report a Lost Item</h2>
              <p className="text-slate-600 text-center text-sm font-normal leading-relaxed">
                Submit details about your lost item
              </p>
            </Link>

            <Link
              to="/search"
              className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-gray-200 shadow-sm cursor-pointer transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-usf-green/30 hover:bg-usf-green/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-usf-green focus-visible:ring-offset-2"
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-gray-100 transition-colors duration-150 group-hover:bg-usf-green/10">
                <Search className="w-8 h-8 text-slate-600 transition-colors duration-150 group-hover:text-usf-green" aria-hidden />
              </div>
              <h2 className="font-sans text-xl font-semibold text-slate-800 mb-2 leading-tight transition-colors duration-150 group-hover:text-usf-green">Search Lost Items</h2>
              <p className="text-slate-600 text-center text-sm font-normal leading-relaxed">
                Browse through reported lost items
              </p>
            </Link>
          </div>
        </section>

        {/* 4. Recent Activity: empty state text leads; list spacing + action type label + relative time */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
          <h2 className="font-sans text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2 leading-tight">
            <Activity className="w-5 h-5 text-usf-green" aria-hidden />
            Recent Activity
          </h2>

          {activityLoading && (
            <div className="space-y-3" aria-hidden>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!activityLoading && activityError && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" aria-hidden />
              <p className="text-red-700 font-semibold mb-2">Couldn’t load activity</p>
              <p className="text-sm text-red-600 mb-4 font-normal leading-relaxed">{activityError}</p>
              <button
                type="button"
                onClick={() => fetchActivity()}
                className="text-sm font-medium text-usf-green hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-usf-green focus-visible:ring-offset-2 rounded"
              >
                Retry
              </button>
            </div>
          )}

          {/* DEMO-4: When DEMO_MODE true, fake activity is set so list shows; when false and no data, empty state shows — DEMO-# done */}
          {!activityLoading && !activityError && activity.length === 0 && (
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-8 text-center">
              <h3 className="font-sans text-lg font-semibold text-slate-800 mb-2 leading-tight">No activity yet</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto font-normal leading-relaxed">
                Updates about your reported items, matches, and status changes will appear here.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-usf-green hover:bg-usf-green-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-usf-green focus-visible:ring-offset-2 transition-colors"
                >
                  <FileInput className="w-4 h-4" aria-hidden /> Report Item
                </Link>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-usf-green focus-visible:ring-offset-2 transition-colors"
                >
                  <Search className="w-4 h-4" aria-hidden /> Browse Items
                </Link>
              </div>
            </div>
          )}

          {!activityLoading && !activityError && activity.length > 0 && (
            <ul className="space-y-2">
              {activity.map((event) => {
                const IconComponent = ACTIVITY_TYPE_ICONS[event.type] || Activity;
                const content = (
                  <>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-usf-green/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-usf-green" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-0.5 leading-tight">{getActivityTypeLabel(event.type)}</p>
                      <p className="font-semibold text-slate-800 truncate leading-tight">{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-gray-500 truncate font-normal leading-relaxed">{event.description}</p>
                      )}
                    </div>
                    <time
                      className="flex-shrink-0 text-xs text-gray-500 tabular-nums leading-relaxed"
                      title={new Date(event.created_at).toLocaleString()}
                    >
                      {formatRelativeTime(event.created_at)}
                    </time>
                  </>
                );
                return (
                  <li key={event.id}>
                    {event.item_id ? (
                      <Link
                        to="/profile"
                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-usf-green focus-visible:ring-offset-2 cursor-pointer"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
