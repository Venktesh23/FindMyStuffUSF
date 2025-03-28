export interface LostItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  location_lat: number;
  location_lng: number;
  image_url: string | null;
  contact_info: string;
  created_at: string;
  status: string;
}