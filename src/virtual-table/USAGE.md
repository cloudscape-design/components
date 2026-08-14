<!-- Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

# VirtualTable usage

VirtualTable is a virtualization-first table built for high-density log and
streaming data. It renders only the rows in view, so it stays responsive with tens
of thousands of rows and with data that appends continuously, such as a live log
stream. It's a new, additive component that coexists with Table — reach for it when
the data is a large or streaming log-style feed, when rows need to expand into
content laid out differently from the columns, or when you need live tail and
in-place filtering as first-class behavior.

VirtualTable is a config-driven, opinionated component: you pick a built-in view
and describe its columns or line renderer, supply the data and an optional expanded
content slot, and it handles windowing, measurement, live tail, filtering,
keyboard interaction, and announcements for you. It ships three built-in surfaces
rather than being a raw grid, so the common log tables come out of the box while
you keep control of policy through a small set of hooks.

## When to use

- Use VirtualTable when the data is a large or continuously appending feed and the
  view needs to keep up without the cost of rendering every row.
- Use VirtualTable when rows expand into detail that doesn't match the column
  layout — a key-value record, a raw or formatted line, or a small chart with
  actions.
- Use VirtualTable when you need live tail, in-place filtering with match
  navigation, or a raw line view as built-in behavior rather than something you
  assemble yourself.
- Use Table for small, static datasets, or when you need built-in selection,
  inline editing, or the standard expandable-rows model that reuses the same
  columns. VirtualTable deliberately keeps a smaller, opinionated surface and
  doesn't offer those.

## The view model

VirtualTable is organized around a single view configuration that both selects the
built-in surface and supplies that surface's columns or renderer:

- The results view is the primary grid: dynamic columns, a leading disclosure
  column when rows expand, a fixed layout with one stretch column, and
  keyboard-operable column resizing with persisted widths.
- The aggregation view is a second grid with its own columns, per-column sort, an
  optional compare mode, and a shared chart scale you compute once over the whole
  dataset and supply, kept stable as the user scrolls.
- The raw view is a single monospaced line per row, with no columns and no
  expansion, at raw-line density.

Keep the three configurations side by side and swap which one is active from your
own tab or segmented control. VirtualTable owns each view's grid, virtualization,
accessibility, and expansion; you own the control that switches between them. Hold
one configuration object per view so switching views is a swap, not a reshape of
props.

## Who owns what

VirtualTable packages live tail and filtering as built-in features, and it draws a
clear line between mechanism and policy. The component owns the mechanics and the
accessibility contract; you own the policy:

- For live tail, you own whether following is on; the component owns pinning to the
  newest row, releasing when the user scrolls up, and the batched, polite
  announcement of new rows.
- For filtering, you own the predicate and the highlight decision; the component
  owns the match-indicator column, the total-and-filtered counts, keyboard
  match navigation, and conveying a match without relying on color alone.

This keeps the common behavior consistent and accessible across consoles while
leaving the decisions that vary to you.

## General guidelines

### Do

Views and columns

- Match the estimated row height to your content density so the scrollbar is
  accurate before rows are measured.
- Give one column the room to stretch so the grid fills its container, and size the
  other columns to their content.
- Turn on column resizing when users need to read long values, and persist the
  widths they choose so the layout survives a reload.
- Keep the column set focused. Move secondary detail into the expanded row rather
  than adding columns users must scroll to reach.

Row expansion

- Use the expanded row for content that reads differently from the columns: a
  key-value record, a raw line, a small chart, or nested panels.
- Start from a built-in expanded layout when it fits, and supply your own content
  when it doesn't — your content takes over for that row.
- Give every expanded region a clear, row-specific accessible name so people
  navigating by region know which row they're reading.
- Let the expanded content size itself. Variable expanded heights are measured and
  windowed for you, so detail of different sizes all scroll smoothly.

Live tail and streaming

- Append new rows to the end of the dataset. Turn following on to pin the view to
  the newest row; the view releases on its own the moment a user scrolls up to
  read, and re-engaging snaps back to newest.
- Keep the appended data flowing independently of whether following is on, so
  releasing follow leaves earlier rows in place to read while new rows keep
  arriving.
