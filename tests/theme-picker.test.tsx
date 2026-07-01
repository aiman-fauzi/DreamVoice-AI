import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemePicker } from "@/components/stories/theme-picker";

describe("ThemePicker", () => {
  it("marks the selected theme with an accessible radio and visible selected text", () => {
    render(<ThemePicker selectedTheme="learning_quest" />);

    const selected = screen.getByRole("radio", { name: /learning quest/i });
    expect(selected).toBeChecked();
    expect(screen.getByText("Tonight's pick")).toBeInTheDocument();
  });

  it("can disable theme choices while generation is running", () => {
    render(<ThemePicker selectedTheme="calm_bedtime" disabled />);

    expect(screen.getByRole("radio", { name: /calm bedtime/i })).toBeDisabled();
  });
});
