# DreamVoice AI MVP Phase 1 Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build a free-first DreamVoice AI prototype where parents generate personalized bedtime stories and optional narration.

**Architecture:** Next.js runs the web UI and server routes. Supabase handles auth, database, and storage. Gemini generates story text, and Google Cloud Text-to-Speech generates narration only when app-side quota allows.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Supabase, Gemini API, Google Cloud Text-to-Speech, Vercel, GitHub, Vitest, Playwright.

---

## Build Phases

### Phase 0: Repository Setup

- [ ] Create Next.js app with TypeScript.
- [ ] Add Tailwind CSS and base UI components.
- [ ] Add lint, format, and test scripts.
- [ ] Add environment variable example file.
- [ ] Commit initial app shell.

### Phase 1: Supabase Foundation

- [ ] Create Supabase project.
- [ ] Add Supabase client helpers for browser and server.
- [ ] Add database migrations for `profiles`, `children`, `stories`, `narrations`, and `tts_usage_monthly`.
- [ ] Add private `story-audio` storage bucket.
- [ ] Add Row Level Security policies.
- [ ] Test that one parent cannot read another parent's records.

### Phase 2: Authentication and Onboarding

- [ ] Build sign up page.
- [ ] Build login page.
- [ ] Build protected app layout.
- [ ] Build parent profile form.
- [ ] Build child profile create/edit flow.
- [ ] Add empty states for first-time users.

### Phase 3: Prompt Builder

- [ ] Define the six story theme presets.
- [ ] Build prompt-generation utility.
- [ ] Add unit tests for each theme.
- [ ] Add tests for child age, interests, language, and tone handling.
- [ ] Build theme button UI.

### Phase 4: Story Generation

- [ ] Add server route for story generation.
- [ ] Validate authenticated user and child ownership.
- [ ] Send structured prompt to Gemini.
- [ ] Save story prompt and generated text.
- [ ] Show loading, success, and failure states.
- [ ] Add story detail page.

### Phase 5: Google TTS Narration

- [ ] Add server helper for Google Cloud Text-to-Speech.
- [ ] Add TTS monthly quota checker.
- [ ] Add usage-counter increment logic.
- [ ] Add server route for narration generation.
- [ ] Upload generated audio to Supabase Storage.
- [ ] Save narration metadata.
- [ ] Show quota-exhausted UI state.

### Phase 6: Manual Parent Recording

- [ ] Add browser recording UI.
- [ ] Request microphone permission clearly.
- [ ] Record audio locally in the browser.
- [ ] Upload recording to Supabase Storage.
- [ ] Save narration metadata as `manual_recording`.
- [ ] Add playback after upload.

### Phase 7: Story Library

- [ ] Build library page.
- [ ] List stories by newest first.
- [ ] Filter by child profile.
- [ ] Open story detail.
- [ ] Play generated or manual narration.
- [ ] Delete stories and associated narration metadata.

### Phase 8: Prototype Admin and Debug

- [ ] Add owner-only debug route for local/prototype use.
- [ ] Show story count.
- [ ] Show narration count.
- [ ] Show monthly Google TTS characters used.
- [ ] Show recent failed generations.

### Phase 9: Verification

- [ ] Run unit tests.
- [ ] Run lint.
- [ ] Run type check.
- [ ] Run Playwright smoke test for the main flow.
- [ ] Verify Supabase RLS with two test users.
- [ ] Verify Vercel preview deployment.

### Phase 10: Deployment

- [ ] Push repository to GitHub.
- [ ] Import repository in Vercel.
- [ ] Add environment variables in Vercel.
- [ ] Deploy preview.
- [ ] Test sign up, child creation, story generation, TTS, manual recording, and library playback.
- [ ] Promote to production.

## First Build Target

The first useful milestone is:

1. Sign up.
2. Create child profile.
3. Click one story button.
4. Generate and save story text.

Do not start TTS until the story generation loop is stable.

