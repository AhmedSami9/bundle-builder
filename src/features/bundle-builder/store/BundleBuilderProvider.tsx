import {
  useCallback,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { catalog } from "../data/catalog";
import type { BundleState } from "../types/bundle";
import { BundleBuilderContext } from "./bundleBuilderContext";
import {
  getInitialState,
  getPricingSummary,
  getReviewItems,
  getSelectedCountForStep,
} from "../utils/bundleSelectors";
import { loadSavedBundleState, saveBundleState } from "../utils/persistence";
import { createSelectionKey } from "../utils/selectionKey";

type BundleAction =
  | { type: "set-active-step"; stepId: string }
  | { type: "select-variant"; productId: string; variantId: string }
  | { type: "set-quantity"; productId: string; variantId?: string; quantity: number }
  | { type: "mark-saved"; savedAt: string };

function normalizeQuantity(quantity: number) {
  return Math.max(0, Math.floor(quantity));
}

function reducer(state: BundleState, action: BundleAction): BundleState {
  switch (action.type) {
    case "set-active-step":
      return {
        ...state,
        activeStepId: action.stepId,
      };
    case "select-variant":
      return {
        ...state,
        activeVariants: {
          ...state.activeVariants,
          [action.productId]: action.variantId,
        },
      };
    case "set-quantity": {
      const key = createSelectionKey(action.productId, action.variantId);
      const nextQuantity = normalizeQuantity(action.quantity);
      const nextQuantities = { ...state.quantities };

      if (nextQuantity === 0) {
        delete nextQuantities[key];
      } else {
        nextQuantities[key] = nextQuantity;
      }

      return {
        ...state,
        quantities: nextQuantities,
      };
    }
    case "mark-saved":
      return {
        ...state,
        savedAt: action.savedAt,
      };
    default:
      return state;
  }
}

function createHydratedInitialState() {
  const defaultState = getInitialState(catalog);

  if (typeof window === "undefined") {
    return defaultState;
  }

  return {
    ...defaultState,
    ...loadSavedBundleState(),
  };
}

export function BundleBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createHydratedInitialState);
  const reviewItems = useMemo(() => getReviewItems(catalog, state), [state]);
  const pricing = useMemo(() => getPricingSummary(catalog, reviewItems), [reviewItems]);

  const selectedCountForStep = useCallback(
    (stepId: string) => getSelectedCountForStep(catalog, state, stepId),
    [state],
  );

  const setActiveStep = useCallback((stepId: string) => {
    dispatch({ type: "set-active-step", stepId });
  }, []);

  const goToNextStep = useCallback((stepId: string) => {
    const stepIndex = catalog.steps.findIndex((step) => step.id === stepId);
    const nextStep = catalog.steps[stepIndex + 1];

    if (nextStep) {
      dispatch({ type: "set-active-step", stepId: nextStep.id });
    }
  }, []);

  const selectVariant = useCallback((productId: string, variantId: string) => {
    dispatch({ type: "select-variant", productId, variantId });
  }, []);

  const setQuantity = useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      dispatch({ type: "set-quantity", productId, variantId, quantity });
    },
    [],
  );

  const saveConfiguration = useCallback(() => {
    const savedAt = saveBundleState(state);
    dispatch({ type: "mark-saved", savedAt });
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      reviewItems,
      pricing,
      selectedCountForStep,
      setActiveStep,
      goToNextStep,
      selectVariant,
      setQuantity,
      saveConfiguration,
    }),
    [
      goToNextStep,
      pricing,
      reviewItems,
      saveConfiguration,
      selectVariant,
      selectedCountForStep,
      setActiveStep,
      setQuantity,
      state,
    ],
  );

  return <BundleBuilderContext.Provider value={value}>{children}</BundleBuilderContext.Provider>;
}
