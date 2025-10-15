-- Add role column to users table
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create admin policies for all tables
-- Admin can do everything on users table
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete all users" ON users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admin can do everything on projects table
CREATE POLICY "Admins can view all projects" ON projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all projects" ON projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete all projects" ON projects
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert projects" ON projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admin can do everything on analyses table
CREATE POLICY "Admins can view all analyses" ON analyses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all analyses" ON analyses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete all analyses" ON analyses
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert analyses" ON analyses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admin can do everything on rank_tracking table
CREATE POLICY "Admins can view all rank tracking" ON rank_tracking
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all rank tracking" ON rank_tracking
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete all rank tracking" ON rank_tracking
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert rank tracking" ON rank_tracking
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create function to promote user to admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Check if current user is admin
    SELECT role INTO current_user_role FROM users WHERE id = auth.uid();
    
    IF current_user_role != 'admin' THEN
        RAISE EXCEPTION 'Only admins can promote users to admin';
    END IF;
    
    -- Promote user to admin
    UPDATE users 
    SET role = 'admin', updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to demote admin to user
CREATE OR REPLACE FUNCTION public.demote_from_admin(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Check if current user is admin
    SELECT role INTO current_user_role FROM users WHERE id = auth.uid();
    
    IF current_user_role != 'admin' THEN
        RAISE EXCEPTION 'Only admins can demote users from admin';
    END IF;
    
    -- Prevent demoting yourself
    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot demote yourself from admin';
    END IF;
    
    -- Demote user from admin
    UPDATE users 
    SET role = 'user', updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all users (admin only)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    credits INTEGER,
    plan TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can view all users';
    END IF;
    
    RETURN QUERY
    SELECT u.id, u.email, u.name, u.credits, u.plan, u.role, u.created_at, u.updated_at
    FROM users u
    ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all projects (admin only)
CREATE OR REPLACE FUNCTION public.get_all_projects()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name TEXT,
    domain TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can view all projects';
    END IF;
    
    RETURN QUERY
    SELECT p.id, p.user_id, p.name, p.domain, p.created_at, p.updated_at
    FROM projects p
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all analyses (admin only)
CREATE OR REPLACE FUNCTION public.get_all_analyses()
RETURNS TABLE (
    id UUID,
    project_id UUID,
    user_id UUID,
    type TEXT,
    input JSONB,
    task_id TEXT,
    status TEXT,
    result JSONB,
    credits_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can view all analyses';
    END IF;
    
    RETURN QUERY
    SELECT a.id, a.project_id, a.user_id, a.type, a.input, a.task_id, a.status, a.result, a.credits_used, a.created_at, a.updated_at
    FROM analyses a
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get all rank tracking (admin only)
CREATE OR REPLACE FUNCTION public.get_all_rank_tracking()
RETURNS TABLE (
    id UUID,
    project_id UUID,
    keyword TEXT,
    "position" INTEGER,
    volume INTEGER,
    trend JSONB,
    checked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can view all rank tracking';
    END IF;
    
    RETURN QUERY
    SELECT rt.id, rt.project_id, rt.keyword, rt."position", rt.volume, rt.trend, rt.checked_at, rt.created_at
    FROM rank_tracking rt
    ORDER BY rt.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add credits to any user (admin only)
CREATE OR REPLACE FUNCTION public.add_user_credits(target_user_id UUID, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
    current_credits INTEGER;
    new_credits INTEGER;
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can add credits to users';
    END IF;
    
    -- Get current credits
    SELECT credits INTO current_credits FROM users WHERE id = target_user_id;
    
    -- Calculate new credits
    new_credits := current_credits + amount;
    
    -- Update credits
    UPDATE users 
    SET credits = new_credits, updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set user plan (admin only)
CREATE OR REPLACE FUNCTION public.set_user_plan(target_user_id UUID, new_plan TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if current user is admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can change user plans';
    END IF;
    
    -- Validate plan
    IF new_plan NOT IN ('free', 'basic', 'premium', 'enterprise') THEN
        RAISE EXCEPTION 'Invalid plan. Must be one of: free, basic, premium, enterprise';
    END IF;
    
    -- Update plan
    UPDATE users 
    SET plan = new_plan, updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for role column
CREATE INDEX idx_users_role ON users(role);

-- Update the handle_new_user function to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, credits, plan, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        100,
        'free',
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
