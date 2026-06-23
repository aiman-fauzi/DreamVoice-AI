# DreamVoice AI

DreamVoice AI is a Phase 1 MVP for generating personalized bedtime stories for parents and children.

The prototype focuses on a free-first workflow:

- Parents sign up and create child profiles.
- Parents choose a story theme from preset buttons.
- The app automatically builds a story prompt from the child profile and selected theme.
- Gemini generates the story text server-side.
- Google Cloud Text-to-Speech generates narration only when usage remains inside the configured app quota.
- Parents can optionally record their own narration and save it with the story.

## MVP Scope

Included in Phase 1:

- Supabase Auth for parent accounts.
- Supabase Postgres for parent profiles, child profiles, stories, narration metadata, and usage tracking.
- Supabase Storage for narration audio.
- Gemini API free tier for story generation.
- Google Cloud Text-to-Speech Standard or WaveNet voices for narration.
- Email/password authentication first.
- English and Bahasa Malaysia story generation.
- Vercel deployment from GitHub.

Not included in Phase 1:

- Parent voice cloning.
- Subscription billing.
- Mobile apps.
- Background music.
- Multi-voice family mode.
- Advanced analytics.
- Enterprise or school dashboards.

## Local Development

1. Install dependencies:

```powershell
npm install
```

2. Copy environment settings:

```powershell
Copy-Item .env.example .env.local
```

3. Fill in Supabase, Gemini, and Google Cloud TTS values in `.env.local`.

For local Google Cloud TTS with Application Default Credentials, sign in once and set the project:

```powershell
gcloud auth application-default login
gcloud config set project YOUR_GOOGLE_PROJECT_ID
```

Then set `GOOGLE_CLOUD_PROJECT_ID` in `.env.local` and leave `GOOGLE_APPLICATION_CREDENTIALS_JSON` blank. For hosted deployments such as Vercel, configure a production-safe Google Cloud credential path because your local ADC login is not available there.

4. Start the app:

```powershell
npm run dev
```

5. Open `http://localhost:3000`.

## Verification

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm run e2e
```

Provider-backed flows require real Supabase, Gemini, and Google Cloud credentials. RLS behavior should be verified against a Supabase development project with two test users before public testing.

## Key Docs

- `AGENTS.md` - Codex working rules and context loading order.
- `docs/PROJECT_BRIEF.md` - product scope and user journey.
- `docs/ARCHITECTURE.md` - system design and service boundaries.
- `docs/DATA_MODEL.md` - Supabase tables, storage, and RLS design.
- `docs/FREE_TIER_LIMITS.md` - free-tier assumptions and app-side cost controls.
- `docs/IMPLEMENTATION_PLAN.md` - build order for the MVP.
- `docs/PROGRESS.md` - current status, decisions, blockers, and next steps.
