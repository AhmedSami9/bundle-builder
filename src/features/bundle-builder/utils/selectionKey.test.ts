import { describe, expect, it } from "vitest";
import { createSelectionKey, parseSelectionKey } from "./selectionKey";

describe("selectionKey", () => {
  it("creates a default selection key for products without variants", () => {
    expect(createSelectionKey("indoor-camera")).toBe("indoor-camera:default");
  });

  it("creates a variant selection key", () => {
    expect(createSelectionKey("outdoor-camera", "black")).toBe("outdoor-camera:black");
  });

  it("parses a default selection key with an undefined variantId", () => {
    expect(parseSelectionKey("indoor-camera:default")).toEqual({
      productId: "indoor-camera",
      variantId: undefined,
    });
  });

  it("parses a variant selection key", () => {
    expect(parseSelectionKey("outdoor-camera:white")).toEqual({
      productId: "outdoor-camera",
      variantId: "white",
    });
  });
});
