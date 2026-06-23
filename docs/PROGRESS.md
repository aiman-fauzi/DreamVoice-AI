# Progress

## Current Status

Phase 1 MVP local implementation is complete and live-provider verified in the development Supabase/Google project. The app includes the Next.js foundation, Supabase schema/client foundation, auth screens, child profile flow, prompt builder, story generation route/UI, Google TTS quota route/UI, manual recording route/UI, story library, prototype debug page, and baseline automated tests.

Provider state:

- Supabase Auth, expected tables, RLS policies, and private `story-audio` bucket are live-verified.
- Gemini story generation uses `GEMINI_MODEL`, defaulting to `gemini-3.5-flash`, and live model availability is verified.
- Google Cloud Text-to-Speech API is enabled for Google Cloud project `dreamvoice-ai`.
- Google TTS supports local Application Default Credentials when `GOOGLE_APPLICATION_CREDENTIALS_JSON` is not set.
- Story generation defaults to short 120 to 180 word test stories with a 2500-character target for Google TTS single-request safety.
- Login uses full document navigation after auth so server-rendered protected pages receive Supabase session cookies reliably.

## Latest Conversation

Date: 2026-06-23

Summary:

- Fixed login post-auth navigation by switching from client router navigation to full document navigation, so protected server-rendered pages receive Supabase session cookies reliably.
- Ran live Supabase diagnostics: auth admin access, expected tables, and private `story-audio` bucket all responded successfully.
- Ran live Google TTS smoke: synthesized a short MP3 with `en-US-Wavenet-F` using local ADC.
- Ran RLS smoke with two temporary users and cleanup: user B could not read user A's children, stories, narrations, or TTS usage, and cross-owner story insert was rejected.
- Ran full live app smoke with temporary user and cleanup: login, child creation, Gemini story generation, story length under TTS limit, Google narration generation, narration metadata save, storage upload, storage cleanup, and user cleanup all passed.
- Re-verified tests, linting, type checking, and production build after the auth fix.

Earlier provider setup summary:

- Added Google Cloud TTS ADC fallback when `GOOGLE_APPLICATION_CREDENTIALS_JSON` is absent or blank.
- Preserved support for explicit JSON credentials when `GOOGLE_APPLICATION_CREDENTIALS_JSON` is configured.
- Fixed browser-side Supabase env loading by replacing dynamic `NEXT_PUBLIC_...` lookup with static Next.js-compatible references.
- Replaced hardcoded `gemini-1.5-flash` with configurable `GEMINI_MODEL`, defaulting to `gemini-3.5-flash`.
- Enabled `texttospeech.googleapis.com` for Google Cloud project `dreamvoice-ai` and verified it is listed as enabled.
- Reduced default generated story length from the old 600-900 word MVP range to 120-180 words for testing, with `STORY_WORD_COUNT_MIN` and `STORY_WORD_COUNT_MAX` overrides.

## Completed

- Project documentation set created.
- Detailed implementation plan created.
- Next.js app foundation created.
- Supabase schema and RLS migration drafted and live-verified.
- Auth and child profile UI created.
- Prompt builder and six theme presets created.
- Story generation route and UI created.
- Google TTS quota helper, route, and UI created.
- Google TTS ADC fallback added and live-verified.
- Manual recording route and UI created.
- Story library and debug page created.
- Unit tests created for core helpers.
- Public-entry Playwright smoke test created and verified.
- Full live app smoke completed with temporary data cleanup.

## In Progress

- Vercel deployment setup and production environment configuration.
- Production Google Cloud authentication strategy for Vercel.
- Git commit/branch finishing once workspace Git metadata is usable.

## Verification

Latest local verification completed on 2026-06-23:

- `npm test` - 8 files passed, 36 tests passed.
- `npm run lint` - passed with zero warnings.
- `npm run typecheck` - passed.
- `npm run build` - passed.
- Supabase live diagnostics - auth admin, expected tables, and private `story-audio` bucket passed.
- Google TTS live smoke - short MP3 synthesis passed using `en-US-Wavenet-F`.
- Supabase RLS smoke - owned/non-owned isolation passed with two temporary users and cleanup.
- Full live app smoke - login, child creation, Gemini story, Google TTS narration, storage upload, and cleanup passed.
- Gemini ListModels live check - configured model `gemini-3.5-flash` is available for `generateContent`.
- Google Cloud services check - `texttospeech.googleapis.com` is enabled for `dreamvoice-ai`.
- `npm run e2e` - last passed earlier after installing Playwright Chromium and running with browser-launch permissions; not rerun because the stronger live smoke passed today.

## Blocked

- Normal repository commits are blocked because `.git` is sandbox-protected in this workspace.
- Subagent-driven development is blocked because the workspace is out of subagent credits.
- Vercel Google Cloud TTS deployment still needs a production credential strategy if service account JSON keys are blocked by organization policy.

## Open Questions

- Which Git `user.name` and `user.email` should be used for local commits?
- Which production Google Cloud authentication path should be used for Vercel if service account JSON keys remain blocked by policy?
- Should Supabase email confirmation be enabled for public testing after SMTP is configured?

## Next Action

- Decide production Google Cloud authentication strategy for Vercel.
- Configure Vercel environment variables and deployment once Git/GitHub is ready.
- Finish Git commit/branch workflow after resolving workspace Git metadata restrictions.

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
