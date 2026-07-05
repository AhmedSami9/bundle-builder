import { describe, expect, it } from "vitest";
import type { BundleCatalog, BundleState } from "../types/bundle";
import {
  getInitialState,
  getPricingSummary,
  getReviewItems,
  getSelectedCountForStep,
} from "./bundleSelectors";

const mockCatalog: BundleCatalog = {
  shippingCents: 500,
  reviewGroups: [
    { id: "cameras", title: "Cameras" },
    { id: "sensors", title: "Sensors" },
    { id: "plan", title: "Plan" },
  ],
  steps: [
    {
      id: "cameras-step",
      eyebrow: "STEP 1 OF 2",
      title: "Choose cameras",
      icon: "camera",
      productIds: ["camera", "doorbell"],
    },
    {
      id: "sensors-step",
      eyebrow: "STEP 2 OF 2",
      title: "Choose sensors",
      icon: "sensor",
      productIds: ["sensor"],
    },
  ],
  products: [
    {
      id: "camera",
      category: "cameras",
      title: "Outdoor Camera",
      description: "Outdoor camera",
      image: "/camera-white.svg",
      learnMoreUrl: "#camera",
      maxQuantity: 5,
      defaultQuantities: { white: 2 },
      variants: [
        {
          id: "white",
          label: "White",
          swatchTone: "white",
          image: "/camera-white.svg",
          priceCents: 10000,
          compareAtCents: 12000,
        },
        {
          id: "black",
          label: "Black",
          swatchTone: "black",
          image: "/camera-black.svg",
          priceCents: 11000,
          compareAtCents: 13000,
        },
      ],
    },
    {
      id: "doorbell",
      category: "cameras",
      title: "Doorbell",
      description: "Video doorbell",
      image: "/doorbell.svg",
      learnMoreUrl: "#doorbell",
      priceCents: 8000,
      compareAtCents: 10000,
      maxQuantity: 2,
    },
    {
      id: "sensor",
      category: "sensors",
      title: "Entry Sensor",
      description: "Entry sensor",
      image: "/sensor.svg",
      learnMoreUrl: "#sensor",
      priceCents: 2500,
      compareAtCents: 3000,
      defaultQuantity: 3,
      maxQuantity: 10,
    },
  ],
};

describe("bundleSelectors", () => {
  it("seeds activeStepId from the first catalog step", () => {
    expect(getInitialState(mockCatalog).activeStepId).toBe("cameras-step");
  });

  it("seeds active variants for products that have variants", () => {
    expect(getInitialState(mockCatalog).activeVariants).toEqual({
      camera: "white",
    });
  });

  it("returns only review items with quantity greater than zero", () => {
    const state: BundleState = {
      activeStepId: "cameras-step",
      activeVariants: { camera: "white" },
      quantities: {
        "camera:white": 2,
        "camera:black": 0,
        "doorbell:default": 0,
        "sensor:default": 1,
      },
    };

    const reviewItems = getReviewItems(mockCatalog, state);

    expect(reviewItems).toHaveLength(2);
    expect(reviewItems.map((item) => item.key)).toEqual(["camera:white", "sensor:default"]);
  });

  it("returns separate rows for selected variants", () => {
    const state: BundleState = {
      activeStepId: "cameras-step",
      activeVariants: { camera: "black" },
      quantities: {
        "camera:white": 2,
        "camera:black": 1,
      },
    };

    const reviewItems = getReviewItems(mockCatalog, state);

    expect(reviewItems).toHaveLength(2);
    expect(reviewItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: "camera:white", variantLabel: "White", quantity: 2 }),
        expect.objectContaining({ key: "camera:black", variantLabel: "Black", quantity: 1 }),
      ]),
    );
  });

  it("calculates pricing summary values", () => {
    const reviewItems = getReviewItems(mockCatalog, {
      activeStepId: "cameras-step",
      activeVariants: { camera: "white" },
      quantities: {
        "camera:white": 2,
        "doorbell:default": 1,
      },
    });

    expect(getPricingSummary(mockCatalog, reviewItems)).toEqual({
      subtotalCents: 28000,
      shippingCents: 500,
      totalCents: 28500,
      compareAtTotalCents: 34000,
      savingsCents: 6000,
      financingMonthlyCents: 2375,
    });
  });

  it("counts distinct selected products for a step instead of total quantity", () => {
    const state: BundleState = {
      activeStepId: "cameras-step",
      activeVariants: { camera: "white" },
      quantities: {
        "camera:white": 3,
        "camera:black": 2,
        "doorbell:default": 3,
        "sensor:default": 0,
      },
    };

    expect(getSelectedCountForStep(mockCatalog, state, "cameras-step")).toBe(2);
    expect(getSelectedCountForStep(mockCatalog, state, "sensors-step")).toBe(0);
  });
});
