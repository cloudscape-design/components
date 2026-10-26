<!-- Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

# VirtualTable usage

VirtualTable is a virtualization-first table for large and streaming datasets. It
renders only the rows in view, so it stays responsive with tens of thousands of
rows and with data that appends over time, such as a live log stream. It's a new,
additive component that coexists with Table — reach for it when the dataset is
large, streaming, or needs rows that expand into content laid out differently from
the columns.

VirtualTable is a compound component. You assemble it from a small set of parts —
`VirtualTable.Root` wraps a `VirtualTable.Header` of `VirtualTable.HeaderCell`s and
a `VirtualTable.Body`. The body takes a row template, a function that returns a
`VirtualTable.Row` of `VirtualTable.Cell`s and an optional
`VirtualTable.ExpandedContent`. Root invokes that template only for the rows in
view and handles windowing, measurement, keyboard interaction, and announcements
for you.

## When to use

- Use VirtualTable when the dataset is large enough that rendering every row hurts
  responsiveness, or when rows arrive continuously and the view needs to keep up.
- Use VirtualTable when rows expand into detail content that doesn't match the
  column layout — for example a key-value record, a raw or formatted log line, or a
  small chart with actions. The expanded content is a first-class part you compose
  into the row, so it's a natural home for arbitrary detail.
- Use the compound shape when you want to own how each row and its expanded content
  are assembled — the parts read like markup and keep complex expanded content next
  to the row it belongs to.
- Use Table for small, static datasets, or when you need built-in selection,
  inline editing, or the standard expandable-rows model that reuses the same
  columns. VirtualTable deliberately keeps a smaller surface and doesn't offer
  those.

## General guidelines

### Do

Structure and columns

- Declare each column once as a header cell, and match its body cell by the same
  column id. The header set is the single source of truth for column order and
  count, so the two always line up.
- Keep the row template a plain function of the row and its row info. Compose the
  cells and the expanded content from those inputs, and don't reach for state or
  effects inside it.
- Set the estimated row height to match your content density so the scrollbar is
  accurate before rows are measured.
- Give one column the room to stretch so the table fills its container, and keep
  the other columns sized to their content.
- Turn on column resizing when users need to see long values, and persist the
  widths users choose so their layout survives a reload.
- Keep the number of columns focused. Move secondary detail into the expanded row
  rather than adding columns users must scroll to reach.

Row expansion

- Add the expanded content part to the row template whenever a row can expand, and
  keep it there unconditionally — Root decides when to mount it. Leaving it out or
  hiding it behind the row's open state disables expansion.
- Use the expanded row for content that reads differently from the columns:
  key-value detail, a raw record, a small visualization, or nested panels.
- Give every expanded region a clear, row-specific accessible name so people
  navigating by region know which row they're reading.
- Let the expanded content size itself. Variable expanded heights are measured and
  windowed for you, so detail panels of different sizes all scroll smoothly.

Large and streaming data

- Append new rows to the end of the dataset for the live-tail case, and compose
  stick-to-bottom following on top of the scroll-anchoring controls so the view
  releases the moment a user scrolls up to read.
- Keep rows at a fixed height when you can — fixed rows skip measurement and stay
  fast at very large sizes. Opt individual rows into measurement only when their
  height truly varies, such as wrapping lines.
- Compute any cross-row scale, such as a shared chart maximum, once over the full
  dataset so it stays stable as the user scrolls. The row info gives you the
  dataset position and size, not the rows currently in view, so derive shared
  values from your own full dataset.

Header and states

- Use a sticky header for long tables so column meaning stays visible while
  scrolling.
- Provide an empty state with a short explanation and, where it helps, a recovery
  action.
- Show the loading state while the first page of data is on its way, and write
  loading text that says what's loading.

Accessibility

- Always supply the accessible names VirtualTable asks for — the table name, the
  expand and collapse control label, and the expanded region name. These names are
  part of the component's accessibility contract; without them the table, its
  controls, and its regions have no accessible name.
