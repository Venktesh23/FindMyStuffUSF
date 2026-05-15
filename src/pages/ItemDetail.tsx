import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import GoogleMapsWrapper from '../components/GoogleMapsWrapper';
import { MapPin, Mail, Phone, Calendar, Tag, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { LostItem } from '../types/supabase';
import BackButton from '../components/BackButton';
import { DEMO_MODE, FAKE_ITEMS } from '../config/demo';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<LostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem'
  };

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);

      try {
        if (DEMO_MODE) {
          // Find from fake data
          const fakeItem = FAKE_ITEMS.find(item => item.id === id);
          if (fakeItem) {
            setItem(fakeItem);
          } else {
            setError('Item not found');
          }
        } else {
          // Fetch from Supabase
          const { data, error: supabaseError } = await supabase
            .from('lost_items')
            .select('*')
            .eq('id', id)
            .single();

          if (supabaseError) throw supabaseError;
          setItem(data as LostItem);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-slate-100 text-slate-800 border border-slate-300';
      case 'found':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-300';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      electronics: 'Electronics',
      books: 'Books',
      accessories: 'Accessories',
      clothing: 'Clothing',
      jewelry: 'Jewelry',
      documents: 'Documents',
      other: 'Other'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-usf-green"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton className="mb-6" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-red-900 mb-1">Item Not Found</h2>
            <p className="text-red-700">{error || 'This item could not be found.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const contactParts = item.contact_info?.split('|').map(part => part.trim()) || [];
  const email = contactParts.find(part => part.includes('@')) || '';
  const phone = contactParts.find(part => part.match(/\d/)) || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Item Image */}
            {item.image_url && (
              <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Item Details */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{item.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-usf-green" />
                    <span className="text-lg text-gray-600">{getCategoryLabel(item.category)}</span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusBadgeColor(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-6">
                {/* Date */}
                <div className="flex items-start gap-4">
                  <Calendar className="h-6 w-6 text-usf-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Reported</p>
                    <p className="text-gray-900">{formatDate(item.created_at)}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-usf-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Location</p>
                    <p className="text-gray-900">
                      {item.location_lat.toFixed(4)}°N, {item.location_lng.toFixed(4)}°W
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Item Location</h3>
              <GoogleMapsWrapper>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{ lat: item.location_lat, lng: item.location_lng }}
                  zoom={17}
                >
                  <Marker
                    position={{ lat: item.location_lat, lng: item.location_lng }}
                    title={item.name}
                  />
                </GoogleMap>
              </GoogleMapsWrapper>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

              <div className="space-y-4">
                {/* Email */}
                {email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-usf-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Email</p>
                      <a
                        href={`mailto:${email}`}
                        className="text-usf-green hover:text-usf-green/80 font-medium break-all transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {phone && phone !== email && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-usf-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Phone</p>
                      <a
                        href={`tel:${phone}`}
                        className="text-usf-green hover:text-usf-green/80 font-medium transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-usf-green/10 border border-usf-green/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-usf-green">Tip:</span> Use the contact information above to reach out to the item reporter.
                  </p>
                </div>
              </div>

              {/* Status Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm font-medium text-gray-900">{getCategoryLabel(item.category)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
