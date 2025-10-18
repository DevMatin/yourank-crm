-- Add user settings table for storing UI preferences
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, setting_key)
);

-- Create indexes for better performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_settings_key ON user_settings(setting_key);

-- Create trigger for updated_at
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own settings
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own settings
CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own settings
CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own settings
CREATE POLICY "Users can delete own settings" ON user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to get user setting with default value
CREATE OR REPLACE FUNCTION public.get_user_setting(
    p_user_id UUID,
    p_setting_key TEXT,
    p_default_value JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT setting_value INTO result
    FROM user_settings
    WHERE user_id = p_user_id AND setting_key = p_setting_key;
    
    RETURN COALESCE(result, p_default_value);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set user setting
CREATE OR REPLACE FUNCTION public.set_user_setting(
    p_user_id UUID,
    p_setting_key TEXT,
    p_setting_value JSONB
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO user_settings (user_id, setting_key, setting_value)
    VALUES (p_user_id, p_setting_key, p_setting_value)
    ON CONFLICT (user_id, setting_key)
    DO UPDATE SET 
        setting_value = EXCLUDED.setting_value,
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
