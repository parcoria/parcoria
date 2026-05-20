-- Run in Supabase SQL Editor
-- Contractor marketplace — private network + public directory

create table if not exists contractors (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  company text,
  trade_type text not null default 'general',
  license_number text,
  license_verified boolean default false,
  phone text,
  email text,
  jurisdictions text[] default '{}',
  rating integer check (rating >= 1 and rating <= 5),
  notes text,
  is_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table contractors enable row level security;

-- Users can manage their own contractors
create policy "Users manage own contractors"
  on contractors for all
  using (auth.uid() = user_id);

-- Anyone can read public verified contractors
create policy "Public can read verified public contractors"
  on contractors for select
  using (is_public = true and license_verified = true);

-- Indexes
create index if not exists contractors_user_id_idx on contractors(user_id);
create index if not exists contractors_trade_type_idx on contractors(trade_type);
create index if not exists contractors_is_public_idx on contractors(is_public, license_verified);
