create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  age int not null check (age between 1 and 12),
  language text not null default 'English' check (language in ('English', 'Bahasa Malaysia')),
  interests text[] not null default '{}',
  bedtime_tone text not null default 'calm',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  theme_key text not null check (
    theme_key in (
      'magical_adventure',
      'calm_bedtime',
      'brave_little_hero',
      'kindness_and_sharing',
      'animal_friends',
      'learning_quest'
    )
  ),
  title text,
  prompt text not null,
  story_text text not null,
  language text not null check (language in ('English', 'Bahasa Malaysia')),
  status text not null default 'completed' check (status in ('completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.narrations (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  kind text not null check (kind in ('google_tts', 'manual_recording')),
  provider text not null check (provider in ('google', 'browser_recording')),
  voice_name text,
  text_characters int not null default 0 check (text_characters >= 0),
  storage_bucket text not null default 'story-audio',
  storage_path text not null,
  duration_seconds numeric check (duration_seconds is null or duration_seconds >= 0),
  status text not null default 'completed' check (status in ('completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.tts_usage_monthly (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  month_key text not null check (month_key ~ '^\d{4}-\d{2}$'),
  provider text not null default 'google',
  characters_used int not null default 0 check (characters_used >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parent_id, month_key, provider)
);

create index if not exists children_parent_id_idx on public.children(parent_id);
create index if not exists stories_parent_id_created_at_idx on public.stories(parent_id, created_at desc);
create index if not exists stories_child_id_idx on public.stories(child_id);
create index if not exists narrations_story_id_idx on public.narrations(story_id);
create index if not exists tts_usage_monthly_parent_month_idx on public.tts_usage_monthly(parent_id, month_key);

create or replace function public.ensure_story_child_owner()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1 from public.children c
    where c.id = new.child_id and c.parent_id = new.parent_id
  ) then
    raise exception 'story child must belong to parent';
  end if;
  return new;
end;
$$;

create or replace function public.ensure_narration_story_owner()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1 from public.stories s
    where s.id = new.story_id and s.parent_id = new.parent_id
  ) then
    raise exception 'narration story must belong to parent';
  end if;
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_children_updated_at on public.children;
create trigger set_children_updated_at before update on public.children
for each row execute function public.set_updated_at();

drop trigger if exists set_stories_updated_at on public.stories;
create trigger set_stories_updated_at before update on public.stories
for each row execute function public.set_updated_at();

drop trigger if exists set_tts_usage_monthly_updated_at on public.tts_usage_monthly;
create trigger set_tts_usage_monthly_updated_at before update on public.tts_usage_monthly
for each row execute function public.set_updated_at();

drop trigger if exists ensure_story_child_owner_trigger on public.stories;
create trigger ensure_story_child_owner_trigger before insert or update of parent_id, child_id on public.stories
for each row execute function public.ensure_story_child_owner();

drop trigger if exists ensure_narration_story_owner_trigger on public.narrations;
create trigger ensure_narration_story_owner_trigger before insert or update of parent_id, story_id on public.narrations
for each row execute function public.ensure_narration_story_owner();

alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.stories enable row level security;
alter table public.narrations enable row level security;
alter table public.tts_usage_monthly enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() is not null and auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() is not null and auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() is not null and auth.uid() = id) with check (auth.uid() is not null and auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete to authenticated using (auth.uid() is not null and auth.uid() = id);

create policy "children_select_own" on public.children for select to authenticated using (auth.uid() is not null and auth.uid() = parent_id);
create policy "children_insert_own" on public.children for insert to authenticated with check (auth.uid() is not null and auth.uid() = parent_id);
create policy "children_update_own" on public.children for update to authenticated using (auth.uid() is not null and auth.uid() = parent_id) with check (auth.uid() is not null and auth.uid() = parent_id);
create policy "children_delete_own" on public.children for delete to authenticated using (auth.uid() is not null and auth.uid() = parent_id);

create policy "stories_select_own" on public.stories for select to authenticated using (auth.uid() is not null and auth.uid() = parent_id);
create policy "stories_insert_own" on public.stories for insert to authenticated with check (auth.uid() is not null and auth.uid() = parent_id);
create policy "stories_update_own" on public.stories for update to authenticated using (auth.uid() is not null and auth.uid() = parent_id) with check (auth.uid() is not null and auth.uid() = parent_id);
create policy "stories_delete_own" on public.stories for delete to authenticated using (auth.uid() is not null and auth.uid() = parent_id);

create policy "narrations_select_own" on public.narrations for select to authenticated using (auth.uid() is not null and auth.uid() = parent_id);
create policy "narrations_insert_own" on public.narrations for insert to authenticated with check (auth.uid() is not null and auth.uid() = parent_id);
create policy "narrations_update_own" on public.narrations for update to authenticated using (auth.uid() is not null and auth.uid() = parent_id) with check (auth.uid() is not null and auth.uid() = parent_id);
create policy "narrations_delete_own" on public.narrations for delete to authenticated using (auth.uid() is not null and auth.uid() = parent_id);

create policy "tts_usage_select_own" on public.tts_usage_monthly for select to authenticated using (auth.uid() is not null and auth.uid() = parent_id);
create policy "tts_usage_insert_own" on public.tts_usage_monthly for insert to authenticated with check (auth.uid() is not null and auth.uid() = parent_id);
create policy "tts_usage_update_own" on public.tts_usage_monthly for update to authenticated using (auth.uid() is not null and auth.uid() = parent_id) with check (auth.uid() is not null and auth.uid() = parent_id);
create policy "tts_usage_delete_own" on public.tts_usage_monthly for delete to authenticated using (auth.uid() is not null and auth.uid() = parent_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'story-audio',
  'story-audio',
  false,
  26214400,
  array['audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/wav']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "story_audio_select_own_path" on storage.objects for select to authenticated
using (bucket_id = 'story-audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "story_audio_insert_own_path" on storage.objects for insert to authenticated
with check (bucket_id = 'story-audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "story_audio_update_own_path" on storage.objects for update to authenticated
using (bucket_id = 'story-audio' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'story-audio' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "story_audio_delete_own_path" on storage.objects for delete to authenticated
using (bucket_id = 'story-audio' and auth.uid()::text = (storage.foldername(name))[1]);