import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

const USF_CENTER = {
  lat: 28.0587,
  lng: -82.4139
};

export const useLocation = () => {
  const [location, setLocation] = useState<Location>(() => {
    const saved = localStorage.getItem('lastKnownLocation');
    return saved ? JSON.parse(saved) : USF_CENTER;
  });

  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
    localStorage.setItem('lastKnownLocation', JSON.stringify(newLocation));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          updateLocation(newLocation);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    updateLocation,
    getCurrentLocation
  };
};

export default useLocation;