import bundleData from "./bundleData.json";
import type { BundleCatalog, BundleProduct } from "../types/bundle";

export const catalog = bundleData as BundleCatalog;

export const productsById = catalog.products.reduce<Record<string, BundleProduct>>(
  (acc, product) => {
    acc[product.id] = product;
    return acc;
  },
  {},
);
