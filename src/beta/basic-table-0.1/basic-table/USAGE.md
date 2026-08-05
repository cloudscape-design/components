<!-- Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

# BasicTable usage

BasicTable is a minimal, composable table you assemble from compound parts. It owns the
windowing-free table concerns — column-track layout and alignment, resizable columns,
sticky header, sticky columns, keyboard grid navigation, custom row-detail expansion,
empty/loading states, density, styling, and the grid accessibility semantics. It renders
the header and rows it is *given* as declarative children: it has no `items` prop and does
not own the data.

Two more capabilities ship alongside it, each opt-in and wired by hand:

- **Virtualization** is a separate primitive, `useVirtualization`, not a BasicTable prop. It
  windows a large or streaming dataset over a BasicTable so only the visible rows render.
  `useColumnVirtualization` does the same for the horizontal axis.
- **Sorting** is composed on top by the consumer. The core carries no sort state; the consumer
  owns its sort state, sorts its own data, and marks the sorted column. A ready-made `SortToggle`
  pattern is shown in the composed-sorting demo.

## Layers and exports

The package (default export `BasicTable`, plus named exports) provides three things:

- **Compound components** — `BasicTable.{Root, Header, HeaderCell, Body, Row, Cell,
  ExpandedContent}`. A thin self-rendering layer; each part renders its own DOM using the
  hook's prop-getters. This is what most consumers use.
- **Headless hook** — `useBasicTable`. A positional `columns` config plus table state in, pure
  prop-getters out. Use it directly only to build a table surface the compound parts can't
  render for you.
- **Virtualization primitives** — `useVirtualization` and `useColumnVirtualization`. Standalone
  count-based windowing hooks the consumer spreads onto a BasicTable.

Also exported: the props type `BasicTableProps`, `UseBasicTableConfig`, `UseBasicTableResult`,
`BasicTableGetters`, and the virtualization config/result types.

## When to use

- Use BasicTable when you want to own how each row and its cells are assembled — the parts
  read like markup, and expanded detail stays next to the row it belongs to.
- Add `useVirtualization` when the dataset is large enough that rendering every row hurts
  responsiveness, or when rows arrive continuously (a live log stream) and the view must keep
  up. BasicTable itself renders exactly the rows you pass it.
- Use the built-in row expansion when a row expands into detail that doesn't match the column
  layout — a key-value record, a raw or formatted log line, or a small chart.
- Use Cloudscape `Table` for small static datasets or when you need built-in selection, inline
  editing, or the standard expandable-rows model that reuses the same columns. BasicTable keeps a
  smaller surface and does not offer those.

## Composing the parts

`Root` takes the `columns` config and wraps a declarative `Header` (of `HeaderCell`s) and a
`Body` (of `Row`s, each holding `Cell`s and an optional `ExpandedContent`). Cells bind to columns
**by position** by default — the Nth `HeaderCell` / `Cell` maps to the Nth `columns` entry.

```tsx
<BasicTable.Root columns={[{ minWidth: 120 }, { minWidth: 200 }]} totalRowCount={rows.length}>
  <BasicTable.Header>
    <BasicTable.HeaderCell>Name</BasicTable.HeaderCell>
    <BasicTable.HeaderCell>Description</BasicTable.HeaderCell>
  </BasicTable.Header>
  <BasicTable.Body>
    {rows.map((row, index) => (
      <BasicTable.Row key={row.id} index={index}>
        <BasicTable.Cell>{row.name}</BasicTable.Cell>
        <BasicTable.Cell>{row.description}</BasicTable.Cell>
      </BasicTable.Row>
    ))}
  </BasicTable.Body>
</BasicTable.Root>
```

`Header` and `Body` render the children they are given — there is no function-child template and
no config harvested from the JSX.

## Columns

`columns` is a positional width list; each entry is `{ width?, minWidth?, id? }` in column order.

- A **flexible** column omits `width` and gets `minmax(minWidth, 1fr)`, sharing the remaining
  space. A **fixed** column sets `width`.
