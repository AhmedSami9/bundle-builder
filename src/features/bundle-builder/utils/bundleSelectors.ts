import type {
  BundleCatalog,
  BundleProduct,
  BundleState,
  PricingSummary,
  ProductVariant,
  ReviewItem,
} from "../types/bundle";
import { createSelectionKey, parseSelectionKey } from "./selectionKey";

export function getInitialState(catalog: BundleCatalog): BundleState {
  const activeVariants: Record<string, string> = {};
  const quantities: Record<string, number> = {};

  catalog.products.forEach((product) => {
    const firstVariant = product.variants?.[0];

    if (firstVariant) {
      activeVariants[product.id] = firstVariant.id;
      Object.entries(product.defaultQuantities ?? {}).forEach(([variantId, quantity]) => {
        quantities[createSelectionKey(product.id, variantId)] = quantity;
      });
      return;
    }

    if (product.defaultQuantity) {
      quantities[createSelectionKey(product.id)] = product.defaultQuantity;
    }
  });

  return {
    activeStepId: catalog.steps[0]?.id ?? "",
    activeVariants,
    quantities,
  };
}

export function getProductPrice(product: BundleProduct, variant?: ProductVariant) {
  return {
    priceCents: variant?.priceCents ?? product.priceCents ?? 0,
    compareAtCents: variant?.compareAtCents ?? product.compareAtCents ?? product.priceCents ?? 0,
  };
}

export function getActiveVariant(product: BundleProduct, state: BundleState) {
  const activeVariantId = state.activeVariants[product.id];
  return product.variants?.find((variant) => variant.id === activeVariantId) ?? product.variants?.[0];
}

export function getQuantityForSelection(state: BundleState, productId: string, variantId?: string) {
  return state.quantities[createSelectionKey(productId, variantId)] ?? 0;
}

export function getSelectedCountForStep(
  catalog: BundleCatalog,
  state: BundleState,
  stepId: string,
) {
  const step = catalog.steps.find((item) => item.id === stepId);

  if (!step) {
    return 0;
  }

  return step.productIds.reduce((total, productId) => {
    const product = catalog.products.find((item) => item.id === productId);

    if (!product) {
      return total;
    }

    if (product.variants) {
      return (
        total +
        product.variants.reduce(
          (variantTotal, variant) =>
            variantTotal + getQuantityForSelection(state, product.id, variant.id),
          0,
        )
      );
    }

    return total + getQuantityForSelection(state, product.id);
  }, 0);
}

export function getReviewItems(catalog: BundleCatalog, state: BundleState): ReviewItem[] {
  const reviewItems: ReviewItem[] = [];

  Object.entries(state.quantities).forEach(([key, quantity]) => {
    if (quantity <= 0) {
      return;
    }

    const { productId, variantId } = parseSelectionKey(key);
    const product = catalog.products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const variant = product.variants?.find((item) => item.id === variantId);
    const price = getProductPrice(product, variant);
    const reviewItem: ReviewItem = {
      key,
      productId,
      category: product.category,
      name: product.title,
      image: variant?.image ?? product.image,
      quantity,
      priceCents: price.priceCents,
      compareAtCents: price.compareAtCents,
      maxQuantity: product.maxQuantity ?? 10,
    };

    if (variantId) {
      reviewItem.variantId = variantId;
    }

    if (variant?.label) {
      reviewItem.variantLabel = variant.label;
    }

    reviewItems.push(reviewItem);
  });

  return reviewItems.sort(
    (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
  );
}

export function getPricingSummary(
  catalog: BundleCatalog,
  reviewItems: ReviewItem[],
): PricingSummary {
  const subtotalCents = reviewItems.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0,
  );
  const compareAtTotalCents = reviewItems.reduce(
    (total, item) => total + item.compareAtCents * item.quantity,
    0,
  );
  const totalCents = subtotalCents + catalog.shippingCents;

  return {
    subtotalCents,
    shippingCents: catalog.shippingCents,
    totalCents,
    compareAtTotalCents,
    savingsCents: Math.max(compareAtTotalCents - subtotalCents, 0),
    financingMonthlyCents: Math.ceil(totalCents / 12),
  };
}
