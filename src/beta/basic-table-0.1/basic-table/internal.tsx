// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useSingleTabStopNavigation, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../../../internal/base-component';
import DragHandleWrapper from '../../../internal/components/drag-handle-wrapper';
import { getAllFocusables } from '../../../internal/components/focus-lock/utils';
import { fireNonCancelableEvent } from '../../../internal/events';
import { InternalBaseComponentProps } from '../../../internal/hooks/use-base-component';
import { useScrollSync } from '../../../internal/hooks/use-scroll-sync';
import globalVars from '../../../internal/styles/global-vars';
import LiveRegion from '../../../live-region/internal';
import StatusIndicator from '../../../status-indicator/internal';
import { StickyColumnsCellState, useStickyCellStyles } from '../../../table/sticky-columns';
import { StickyScrollbar } from '../../../table/sticky-scrollbar';
import { GridNavigationProvider } from '../../../table/table-role';
import {
  BasicHeaderInertProvider,
  BasicRowContextProvider,
  BasicRowContextValue,
  BasicStickyHeaderProvider,
  BasicTableContextProvider,
  ColumnIndexProvider,
  useBasicRowContext,
  useBasicTableContext,
  useColumnIndexContext,
  useHeaderInert,
  useStickyHeaderBounded,
} from './context';
import { BasicTableProps } from './interfaces';
import { useBasicTable } from './use-basic-table';

import styles from './styles.css.js';

// Maps a context name to its themable class so compact density picks up the compact-table visual
// context.
const getVisualContextClassname = (contextType: string) => `awsui-context-${contextType}`;

// The compound components over the headless `useBasicTable` hook. Columns are a positional width
// config on `Root`; the header and rows are declarative children. Each part self-renders its DOM
// from the hook's prop-getters (read from context) and binds to the Nth column via a positional
// `ColumnIndexContext`, or by an explicit `columnId`. Per-element concerns that need a hook each —
// roving tabindex (`useSingleTabStopNavigation`) and per-cell sticky (`useStickyCellStyles`) — run
// inside Cell / HeaderCell. A virtualizing consumer spreads their own `rowProps`
// (absolute offset + measure ref) onto `Row`.

// Maps the sticky store's per-cell state to this component's sticky style keys.
function stickyClassNames(state: null | StickyColumnsCellState): Record<string, boolean> {
  if (!state) {
    return {};
  }
  return {
    [styles['sticky-cell']]: true,
    [styles['sticky-cell-pad-inline-start']]: state.padInlineStart,
    [styles['sticky-cell-last-inline-start']]: state.lastInsetInlineStart,
    [styles['sticky-cell-last-inline-end']]: state.lastInsetInlineEnd,
  };
}

// Wrap each child of Header / Row in a positional `ColumnIndexProvider` (emits no DOM, so the
// `<th>`/`<td>` stays a direct grid child) so the Nth cell learns its column index without the
// parent probing `child.type`.
function withColumnIndices(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child, index) =>
    child === null || child === undefined ? child : <ColumnIndexProvider value={index}>{child}</ColumnIndexProvider>
  );
}

// Locate the consumer's header among Root's composable children so the sticky-header overlay can
// re-render an inert copy of it. The public part is the `BasicTableHeader` wrapper (which renders
// this file's `Header`); match it by its stable `displayName` rather than importing the wrapper —
// that would cycle (wrapper -> internal -> Root). Same pattern as `src/token` matching an `Icon`
// child. The composable contract places a single BasicTableHeader as a direct child of Root.
function isBasicTableHeaderElement(child: React.ReactNode): child is React.ReactElement {
  return (
    React.isValidElement(child) &&
    typeof child.type !== 'string' &&
    (child.type as { displayName?: string }).displayName === 'BasicTableHeader'
  );
}

// --- Resize handle (element-level focusable) ---------------------------------

