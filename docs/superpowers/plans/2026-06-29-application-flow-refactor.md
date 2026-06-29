# Application Flow Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor DreamVoice AI's Phase 1 application flow so first-time and returning users are guided naturally from auth to onboarding, dashboard, story generation, and story history, while keeping public story sharing out of scope.

**Architecture:** Keep the existing Next.js App Router, Supabase Auth, Supabase Postgres, and current story/narration routes. Add small UI primitives and client/server components around the existing business logic. Add one protected onboarding route and two public password-recovery routes.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Supabase SSR/browser clients, Vitest, Playwright.

---

## File Structure

- Modify `app/globals.css` for design tokens, focus defaults, and typography polish.
- Modify `tailwind.config.ts` for accessible color tokens and shadows.
- Modify `components/ui/button.tsx` for stronger variants and consistent sizing.
- Create `components/ui/page-header.tsx`, `components/ui/section-card.tsx`, `components/ui/empty-state.tsx`, `components/ui/status-message.tsx`, and `components/ui/field.tsx`.
- Create `components/app/app-nav.tsx` for active authenticated navigation.
- Modify `app/(app)/layout.tsx` to use `AppNav`, compact mobile navigation, and footer.
- Modify `components/auth/auth-form.tsx` and auth pages so signup routes to onboarding and login links to forgot password.
- Create `app/(auth)/forgot-password/page.tsx`, `components/auth/forgot-password-form.tsx`, `app/(auth)/reset-password/page.tsx`, and `components/auth/reset-password-form.tsx`.
- Create `app/(app)/onboarding/page.tsx`, `app/(app)/onboarding/actions.ts`, and `components/onboarding/onboarding-form.tsx`.
- Modify `app/(app)/dashboard/page.tsx`, `app/(app)/children/page.tsx`, `components/children/child-form.tsx`, `components/children/children-list.tsx`, `app/(app)/stories/new/page.tsx`, `components/stories/story-generator.tsx`, `components/stories/theme-picker.tsx`, `app/(app)/library/page.tsx`, `components/stories/story-library.tsx`, `app/(app)/stories/[id]/page.tsx`, `components/narrations/google-narration-button.tsx`, `components/narrations/manual-recorder.tsx`, and `components/narrations/audio-player.tsx` for guided states.
- Create route loading files under protected routes where the app waits on dynamic data.
- Add tests in `tests/auth-form.test.tsx`, `tests/app-nav.test.tsx`, `tests/status-message.test.tsx`, and `tests/story-actions.test.tsx`.
- Update `docs/PROGRESS.md` after implementation.

## Task 1: Tests For Auth Flow And UI Primitives

**Files:**
- Modify: `tests/auth-form.test.tsx`
- Create: `tests/status-message.test.tsx`
- Create: `tests/app-nav.test.tsx`

- [ ] Write failing tests asserting signup confirmation redirects to `/auth/callback?next=/onboarding`.
- [ ] Write failing tests asserting `StatusMessage` uses `role="status"` for success/info and `role="alert"` for error.
- [ ] Write failing tests asserting `AppNav` marks the current route with `aria-current="page"`.
- [ ] Run `npm test tests/auth-form.test.tsx tests/status-message.test.tsx tests/app-nav.test.tsx` and verify the new tests fail because the components/behavior do not exist yet.

## Task 2: Shared UI Primitives And App Navigation

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `components/ui/button.tsx`
- Create: `components/ui/page-header.tsx`
- Create: `components/ui/section-card.tsx`
- Create: `components/ui/empty-state.tsx`
- Create: `components/ui/status-message.tsx`
- Create: `components/ui/field.tsx`
- Create: `components/app/app-nav.tsx`
- Modify: `app/(app)/layout.tsx`

- [ ] Add accessible design tokens and global focus/body defaults.
- [ ] Implement UI primitives with consistent spacing, typography, and roles.
- [ ] Implement `AppNav` with `Dashboard`, `New Story`, `Story History`, and `Children`.
- [ ] Update the protected layout to use desktop sidebar, compact mobile nav, and footer.
- [ ] Run the focused tests from Task 1 and verify they pass.

