-- SEO Reports Table
CREATE TABLE IF NOT EXISTS seo_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  score INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  report JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance at 100k+ users
CREATE INDEX IF NOT EXISTS idx_seo_reports_org ON seo_reports (organization_id);
CREATE INDEX IF NOT EXISTS idx_seo_reports_user ON seo_reports (user_id);
CREATE INDEX IF NOT EXISTS idx_seo_reports_created ON seo_reports (created_at DESC);

-- RLS Policies
ALTER TABLE seo_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view reports for their organizations
CREATE POLICY "Users can view org reports" ON seo_reports
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can create reports
CREATE POLICY "Users can create reports" ON seo_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own organization reports (for service layer)
CREATE POLICY "Users can update org reports" ON seo_reports
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );
