import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationDisplayProps {
  lat: number;
  lng: number;
  name?: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ lat, lng, name }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-usf-green" />
        <span className="font-medium">{name || 'Location'}</span>
      </div>
      <div className="text-sm text-gray-600">
        <p>Latitude: {lat.toFixed(6)}</p>
        <p>Longitude: {lng.toFixed(6)}</p>
      </div>
      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm text-usf-green hover:text-usf-green/80"
      >
        View on Google Maps
      </a>
    </div>
  );
};

export default LocationDisplay;