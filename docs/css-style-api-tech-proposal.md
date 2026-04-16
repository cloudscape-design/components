# Tech Proposal: CSS-Based Style API for Cloudscape Components

## Current approach: Style prop API

An inline style prop API is already implemented for ~20 components (Button, Alert, Input, Tabs, Checkbox, etc.). It works by:

1. Defining a typed `style` prop on the component interface (e.g. `ButtonProps.Style`)
2. Mapping prop values to CSS custom properties at render time (e.g. `--awsui-style-background-default`)
3. Component SCSS reads these custom properties with fallbacks: `background: var(#{custom-props.$styleBackgroundDefault}, map.get($variant, 'default-background'))`
4. Gated behind `SYSTEM === 'core'` — only available in the "core" system variant

### Limitations of the style prop approach

#### 1. Per-instance only

Styles are applied via inline style attributes on individual component instances. There is no way to style all buttons on a page from a single location.

#### 2. State explosion

Each interactive state (hover, active, disabled, focus) requires a separate property, leading to deeply nested objects (e.g. `style.root.background.hover`). Leaf property counts across components:

| Component | ~Leaf properties | Deepest nesting |
|---|---|---|
| Flashbar | 71 | `item.dismissButton.color.active.error` (5 levels) |
| Input / Textarea | 30 | `root.backgroundColor.readonly` (3 levels) |
| Button | 23 | `root.background.active` (3 levels) |
| Checkbox | 22 | `input.check.stroke.checked` (4 levels) |
| Tabs | 23 | `tab.activeIndicator.borderRadius` (3 levels) |
| Badge | 7 | `root.background` (2 levels) |

Flashbar is the worst case: it nests interaction states (hover, active, default) *inside* type variants (error, info, success, warning, inProgress), producing a 3-dimensional matrix of `element × interaction-state × type-variant`.

#### 3. Variant-unaware (or variant-aware at extreme cost)

Most components apply the style prop uniformly to the instance regardless of variant. For example, there is no way to say "only style primary buttons this way" without wrapping every Button usage in conditional logic.

Flashbar is the one exception: it bakes type variants (`error`, `info`, `success`, `warning`, `inProgress`) directly into the style object, so consumers can style each type independently. But this comes at extreme cost — every styleable property is multiplied by every variant, producing 71 leaf properties and up to 5 levels of nesting (e.g. `item.dismissButton.color.active.error`). Applying this pattern to Button (6 variants × ~23 properties) or Tabs (3 variants) would make the interfaces unmanageable.

#### 4. Does not scale to complex components

Components like Table, Modal, or CodeEditor have dozens of internal DOM elements. Defining a typed style interface for each targetable element is impractical.Components like Table, Modal, or CodeEditor have dozens of internal DOM elements. Defining a typed style interface for each targetable element is impractical.

#### 5. Inconsistent state vocabulary across components

There is no unified state model. Each component defines its own set of state keys:

| Component | States in Style interface |
|---|---|
| Button | `default`, `hover`, `active`, `disabled` |
| Input | `default`, `hover`, `focus`, `disabled`, `readonly` |
| Checkbox | `default`, `checked`, `indeterminate`, `disabled`, `readOnly` |
| Toggle | `default`, `checked`, `disabled`, `readOnly` |
| Slider | `default`, `hover`, `active` (no `disabled` despite having a `disabled` prop) |
| Flashbar | `error`, `info`, `inProgress`, `success`, `warning` (type-based, not interaction-based) |

Notable inconsistencies:
- `readonly` (lowercase) in Input vs `readOnly` (camelCase) in Checkbox/Toggle.
- Button has no `focus` state. Input has no `active` state.
- Slider exposes `disabled` as a prop but has no `disabled` key in its Style interface.

#### 6. Missing validation states in the Style interface

Input, Textarea, and other form controls accept `invalid` and `warning` props, but the Style interface has no corresponding state keys. In the SCSS, the `form-invalid-control` mixin reads the `default` custom property as a fallback:

```scss
// input/styles.scss
&.input-invalid {
  @include styles.form-invalid-control(
    $color: var(#{custom-props.$styleColorDefault}, awsui.$color-text-status-error),
    $border-color: var(#{custom-props.$styleBorderColorDefault}, awsui.$color-text-status-error),
  );
}
```

This means:
- If a consumer sets `borderColor.default: 'blue'`, an invalid input gets a blue border instead of red — the validation signal is silently lost.
- There is no way to style the invalid or warning state specifically (e.g. "use orange for warning borders").
- The component's own validation styles and the consumer's custom styles compete for the same CSS custom property (`--styleColorDefault`), with no clear winner.

#### 7. State intersections are undefined

When multiple states are active simultaneously, it is unclear which style should apply. Example: what happens when a user hovers over an invalid input?

- Should the custom `hover` style apply?
- Should the component's `invalid` style (red) apply?
- Should a combination of both apply?

The current implementation has no precedence model for intersecting states. The SCSS cascade determines the outcome implicitly based on selector order, which is an implementation detail consumers cannot predict or control.

#### 8. Custom styles override component validation states (and vice versa)

When `invalid={true}`, the component's default invalid styles and custom styles conflict:

```jsx
<Input
  invalid={true}
  style={{
    root: {
      borderColor: {
        default: 'blue',  // Gets overridden by component's invalid style
        hover: 'darkblue',
      }
    }
  }}
/>
// Result: Border is RED (component default), not blue
```

Conversely, if the consumer sets `borderColor.default`, it can accidentally suppress the invalid indicator (see limitation 6). There is no separation between "I want to customize the default look" and "I want to customize the invalid look".

#### 9. Unmaintainable state combinatorics for consumers

Consumers who need different styles for different external states must build the style object conditionally in JavaScript:

```jsx
// This gets unmaintainable fast
const style = isInvalid
  ? (isDisabled ? invalidDisabledStyle : invalidStyle)
  : (isDisabled ? disabledStyle : defaultStyle);
```

With *n* boolean states, consumers face 2^n combinations. The style prop provides no declarative way to express intersections like `invalid + hover` or `warning + focus + readonly`Consumers who need different styles for different external states must build the style object conditionally in JavaScript:

```jsx
// This gets unmaintainable fast
const style = isInvalid
  ? (isDisabled ? invalidDisabledStyle : invalidStyle)
  : (isDisabled ? disabledStyle : defaultStyle);
```

With *n* boolean states, consumers face 2^n combinations. The style prop provides no declarative way to express intersections like `invalid + hover` or `warning + focus + readonly`..

#### 10. Poor reuse and composability

Style objects are monolithic. There is no mechanism to:
- Compose partial styles (e.g. a theme base + an accessibility override + app-specific tweaks).
- Extend a base style without spreading and risking property loss.
- Share styles across component types (e.g. "all form controls should have this border radius").

When a consumer provides a replacement style object (e.g. `styleInvalid` instead of `styleDefault`), they lose any custom `padding`, `fontSize`, etc. unless they manually spread: `{...defaultStyle, ...invalidStyle}`. This is error-prone and defeats the purpose of a typed API.

#### 11. No media query or responsive support

Styles are applied as inline CSS custom properties. There is no way to use `@media` queries, container queries, or `prefers-color-scheme` without resorting to JavaScript-based detection and conditional style objects.



## Why a CSS-based approach

Cloudscape components use high-specificity scoped selectors (e.g. `.awsui_button_vjswe_k1b2p_157:not(#\9)`) that are generated at build time and change across versions. Consumers who need to customize component appearance have no stable CSS targets and must resort to `!important` or fragile selector matching.

The style prop API was introduced to address this, but as documented above, it trades one set of problems for another: deeply nested JS objects, missing and inconsistent states, no composability, and no access to native CSS capabilities like pseudo-classes and media queries.

A CSS-based approach can solve both the original problem (no stable selectors) and the style prop limitations by providing stable class names and leveraging the browser's native cascade.

## Proposed approach: CSS-based Style API with Cascade Layers

A POC has been implemented for the Button component. The approach provides:

1. **Stable class names** on component DOM elements (e.g. `.awsui-style-button-button`)
2. **Data attributes** for variant/state selection (e.g. `[data-awsui-style-variant="primary"]`)
3. **CSS Cascade Layers** to ensure consumer styles override component styles without `!important`

### How it works

Component CSS is wrapped in `@layer awsui-components` at build time via a PostCSS plugin. Consumers declare layer order and write overrides in a higher-priority layer:

```css
@layer application, awsui-components;

@layer application {
  .awsui-style-button-button {
    border-radius: 0;
  }
  .awsui-style-button-root[data-awsui-style-variant="primary"] {
    background-color: green;
  }
}
```

This works regardless of specificity because CSS cascade layers take precedence over selector specificity.

### Advantages over the style prop

| Dimension | Style prop | CSS Style API |
|---|---|---|
| Scope | Per-instance | Global or scoped (via CSS selectors) |
| State handling | Explicit prop per state | Native CSS pseudo-classes (`:hover`, `:focus`, etc.) |
| Variant targeting | Requires JS conditionals | CSS attribute selectors |
| Media queries | Not possible without JS | Native `@media` support |
| Authoring | JavaScript objects | Standard CSS |
| Composability | None | Works with any CSS methodology |
| Scaling to complex components | Requires typed interface per element | Class names on DOM elements |

## Implementation plan

### Phase 1: Build infrastructure (in `theming-core`)

Already designed in `css-layers-proposal.md`. Summary:

- New PostCSS plugin `postcss-layer-wrap` wraps all compiled component CSS in `@layer awsui-components`
- Runs as the last step in `postCSSAfterAll`, after autoprefixer, specificity increase, and discard-empty
- Opt-in via `layerName` parameter on `BuildThemedComponentsInternalParams`
- No changes to component SCSS source files

### Phase 2: Define the CSS Style API schema

Each component exports a `css_style_api` object describing its targetable elements:

```ts
// src/button/css-style-api.ts
export const css_style_api = {
  root: {
    className: 'awsui-style-button-root',
    attributes: {
      'data-awsui-style-variant': ['primary', 'normal', 'link', 'icon', ...],
    },
  },
  button: { className: 'awsui-style-button-button' },
  anchor: { className: 'awsui-style-button-anchor' },
  icon: { className: 'awsui-style-button-icon' },
};
```

Naming conventions:
- Class names: `awsui-style-{component}-{element}`
- Data attributes: `data-awsui-style-{property}`

#### Element hierarchy via `children`

The `css_style_api` schema uses nested `children` to reflect the actual DOM hierarchy. This allows the doc generator to:

1. Render a visual tree of targetable elements
2. Build full selector paths (e.g. `.awsui-style-checkbox-control .awsui-style-checkbox-box`)
3. Show which elements are descendants of which

```ts
export const css_style_api = {
  root: {
    className: 'awsui-style-checkbox-root',
    children: {
      control: {
        className: 'awsui-style-checkbox-control',
        attributes: {
          ':has(input:checked)': 'checked',
          ':has(input:indeterminate)': 'indeterminate',
          ':has(input:disabled)': 'disabled',
        },
        children: {
          svg: {
            className: 'awsui-style-checkbox-svg',
            children: {
              box: { className: 'awsui-style-checkbox-box', type: 'svg:rect' },
              checkmark: { className: 'awsui-style-checkbox-checkmark', type: 'svg:polyline' },
            },
          },
        },
      },
      label: { className: 'awsui-style-checkbox-label' },
    },
  },
};
```

For internal component use, a flat lookup is derived from the nested schema to avoid verbose access paths:

```ts
const cssStyleApiClasses = {
  root: css_style_api.root.className,
  control: css_style_api.root.children.control.className,
};
```

This keeps the canonical schema hierarchical (for doc generation) while keeping component code ergonomic.

##### Approaches to representing hierarchy

Three approaches were considered:

| Approach | Schema example | Pros | Cons |
|---|---|---|---|
| **Nested `children`** (current) | `root.children.control.children.svg` | Self-validating via TypeScript; doc generator can walk the tree trivially; unambiguous parent-child relationships | Verbose to define for deeply nested components; internal access paths are long without a flat lookup helper |
| **Flat with `parent` reference** | `{ svg: { parent: 'control' } }` | Compact to write; flat access in component code | Error-prone (typo in `parent` silently breaks hierarchy); doc generator must reconstruct the tree; no TypeScript validation of parent references |
| **Flat without hierarchy** | `{ svg: { className: '...' } }` | Simplest to define and consume; no structural coupling | Doc generator cannot infer nesting; consumers don't know that `checkmark` is inside `svg` without reading source code |

##### Concern: exposing internal DOM structure

The nested `children` schema reveals the component's internal DOM hierarchy to consumers. This has significant trade-offs:

**Risks:**

- **Implicit structural contract**: The hierarchy communicates that `svg > box` is the DOM relationship. If the component is refactored (e.g. the SVG is replaced with a CSS-only implementation, or an intermediate wrapper is added), the documented hierarchy becomes misleading even if the stable class names remain valid.
- **Encourages descendant selectors**: Consumers who see the hierarchy may write selectors like `.awsui-style-checkbox-control .awsui-style-checkbox-svg .awsui-style-checkbox-box` instead of just `.awsui-style-checkbox-box`. These deeper selectors are more fragile — they break if an intermediate DOM node is added or removed, even though the target element's class name hasn't changed.
- **Constrains refactoring**: Even if we document that only class names are stable, the published hierarchy creates an expectation. Changing the nesting (e.g. moving `selectionCell` from inside `row` to a sibling) could break consumer selectors that rely on the documented parent-child relationship.
- **Reveals implementation details**: For components like Checkbox, the hierarchy exposes that the visual is an SVG with a `<rect>` and `<polyline>`. This is an implementation detail that could change (e.g. to a CSS-based approach or a `<canvas>` element).

**Mitigations:**

- **Document that only class names are the contract, not the hierarchy**: The `children` nesting is informational — it helps consumers understand the DOM but is not a guarantee. Only the `className` values are stable across versions.
- **Recommend flat selectors in documentation**: Generated docs should show `.awsui-style-checkbox-box { ... }` rather than `.awsui-style-checkbox-control .awsui-style-checkbox-box { ... }`. The hierarchy is available for context but not the recommended targeting pattern.
- **Consider a `description` field instead of deep nesting**: For cases where the hierarchy is informational only, a prose description (e.g. `description: 'SVG rect element inside the control'`) may communicate the relationship without implying a structural contract.
- **Limit nesting depth**: For complex components like Table, keep the hierarchy shallow (e.g. `root > row > bodyCell`) rather than exposing every intermediate wrapper. Only nest where the parent-child relationship is semantically meaningful and unlikely to change.

This is an open design decision. The current POC uses nested `children` to explore the approach, but a flat schema may be more appropriate for production to avoid over-committing to internal structure. Two flat alternatives are outlined below (full comparison in `docs/css-style-api-flat-schema-comparison.ts`).

##### Flat Option A: `description` field (no structural relationship encoded)

Each element gets a prose `description` that explains what it is without promising where it lives:

```ts
export const css_style_api = {
  root: { className: 'awsui-style-checkbox-root', description: 'Outermost checkbox wrapper' },
  control: {
    className: 'awsui-style-checkbox-control',
    description: 'Wrapper around native input and visual indicator',
    attributes: { ':has(input:checked)': 'checked', ... },
  },
  box: { className: 'awsui-style-checkbox-box', description: 'Checkbox box shape', type: 'svg:rect' },
  checkmark: { className: 'awsui-style-checkbox-checkmark', description: 'Check or indeterminate mark', type: 'svg:polyline' },
};
```

- Maximum refactoring freedom — descriptions are informational, not contractual
- Doc generator cannot automatically produce tree views or selector path examples
- Descriptions can drift from reality silently

##### Flat Option B: `containedIn` field (parent reference without full tree)

Each element references its parent by key, allowing the doc generator to reconstruct the tree without deep nesting:

```ts
export const css_style_api = {
  root: { className: 'awsui-style-checkbox-root' },
  control: { className: 'awsui-style-checkbox-control', containedIn: 'root', attributes: { ... } },
  svg: { className: 'awsui-style-checkbox-svg', containedIn: 'control' },
  box: { className: 'awsui-style-checkbox-box', containedIn: 'svg', type: 'svg:rect' },
  checkmark: { className: 'awsui-style-checkbox-checkmark', containedIn: 'svg', type: 'svg:polyline' },
};
```

- Doc generator can reconstruct tree views and build ancestor selector chains
- Flat to write and consume — `api.box.className` works directly
- Still encodes parent-child pairs, so `containedIn` can drift from reality
- Could be validated at build time with a TypeScript string literal union of sibling keys

##### Comparison summary

| Dimension | Nested `children` | Flat `description` | Flat `containedIn` |
|---|---|---|---|
| Structural commitment | Full tree | None | Parent-child pairs |
| Auto tree view in docs | Yes | No | Yes |
| Auto selector paths | Yes | No | Yes |
| Refactoring freedom | Low | High | Moderate |
| Authoring verbosity | High (deep nesting) | Low | Low |
| Internal className access | Needs flat helper | Direct | Direct |
| Risk of stale info | Structure drifts | Descriptions drift | `containedIn` drifts |

#### The `attributes` field

The `attributes` field is a unified map for anything that narrows the selector on an element. It supports two patterns:

**Data attributes** — for component-managed state like variants or selection:

```ts
attributes: {
  'data-awsui-style-variant': ['primary', 'normal', 'link', 'icon'],
  'data-awsui-style-selected': ['true', 'false'],
}
```

The doc generator produces selectors like `.awsui-style-button-root[data-awsui-style-variant="primary"]`.

**Pseudo-class selectors** — for state that already exists on native elements (e.g. `<input>`):

```ts
attributes: {
  ':has(input:checked)': 'checked',
  ':has(input:indeterminate)': 'indeterminate',
  ':has(input:disabled)': 'disabled',
}
```

The doc generator produces selectors like `.awsui-style-checkbox-control:has(input:checked)`. This avoids adding redundant `data-*` attributes when the DOM already carries the state natively.

The key is always the selector fragment to append to the element's `className`; the value describes what it means (for documentation labels).

#### The `type` field for non-HTML elements

Some components render SVG elements rather than HTML. The `type` field tells the doc generator which CSS properties are relevant for a given element:

```ts
box: { className: 'awsui-style-checkbox-box', type: 'svg:rect' },
checkmark: { className: 'awsui-style-checkbox-checkmark', type: 'svg:polyline' },
```

The doc generator maps `type` to a known set of styleable CSS properties:

| `type` | Relevant CSS properties |
|---|---|
| *(omitted)* | Standard CSS box model (`background`, `color`, `border`, `padding`, etc.) |
| `svg:rect` | `fill`, `stroke`, `stroke-width`, `rx`, `ry` |
| `svg:polyline` | `stroke`, `stroke-width`, `fill` |
| `svg:circle` | `fill`, `stroke`, `stroke-width`, `r` |
| `svg:path` | `fill`, `stroke`, `stroke-width` |

This keeps per-component definitions minimal (one string) while giving the doc generator enough information to produce a "Styleable properties" section. The mapping from type to properties lives once in the doc generator, not repeated across components.

### Phase 3: Apply stable classes and attributes in components

For each component, add the stable class names and data attributes to the relevant DOM elements. The POC demonstrates this for Button:

```tsx
className: clsx(
  buttonClass,
  css_style_api.root.className,
  isAnchor ? css_style_api.anchor.className : css_style_api.button.className
),
'data-awsui-style-variant': variant,
```

### Phase 4: Documentation and consumer tooling

- Ship `@layer application, awsui-components;` declaration in `@cloudscape-design/global-styles`
- Publish CSS Style API reference per component (generated from `css_style_api` exports)
- Provide migration guide from style prop to CSS Style API

## Complex scenarios

### Compound components (Table, Modal, Flashbar)

Compound components have deeply nested DOM trees with many targetable elements. For example, Table has: wrapper, header, body, rows, cells, sticky header, scrollbar, selection cells, etc.

**Approach**: Only expose the most commonly customized elements. Start with a minimal surface area and expand based on demand.

```ts
// src/table/internal.tsx — implemented in POC
export const css_style_api = {
  root: {
    className: 'awsui-style-table-root',
    attributes: {
      'data-awsui-style-variant': ['container', 'embedded', 'stacked', 'full-page', 'borderless'],
    },
  },
  wrapper: { className: 'awsui-style-table-wrapper' },
  table: { className: 'awsui-style-table-table' },
  headerCell: { className: 'awsui-style-table-header-cell' },
  bodyCell: { className: 'awsui-style-table-body-cell' },
  row: {
    className: 'awsui-style-table-row',
    attributes: {
      'data-awsui-style-selected': ['true', 'false'],
    },
  },
  selectionCell: { className: 'awsui-style-table-selection-cell' },
};
```

**Risk**: Exposing too many internal elements creates an implicit contract that constrains future DOM restructuring.

**Mitigation**: Document that only elements listed in `css_style_api` are stable targets. Internal DOM structure remains free to change.

### Components that render children in portals (Dropdown, Modal, Popover)

Portal-rendered content lives outside the component's DOM subtree. Consumer CSS selectors like `.my-page .awsui-style-dropdown-content` won't match because the portal is appended to `document.body`.

**Approach**: Stable class names on portal-rendered elements still work as standalone selectors (`.awsui-style-dropdown-content`). Document that descendant combinators from page-level containers will not work with portaled content. Consider adding a `data-awsui-style-portal-owner` attribute linking back to the trigger component.

### Theming and design tokens

The existing theming system uses CSS custom properties (design tokens) for colors, spacing, etc. The CSS Style API must coexist with theming.

**Approach**: CSS layers do not affect custom property inheritance. Consumer overrides in the `application` layer can reference design tokens:

```css
@layer application {
  .awsui-style-button-button {
    background-color: var(--awsui-color-background-button-primary-default);
  }
}
```

The layer ordering ensures the consumer's rule wins over the component's rule, while the custom property value still comes from the active theme.

### Interaction with the existing style prop

Both APIs can coexist during a transition period:

- The style prop sets CSS custom properties as inline styles (highest specificity)
- The CSS Style API uses class-based selectors in a higher cascade layer

When both are used on the same instance, the style prop wins for properties it sets (inline styles beat layered styles). This is acceptable as a migration path — consumers can incrementally move from style prop to CSS.

**Long-term**: Deprecate the style prop API in favor of the CSS Style API. The style prop requires `SYSTEM === 'core'` gating and per-component maintenance overhead that the CSS approach eliminates.

### State-dependent styling (hover, focus, disabled)

The style prop requires explicit properties for each state (`background.hover`, `background.active`, etc.). The CSS Style API uses native pseudo-classes:

```css
@layer application {
  .awsui-style-button-button:hover {
    background-color: darkblue;
  }
  .awsui-style-button-button:focus-visible {
    outline: 2px solid orange;
  }
  .awsui-style-button-root[data-awsui-style-variant="primary"]:disabled {
    opacity: 0.5;
  }
}
```

**Caveat**: Some components use `aria-disabled` instead of the native `disabled` attribute (e.g. buttons in loading state). Document which attribute to target per component, or expose a `data-awsui-style-disabled` attribute for consistency.

### Server-side rendering (SSR)

CSS layers and stable class names are purely CSS/HTML — no JavaScript execution required. The CSS Style API is fully SSR-compatible, unlike the style prop which requires React to render inline styles.

## Potential pitfalls and mitigations

### 1. Layer ordering conflicts with third-party CSS

**Problem**: If a consumer uses other CSS libraries that also use `@layer`, the ordering between `awsui-components`, `application`, and third-party layers must be explicitly declared. A missing or incorrect `@layer` declaration can cause unexpected precedence.

**Mitigation**:
- Ship a recommended layer order declaration in `@cloudscape-design/global-styles`
- Document that the `@layer` order declaration must appear before any other styles
- Provide a PostCSS plugin or utility for consumers to generate the correct layer order

### 2. Stable class names become a public API surface

**Problem**: Once consumers depend on `.awsui-style-button-button`, renaming or removing that class is a breaking change. This constrains internal refactoring.

**Mitigation**:
- Only expose classes listed in `css_style_api` — these are the contract
- Internal DOM elements without a `css_style_api` entry remain free to change
- Version the API: if a class must be removed, deprecate it for one major version
- Keep the exposed surface minimal — resist adding classes for every internal element

### 3. Specificity of unlayered third-party CSS

**Problem**: CSS that is not wrapped in any `@layer` has higher priority than all layered CSS. If a consumer imports unlayered third-party styles (e.g. a CSS reset), those styles could unintentionally override component styles.

**Mitigation**:
- Document that consumers should wrap their own CSS in the `application` layer
- Unlayered CSS overriding component styles is actually the desired behavior in most cases (it means consumer styles win)
- For cases where third-party CSS should NOT override components, consumers can wrap it in a lower-priority layer

### 4. Browser support

**Problem**: CSS Cascade Layers require Chrome 99+, Firefox 97+, Safari 15.4+. No IE11 support.

**Mitigation**: Cloudscape already does not support IE11. The browser support matrix aligns with Cloudscape's existing requirements. For older browsers, the layer declaration is ignored and styles fall back to normal specificity ordering — the `:not(#\9)` specificity boost in component CSS still protects against accidental overrides.

### 5. Scaling the `css_style_api` definition across ~87 components

**Problem**: Defining and maintaining `css_style_api` for every component is manual work. Inconsistencies in naming or missing attributes are likely.

**Mitigation**:
- Create a shared utility for generating the API object:
  ```ts
  // src/internal/css-style-api.ts
  export function createStyleApi<T extends Record<string, StyleApiElement>>(
    component: string, elements: T
  ): T { /* prefix class names, validate */ }
  ```
- Add a lint rule or build-time check that verifies every `css_style_api` class name follows the naming convention
- Roll out incrementally — start with the most-requested components (Button, Input, Table, Container, Alert) and expand based on demand

### 6. Performance impact of additional class names and data attributes

**Problem**: Adding 2-3 extra class names and 1-2 data attributes per component instance increases DOM size.

**Mitigation**: The overhead is negligible. Class names are short strings, and data attributes are only added where variant/state selection is needed. Benchmark on a page with 1000+ component instances to confirm.

### 8. Dynamic components and conditional rendering

**Problem**: Components that conditionally render different DOM structures (e.g. Button renders `<a>` or `<button>`) need stable classes on both variants.

**Mitigation**: The POC already handles this — `css_style_api.anchor` and `css_style_api.button` are separate entries, and `css_style_api.root` is applied to both. Document which class appears on which element.

## Rollout strategy

1. **Phase 1** — Merge build infrastructure (PostCSS layer-wrap in theming-core). This is backward-compatible — existing consumers see no change unless they declare layer ordering.
2. **Phase 2** — Add `css_style_api` to high-demand components (Button, Input, Alert, Container, Table, Tabs). Ship behind no feature flag — the stable classes are always present but harmless if unused.
3. **Phase 3** — Publish documentation, migration guide from style prop, and CSS Style API reference.
4. **Phase 4** — Deprecate the style prop API. Provide a codemod to migrate inline style prop usage to equivalent CSS.

## POC status

POCs have been implemented for three components:

| Component | File | Stable classes | Data attributes |
|---|---|---|---|
| Button | `src/button/internal.tsx` | `root`, `button`, `anchor`, `icon` | `data-awsui-style-variant` |
| Checkbox | `src/checkbox/internal.tsx` | `root`, `control`, `label`, `svg`, `box` (`type: svg:rect`), `checkmark` (`type: svg:polyline`) | Native pseudo-classes via `:has()` on `control`: `:has(input:checked)`, `:has(input:indeterminate)`, `:has(input:disabled)` |
| Table | `src/table/internal.tsx` | `root`, `wrapper`, `table`, `headerCell`, `bodyCell`, `row`, `selectionCell` | `data-awsui-style-variant`, `data-awsui-style-selected` |

The Table + Checkbox POC demonstrates a key advantage of the CSS approach: styling checkboxes differently based on their context (inside a table selection cell vs. standalone) using pure CSS descendant selectors.

Note: The Checkbox component renders its visual as an SVG (`<rect>` + `<polyline>`), not as a styled HTML element. The `box` and `checkmark` stable classes target the SVG `<rect>` and `<polyline>` respectively, allowing consumers to override SVG presentation attributes (`rx`, `ry`, `fill`, `stroke`) via CSS.

Checkbox state (checked, indeterminate, disabled) does not require custom data attributes — the native `<input type="checkbox">` inside the `control` element already carries `:checked`, `:indeterminate`, and `:disabled` pseudo-classes. Consumers target these via `:has()`:

```css
@layer application, awsui-components;

@layer application {
  /* All checkboxes: circular, purple */
  .awsui-style-checkbox-box {
    rx: 7;
    ry: 7;
    stroke: #7b2ff2;
  }
  .awsui-style-checkbox-control:has(input:checked) .awsui-style-checkbox-box,
  .awsui-style-checkbox-control:has(input:indeterminate) .awsui-style-checkbox-box {
    fill: #7b2ff2;
    stroke: #7b2ff2;
  }
  /* Table selection checkboxes: square, teal */
  .awsui-style-table-selection-cell .awsui-style-checkbox-box {
    rx: 2;
    ry: 2;
    stroke: #0972d3;
  }
  .awsui-style-table-selection-cell .awsui-style-checkbox-control:has(input:checked) .awsui-style-checkbox-box,
  .awsui-style-table-selection-cell .awsui-style-checkbox-control:has(input:indeterminate) .awsui-style-checkbox-box {
    fill: #0972d3;
    stroke: #0972d3;
  }
}
```

This is not achievable with the style prop API, which has no awareness of the component's DOM context.

Demo page: `pages/table/css-style-api.page.tsx`

## Open questions

1. Should the `@layer application, awsui-components;` declaration be shipped in `@cloudscape-design/global-styles/index.css`, or should consumers always declare it themselves?
2. Should we expose `css_style_api` as a runtime export (importable by consumers) or only as documentation? Runtime exports enable tooling (autocomplete, validation) but add to bundle size.
3. How should the CSS Style API interact with Cloudscape's visual refresh modes? Should `data-awsui-style-visual-refresh` be exposed?
4. Should we provide CSS custom properties (e.g. `--awsui-style-button-background`) as an intermediate layer between the style prop and raw CSS class targeting?