- Keep rows at a fixed height when you can — fixed rows skip measurement and stay
  fast at very large sizes. Opt individual rows into measurement only when their
  height truly varies.

Filtering

- Choose in-place marking when users need surrounding context and a sense of how
  many rows matched, and choose the reduced subset when they only want the matches.
- Convey a match with text or an icon in addition to any highlight color, and give
  the match-navigation controls clear accessible names.
- Compute any cross-row scale, such as a shared chart maximum, once over the full
  dataset so it stays stable as the user scrolls. Don't derive it from the rows
  currently in view.

Header and states

- Use a sticky header for long grids so column meaning stays visible while
  scrolling.
- Provide an empty state with a short explanation and, where it helps, a recovery
  action.
- Show the loading state while the first page of data is on its way, and write
  loading text that says what's loading.

Accessibility

- Always supply the accessible names VirtualTable asks for — the grid name, the
  expand and collapse control labels, the follow toggle label, the expanded region
  name, and the match-navigation labels when filtering in place. These names are
  part of the component's accessibility contract; without them the grid, its
  controls, and its regions have no accessible name.
- Keep interactive content inside an expanded row reachable by keyboard.
  VirtualTable moves focus into the region and returns it to the row's control when
  the user leaves, and it keeps arrow-key row navigation from interfering with
  controls inside the region.

### Don't

- Don't render the full dataset yourself or wrap VirtualTable around an
  already-rendered list — it windows the data for you, and pre-rendering defeats
  the purpose.
- Don't reuse the column layout for the expanded row when the detail is genuinely
  different. If the expanded content is just more columns, a standard table suits
  better.
- Don't compute a shared scale, running total, or count from the visible rows — it
  will jump as the user scrolls. Compute it over the full dataset.
- Don't rely on color alone to show which rows match a filter; pair it with text or
  an icon so the match is conveyed without sight of the highlight.
- Don't couple your data feed to whether following is on. Stopping follow should
  hold the view still, not stop new rows from arriving.
- Don't assume VirtualTable sorts your data. It reflects sort intent but doesn't
  reorder rows itself, so wire sorting only where it fits your data — a
  fast-appending feed is usually left unsorted.
- Don't leave the grid, its expand controls, its follow toggle, its expanded
  regions, or its match-navigation controls without accessible names.

## Features

### Virtualization

VirtualTable renders only the rows near the viewport and recycles their DOM as the
user scrolls, so it handles very large datasets without the cost of a full render.
Rows can be a fixed height for the fastest path, or opt into measurement when their
height varies. Measured heights are cached and the scroll position is corrected as
rows above the viewport settle, so content doesn't drift under the user.

### Custom row expansion

A row can expand into arbitrary content that isn't bound to the column layout —
key-value detail, a raw or formatted record, a chart, or nested panels. Built-in
expanded layouts cover the common log-record and pattern-detail shapes as a
starting point, and any custom content you supply takes over for that row, so the
built-ins are defaults rather than a closed set. The expanded region is a
first-class part of the grid's structure with its own accessible name and its own
measured height, so panels of different sizes all window correctly. Expansion can
be controlled or left to the component.

### Live tail

Appending rows to the dataset is the streaming path, and following is built in.
When following is on, the view pins to the newest row as data arrives; when the
user scrolls up to read, the view releases following and reports the change so your
control can reflect it. New-row announcements are batched and summarized so a fast
feed doesn't flood assistive technology, and the auto-scroll is immediate rather
than animated so it stays comfortable for motion-sensitive users.

### Two-mode filtering

Filtering is a built-in feature with two modes. In-place marking keeps every row
visible, flags the matches, and adds a match-indicator column and a total-and-
filtered count so users keep their context. The reduced subset shows only matching
rows. Either way you supply the predicate, and the component provides
keyboard-operable next- and previous-match navigation and conveys each match
without relying on color alone.

### Columns, sorting, and comparison

Columns are defined per view and can be resized, with widths reported so you can
persist them. In the aggregation view, columns can be sorted — VirtualTable
reflects the sort state and reports the user's sort intent, but it doesn't reorder
the data itself, so you sort the dataset and pass it back. Compare-style views are
a swap to a different set of columns rather than a separate mode.

## Writing guidelines

Write grid content so it scans quickly. Keep it short, consistent, and specific to
the row.

