<!-- Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

# BasicTable usage

BasicTable is a minimal, composable table you assemble from compound parts. It owns the
windowing-free table concerns — column-track layout and alignment, resizable columns,
sticky header, sticky columns, keyboard grid navigation, custom row-detail expansion,
empty/loading states, density, styling, and the grid accessibility semantics. It renders
the header and rows it is *given* as declarative children: it has no `items` prop and does
not own the data.

Two more capabilities are wired by hand, each opt-in and owned by the consumer:

- **Virtualization** is not built in and ships no export: BasicTable is windowing-free. To window a
  large or streaming dataset, bring your own virtualizer and spread its positioning props onto
  `Body` / `Row` (see *Virtualization (bring your own)* below).
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

Also exported: the props type `BasicTableProps`, `UseBasicTableConfig`, `UseBasicTableResult`,
and `BasicTableGetters`.

## When to use

- Use BasicTable when you want to own how each row and its cells are assembled — the parts
  read like markup, and expanded detail stays next to the row it belongs to.
- Bring your own virtualization when the dataset is large enough that rendering every row hurts
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
  position.

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

## Virtualization (bring your own)

BasicTable is windowing-free and ships no virtualization primitive. To window a large or streaming
dataset, bring your own virtualization: render only the visible slice of `Row`s and spread your
virtualizer's positioning props onto `Body` (the runway height + scroll-container ref) and each
`Row` (absolute offset, an `aria-rowindex` override, and a measure ref for auto-height rows). Keep
the horizontal axis simple by giving windowed `Cell`s a `columnId` and a `grid-column-start` style so
each lands on its real track.

Bound the viewport (a `height` / `maxHeight` on `Root`, or a bounded parent) so the table windows
instead of mounting every row, and set `totalRowCount` on `Root` to the full dataset size so the
grid's `aria-rowcount` and empty detection stay correct even though only a slice is rendered.

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
  set it to the full dataset size, especially when a consumer windows the data so only a slice is
  rendered. The header is row 1, so data rows carry `aria-rowindex` of index + 2.
- Supply the accessible names the component needs: `i18nStrings.tableLabel` for the table,
  `ExpandedContent`'s `label` for each expanded region, and (when resizing)
  `i18nStrings.resizerRoleDescription` for the resize handle.
