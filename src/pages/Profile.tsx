import React, { useEffect, useState } from 'react';
import { User, LogOut, Settings, Bell, Shield, BarChart as ChartBar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { LostItem } from '../types/supabase';
import BackButton from '../components/BackButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('items');
  const [stats, setStats] = useState({
    totalItems: 0,
    foundItems: 0,
    successRate: 0
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      if (!user) return;

      const { data: items, error } = await supabase
        .from('lost_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLostItems(items || []);

      // Calculate statistics
      const foundItems = items?.filter(item => item.status === 'found').length || 0;
      setStats({
        totalItems: items?.length || 0,
        foundItems,
        successRate: items?.length ? (foundItems / items.length) * 100 : 0
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'found':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Items Reported',
        data: [4, 6, 8, 5, 7, 9],
        borderColor: 'rgb(0, 103, 71)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Activity Overview'
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-usf-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BackButton className="mb-6" />

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-usf-green rounded-full p-3">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('items')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'items' ? 'bg-usf-green text-white' : 'hover:bg-gray-100'
                }`}
              >
                My Items
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'stats' ? 'bg-usf-green text-white' : 'hover:bg-gray-100'
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-usf-green text-white' : 'hover:bg-gray-100'
                }`}
              >
                Settings
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {logoutLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-usf-green">{stats.totalItems}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Found Items</p>
                <p className="text-2xl font-bold text-green-600">{stats.foundItems}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{stats.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === 'items' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Your Reports</h2>
                  <Link
                    to="/report"
                    className="bg-usf-green text-white px-4 py-2 rounded-md hover:bg-usf-green/90 transition-colors"
                  >
                    Report New Item
                  </Link>
                </div>
                
                {lostItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No items reported yet</p>
                ) : (
                  <div className="space-y-4">
                    {lostItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="h-20 w-20 rounded-md object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500">
                                Reported on {formatDate(item.created_at)}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Category: {item.category}
                              </p>
                              <p className="text-sm text-gray-600">
                                Contact: {item.contact_info}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Activity Statistics</h2>
              <div className="h-[400px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-usf-green" />
                  <h2 className="text-xl font-semibold">Notification Settings</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates about your lost items</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-usf-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-usf-green"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600">Get instant alerts in your browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-usf-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-usf-green"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-usf-green" />
                  <h2 className="text-xl font-semibold">Privacy Settings</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-600">Control who can see your profile</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;