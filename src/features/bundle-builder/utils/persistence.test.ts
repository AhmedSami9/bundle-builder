import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BundleState } from "../types/bundle";
import { loadSavedBundleState, saveBundleState } from "./persistence";

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    clear: vi.fn(() => store.clear()),
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
  };
}

describe("persistence", () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    vi.stubGlobal("window", {
      localStorage: localStorageMock,
    });
  });

  it("writes bundle state to localStorage", () => {
    const state: BundleState = {
      activeStepId: "cameras",
      activeVariants: { camera: "white" },
      quantities: { "camera:white": 2 },
    };

    const savedAt = saveBundleState(state);
    const rawSavedState = localStorageMock.setItem.mock.calls[0]?.[1];

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "bundle-builder.saved-system.v1",
      expect.any(String),
    );
    expect(JSON.parse(rawSavedState ?? "")).toEqual({
      ...state,
      savedAt,
    });
  });

  it("returns saved bundle state from localStorage", () => {
    const savedState = {
      activeStepId: "plan",
      activeVariants: { camera: "black" },
      quantities: { "camera:black": 1 },
      savedAt: "2026-07-05T00:00:00.000Z",
    };

    localStorageMock.setItem("bundle-builder.saved-system.v1", JSON.stringify(savedState));

    expect(loadSavedBundleState()).toEqual(savedState);
  });

  it("returns undefined when localStorage has invalid JSON", () => {
    localStorageMock.setItem("bundle-builder.saved-system.v1", "{bad json");

    expect(loadSavedBundleState()).toBeUndefined();
  });

  it("returns undefined when no saved state exists", () => {
    expect(loadSavedBundleState()).toBeUndefined();
  });
});
