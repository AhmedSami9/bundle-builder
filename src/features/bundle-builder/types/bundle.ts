export type ProductCategory = "cameras" | "sensors" | "accessories" | "plan";

export type StepIconName = "camera" | "shield" | "sensor" | "spark";

export type SwatchTone = "white" | "black" | "graphite" | "sage";

export type BundleStep = {
  id: string;
  eyebrow: string;
  title: string;
  icon: StepIconName;
  productIds: string[];
};

export type ProductVariant = {
  id: string;
  label: string;
  swatchTone: SwatchTone;
  image: string;
  priceCents: number;
  compareAtCents?: number;
};

export type BundleProduct = {
  id: string;
  category: ProductCategory;
  title: string;
  description: string;
  badge?: string;
  image: string;
  learnMoreUrl: string;
  variants?: ProductVariant[];
  priceCents?: number;
  compareAtCents?: number;
  maxQuantity?: number;
  defaultQuantity?: number;
  defaultQuantities?: Record<string, number>;
};

export type BundleCatalog = {
  steps: BundleStep[];
  products: BundleProduct[];
  reviewGroups: Array<{
    id: ProductCategory;
    title: string;
  }>;
  shippingCents: number;
};

export type BundleState = {
  activeStepId: string;
  activeVariants: Record<string, string>;
  quantities: Record<string, number>;
  savedAt?: string;
};

export type ReviewItem = {
  key: string;
  productId: string;
  variantId?: string;
  category: ProductCategory;
  name: string;
  variantLabel?: string;
  image: string;
  quantity: number;
  priceCents: number;
  compareAtCents: number;
  maxQuantity: number;
};

export type PricingSummary = {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  compareAtTotalCents: number;
  savingsCents: number;
  financingMonthlyCents: number;
};