function ResizeHandle({ columnIndex, headerId }: { columnIndex: number; headerId: string }): React.ReactElement {
  const ctx = useBasicTableContext('ResizeHandle');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const separatorRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(toggleRef);
  const [isKeyboardDragging, setIsKeyboardDragging] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const currentWidth = ctx.currentColumnWidth(columnIndex);
  const minWidth = ctx.resizeMinWidthOf(columnIndex);
  const handleProps = ctx.getResizeHandleProps(columnIndex);

  const step = (delta: number) => ctx.adjustColumnWidth(columnIndex, delta);
  const enterKeyboardDrag = () => {
    setIsKeyboardDragging(true);
    setShowButtons(true);
  };
  // Focus the separator only after `isKeyboardDragging` commits and clears its `aria-hidden`, so
  // focus never lands inside an aria-hidden subtree.
  useEffect(() => {
    if (isKeyboardDragging) {
      separatorRef.current?.focus();
    }
  }, [isKeyboardDragging]);
  const exitKeyboardDrag = () => {
    setIsKeyboardDragging(false);
    setShowButtons(false);
    toggleRef.current?.focus();
  };
  // In controlled mode the wrapper never auto-dismisses, so the parent owns outside-click dismissal.
  // A pointerdown outside the handle wrapper AND outside the portalled ± buttons hides them (a plain
  // click on non-focusable page area doesn't fire the toggle's blur, so blur alone can't cover it).
  useEffect(() => {
    if (!showButtons) {
      return;
    }
    const onDocPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        !target?.closest?.('[class*="direction-button"]')
      ) {
        setShowButtons(false);
      }
    };
    document.addEventListener('pointerdown', onDocPointerDown, true);
    return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
  }, [showButtons]);

  // The resize handle uses the generic `DragHandleWrapper` (depends on component-toolkit only, not
  // table-coupled) to provide the focus ring, the hover tooltip, and the direction-button
  // keyboard-resize control. Pointer drag stays on the toggle (`handleProps.onPointerDown` → the
  // index-based `startColumnResize`); the sibling role="slider" separator owns Arrow-key drag. The
  // width model is index-keyed via `grid-template-columns` — it does NOT pull the table-DOM-coupled
  // `resizer/resizer-lookup` or the id-keyed `ColumnWidthsProvider`. Direction buttons step ±20px.
  return (
    <span ref={wrapperRef} className={styles['resize-handle-wrapper']}>
      <DragHandleWrapper
        directions={{
          'inline-start': currentWidth > minWidth ? 'active' : 'disabled',
          'inline-end': 'active',
        }}
        triggerMode="controlled"
        controlledShowButtons={showButtons}
        clickDragThreshold={3}
        hideButtonsOnDrag={false}
        tooltipText={ctx.resizerRoleDescription}
        wrapperClassName={styles['resize-handle-drag']}
        onDirectionClick={direction => {
          if (direction === 'inline-start') {
            step(-20);
          } else if (direction === 'inline-end') {
            step(20);
          }
        }}
      >
        <button
          type="button"
          ref={toggleRef}
          {...handleProps}
          className={clsx(styles['resize-handle'], isKeyboardDragging && styles['resize-handle-dragging'])}
          aria-labelledby={headerId}
          tabIndex={tabIndex}
          // Reveal the ± direction buttons on click (the mouse resize affordance), not on focus:
          // Table shows only the focus ring on focus and reveals the buttons on click. Dismiss on
          // blur unless focus moves into the slider separator (the keyboard-drag entry).
          onClick={() => setShowButtons(true)}
          onBlur={event => {
            const next = event.relatedTarget as Element | null;
            if (next !== separatorRef.current && !next?.closest?.('[class*="direction-button"]')) {
              setShowButtons(false);
            }
          }}
          // Suppress grid keyboard-navigation on the handle: Arrow keys must not rove focus to other
          // columns' handles (which would reveal their resize controls). Enter/Space enters the
          // slider drag mode, where the sibling role="slider" separator owns Arrow-key resizing.
          data-awsui-table-suppress-navigation={true}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
              event.preventDefault();
              enterKeyboardDrag();
            }
          }}
        />
        <span
          ref={separatorRef}
          className={styles['resize-separator']}
          role="slider"
          tabIndex={-1}
          data-awsui-table-suppress-navigation={true}
          aria-labelledby={headerId}
          aria-hidden={!isKeyboardDragging}
          aria-valuemin={minWidth}
          aria-valuemax={Number.MAX_SAFE_INTEGER}
          aria-valuenow={currentWidth}
          aria-valuetext={`${currentWidth} pixels`}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              step(-10);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              step(10);
            } else if (event.key === 'Enter' || event.key === 'Escape') {
              event.preventDefault();
              exitKeyboardDrag();
            }
          }}
          onBlur={event => {
            setIsKeyboardDragging(false);
            if (event.relatedTarget !== toggleRef.current) {
              setShowButtons(false);
            }
          }}
        />
      </DragHandleWrapper>
    </span>
  );
}

// --- Header ------------------------------------------------------------------

