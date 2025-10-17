-- Add 500 credits to your account
-- Run this in your Supabase SQL Editor

-- Replace 'f628f37b-6326-4189-a382-3a2ba9751504' with your actual user ID if different
UPDATE users 
SET credits = credits + 500, 
    updated_at = NOW()
WHERE id = 'f628f37b-6326-4189-a382-3a2ba9751504';

-- Verify the update
SELECT id, email, credits, updated_at 
FROM users 
WHERE id = 'f628f37b-6326-4189-a382-3a2ba9751504';
