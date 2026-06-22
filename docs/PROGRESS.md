# Progress

## Current Status

Phase 1 MVP local implementation is complete for the code-backed prototype surface. The app includes the Next.js foundation, Supabase schema/client foundation, auth screens, child profile flow, prompt builder, story generation route/UI, Google TTS quota route/UI, manual recording route/UI, story library, prototype debug page, and baseline automated tests.

## Latest Conversation

Date: 2026-06-22

Summary:

- Created a detailed implementation plan at `docs/superpowers/plans/2026-06-20-dreamvoice-mvp-phase-1.md`.
- Subagent workflow could not continue because the workspace ran out of subagent credits, so implementation continued inline using the approved fallback workflow.
- Git was installed but not available as plain `git`; direct Git path exists at `C:\Program Files\Git\cmd\git.exe`.
- Normal `.git` initialization is blocked by sandbox permissions, so commits were not created in the workspace.
- Scaffolded a Next.js App Router app with TypeScript, Tailwind, Vitest, Playwright, ESLint, Supabase, Gemini, and Google TTS dependencies.
- Added Supabase migration for profiles, children, stories, narrations, TTS usage, private story audio storage, and RLS policy shape.
- Implemented email/password auth screens, protected app layout, child profile creation, six story themes, prompt generation, story generation, narration controls, story library, and debug counters.
- Added tests for env helpers, limits, prompt builder, story generation helpers, TTS quota, manual recording validation, and library helpers.
- Added and verified a Playwright smoke test for public entry points.

Decisions made:

- Email/password auth first.
- English and Bahasa Malaysia are supported from day one.
- Google TTS voice names are environment-configured.
- Manual recording remains available as the free alternative to voice cloning.
- Commits are deferred until Git metadata can be written normally or the user provides a preferred Git identity for the external metadata workaround.

Open questions:

- Which Git `user.name` and `user.email` should be used for local commits?
- Which exact Google TTS voices should be used after provider-dashboard verification?
- Should Supabase email confirmation be enabled during early local testing, or disabled for faster prototype iteration?

Next action:

- Configure real Supabase, Gemini, and Google Cloud credentials.
- Apply the Supabase migration to a development project.
- Verify live auth, story generation, TTS, storage, signed playback, and RLS behavior with two test users.

## Completed

- Project documentation set created.
- Detailed implementation plan created.
- Next.js app foundation created.
- Supabase schema and RLS migration drafted.
- Auth and child profile UI created.
- Prompt builder and six theme presets created.
- Story generation route and UI created.
- Google TTS quota helper, route, and UI created.
- Manual recording route and UI created.
- Story library and debug page created.
- Unit tests created for core helpers.
- Public-entry Playwright smoke test created and verified.

## In Progress

- Provider credential setup and live Supabase/Gemini/Google Cloud verification.
- Supabase RLS live verification.

## Verification

Latest local verification completed on 2026-06-22:

- `npm test` - 7 files passed, 29 tests passed.
- `npm run lint` - passed with zero warnings.
- `npm run typecheck` - passed.
- `npm run build` - passed.
- `npm run e2e` - passed after installing Playwright Chromium and running with browser-launch permissions.

## Blocked

- Normal repository commits are blocked because `.git` is sandbox-protected in this workspace.
- Subagent-driven development is blocked because the workspace is out of subagent credits.
- Live Supabase, Gemini, and Google Cloud TTS behavior cannot be verified until credentials and a Supabase project are configured.

## Key Decisions

- Use Supabase for auth, database, and storage.
- Use Gemini API free tier for story generation.
- Use Google Cloud TTS for Phase 1 generated narration.
- Enforce app-side TTS character usage limits.
- Keep voice cloning for Phase 2.
- Deploy via Vercel from GitHub.
- Keep paid features out of Phase 1.

## Useful Links

- Google Cloud TTS pricing: https://cloud.google.com/text-to-speech/pricing
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Vercel pricing: https://vercel.com/pricing
- GitHub pricing: https://github.com/pricing
- Supabase docs: https://supabase.com/docs