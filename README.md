# Frontend Take-Home Bundle Builder

A production-minded React prototype for a multi-step home security bundle builder. The experience is data-driven, responsive, persisted through localStorage, and built around centralized bundle state so product cards and the live review panel always stay in sync.

## Tech Stack

- Vite
- React
- TypeScript
- SCSS Modules
- Context + useReducer
- Local JSON catalog data
- localStorage persistence
- ESLint

## Folder Structure

```text
src/
  app/
  components/
    ui/                     Reusable presentation primitives
  features/
    bundle-builder/
      components/           Feature UI composition
      data/                 Local JSON catalog and typed data exports
      hooks/                Feature hooks
      store/                Context and reducer-backed provider
      types/                Bundle domain types
      utils/                Selectors, pricing, persistence helpers
  shared/
    styles/                 Global styles and design tokens
    hooks/
    utils/
```

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

On Windows PowerShell, use `npm.cmd run lint` if script execution policy blocks the npm shim.

## Design Decisions

- The catalog is defined in `src/features/bundle-builder/data/bundleData.json`, keeping steps, products, categories, images, variants, prices, and seeded quantities outside UI components.
- Bundle state is centralized with Context + `useReducer`; derived values are computed through selectors instead of being stored redundantly.
- Variant quantities are keyed by product and variant, so switching a product card from one color to another shows the correct quantity without losing the previous variant selection.
- SCSS tokens define colors, spacing, radii, typography, shadows, transitions, and breakpoints. Component styles use those variables rather than repeated literals.
- The review panel groups selected products by catalog-defined categories and shares the same quantity update path as product cards.

## Tradeoffs

- Context + `useReducer` was chosen over Zustand to keep dependencies minimal while still providing a scalable state boundary.
- Product imagery is lightweight local SVG artwork to avoid network dependencies and keep the prototype self-contained.
- The checkout flow is intentionally a simple confirmation alert because payment flow implementation is outside the take-home scope.

## Future Improvements

- Add automated unit tests for selectors and reducer behavior.
- Add visual regression coverage for desktop and mobile breakpoints.
- Support coupon codes, taxes, subscription billing intervals, and richer plan comparison.
- Persist multiple saved systems instead of a single saved configuration.
