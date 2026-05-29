-- Run in Supabase SQL Editor
-- Developer profile table for Dashboard settings tab

create table if not exists developer_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text,
  company text,
  phone text,
  email text,
  updated_at timestamp with time zone default now()
);

alter table developer_profiles enable row level security;
create policy "Users own their developer profile"
  on developer_profiles for all using (auth.uid() = user_id);
