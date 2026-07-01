# Story Detail Listening History UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Story History and story detail/listening screens so saved stories are easier to scan, read, listen to, record, and download without changing Phase 1 business logic.

**Architecture:** Keep the pass presentation-focused and reuse existing server/client boundaries. Add a small `StoryStage` component for the reading surface, refine `StoryLibrary`, improve audio/action cards in existing narration components, and leave Supabase/Gemini/Google TTS/storage behavior unchanged.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, lucide-react, Vitest with Testing Library, Playwright through `npm run e2e`.

---

## File Structure

- Create: `components/stories/story-stage.tsx` - reusable story reading surface with the Phase 2 "story stage" treatment.
- Modify: `app/(app)/stories/[id]/page.tsx` - compose story actions, listening toolkit, saved audio, and `StoryStage`.
- Modify: `components/stories/story-library.tsx` - improve filters and story cards for scanning and selected state.
- Modify: `components/narrations/google-narration-button.tsx` - make generated narration action visually fit the private listening toolkit.
- Modify: `components/narrations/manual-recorder.tsx` - make parent recording action visually fit the private listening toolkit.
- Modify: `components/narrations/audio-player.tsx` - improve saved audio row/card presentation.
- Test: `tests/story-library.test.tsx` - component tests for selected filters and scan-friendly card copy.
- Test: `tests/story-stage.test.tsx` - component tests for story stage labels and readable text surface.
- Test: `tests/audio-player.test.tsx` - component test for saved audio labeling.
- Modify: `tests/e2e/main-flow.spec.ts` - update public entry test to the Phase 1 landing headline so full e2e stays current.
- Modify: `docs/PROGRESS.md` - record implementation and verification results.

## Task 1: Story History Regression Tests

**Files:**
- Create: `tests/story-library.test.tsx`

- [ ] **Step 1: Write failing tests for story history polish**

Create `tests/story-library.test.tsx` with these tests:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryLibrary } from "@/components/stories/story-library";

const stories = [
  {
    id: "story-1",
    title: "Moon Garden",
    child_id: "child-1",
    theme_key: "calm_bedtime",
    language: "English",
    created_at: "2026-06-20T10:00:00.000Z",
  },
];

const childrenProfiles = [{ id: "child-1", name: "Aina" }];

