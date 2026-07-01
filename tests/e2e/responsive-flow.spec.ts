import { expect, test } from "@playwright/test";

const mobilePages = [
  { path: "/", heading: /personalized bedtime stories/i, anchor: /Tonight's story preview/i },
  { path: "/signup", heading: "Create account", anchor: /Private bedtime stories/i },
  { path: "/login", heading: "Log in", anchor: /Private bedtime stories/i },
  { path: "/forgot-password", heading: "Reset your password", anchor: /Private bedtime stories/i },
  { path: "/reset-password", heading: "Choose a new password", anchor: /Private bedtime stories/i },
];

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const hasNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

  expect(hasNoOverflow).toBe(true);
}

test("public and recovery pages stay usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const item of mobilePages) {
    await page.goto(item.path);
    await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
    await expect(page.getByText(item.anchor)).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test("signed-out users are guided to login from app routes", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});
