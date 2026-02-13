/*
  # DASH10-5: Activity events for dashboard Recent Activity

  1. New Table: activity_events
    - id, user_id, type, title, description, item_id, created_at

  2. RLS: users can only read their own events
*/

CREATE TABLE IF NOT EXISTS activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  item_id uuid REFERENCES lost_items(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_events_user_created ON activity_events(user_id, created_at DESC);

ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activity_events"
  ON activity_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity_events"
  ON activity_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
