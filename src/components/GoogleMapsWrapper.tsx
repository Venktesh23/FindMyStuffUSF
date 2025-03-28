import React, { useEffect, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { AlertCircle } from 'lucide-react';

interface GoogleMapsWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({ children, fallback }) => {
  const [error, setError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_DEFAULT_API_KEY') {
      setError('Maps functionality is currently limited. Please configure your Google Maps API key to enable full features.');
    } else {
      setError(null);
    }
  }, [apiKey]);

  const handleError = (err: Error) => {
    console.error('Google Maps Error:', err);
    setError('Maps functionality is currently limited. Please try again later.');
  };

  if (error) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Limited Functionality</h3>
            <p className="mt-1 text-sm text-yellow-700">{error}</p>
            <p className="mt-2 text-sm text-yellow-700">
              You can still use all other features of the application.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey || ''}
      libraries={libraries}
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      loadingElement={
        <div className="bg-gray-100 animate-pulse rounded-lg h-[400px]">
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      }
    >
      {isLoaded && children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;