### Grid name

- Give the grid a short, descriptive name that says what the rows are, such as
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

### Follow toggle

- Name the toggle for the action, such as *Follow new events*, and keep the label
  stable whether or not following is on.

### Expanded region name

- Name the region for the row it belongs to, such as *Details for 10:04:22 event*,
  so people who navigate by region know which row they're reading.

### Match navigation

- Name the match-navigation group and its controls plainly, such as *Filter
  matches*, *Previous match*, and *Next match*.

### Empty state

- Say why there's nothing to show and what to do next, such as *No log events in
  the selected time range. Widen the range to see more.*

### Loading text

- Say what's loading, such as *Loading log events*. Keep it to a short phrase.

## API reference

The full typed API lives in `interfaces.ts` (`VirtualTableProps<T>` and the
`VirtualTableProps` namespace) and is described in the design document
`deliverables/design/design-F2-A1.md`. In summary:

- Data and identity: `items`, a required `trackBy` — a stable key is mandatory
  because row DOM is recycled — and `viewConfig`.
- View configuration: `viewConfig` is one object whose `type` discriminant
  (`"standard"`, `"patterns"`, or `"raw"`) selects the built-in surface and
  supplies that view's `columnDefinitions` (or `renderLine` for raw, and
  `histogramPeak` / `diffMode` for patterns).
- Virtualization: `height` / `maxHeight` (bound the scroll viewport — required for
  windowing), `estimatedRowHeight`, `getRowHeight` (fixed px or `"auto"` to
  measure), `overscan`, and `onVisibleRangeChange`.
- Live tail: `follow` / `onFollowChange` (controlled follow state) and
  `renderAppendAnnouncement` for the batched new-row announcement.
- Row expansion: `getExpandedContent` (arbitrary non-tabular content, enables the
  leading disclosure column), `expandedContentPreset` (a built-in layout used as
  the default under the slot), `getExpandedRowHeight`, `expandedItems` /
  `defaultExpandedItems` / `onExpandChange`.
- Filtering: `filter` — a `mode` (`"subset"` or `"mark-in-place"`), a `predicate`,
  and an optional per-cell `highlight`.
- Columns, sorting, sizing: `sortingColumn` / `sortingDescending` /
  `onSortingChange` (VirtualTable reflects sort state and emits intent; it doesn't
  sort the data), `columnWidths` (static per-column px widths), and `stickyHeader`.
- State and labels: `empty`, `loading` / `loadingText`, `ariaLabels`, and
  `i18nStrings`.
- Imperative surface: `imperativeRef` exposing `scrollToEnd`, `scrollToItem`,
  `revealItem`, and `isPinnedToEnd` for scroll anchoring, live tail, and revealing
  a specific row.

Three behaviors worth calling out for implementers:

- Keyboard model: the grid is a single tab stop and arrow keys move an active row
  (row-granular), not a cell cursor. Left and right arrows don't move a cell
  selection. This is a deliberate choice for a virtualized log grid; if you need
  2D cell navigation, Table is the better fit.
- Accessible names: the labels in `ariaLabels` and `i18nStrings` — the grid name,
  the expand and collapse labels, the follow toggle label, the expanded region
  name, and the match-navigation labels — are required for a complete accessible
  experience. Omitting them leaves those elements without an accessible name.
- Reveal and filtering: `revealItem` expands, highlights, and scrolls a row into
  view when it's present. If a reduced-subset filter currently hides that row,
  reveal does nothing for it — clear or widen the filter first, because
  VirtualTable won't silently drop a filter you own.

## Examples

Runnable dev pages in `pages/virtual-table/`:

- `simple.page.tsx` — the minimal starting point: the standard results view with a
  few columns and expanded log-record detail.
- `cloudwatch-standard.page.tsx` — the CloudWatch Logs Insights standard view:
  dynamic columns, a stretch-last message column, expanded log-record detail,
  built-in live tail, and both filter modes.
- `cloudwatch-raw.page.tsx` — the raw view: a single wrapping line per row with no
  expansion, at raw-line density.
- `cloudwatch-patterns.page.tsx` — the "Show patterns" view: per-column sort, a
  compare/diff column swap, a shared histogram scale supplied over the full
  dataset, and expanded pattern detail.
