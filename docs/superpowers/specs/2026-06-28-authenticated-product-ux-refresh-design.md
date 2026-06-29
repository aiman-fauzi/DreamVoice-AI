# Authenticated Product UX Refresh Design

## Goal

Improve the Phase 1 authenticated product experience without adding Phase 2 scope. The app should guide parents through one natural bedtime-story workflow: register or log in, finish setup, generate a story, and return later to read or listen from history.

## Approved Flow Direction

The user's requested journeys are accepted with one Phase 1 adjustment: `Share Story` is KIV and will not be implemented in this round. Public story sharing remains out of scope because the project brief lists public story sharing as a Phase 1 non-goal.

The first-time flow should merge child setup and parent profile completion into one onboarding screen to reduce friction:

Landing page -> Register -> Email verification message if enabled -> Onboarding -> Welcome dashboard -> Generate first story -> Story history -> Download where available

The returning flow should keep users close to the core action:

Landing page -> Login -> Dashboard -> Choose child -> Generate story -> Story detail/history -> Download where available

The returning-history flow should be direct:

Landing page -> Login -> Dashboard -> Story history -> Story detail -> Download where available

The forgot-password flow should be discoverable from login:

Landing page -> Login -> Forgot password -> Enter email -> Reset email sent -> Reset password -> Login

## Scope

In scope:

- Authenticated app shell and navigation.
- First-time onboarding route that collects parent display name and first child profile together.
- Dashboard, children, new story, story detail, and library/history page hierarchy.
- Forgot-password and reset-password screens using Supabase Auth client APIs.
- Public auth and home pages only where they need links or visual consistency for the journeys.
- Reusable UI primitives for page headers, cards, fields, empty states, status messages, and loading states.
- Accessibility improvements for focus, active navigation, status messages, contrast, and responsive behavior.
- Narration UI refresh after successful Google/manual narration actions so users can see saved audio without a manual page reload.
- Download actions for story text and existing audio playback/download where practical without changing storage privacy.

Out of scope:

- Public story sharing links or public story pages.
- Parent voice cloning.
- Billing, subscriptions, analytics, mobile apps, admin dashboards, or public sharing.
- Provider changes to Gemini, Google TTS, Supabase, Vercel, or storage architecture.
- Database schema and RLS changes, except if separately approved as security/business-logic work.

## Design Principles

- Every page answers "what should the user do next?"
- Each page has one primary CTA and, where useful, one secondary CTA.
- Reduce unnecessary pages and clicks by merging parent setup and child setup.
- Reuse components rather than duplicating card, button, field, alert, and empty-state styles.
- Keep the interface quiet, modern, and work-focused, with premium details that improve clarity rather than decorative complexity.
- Preserve Phase 1 MVP behavior and free-first positioning.
- Meet WCAG expectations for text contrast, focus visibility, semantic structure, and announced async feedback.

## App Shell And Navigation

The authenticated app becomes a consistent product workspace:

- Desktop uses a persistent sidebar with `Dashboard`, `New Story`, `Story History`, and `Children`.
- Mobile uses a compact top navigation so the sidebar does not dominate small screens.
- Active routes use clear visual treatment and `aria-current="page"`.
- Debug remains URL-accessible for prototype use but is not promoted in primary navigation.
- Protected pages share a consistent footer with concise prototype/free-tier context.

Why this improves usability: the core creation action and history are available from every protected page, users know where they are, and navigation stops competing with page content on mobile.

## Page-Level Journey

### Landing Page

The landing page should keep a simple public path:

- Primary CTA: `Create first story` -> signup.
- Secondary CTA: `Log in`.
- Explain the three-step product loop: create profile, generate story, listen or read later.
- Avoid internal language such as `Phase 1 MVP` in primary hero content.

### Register And Email Verification

Signup should send email confirmation users to onboarding after verification when Supabase email confirmation is enabled.

- Signup redirect target: `/auth/callback?next=/onboarding`.
- If a signup returns a session immediately, redirect to `/onboarding`.
- If email confirmation is required, show a clear confirmation message and next step.

### Onboarding

Onboarding is one guided protected screen:

- Parent profile field: display name.
- Child profile fields: child name, age, preferred language, interests, bedtime tone.
- Primary CTA: `Finish setup`.
- On success: redirect to `/dashboard`.
- If the parent already has a child, the page should point them back to dashboard rather than forcing duplicate setup.

### Dashboard

The dashboard becomes a "Tonight's workflow" hub.

- Primary CTA: `Generate story` when setup exists, otherwise `Finish setup`.
- Secondary CTA: `Story History` when stories exist, otherwise `Add child`.
- Show compact counts for children and saved stories.
- Show a guided first-time flow when there are no children or no stories.
- Show recent stories when available.

### Children

The children page keeps the existing child creation behavior but makes its purpose clearer.

- Primary CTA/form action: `Save child`.
- Empty state explains that child profiles personalize story prompts.
- Existing child cards communicate `Ready for stories` and link users toward story creation.

### New Story

The story composer becomes a simple guided flow.

- Step 1: choose child.
- Step 2: choose theme.
- Step 3: generate story.
- Selected theme cards are visibly selected, keyboard focusable, and accessible.
- Empty state sends users to onboarding or child creation before generating.
- Loading and error states are visible and announced.

### Story Detail

The story page focuses on reading, narration, and download.

- If no audio exists, the primary action is generated narration and the secondary action is parent recording.
- If audio exists, saved audio is visible immediately and the next action becomes reading/listening or creating another story.
- Include a private download action for story text.
- Generated and manual narration actions use consistent status messages.
- After narration success, the saved-audio section refreshes so the user can play the result without a manual reload.

### Story History

The existing library route becomes user-facing Story History.

- Primary CTA: `Generate story`.
- Child filters remain but look like accessible filter chips.
- Empty and filtered-empty states explain the state and point to the next action.
- Story cards keep clear title, theme, language, child context when available, and saved date.

### Forgot Password

Forgot password is reachable from login.

- `/forgot-password` collects email and sends Supabase reset email.
- `/reset-password` lets users set a new password after they arrive with a reset session.
- Success and error states are explicit and accessible.

## Components

Create a small practical design layer:

- `PageHeader`: shared title, description, primary CTA, and secondary CTA.
- `SectionCard`: consistent section container for page content.
- `EmptyState`: icon, title, description, primary action, optional secondary action.
- `StatusMessage`: accessible success, error, info, and warning messages with semantic roles.
- `Field`: consistent label, helper text, control, and error styling.
- `LoadingState` or route-level skeletons for dynamic protected pages.
- Improved `Button`: consistent variants, sizes, focus rings, disabled/loading support where needed.
- `AppNav`: shared navigation items with active state.

## Visual System

Use a restrained premium SaaS style:

- Background: warm off-white or neutral surface with white content panels.
- Text: strong ink color for headings, high-contrast slate for body copy.
- Accent colors: replace low-contrast coral usage for normal text with accessible accent shades.
- Buttons: clear primary, secondary, ghost hierarchy with consistent height and focus rings.
- Cards: subtle borders and shadows, 8px radius, consistent padding.
- Typography: improve hierarchy with consistent page titles, section titles, body, helper, and metadata styles.
- Motion: subtle transitions only for hover, focus, and selected states.

## State Handling

Required state patterns:

- Loading state for protected dynamic pages and client actions.
- Empty state for dashboard first run, onboarding already complete, children list, new story without children, history empty, and history filtered empty.
- Success state after auth signup confirmation, reset email send, password reset, onboarding completion, child creation where feasible, story generation navigation, and narration save.
- Error state for auth errors, child form errors, onboarding errors, story generation errors, narration errors, and microphone permission failures.

Status messages should use `role="status"` for neutral/success async feedback and `role="alert"` for errors.

## Accessibility Requirements

- Active navigation includes `aria-current="page"`.
- Interactive theme cards have visible focus and selected states.
- Color contrast meets WCAG AA for normal text.
- Status messages are announced to assistive technology.
- Inputs use labels and optional helper text.
- Buttons have readable text and stable dimensions on mobile and desktop.
- Layouts avoid horizontal overflow at mobile widths.

## Testing And Verification

Automated verification:

- Existing unit tests continue to pass.
- Add focused tests for signup redirect, forgot-password/reset behavior, reusable status messages, active navigation, and story text download behavior.
- Existing public e2e test continues to pass.

Manual/browser verification:

- Inspect landing, signup, login, forgot password, reset password, onboarding, dashboard, children, new story, story detail, and story history.
- Check mobile and desktop viewports.
- Verify focus states, selected theme states, loading states, empty states, and narration success refresh.

## Non-Goals And Constraints

- Do not introduce new services or paid dependencies.
- Do not add public story sharing in this round.
- Do not change the Gemini prompt rules, Google TTS provider behavior, Supabase schema, or storage model as part of this UX refresh.
- Do not add new Phase 2 product capabilities.
- Keep the implementation small enough to remain maintainable in the current codebase.
