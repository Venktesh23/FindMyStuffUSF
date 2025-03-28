import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { LostItem } from '../types/supabase';

interface ItemRecommendationsProps {
  currentItem: LostItem;
  allItems: LostItem[];
}

const ItemRecommendations: React.FC<ItemRecommendationsProps> = ({ currentItem, allItems }) => {
  const getRecommendations = () => {
    return allItems
      .filter(item => 
        item.id !== currentItem.id && 
        item.category === currentItem.category &&
        calculateDistance(
          item.location_lat,
          item.location_lng,
          currentItem.location_lat,
          currentItem.location_lng
        ) < 0.5 // Within 0.5 km
      )
      .slice(0, 3);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Similar Items Nearby</h3>
      <div className="space-y-4">
        {recommendations.map(item => (
          <div key={item.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </p>
              <span className={`inline-block px-2 py-1 mt-1 text-xs rounded-full ${
                item.status === 'found' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemRecommendations;