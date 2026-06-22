# Free-Tier Limits

## Purpose

This MVP should stay free-first. Free-tier limits are product constraints, not afterthoughts.

Before public testing, verify every quota in the provider dashboard because free tiers can change.

## Services

### GitHub Free

Use for source control.

Current useful limits:

- Unlimited public/private repositories.
- 2,000 GitHub Actions minutes per month for private repositories.
- GitHub Actions minutes are free for public repositories.

Source: https://github.com/pricing

### Vercel Hobby

Use for hosting and deployment.

Current useful limits:

- Free forever for personal projects.
- GitHub import and automatic CI/CD.
- Free monthly quotas for traffic, requests, functions, and storage.

Source: https://vercel.com/pricing

Important:

- Hobby is intended for personal, non-commercial projects.
- If the app becomes commercial, revisit the plan.

### Supabase Free

Use for Auth, Postgres, and Storage.

Current assumption:

- Free plan is enough for a small prototype with limited users, child profiles, stories, and audio.

Important:

- Confirm exact database, storage, bandwidth, and monthly active user limits in the Supabase dashboard before public testing.
- Keep generated audio small.
- Delete test audio regularly during development.

Source: https://supabase.com/pricing

### Gemini API Free Tier

Use for story text generation.

Current useful behavior:

- Free developer tier is available for supported models.
- Free input and output tokens are available with limited access to certain models.

Important:

- Free-tier content may be used by Google to improve products.
- Do not send unnecessary sensitive data.
- Use child first name, age, interests, language, and tone only.

Source: https://ai.google.dev/gemini-api/docs/pricing

### Google Cloud Text-to-Speech

Use for generated narration.

Current useful limits:

- Standard voices and WaveNet voices have monthly free character allowances.
- Higher-quality or custom voice options may have lower or no free allowance.

Important:

- Billing must be enabled to use Google Cloud TTS.
- Charges apply after the monthly free character allowance.
- Do not use Instant Custom Voice in Phase 1.
- Enforce an app-side monthly character cap before calling Google TTS.

Source: https://cloud.google.com/text-to-speech/pricing

## App-Side Cost Controls

Implement these controls:

1. `APP_TTS_MONTHLY_CHARACTER_LIMIT` environment variable.
2. Monthly usage table in Supabase.
3. Server-side quota check before every Google TTS request.
4. Block narration generation when quota is reached.
5. Show clear UI message when TTS is unavailable.
6. Allow manual parent recording even when TTS quota is exhausted.

## Prototype Usage Policy

Suggested initial limits:

- Max 3 children per parent.
- Max 20 generated stories per parent per month.
- Max 5 Google TTS narrations per parent per month.
- Max story length around 600 to 900 words.
- Max manual recording size around 25 MB.

These limits can be adjusted after testing.

