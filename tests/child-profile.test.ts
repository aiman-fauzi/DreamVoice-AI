import { describe, expect, it } from "vitest";

import { parseChildProfileForm, parseChildInterests, parseSupportedLanguage } from "@/lib/child-profile";

describe("child profile helpers", () => {
  it("parses child profile form data for create and update actions", () => {
    const formData = new FormData();
    formData.set("name", " Aina ");
    formData.set("age", "7");
    formData.set("language", "Bahasa Malaysia");
    formData.set("interests", " stars, cats, gentle adventures ");
    formData.set("bedtime_tone", "calm");

    expect(parseChildProfileForm(formData)).toEqual({
      name: "Aina",
      age: 7,
      language: "Bahasa Malaysia",
      interests: ["stars", "cats", "gentle adventures"],
      bedtimeTone: "calm",
    });
  });

  it("rejects missing names and unsupported ages", () => {
    const formData = new FormData();
    formData.set("name", " ");
    formData.set("age", "13");

    expect(() => parseChildProfileForm(formData)).toThrow("Enter a child name and an age from 1 to 12.");
  });

  it("normalizes interests and language safely", () => {
    expect(parseChildInterests(" one, two, two, three, four, five, six, seven, eight, nine ")).toEqual([
      "one",
      "two",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
    ]);
    expect(parseSupportedLanguage("Bahasa Malaysia")).toBe("Bahasa Malaysia");
    expect(parseSupportedLanguage("French")).toBe("English");
  });
});


