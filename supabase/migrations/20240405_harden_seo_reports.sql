ALTER TABLE seo_reports 
ADD COLUMN IF NOT EXISTS processing_time_ms INT,
ADD COLUMN IF NOT EXISTS is_async BOOLEAN DEFAULT FALSE;

-- Add index for deduplication performance
CREATE INDEX IF NOT EXISTS idx_seo_reports_dedup 
ON seo_reports (url, organization_id, created_at DESC);