describe("StoryLibrary", () => {
  it("marks the selected child filter as the current page", () => {
    render(<StoryLibrary stories={stories} childrenProfiles={childrenProfiles} selectedChildId="child-1" />);

    expect(screen.getByRole("link", { name: "Aina" })).toHaveAttribute("aria-current", "page");
  });

  it("shows scan-friendly story card details", () => {
    render(<StoryLibrary stories={stories} childrenProfiles={childrenProfiles} />);

    expect(screen.getByRole("link", { name: /Moon Garden/i })).toHaveTextContent("Calm Bedtime");
    expect(screen.getByRole("link", { name: /Moon Garden/i })).toHaveTextContent("Private story");
    expect(screen.getByRole("link", { name: /Moon Garden/i })).toHaveTextContent("Read or listen");
  });
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test -- tests/story-library.test.tsx`

Expected: FAIL because the selected filter does not set `aria-current` and story cards do not show `Private story` or `Read or listen` yet.

## Task 2: Story Stage Regression Tests

**Files:**
- Create: `tests/story-stage.test.tsx`
- Create: `components/stories/story-stage.tsx`

- [ ] **Step 1: Write the failing story stage test**

Create `tests/story-stage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoryStage } from "@/components/stories/story-stage";

describe("StoryStage", () => {
  it("frames a story as a private reading stage", () => {
    render(
      <StoryStage
        title="Moon Garden"
        themeLabel="Calm Bedtime"
        language="English"
        savedDate="Jun 20, 2026"
        storyText="Once upon a moon.\nA lantern glowed softly."
      />,
    );

    expect(screen.getByRole("region", { name: "Private reading stage" })).toBeInTheDocument();
    expect(screen.getByText("Calm Bedtime")).toBeInTheDocument();
    expect(screen.getByText("Jun 20, 2026")).toBeInTheDocument();
    expect(screen.getByText(/A lantern glowed softly/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- tests/story-stage.test.tsx`

Expected: FAIL because `StoryStage` does not exist yet.

## Task 3: Saved Audio Regression Tests

**Files:**
- Create: `tests/audio-player.test.tsx`
- Modify: `components/narrations/audio-player.tsx`

- [ ] **Step 1: Write the failing audio player test**

Create `tests/audio-player.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AudioPlayer } from "@/components/narrations/audio-player";

describe("AudioPlayer", () => {
  it("labels saved audio as private playback", () => {
    render(<AudioPlayer narrationId="narration-1" label="Generated narration" />);

    expect(screen.getByText("Private playback")).toBeInTheDocument();
    expect(screen.getByText("Generated narration")).toBeInTheDocument();
    expect(screen.getByLabelText("Generated narration audio")).toHaveAttribute("src", "/api/audio/narration-1");
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- tests/audio-player.test.tsx`

Expected: FAIL because `Private playback` and the audio `aria-label` are not present yet.

## Task 4: Implement Story History Polish

**Files:**
- Modify: `components/stories/story-library.tsx`

- [ ] **Step 1: Update filters and story cards**

Change selected filter links to include `aria-current="page"`. Refine card structure to include theme, language, child name, saved date, `Private story`, and `Read or listen`.

Use `BookOpen` and `Headphones` from `lucide-react`. Keep links pointing to `/stories/${story.id}` and filter URLs unchanged.

- [ ] **Step 2: Run story library tests and verify GREEN**

Run: `npm test -- tests/story-library.test.tsx`

Expected: PASS.

## Task 5: Implement Story Stage

**Files:**
- Create: `components/stories/story-stage.tsx`
- Modify: `app/(app)/stories/[id]/page.tsx`

- [ ] **Step 1: Implement `StoryStage`**

Create a presentational component with props:

```ts
type StoryStageProps = {
  title: string;
  themeLabel: string;
  language: string;
  savedDate: string;
  storyText: string;
};
```

Render a `section` with `aria-label="Private reading stage"`, metadata chips, and a comfortable `whitespace-pre-wrap` story text region.

- [ ] **Step 2: Run story stage tests and verify GREEN**

Run: `npm test -- tests/story-stage.test.tsx`

Expected: PASS.

- [ ] **Step 3: Use `StoryStage` on story detail page**

Replace the raw story text `<section>` in `app/(app)/stories/[id]/page.tsx` with `StoryStage`. Pass `story.title ?? "Bedtime Story"`, `theme?.label ?? "Story"`, `story.language`, `new Date(story.created_at).toLocaleDateString()`, and `story.story_text`.

## Task 6: Implement Listening Toolkit Polish

**Files:**
- Modify: `app/(app)/stories/[id]/page.tsx`
- Modify: `components/narrations/google-narration-button.tsx`
- Modify: `components/narrations/manual-recorder.tsx`
- Modify: `components/narrations/audio-player.tsx`

- [ ] **Step 1: Update `AudioPlayer`**

Add `Private playback` copy, a clearer bordered card style, and `aria-label={`${label} audio`}` on the `<audio>` element.

- [ ] **Step 2: Run audio player tests and verify GREEN**

Run: `npm test -- tests/audio-player.test.tsx`

Expected: PASS.

- [ ] **Step 3: Polish narration action cards**

Update the generated narration and parent recording cards with small uppercase eyebrows, icon-led headings, and clearer helper text. Preserve all existing click handlers, API calls, messages, quota behavior, microphone behavior, and `router.refresh()` calls.

- [ ] **Step 4: Polish story detail composition**

On the story detail page, replace `Story actions` with `Private story toolkit`, keep `Download story`, keep `Back to history`, keep public sharing KIV copy, and group generated/manual narration under a heading such as `Listening options`. Keep saved audio below those actions.

## Task 7: Keep Browser Tests Current

**Files:**
- Modify: `tests/e2e/main-flow.spec.ts`

- [ ] **Step 1: Update old landing heading assertion**

Change the landing assertion from `/make tonight/i` to `/personalized bedtime stories/i`.

- [ ] **Step 2: Run focused e2e tests**

Run: `npm run e2e -- tests/e2e/main-flow.spec.ts tests/e2e/responsive-flow.spec.ts`

Expected: PASS.

## Task 8: Verification And Progress

**Files:**
- Modify: `docs/PROGRESS.md`

- [ ] **Step 1: Run quality checks**

Run these commands:

```powershell
npm test -- tests/story-library.test.tsx tests/story-stage.test.tsx tests/audio-player.test.tsx tests/story-actions.test.tsx
npm test
npm run lint
npm run typecheck
npm run build
npm run e2e
```

Expected: all commands exit with code 0. Use `npm run e2e`, not direct `npx playwright test`.

- [ ] **Step 2: Manually inspect in browser**

Inspect these pages where data is available locally:

- `/library`
- At least one `/stories/[id]` detail page if local data/session allows.

If no authenticated local story detail can be loaded manually, rely on build/tests and document the manual limitation.

- [ ] **Step 3: Update `docs/PROGRESS.md`**

Record Phase 2 implementation, files changed, verification commands, known risks, and next action: Phase 3 story creation flow polish after user approval.

- [ ] **Step 4: Commit if Git is available**

Run:

```powershell
git status --short
git add app/(app)/stories/[id]/page.tsx components/stories/story-library.tsx components/stories/story-stage.tsx components/narrations/google-narration-button.tsx components/narrations/manual-recorder.tsx components/narrations/audio-player.tsx tests/story-library.test.tsx tests/story-stage.test.tsx tests/audio-player.test.tsx tests/e2e/main-flow.spec.ts docs/PROGRESS.md docs/superpowers/plans/2026-06-30-story-detail-listening-history-ui-polish.md
git commit -m "feat: polish story listening history flow"
```

Expected: commit succeeds if Git is installed. If Git is still unavailable, document the blocker in the handoff.
