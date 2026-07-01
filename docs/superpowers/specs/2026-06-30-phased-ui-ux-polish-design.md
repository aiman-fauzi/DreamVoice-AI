# Phased UI/UX Polish Design

## Goal

Improve DreamVoice AI across the three visible product areas while preserving the Phase 1 MVP scope and existing business logic. The work should move from easiest to hardest so each pass is useful, small enough to review, and safe to verify before the next pass begins.

Approved order:

1. Public/auth entry flow.
2. Story detail, listening, and history.
3. Story creation flow.

## Design Direction

- Product goal and audience: Help parents quickly feel that DreamVoice is calm, trustworthy, and ready for bedtime story creation.
- Tone: warm, polished, calm, and capable.
- Layout strategy: focused page sections with clear next actions, compact product surfaces, and no marketing-style detours inside the app.
- Typography approach: stronger editorial hierarchy on public/auth pages, quieter operational hierarchy in authenticated pages, and generous line height for story reading.
- Color and surface strategy: retain the current ink, moss, moon, and skywash foundation, add richer contrast and clearer surface layering without turning the app into a one-hue theme.
- Motion strategy: subtle state transitions for hover, focus, selected, loading, and saved states only.
- Signature differentiator: a bedtime "story stage" treatment that frames generated stories and listening moments with a distinctive reading/listening surface.

## Scope

In scope:

- Visual and UX polish for landing, signup, login, forgot password, and reset password.
- Visual and UX polish for Story History and story detail/listening pages.
- Visual and UX polish for the story generation flow after the lower-risk phases are reviewed.
- Reuse and refinement of existing components such as `Button`, `PageHeader`, `SectionCard`, `Field`, `EmptyState`, `StatusMessage`, `AppNav`, `ThemePicker`, and narration controls.
- Mobile and desktop responsive improvements.
- Accessibility improvements for focus states, contrast, selected states, status messages, and readable story content.
- Focused tests where UI states or behavior contracts change.

Out of scope:

- Public story sharing.
- Parent voice cloning.
- Subscriptions, billing, analytics, mobile apps, admin dashboards, family plans, school plans, background music, or multi-voice narration.
- Provider changes to Gemini, Google TTS, Supabase, Vercel, or storage architecture.
- Database schema or RLS changes unless separately approved.

## Phase 1: Public/Auth Entry

This is the easiest pass because it is mostly presentation, page hierarchy, and form polish.

Target screens:

- Landing page.
- Signup page.
- Login page.
- Forgot password page.
- Reset password page.

Design changes:

- Make the first viewport more immediately recognizable as DreamVoice AI, not a generic SaaS page.
- Keep the public hero focused on the literal offer: personalized bedtime stories for a child.
- Add a warmer product preview that shows the three-step loop: profile, story, listen/read later.
- Improve form containers so auth pages feel calmer and less sparse on desktop while still simple on mobile.
- Use consistent CTA hierarchy across public and auth pages.
- Improve helper text and confirmation states without adding new auth behavior.

Success criteria:

- A new visitor can understand the product loop in one screen.
- Auth pages feel like part of the same product, not separate utility screens.
- Existing signup, login, forgot-password, and reset-password tests continue to pass.

## Phase 2: Story Detail, Listening, And History

This is medium difficulty because it touches more authenticated states, but most changes are still presentation and flow clarity.

Target screens and components:

- Story History page.
- Story detail page.
- Story cards and child filters.
- Saved audio section.
- Google narration button.
- Manual recorder.
- Audio player.
- Story download action.

Design changes:

- Introduce the "story stage" treatment on the story detail page, giving the story text a more intentional reading surface.
- Make generated narration, parent recording, saved audio, and download actions easier to understand as one private listening toolkit.
- Improve empty and filtered-empty history states so the next action is clear.
- Make story cards easier to scan by child, theme, language, saved date, and audio availability when already available from existing data.
- Keep private download language clear, and keep public sharing KIV.

Success criteria:

- A parent can open a saved story and immediately know how to read, listen, record, download, or create another story.
- History is easier to scan and filter on desktop and mobile.
- Existing story download, narration, and history behavior remains unchanged.

## Phase 3: Story Creation Flow

This is the hardest pass because it is the core conversion moment and has the most interaction states.

Target screens and components:

- New Story page.
- Story generator.
- Child selector.
- Theme picker.
- Generate action and loading/error states.

Design changes:

