-- Run this in the Supabase SQL editor after creating your project.

create table if not exists training_sessions (
  id uuid primary key default gen_random_uuid(),
  program_slug text not null,
  company_name text not null,
  week_label text not null,
  session_date date,
  technicians_count int default 0,
  created_at timestamptz default now()
);

create table if not exists device_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  device text,
  description text,
  video_url text not null,
  created_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  media jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Storage buckets (create these in Storage UI, or via API, then mark public):
--   training-media
--   device-videos
--   project-media

alter table training_sessions enable row level security;
alter table device_videos enable row level security;
alter table projects enable row level security;

-- Simple open policies to start — tighten these once you add auth for your team.
create policy "public read sessions" on training_sessions for select using (true);
create policy "public write sessions" on training_sessions for insert with check (true);

create policy "public read videos" on device_videos for select using (true);
create policy "public write videos" on device_videos for insert with check (true);

create policy "public read projects" on projects for select using (true);
create policy "public write projects" on projects for insert with check (true);
