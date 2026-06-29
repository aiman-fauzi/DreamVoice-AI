import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusMessage } from "@/components/ui/status-message";

describe("StatusMessage", () => {
  it("announces success messages as polite status updates", () => {
    render(<StatusMessage tone="success">Setup saved.</StatusMessage>);

    expect(screen.getByRole("status")).toHaveTextContent("Setup saved.");
  });

  it("announces error messages as alerts", () => {
    render(<StatusMessage tone="error">Something went wrong.</StatusMessage>);

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong.");
  });
});
