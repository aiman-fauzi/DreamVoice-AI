# Data Model

## Overview

Supabase stores authentication in its built-in auth schema. The app stores product data in public tables with Row Level Security enabled.

All user-owned tables should include `parent_id uuid not null references auth.users(id)`.

## Tables

### `profiles`

One row per parent account.

Columns:

- `id uuid primary key references auth.users(id)`
- `display_name text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Ownership:

- `id` equals `auth.uid()`.

### `children`

Child profiles created by a parent.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `parent_id uuid not null references auth.users(id)`
- `name text not null`
- `age int not null`
- `language text not null default 'English'`
- `interests text[] not null default '{}'`
- `bedtime_tone text not null default 'calm'`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Ownership:

- `parent_id` equals `auth.uid()`.

### `stories`

Generated bedtime stories.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `parent_id uuid not null references auth.users(id)`
- `child_id uuid not null references children(id)`
- `theme_key text not null`
- `title text`
- `prompt text not null`
- `story_text text not null`
- `language text not null`
- `status text not null default 'completed'`
- `error_message text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Allowed `theme_key` values:

- `magical_adventure`
- `calm_bedtime`
- `brave_little_hero`
- `kindness_and_sharing`
- `animal_friends`
- `learning_quest`

Ownership:

- `parent_id` equals `auth.uid()`.
- `child_id` must belong to the same parent.

### `narrations`

Audio linked to a story.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `parent_id uuid not null references auth.users(id)`
- `story_id uuid not null references stories(id)`
- `kind text not null`
- `provider text not null`
- `voice_name text`
- `text_characters int not null default 0`
- `storage_bucket text not null default 'story-audio'`
- `storage_path text not null`
- `duration_seconds numeric`
- `status text not null default 'completed'`
- `error_message text`
- `created_at timestamptz default now()`

Allowed `kind` values:

- `google_tts`
- `manual_recording`

Allowed `provider` values:

- `google`
- `browser_recording`

Ownership:

- `parent_id` equals `auth.uid()`.
- `story_id` must belong to the same parent.

### `tts_usage_monthly`

Tracks app-side monthly TTS usage.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `parent_id uuid not null references auth.users(id)`
- `month_key text not null`
- `provider text not null default 'google'`
- `characters_used int not null default 0`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Constraints:

- Unique on `parent_id`, `month_key`, `provider`.

Ownership:

- `parent_id` equals `auth.uid()`.

## Storage

Bucket:

- `story-audio`

Recommended paths:

- Google TTS: `{parent_id}/{story_id}/{narration_id}.mp3`
- Manual recording: `{parent_id}/{story_id}/{narration_id}.webm`

Access:

- Private bucket.
- Playback through signed URLs.
- Uploads only for authenticated users to paths matching their user ID.

## RLS Policy Shape

Every user-owned table needs policies for authenticated users:

- Select own rows.
- Insert own rows.
- Update own rows.
- Delete own rows.

Policy condition pattern:

```sql
auth.uid() is not null and auth.uid() = parent_id
```

For `profiles`, use:

```sql
auth.uid() is not null and auth.uid() = id
```

Use server-side service role only for operations that must bypass RLS, such as trusted usage-counter increments or admin/debug reads.

