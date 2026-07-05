export const BASE_SELECTION_ID = "default";

export function createSelectionKey(productId: string, variantId?: string) {
  return `${productId}:${variantId ?? BASE_SELECTION_ID}`;
}

export function parseSelectionKey(key: string) {
  const [productId, variantId] = key.split(":");

  return {
    productId,
    variantId: variantId === BASE_SELECTION_ID ? undefined : variantId,
  };
}
