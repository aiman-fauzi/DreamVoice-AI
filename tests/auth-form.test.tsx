import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthForm } from "@/components/auth/auth-form";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows password guidance for account creation", () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByText("Use at least 6 characters. You can change this later from account recovery.")).toBeInTheDocument();
  });

  it("sends signup confirmation emails to onboarding after the auth callback", async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    });

    vi.mocked(createSupabaseBrowserClient).mockReturnValue({
      auth: {
        signUp,
      },
    } as unknown as ReturnType<typeof createSupabaseBrowserClient>);

    render(<AuthForm mode="signup" />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form")!);

    const expectedRedirect = new URL("/auth/callback", window.location.origin);
    expectedRedirect.searchParams.set("next", "/onboarding");

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        email: "parent@example.com",
        password: "secret123",
        options: {
          emailRedirectTo: expectedRedirect.toString(),
        },
      });
    });
  });

  it("announces login failures as errors", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({
      data: { session: null },
      error: { message: "Invalid login credentials" },
    });

    vi.mocked(createSupabaseBrowserClient).mockReturnValue({
      auth: {
        signInWithPassword,
      },
    } as unknown as ReturnType<typeof createSupabaseBrowserClient>);

    render(<AuthForm mode="login" />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "parent@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /log in/i }).closest("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid login credentials");
  });
});