- Keep interactive content inside an expanded row reachable by keyboard. VirtualTable
  moves focus into the region and returns it to the row's control when the user
  leaves, and it keeps arrow-key row navigation from interfering with controls
  inside the region.

### Don't

- Don't render the full dataset yourself or hand-write a row per item — the body
  template is called only for the rows in view, and materializing every row defeats
  the purpose.
- Don't put state, effects, or other hooks inside the row template. It runs inside
  the windowed render loop for each visible row; keep hooks in the components the
  template renders.
- Don't reuse the column layout for the expanded row when the detail is genuinely
  different. If the expanded content is just more columns, a standard table
  suits better.
- Don't compute a shared scale, running total, or ranking from the visible rows —
  it will jump as the user scrolls. Compute it over the full dataset.
- Don't assume VirtualTable sorts your data. It reflects sort intent but doesn't
  reorder rows itself, so wire sorting only where it fits your dataset — a
  fast-appending stream is usually left unsorted.
- Don't leave the table, its expand controls, or its expanded regions without
  accessible names.

## Features

### Composition

VirtualTable is assembled from parts rather than configured through one large prop
set. Root owns the grid state and the scroll container; the header cells declare
the columns; the body template describes a single row and its expanded content.
Because the parts nest like the markup they produce, complex rows — especially ones
with rich expanded content — stay readable and live next to the row they belong to.

### Virtualization

VirtualTable renders only the rows near the viewport and recycles their DOM as the
user scrolls, so it handles very large datasets without the cost of a full render.
The body template is invoked only for the rows in view. Rows can be a fixed height
for the fastest path, or opt into measurement when their height varies. Measured
heights are cached and the scroll position is corrected as rows above the viewport
settle, so content doesn't drift under the user.

### Custom row expansion

A row can expand into arbitrary content that isn't bound to the column layout —
key-value detail, a raw or formatted record, a chart, or nested panels. You add it
as the expanded content part of the row template. The expanded region is a
first-class part of the table's structure with its own accessible name and its own
measured height, so panels of different sizes all window correctly. Expansion can
be controlled or left to the component.

### Live tail and streaming

Appending rows to the dataset is the streaming path. VirtualTable reports the
visible range as it changes and exposes controls to pin the view to the newest row
and to check whether it's currently pinned, so you can build stick-to-bottom
following that releases when the user scrolls up. New-row announcements are batched
and summarized so a fast stream doesn't flood assistive technology.

### Columns, sorting, and resizing

Columns are declared once by the header cells and can be resized, with widths
reported so you can persist them. VirtualTable reflects sort state and reports the
user's sort intent, but it doesn't reorder the data itself — you sort the dataset
and pass it back. Compare-style views are a swap to a different set of columns
rather than a separate mode.

## Writing guidelines

Write table content so it scans quickly. Keep it short, consistent, and specific
to the row.

### Table name

- Give the table a short, descriptive name that says what the rows are, such as
  *Log events* or *Query patterns*.
- Use sentence case and no ending punctuation.

### Column headers

- Use nouns or short noun phrases, such as *Timestamp*, *Level*, or *Message*.
- Keep headers to one or two words where you can, and use sentence case.

### Cells

- Keep cell text terse and scannable. Avoid full sentences in a cell.
- Right-align numeric values and keep units consistent down a column.

### Expand and collapse controls

- Write the control label so it names the action and the row it acts on, and
  reflects whether the row is open or closed, such as *Show details for this event*.

### Expanded region name

- Name the region for the row it belongs to, such as *Details for 10:04:22 event*,
  so people who navigate by region know which row they're reading.

### Empty state

- Say why there's nothing to show and what to do next, such as *No log events in
  the selected time range. Widen the range to see more.*

### Loading text

- Say what's loading, such as *Loading log events*. Keep it to a short phrase.

## API reference

