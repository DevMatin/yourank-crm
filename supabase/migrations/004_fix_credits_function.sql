-- Fix the deduct_user_credits function to avoid RLS recursion
-- Drop the existing function first
DROP FUNCTION IF EXISTS public.deduct_user_credits(UUID, INTEGER);

-- Create a new function that properly handles RLS
CREATE OR REPLACE FUNCTION public.deduct_user_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_credits INTEGER;
    new_credits INTEGER;
    affected_rows INTEGER;
BEGIN
    -- Use a more direct approach to avoid RLS issues
    -- First, try to get current credits with a simple query
    SELECT credits INTO current_credits 
    FROM users 
    WHERE id = user_id;
    
    -- If no user found, raise an error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', user_id;
    END IF;
    
    -- Check if user has enough credits
    IF current_credits < amount THEN
        RAISE EXCEPTION 'Insufficient credits. Required: %, Available: %', amount, current_credits;
    END IF;
    
    -- Calculate new credits
    new_credits := current_credits - amount;
    
    -- Update credits and get the number of affected rows
    UPDATE users 
    SET credits = new_credits, updated_at = NOW()
    WHERE id = user_id;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    -- Check if the update was successful
    IF affected_rows = 0 THEN
        RAISE EXCEPTION 'Failed to update credits for user: %', user_id;
    END IF;
    
    RETURN new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also create a simpler function to check credits that avoids RLS issues
CREATE OR REPLACE FUNCTION public.get_user_credits(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    user_credits INTEGER;
BEGIN
    SELECT credits INTO user_credits 
    FROM users 
    WHERE id = user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', user_id;
    END IF;
    
    RETURN user_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
