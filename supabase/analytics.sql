-- Analytics table for tracking page views
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT NOT NULL
);

CREATE INDEX idx_page_views_created_at ON page_views(created_at);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read view count
CREATE POLICY "Anyone can read views"
  ON page_views
  FOR SELECT
  USING (true);

-- Allow anyone to insert views
CREATE POLICY "Anyone can track views"
  ON page_views
  FOR INSERT
  WITH CHECK (true);