The full typed API lives in `interfaces.ts` (`VirtualTableProps<T>` and the
`VirtualTableProps` namespace) and is described in the design document
`deliverables/design/design-F1-A2.md`. VirtualTable is exported as a namespace of
compound parts: `VirtualTable.Root`, `Header`, `HeaderCell`, `Body`, `Row`, `Cell`,
and `ExpandedContent`. In summary:

- Data and identity: `Root` takes `items` and a required `trackBy` — a stable key
  is mandatory because row DOM is recycled.
- Columns: each `HeaderCell` declares a `columnId` and optional `stretch`,
  `sortingField`, `width`, and `minWidth`; body `Cell`s bind to a header by
  `columnId`. The header set is the single column authority.
- Body template: `Body` takes a function `(item, api) => <Row item api>` that Root
  invokes only for windowed rows. The `api` carries `rowIndex`, `totalItemCount`,
  and `isExpanded` — the dataset position and size, not the window slice.
- Row expansion: add `ExpandedContent` (with an `estimatedHeight`, or a rare
  `fixedHeight`) as a child of the row template to enable the leading disclosure
  column and render arbitrary non-tabular detail; expansion state is on `Root` via
  `expandedItems` / `defaultExpandedItems` / `onExpandChange`.
- Virtualization: `estimatedRowHeight`, `getRowHeight` (fixed px or `"auto"` to
  measure a data row so wrapping lines window correctly), `overscan`, and
  `onVisibleRangeChange`.
- Columns, sorting, sizing: `resizableColumns`, `columnWidths` /
  `onColumnWidthsChange`, `columnLayout`, and `sortingColumn` / `sortingDescending`
  / `onSortingChange` (VirtualTable reflects sort state and emits intent; it
  doesn't sort the data).
- Header and states: `Header`'s `sticky`, plus `Root`'s `header`, `empty`,
  `loading` / `loadingText`.
- Accessibility: `ariaLabels` (`tableLabel`, `expandButtonLabel`,
  `expandedRegionLabel`, `appendAnnouncement`, `activateSortLabel`) and `role`.
- Imperative surface: `imperativeRef` exposing `scrollToEnd`, `scrollToItem`, and
  `isPinnedToEnd` for scroll anchoring and live tail.

Some behaviors worth calling out for implementers:

- Row template contract: the body template must be a pure, hook-free function of
  `(item, api)`, must forward both to its `<VirtualTable.Row>`, and must declare
  `<VirtualTable.ExpandedContent>` unconditionally when a row can expand — Root
  decides when to mount it. Gating the expanded content on the row's open state
  disables the disclosure column and expansion.
- Typing the template: because `Body` is its own component, the row `item` type
  doesn't flow automatically from `Root`'s `items` through the namespace. Annotate
  the template parameter (`(item: LogRecord, api) => …`) so the row reads with full
  types.
- Keyboard model: the grid is a single tab stop and arrow keys move an active row
  (row-granular), not a cell cursor. Left and right arrows don't move a cell
  selection. This is a deliberate choice for a virtualized log grid; if you need
  2D cell navigation, Table is the better fit.
- Accessible names: `ariaLabels.tableLabel`, `expandButtonLabel`, and
  `expandedRegionLabel` are required for a complete accessible experience. Omitting
  them leaves the table, its disclosure controls, or its expanded regions without
  an accessible name.

## Examples

Runnable dev pages in `pages/virtual-table/`:

- `simple.page.tsx` — the minimal starting point: a basic compound table.
- `cloudwatch-standard.page.tsx` — the CloudWatch Logs Insights standard view:
  dynamic columns, a stretch-last message column, expanded log-record detail as a
  compound child, and consumer-composed live tail.
- `cloudwatch-raw.page.tsx` — the raw / file view: a single wrapping line column
  with no expanded content, at raw-line density.
- `cloudwatch-patterns.page.tsx` — the "Show patterns" view: per-column sort, a
  compare/diff column swap, a shared histogram scale, and expanded pattern detail.
