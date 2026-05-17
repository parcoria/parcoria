-- Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste and run

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_email text,
  name text,
  jurisdiction text,
  address text,
  project_type text,
  cost text,
  flags jsonb default '{}',
  permit_count integer,
  timeline text,
  fees text,
  status text default 'active',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Row level security
alter table projects enable row level security;

-- Users can only see their own projects
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

-- Users can insert their own projects
create policy "Users can insert own projects"
  on projects for insert
  with check (auth.uid() = user_id);

-- Users can update their own projects
create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);

-- Users can delete their own projects
create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = user_id);

-- Index for fast user lookups
create index if not exists projects_user_id_idx on projects(user_id);
create index if not exists projects_updated_at_idx on projects(updated_at desc);
