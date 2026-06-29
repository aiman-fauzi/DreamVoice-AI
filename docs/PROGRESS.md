# Progress

## Current Status

Phase 1 MVP local implementation is complete and the authenticated product flow refresh has been implemented locally. The app includes the Next.js foundation, Supabase schema/client foundation, auth screens, password recovery screens, guided onboarding, child profile flow, prompt builder, story generation route/UI, Google TTS quota route/UI, manual recording route/UI, story history, private story download, reusable UI primitives, responsive app navigation, and automated tests.

Provider state:

- Supabase Auth, expected tables, RLS policies, and private `story-audio` bucket are live-verified.
- Gemini story generation uses `GEMINI_MODEL`, defaulting to `gemini-3.5-flash`, and live model availability is verified.
- Google Cloud Text-to-Speech API is enabled for Google Cloud project `dreamvoice-ai`.
- Google TTS supports local Application Default Credentials when `GOOGLE_APPLICATION_CREDENTIALS_JSON` is not set.
- Story generation defaults to short 120 to 180 word test stories with a 2500-character target for Google TTS single-request safety.
- Login uses full document navigation after auth so server-rendered protected pages receive Supabase session cookies reliably.
- Production signup sends Supabase email confirmations to `/auth/callback`, which exchanges the confirmation code for a session before redirecting to onboarding.

## Latest Conversation

Date: 2026-06-29

Summary:

- Implemented the approved application-flow refactor for Phase 1 while preserving existing business logic.
- Kept public story sharing KIV/out of scope for now; private story download is available from story detail pages.
- Added reusable UI primitives for buttons, fields, page headers, cards, empty states, and status feedback.
- Reworked the app shell with consistent desktop/sidebar and mobile navigation, including clearer active states.
- Added password recovery pages for forgot password and reset password.
- Added a guided onboarding page that combines parent profile completion and first child profile creation after signup.
- Refreshed dashboard, child profiles, story generation, story history, and story detail pages so each page has clearer next actions, empty states, and status feedback.
- Added loading skeletons for main authenticated routes.
- Added regression coverage for auth redirects, recovery forms, navigation active states, story download, and responsive public/auth browser flows.
- Direct `npx playwright test ...` hangs in this Windows shell after tests finish; the project script `npm run e2e` exits cleanly and should be used for browser checks.
- Added `docs/ENVIRONMENT_AND_SECRETS.md` and linked it from `AGENTS.md` so environment variable and secret-handling rules are durable.
- Hardened `.gitignore` so `.env*` files stay ignored while `.env.example` remains commit-safe.
- Added `docs/TASK_COMPLETION_PROTOCOL.md` and linked it from `AGENTS.md` so every completed task gets a consistent handoff.

Previous conversation:

Date: 2026-06-28

Summary:

- Completed a comprehensive read-only UX/UI/product/code audit of the Phase 1 MVP.
- User approved focusing the improvement pass on the authenticated product experience first.
- Chosen direction: Product Workflow Refresh, preserving existing Phase 1 functionality while improving navigation, page guidance, reusable UI, accessibility, and state feedback.
- Wrote the approved design spec to `docs/superpowers/specs/2026-06-28-authenticated-product-ux-refresh-design.md`.

Earlier provider setup summary:

- Fixed login post-auth navigation by switching from client router navigation to full document navigation, so protected server-rendered pages receive Supabase session cookies reliably.
- Ran live Supabase diagnostics: auth admin access, expected tables, and private `story-audio` bucket all responded successfully.
- Ran live Google TTS smoke: synthesized a short MP3 with `en-US-Wavenet-F` using local ADC.
- Ran RLS smoke with two temporary users and cleanup: user B could not read user A's children, stories, narrations, or TTS usage, and cross-owner story insert was rejected.
- Ran full live app smoke with temporary user and cleanup: login, child creation, Gemini story generation, story length under TTS limit, Google narration generation, narration metadata save, storage upload, storage cleanup, and user cleanup all passed.
- Added Google Cloud TTS ADC fallback when `GOOGLE_APPLICATION_CREDENTIALS_JSON` is absent or blank.
- Preserved support for explicit JSON credentials when `GOOGLE_APPLICATION_CREDENTIALS_JSON` is configured.
- Fixed browser-side Supabase env loading by replacing dynamic `NEXT_PUBLIC_...` lookup with static Next.js-compatible references.
- Replaced hardcoded `gemini-1.5-flash` with configurable `GEMINI_MODEL`, defaulting to `gemini-3.5-flash`.
- Enabled `texttospeech.googleapis.com` for Google Cloud project `dreamvoice-ai` and verified it is listed as enabled.
- Reduced default generated story length from the old 600-900 word MVP range to 120-180 words for testing, with `STORY_WORD_COUNT_MIN` and `STORY_WORD_COUNT_MAX` overrides.