// Self-renders one column header (`<th>`). Positional by default (its column index comes from the
// `ColumnIndexContext` supplied by `Header`); an explicit `columnId` binds by id. Layers per-cell
// roving tabindex + sticky styles on the hook's static header props. To make a column sortable, set
// `aria-sort` here (spread through `rest`) and render your own sort control in `children`.
export const HeaderCell = ({
  columnId,
  children,
  className,
  style,
  wrapText,
  variant,
  ...rest
}: BasicTableProps.HeaderCellProps): React.ReactElement => {
  const ctx = useBasicTableContext('HeaderCell');
  const inert = useHeaderInert();
  const positional = useColumnIndexContext();
  const columnIndex = ctx.resolveColumnIndex(columnId, positional);
  const stickyId = ctx.stickyColumnId(columnIndex);
  const ref = useRef<HTMLTableCellElement>(null);
  // An inert duplicate must not register a grid-navigation focusable: passing a negative tabIndex
  // makes `navigationActive` false, so `useSingleTabStopNavigation` skips `registerFocusable`
  // entirely (no extra tab stop, no focus-store pollution) and returns tabIndex -1.
  const { tabIndex } = useSingleTabStopNavigation(ref, inert ? { tabIndex: -1 } : undefined);
  const sticky = useStickyCellStyles({
    stickyColumns: ctx.stickyColumns,
    columnId: stickyId,
    getClassName: stickyClassNames,
  });
  const headerId = useUniqueId('basic-table-header-');
  // An inert duplicate does not register with the width/measure model — only the real header owns
  // the authoritative column refs. On the flip to inert the memo changes, so React first calls the
  // old callback with `null` (unregistering) before the no-op takes over.
  const registerRef = useMemo(
    () => (node: HTMLElement | null) => {
      if (!inert) {
        ctx.registerHeaderCell(columnIndex, node);
      }
    },
    [ctx, columnIndex, inert]
  );
  const mergedRef = useMergeRefs(ref, sticky.ref, registerRef);
  const headerProps = ctx.getColumnHeaderProps(columnIndex);
  const isControl = variant === 'selection' || variant === 'disclosure';
  const resizable = !isControl && ctx.resizableColumns && !inert;
  return (
    <th
      {...headerProps}
      {...rest}
      ref={mergedRef}
      id={headerId}
      className={clsx(
        variant === 'selection'
          ? styles['selection-header']
          : variant === 'disclosure'
            ? styles['disclosure-header']
            : styles['header-cell'],
        resizable && styles['header-cell-resizable'],
        wrapText && styles['cell-wrap'],
        sticky.className,
        className
      )}
      style={{ ...sticky.style, ...style }}
      // Inert duplicate is taken out of the roving-tabindex order entirely (forced -1); the real
      // header keeps the hook-driven roving value.
      tabIndex={inert ? -1 : tabIndex === -1 ? undefined : tabIndex}
    >
      {children}
      {resizable && <ResizeHandle columnIndex={columnIndex} headerId={headerId} />}
    </th>
  );
};

// Declarative header rowgroup — renders the HeaderCell children it is GIVEN (positional), never
// auto-generated from config.
export const Header = ({ children }: BasicTableProps.HeaderProps): React.ReactElement => {
  const ctx = useBasicTableContext('Header');
  const inert = useHeaderInert();
  // Bounded internal-scroll mode pins the real rowgroup in place (unbounded uses the out-of-flow
  // overlay instead, where this header is the copy tucked under it — never the sticky one).
  const stickyBounded = useStickyHeaderBounded();
  const groupProps = ctx.getHeaderGroupProps();
  return (
    <thead
      role="rowgroup"
      className={clsx(styles['header-rowgroup'], stickyBounded && !inert && styles['sticky-header'])}
      aria-hidden={inert || undefined}
    >
      <tr {...groupProps} className={styles['header-row']}>
        {withColumnIndices(children)}
      </tr>
    </thead>
  );
};

// --- Body --------------------------------------------------------------------

// Renders the mapped Row children directly (no harvesting) and carries a consumer's own runway
// ref/style spread when windowing.
export const Body = React.forwardRef<HTMLTableSectionElement, BasicTableProps.BodyProps>(function Body(
  { children, className, ...rest },
  ref
) {
  const ctx = useBasicTableContext('Body');
  const bodyProps = ctx.getBodyProps();
  return (
    <tbody {...bodyProps} {...rest} ref={ref} className={clsx(styles.body, className)}>
      {children}
    </tbody>
  );
});

// --- Cell + ExpandedContent --------------------------------------------------

// Self-renders one body cell (`<td>`). Positional by default (column index from
// `ColumnIndexContext` supplied by `Row`); an explicit `columnId` binds by id. Layers per-cell
// roving tabindex + sticky styles on the hook's static cell props; reads its row index from the row
// context.
export const Cell = ({
  columnId,
  children,
  className,
  style,
  wrapText,
  variant,
  ...rest
}: BasicTableProps.CellProps): React.ReactElement => {
  const ctx = useBasicTableContext('Cell');
  const positional = useColumnIndexContext();
  const columnIndex = ctx.resolveColumnIndex(columnId, positional);
  const stickyId = ctx.stickyColumnId(columnIndex);
  const { index, selected: rowSelected, striped: rowStriped } = useBasicRowContext('Cell');
  const ref = useRef<HTMLTableCellElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(ref);
  const sticky = useStickyCellStyles({
    stickyColumns: ctx.stickyColumns,
    columnId: stickyId,
    getClassName: stickyClassNames,
  });
  const mergedRef = useMergeRefs(ref, sticky.ref);
  const cellProps = ctx.getCellProps(columnIndex, index);
  return (
    <td
      {...cellProps}
      {...rest}
      ref={mergedRef}
      className={clsx(
        variant === 'selection'
          ? styles['selection-cell']
          : variant === 'disclosure'
            ? styles['disclosure-cell']
            : styles.cell,
        wrapText && styles['cell-wrap'],
        rowStriped && !rowSelected && styles['cell-shaded'],
        sticky.className,
        className
      )}
      style={{ ...sticky.style, ...style }}
      tabIndex={tabIndex === -1 ? undefined : tabIndex}
    >
      {children}
    </td>
  );
};

// The expanded region is NESTED inside the measured Row (same `<tr>`), on a second grid
// line spanning all columns, so windowing only sees "one taller auto row." It reads `expanded`/`id`
// from its row context and owns the region a11y (region role + label + Escape-to-return-focus). The
// disclosure toggle is placed by the consumer in a Cell with id `${Row.id}-toggle`.
export const ExpandedContent = ({
  label,
  children,
}: BasicTableProps.ExpandedContentProps): React.ReactElement | null => {
  const ctx = useBasicTableContext('ExpandedContent');
  const row = useBasicRowContext('ExpandedContent');
  if (!row.expanded) {
    return null;
  }
  const regionId = row.id ? `${row.id}-region` : undefined;
  return (
    <td
      role={ctx.role === 'table' ? 'cell' : 'gridcell'}
      aria-colindex={1}
      aria-colspan={ctx.columnCount}
      className={styles['expanded-cell']}
      style={{ gridColumn: '1 / -1' }}
    >
      <div
        role="region"
        id={regionId}
        aria-label={label}
        className={styles['expanded-region']}
        data-awsui-table-suppress-navigation="true"
        onKeyDown={event => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            const toggle = row.id ? document.getElementById(`${row.id}-toggle`) : null;
            if (toggle) {
              toggle.focus();
            } else {
              row.onToggleExpand?.();
            }
          }
        }}
      >
        {children}
      </div>
    </td>
  );
};

// --- Row ---------------------------------------------------------------------

// Renders its Cell / ExpandedContent children directly (no harvesting), wrapping each in a
// positional `ColumnIndexProvider`, and provides the row context so those children learn their
// index / expansion. Static grid props come from the hook; a virtual consumer's spread `rowProps`
// (absolute offset + aria-rowindex override + measure ref) wins.
export const Row = React.forwardRef<HTMLTableRowElement, BasicTableProps.RowProps>(function Row(
  { index, id, expanded, onToggleExpand, selected, striped, children, className, style, ...rest },
  ref
) {
  const ctx = useBasicTableContext('Row');
  const rowProps = ctx.getRowProps(index);
  const rowContext = useMemo<BasicRowContextValue>(
    () => ({
      index,
      id,
      expanded,
      selected,
      striped,
      onToggleExpand: onToggleExpand ? () => fireNonCancelableEvent(onToggleExpand) : undefined,
    }),
    [index, id, expanded, selected, striped, onToggleExpand]
  );
  return (
    <BasicRowContextProvider value={rowContext}>
      <tr
        {...rowProps}
        {...rest}
        ref={ref}
        aria-selected={selected}
        className={clsx(styles.row, selected && styles['row-selected'], className)}
        style={{ ...rowProps.style, ...style }}
      >
        {withColumnIndices(children)}
      </tr>
    </BasicRowContextProvider>
  );
});

// --- Root --------------------------------------------------------------------

type InternalRootProps = BasicTableProps & InternalBaseComponentProps;

