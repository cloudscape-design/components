// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import {
  DerivedColumn,
  RowPosition,
  useVirtualTableContext,
  VirtualTableContextProvider,
  VirtualTableContextValue,
} from './context';
import { VirtualTableProps } from './interfaces';
import { useExpansion } from './use-expansion';
import { useLiveAnnouncement } from './use-live-announcement';
import { useVirtualModel } from './use-virtual-model';

import styles from './styles.css.js';

// impl-F1-A2-core: the compound windowing core. Root owns the single scroll container, the
// windowing engine, expansion state, focus, the live-append region, and the imperative
// handle; it invokes the Body row-template ONLY for windowed items (the compound answer to
// "how do you virtualize 100k rows without the consumer materializing every <Row>"). The
// HeaderCell set is the single column authority; body Cells are matched and ordered to it by
// columnId (missing column -> empty gridcell, unknown columnId -> dev warning + not rendered).
// Root centrally owns the grid roles and every element's aria-rowindex/aria-colindex/position
// via context; the sub-components render the role-bearing DOM and read index/style/position
// from context, so composition never chooses its own indices or offsets.

// --- Sub-components (declarative; render the role-bearing DOM from context) ------------

function Header({ children }: VirtualTableProps.HeaderProps) {
  const ctx = useVirtualTableContext('Header');
  return (
    // Header row is aria-rowindex 1 so it is counted exactly once and SR "row X of Y" is
    // coherent under windowing (design B1).
    <div className={styles['header-row']} role="row" aria-rowindex={1}>
      {ctx.hasDisclosureColumn && (
        // Materialised leading disclosure column: an accessible, empty columnheader (a spacer
        // aligned to the row's disclosure-toggle column) counted at aria-colindex 1 so data
        // columns start at 2 in BOTH the header and every body row and never diverge (design
        // B1). The empty header is intentional (repo axe disables empty-table-header).
        <span className={styles['disclosure-header']} role="columnheader" aria-colindex={1} />
      )}
      {children}
    </div>
  );
}

function HeaderCell({ columnId, children }: VirtualTableProps.HeaderCellProps) {
  const ctx = useVirtualTableContext('HeaderCell');
  const ariaSort = ctx.ariaSortOf(columnId);
  return (
    <span
      className={styles['header-cell']}
      role="columnheader"
      aria-colindex={ctx.columnIndexOf(columnId)}
      aria-sort={ariaSort}
      style={ctx.columnStyleOf(columnId)}
    >
      {ariaSort !== undefined ? (
        // Sortable columns (those declaring a sortingField) expose a native, implicitly
        // keyboard-operable button as the sort trigger; its accessible name comes from
        // activateSortLabel, falling back to the header content. Root reflects the resulting
        // state via aria-sort on this columnheader and fires onSortingChange — VirtualTable
        // never sorts the data itself.
        <button
          type="button"
          className={styles['sort-button']}
          aria-label={ctx.activateSortLabel?.(columnId)}
          onClick={() => ctx.onSort(columnId)}
        >
          {children}
        </button>
      ) : (
        children
      )}
    </span>
  );
}

// Body is a carrier for the row-template function child. Root reads its child and invokes it
// per windowed item; Body itself never renders (Root intercepts).
const Body = (() => null) as <T>(props: VirtualTableProps.BodyProps<T>) => React.ReactElement | null;

function Cell({ columnId, children }: VirtualTableProps.CellProps) {
  const ctx = useVirtualTableContext('Cell');
  return (
    <span
      className={styles.cell}
      role="gridcell"
      aria-colindex={ctx.columnIndexOf(columnId)}
      style={ctx.columnStyleOf(columnId)}
    >
      {children}
    </span>
  );
}

// ExpandedContent is a descriptor Row reads and hoists into a sibling expanded row; it does
// not render on its own.
const ExpandedContent = (() => null) as (props: VirtualTableProps.ExpandedContentProps) => React.ReactElement | null;

