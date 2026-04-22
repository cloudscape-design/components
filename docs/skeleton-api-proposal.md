# Skeleton component & Table skeleton rows — API proposal

## Context

We have created a new primitive component: **Skeleton**. It renders an animated placeholder block used to indicate that content is loading. It also integrates into the **Table** component via a new `skeletonRows` prop, providing a row-level loading state alternative to the existing spinner-based `loading` property.

### Why a Skeleton component?

Skeleton loading (also known as "content placeholders" or "shimmer UI") is a widely adopted pattern that:

- Reduces perceived loading time by giving users a preview of the page structure before data arrives.
- Avoids layout shift — the skeleton occupies the same space as the eventual content.
- Provides a more polished experience than a single centered spinner, especially for complex layouts.

The Skeleton component is a low-level building block. It can be composed by teams to build skeleton states for any layout — forms, cards, detail pages, dashboards, etc.

### Basic use cases

**Placeholder for a block of content**

A default skeleton with full width and 3em height, suitable for representing a content region:

```jsx
<Skeleton />
```

**Simulating text lines**

Multiple text-variant skeletons stacked to represent a paragraph:

```jsx
<SpaceBetween size="s">
  <Skeleton variant="text" width="100%" />
  <Skeleton variant="text" width="95%" />
  <Skeleton variant="text" width="80%" />
</SpaceBetween>
```

**Avatar / circular placeholder**

A circular skeleton using the style API:

```jsx
<Skeleton height="100px" width="100px" style={{ root: { borderRadius: '50%' } }} />
```

**Table skeleton rows**

Skeleton placeholders rendered directly in table rows, preserving column structure:

```jsx
<Table
  columnDefinitions={columnDefinitions}
  items={[]}
  skeletonRows={5}
  header={<Header>Resources</Header>}
/>
```

### Scope of this document

This document proposes the API for:

1. The standalone **Skeleton** component
2. The **`skeletonRows`** property on the Table component

---

## Proposal

### Part 1: Skeleton component API

```ts
export interface SkeletonProps extends BaseComponentProps {
  /**
   * Specifies the variant of the skeleton.
   * * `default` - The default skeleton appearance with 3em height.
   * * `text` - A text-sized skeleton with height matching line-height-body-m design token.
   */
  variant?: 'default' | 'text';

  /**
   * Specifies the height of the skeleton. Accepts any valid CSS value (e.g. "100px", "3em").
   */
  height?: string;

  /**
   * Specifies the width of the skeleton. Accepts any valid CSS value (e.g. "200px", "100%").
   */
  width?: string;

  /**
   * An object containing CSS properties to customize the skeleton's visual appearance.
   * Refer to the style tab for more details.
   * @awsuiSystem core
   */
  style?: SkeletonProps.Style;

  /**
   * Attributes to add to the native element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLElement>>;
}

export namespace SkeletonProps {
  export interface Style {
    root?: {
      background?: string;
      borderRadius?: string;
    };
  };
}
```

#### Question 1: Why `variant` instead of just `height`?

The `variant` prop provides semantic meaning:

- `default` — a general-purpose block placeholder (3em height). Suitable for images, charts, or content regions.
- `text` — matches `line-height-body-m`, so it aligns perfectly with surrounding text and avoids layout shift when real text loads in.

Teams can still override dimensions with `height` and `width`, but the variant gives sensible defaults without requiring manual measurement.

#### Question 2: Why a `style` API object instead of direct CSS props like `background` and `borderRadius`?

The `style` API follows the pattern established by other Cloudscape components (e.g., theming tokens). It:

- Scopes customization to the `root` element explicitly.
- Is gated behind the `@awsuiSystem core` system tag, so it can be restricted to core system consumers.
- Keeps the top-level prop namespace clean for semantic properties.

#### Question 3: Should `nativeAttributes` be included?

Yes. This follows the pattern of other Cloudscape primitives and allows consumers to attach `data-*` attributes for testing, analytics, or integration purposes. It does **not** support custom styling via this prop.

### Voting checkpoint #1: Skeleton component API

#### I support the proposal so far

Add your name below:

-

#### I have a better idea

Add your name below:

-

---

### Part 2: Table `skeletonRows` prop

The Table component gains a single new property:

```ts
export interface TableProps<T = any> extends BaseComponentProps {
  // ... existing props ...

  /**
   * Renders the specified number of skeleton rows instead of actual data.
   * This provides a loading state alternative to the `loading` property
   * by showing skeleton placeholders in table rows.
   * When set, this takes precedence over the `loading` property.
   */
  skeletonRows?: number;
}
```

#### Behavior

- When `skeletonRows` is set to a positive number, the table renders that many rows where each cell contains a `<Skeleton variant="text" />`.
- The skeleton rows respect the table's column structure: each visible column gets its own skeleton cell with appropriate width/min-width/max-width from `columnDefinitions`.
- Selection column cells are rendered but empty (no checkbox/radio) when `selectionType` is set.
- `skeletonRows` takes precedence over `loading`. If both are set, skeleton rows are shown.
- When `skeletonRows` is set, the `empty` slot is not rendered.
- Skeleton rows work with `stripedRows`, `stickyHeader`, `stickyColumns`, and `resizableColumns`.

