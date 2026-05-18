# 📐 API Proposal: Icon Size Provider

## Context

In late 2025, as part of the Core GA launch, we introduced themeable stroke widths for our iconography. During that work, we also identified an opportunity to improve flexibility around icon sizing.

Since then, we've seen increasing demand from builders—particularly for smaller icon sizes in dense UIs.

This project introduces a mechanism to support customizable icon sizes and stroke widths across Cloudscape and Core components.

## Design Requirements

Since then, we've identified the following design requirements. Builders should be able to:

**1. Customize icon sizes holistically**
Adjust icon sizes across an entire application or within a scoped area (e.g., making all icons smaller across an app or on specific pages).

**2. Customize icon sizes locally**
Override icon sizes in specific parts of the UI while preserving the default sizes elsewhere.

**3. Customize stroke widths alongside sizes**
Override stroke widths per size variant in the same scoped manner, without relying solely on global theming tokens.

---

## Proposed API

### Summary

Extend the existing `IconProvider` component with two new props — `sizes` and `strokeWidths` — that allow overriding icon dimensions and stroke widths at any level of the component tree.

In a nutshell, this proposal enables icon size and stroke-width customization by overriding the inline size and stroke-width of both the icon SVG and its wrapper `<span>` element via the existing `IconProvider`. Because this provider already establishes a predictable scoping mechanism, icon sizes can be flexibly adjusted at different levels of the UI while maintaining consistent behavior.

This approach:
* Leverages the existing provider/context pattern used for icon customization
* Supports scoped overrides (global → local)
* Accepts arbitrary numeric pixel values (not limited to predefined size variants)
* Provides independent control over both size and stroke-width per variant

An additional advantage of this approach is that resizing preserves the icon's vertical (baseline) alignment, ensuring consistent alignment with surrounding text and UI elements and avoiding layout shifts.

**Dev page example:**
https://d21d5uik3ws71m.cloudfront.net/components/latest/dev-pages-react16/index.html#/icon-provider/icon-scale-props

PR for the experiment: https://github.com/cloudscape-design/components/pull/4486

### New Props on `IconProvider`

```typescript
interface IconProviderProps {
  // ... existing props (children, icons) ...

  /**
   * Specifies target pixel sizes for icon size variants. Each key corresponds to a size
   * variant and accepts a number representing pixels (e.g., 12 means 12px). When a size
   * is specified, the icon's inline-size (both the wrapper span and the child SVG) is set
   * to the target pixel value.
   *
   * Only the sizes you specify are overridden — unspecified sizes inherit from the parent
   * provider or fall back to their default token-defined values.
   *
   * @defaultValue undefined (no overrides — icons render at their original sizes)
   */
  sizes?: IconProviderProps.Sizes;

  /**
   * Specifies stroke-width overrides for icon size variants. Each key corresponds to a size
   * variant and accepts a number representing pixels (e.g., 1.5 means 1.5px). When
   * specified, the icon's SVG stroke-width is set directly to this value, bypassing the
   * default token and any automatic compensation from size scaling.
   *
   * Only the sizes you specify are overridden — unspecified sizes inherit from the parent
   * provider or fall back to their default token-defined stroke-widths.
   *
   * @defaultValue undefined (no overrides — icons use their token-defined stroke-widths)
   */
  strokeWidths?: IconProviderProps.StrokeWidths;
}

namespace IconProviderProps {
  interface Sizes {
    /** Target pixel size for icons at "x-small" size (default 12×12). E.g. 10 means 10px. */
    'x-small'?: number;
    /** Target pixel size for icons at "small" size (default 16×16). E.g. 12 means 12px. */
    small?: number;
    /** Target pixel size for icons at "normal" size (default 16×16). E.g. 12 means 12px. */
    normal?: number;
    /** Target pixel size for icons at "medium" size (default 20×20). */
    medium?: number;
    /** Target pixel size for icons at "big" size (default 32×32). */
    big?: number;
    /** Target pixel size for icons at "large" size (default 48×48). */
    large?: number;
  }

  interface StrokeWidths {
    /** Stroke-width for icons at "x-small" size. E.g. 1.5 means 1.5px. */
    'x-small'?: number;
    /** Stroke-width for icons at "small" size. E.g. 1.5 means 1.5px. */
    small?: number;
    /** Stroke-width for icons at "normal" size. E.g. 2 means 2px. */
    normal?: number;
    /** Stroke-width for icons at "medium" size. E.g. 2.5 means 2.5px. */
    medium?: number;
    /** Stroke-width for icons at "big" size. E.g. 3 means 3px. */
    big?: number;
    /** Stroke-width for icons at "large" size. E.g. 4 means 4px. */
    large?: number;
  }
}
```

### Value Format

All values are **numbers representing pixels** (e.g., `12` means 12px, `1.5` means 1.5px).

When a prop is `undefined` (default), icons render at their original token-defined size/stroke-width with no override applied.

### Available Icon Size Variants (Defaults)

| # | Size Variant | Default Size | Default Stroke Width | Notes |
|---|---|---|---|---|
| 1 | `"x-small"` | 12px | 1.5px | Smallest variant |
| 2 | `"small"` | 16px | 2px | Same SVG size as normal but shorter wrapper span |
| 3 | `"normal"` | 16px | 2px | Most common — used by default in components |
| 4 | `"medium"` | 20px | 2px | |
| 5 | `"big"` | 32px | 3px | |
| 6 | `"large"` | 48px | 4px | |
| 7 | `"inherit"` | Contextual | Contextual | Resolves to a concrete size variant based on parent line-height/font-size, then respects that variant's override |

---

## Usage Examples

### 1. Make all icons smaller across an entire app

```tsx
import IconProvider from '@cloudscape-design/components/icon-provider';

function App() {
  return (
    <IconProvider icons={null} sizes={{ normal: 12, medium: 18 }}>
      {/* All "normal"-sized icons now render at 12px wide */}
      {/* All "medium"-sized icons now render at 18px wide */}
      <MyApplication />
    </IconProvider>
  );
}
```

### 2. Make icons smaller only in a specific dense region

```tsx
function DensePanel() {
  return (
    <IconProvider icons={null} sizes={{ normal: 12, inherit: 12 }}>
      {/* Only icons inside this provider are affected */}
      <Table ... />
    </IconProvider>
  );
}
```

The rest of the app continues using default icon sizes.

### 3. Combined with stroke-width overrides

Use the `strokeWidths` prop alongside `sizes` for full control — they work independently:

```tsx
<IconProvider
  icons={null}
  sizes={{ normal: 14, small: 10 }}
  strokeWidths={{ normal: 1.5, small: 1.5 }}
>
  {/* Icons are 14px/10px wide, strokes render at 1.5px visually */}
  <App />
</IconProvider>
```

Alternatively, stroke widths can still be controlled globally via theming tokens:

```tsx
import { applyTheme } from '@cloudscape-design/components/theming';

applyTheme({
  tokens: {
    borderWidthIconSmall: '1.5px',
    borderWidthIconNormal: '1.5px',
    borderWidthIconMedium: '1.5px',
    borderWidthIconBig: '2px',
    borderWidthIconLarge: '3px',
  }
});
```

When both a `strokeWidths` override and a theming token are present, the `strokeWidths` prop takes precedence.

### 4. Nesting providers — scoped overrides

Child providers inherit parent overrides and can selectively override specific sizes:

```tsx
<IconProvider icons={null} sizes={{ normal: 12, big: 22 }}>
  {/* All icons here: normal=12px, big=22px */}
  <DenseRegion />

  <IconProvider icons={null} sizes={{ normal: 16 }}>
    {/* Icons here: normal=16px (reset), big=22px (inherited from parent) */}
    <NormalRegion />
  </IconProvider>
</IconProvider>
```

### 5. Contextual (inherit) icons respect resolved size overrides

Icons using `size="inherit"` (e.g. the external-link icon in `Link`) first resolve to a concrete size variant based on the parent's line-height and font-size. If that resolved variant has an override in the provider, it applies transitively:

```tsx
// The icon inside <h2> resolves contextually to "medium" (20×20 by default).
// With the provider overriding medium to 16px, it renders at 16×16.
<IconProvider icons={null} sizes={{ medium: 16 }}>
  <TextContent>
    <h2><Icon name="settings" size="inherit" /> Heading 2</h2>
  </TextContent>
</IconProvider>
```

There is no direct `inherit` key in the `sizes` or `strokeWidths` maps — contextual icons always resolve to their concrete variant first, then pick up whatever override applies to that variant.

### 6. Override stroke-width independently

Override stroke-width without changing icon size — useful for adjusting visual weight:

```tsx
<IconProvider icons={null} strokeWidths={{ normal: 1.5, small: 1.5 }}>
  {/* Icons remain at default sizes but strokes are thinner */}
  <App />
</IconProvider>
```

---

## How It Works

### Context-Based Override Maps

Two React contexts hold the override state:

1. **`InternalIconSizeOverrideContext`** — maps size variant names to target pixel numbers:

```typescript
type IconSizeOverrideMap = Partial<Record<string, number>>;
// e.g. { normal: 12, small: 10 }
```

2. **`InternalIconStrokeWidthOverrideContext`** — maps size variant names to stroke-width numbers:

```typescript
type IconStrokeWidthOverrideMap = Partial<Record<string, number>>;
// e.g. { normal: 1.5, small: 1.5 }
```

When `IconProvider` renders, it merges the parent context's override maps with any locally-specified props to produce new maps for descendants. This means nested providers compose naturally — a child only overrides what it specifies, inheriting the rest from its parent.

### Resolution in the Icon Component

When `Icon` renders, it checks both context maps for overrides matching its resolved size variant:

**Size resolution:**
* Icons with `size="inherit"` first resolve to a concrete size variant (e.g. "medium", "normal") based on the parent element's line-height and font-size. The resolved variant is then checked for an override.
* For all other sizes, if an override exists for that variant, the override pixel value is applied.
* If no override exists, the icon renders at its default token-defined size.

**Stroke-width resolution:**
* If a `strokeWidths` override exists for the current (resolved) size variant, it is applied directly — bypassing both the token value and any automatic stroke-scale compensation.
* If no `strokeWidths` override exists but a size override is active, automatic stroke-scale compensation is applied (see below).
* If neither override exists, the icon uses its token-defined stroke-width.

### CSS Custom Property: `--icon-size-override`

When a size override is active, the `Icon` component sets `--icon-size-override` as an inline style on the wrapper `<span>` element. The SCSS references this custom property with a fallback to the design token:

```scss
&.size-#{$name} {
  inline-size: var(--icon-size-override, #{$size-token});
  block-size: max(#{$size-token}, var(--icon-size-override, #{$size-token}));

  > svg, > img {
    inline-size: var(--icon-size-override, #{$size-token});
    block-size: max(#{$size-token}, var(--icon-size-override, #{$size-token}));
  }
}
```

This means:
* **With no override**: The custom property is absent, so `var()` falls back to the token value. Behavior is identical to before.
* **With an override**: Both the span and SVG/img get their `inline-size` set to the target pixel value. The `block-size` uses `max()` to ensure it's at least the original token size (preventing vertical collapse when shrinking icons).

### Stroke-Width Compensation: `--icon-stroke-scale`

When only a size override is active (no explicit `strokeWidths` override), the stroke-width must be compensated so the themed value remains visually correct. A CSS custom property `--icon-stroke-scale` is set on the wrapper span:

```typescript
// In Icon component
const strokeScale = baseSizePx / targetSizePx;
// e.g. for normal (16px) overridden to 12px: strokeScale = 16/12 = 1.333
```

The SCSS stroke-width formula incorporates this:

```scss
stroke-width: var(
  --icon-stroke-width-override,
  calc(#{$stroke-token} / #{$scaleFactor} * var(--icon-stroke-scale, 1))
);
```

When no override is active, `--icon-stroke-scale` defaults to `1` and the formula behaves as before. When an override shrinks the icon, the scale factor increases the stroke-width proportionally so it renders at the same visual thickness.

**Example**: If `borderWidthIconNormal` is themed to `1.5px` and `sizes.normal` is set to `12` (down from 16px), the stroke-width compensation ensures the stroke still renders at 1.5px visually, not thinner.

### Explicit Stroke-Width Override: `--icon-stroke-width-override`

When a `strokeWidths` override is active for the current size variant, the `Icon` component computes the final stroke-width value and sets `--icon-stroke-width-override` as an inline style. This takes precedence over the entire `calc()` formula, giving builders direct control over the visual stroke thickness.

The computation accounts for:
1. **Scale factor** — the SVG viewBox is scaled up for larger variants (e.g. 3× for "large"), so the CSS stroke-width must be divided by this factor.
2. **Size compensation** — if a size override is also active, the stroke-width is further adjusted to convert from screen pixels to viewBox units.

```typescript
// In Icon component
const scaleFactor = SCALE_FACTOR[iconSize]; // e.g. 1 for normal, 3 for large
const sizeCompensation = targetSizePx !== undefined ? basePx / targetSizePx : 1;
const strokeWidthOverride = `${(rawStroke / scaleFactor) * sizeCompensation}px`;
```

### Block-Size Behavior

The `block-size` uses `max(original, override)` — it grows if the override is larger than the default but never shrinks below the original token value. This preserves:
* Vertical rhythm in text-adjacent contexts (buttons, status indicators, links)
* Line-height alignment in table cells and form fields
* Padding calculations that depend on `(line-height - icon-size) / 2`

---

## Affected Components

All components that render icons internally will automatically respect the provider because they all use the shared `Icon` component. Key components include:

| # | Component | Icon Usage |
|---|---|---|
| 1 | **Icon** | Direct usage |
| 2 | **Button** | Icon variants, icon-only buttons |
| 3 | **ButtonDropdown** | Caret icon, item icons |
| 4 | **ButtonGroup** | Icon buttons |
| 5 | **StatusIndicator** | Status icons (positive, negative, warning, etc.) |
| 6 | **Alert** | Type icons (info, error, warning, success) |
| 7 | **Flashbar** | Type icons, dismiss icon |
| 8 | **Link** | External-link icon (`size="inherit"`) |
| 9 | **TextFilter** | Search icon |
| 10 | **PropertyFilter** | Search icon, token icons |
| 11 | **Select / Multiselect** | Trigger caret, option icons |
| 12 | **Autosuggest** | Search icon |
| 13 | **SegmentedControl** | Segment icons |
| 14 | **Tabs** | Tab icons, dismiss icons |
| 15 | **SideNavigation** | Expandable group carets |
| 16 | **BreadcrumbGroup** | Separator icons |
| 17 | **AppLayout** | Toolbar trigger buttons |
| 18 | **CopyToClipboard** | Copy icon |
| 19 | **DatePicker** | Calendar icon |
| 20 | **ToggleButton** | Icon states |
| 21 | **Tiles** | Tile images (when using Icon) |

---

## Scope and Limitations

| # | Item | Status |
|---|---|---|
| 1 | **Arbitrary numeric pixel values** | ✅ Supported — any number is accepted (represents pixels) |
| 2 | **Minimum/maximum bounds** | ⚠️ Not enforced in this iteration. Could be added as validation in `IconProvider`. |
| 3 | **Component-internal icons** | ✅ Automatically affected — all go through the shared `Icon` component |
| 4 | **SVG viewBox scaling** | ✅ SVGs use a fixed viewBox (typically `0 0 16 16`) and scale naturally via `inline-size` |
| 5 | **Custom SVG icons (`svg` prop)** | ✅ Respected — custom SVGs are children of the same wrapper span |
| 6 | **URL-based icons (`url` prop)** | ✅ Respected — `<img>` elements get the same `inline-size` override |
| 7 | **RTL mirroring** | ✅ Unaffected — RTL uses `transform: scaleX(-1)` on the span, which composes with `inline-size` without conflict |
| 8 | **Layout adjustments per component** | ⚠️ Some components may need CSS adjustments for vertical alignment when icons change size significantly (e.g. StatusIndicator centering, Alert icon positioning) |
| 9 | **Animation/transition** | ⚠️ Not included — size changes are immediate, no transition support |
| 10 | **Stroke-width override precedence** | ✅ `strokeWidths` prop > theming tokens > automatic compensation |

---

## New Design Tokens

The following public, themeable design tokens were introduced as part of this work:

### Icon Size Tokens

| Token | Default Value | Description |
|---|---|---|
| `sizeIconXSmall` | `12px` | The size of extra small icons (12×12). |

### Icon Stroke-Width Tokens

| Token | Default Value | Description |
|---|---|---|
| `borderWidthIconXSmall` | `1.5px` | The visual stroke width of extra small icons. |
| `borderWidthIconSmall` | `2px` | The visual stroke width of small icons. |
| `borderWidthIconNormal` | `2px` | The visual stroke width of normal icons. |
| `borderWidthIconMedium` | `2px` | The visual stroke width of medium icons. |
| `borderWidthIconBig` | `3px` | The visual stroke width of big icons. |
| `borderWidthIconLarge` | `4px` | The visual stroke width of large icons. |

All stroke-width tokens are public and themeable, meaning builders can customize them via `applyTheme` independently of the `IconProvider` props.

---

## Migration

This is a purely additive API change. No existing behavior changes unless a builder explicitly wraps their tree in an `IconProvider` with `sizes` or `strokeWidths` props.

* **Existing apps**: Continue to work identically with no changes required.
* **Adoption**: Builders opt in by adding `sizes` and/or `strokeWidths` props to their existing `IconProvider` (or wrapping in a new one).
* **Incremental rollout**: Because providers nest and compose, teams can adopt icon size/stroke-width overrides in specific regions without affecting the rest of their app.

---

## Changes from Original Proposal

Summary of changes integrated from API review feedback:

| Change | Rationale |
|---|---|
| Individual `iconSize*` props → single `sizes` object prop | Cleaner API surface, easier to extend (Georgii's feedback) |
| Pixel string values (`"12px"`) → plain numbers (`12`) | Simpler API, extensible to `number \| string` later if needed (Joan/Maximilian/Andrei's feedback) |
| Added `strokeWidths` prop | Enables scoped stroke-width control without global theming (Georgii/Andrei's feedback) |
| Added `x-small` size variant | Completeness — covers all existing icon size variants |
| Removed `inherit` from `sizes`/`strokeWidths` | `inherit` icons resolve contextually to a concrete variant first, then pick up that variant's override transitively (Maximilian/Joan's feedback) |
| Block-size uses `max(original, override)` | Prevents vertical collapse when shrinking; grows when enlarging |
| Added `--icon-stroke-width-override` CSS variable | Enables explicit stroke-width bypass of automatic compensation |