- Turn the current three-step form into a more confident guided composer.
- Improve child selection so the chosen profile feels concrete and trustworthy before generation.
- Improve theme cards with clearer selected, hover, focus, and disabled/loading states.
- Add better generation feedback that communicates progress without inventing provider details.
- Strengthen mobile layout so the primary action remains easy to find after selecting child and theme.

Success criteria:

- A parent can choose child and theme without ambiguity.
- The selected theme and selected child are visually obvious.
- Loading and error states feel expected and recoverable.
- Existing story generation behavior and prompt rules remain unchanged.

## Architecture

The implementation should stay inside the existing Next.js app structure:

- Public/auth routes remain under `app/page.tsx` and `app/(auth)`.
- Authenticated routes remain under `app/(app)`.
- Shared UI improvements should land in existing `components/ui` primitives when the pattern repeats.
- Screen-specific layout changes should stay close to the route or feature component that owns them.
- No new service, provider, database, or storage architecture should be introduced.

## Components

Likely component work:

- Refine `Button` variants and spacing only if needed for better hierarchy.
- Refine `SectionCard` or add a narrow variant only if repeated page surfaces need it.
- Refine `PageHeader` for stronger mobile action stacking and desktop rhythm.
- Refine auth forms through existing `Field`, `StatusMessage`, and `Button` behavior.
- Refine `StoryLibrary`, `StoryGenerator`, `ThemePicker`, and story detail composition in their existing component boundaries.
- Add a small story-reading surface component only if the story detail page starts duplicating layout logic.

Do not create a large design system layer unless the implementation clearly repeats the same structure across multiple screens.

## Data Flow

The UI polish should not change provider or database flow:

- Auth remains Supabase Auth.
- Story generation remains the existing server route using Gemini.
- Generated narration remains the existing server route using Google Cloud TTS.
- Manual recording remains the existing manual narration route.
- Story and narration data remain private and user-owned.
- TTS quota behavior remains unchanged and must still block generation when the configured quota is reached.

Any new UI badges or metadata should use data already loaded by the relevant page, unless a separate data change is explicitly approved.

## Error And State Handling

Maintain and improve visible states:

- Auth form errors and success messages.
- Signup email-confirmation state.
- Forgot-password and reset-password success/error states.
- Empty Story History and filtered-empty Story History.
- Story detail with and without saved audio.
- Narration loading, success, and error states.
- Story generation loading and error states.
- No-child state before story generation.

Use `role="alert"` for errors and `role="status"` for neutral/success async feedback where applicable.

## Accessibility

Requirements:

- Preserve semantic headings and labels.
- Keep active navigation with `aria-current`.
- Ensure selected theme cards are keyboard-accessible and visually obvious.
- Ensure color contrast is WCAG AA for normal text.
- Keep focus states visible on buttons, links, form controls, filters, cards, and theme options.
- Avoid horizontal overflow on mobile.
- Keep story reading line length and line height comfortable.

## Testing And Verification

For each implementation phase:

- Run relevant unit/component tests for changed behavior.
- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run build` before final handoff for each phase if route-level UI changes are made.
- Use `npm run e2e` for browser verification rather than direct `npx playwright test`, because direct Playwright commands have previously hung in this Windows shell after tests finish.
- Manually inspect changed screens in desktop and mobile browser viewports.

Phase-specific checks:

- Phase 1: public landing, signup, login, forgot password, reset password.
- Phase 2: Story History empty/non-empty/filter states, story detail with and without audio, download action, narration action surfaces.
- Phase 3: no-child state, child selection, theme selection, generation loading, generation error, generated-story navigation.

## Risks

- Visual polish could accidentally imply Phase 2 features if copy mentions sharing, cloning, subscriptions, or public publishing.
- Story detail polish could overcomplicate the bedtime reading moment if too many actions compete visually.
- Story creation polish could hide the generate action on mobile if the composer becomes too tall.
- New UI metadata could cause unnecessary database query changes if not kept to existing loaded data.

## Implementation Sequence

1. Write an implementation plan for Phase 1 public/auth entry.
2. Implement and verify Phase 1.
3. Review Phase 1 in browser before moving on.
4. Write or update the plan for Phase 2 story detail/listening/history.
5. Implement and verify Phase 2.
6. Review Phase 2 in browser before moving on.
7. Write or update the plan for Phase 3 story creation flow.
8. Implement and verify Phase 3.

Each phase should update `docs/PROGRESS.md` after meaningful work.
