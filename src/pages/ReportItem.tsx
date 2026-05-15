import { useState, useCallback, useEffect, useRef } from 'react';
import GoogleMapsWrapper from '../components/GoogleMapsWrapper';
import { Camera, Crosshair, Search, MapPin } from 'lucide-react';
import { GoogleMap } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
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
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState(USF_CENTER);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestIdRef = useRef(0);
  const selectedLocationRef = useRef(USF_CENTER);
  const previewUrlRef = useRef<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_DEFAULT_API_KEY';

  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_DEFAULT_API_KEY') {
      setMapError('Please configure your Google Maps API key in the environment variables.');
    }
  }, [apiKey]);

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
    setMapError(null);

    // Clean up any previous marker (React StrictMode calls onLoad twice)
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    const marker = new google.maps.Marker({
      map: mapInstance,
      position: selectedLocationRef.current,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        selectedLocationRef.current = newLocation;
        setSelectedLocation(newLocation);
      }
    });

    markerRef.current = marker;
  }, []);

  const handleAddressSearch = useCallback((input: string) => {
    setSearchInput(input);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!input.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AutocompleteSuggestion = (google.maps.places as any).AutocompleteSuggestion;
        if (!AutocompleteSuggestion) return;
        const { suggestions: raw } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({ input });
        if (requestId !== searchRequestIdRef.current) return; // discard stale response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const preds = (raw || []).map((s: any) => ({
          place_id: s.placePrediction?.placeId,
          main_text: s.placePrediction?.mainText?.text ?? '',
          secondary_text: s.placePrediction?.secondaryText?.text ?? '',
          placePrediction: s.placePrediction,
        }));
        setSuggestions(preds);
        setShowSuggestions(preds.length > 0);
      } catch (err) {
        if (requestId === searchRequestIdRef.current) {
          console.warn('Autocomplete not available:', err);
          setSuggestions([]);
        }
      }
    }, 300);
  }, []);

  const handleSuggestionClick = useCallback(async (result: any) => {
    if (!result.placePrediction || !mapRef.current) return;
    try {
      const place = result.placePrediction.toPlace();
      await place.fetchFields({ fields: ['location'] });
      const loc = place.location as google.maps.LatLng | null;
      if (loc) {
        const newLocation = { lat: loc.lat(), lng: loc.lng() };
        selectedLocationRef.current = newLocation;
        setSelectedLocation(newLocation);
        markerRef.current?.setPosition(newLocation);
        setSearchInput(result.main_text);
        setShowSuggestions(false);
        setSuggestions([]);
        mapRef.current.panTo(newLocation);
        mapRef.current.setZoom(17);
      }
    } catch (err) {
      console.warn('Place details not available:', err);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    }
  };

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;
      const newLocation = { lat, lng };
      selectedLocationRef.current = newLocation;
      setSelectedLocation(newLocation);
      markerRef.current?.setPosition(newLocation);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newLocation = { lat, lng };
        selectedLocationRef.current = newLocation;
        setSelectedLocation(newLocation);
        markerRef.current?.setPosition(newLocation);
        if (mapRef.current) {
          mapRef.current.panTo(newLocation);
          mapRef.current.setZoom(17);
        }
      },
      (err: GeolocationPositionError) => {
        let errorMsg = 'Unable to get your current location.';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. Please enable location in browser settings and try again.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable. Please try again or use the map to select a location.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'Location request timed out. Please try again or use the map to select a location.';
        }
        setError(errorMsg);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name || !formData.category || !formData.contact) {
        throw new Error('Please fill in all required fields');
      }

      if (selectedLocation.lat < -90 || selectedLocation.lat > 90 || selectedLocation.lng < -180 || selectedLocation.lng > 180) {
        throw new Error('Selected location has invalid coordinates. Please try again.');
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

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data: insertedItem, error: insertError } = await supabase
        .from('lost_items')
        .insert({
          user_id: user.id,
          name: formData.name,
          category: formData.category,
          location_lat: selectedLocation.lat,
          location_lng: selectedLocation.lng,
          image_url: imageUrl,
          contact_info: formData.contact,
          status: 'pending'
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      if (insertedItem?.id) {
        const { error: activityError } = await supabase.from('activity_events').insert({
          user_id: user.id,
          type: 'ITEM_REPORTED',
          title: formData.name,
          description: `Reported as ${formData.category}`,
          item_id: insertedItem.id
        });
        if (activityError) {
          console.warn('Failed to log activity:', activityError);
        }
      }

      navigate('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (markerRef.current) markerRef.current.setMap(null);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <BackButton className="mb-6" />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-usf-green mb-2">Report a Lost Item</h1>
        <p className="text-gray-600">Let the Bulls Community Help You Find It</p>
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
          <p className="text-xs text-gray-500 mb-2">
            Click the map, drag the pin, or search an address to set the location.
          </p>
          {mapError ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-4">
              <p className="font-medium">{mapError}</p>
            </div>
          ) : !apiKey || apiKey === 'YOUR_DEFAULT_API_KEY' ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg mb-4">
              Google Maps is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
            </div>
          ) : (
            <GoogleMapsWrapper>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden />
                  <input
                    type="text"
                    placeholder="Search address (optional)"
                    value={searchInput}
                    onChange={(e) => handleAddressSearch(e.target.value)}
                    onFocus={() => searchInput && setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion: any, idx) => (
                        <button
                          key={suggestion.place_id || idx}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-start gap-2 border-b border-gray-100 last:border-b-0"
                        >
                          <MapPin className="h-4 w-4 text-usf-green flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-gray-900">{suggestion.main_text}</p>
                            <p className="text-xs text-gray-500">{suggestion.secondary_text}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-usf-green hover:text-usf-green/80 border border-usf-green/30 rounded-lg hover:bg-usf-green/5 transition-colors whitespace-nowrap"
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
                  zoomControl: true,
                }}
              />
            </GoogleMapsWrapper>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
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
                      if (previewUrlRef.current) {
                        URL.revokeObjectURL(previewUrlRef.current);
                        previewUrlRef.current = null;
                      }
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
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
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
