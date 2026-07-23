<!--
 Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 SPDX-License-Identifier: Apache-2.0
-->

# MasterDetailLayout (experimental, internal — WIP v0)

`MasterDetailLayout` is a first-cut, **internal** layout helper for the
**Master/Detail** pattern: a list/master pane (typically a `Table` or `Cards`
collection) sits alongside a detail pane that reflects the currently selected
item. Selecting an item updates the detail view. On narrow container widths the
layout collapses to a single column.

> **Status:** WIP v0. This lives under `src/internal/components` and is **not**
> part of the public API. It is intentionally additive and opt-in so we can
> iterate on the pattern before committing to a public surface.

## Why a composition helper (and not a full component yet)

The Master/Detail pattern is fundamentally a *composition* of existing
Cloudscape primitives (`AppLayout`, `Table`/`Cards`, `KeyValuePairs`, etc.).
The only reusable, non-trivial piece is the two-column layout + responsive
collapse, which this helper owns. Concrete master and detail content stay with
the consumer. See `pages/master-detail/simple.page.tsx` for a worked example.

## API (v0)

| Prop | Type | Description |
| --- | --- | --- |
| `master` | `React.ReactNode` | The list/master pane (e.g. a `Table`). |
| `detail` | `React.ReactNode` | Detail content for the selected item. |
| `hasSelection` | `boolean` | Whether an item is selected. Drives the narrow-view switch. |
| `detailPlaceholder` | `React.ReactNode` | Empty state shown in the detail pane when nothing is selected. |
| `onClearSelection` | `() => void` | If provided, renders a "back to list" control in the narrow layout. |
| `masterAriaLabel` / `detailAriaLabel` | `string` | Accessible labels for the two regions. |
| `backLabel` | `string` | Label for the back control. Defaults to `"Back"`. |
| `narrowBreakpoint` | `number` | Container width (px) below which it collapses. Defaults to `688`. |

The pure `resolveMasterDetailView({ isNarrow, hasSelection, canClearSelection })`
helper is exported for testing and reuse.

## Responsive behavior

- **Wide** container: master and detail render side by side.
- **Narrow** container: a single pane renders — the detail pane when an item is
  selected (with an optional back control), otherwise the master pane.

Width is observed with `useContainerQuery` from `@cloudscape-design/component-toolkit`.

## Known limitations / follow-ups (out of scope for v0)

- No keyboard focus management when switching panes on narrow widths.
- No URL/deep-link syncing of the selected item.
- Detail pane is inline; a `SplitPanel`/drawer-based variant is not yet offered.
- No public API, i18n messages, test-utils wrapper, or documenter definitions.
- No visual-regression / integration (`__integ__`) coverage yet.
- Column ratio and minimum widths are fixed; not yet configurable.
