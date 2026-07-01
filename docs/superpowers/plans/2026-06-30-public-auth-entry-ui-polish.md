# Public/Auth Entry UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the DreamVoice public landing and auth/recovery screens so the first impression feels warm, trustworthy, and clearly connected to the bedtime-story product loop.

**Architecture:** Keep this pass presentation-focused. Add one shared auth shell component for login/signup/recovery pages, polish the landing page in `app/page.tsx`, and keep existing Supabase auth form behavior unchanged. Tests verify the public/auth pages expose the new UX anchors and retain mobile usability.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, lucide-react, Vitest with Testing Library, Playwright through `npm run e2e`.

---

## File Structure

- Modify: `app/page.tsx` - public landing page hero, product preview, trust/phase-safe messaging, and responsive CTA hierarchy.
- Create: `components/auth/auth-shell.tsx` - shared auth/recovery page wrapper with brand rail, product promise, and consistent form card layout.
- Modify: `app/(auth)/login/page.tsx` - use `AuthShell` with login-specific copy and links.
- Modify: `app/(auth)/signup/page.tsx` - use `AuthShell` with signup-specific copy and links.
- Modify: `app/(auth)/forgot-password/page.tsx` - use `AuthShell` with recovery-specific copy and links.
- Modify: `app/(auth)/reset-password/page.tsx` - use `AuthShell` with reset-specific copy and links.
- Modify: `components/auth/auth-form.tsx` - use existing `Field` and `fieldControlClass` for consistent auth inputs; keep auth behavior unchanged.
- Modify: `tests/e2e/responsive-flow.spec.ts` - add visible checks for new public/auth UX anchors.
- Modify: `docs/PROGRESS.md` - record implementation results after verification.

## Task 1: Public/Auth UX Regression Checks

**Files:**
- Modify: `tests/e2e/responsive-flow.spec.ts`

- [ ] **Step 1: Write failing e2e checks for new public/auth anchors**

Update the first test so it verifies the landing page preview and shared auth shell content. Keep the existing overflow checks.

```ts
const mobilePages = [
  { path: "/", heading: /personalized bedtime stories/i, anchor: /Tonight's story preview/i },
  { path: "/signup", heading: "Create account", anchor: /Private bedtime stories/i },
  { path: "/login", heading: "Log in", anchor: /Private bedtime stories/i },
  { path: "/forgot-password", heading: "Reset your password", anchor: /Private bedtime stories/i },
  { path: "/reset-password", heading: "Choose a new password", anchor: /Private bedtime stories/i },
];

for (const item of mobilePages) {
  await page.goto(item.path);
  await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
  await expect(page.getByText(item.anchor)).toBeVisible();
  await expectNoHorizontalOverflow(page);
}
```

- [ ] **Step 2: Run the e2e test and verify RED**

Run: `npm run e2e -- tests/e2e/responsive-flow.spec.ts`

Expected: FAIL because the current landing page does not use the new `Personalized bedtime stories` heading and the auth pages do not render `Private bedtime stories` yet.

## Task 2: Shared Auth Shell

**Files:**
- Create: `components/auth/auth-shell.tsx`
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/signup/page.tsx`
- Modify: `app/(auth)/forgot-password/page.tsx`
- Modify: `app/(auth)/reset-password/page.tsx`

- [ ] **Step 1: Create `AuthShell`**

Create a server component that receives eyebrow, title, description, children, and footer content. It should render a shared brand rail on desktop and a compact card on mobile.

```tsx
import Link from "next/link";
import { Check, Moon, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
};

const promises = [
  "Guided setup before the first story",
  "Generated narration or parent recording",
  "Private Story History for saved favorites",
];

export function AuthShell({ eyebrow, title, description, children, footer, className }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-moon px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1fr_460px]">
        <section className="hidden rounded-lg border border-slate-200 bg-ink p-8 text-white shadow-soft lg:block">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-ink">
              <Moon className="h-5 w-5" aria-hidden="true" />
            </span>
            DreamVoice AI
          </Link>
          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.14em] text-skywash">Private bedtime stories</p>
          <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight">A quieter path from sign in to story time.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">DreamVoice keeps Phase 1 focused on child profiles, personalized stories, private narration, and easy story history.</p>
          <div className="mt-8 grid gap-3">
            {promises.map((promise) => (
              <div key={promise} className="flex items-center gap-3 rounded-md bg-white/10 px-3 py-3 text-sm text-slate-100">
                <Check className="h-4 w-4 text-skywash" aria-hidden="true" />
                {promise}
              </div>
            ))}
          </div>
        </section>

        <section className={cn("rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-7", className)}>
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-base font-semibold lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink text-white">
              <Moon className="h-4 w-4" aria-hidden="true" />
            </span>
            DreamVoice AI
          </Link>
          <div className="mb-6 rounded-md bg-skywash p-3 text-sm font-semibold text-ink lg:hidden">
            <Sparkles className="mr-2 inline h-4 w-4 text-moss" aria-hidden="true" />
            Private bedtime stories
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-6">{children}</div>
          <div className="mt-5 text-sm leading-6 text-slate-600">{footer}</div>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Move auth pages onto `AuthShell`**

