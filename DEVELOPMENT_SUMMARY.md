# Development Summary

## 1. Architecture Overview

The app is organized as a feature-based React frontend. Shared UI primitives live in `src/components/ui`, while the bundle builder owns its catalog data, domain types, reducer store, selectors, and composed feature components under `src/features/bundle-builder`.

## 2. Folder Structure Explanation

- `components/ui`: reusable Button, Card, Badge, Panel, Price, QuantityStepper, Thumbnail, VariantSelector, Divider, LinkButton, and IconButton components.
- `features/bundle-builder/data`: local JSON catalog plus typed exports.
- `features/bundle-builder/store`: reducer-backed provider and context definition.
- `features/bundle-builder/hooks`: `useBundleBuilder` access hook.
- `features/bundle-builder/utils`: selection keys, pricing selectors, money formatting, and persistence utilities.
- `shared/styles`: global SCSS and design tokens.

## 3. State Management Explanation

Bundle state is stored in one reducer state object containing the active step, active variant per product, selected quantities, and saved timestamp. Components dispatch updates through provider actions exposed by `useBundleBuilder`.

## 4. Variant Quantity Logic Explanation

Quantities are keyed with `productId:variantId`. Products without variants use `productId:default`. This means Outdoor Camera White and Outdoor Camera Black are independent selections; switching the active card variant only changes what the card displays.

## 5. Review Panel Sync Explanation

The review panel is derived from the same quantity map as the product cards. `getReviewItems` expands selected keys into display rows, including separate rows for selected variants. Review steppers update the exact same selection key.

## 6. Persistence Explanation

`saveBundleState` and `loadSavedBundleState` isolate localStorage access in `utils/persistence.ts`. Clicking "Save my system for later" writes the current configuration, and the provider hydrates from that saved value on reload.

## 7. Reusable Components Created

Button, IconButton, Accordion-style step composition, Card, Badge, QuantityStepper, VariantSelector, Price, Divider, Panel, LinkButton, and Thumbnail.

## 8. Utilities Created

Money formatting, selection key creation/parsing, initial state generation, active variant lookup, selected count calculation, review item derivation, pricing summary calculation, and localStorage persistence.

## 9. Styling/Design-Token Approach

Global CSS variables are defined from SCSS token files for colors, spacing, radius, typography, shadows, transitions, and breakpoints. Component styles are implemented with SCSS Modules and consume those variables.

## 10. Responsive Behavior

Desktop uses a two-column builder and sticky review panel. Tablet and mobile stack the accordion and review panel vertically, with product cards and review rows adapting to narrower grids.

## 11. Tradeoffs

The app uses Context + `useReducer` instead of Zustand to avoid extra runtime dependencies. Product visuals are local SVG assets for a self-contained prototype. Checkout is represented by a simple alert.

## 12. Future Improvements

Add reducer and selector tests, visual regression tests, richer plan comparison, tax and discount handling, and support for multiple saved configurations.

## 13. Anything Unfinished

No required functionality is intentionally left unfinished. The prototype builds and lints successfully.
