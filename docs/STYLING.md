# Styling

Never hardcode CSS spacing, colors, borders, shadows, typography, or motion values. This project uses design tokens and custom CSS properties.

## Design Tokens

Tokens are defined in `style-dictionary/` and consumed in SCSS via the `awsui` namespace.

## Custom CSS Properties

Custom CSS properties are defined in `build-tools/utils/custom-css-properties.js`. Read this file to see what's available.

## Rules

- Apply `styles-reset` mixin on every root element — prevents parent styles from leaking in
- Root elements must not have outer margins — spacing is managed by parent components
- No descendant combinators (`.a .b` with a space) — breaks CSS scoping
- Wrap all animations in the `with-motion` mixin — ensures motion can be toggled
- Use logical properties only — no `left`/`right`/`top`/`bottom`/`width`/`height` in CSS. Use `inline-start`/`inline-end`/`block-start`/`block-end`/`inline-size`/`block-size` instead. This is required for RTL support.

## RTL Support

For bidirectional layout support, use the internal RTL utilities in `src/internal/`:

- SCSS: `with-direction` mixin for direction-aware styles
- JS: `getIsRtl` for detecting direction, `handleKey` for direction-aware key handling, `getLogicalBoundingClientRect` / `getOffsetInlineStart` / `getScrollInlineStart` for direction-aware measurements
