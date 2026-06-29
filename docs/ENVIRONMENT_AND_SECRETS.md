# Environment And Secrets Rules

This repository is connected to GitHub. Actual `.env` files are intentionally excluded from the repository for security.

## Rules

- Never replace, overwrite, or invent fake environment variables.
- Never commit secrets.
- Never expose API keys.
- Never hardcode credentials.
- Never add real `.env` files to the repository.
- Assume environment variables will be configured later in Vercel, Supabase, and local `.env.local`.
- Do not block development only because environment variables are unavailable.
- Use placeholders, validation, and graceful fallbacks where appropriate.
- If a feature depends on credentials that are missing, handle the missing configuration gracefully instead of crashing the application.

## Missing Variable Reporting

When an environment variable is required but missing, clearly identify:

- Variable name.
- Where it is used.
- Why it is required.
- What value should be provided, described only by purpose or source.

Do not provide example secret values.

## Expected Configuration Locations

- Vercel project environment variables for deployed app runtime.
- Supabase project settings for Auth URLs, redirects, storage, and database configuration.
- Local `.env.local` for developer machines.

## Implementation Guidance

- Server-only credentials must stay server-side.
- Browser-exposed variables must be limited to public client configuration such as Supabase public URL and anon key.
- Prefer startup or request-time validation with helpful error messages over silent failure.
- For optional provider-backed features, show a user-safe unavailable state when configuration is missing.
- Keep `.env.example` descriptive and secret-free.