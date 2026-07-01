import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ChildrenList } from "@/components/children/children-list";

const childrenProfiles = [
  {
    id: "child-1",
    name: "Aina",
    age: 7,
    language: "English",
    interests: ["stars", "cats"],
    bedtime_tone: "calm",
  },
];

const updateAction = vi.fn(async () => undefined);
const deleteAction = vi.fn(async () => undefined);

describe("ChildrenList", () => {
  it("renders edit and delete controls for each child profile", () => {
    render(<ChildrenList childrenProfiles={childrenProfiles} updateAction={updateAction} deleteAction={deleteAction} />);

    const card = screen.getByRole("article", { name: /aina/i });
    expect(within(card).getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
    expect(within(card).getByRole("button", { name: /delete profile/i })).toBeInTheDocument();
    expect(within(card).getByDisplayValue("Aina")).toBeInTheDocument();
  });
});
