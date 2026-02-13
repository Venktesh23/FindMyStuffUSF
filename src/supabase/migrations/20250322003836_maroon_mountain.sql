/*
  # Create lost items table

  1. New Tables
    - `lost_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `category` (text)
      - `location_lat` (double precision)
      - `location_lng` (double precision)
      - `image_url` (text)
      - `contact_info` (text)
      - `created_at` (timestamptz)
      - `status` (text)

  2. Security
    - Enable RLS on `lost_items` table
    - Add policies for:
      - Users can read all items
      - Users can only create/update their own items
*/

CREATE TABLE IF NOT EXISTS lost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  image_url text,
  contact_info text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read all items
CREATE POLICY "Anyone can view lost items"
  ON lost_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to create their own items
CREATE POLICY "Users can create their own items"
  ON lost_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own items
CREATE POLICY "Users can update their own items"
  ON lost_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);