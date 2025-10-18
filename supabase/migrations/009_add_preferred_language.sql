-- Migration: Add preferred_language to user_settings
-- Description: Adds language preference field to user_settings table for i18n support

-- Add preferred_language column to user_settings table
ALTER TABLE user_settings 
ADD COLUMN preferred_language VARCHAR(5) DEFAULT 'de';

-- Add comment for documentation
COMMENT ON COLUMN user_settings.preferred_language IS 'User preferred language for i18n (de, en, es, fr)';

-- Create index for better performance on language queries
CREATE INDEX idx_user_settings_preferred_language ON user_settings(preferred_language);

-- Update existing users to have default language preference
UPDATE user_settings 
SET preferred_language = 'de' 
WHERE preferred_language IS NULL;
