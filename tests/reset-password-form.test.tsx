import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  createSupabaseBrowserClient: vi.fn(),
}));

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates the user's password", async () => {
    const updateUser = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createSupabaseBrowserClient).mockReturnValue({
      auth: { updateUser },
    } as unknown as ReturnType<typeof createSupabaseBrowserClient>);

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText("New password"), { target: { value: "secret123" } });
    fireEvent.submit(screen.getByRole("button", { name: /reset password/i }).closest("form")!);

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({ password: "secret123" });
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Password updated");
  });
});