- `minWidth` is the `minmax` floor for a flexible column and the floor a resize cannot drop below.
- `id` is optional. Supply it only to bind a `HeaderCell` / `Cell` by `columnId` instead of by
  position, or when `useColumnVirtualization` targets the column.

The `columns` list is the single source of column *width* authority; the header cells are the
source of column *order and count*.

### Resizing

Set `resizableColumns` on `Root` to render resize handles. Widths are keyed by column **index**;
read `onColumnWidthsChange` and pass `columnWidths` back to control and persist them. A column
cannot resize below its `minWidth` (or the default floor of 120px). The handle supports pointer
drag and a keyboard-drag mode (Enter/Space to enter, arrows to resize, Enter/Escape to exit).

### Sticky columns

`stickyColumns={{ first, last }}` pins that many leading / trailing columns during horizontal
scroll.

## Sorting

Sorting is composed, not built in, and ships no package export. Place a sort trigger inside a
`HeaderCell`, keep your own sort state, sort your own data, and set `aria-sort` on the `HeaderCell`.
The composed-sorting demo provides a ready-made `SortToggle` you can copy:

```tsx
<BasicTable.HeaderCell aria-sort={getAriaSort(sortState)}>
  <SortToggle state={sortState} onToggle={toggleSort} ariaLabel="Sort by Name">
    Name
  </SortToggle>
</BasicTable.HeaderCell>
```

The demo's `SortToggleState` is `'none' | 'ascending' | 'descending'`. The toggle renders the label
and a directional caret and participates in roving-tabindex keyboard navigation.

## Row expansion

A row can expand into arbitrary non-tabular content. Nest a `BasicTable.ExpandedContent` inside the
`Row`; it renders a labeled region spanning all columns, and only when the row is expanded.

- Expansion is consumer-controlled per row: set `expanded` on the `Row` and update it from
  `onToggleExpand`.
- Give the `Row` a stable `id`. Place the disclosure toggle in a `Cell` with id `${row.id}-toggle`;
  pressing Escape inside the expanded region returns focus to that toggle (or calls
  `onToggleExpand` if it isn't found).
- Give `ExpandedContent` a `label` so screen-reader users navigating by region know which row they
  are reading.

## Virtualization

`useVirtualization` windows a dataset over a BasicTable. It knows nothing about data, columns, or
expansion — it takes a row `count` and a height strategy and returns positioning props to spread:

```tsx
const v = useVirtualization({ count: items.length, estimatedRowHeight: 40 });

<BasicTable.Root columns={columns} totalRowCount={items.length} maxHeight={480}>
  <BasicTable.Header>{/* header cells */}</BasicTable.Header>
  <BasicTable.Body {...v.runwayProps}>
    {v.window.map(({ index, offset }) => (
      <BasicTable.Row key={items[index].id} index={index} {...v.rowProps(index, offset)}>
        {/* cells */}
      </BasicTable.Row>
    ))}
  </BasicTable.Body>
</BasicTable.Root>
```

Config (`VirtualizationConfig`):

- `count` — total row count of the full dataset.
- `estimatedRowHeight` — runway height per row before measurement.
- `getRowHeight?(index)` — return a fixed px height, or `'auto'` to measure the row (wrapping
  lines, or a row expanded into nested content). Omit for uniform fixed rows (the fast path, no row
  is observed). Keep the reference stable.
- `overscan?` — rows rendered beyond the visible range on each side (default 10).
- `getExpandedRowHeight?(index)` — a pre-measurement runway seed for an `'auto'` row so the runway
  does not jump on first entry.
- `onVisibleRangeChange?` — fires when the windowed index range changes.

Result (`VirtualizationResult`):

- `window` — the `[{ index, offset }]` slice to iterate (visible range plus overscan), *not* the
  whole dataset.
- `runwayProps` — spread onto `Body`; sizes the runway to the full virtual height and provides the
  ref used to locate the scroll viewport.
- `rowProps(index, offset)` — spread onto each windowed `Row`; sets absolute offset positioning,
  the `aria-rowindex` override, and a measure ref for `'auto'` rows. Fixed rows are clamped to their
  model height; `'auto'` rows are left unbounded so they measure their real height.
- `scrollToIndex(index)` — scroll a row into view; releases the live-tail pin.
- `scrollToEnd()` — pin the viewport to the last row (compose stick-to-bottom live tail on top).
- `isPinnedToEnd()` — true when the viewport is pinned to the last row.
- `visibleRange` — the current `{ firstIndex, lastIndex }`.

Bound the viewport (a `height` / `maxHeight` on `Root`, or a bounded parent) so the table windows
instead of mounting every row. Set `totalRowCount` on `Root` to the full dataset size so the grid's
`aria-rowcount` and empty detection are correct even though only a slice is rendered.

### Column virtualization

`useColumnVirtualization` windows the horizontal axis. It only makes sense when every column has a
fixed px width (deterministic offsets); flexible (`1fr`) columns should not use it.

Config (`ColumnVirtualizationConfig`): `widths` (fixed px widths in column order), `leadingOffset?`
(width of any leading track before the first column, default 0), `overscan?` (default 3),
`pinnedFirst?` / `pinnedLast?` (leading/trailing columns always rendered, default 0).

Result (`ColumnVirtualizationResult`): `visibleColumns` (the `Set<number>` of column indices to
render this frame), `ref` (attach to the horizontal scroll container), and `trackStart(columnIndex)`
(the absolute grid line the column starts at, spread as `grid-column-start` so a windowed cell lands
on its real track). Render only the cells whose index is in `visibleColumns` and give each a
`columnId` (from its `columns` entry) so it binds to the right column.

## The headless hook

`useBasicTable(config)` is the behaviour implementation the compound parts call. Reach for it
directly only when the parts can't render your surface. Its config mirrors `Root`'s headless
subset: `columns`, `role`, `resizableColumns`, `columnWidths` / `onColumnWidthsChange`,
`stickyColumns`, `contentDensity`, `totalRowCount`, and `i18nStrings`.

It returns pure, index-based prop-getters to spread onto your own DOM — `getTableProps`,
`getHeaderGroupProps`, `getColumnHeaderProps`, `getResizeHandleProps`, `getBodyProps`,
`getRowProps`, `getCellProps` — plus `gridTemplateColumns`, `columnCount`, the sticky-columns model,
and the resize helpers. The getters never call React hooks (a consumer may call them in a loop or
conditionally), so element-level concerns that need a hook per element — roving tabindex and
per-cell sticky offsets — are applied by the parts themselves, not returned by the getters.

## Root reference

Beyond the shared config above, `BasicTable.Root` adds the presentational shell:

- `children` — a declarative `Header` plus a `Body`.
- `columnLayout` — `'fixed'` (default) or `'auto'`.
- `height` / `maxHeight` — px bounds for the scroll viewport.
- `header` — a slot above the grid (title, counter, actions).
- `empty` — rendered when `totalRowCount` is 0.
- `loading` / `loadingText` — loading state for the whole grid.

## Accessibility

- BasicTable owns the grid accessibility semantics: the row and column counts and indices, the
  disclosure column, the expanded-region wiring, focus management, and keyboard behavior. When you
  build on the parts (or the headless hook), spread its props rather than re-authoring ARIA.
- Keyboard model: `role="grid"` (the default) gives cell-by-cell roving-tabindex navigation; the
  grid is a single tab stop. Use `role="table"` for static, non-interactive data.
- `totalRowCount` on `Root` is authoritative for the grid's `aria-rowcount` and empty detection —
  set it to the full dataset size, especially under virtualization where only a slice is rendered.
  The header is row 1, so data rows carry `aria-rowindex` of index + 2.
- Supply the accessible names the component needs: `i18nStrings.tableLabel` for the table,
  `ExpandedContent`'s `label` for each expanded region, and (when resizing)
  `i18nStrings.resizerRoleDescription` for the resize handle.