function Row<T>({ item, api, children }: VirtualTableProps.RowProps<T>) {
  const ctx = useVirtualTableContext<T>('Row');
  const id = ctx.trackBy(item);
  const expanded = ctx.isExpanded(id);
  const position = ctx.positionOf(id);

  // Partition the row template's children: keep Cells by columnId; an ExpandedContent child
  // is hoisted into a sibling expanded row ("declared in the row, positioned as a sibling
  // row"). Unknown columnIds are dev-warned and dropped (header<->body reconciliation).
  const cellByColumnId = new Map<string, React.ReactNode>();
  const childList = React.Children.toArray(children).filter(React.isValidElement);
  const expandedContent =
    (childList.find(child => child.type === ExpandedContent) as
      | React.ReactElement<VirtualTableProps.ExpandedContentProps>
      | undefined) ?? null;
  childList.forEach(child => {
    if (child.type === Cell) {
      const columnId = (child.props as VirtualTableProps.CellProps).columnId;
      if (ctx.columns.some(column => column.columnId === columnId)) {
        cellByColumnId.set(columnId, child);
      } else {
        warnOnce('VirtualTable', `Cell with columnId "${columnId}" has no matching HeaderCell and was not rendered.`);
      }
    }
  });

  // Place cells in the header column order; a column with no Cell renders an empty gridcell so
  // the row stays a coherent rectangle and aria-colindex never diverges from the header.
  const orderedCells = ctx.columns.map(column => {
    const cell = cellByColumnId.get(column.columnId);
    if (cell) {
      return <React.Fragment key={column.columnId}>{cell}</React.Fragment>;
    }
    return (
      <span
        key={column.columnId}
        className={styles.cell}
        role="gridcell"
        aria-colindex={ctx.columnIndexOf(column.columnId)}
        style={ctx.columnStyleOf(column.columnId)}
      />
    );
  });

  const regionId = ctx.regionId(id);
  const toggleId = ctx.toggleId(id);
  // Data rows are the header row (aria-rowindex 1) + the 1-based dataset index -> api.rowIndex + 1.
  const dataAriaRowIndex = api.rowIndex + 1;
  const isActive = ctx.activeDescendantId === id;
  // Only the arbitrary expanded region is measured; a fixedHeight opts out.
  const expandedAuto = expandedContent ? expandedContent.props.fixedHeight === undefined : true;
  // A row in the expanded set that rendered no ExpandedContent means the template gated
  // ExpandedContent on api.isExpanded (see BodyProps): fail loudly instead of silently
  // showing nothing (B1).
  if (expanded && !expandedContent) {
    warnOnce(
      'VirtualTable',
      'A row is expanded but its row template rendered no <VirtualTable.ExpandedContent>. ' +
        'Declare ExpandedContent unconditionally (do not gate it on api.isExpanded); Root mounts it only for expanded rows.'
    );
  }
  // Data rows are fixed unless the consumer opts this row into measurement via getRowHeight.
  const dataAuto = ctx.getRowHeight ? ctx.getRowHeight(item) === 'auto' : false;

  const dataStyle: React.CSSProperties | undefined = position
    ? { position: 'absolute', insetBlockStart: position.dataStart, insetInlineStart: 0, insetInlineEnd: 0 }
    : undefined;
  const expandedStyle: React.CSSProperties | undefined =
    position && position.expandedStart !== undefined
      ? { position: 'absolute', insetBlockStart: position.expandedStart, insetInlineStart: 0, insetInlineEnd: 0 }
      : undefined;

  return (
    <>
      <div
        id={ctx.rowDomId(id)}
        className={clsx(styles.row, isActive && styles['row-active'])}
        role="row"
        aria-rowindex={dataAriaRowIndex}
        style={dataStyle}
        ref={ctx.measureRef('d:' + id, dataAuto)}
      >
        {ctx.hasDisclosureColumn && (
          <span className={styles['disclosure-cell']} role="gridcell" aria-colindex={1}>
            {expandedContent ? (
              <button
                id={toggleId}
                type="button"
                className={styles['disclosure-button']}
                aria-expanded={expanded}
                aria-controls={expanded ? regionId : undefined}
                aria-label={ctx.ariaLabels?.expandButtonLabel?.(item, expanded)}
                onClick={() => ctx.toggle(item)}
              />
            ) : null}
          </span>
        )}
        {orderedCells}
      </div>

      {expanded && expandedContent && (
        // The expanded region belongs to its data row: it shares that row's aria-rowindex and
        // is NOT added to aria-rowcount (design B1). A real row -> full-width gridcell ->
        // labeled region keeps a valid grid child model (design B2). The row is measured so
        // its variable height windows correctly.
        <div
          className={styles['expanded-row']}
          role="row"
          aria-rowindex={dataAriaRowIndex}
          style={expandedStyle}
          ref={ctx.measureRef('e:' + id, expandedAuto)}
        >
          {/* A div (not a span) holds the arbitrary, possibly block-level expanded content —
              carry-forward from the F1-A1 -pr HTML-validity fix. */}
          <div className={styles['expanded-cell']} role="gridcell" aria-colindex={1} aria-colspan={ctx.columnCount}>
            <div
              id={regionId}
              className={styles['expanded-region']}
              role="region"
              aria-label={ctx.ariaLabels?.expandedRegionLabel?.(item)}
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  event.stopPropagation();
                  document.getElementById(toggleId)?.focus();
                }
              }}
            >
              {expandedContent.props.children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Column authority derivation ------------------------------------------------------

function deriveColumns(headerElement: React.ReactElement<VirtualTableProps.HeaderProps> | null): DerivedColumn[] {
  if (!headerElement) {
    return [];
  }
  const columns: DerivedColumn[] = [];
  React.Children.forEach(headerElement.props.children, child => {
    if (React.isValidElement(child) && child.type === HeaderCell) {
      const props = child.props as VirtualTableProps.HeaderCellProps;
      columns.push({
        columnId: props.columnId,
        stretch: props.stretch,
        width: props.width,
        minWidth: props.minWidth,
        sortingField: props.sortingField,
      });
    }
  });
  return columns;
}

// Fixed-layout column sizing: an explicit width pins the column; the stretch column fills
// remaining space; otherwise columns share space.
function cellStyle(
  column: DerivedColumn | undefined,
  columnWidths: Record<string, number> | undefined,
  stretch: boolean
): React.CSSProperties {
  const width = (column && columnWidths?.[column.columnId]) ?? column?.width;
  if (stretch) {
    return { flex: '1 1 auto', minInlineSize: column?.minWidth };
  }
  if (width !== undefined) {
    return { flex: `0 0 ${width}px`, minInlineSize: column?.minWidth };
  }
  return { flex: '1 1 0', minInlineSize: column?.minWidth ?? 0 };
}

// --- Root -----------------------------------------------------------------------------

interface InternalRootProps<T> extends VirtualTableProps<T>, InternalBaseComponentProps {}

function InternalRoot<T>({
  items,
  trackBy,
  role = 'grid',
  estimatedRowHeight = 40,
  getRowHeight,
  overscan = 10,
  onVisibleRangeChange,
  header,
  empty,
  loading = false,
  loadingText,
  expandedItems,
  defaultExpandedItems,
  onExpandChange,
  sortingColumn,
  sortingDescending,
  onSortingChange,
  columnWidths,
  ariaLabels,
  imperativeRef,
  children,
  __internalRootRef,
  ...props
}: InternalRootProps<T>) {
  const baseProps = getBaseProps(props);
  const baseId = useUniqueId('virtual-table');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Partition the compound children into Header + Body.
  const rootChildren = React.Children.toArray(children).filter(React.isValidElement);
  const headerElement =
    (rootChildren.find(child => child.type === Header) as
      | React.ReactElement<VirtualTableProps.HeaderProps>
      | undefined) ?? null;
  const bodyElement =
    (rootChildren.find(child => child.type === Body) as
      | React.ReactElement<VirtualTableProps.BodyProps<T>>
      | undefined) ?? null;

  const expansion = useExpansion<T>({ trackBy, expandedItems, defaultExpandedItems, onExpandChange });

  // Probe the row template ONCE with the first item to read template-level facts that must be
  // stable across windowing: whether the template renders an ExpandedContent child (enables
  // the disclosure column) and the expanded region's height strategy (fixed vs measured, and
  // the pre-measurement runway estimate — CloudWatch ~300 / ~150). Deriving these from a
  // stable probe rather than the windowed row set stops the disclosure column from flickering
  // as rows scroll in and out.
  const probe = useMemo(() => {
    if (!bodyElement || items.length === 0) {
      return {
        hasDisclosureColumn: false,
        fixedHeight: undefined as number | undefined,
        estimatedHeight: undefined as number | undefined,
      };
    }
    const element = bodyElement.props.children(items[0], {
      rowIndex: 1,
      totalItemCount: items.length,
      isExpanded: false,
    });
    let hasDisclosureColumn = false;
    let fixedHeight: number | undefined;
    let estimatedHeight: number | undefined;
    React.Children.forEach(element.props.children, child => {
      if (React.isValidElement(child) && child.type === ExpandedContent) {
        hasDisclosureColumn = true;
        const expandedProps = child.props as VirtualTableProps.ExpandedContentProps;
        fixedHeight = expandedProps.fixedHeight;
        estimatedHeight = expandedProps.estimatedHeight;
      }
    });
    return { hasDisclosureColumn, fixedHeight, estimatedHeight };
  }, [bodyElement, items]);

  const model = useVirtualModel<T>({
    items,
    trackBy,
    expandedIds: expansion.expandedIds,
    expandedSignature: expansion.expandedSignature,
    estimatedRowHeight,
    getRowHeight,
    getExpandedRowHeight: () => probe.fixedHeight ?? 'auto',
    defaultExpandedEstimate: probe.estimatedHeight,
    overscan,
    scrollContainerRef,
  });

  // Fire the visible-range change when the windowed data range moves.
  useEffect(() => {
    if (model.firstIndex >= 0) {
      fireNonCancelableEvent(onVisibleRangeChange, { firstIndex: model.firstIndex, lastIndex: model.lastIndex });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.firstIndex, model.lastIndex]);

  const columns = deriveColumns(headerElement);
  const hasDisclosureColumn = probe.hasDisclosureColumn;
  const dataColumnStart = hasDisclosureColumn ? 2 : 1;
  const columnCount = columns.length + (hasDisclosureColumn ? 1 : 0);
  const stretchColumnId = [...columns].reverse().find(column => column.stretch)?.columnId;
  const columnIndex = useMemo(
    () => new Map(columns.map((column, index) => [column.columnId, dataColumnStart + index])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns.map(column => column.columnId).join('\u0000'), dataColumnStart]
  );

  // Absolute positions for the windowed slots, keyed by row id.
  const positions = useMemo(() => {
    const map = new Map<string, RowPosition>();
    for (const slot of model.slots) {
      const id = trackBy(items[slot.index]);
      const entry = map.get(id) ?? { dataStart: 0 };
      if (slot.type === 'data') {
        entry.dataStart = slot.start;
      } else {
        entry.expandedStart = slot.start;
      }
      map.set(id, entry);
    }
    return map;
  }, [model.slots, items, trackBy]);

  // Roving active descendant: the scroll container is the single tab stop and references the
  // active row while it is windowed, so the grid is Tab-reachable at any scroll offset (design
  // B3). Arrow/Home/End move the active row and scroll it into view.
  const [activeId, setActiveId] = useState<string | null>(null);
  const effectiveActiveId = activeId ?? (items.length > 0 ? trackBy(items[0]) : null);
  const windowedIds = useMemo(() => {
    const set = new Set<string>();
    for (const slot of model.slots) {
      if (slot.type === 'data') {
        set.add(trackBy(items[slot.index]));
      }
    }
    return set;
  }, [model.slots, items, trackBy]);
  const activeDescendantId = effectiveActiveId && windowedIds.has(effectiveActiveId) ? effectiveActiveId : null;

  const moveActive = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, nextIndex));
      if (clamped < 0 || items.length === 0) {
        return;
      }
      setActiveId(trackBy(items[clamped]));
      model.scrollToIndex(clamped);
    },
    [items, trackBy, model]
  );

  const onGridKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Only act when the grid container itself is focused; never steal Arrow/Home/End from
      // interactive cell content or the arbitrary expanded region (design B2, MASTER goal 6).
      if (event.target !== event.currentTarget) {
        return;
      }
      const current = effectiveActiveId ? items.findIndex(item => trackBy(item) === effectiveActiveId) : -1;
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveActive(current + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          moveActive(current - 1);
          break;
        case 'Home':
          event.preventDefault();
          moveActive(0);
          break;
        case 'End':
          event.preventDefault();
          moveActive(items.length - 1);
          break;
      }
    },
    [effectiveActiveId, items, trackBy, moveActive]
  );

  // Reflect-not-sort: a HeaderCell sort trigger computes the next sort intent (toggle
  // direction on the active column, otherwise start ascending) and emits it; the consumer
  // applies the sort to `items`. VirtualTable never reorders the data itself.
  const handleSort = useCallback(
    (columnId: string) => {
      const nextDescending = sortingColumn?.columnId === columnId ? !sortingDescending : false;
      fireNonCancelableEvent(onSortingChange, { columnId, sortingDescending: nextDescending });
    },
    [sortingColumn, sortingDescending, onSortingChange]
  );

  useImperativeHandle(
    imperativeRef,
    () => ({
      scrollToEnd: () => model.scrollToEnd(),
      scrollToItem: (id: string, options?: { reveal?: boolean }) => {
        const index = items.findIndex(item => trackBy(item) === id);
        if (index < 0) {
          return;
        }
        if (options?.reveal) {
          expansion.expand(items[index]);
        }
        model.scrollToIndex(index);
      },
      isPinnedToEnd: () => model.isPinnedToEnd(),
    }),
    [model, items, trackBy, expansion]
  );

  const liveMessage = useLiveAnnouncement(items.length, ariaLabels?.appendAnnouncement);

  // Invoke the row template ONLY for windowed data slots.
  const rowElements =
    bodyElement && !loading && items.length > 0
      ? model.slots
          .filter(slot => slot.type === 'data')
          .map(slot => {
            const item = items[slot.index];
            const element = bodyElement!.props.children(item, {
              rowIndex: slot.index + 1,
              totalItemCount: items.length,
              isExpanded: expansion.isExpanded(trackBy(item)),
            });
            return React.cloneElement(element, { key: trackBy(item) });
          })
      : [];

  const contextValue: VirtualTableContextValue<T> = {
    baseId,
    hasDisclosureColumn,
    columnCount,
    columns,
    columnIndexOf: (columnId: string) => columnIndex.get(columnId) ?? dataColumnStart,
    columnStyleOf: (columnId: string) => {
      const column = columns.find(candidate => candidate.columnId === columnId);
      return cellStyle(column, columnWidths, columnId === stretchColumnId);
    },
    ariaSortOf: (columnId: string) => {
      const column = columns.find(candidate => candidate.columnId === columnId);
      if (!column?.sortingField) {
        return undefined;
      }
      return sortingColumn?.columnId === columnId ? (sortingDescending ? 'descending' : 'ascending') : 'none';
    },
    onSort: handleSort,
    activateSortLabel: ariaLabels?.activateSortLabel,
    positionOf: (id: string) => positions.get(id),
    measureRef: model.measureRef,
    getRowHeight,
    activeDescendantId,
    ariaLabels: {
      expandButtonLabel: ariaLabels?.expandButtonLabel,
      expandedRegionLabel: ariaLabels?.expandedRegionLabel,
    },
    trackBy,
    isExpanded: expansion.isExpanded,
    toggle: expansion.toggle,
    rowDomId: (id: string) => `${baseId}-row-${id}`,
    toggleId: (id: string) => `${baseId}-toggle-${id}`,
    regionId: (id: string) => `${baseId}-region-${id}`,
  };

  const showEmpty = !loading && items.length === 0;
  const headerSticky = headerElement?.props.sticky ?? false;

  return (
    <VirtualTableContextProvider value={contextValue as VirtualTableContextValue}>
      <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
        {header && <div className={styles.header}>{header}</div>}

        {/*
          The grid owns only rowgroups; header and body rows sit in their own rowgroup
          (grid -> rowgroup -> row -> columnheader/gridcell). Non-row chrome — loading
          (role=status), empty state, and the live-append region — are siblings of the grid
          under .root, never grid-owned children. The scroll container is the single owned
          windowing viewport and the single tab stop (aria-activedescendant roving, design B3).
        */}
        <div
          ref={scrollContainerRef}
          className={clsx(styles['scroll-container'], headerSticky && styles['sticky-header'])}
          role={role}
          aria-label={ariaLabels?.tableLabel}
          aria-rowcount={items.length + 1}
          aria-colcount={columnCount}
          tabIndex={role === 'grid' ? 0 : undefined}
          aria-activedescendant={
            role === 'grid' && activeDescendantId ? `${baseId}-row-${activeDescendantId}` : undefined
          }
          onKeyDown={role === 'grid' ? onGridKeyDown : undefined}
        >
          <div className={styles['header-rowgroup']} role="rowgroup">
            {headerElement}
          </div>

          {!loading && !showEmpty && (
            <div className={styles.body} role="rowgroup" style={{ blockSize: model.totalSize }}>
              {rowElements}
            </div>
          )}
        </div>

        {loading && (
          <div className={styles.loading} role="status">
            {loadingText}
          </div>
        )}

        {showEmpty && <div className={styles.empty}>{empty}</div>}

        <div className={styles['live-region']} aria-live="polite" aria-atomic="true">
          {liveMessage}
        </div>
      </div>
    </VirtualTableContextProvider>
  );
}

export { InternalRoot, Header, HeaderCell, Body, Row, Cell, ExpandedContent };
