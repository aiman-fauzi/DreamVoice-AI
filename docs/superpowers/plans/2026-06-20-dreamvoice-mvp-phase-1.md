# DreamVoice AI MVP Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the DreamVoice AI Phase 1 MVP: parents can sign up, create child profiles, generate personalized bedtime stories in English or Bahasa Malaysia, add Google TTS or manual narration, and return to a saved story library.

**Architecture:** Next.js App Router owns the UI and server routes. Supabase handles auth, Postgres, and private audio storage. Gemini generates story text server-side, and Google Cloud Text-to-Speech runs server-side only after the app-side monthly quota check passes.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage, Gemini API, Google Cloud Text-to-Speech, Vitest, Testing Library, Playwright, Vercel, GitHub.

---

## Repo State And Defaults

- Current workspace starts as documentation-only and is not yet a Git repository.
- Use email/password auth first.
- Support `English` and `Bahasa Malaysia` from day one.
- Use environment-configured Google TTS voices: `GOOGLE_TTS_DEFAULT_VOICE_EN` and `GOOGLE_TTS_DEFAULT_VOICE_MS`.
- Do not implement parent voice cloning, subscriptions, mobile apps, background music, multi-voice narration, public sharing, or advanced analytics.
- If Git is unavailable as `git`, use `C:\Program Files\Git\cmd\git.exe`.

## File Map

- App foundation: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `app/**`, `components/**`, `lib/**`, `tests/**`.
- Supabase assets: `supabase/migrations/0001_initial_schema.sql`, `supabase/seed.sql`, `supabase/tests/rls-smoke.sql`.
- Server integrations: `lib/gemini.ts`, `lib/google-tts.ts`, `lib/tts-quota.ts`, `app/api/stories/generate/route.ts`, `app/api/narrations/google/route.ts`, `app/api/narrations/manual/route.ts`, `app/api/audio/[narrationId]/route.ts`.
- Product helpers: `lib/story-themes.ts`, `lib/prompt-builder.ts`, `lib/limits.ts`, `lib/env.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/admin.ts`.
- Docs: update `docs/PROGRESS.md` after meaningful implementation sessions.

---

## Tasks

### Task 1: Repository And App Foundation

**Files:** `.gitignore`, `.env.example`, `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/ui/button.tsx`, `lib/utils.ts`, `docs/PROGRESS.md`.

- [ ] Initialize Git with `& 'C:\Program Files\Git\cmd\git.exe' init -b main`.
- [ ] Create a minimal Next.js App Router project without deleting existing docs.
- [ ] Add scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:watch`, `e2e`.
- [ ] Add `.env.example` with Supabase, Gemini, Google TTS, app URL, quota, and English/Bahasa Malaysia voice keys.
- [ ] Install dependencies with `npm install`.
- [ ] Verify with `npm run typecheck` and `npm run build`.
- [ ] Commit as `chore: scaffold next app foundation`; if Git identity is missing, ask for the user-preferred identity before setting local config.

### Task 2: Supabase Schema, RLS, And Client Helpers

**Files:** `supabase/migrations/0001_initial_schema.sql`, `supabase/seed.sql`, `supabase/tests/rls-smoke.sql`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/admin.ts`, `lib/database.types.ts`, `lib/env.ts`, `tests/env.test.ts`.

- [ ] Write failing tests for required environment variables and language-specific TTS voice lookup.
- [ ] Implement `requireServerEnv`, `getOptionalServerEnv`, and `getGoogleTtsVoice`.
- [ ] Create Supabase browser, server, and admin clients; admin client must never be imported by browser components.
- [ ] Add migration for `profiles`, `children`, `stories`, `narrations`, `tts_usage_monthly`, private `story-audio` bucket, constraints, and RLS policies.
- [ ] Add SQL smoke test proving owned records are allowed and cross-user records are blocked.
- [ ] Verify with `npm test -- tests/env.test.ts` and `npm run typecheck`.
- [ ] Commit as `feat: add supabase foundation`.

### Task 3: Auth, Protected Layout, And Child Profiles