For each auth route, replace its local `<main>` and `<section>` wrapper with `AuthShell`. Keep the same form components and links.

Login page footer:

```tsx
<div className="flex flex-wrap items-center justify-between gap-3">
  <Link className="font-semibold text-moss" href="/forgot-password">Forgot password?</Link>
  <span>
    New to DreamVoice? <Link className="font-semibold text-moss" href="/signup">Create an account</Link>
  </span>
</div>
```

Signup page footer:

```tsx
<span>
  Already have an account? <Link className="font-semibold text-moss" href="/login">Log in</Link>
</span>
```

Forgot password footer:

```tsx
<span>
  Remembered it? <Link className="font-semibold text-moss" href="/login">Log in</Link>
</span>
```

Reset password footer:

```tsx
<span>
  Need another reset email? <Link className="font-semibold text-moss" href="/forgot-password">Send reset link</Link>
</span>
```

- [ ] **Step 3: Run the e2e test and verify partial GREEN for auth anchors**

Run: `npm run e2e -- tests/e2e/responsive-flow.spec.ts`

Expected: auth pages now satisfy `Private bedtime stories`; landing page may still fail until Task 3.

## Task 3: Landing Page First Impression

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update the landing page hero and preview**

Keep existing links and Phase 1 behavior. Change the primary heading to `Personalized bedtime stories, ready before the lights go out.` Add a preview panel with accessible text `Tonight's story preview`, and add three compact proof items: guided setup, six themes, private listening.

Implementation outline:

```tsx
const proofItems = [
  { icon: UserPlus, label: "Guided setup", text: "Parent and child details stay focused on the first story." },
  { icon: Sparkles, label: "Six story themes", text: "Pick a gentle direction without writing a prompt." },
  { icon: Mic, label: "Private listening", text: "Use generated narration or record your own voice." },
];
```

Use the existing `Button`, `Moon`, `Sparkles`, `History`, `Mic`, and `UserPlus` imports where possible. Keep the page full-screen but show enough lower content that it does not feel like a generic landing card.

- [ ] **Step 2: Run the e2e test and verify GREEN**

Run: `npm run e2e -- tests/e2e/responsive-flow.spec.ts`

Expected: PASS for public/recovery mobile usability and signed-out dashboard redirect.

## Task 4: Auth Form Consistency

**Files:**
- Modify: `components/auth/auth-form.tsx`
- Test: `tests/auth-form.test.tsx`

- [ ] **Step 1: Write a failing component test for helper text**

Add a test showing signup includes password guidance and login uses the same accessible inputs.

```tsx
it("shows password guidance for account creation", () => {
  render(<AuthForm mode="signup" />);

  expect(screen.getByText("Use at least 6 characters. You can change this later from account recovery.")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the component test and verify RED**

Run: `npm test -- tests/auth-form.test.tsx`

Expected: FAIL because the helper text does not exist yet.

- [ ] **Step 3: Use `Field` in `AuthForm`**

Replace raw labels with `Field` and `fieldControlClass`. Add password helper text only for signup.

```tsx
<Field label="Email" helperText={mode === "signup" ? "Use the email address where you want confirmation and reset links." : undefined}>
  <input className={fieldControlClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
</Field>
<Field label="Password" helperText={mode === "signup" ? "Use at least 6 characters. You can change this later from account recovery." : undefined}>
  <input className={fieldControlClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required />
</Field>
```

- [ ] **Step 4: Run the component test and verify GREEN**

Run: `npm test -- tests/auth-form.test.tsx`

Expected: PASS.

## Task 5: Verification And Progress

**Files:**
- Modify: `docs/PROGRESS.md`

- [ ] **Step 1: Run quality checks**

Run these commands:

```powershell
npm test -- tests/auth-form.test.tsx tests/forgot-password-form.test.tsx tests/reset-password-form.test.tsx
npm run lint
npm run typecheck
npm run build
npm run e2e -- tests/e2e/responsive-flow.spec.ts
```

Expected: all commands exit with code 0. Use `npm run e2e`, not direct `npx playwright test`, because direct Playwright has previously hung in this shell.

- [ ] **Step 2: Manually inspect in browser**

Start the dev server if needed, then inspect:

- `/`
- `/signup`
- `/login`
- `/forgot-password`
- `/reset-password`

Check desktop and mobile width for readable headings, no text overlap, visible focus styles, and no horizontal overflow.

- [ ] **Step 3: Update `docs/PROGRESS.md`**

Record the Phase 1 implementation, files changed, tests run, and next action: review public/auth UI in browser, then continue to Phase 2 story detail/listening/history after approval.

- [ ] **Step 4: Commit if Git is available**

Run:

```powershell
git status --short
git add app/page.tsx app/(auth)/login/page.tsx app/(auth)/signup/page.tsx app/(auth)/forgot-password/page.tsx app/(auth)/reset-password/page.tsx components/auth/auth-shell.tsx components/auth/auth-form.tsx tests/auth-form.test.tsx tests/e2e/responsive-flow.spec.ts docs/PROGRESS.md docs/superpowers/plans/2026-06-30-public-auth-entry-ui-polish.md
git commit -m "feat: polish public auth entry flow"
```

Expected: commit succeeds if Git is installed. If Git is still unavailable, document the blocker in the handoff.
