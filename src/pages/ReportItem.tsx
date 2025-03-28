import React, { useState, useCallback, useEffect } from 'react';
import { Camera, MapPin, Crosshair } from 'lucide-react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BackButton from '../components/BackButton';

const USF_CENTER = {
  lat: 28.0587,
  lng: -82.4139
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

interface FormData {
  name: string;
  category: string;
  contact: string;
}

const ReportItem = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(USF_CENTER);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_DEFAULT_API_KEY';

  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_DEFAULT_API_KEY') {
      setMapError('Please configure your Google Maps API key in the environment variables.');
      console.error('Google Maps API key is not configured');
    }
  }, [apiKey]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(newLocation);
          if (map) {
            map.panTo(newLocation);
            map.setZoom(17);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Unable to get your current location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate all required fields
      if (!formData.name || !formData.category || !formData.contact) {
        throw new Error('Please fill in all required fields');
      }

      if (!selectedLocation) {
        throw new Error('Please select a location on the map');
      }

      let imageUrl = null;
      if (selectedFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('lost-items')
          .upload(`${Date.now()}-${selectedFile.name}`, selectedFile);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('lost-items')
            .getPublicUrl(uploadData.path);
          imageUrl = publicUrl;
        }
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) {
        throw new Error('User not authenticated');
      }

      const { error: insertError } = await supabase
        .from('lost_items')
        .insert({
          user_id: session.session.user.id,
          name: formData.name,
          category: formData.category,
          location_lat: selectedLocation.lat,
          location_lng: selectedLocation.lng,
          image_url: imageUrl,
          contact_info: formData.contact,
          status: 'pending'
        });

      if (insertError) throw insertError;

      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleMapError = (error: Error) => {
    console.error('Google Maps Error:', error);
    setMapError(`Failed to load Google Maps: ${error.message}`);
    setIsMapLoaded(false);
  };

  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map);
    setIsMapLoaded(true);
    setMapError(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <BackButton className="mb-6" />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-usf-green mb-2">Report a Lost Item</h1>
        <p className="text-gray-600 italic">Let the Bulls Community Help You Find It</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
            Item Name *
          </label>
          <input
            type="text"
            id="itemName"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-usf-green focus:ring-usf-green"
            placeholder="e.g., MacBook, Backpack, Keys"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-usf-green focus:ring-usf-green"
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="accessories">Accessories</option>
            <option value="ids">IDs</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
          {mapError ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
              {mapError}
            </div>
          ) : !apiKey || apiKey === 'YOUR_DEFAULT_API_KEY' ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg mb-4">
              Google Maps functionality is disabled. Please configure your API key.
            </div>
          ) : (
            <>
              <div className="relative mb-2">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 text-usf-green hover:text-usf-green/80 mb-2"
                  title="Get current location"
                >
                  <Crosshair className="h-5 w-5" />
                  Use Current Location
                </button>
              </div>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedLocation}
                zoom={15}
                onClick={handleMapClick}
                onLoad={handleMapLoad}
                options={{
                  fullscreenControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  zoomControl: true
                }}
              >
                <Marker position={selectedLocation} />
              </GoogleMap>
            </>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Selected location: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto h-32 w-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-usf-green hover:text-usf-green/80"
                  >
                    Upload a file
                  </label>
                </div>
              )}
              <p className="text-xs text-gray-500">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
            Contact Information *
          </label>
          <input
            type="text"
            id="contact"
            required
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-usf-green focus:ring-usf-green"
            placeholder="Phone number or email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-usf-green hover:bg-usf-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-usf-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportItem;