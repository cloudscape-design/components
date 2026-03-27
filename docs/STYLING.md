# Styling

Prefer design tokens and custom CSS properties over hardcoded values (colors, spacing, font sizes, etc.). This keeps styles consistent across themes and modes.

## Rules

- Root elements must not have outer margins — spacing is managed by parent components
- No descendant combinators (`.a .b` with a space) — breaks CSS scoping because it applies to all `.class-b` elements at unlimited depth
- Wrap animations in the `with-motion` mixin to ensure motion can be toggled on and off
- Use logical properties only — no `left`/`right`/`top`/`bottom`/`width`/`height` in CSS. Use `inline-start`/`inline-end`/`block-start`/`block-end`/`inline-size`/`block-size` instead. Required for RTL support.

References:
- [Mappings for sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values/Sizing#mappings_for_dimensions)
- [Mappings for margins, borders, and padding](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values/Margins_borders_padding#mappings_for_margins_borders_and_padding)
- [Mappings for floating and positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values/Floating_and_positioning#mapped_properties_and_values)

## RTL Support

For cases that need direction-aware logic beyond CSS logical properties:

- In SCSS, use the `with-direction` mixin
- In TypeScript, `@cloudscape-design/component-toolkit/internal` provides direction detection and logical geometry helpers that replace physical DOM properties
