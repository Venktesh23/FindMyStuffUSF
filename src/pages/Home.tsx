import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileInput, Activity, Map, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Statistics {
  totalItems: number;
  foundItems: number;
  pendingItems: number;
  successRate: number;
}

const Home = () => {
  const [stats, setStats] = useState<Statistics>({
    totalItems: 0,
    foundItems: 0,
    pendingItems: 0,
    successRate: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    fetchRecentItems();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data: totalItems, error: totalError } = await supabase
        .from('lost_items')
        .select('status', { count: 'exact' });

      const { data: foundItems, error: foundError } = await supabase
        .from('lost_items')
        .select('status', { count: 'exact' })
        .eq('status', 'found');

      if (totalError || foundError) throw new Error('Failed to fetch statistics');

      const total = totalItems?.length || 0;
      const found = foundItems?.length || 0;
      
      setStats({
        totalItems: total,
        foundItems: found,
        pendingItems: total - found,
        successRate: total > 0 ? (found / total) * 100 : 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const { data, error } = await supabase
        .from('lost_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentItems(data || []);
    } catch (error) {
      console.error('Error fetching recent items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold text-usf-green mb-6">
          Lost & Found
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-2">
          Connect lost items with their owners across USF campus
        </p>
        <p className="text-xl text-usf-green italic">
          Because Bulls Always Look Out for Each Other
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">Total Items</h3>
          <p className="text-4xl font-bold text-usf-green mt-2">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">Found Items</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.foundItems}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">Pending Items</h3>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pendingItems}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-600">Success Rate</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.successRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
        <Link
          to="/report"
          className="flex flex-col items-center p-12 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 transition-transform duration-300"
        >
          <FileInput className="w-24 h-24 text-usf-green mb-6" />
          <h2 className="text-3xl font-semibold text-usf-green mb-4">Report a Lost Item</h2>
          <p className="text-xl text-gray-600 text-center">
            Submit details about your lost item
          </p>
        </Link>

        <Link
          to="/search"
          className="flex flex-col items-center p-12 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 transition-transform duration-300"
        >
          <Search className="w-24 h-24 text-usf-green mb-6" />
          <h2 className="text-3xl font-semibold text-usf-green mb-4">Search Lost Items</h2>
          <p className="text-xl text-gray-600 text-center">
            Browse through reported lost items
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
        <div className="flex items-center mb-6">
          <Activity className="w-6 h-6 text-usf-green mr-3" />
          <h2 className="text-2xl font-semibold">Recent Activity</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-usf-green"></div>
          </div>
        ) : recentItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {recentItems.map((item: any) => (
              <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-12 h-12 rounded-md object-cover mr-4"
                  />
                )}
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'found' ? 'bg-green-100 text-green-800' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-usf-green/5 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-usf-green mb-6">Quick Tips</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <Bell className="w-8 h-8 text-usf-green mb-4" />
            <h3 className="font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-600">Enable notifications to get alerts when your item is found</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <Map className="w-8 h-8 text-usf-green mb-4" />
            <h3 className="font-semibold mb-2">Precise Location</h3>
            <p className="text-gray-600">Mark the exact location where you lost your item</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <Activity className="w-8 h-8 text-usf-green mb-4" />
            <h3 className="font-semibold mb-2">Quick Action</h3>
            <p className="text-gray-600">Report lost items as soon as possible for better chances</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;