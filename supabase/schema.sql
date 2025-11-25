-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. Leaks Config
create table if not exists leaks_config (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  main_video_url text,
  created_at timestamptz default now()
);

-- Insert default config
insert into leaks_config (title, description, main_video_url)
values (
  'CASE #001: THE SIGNAL',
  'Unidentified signal intercepted from Sector 7. Viewer discretion advised.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
) on conflict do nothing;

-- 2. Evidence Photos
create table if not exists evidence_photos (
  id bigint primary key generated always as identity,
  url text not null,
  caption text,
  created_at timestamptz default now()
);

-- 3. Comments
create table if not exists comments (
  id bigint primary key generated always as identity,
  content text not null,
  session_id text,
  created_at timestamptz default now()
);

-- Enable Realtime
alter publication supabase_realtime add table comments;

-- Policies (Open for now for prototype speed, lock down later)
alter table leaks_config enable row level security;
create policy "Public Read Config" on leaks_config for select using (true);
create policy "Admin Update Config" on leaks_config for update using (true); -- In real app, check auth

alter table evidence_photos enable row level security;
create policy "Public Read Photos" on evidence_photos for select using (true);
create policy "Admin Insert Photos" on evidence_photos for insert with check (true);

alter table comments enable row level security;
create policy "Public Read Comments" on comments for select using (true);
create policy "Public Insert Comments" on comments for insert with check (true);
