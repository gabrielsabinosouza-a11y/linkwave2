-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- 1. Profiles table
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  username    text not null,
  display_name text,
  bio         text,
  avatar_url  text,
  banner_url  text,
  location    text,
  profession  text,
  website     text,
  verified    boolean not null default false,
  is_public   boolean not null default true,
  theme_config jsonb not null default '{}',
  seo_config  jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint profiles_username_key unique (username),
  constraint profiles_user_id_key unique (user_id)
);

-- 2. Links table
create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  url         text not null,
  icon        text,
  order_index integer not null default 0,
  is_active   boolean not null default true,
  clicks      integer not null default 0,
  created_at  timestamptz not null default now()
);

-- 3. Click events table
create table if not exists public.click_events (
  id          uuid primary key default gen_random_uuid(),
  link_id     uuid references public.links(id) on delete set null,
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  country     text,
  device      text,
  browser     text,
  referrer    text,
  created_at  timestamptz not null default now()
);

-- 4. Analytics table (materialized counters)
create table if not exists public.analytics (
  profile_id    uuid primary key references public.profiles(id) on delete cascade,
  total_views   integer not null default 0,
  total_clicks  integer not null default 0,
  views_today   integer not null default 0,
  clicks_today  integer not null default 0,
  updated_at    timestamptz not null default now()
);

-- 5. Auto-create analytics row when profile is inserted
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into public.analytics (profile_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- 6. RPC: increment link clicks
create or replace function public.increment_link_clicks(link_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.links set clicks = clicks + 1 where id = link_id;
  update public.analytics a
    set total_clicks = total_clicks + 1,
        clicks_today = clicks_today + 1,
        updated_at = now()
  from public.links l
  where l.id = link_id and l.profile_id = a.profile_id;
end;
$$;

-- 7. RPC: increment profile views
create or replace function public.increment_profile_views(profile_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.analytics
    set total_views = total_views + 1,
        views_today = views_today + 1,
        updated_at = now()
  where analytics.profile_id = profile_id;
end;
$$;

-- 8. Row Level Security
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.click_events enable row level security;
alter table public.analytics enable row level security;

-- profiles: public read, owner write
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (is_public = true);

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = user_id);

-- links: public read if profile is public, owner write
create policy "Links of public profiles are viewable"
  on public.links for select
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.is_public = true));

create policy "Users can manage their own links"
  on public.links for all
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid()));

-- analytics: owner read only
create policy "Users can view their own analytics"
  on public.analytics for select using (
    exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid())
  );

-- click_events: insert only (for tracking), owner read
create policy "Anyone can insert click events"
  on public.click_events for insert with check (true);

create policy "Users can view their own click events"
  on public.click_events for select using (
    exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid())
  );