## Completed

- Project documentation set created.
- Environment and secrets handling rules documented.
- Environment file ignore rules hardened.
- Task completion handoff protocol documented.
- Detailed implementation plan created.
- Next.js app foundation created.
- Supabase schema and RLS migration drafted and live-verified.
- Auth and child profile UI created.
- Production Supabase email-confirmation callback route created.
- Prompt builder and six theme presets created.
- Story generation route and UI created.
- Google TTS quota helper, route, and UI created.
- Google TTS ADC fallback added and live-verified.
- Manual recording route and UI created.
- Story library and debug page created.
- Authenticated product UX refresh implemented.
- One-step onboarding for parent profile and first child profile implemented.
- Forgot password and reset password UI implemented.
- Private story text download implemented.
- Unit and browser smoke tests created for core helpers and main flows.
- Public-entry Playwright smoke test created and verified.
- Responsive public/auth browser smoke test created and verified.
- Full live app smoke completed with temporary data cleanup.

## In Progress

- Vercel deployment environment verification.
- Supabase production Auth URL configuration verification.
- Production Google Cloud authentication strategy for Vercel.
- Git commit/branch finishing once workspace Git metadata is usable.

## Verification

Latest local verification completed on 2026-06-29:

- `npm test` - 15 files passed, 46 tests passed.
- `npm run lint` - passed with zero warnings.
- `npm run typecheck` - passed.
- `npm run build` - passed and includes `/forgot-password`, `/onboarding`, and `/reset-password` routes.
- `npm run e2e` - 3 Chromium browser tests passed, including public entry points, mobile recovery pages, and signed-out app-route redirect behavior.

Earlier live-provider verification completed on 2026-06-23:

- Supabase live diagnostics - auth admin, expected tables, and private `story-audio` bucket passed.
- Google TTS live smoke - short MP3 synthesis passed using `en-US-Wavenet-F`.
- Supabase RLS smoke - owned/non-owned isolation passed with two temporary users and cleanup.
- Full live app smoke - login, child creation, Gemini story, Google TTS narration, storage upload, and cleanup passed.
- Gemini ListModels live check - configured model `gemini-3.5-flash` is available for `generateContent`.
- Google Cloud services check - `texttospeech.googleapis.com` is enabled for `dreamvoice-ai`.

## Blocked

- Normal repository commits are blocked because local `git` is still unavailable in this Windows shell.
- Vercel Google Cloud TTS deployment still needs a production credential strategy if service account JSON keys are blocked by organization policy.
- Live Vercel diagnosis needs the production URL and Vercel/Supabase logs if production signup or provider behavior still differs after redeploy.

## Open Questions

- Which production Vercel URL should be set as the Supabase Auth Site URL?
- Which Git `user.name` and `user.email` should be used for local commits once Git is available?
- Which production Google Cloud authentication path should be used for Vercel if service account JSON keys remain blocked by policy?
- Should Supabase email confirmation be enabled for public testing after SMTP is configured?
- When should public story sharing move out of KIV and into scope?

## Next Action

- Review the refreshed flow locally, especially onboarding, dashboard guidance, story generation, story history, and story detail actions.
- Push the flow refresh to GitHub and redeploy Vercel after Git is available.
- In Supabase Auth URL Configuration, set Site URL to the production Vercel/custom domain and add allowed redirect URLs for `/auth/callback` plus local development.
- Verify Vercel production environment variables are set for Production, then redeploy.
- Decide production Google Cloud authentication strategy for Vercel.

## Key Decisions

- Use Supabase for auth, database, and storage.
- Use Gemini API free tier for story generation.
- Use Google Cloud TTS for Phase 1 generated narration.
- Enforce app-side TTS character usage limits.
- Keep voice cloning for Phase 2.
- Keep public story sharing KIV until explicitly approved.
- Deploy via Vercel from GitHub.
- Keep paid features out of Phase 1.
- Never commit secrets or invent fake environment values; handle missing configuration gracefully and document required variables by name, use, reason, and value description only.
- After every completed task, explain changes, rationale, affected files, risks, verification, and the next highest-priority task; avoid unrelated edits and keep changes/commits small.

## Useful Links

- Supabase Auth redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase password-based auth: https://supabase.com/docs/guides/auth/passwords
- Google Cloud TTS pricing: https://cloud.google.com/text-to-speech/pricing
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Vercel pricing: https://vercel.com/pricing
- GitHub pricing: https://github.com/pricing
- Supabase docs: https://supabase.com/docs