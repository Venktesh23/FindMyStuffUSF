import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Calendar } from 'lucide-react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { supabase } from '../lib/supabase';
import type { LostItem } from '../types/supabase';
import BackButton from '../components/BackButton';
import { useRealtimeItems } from '../hooks/useRealtimeItems';
import { useFuzzySearch } from '../hooks/useFuzzySearch';

const SearchItems = () => {
  const { items, loading, error } = useRealtimeItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);

  const search = useFuzzySearch(items);

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '0.5rem'
  };

  const filteredItems = React.useMemo(() => {
    let results = searchTerm ? search(searchTerm) : items;

    results = results.filter(item => {
      const matchesCategory = selectedCategory === '' || 
        item.category === selectedCategory;

      const matchesStatus = selectedStatus === '' ||
        item.status === selectedStatus;

      const matchesDate = () => {
        if (!dateRange.start && !dateRange.end) return true;
        const itemDate = new Date(item.created_at);
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;

        if (start && end) {
          return itemDate >= start && itemDate <= end;
        } else if (start) {
          return itemDate >= start;
        } else if (end) {
          return itemDate <= end;
        }
        return true;
      };

      return matchesCategory && matchesStatus && matchesDate();
    });

    // Apply sorting
    if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    return results;
  }, [items, searchTerm, selectedCategory, selectedStatus, dateRange, sortBy, search]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton className="mb-6" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-usf-green mb-2">Search Lost Items</h1>
          <p className="text-gray-600 italic">Help a Fellow Bull Find Their Lost Item</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-usf-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'map'
                ? 'bg-usf-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="accessories">Accessories</option>
            <option value="ids">IDs</option>
            <option value="other">Other</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="found">Found</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          <p className="font-medium">Error loading items</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-usf-green"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found matching your search criteria</p>
        </div>
      ) : viewMode === 'map' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: 28.0587, lng: -82.4139 }}
            zoom={15}
            onClick={() => setSelectedItem(null)}
          >
            {filteredItems.map((item) => (
              <Marker
                key={item.id}
                position={{ lat: item.location_lat, lng: item.location_lng }}
                title={item.name}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </GoogleMap>
          
          {selectedItem && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">{selectedItem.name}</h3>
              <p className="text-sm text-gray-600">Category: {selectedItem.category}</p>
              <p className="text-sm text-gray-600">Status: {selectedItem.status}</p>
              <p className="text-sm text-gray-600">Contact: {selectedItem.contact_info}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              {item.image_url && (
                <div className="mb-4 h-48 rounded-md overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-600">Category:</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500">Posted {formatDate(item.created_at)}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Contact: {item.contact_info}
                </p>
              </div>
              {selectedItem?.id === item.id && (
                <ItemRecommendations currentItem={item} allItems={items} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchItems;