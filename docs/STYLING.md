# Styling

Never hardcode CSS spacing, colors, borders, shadows, typography, or motion values. This project uses design tokens and custom CSS properties.

## Design Tokens

Tokens are defined in `style-dictionary/` and consumed in SCSS via the `awsui` namespace:

```scss
@use '../internal/styles/tokens' as awsui;

.my-element {
  color: awsui.$color-text-body-default;
  padding-block: awsui.$space-scaled-s;
}
```

Browse `style-dictionary/` for available token names. Tokens cover colors, spacing, borders, shadows, typography, and motion durations.

## Custom CSS Properties

Custom CSS properties are defined in `build-tools/utils/custom-css-properties.js`. Read this file to see what's available.

## Shared SCSS Mixins

Shared mixins live in `src/internal/styles/`. Import them as needed:

- `styles-reset` — resets inherited styles on root elements. Apply on every component root.
- `with-motion` — wraps animations/transitions so they respect `prefers-reduced-motion` and the motion-disabled flag.
- `form-focus-element` — focus ring for form inputs.
- `form-disabled-element` — disabled state for form inputs (background, border, color, cursor).
- `form-invalid-control` — invalid state styling (error border, left accent border).
- `form-warning-control` — warning state styling.
- `form-readonly-element` — read-only state for form inputs.
- `focus-highlight` — focus ring using a pseudo-element (for non-form elements).
- `text-wrapping`, `text-overflow-ellipsis` — text overflow helpers.
Read the mixin files for parameters and usage.

## Rules

- Apply `styles-reset` mixin on every root element — prevents parent styles from leaking in
- Root elements must not have outer margins — spacing is managed by parent components
- No descendant combinators (`.a .b` with a space) — breaks CSS scoping
- Wrap all animations in the `with-motion` mixin — ensures motion can be toggled
- Use logical properties only — no `left`/`right`/`top`/`bottom`/`width`/`height` in CSS. Use `inline-start`/`inline-end`/`block-start`/`block-end`/`inline-size`/`block-size` instead. This is required for RTL support.

## Component States

For form-like components, use the shared form mixins for consistent state styling:

- Default state: standard border and background from tokens
- Hover state: use token-based hover colors (e.g. `awsui.$color-background-button-normal-hover`)
- Focus state: use `form-focus-element` or `focus-highlight` mixin
- Disabled state: use `form-disabled-element` mixin
- Invalid state: use `form-invalid-control` mixin (adds left accent border)
- Warning state: use `form-warning-control` mixin
- Read-only state: use `form-readonly-element` mixin

## RTL Support

Use logical CSS properties (see Rules above). For cases that need direction-aware logic:

- SCSS: `with-direction` mixin in `src/internal/styles/direction.scss`
- JS: `getIsRtl`, `handleKey`, `getLogicalBoundingClientRect`, `getOffsetInlineStart`, `getScrollInlineStart` in `src/internal/`
