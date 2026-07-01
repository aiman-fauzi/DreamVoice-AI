# Phase 3 Story Creation And Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the story creation flow, then add parent-owned edit/delete controls for child profiles and saved stories.

**Architecture:** Keep the existing Next.js App Router structure. Use server actions for child/story mutations, keep Gemini/TTS routes unchanged, and add small reusable helper modules for validation and storage-cleanup decisions. Story deletion removes linked private audio objects before deleting the story row; database cascades still handle narration metadata.

**Tech Stack:** Next.js 16.2.9, React, Supabase Auth/Postgres/Storage, Vitest, Testing Library, Playwright.

---

## Design Direction

- Audience: parents creating and managing bedtime story material quickly.
- Tone: calm, trustworthy, practical.
- Layout: guided composer for creation; compact management controls inside existing child cards and story detail page.
- Typography: clear step headings, compact helper text, generous story editor textarea line-height.
- Color/surface: keep ink, moss, skywash, white cards, and restrained borders.
- Motion: hover/focus/selected/loading state changes only.
- Signature differentiator: the story composer should feel like preparing tonight's story stage before generation.

## Files

- Modify: `components/stories/story-generator.tsx` for Phase 3 composer layout, progress, and selected-child/theme clarity.
- Modify: `components/stories/theme-picker.tsx` for stronger selected/focus states and optional disabled state.
- Create: `lib/child-profile.ts` for child form parsing/validation shared by create/update actions.
- Modify: `app/(app)/children/actions.ts` to reuse validation and add update/delete actions.
- Modify: `components/children/child-form.tsx` to support add/edit mode.
- Modify: `components/children/children-list.tsx` to render edit/delete controls.
- Modify: `app/(app)/children/page.tsx` to pass actions and keep add-profile behavior.
- Create: `lib/story-management.ts` for story edit validation and storage path cleanup helpers.
- Create: `app/(app)/stories/[id]/actions.ts` for update/delete story actions.
- Create: `components/stories/story-editor.tsx` for story edit/delete UI.
- Modify: `app/(app)/stories/[id]/page.tsx` to include edit/delete management surface.
- Add tests: `tests/story-generator.test.tsx`, `tests/theme-picker.test.tsx`, `tests/child-profile.test.ts`, `tests/children-list.test.tsx`, `tests/story-management.test.ts`, `tests/story-editor.test.tsx`.
- Update docs: `docs/PROGRESS.md` after implementation.

## Task 1: Phase 3 Story Composer Tests

- [ ] Write failing tests in `tests/story-generator.test.tsx` proving the composer shows no-child setup, selected child context, theme guidance, and a stable generate action.
- [ ] Write failing tests in `tests/theme-picker.test.tsx` proving selected theme cards expose a visible selected state and radios remain accessible.
- [ ] Run `npm test -- tests/story-generator.test.tsx tests/theme-picker.test.tsx` and verify the tests fail because the new UI contracts are missing.

## Task 2: Phase 3 Story Composer Implementation

- [ ] Update `ThemePicker` with selected-state labels, stronger focus/hover classes, and a disabled/loading prop while preserving the `theme_key` radio API.
- [ ] Update `StoryGenerator` into a clearer guided composer with selected child preview, theme step, loading status message, and mobile-friendly generate action.
- [ ] Run `npm test -- tests/story-generator.test.tsx tests/theme-picker.test.tsx` and verify the tests pass.

## Task 3: Child Management Tests

- [ ] Write failing tests in `tests/child-profile.test.ts` for parsing valid child payloads, rejecting invalid ages/names, and preserving supported language values.
- [ ] Write failing tests in `tests/children-list.test.tsx` for rendering edit and delete controls for each child.
- [ ] Run `npm test -- tests/child-profile.test.ts tests/children-list.test.tsx` and verify the tests fail for missing helpers/UI.

## Task 4: Child Management Implementation

- [ ] Create `lib/child-profile.ts` with `parseChildProfileForm`, `parseChildInterests`, and `parseSupportedLanguage`.
- [ ] Update `createChildAction` to use the helper and add `updateChildAction` and `deleteChildAction` with authenticated `parent_id` filters.
- [ ] Update `ChildForm` to support initial values, hidden `child_id`, and custom submit labels.
- [ ] Update `ChildrenList` to render edit forms and delete forms inside each child card.
- [ ] Update `ChildrenPage` to pass the new actions.
- [ ] Run `npm test -- tests/child-profile.test.ts tests/children-list.test.tsx` and verify the tests pass.

## Task 5: Story Management Tests

- [ ] Write failing tests in `tests/story-management.test.ts` for story edit parsing and filtering private audio storage paths.
- [ ] Write failing tests in `tests/story-editor.test.tsx` for rendering title/story text editing and delete story control.
- [ ] Run `npm test -- tests/story-management.test.ts tests/story-editor.test.tsx` and verify the tests fail for missing helpers/UI.

## Task 6: Story Management Implementation

- [ ] Create `lib/story-management.ts` with `parseStoryEditForm` and `getOwnedStoryAudioPaths`.
- [ ] Create story detail server actions for update/delete with authenticated `parent_id` filters, storage cleanup, route revalidation, and redirect to `/library` after deletion.
- [ ] Create `StoryEditor` and add it to the story detail page under a private management section.
- [ ] Ensure story editing preserves existing narration, download, and reading-stage behavior.
- [ ] Run `npm test -- tests/story-management.test.ts tests/story-editor.test.tsx` and verify the tests pass.

## Task 7: Regression Verification

- [ ] Run focused tests: `npm test -- tests/story-generator.test.tsx tests/theme-picker.test.tsx tests/child-profile.test.ts tests/children-list.test.tsx tests/story-management.test.ts tests/story-editor.test.tsx`.
- [ ] Run full tests: `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Run `npm run e2e`.
- [ ] Inspect `http://localhost:3000/` in the in-app browser, and inspect authenticated routes if a signed-in browser session is available.

## Self-Review

- Spec coverage: Phase 3 creation polish is covered by Tasks 1-2; child edit/delete by Tasks 3-4; story edit/delete by Tasks 5-6; verification/docs by Task 7.
- Placeholder scan: No TBD/TODO placeholders remain.
- Type consistency: Child forms use `child_id`; story forms use `story_id`; theme radios continue to use `theme_key`.
