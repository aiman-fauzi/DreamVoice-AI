import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends password reset emails to the reset password route", async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createSupabaseBrowserClient).mockReturnValue({
      auth: { resetPasswordForEmail },
    } as unknown as ReturnType<typeof createSupabaseBrowserClient>);

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "parent@example.com" } });
    fireEvent.submit(screen.getByRole("button", { name: /send reset email/i }).closest("form")!);

    await waitFor(() => {
      expect(resetPasswordForEmail).toHaveBeenCalledWith("parent@example.com", {
        redirectTo: "http://localhost:3000/reset-password",
      });
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Check your email");
  });
});
