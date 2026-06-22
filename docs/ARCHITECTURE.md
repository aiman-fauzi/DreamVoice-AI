# Architecture

## System Summary

DreamVoice AI is a Next.js app deployed on Vercel. Supabase handles authentication, database, and file storage. Gemini generates story text. Google Cloud Text-to-Speech generates narration using free-tier-compatible voices.

## Deployment Flow

1. Build in Codex locally.
2. Commit changes to Git.
3. Push to GitHub.
4. Vercel deploys from the GitHub repository.
5. Vercel stores runtime environment variables.

## Services

### Next.js

Responsibilities:

- App UI.
- Server-side API routes.
- Auth-aware pages.
- Story generation workflow.
- TTS generation workflow.
- Manual recording upload workflow.

### Supabase Auth

Responsibilities:

- Parent sign up.
- Parent login.
- Session management.
- User identity for Row Level Security.

### Supabase Postgres

Responsibilities:

- Parent profiles.
- Child profiles.
- Story records.
- Narration records.
- Monthly TTS usage counters.

### Supabase Storage

Responsibilities:

- Store generated TTS audio.
- Store manual parent recordings.
- Keep audio private by default.

### Gemini API

Responsibilities:

- Generate bedtime story text from a structured prompt.
- Return story content only, not audio.

Free-tier note: free Gemini API usage may be used by Google to improve products. Do not send sensitive personal data beyond what the MVP needs.

### Google Cloud Text-to-Speech

Responsibilities:

- Convert generated story text into audio.
- Use Standard or WaveNet voices only for Phase 1.

Free-tier note: Google Cloud TTS requires billing to be enabled, even when using monthly free character allowances. The app must enforce a monthly character cap.

## Request Flow

### Story Generation

1. Parent selects a child profile.
2. Parent clicks a theme button.
3. Server builds a structured prompt.
4. Server sends prompt to Gemini.
5. Server saves story text and prompt metadata to Supabase.
6. UI shows the generated story.

### TTS Generation

1. Parent clicks "Generate narration".
2. Server checks monthly TTS usage.
3. If quota allows, server sends story text to Google TTS.
4. Server uploads returned audio to Supabase Storage.
5. Server saves narration metadata.
6. UI shows the audio player.

### Manual Recording

1. Parent clicks "Record narration".
2. Browser records audio with parent permission.
3. App uploads audio to Supabase Storage.
4. App saves narration metadata as `manual_recording`.
5. UI shows the audio player.

## Environment Variables

Expected Vercel/local variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- `APP_TTS_MONTHLY_CHARACTER_LIMIT`

## Security Principles

- Never expose service role keys to the browser.
- Run Gemini and Google TTS calls only on the server.
- Keep audio files private.
- Use signed URLs for playback when needed.
- Use RLS for all user-owned records.

