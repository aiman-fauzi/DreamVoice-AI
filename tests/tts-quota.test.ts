import { describe, expect, it } from "vitest";

import { canUseTts, getMonthKey } from "@/lib/tts-quota";

describe("getMonthKey", () => {
  it("formats dates as YYYY-MM", () => {
    expect(getMonthKey(new Date("2026-06-21T12:00:00.000Z"))).toBe("2026-06");
  });
});

describe("canUseTts", () => {
  it("allows requests that stay below the limit", () => {
    expect(canUseTts({ used: 100, requested: 200, limit: 1000 })).toEqual({
      allowed: true,
      remaining: 700,
    });
  });

  it("blocks requests that exactly reach the limit", () => {
    expect(canUseTts({ used: 900, requested: 100, limit: 1000 })).toEqual({
      allowed: false,
      remaining: 100,
    });
  });

  it("blocks requests above the limit", () => {
    expect(canUseTts({ used: 900, requested: 101, limit: 1000 })).toEqual({
      allowed: false,
      remaining: 100,
    });
  });
});