**Files:** `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `app/(app)/layout.tsx`, `app/(app)/dashboard/page.tsx`, `app/(app)/children/page.tsx`, `app/(app)/children/actions.ts`, `components/auth/auth-form.tsx`, `components/children/child-form.tsx`, `components/children/children-list.tsx`, `lib/limits.ts`, `tests/limits.test.ts`.

- [ ] Write failing tests for `MAX_CHILDREN_PER_PARENT = 3`, story/month limit, TTS/month limit, manual recording byte limit, and story word-count range.
- [ ] Implement `lib/limits.ts` constants.
- [ ] Build email/password signup and login with Supabase.
- [ ] Redirect authenticated users to `/dashboard`; redirect anonymous app users to `/login`.
- [ ] Build child create/list UI with name, age, language, interests, and bedtime tone.
- [ ] Enforce max three children per parent in the server action before insert.
- [ ] Verify with limits test, typecheck, and build.
- [ ] Commit as `feat: add auth and child profiles`.

### Task 4: Prompt Builder And Theme UI

**Files:** `lib/story-themes.ts`, `lib/prompt-builder.ts`, `components/stories/theme-picker.tsx`, `tests/prompt-builder.test.ts`.

- [ ] Write failing tests for all six themes, English/Bahasa Malaysia instructions, child name, age, interests, language, tone, and 600-900 word target.
- [ ] Implement documented theme keys and labels.
- [ ] Implement `buildStoryPrompt(input)` using only MVP-safe child details and explicit text-only story instructions.
- [ ] Build theme button component.
- [ ] Verify with prompt-builder test and typecheck.
- [ ] Commit as `feat: add story prompt builder`.

### Task 5: Story Generation Core Loop

**Files:** `lib/gemini.ts`, `app/api/stories/generate/route.ts`, `app/(app)/stories/new/page.tsx`, `app/(app)/stories/[id]/page.tsx`, `components/stories/story-generator.tsx`, `tests/story-generation.test.ts`.

- [ ] Write failing tests for unauthenticated request, invalid theme, non-owned child, valid story save, and provider failure.
- [ ] Implement Gemini helper using `GEMINI_API_KEY`, server-side calls only, and `{ title, storyText }` output.
- [ ] Implement generation route: authenticate, validate child ownership, build prompt, call Gemini, save story, return story id.
- [ ] Build UI to select child, choose a theme, show loading/error/success, and open story detail.
- [ ] Verify prompt and story tests, typecheck, and build.
- [ ] Commit as `feat: add story generation loop`.

### Task 6: Google TTS Quota And Narration

**Files:** `lib/tts-quota.ts`, `lib/google-tts.ts`, `app/api/narrations/google/route.ts`, `components/narrations/google-narration-button.tsx`, `tests/tts-quota.test.ts`, `tests/google-narration.test.ts`.

- [ ] Write failing tests for month key generation, allowed quota, exact-limit blocking, and over-limit blocking before provider calls.
- [ ] Implement `getMonthKey(date)` and `canUseTts({ used, requested, limit })`.
- [ ] Implement Google TTS route: authenticate, validate story ownership, check quota, choose language voice, call provider, upload MP3, save narration, increment usage after success.
- [ ] Build story-detail narration UI with quota-exhausted state and playback.
- [ ] Verify TTS tests, typecheck, and build.
- [ ] Commit as `feat: add quota gated google narration`.

### Task 7: Manual Recording And Audio Playback

**Files:** `app/api/narrations/manual/route.ts`, `app/api/audio/[narrationId]/route.ts`, `components/narrations/manual-recorder.tsx`, `components/narrations/audio-player.tsx`, `tests/manual-recording.test.ts`.

- [ ] Write failing tests for unauthenticated save, non-owned story, oversized recording, valid manual metadata save, and owned signed playback.
- [ ] Implement manual metadata route requiring story ownership and storage path prefix `{parent_id}/{story_id}/`.
- [ ] Implement signed audio route for owned narration records only.
- [ ] Build `MediaRecorder` UI that requests microphone only after clicking record, uploads WebM, saves metadata, and shows playback.
- [ ] Verify manual recording tests, typecheck, and build.
- [ ] Commit as `feat: add manual narration recording`.

### Task 8: Story Library And Prototype Debug

**Files:** `app/(app)/library/page.tsx`, `components/stories/story-library.tsx`, `app/(app)/debug/page.tsx`, `tests/library.test.ts`.

- [ ] Write failing tests for newest-first ordering, child filtering, and server-only debug data access.
- [ ] Build library page listing owned stories, child filter, detail links, and narration availability.
- [ ] Build protected debug page showing story count, narration count, current month TTS characters, and recent failed generations.
- [ ] Verify library tests, typecheck, and build.
- [ ] Commit as `feat: add story library and debug view`.

### Task 9: End-To-End Verification And Documentation

**Files:** `tests/e2e/main-flow.spec.ts`, `README.md`, `docs/PROGRESS.md`.

- [ ] Add Playwright smoke test for public landing page, unauthenticated redirect, and mocked or credential-free main UI states.
- [ ] Run `npm test`, `npm run typecheck`, `npm run build`, and `npm run e2e`.
- [ ] Run `supabase/tests/rls-smoke.sql` against a Supabase development project before public testing.
- [ ] Update README with local setup and deployment notes.
- [ ] Update `docs/PROGRESS.md` with implementation status, decisions, remaining credential steps, and blockers.
- [ ] Commit as `docs: update progress after mvp implementation`.

## Completion Criteria

- A parent can sign up and log in.
- A parent can create up to three child profiles.
- A parent can choose one of six themes and generate a saved story in English or Bahasa Malaysia.
- A parent can generate Google TTS narration only when app-side quota allows.
- A parent can record manual narration even when TTS quota is exhausted.
- Saved stories and narrations are available in the library.
- RLS prevents one parent from accessing another parent's records.
- Unit tests, typecheck, build, and browser smoke checks have been run before claiming completion.