#### Use case: Initial page load

```jsx
function ResourceTable() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <Table
      columnDefinitions={columnDefinitions}
      items={items}
      skeletonRows={loading ? 5 : undefined}
      header={
        <Header counter={!loading ? `(${items.length})` : undefined}>
          Resources
        </Header>
      }
    />
  );
}
```

#### Question 4: Why a new prop instead of extending `loading`?

The existing `loading` prop renders a centered spinner with `loadingText`. This is a fundamentally different visual treatment:

- **`loading`** — single spinner, no column structure visible, requires `loadingText` for accessibility.
- **`skeletonRows`** — preserves column layout, shows per-cell placeholders, no text needed (the skeleton is `aria-hidden`).

Making these separate props keeps the API explicit and avoids overloading `loading` with multiple behaviors.

#### Question 5: Should skeleton rows disable selection checkboxes?

Yes. The current implementation renders the selection column cell but without interactive controls. Since there are no real items to select, showing disabled checkboxes would be misleading. The selection column space is preserved to avoid layout shift when data loads.

#### Question 6: Should `skeletonRows` support per-column skeleton customization?

Not in this initial proposal. The current approach uses `<Skeleton variant="text" />` uniformly across all cells, which provides a consistent appearance. Per-column customization (e.g., different widths or shapes per column) could be added later via `columnDefinitions` if there is customer demand.

### Voting checkpoint #2: Table `skeletonRows` prop

#### I support the `skeletonRows` prop

Add your name below:

-

#### I have a better idea

Add your name below:

-

---

### Full Skeleton API (for now)

```ts
export interface SkeletonProps extends BaseComponentProps {
  /**
   * Specifies the variant of the skeleton.
   * * `default` - The default skeleton appearance with 3em height.
   * * `text` - A text-sized skeleton with height matching line-height-body-m design token.
   */
  variant?: 'default' | 'text';

  /**
   * Specifies the height of the skeleton.
   * Accepts any valid CSS value (e.g. "100px", "3em").
   */
  height?: string;

  /**
   * Specifies the width of the skeleton.
   * Accepts any valid CSS value (e.g. "200px", "100%").
   */
  width?: string;

  /**
   * An object containing CSS properties to customize the skeleton's visual appearance.
   */
  style?: SkeletonProps.Style;

  /**
   * Attributes to add to the native element.
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLElement>>;
}

export namespace SkeletonProps {
  export interface Style {
    root?: {
      background?: string;
      borderRadius?: string;
    };
  };
}
```

### Properties exposed to metrics

```ts
// Skeleton
props: {
  variant,
  height,
  width,
},
metadata: {
  hasStyle: !!style,
  hasNativeAttributes: !!nativeAttributes,
}

// Table (additional)
props: {
  skeletonRows,
},
metadata: {
  hasSkeletonRows: skeletonRows !== undefined && skeletonRows > 0,
}
```

### Test utils

#### Skeleton

```ts
export default class SkeletonWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.root;
}
```

The Skeleton test wrapper is intentionally minimal — it is a single `<div>` element with no internal slots. Consumers can use `getElement()` to inspect styles and attributes.

#### Table (existing wrapper, no changes needed)

Skeleton rows are rendered as standard `<tr>` elements with the existing `.row` class. They can be found via the existing `findRows()` method on `TableWrapper`. Each cell within a skeleton row contains a `SkeletonWrapper` that can be located with `findSkeleton()`.

### Voting checkpoint #3: Overall proposal

#### I support this API

Add your name below:

-

#### I have blocking concerns

Add your name below:

-

---

## Design tokens

The Skeleton component uses the following design tokens:

| Token | Purpose |
|---|---|
| `$color-background-skeleton` | Background color of the skeleton block |
| `$color-background-skeleton-wave` | Color of the animated wave overlay |
| `$border-radius-skeleton` | Default border radius |
| `$line-height-body-m` | Height of the `text` variant |

---

## Accessibility

- The skeleton root element has `aria-hidden="true"` — it is a purely decorative placeholder and should not be announced by screen readers.
- In the Table context, skeleton rows do not participate in the table's ARIA grid role (no `aria-rowindex`, no selection announcements).
- When transitioning from skeleton to data, the table's `renderAriaLive` function announces the loaded content as usual.

---

## Open questions for future proposals

- **Skeleton in Cards component** — Should the Cards component support a similar `skeletonCards` prop?
- **Per-column skeleton shapes** — Should `columnDefinitions` support a `skeletonCell` function for custom skeleton rendering per column?
- **Animation control** — Should there be a prop to disable the wave animation (e.g., for reduced-motion preferences beyond the existing CSS `prefers-reduced-motion` support)?
- **Skeleton in other components** — Should Container, ExpandableSection, or other components offer built-in skeleton states?
