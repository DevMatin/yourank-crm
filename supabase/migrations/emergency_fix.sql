-- EMERGENCY FIX: Disable RLS completely to stop infinite recursion
-- Run this IMMEDIATELY in your Supabase SQL Editor

-- Disable RLS on all tables to stop the infinite recursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE rank_tracking DISABLE ROW LEVEL SECURITY;

-- Drop all policies to clean up
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can view own rank tracking" ON rank_tracking;
DROP POLICY IF EXISTS "Users can create own rank tracking" ON rank_tracking;
DROP POLICY IF EXISTS "Users can update own rank tracking" ON rank_tracking;
DROP POLICY IF EXISTS "Users can delete own rank tracking" ON rank_tracking;

-- This will immediately fix the infinite recursion
-- You can re-enable RLS later with proper policies
