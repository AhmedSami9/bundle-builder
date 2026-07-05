import { createContext } from "react";
import type { getPricingSummary, getReviewItems } from "../utils/bundleSelectors";
import type { BundleState } from "../types/bundle";

export type BundleBuilderContextValue = {
  state: BundleState;
  reviewItems: ReturnType<typeof getReviewItems>;
  pricing: ReturnType<typeof getPricingSummary>;
  selectedCountForStep: (stepId: string) => number;
  setActiveStep: (stepId: string) => void;
  goToNextStep: (stepId: string) => void;
  selectVariant: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  saveConfiguration: () => void;
};

export const BundleBuilderContext = createContext<BundleBuilderContextValue | undefined>(undefined);
