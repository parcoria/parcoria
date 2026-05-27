-- Run in Supabase SQL Editor
-- Contractor Mode: contractor_profiles + client_jobs tables

-- Contractor profiles
create table if not exists contractor_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  user_email text,
  business_name text not null,
  dba text,
  license_type text default 'gc',
  license_number text,
  license_expires date,
  insurance_carrier text,
  insurance_policy text,
  insurance_expires date,
  bond_number text,
  phone text,
  email text,
  address text,
  jurisdictions text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table contractor_profiles enable row level security;
create policy "Users own their profile" on contractor_profiles for all using (auth.uid() = user_id);

-- Client jobs
create table if not exists client_jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_name text not null,
  address text not null,
  jurisdiction text default 'raleigh',
  project_type text default 'sfh',
  status text default 'active',
  permit_statuses jsonb default '{}',
  next_action text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table client_jobs enable row level security;
create policy "Users own their jobs" on client_jobs for all using (auth.uid() = user_id);

-- Indexes
create index if not exists contractor_profiles_user_id_idx on contractor_profiles(user_id);
create index if not exists client_jobs_user_id_idx on client_jobs(user_id);
create index if not exists client_jobs_status_idx on client_jobs(status);
