import { beforeEach, describe, expect, it, vi } from "vitest";

const exchangeCodeForSession = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession,
    },
  })),
}));

describe("auth callback route", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset();
    exchangeCodeForSession.mockResolvedValue({ error: null });
  });

  it("exchanges a confirmation code and redirects to the requested app page", async () => {
    const { GET } = await import("@/app/auth/callback/route");

    const response = await GET(new Request("https://dreamvoice.example/auth/callback?code=abc123&next=/dashboard"));

    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc123");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://dreamvoice.example/dashboard");
  });
});
