import { describe, expect, it } from "vitest";
import {
  DEFAULT_CUSTOM_COLOR,
  isPresetColor,
  normalizeHex,
  PAGE_COLORS,
  resolveCustomColor,
} from "@/lib/color-utils";

describe("normalizeHex", () => {
  it("normalizes 6-digit hex with hash", () => {
    expect(normalizeHex("#AABBCC")).toBe("#aabbcc");
  });

  it("adds hash to 6-digit hex without prefix", () => {
    expect(normalizeHex("ff00aa")).toBe("#ff00aa");
  });

  it("expands 3-digit shorthand", () => {
    expect(normalizeHex("#abc")).toBe("#aabbcc");
  });

  it("returns null for invalid values", () => {
    expect(normalizeHex("not-a-color")).toBeNull();
    expect(normalizeHex("#gggggg")).toBeNull();
  });
});

describe("isPresetColor", () => {
  it("detects preset swatches", () => {
    expect(isPresetColor("#fef3c7")).toBe(true);
    expect(isPresetColor("#FEF3C7")).toBe(true);
  });

  it("rejects custom colors", () => {
    expect(isPresetColor("#123456")).toBe(false);
  });
});

describe("resolveCustomColor", () => {
  it("falls back to default for invalid input", () => {
    expect(resolveCustomColor("invalid")).toBe(DEFAULT_CUSTOM_COLOR);
  });

  it("returns normalized custom color", () => {
    expect(resolveCustomColor("112233")).toBe("#112233");
  });
});

describe("PAGE_COLORS", () => {
  it("includes the default white swatch", () => {
    expect(PAGE_COLORS).toContain("#ffffff");
  });
});
