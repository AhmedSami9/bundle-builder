import type { BundleState } from "../types/bundle";

const STORAGE_KEY = "bundle-builder.saved-system.v1";

type PersistedBundleState = Pick<BundleState, "activeStepId" | "activeVariants" | "quantities" | "savedAt">;

export function loadSavedBundleState() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return undefined;
    }

    return JSON.parse(rawValue) as PersistedBundleState;
  } catch {
    return undefined;
  }
}

export function saveBundleState(state: BundleState) {
  const savedAt = new Date().toISOString();
  const savedState: PersistedBundleState = {
    activeStepId: state.activeStepId,
    activeVariants: state.activeVariants,
    quantities: state.quantities,
    savedAt,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));

  return savedAt;
}
