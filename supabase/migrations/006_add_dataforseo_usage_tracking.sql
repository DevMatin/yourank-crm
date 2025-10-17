-- Create DataForSEO usage tracking table
CREATE TABLE dataforseo_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
    api_endpoint TEXT NOT NULL,
    task_id TEXT,
    cost DECIMAL(10, 4),
    credits_used INTEGER DEFAULT 1,
    request_data JSONB,
    response_data JSONB,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_dataforseo_usage_user_id ON dataforseo_usage(user_id);
CREATE INDEX idx_dataforseo_usage_analysis_id ON dataforseo_usage(analysis_id);
CREATE INDEX idx_dataforseo_usage_api_endpoint ON dataforseo_usage(api_endpoint);
CREATE INDEX idx_dataforseo_usage_created_at ON dataforseo_usage(created_at DESC);
CREATE INDEX idx_dataforseo_usage_task_id ON dataforseo_usage(task_id);

-- Create trigger for updated_at
CREATE TRIGGER update_dataforseo_usage_updated_at BEFORE UPDATE ON dataforseo_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE dataforseo_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own usage
CREATE POLICY "Users can view own dataforseo usage" ON dataforseo_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own usage
CREATE POLICY "Users can insert own dataforseo usage" ON dataforseo_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own usage
CREATE POLICY "Users can update own dataforseo usage" ON dataforseo_usage
    FOR UPDATE USING (auth.uid() = user_id);
