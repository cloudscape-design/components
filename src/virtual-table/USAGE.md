<!-- Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

# VirtualTable usage

VirtualTable is a virtualization-first table for large and streaming datasets. It
renders only the rows in view, so it stays responsive with tens of thousands of
rows and with data that appends over time, such as a live log stream. It's a new,
additive component that coexists with Table — reach for it when the dataset is
large, streaming, or needs rows that expand into content laid out differently from
the columns.

VirtualTable is a config-driven component: you describe the columns, the data, and
the optional expanded content, and it handles windowing, measurement, keyboard
interaction, and announcements for you.

## When to use

- Use VirtualTable when the dataset is large enough that rendering every row hurts
  responsiveness, or when rows arrive continuously and the view needs to keep up.
- Use VirtualTable when rows expand into detail content that doesn't match the
  column layout — for example a key-value record, a raw or formatted log line, or a
  small chart with actions.
- Use Table for small, static datasets, or when you need built-in selection,
  inline editing, or the standard expandable-rows model that reuses the same
  columns. VirtualTable deliberately keeps a smaller surface and doesn't offer
  those.

## General guidelines

### Do

Layout and columns

- Set the estimated row height to match your content density so the scrollbar is
  accurate before rows are measured.
- Give one column the room to stretch so the table fills its container, and keep
  the other columns sized to their content.
- Turn on column resizing when users need to see long values, and persist the
  widths users choose so their layout survives a reload.
- Keep the number of columns focused. Move secondary detail into the expanded row
  rather than adding columns users must scroll to reach.

Row expansion

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
  height truly varies.
- Compute any cross-row scale, such as a shared chart maximum, once over the full
  dataset so it stays stable as the user scrolls. Don't derive it from the rows
  currently in view.

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

- Don't render the full dataset yourself or wrap VirtualTable around an
  already-rendered list — it windows the data for you, and pre-rendering defeats
  the purpose.
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

### Virtualization

VirtualTable renders only the rows near the viewport and recycles their DOM as the
user scrolls, so it handles very large datasets without the cost of a full render.
Rows can be a fixed height for the fastest path, or opt into measurement when their
height varies. Measured heights are cached and the scroll position is corrected as
rows above the viewport settle, so content doesn't drift under the user.

### Custom row expansion

A row can expand into arbitrary content that isn't bound to the column layout —
key-value detail, a raw or formatted record, a chart, or nested panels. The
expanded region is a first-class part of the table's structure with its own
accessible name and its own measured height, so panels of different sizes all
window correctly. Expansion can be controlled or left to the component.

### Live tail and streaming

Appending rows to the dataset is the streaming path. VirtualTable reports the
visible range as it changes and exposes controls to pin the view to the newest row
and to check whether it's currently pinned, so you can build stick-to-bottom
following that releases when the user scrolls up. New-row announcements are batched
and summarized so a fast stream doesn't flood assistive technology.

### Columns, sorting, and resizing

Columns are defined once and can be resized, with widths reported so you can
persist them. VirtualTable reflects sort state and reports the user's sort intent,
but it doesn't reorder the data itself — you sort the dataset and pass it back.
Compare-style views are a swap to a different set of columns rather than a separate
mode.

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
`deliverables/design/design-F1-A1.md`. In summary:

- Data and identity: `items`, `columnDefinitions`, and a required `trackBy` — a
  stable key is mandatory because row DOM is recycled.
- Virtualization: `estimatedRowHeight`, `getRowHeight` (fixed px or `"auto"` to
  measure), `overscan`, and `onVisibleRangeChange`.
- Row expansion: `getExpandedContent` (arbitrary non-tabular content, enables the
  leading disclosure column), `expandedItems` / `defaultExpandedItems` /
  `onExpandChange`, and `getExpandedRowHeight`.
- Columns, sorting, sizing: `resizableColumns`, `columnWidths` /
  `onColumnWidthsChange`, `columnLayout`, and `sortingColumn` /
  `sortingDescending` / `onSortingChange` (VirtualTable reflects sort state and
  emits intent; it doesn't sort the data).
- Header and states: `stickyHeader`, `header`, `empty`, `loading` / `loadingText`.
- Accessibility: `ariaLabels` (`tableLabel`, `expandButtonLabel`,
  `expandedRegionLabel`, `appendAnnouncement`, `activateSortLabel`) and `role`.
- Imperative surface: `imperativeRef` exposing `scrollToEnd`, `scrollToItem`, and
  `isPinnedToEnd` for scroll anchoring and live tail.

Two behaviors worth calling out for implementers:

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

- `simple.page.tsx` — the minimal starting point: a basic table.
- `cloudwatch-standard.page.tsx` — the CloudWatch Logs Insights standard view:
  dynamic columns, a stretch-last message column, expanded log-record detail, and
  consumer-composed live tail.
- `cloudwatch-raw.page.tsx` — the raw / file view: a single wrapping line column
  with no expansion, at raw-line density.
- `cloudwatch-patterns.page.tsx` — the "Show patterns" view: per-column sort, a
  compare/diff column swap, a shared histogram scale, and expanded pattern detail.
