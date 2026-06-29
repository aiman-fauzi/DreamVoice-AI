import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppNav } from "@/components/app/app-nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/stories/new",
}));

describe("AppNav", () => {
  it("marks the active navigation item", () => {
    render(<AppNav />);

    expect(screen.getByRole("link", { name: /new story/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /story history/i })).not.toHaveAttribute("aria-current");
  });

  it("labels story history as a primary destination", () => {
    render(<AppNav />);

    expect(screen.getByRole("link", { name: /story history/i })).toHaveAttribute("href", "/library");
  });
});
