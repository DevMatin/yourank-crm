-- Migration: Add preferred_keyword_view to users table
-- This allows users to set their default keyword view preference

ALTER TABLE users 
ADD COLUMN preferred_keyword_view TEXT DEFAULT 'overview';

-- Add constraint to ensure valid values
ALTER TABLE users 
ADD CONSTRAINT check_preferred_keyword_view 
CHECK (preferred_keyword_view IN ('overview', 'research', 'competition', 'performance', 'trends', 'audience'));

-- Add comment for documentation
COMMENT ON COLUMN users.preferred_keyword_view IS 'User preference for default keyword analysis view';