## Task 3: Signup Destination And Forgot Password Flow

**Files:**
- Modify: `components/auth/auth-form.tsx`
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/signup/page.tsx`
- Create: `app/(auth)/forgot-password/page.tsx`
- Create: `components/auth/forgot-password-form.tsx`
- Create: `app/(auth)/reset-password/page.tsx`
- Create: `components/auth/reset-password-form.tsx`

- [ ] Update signup to send confirmation and immediate-session users to `/onboarding`.
- [ ] Add forgot-password link to login.
- [ ] Add forgot-password email form using `supabase.auth.resetPasswordForEmail` with redirect to `/reset-password`.
- [ ] Add reset-password form using `supabase.auth.updateUser({ password })` and a clear return-to-login action.
- [ ] Run `npm test tests/auth-form.test.tsx` and verify it passes.

## Task 4: Merged Onboarding

**Files:**
- Create: `app/(app)/onboarding/page.tsx`
- Create: `app/(app)/onboarding/actions.ts`
- Create: `components/onboarding/onboarding-form.tsx`
- Reuse: `lib/limits.ts`

- [ ] Add protected onboarding page that checks the current user's profile and children.
- [ ] Add server action to upsert `profiles.display_name` and insert the first child profile.
- [ ] Redirect to `/dashboard` after successful setup.
- [ ] If setup is already complete, show a clear empty/success state linking to dashboard and new story.
- [ ] Keep child validation consistent with the existing child action.

## Task 5: Guided Dashboard, Children, And Story Composer

**Files:**
- Modify: `app/(app)/dashboard/page.tsx`
- Modify: `app/(app)/children/page.tsx`
- Modify: `components/children/child-form.tsx`
- Modify: `components/children/children-list.tsx`
- Modify: `app/(app)/stories/new/page.tsx`
- Modify: `components/stories/story-generator.tsx`
- Modify: `components/stories/theme-picker.tsx`

- [ ] Redesign dashboard around `Finish setup` or `Generate story` as the single primary CTA.
- [ ] Show recent stories and story/child counts without adding new database tables.
- [ ] Improve children empty state and child cards with direct story-generation guidance.
- [ ] Improve story composer as a three-step guided flow.
- [ ] Improve selected/focused theme cards and announced generation errors.

## Task 6: Story History, Story Detail, Download, And Narration Refresh

**Files:**
- Modify: `app/(app)/library/page.tsx`
- Modify: `components/stories/story-library.tsx`
- Modify: `app/(app)/stories/[id]/page.tsx`
- Modify: `components/narrations/google-narration-button.tsx`
- Modify: `components/narrations/manual-recorder.tsx`
- Modify: `components/narrations/audio-player.tsx`
- Create: `components/stories/story-download-button.tsx`
- Create: `tests/story-actions.test.tsx`

- [ ] Rename user-facing library language to `Story History` while keeping `/library` route for compatibility.
- [ ] Add empty and filtered-empty states with a `Generate story` CTA.
- [ ] Add private story text download button that creates a `.txt` file in the browser.
- [ ] Refresh the story detail route after successful Google/manual narration so saved audio appears immediately.
- [ ] Improve audio labels and keep playback through the existing private signed URL route.
- [ ] Write and run focused tests for story text download filename/content behavior.

## Task 7: Loading States And Verification

**Files:**
- Create: `app/(app)/dashboard/loading.tsx`
- Create: `app/(app)/children/loading.tsx`
- Create: `app/(app)/stories/new/loading.tsx`
- Create: `app/(app)/library/loading.tsx`
- Modify: `docs/PROGRESS.md`

- [ ] Add route-level loading states for protected dynamic pages.
- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `npm run e2e`.
- [ ] Start the local app and inspect landing, login, forgot password, reset password, onboarding, dashboard, new story, children, history, and story detail on desktop and mobile.
- [ ] Update `docs/PROGRESS.md` with completed work and verification results.

## Notes

- `git` is unavailable in this Windows shell according to current project progress, so commit steps are skipped until Git is available.
- Public story sharing remains KIV and is intentionally not included.
