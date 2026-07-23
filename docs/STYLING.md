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

## Visual Modes (dark mode)

Cloudscape supports two ways to apply dark-mode token overrides:

### `.awsui-dark-mode` — explicit / JS-driven

Add this class to the root element (e.g. `<body>`) to force dark mode unconditionally.
Requires JavaScript to toggle at runtime. Also recognised as the legacy alias `.awsui-polaris-dark-mode`.

```html
<body class="awsui-dark-mode">…</body>
```

### `.awsui-auto-mode` — CSS-only system preference (new)

Add this class to the root element to make Cloudscape follow the OS/browser dark-mode preference
(`prefers-color-scheme: dark`) **without any JavaScript**. The class can be rendered server-side
at build time, avoiding theme flash on first paint in SSR applications.

```html
<!-- Server renders this once; no JS needed -->
<body class="awsui-auto-mode">…</body>
```

The dark-mode token overrides are wrapped in:

```css
@media not print and (prefers-color-scheme: dark) {
  .awsui-auto-mode { /* dark token overrides */ }
}
```

**Choosing between the two:**

| | `.awsui-dark-mode` | `.awsui-auto-mode` |
|---|---|---|
| Requires JS | Yes (to toggle) | No |
| Follows OS preference | No | Yes |
| SSR-safe (no flash) | No | Yes |
| Explicit override | Yes | No |
| Can be toggled at runtime | Yes | Not directly (use `.awsui-dark-mode` for that) |

For the SCSS mixin equivalent, use `dark-mode-only` or the new `auto-mode-only` in
`src/internal/styles/utils/theming.scss`.