export function InternalRoot(props: InternalRootProps) {
  const {
    columns,
    role = 'grid',
    resizableColumns = false,
    columnWidths,
    onColumnWidthsChange,
    stickyColumns,
    contentDensity = 'comfortable',
    totalRowCount = 0,
    height,
    maxHeight,
    stickyHeaderVerticalOffset,
    stickyHeader,
    empty,
    loading = false,
    loadingText,
    i18nStrings,
    columnLayout = 'fixed',
    children,
    __internalRootRef,
  } = props;

  // Auto column sizing: when `columnLayout="auto"`, measure each flexible column's content width
  // from the rendered DOM and feed it back to the hook as fixed tracks (each <tr> is its own CSS
  // grid sharing one template, so CSS `auto` tracks can't align across rows — content must be
  // JS-measured, like Table's first-render width read). Fixed-width columns are left untouched.
  const [autoColumnWidths, setAutoColumnWidths] = useState<Record<number, number>>({});

  const table = useBasicTable({
    columns,
    role,
    resizableColumns,
    columnWidths,
    onColumnWidthsChange,
    stickyColumns,
    contentDensity,
    totalRowCount,
    i18nStrings,
    columnLayout,
    autoColumnWidths,
  });

  const columnCount = table.columnCount;
  const showLoading = loading;
  const showEmpty = !loading && totalRowCount === 0;

  const stickyFirst = stickyColumns?.first ?? 0;
  const stickyLast = stickyColumns?.last ?? 0;
  const pageSize = Math.max(1, Math.min(totalRowCount || 1, 100));

  const tableRef = useRef<HTMLTableElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const stickyOverlayRef = useRef<HTMLDivElement>(null);
  const scrollContainerElRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  // P4.5: the synthetic bottom-pinned horizontal scrollbar's own scroll viewport.
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  // P4: whether the sticky-header overlay has pinned (the scroll container has scrolled up past the
  // pinned header block), which drives the stuck shadow.
  const [isHeaderStuck, setIsHeaderStuck] = useState(false);

  // The sticky-header overlay (unbounded mode) renders an aria-hidden, inert copy of the consumer's
  // BasicTableHeader OUTSIDE the horizontally-clipping .body-scroller, so the column header can
  // page-pin (P4) while the real header scrolls with the body inside the scroller. Locate that header
  // among Root's composable children.
  const headerElement = useMemo(() => React.Children.toArray(children).find(isBasicTableHeaderElement), [children]);
  // Body-scroll by default: the table flows at full height and the page / app-layout is the scroll
  // runway (the sticky header pins to the viewport). Setting height/maxHeight opts into a bounded
  // internal scroll viewport instead.
  const bounded = height !== undefined || maxHeight !== undefined;
  // The active horizontal scroll viewport is the outer .scroll-container when bounded (it scrolls
  // both axes) or the inner .body-scroller when unbounded (the page owns vertical scroll, so a wide
  // table needs its own horizontally-clipped scroller — the CSS `overflow-x:auto` / `overflow-y`
  // coupling means a single element cannot be page-scrolled vertically and clipped horizontally at
  // once). The sticky-columns wrapper ref and the scrollability probe therefore attach to whichever
  // element is the active horizontal scroller.
  const scrollContainerRef = useMergeRefs(
    scrollContainerElRef,
    bounded ? table.stickyColumns.refs.wrapper : null,
    bounded ? scrollWrapperRef : null
  );
  const bodyScrollerRef = useMergeRefs(
    bounded ? null : table.stickyColumns.refs.wrapper,
    bounded ? null : scrollWrapperRef
  );
  const mergedTableRef = useMergeRefs(tableRef, table.stickyColumns.refs.table);

  // Unbounded sticky-header overlay is live only when the consumer opted into a sticky header AND
  // there is a header to duplicate (bounded mode pins the in-flow header instead, no overlay).
  const hasStickyOverlay = !!stickyHeader && !bounded && !!headerElement;

  // P4.5: a synthetic bottom-pinned horizontal scrollbar, rendered in unbounded (body-scroll) mode
  // only. In that mode the real horizontal scrollbar lives at the natural bottom edge of the
  // .body-scroller (= the bottom of the table), so on a tall wide table it is scrolled off-screen
  // while the user reads the top rows and there is no way to scroll horizontally from the viewport.
  // The synthetic scrollbar pins to the viewport bottom and reuses the same scroll-sync as the
  // sticky header. It self-hides unless the table overflows horizontally and self-clips unless the
  // real scrollbar is off-screen (both handled inside the reused Table StickyScrollbar component).
  // Bounded mode already exposes a persistent bottom scrollbar on the .scroll-container itself, so
  // no synthetic one is needed there.
  const hasStickyScrollbar = !bounded;

  // P3/P4.5: horizontally scroll-sync the inert sticky-header overlay AND the synthetic bottom
  // scrollbar to the real body scroller. In unbounded mode scrollWrapperRef points at the
  // .body-scroller (the active inline scroll viewport); the shared handler (attached to every synced
  // element's onScroll) mirrors whichever element the user dragged onto the others. The overlay is
  // overflow:hidden (no user scrollbar) so it is a sync target only; the synthetic scrollbar is a
  // genuine user-draggable scroller, so dragging it scrolls the body (and vice versa). Refs that are
  // null (e.g. the overlay when there is no sticky header) are skipped by the hook.
  const handleScrollSync = useScrollSync([scrollWrapperRef, stickyOverlayRef, scrollbarRef]);

  // Horizontal scrollability: expose the scroll viewport as a focusable region (role/tabindex/label)
  // when the table content is wider than the container, so keyboard users can scroll it with arrow
  // keys — mirrors Table's `getTableWrapperRoleProps({ isScrollable })`.
  useEffect(() => {
    const el = scrollWrapperRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }
    const check = () => setIsScrollable(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (tableRef.current) {
      ro.observe(tableRef.current);
    }
    return () => ro.disconnect();
    // `bounded` moves the probe ref (scrollWrapperRef) between .scroll-container and .body-scroller,
    // so re-run to observe the currently-active horizontal scroller.
  }, [bounded]);

  const baseProps = getBaseProps(props);
  const tableProps = table.getTableProps();

  // Measure content widths for `columnLayout="auto"`. Runs after paint (a brief reflow is
  // acceptable and SSR-safe); re-measures when the column config / children change and whenever the
  // table box resizes. Single-column cells only (the full-width expanded / state cells carry
  // `aria-colspan` and are excluded). Converges: a track set to a cell's ceil(scrollWidth) makes the
  // cell fit its content, so the next measurement is stable and the equality guard stops re-renders.
  useEffect(() => {
    if (columnLayout !== 'auto') {
      setAutoColumnWidths(prev => (Object.keys(prev).length === 0 ? prev : {}));
      return;
    }
    const tableNode = tableRef.current;
    if (!tableNode || typeof ResizeObserver === 'undefined') {
      return;
    }
    const measure = () => {
      const next: Record<number, number> = {};
      for (let c = 0; c < columnCount; c++) {
        if (columns[c]?.width !== undefined) {
          continue; // fixed columns keep their configured width
        }
        const cells = tableNode.querySelectorAll<HTMLElement>(`[aria-colindex="${c + 1}"]:not([aria-colspan])`);
        let max = 0;
        cells.forEach(cell => {
          max = Math.max(max, cell.scrollWidth);
        });
        if (max > 0) {
          next[c] = Math.ceil(max);
        }
      }
      setAutoColumnWidths(prev => {
        const keys = Object.keys(next);
        if (keys.length === Object.keys(prev).length && keys.every(k => prev[Number(k)] === next[Number(k)])) {
          return prev;
        }
        return next;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tableNode);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnLayout, columnCount, columns, children]);

  // Publish the sticky-header slot's height as a CSS var on the scroll container so the sticky
  // BasicTableHeader row (`.sticky-header`, a descendant) pins directly beneath the slot instead of
  // overlapping it at inset-block-start:0. Re-measures on slot resize.
  useEffect(() => {
    const el = stickyHeaderRef.current;
    const container = el?.parentElement;
    if (!el || !container) {
      return;
    }
    const apply = () =>
      container.style.setProperty('--awsui-basic-table-sticky-header-offset', `${el.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stickyHeader]);

  // P3: tuck the real header under the inert overlay. The overlay is a duplicate of the header
  // rendered in normal flow immediately above the .body-scroller (a transient double header from
  // P2); pulling the body scroller up by exactly the overlay's height hides the real header behind
  // the (opaque) overlay while the body starts flush beneath it. useLayoutEffect measures before
  // paint (no flash of the double header) and a ResizeObserver keeps the offset synced when the
  // header height changes (wrap, density, resize). Cleared on cleanup so a mode flip (e.g. to
  // bounded, which has no overlay) doesn't leave a stale negative margin.
  useLayoutEffect(() => {
    if (!hasStickyOverlay) {
      return;
    }
    const overlay = stickyOverlayRef.current;
    // In unbounded mode scrollWrapperRef is the .body-scroller (the element carrying the real header
    // + body); that is what gets pulled up under the overlay.
    const scroller = scrollWrapperRef.current;
    if (!overlay || !scroller) {
      return;
    }
    const apply = () => {
      scroller.style.marginBlockStart = `${-overlay.offsetHeight}px`;
    };
    apply();
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        scroller.style.marginBlockStart = '';
      };
    }
    const observer = new ResizeObserver(apply);
    observer.observe(overlay);
    return () => {
      observer.disconnect();
      scroller.style.marginBlockStart = '';
    };
  }, [hasStickyOverlay]);

  // The sticky overlay is an aria-hidden visual duplicate of the consumer's header. Any focusable
  // control a consumer composes into a header cell (e.g. a sort button) is duplicated into it; left
  // as-is that copy would be a keyboard tab stop inside an aria-hidden subtree (the
  // focusable-in-aria-hidden anti-pattern) and a phantom second instance of the control. Force every
  // focusable in the overlay out of the tab order — they stay mouse-clickable (so a composed sort
  // control still fires when the header is stuck and the overlay is the only visible copy) but are
  // removed from keyboard/AT reach; the real in-flow header is the single keyboard/AT-interactive
  // copy. A MutationObserver re-applies across consumer re-renders. This complements the per-cell
  // inert flag (which only neutralizes BasicTable's own header-cell chrome, not consumer children).
  useLayoutEffect(() => {
    if (!hasStickyOverlay) {
      return;
    }
    const overlay = stickyOverlayRef.current;
    if (!overlay) {
      return;
    }
    const neutralize = () => {
      for (const el of getAllFocusables(overlay)) {
        if (el.tabIndex !== -1) {
          el.tabIndex = -1;
        }
      }
    };
    neutralize();
    if (typeof MutationObserver === 'undefined') {
      return;
    }
    // The guard (`tabIndex !== -1`) makes the re-entrant tabindex mutation a no-op, so observing
    // the attribute cannot loop.
    const observer = new MutationObserver(neutralize);
    observer.observe(overlay, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex'],
    });
    return () => observer.disconnect();
  }, [hasStickyOverlay, headerElement]);

  // P4: stuck detection for the position:sticky overlay. Mirrors Container's useStickyHeader — a
  // capture-phase window scroll/resize listener flags "stuck" once the scroll container's top edge
  // has scrolled above the pinned header block, which raises the stuck shadow over the body. The
  // reference is the sticky-header slot (the topmost pinned element: the title band, or a 0-height
  // div when stickyHeader===true) rather than the overlay itself — the slot sits at the container
  // top at rest so containerTop ≈ referenceTop initially (not stuck), whereas the overlay is offset
  // downward by the slot height and would false-positive. Capture phase catches scrolls on any
  // ancestor scroller (page or app-layout main).
  useEffect(() => {
    if (!hasStickyOverlay) {
      setIsHeaderStuck(false);
      return;
    }
    const check = (event?: Event) => {
      // Ignore synthetic window resize events (the window didn't actually resize).
      if (event && event.type === 'resize' && event.target === window && !event.isTrusted) {
        return;
      }
      const container = scrollContainerElRef.current;
      const reference = stickyHeaderRef.current;
      if (!container || !reference) {
        return;
      }
      // Math.round guards against sub-pixel/floating-point jitter at the threshold.
      const containerTop = Math.round(container.getBoundingClientRect().top);
      const referenceTop = Math.round(reference.getBoundingClientRect().top);
      setIsHeaderStuck(containerTop < referenceTop);
    };
    check();
    if (typeof AbortController === 'undefined') {
      return;
    }
    const controller = new AbortController();
    window.addEventListener('scroll', check, { capture: true, signal: controller.signal });
    window.addEventListener('resize', check, { signal: controller.signal });
    return () => controller.abort();
  }, [hasStickyOverlay]);

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      <BasicTableContextProvider value={table}>
        <GridNavigationProvider
          keyboardNavigation={role !== 'table'}
          pageSize={pageSize}
          getTable={() => tableRef.current}
        >
          <div
            ref={scrollContainerRef}
            className={styles['scroll-container']}
            // Bounded → this element is the horizontal scroll viewport, so it owns the focusable
            // scroll-region a11y. Unbounded → that moves to the inner .body-scroller.
            role={bounded && isScrollable ? 'region' : undefined}
            tabIndex={bounded && isScrollable ? 0 : undefined}
            aria-label={bounded && isScrollable ? i18nStrings?.tableLabel : undefined}
            style={
              {
                blockSize: height,
                maxBlockSize: maxHeight,
                // Unbounded → the page/app-layout is the scroll runway; overflow:visible so the sticky
                // slot + thead pin to the page instead of being clipped to an internal scroll box. The
                // horizontal axis is handled by the inner .body-scroller in this mode.
                overflow: bounded ? undefined : 'visible',
                // Sticky top offset consumed by the sticky-header slot + column-header overlay.
                // Bounded (internal scroll box): the local stickyHeaderVerticalOffset only — the
                // page-level app-chrome var must NOT push the header down inside the bounded box
                // (matches Container's computeOffset skipping the global var for inner overflow
                // parents). Unbounded (page/app-layout scroll): fold the global
                // --awsui-sticky-vertical-top-offset (app chrome height, 0 outside an app layout)
                // with the consumer offset so the pinned header seats below the app chrome — this
                // is the in-app-layout header offset fix (P4).
                '--awsui-basic-table-sticky-top-offset': !stickyHeader
                  ? undefined
                  : bounded
                    ? stickyHeaderVerticalOffset !== undefined
                      ? `${stickyHeaderVerticalOffset}px`
                      : undefined
                    : `calc(var(${globalVars.stickyVerticalTopOffset}, 0px) + ${stickyHeaderVerticalOffset ?? 0}px)`,
                // Sticky-columns scroll padding lives on the active horizontal scroller (this element
                // when bounded; the .body-scroller when unbounded).
                ...(bounded ? table.stickyColumns.style.wrapper : undefined),
              } as React.CSSProperties
            }
          >
            {stickyHeader && (
              <div ref={stickyHeaderRef} className={styles['sticky-header-slot']}>
                {stickyHeader}
              </div>
            )}
            {stickyHeader && !bounded && headerElement && (
              // P2: aria-hidden, inert duplicate of the consumer's header rendered OUTSIDE the
              // .body-scroller clipping context. The BasicHeaderInertProvider strips this copy's
              // interactive chrome (no column ref registration, no ResizeHandle, no roving tab stop),
              // leaving only its visual layout.
              // P3: the real header is tucked under this copy via a negative margin-block-start on
              // .body-scroller (= this overlay's height), and the overlay's scrollLeft is synced to
              // the body scroller so its columns track the real header during horizontal scroll.
              // P4 makes the overlay position:sticky so the column header page-pins, chaining the
              // app-chrome offset + stickyHeaderVerticalOffset + slot height; a capture-phase
              // stuck detector toggles the stuck shadow.
              <div
                ref={stickyOverlayRef}
                className={clsx(styles['sticky-header-overlay'], isHeaderStuck && styles['sticky-header-overlay-stuck'])}
                aria-hidden="true"
              >
                <table
                  className={clsx(
                    styles['grid-table'],
                    stickyFirst + stickyLast > 0 && styles['grid-table-sticky'],
                    contentDensity === 'compact' && getVisualContextClassname('compact-table')
                  )}
                >
                  <BasicHeaderInertProvider value={true}>{headerElement}</BasicHeaderInertProvider>
                </table>
              </div>
            )}
            <div
              ref={bodyScrollerRef}
              className={clsx(styles['body-scroller'], bounded && styles['body-scroller-bounded'])}
              // Unbounded → this is the active horizontal scroll viewport (overflow-x:auto), so it
              // owns the focusable scroll-region a11y (keyboard arrow-scroll) when content overflows
              // horizontally. Bounded → the .scroll-container scrolls both axes and owns that role.
              role={!bounded && isScrollable ? 'region' : undefined}
              tabIndex={!bounded && isScrollable ? 0 : undefined}
              aria-label={!bounded && isScrollable ? i18nStrings?.tableLabel : undefined}
              // P3/P4.5: when the sticky-header overlay and/or the synthetic bottom scrollbar are
              // live, drive them from this scroller so the duplicated column header and the synthetic
              // scrollbar thumb stay aligned during horizontal scroll.
              onScroll={hasStickyOverlay || hasStickyScrollbar ? handleScrollSync : undefined}
              style={!bounded ? (table.stickyColumns.style.wrapper as React.CSSProperties) : undefined}
            >
              <table
                {...tableProps}
                ref={mergedTableRef}
                className={clsx(
                  styles['grid-table'],
                  stickyFirst + stickyLast > 0 && styles['grid-table-sticky'],
                  contentDensity === 'compact' && getVisualContextClassname('compact-table')
                )}
              >
                <BasicStickyHeaderProvider value={bounded && !!stickyHeader}>{children}</BasicStickyHeaderProvider>
                {(showLoading || showEmpty) && (
                  <tbody role="rowgroup" className={styles['state-rowgroup']}>
                    <tr role="row" aria-rowindex={totalRowCount + 2} className={styles['state-row']}>
                      <td
                        role={role === 'table' ? 'cell' : 'gridcell'}
                        aria-colindex={1}
                        aria-colspan={Math.max(1, columnCount)}
                        colSpan={Math.max(1, columnCount)}
                        className={styles['state-cell']}
                      >
                        {showLoading ? (
                          <span className={styles.loading}>
                            <StatusIndicator type="loading" wrapText={true}>
                              <LiveRegion tagName="span">{loadingText}</LiveRegion>
                            </StatusIndicator>
                          </span>
                        ) : (
                          <div className={styles.empty}>{empty}</div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
            {hasStickyScrollbar && (
              // P4.5: synthetic bottom-pinned horizontal scrollbar (unbounded mode only). Reuses
              // Table's StickyScrollbar: it is position:sticky at the viewport bottom, width-synced to
              // the .body-scroller and its inner content width-synced to the table's scrollWidth, so
              // its thumb proportion matches the table's overflow. It self-hides unless the table is
              // wider than the scroller (areaIsScrollable) and self-clips unless the real bottom
              // scrollbar is off-screen (IntersectionObserver on a 1px marker at the container bottom).
              // Its onScroll shares the P3 scroll-sync so dragging it scrolls the body + overlay.
              <StickyScrollbar
                ref={scrollbarRef}
                wrapperRef={scrollWrapperRef}
                tableRef={tableRef}
                onScroll={handleScrollSync}
                hasStickyColumns={stickyFirst + stickyLast > 0}
              />
            )}
          </div>
        </GridNavigationProvider>
      </BasicTableContextProvider>
    </div>
  );
}
