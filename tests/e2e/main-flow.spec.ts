import { expect, test } from "@playwright/test";

test("public entry points render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /personalized bedtime stories/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start" })).toBeVisible();

  await page.getByRole("link", { name: "Start" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();

  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});