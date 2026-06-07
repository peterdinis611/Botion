import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NoteColorPicker } from "@/components/workspace/note-color-picker";

describe("NoteColorPicker", () => {
  it("opens the palette and selects a preset color", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NoteColorPicker color="#ffffff" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Page color" }));
    await user.click(screen.getByRole("button", { name: "Yellow" }));

    expect(onChange).toHaveBeenCalledWith("#fef3c7");
  });

  it("applies a custom hex color", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<NoteColorPicker color="#ffffff" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Page color" }));

    const input = screen.getByLabelText("Custom hex color");
    await user.clear(input);
    await user.type(input, "112233{Enter}");

    expect(onChange).toHaveBeenCalledWith("#112233");
  });
});
