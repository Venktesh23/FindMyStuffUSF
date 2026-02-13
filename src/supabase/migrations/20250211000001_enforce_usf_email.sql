/*
  # Enforce USF Email Domain for Authentication

  1. Security Functions
    - Create function to validate @usf.edu email domain
    - Create trigger to enforce email validation on user signup

  2. RLS Policies Enhancement
    - Ensure only users with @usf.edu emails can access data
*/

-- Function to validate USF email domain
CREATE OR REPLACE FUNCTION public.validate_usf_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email ends with @usf.edu
  IF NEW.email NOT LIKE '%@usf.edu' THEN
    RAISE EXCEPTION 'Registration is restricted to University of South Florida (@usf.edu) email addresses only'
      USING HINT = 'Please use your USF email address to register';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table to validate email on signup
DROP TRIGGER IF EXISTS enforce_usf_email_trigger ON auth.users;
CREATE TRIGGER enforce_usf_email_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_usf_email();

-- Additional safety: Create policy to ensure only @usf.edu users can access data
-- This adds an extra layer of protection on existing tables

-- Update lost_items policies to include email check
DROP POLICY IF EXISTS "Anyone can view lost items" ON lost_items;
CREATE POLICY "USF users can view lost items"
  ON lost_items
  FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'email' LIKE '%@usf.edu');

DROP POLICY IF EXISTS "Users can create their own items" ON lost_items;
CREATE POLICY "USF users can create their own items"
  ON lost_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND 
    auth.jwt()->>'email' LIKE '%@usf.edu'
  );

DROP POLICY IF EXISTS "Users can update their own items" ON lost_items;
CREATE POLICY "USF users can update their own items"
  ON lost_items
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    auth.jwt()->>'email' LIKE '%@usf.edu'
  )
  WITH CHECK (
    auth.uid() = user_id AND 
    auth.jwt()->>'email' LIKE '%@usf.edu'
  );

-- Update notifications policies to include email check
DROP POLICY IF EXISTS "Users can read their own notifications" ON notifications;
CREATE POLICY "USF users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    auth.jwt()->>'email' LIKE '%@usf.edu'
  );

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "USF users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND 
    auth.jwt()->>'email' LIKE '%@usf.edu'
  )
  WITH CHECK (
    auth.uid() = user_id AND 
    auth.jwt()->>'email' LIKE '%@usf.edu'
  );

-- Add comment for documentation
COMMENT ON FUNCTION public.validate_usf_email() IS 'Validates that new user registrations use @usf.edu email addresses';
