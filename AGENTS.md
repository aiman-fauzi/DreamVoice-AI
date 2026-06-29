# Codex Project Instructions

This file gives Codex durable project context. Keep it short. Detailed requirements live in `docs/`.

## Context Loading Order

For a new conversation or task:

1. Read this file.
2. Read `docs/PROGRESS.md`.
3. Read only the detailed docs needed for the task:
   - Product questions: `docs/PROJECT_BRIEF.md`
   - Architecture questions: `docs/ARCHITECTURE.md`
   - Supabase/schema questions: `docs/DATA_MODEL.md`
   - Cost/free-tier questions: `docs/FREE_TIER_LIMITS.md`
   - Build sequencing: `docs/IMPLEMENTATION_PLAN.md`
   - Environment/secrets questions: `docs/ENVIRONMENT_AND_SECRETS.md`
   - Task handoff/completion protocol: `docs/TASK_COMPLETION_PROTOCOL.md`

Do not load every doc by default unless the task needs it.

## Product Rules

- Build only MVP Phase 1 unless the user explicitly expands scope.
- Do not implement parent voice cloning in Phase 1.
- Use Google Cloud Text-to-Speech Standard or WaveNet voices for generated narration.
- Include optional manual parent recording as the free alternative to voice cloning.
- Keep paid features such as subscriptions, mobile apps, and analytics out of Phase 1.

## Technical Rules

- Use Next.js for the web app.
- Use Supabase Auth, Supabase Postgres, and Supabase Storage.
- Use Gemini API free tier for story generation.
- Use Google Cloud Text-to-Speech through server-side routes only.
- Store secrets only in environment variables.
- Follow `docs/ENVIRONMENT_AND_SECRETS.md` for all environment variable and credential handling.
- Deploy through Vercel from GitHub.
- Use Row Level Security on user-owned tables.

## Cost Rules

- Treat free-tier limits as product requirements.
- Track Google TTS character usage before each TTS request.
- Block TTS generation when the configured monthly app quota is reached.
- Do not add services that require paid plans unless the user approves.

## Documentation Rules

- Update `docs/PROGRESS.md` after each meaningful conversation or completed work session.
- When decisions change, update the relevant source doc instead of relying on chat history.
- Keep docs concise to avoid context bloat.

## Completion Rules

- Follow `docs/TASK_COMPLETION_PROTOCOL.md` after every completed task.
- Never modify unrelated code.
- Keep changes and commits small and logically grouped.

## Verification Rules

- For code changes, run the relevant tests before claiming the work is complete.
- For UI changes, verify locally in the browser before final handoff.
- For database changes, verify RLS behavior for owned and non-owned records.
