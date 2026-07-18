// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { VirtualTableProps } from './interfaces';
import { useExpansion } from './use-expansion';
import { useLiveAnnouncement } from './use-live-announcement';
import { useVirtualModel } from './use-virtual-model';

import styles from './styles.css.js';

interface InternalVirtualTableProps<T> extends VirtualTableProps<T>, InternalBaseComponentProps {}

// impl-F1-A1-core: the config-driven VirtualTable render path. The scaffold's
// non-windowed placeholder body is replaced by the windowing engine
// (use-virtual-model), controlled/uncontrolled expansion (use-expansion), and the
// debounced live-append surface (use-live-announcement). The DOM keeps a valid grid
// child model (grid -> rowgroup -> row -> columnheader/gridcell, design B2), sets
// full-dataset aria-rowcount/aria-rowindex + aria-colcount/aria-colindex (design B1),
// and attaches the arbitrary R-EXPAND content inside a real expanded row so it windows
// with a measured variable height.
export default function InternalVirtualTable<T>({
  items,
  columnDefinitions,
  trackBy,
  role = 'grid',
  header,
  empty,
  loading = false,
  loadingText,
  estimatedRowHeight = 40,
  getRowHeight,
  getExpandedRowHeight,
  overscan = 10,
  onVisibleRangeChange,
  getExpandedContent,
  expandedItems,
  defaultExpandedItems,
  onExpandChange,
  columnWidths,
  stickyHeader = false,
  sortingColumn,
  sortingDescending = false,
  ariaLabels,
  imperativeRef,
  __internalRootRef,
  ...props
}: InternalVirtualTableProps<T>) {
  const baseProps = getBaseProps(props);
  // Deferred beyond core (declared in interfaces, intentionally not wired here):
  // resizableColumns / columnLayout='auto' / onColumnWidthsChange / onSortingChange.
  // They fall into ...props and getBaseProps drops unknown props (no DOM leak); the
  // resize + auto-layout + sort-emit behaviours land in impl-F1-A1-cw-* / later units.
  const baseId = useUniqueId('virtual-table');
  const scrollRef = useRef<HTMLDivElement>(null);

  const showEmpty = !loading && items.length === 0;
  const hasDisclosureColumn = !!getExpandedContent;
  const dataColumnStart = hasDisclosureColumn ? 2 : 1;
  const columnCount = columnDefinitions.length + (hasDisclosureColumn ? 1 : 0);
  // Single stretch target: if several columns set isStretch, the last-declared wins (CW-8).
  const stretchColumnId = [...columnDefinitions].reverse().find(column => column.isStretch)?.id;

  const expansion = useExpansion<T>({ trackBy, expandedItems, defaultExpandedItems, onExpandChange });

  const model = useVirtualModel<T>({
    items,
    trackBy,
    expandedIds: expansion.expandedIds,
    expandedSignature: expansion.expandedSignature,
    estimatedRowHeight,
    getRowHeight,
    getExpandedRowHeight,
    overscan,
    scrollContainerRef: scrollRef,
  });

  const liveMessage = useLiveAnnouncement(items.length, ariaLabels?.appendAnnouncement);

  // Surface the accurate windowed range (variable heights make a scrollTop estimate
  // unreliable, so the measured range is emitted here).
  const lastRange = useRef<{ first: number; last: number }>({ first: -1, last: -1 });
  useEffect(() => {
    if (model.firstIndex < 0) {
      return;
    }
    if (model.firstIndex !== lastRange.current.first || model.lastIndex !== lastRange.current.last) {
      lastRange.current = { first: model.firstIndex, last: model.lastIndex };
      fireNonCancelableEvent(onVisibleRangeChange, { firstIndex: model.firstIndex, lastIndex: model.lastIndex });
    }
  }, [model.firstIndex, model.lastIndex, onVisibleRangeChange]);

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

  // Keyboard navigation uses the aria-activedescendant model rather than roving
  // tabindex on rows: the scroll container is the single, always-present tab stop
  // (tabIndex 0), so Tab reaches the grid at ANY scroll offset — including live-tail
  // pinned-to-end, where the default active row is far above the window (design B3,
  // WCAG 2.1.1). The active row is referenced by aria-activedescendant only while it
  // is within the rendered window, so the reference is always valid; Arrow/Home/End
  // move the active row and scroll it into view (which renders it, updating the
  // reference). Cell-level (2D) arrow navigation and focus-restore-on-recycle coverage
  // are exercised in impl-F1-A1-tests-a11y.
  const [activeId, setActiveId] = useState<string | null>(null);
  const effectiveActiveId = activeId ?? (items.length > 0 ? trackBy(items[0]) : null);
  const rowDomId = (id: string) => `${baseId}-row-${id}`;

  // Ids of the data rows currently in the window; used to keep aria-activedescendant
  // pointing only at a rendered element (an out-of-window reference would be invalid).
  const windowedDataIds = new Set(
    model.slots.filter(slot => slot.type === 'data').map(slot => trackBy(items[slot.index]))
  );
  const activeDescendantId =
    effectiveActiveId && windowedDataIds.has(effectiveActiveId) ? rowDomId(effectiveActiveId) : undefined;

  const moveActive = useCallback(
    (delta: number | 'start' | 'end') => {
      if (items.length === 0) {
        return;
      }
      const currentIndex = Math.max(
        0,
        items.findIndex(item => trackBy(item) === effectiveActiveId)
      );
      let nextIndex: number;
      if (delta === 'start') {
        nextIndex = 0;
      } else if (delta === 'end') {
        nextIndex = items.length - 1;
      } else {
        nextIndex = Math.min(items.length - 1, Math.max(0, currentIndex + delta));
      }
      setActiveId(trackBy(items[nextIndex]));
      model.scrollToIndex(nextIndex);
    },
    [items, trackBy, effectiveActiveId, model]
  );

  const onGridKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Only act when the grid container itself holds focus. Keys originating from
      // focusable content inside a cell or the expanded region — which is Tab-in /
      // Escape-out and excluded from arrow-grid navigation (design B2 / MASTER goal 6)
      // — belong to that content, so the grid must not hijack Arrow/Home/End there.
      if (event.target !== event.currentTarget) {
        return;
      }
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveActive(1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          moveActive(-1);
          break;
        case 'Home':
          event.preventDefault();
          moveActive('start');
          break;
        case 'End':
          event.preventDefault();
          moveActive('end');
          break;
      }
    },
    [moveActive]
  );

  const renderDataRow = (index: number, start: number, size: number, auto: boolean) => {
    const item = items[index];
    const id = trackBy(item);
    const expanded = expansion.isExpanded(id);
    const regionId = `${baseId}-region-${id}`;
    const toggleId = `${baseId}-toggle-${id}`;
    const context: VirtualTableProps.CellContext = {
      rowIndex: index,
      totalItemCount: items.length,
      isExpanded: expanded,
    };
    return (
      <div
        key={'d:' + id}
        id={rowDomId(id)}
        data-rowid={id}
        ref={model.measureRef('d:' + id, auto)}
        className={styles.row}
        role="row"
        // Header row is aria-rowindex 1; data rows are dataset index + 2, so the header
        // is counted exactly once and SR "row X of Y" is coherent under windowing (B1).
        aria-rowindex={index + 2}
        style={{ insetBlockStart: start, blockSize: auto ? undefined : size }}
      >
        {hasDisclosureColumn && (
          <span className={styles['disclosure-cell']} role="gridcell" aria-colindex={1}>
            <button
              id={toggleId}
              type="button"
              className={styles['disclosure-button']}
              aria-expanded={expanded}
              aria-controls={expanded ? regionId : undefined}
              aria-label={ariaLabels?.expandButtonLabel?.(item, expanded)}
              onClick={() => expansion.toggle(item)}
            />
          </span>
        )}
        {columnDefinitions.map((column, columnIndex) => (
          <span
            key={column.id}
            className={styles.cell}
            role="gridcell"
            aria-colindex={dataColumnStart + columnIndex}
            style={cellStyle(column, columnWidths, column.id === stretchColumnId)}
          >
            {column.cell(item, context)}
          </span>
        ))}
      </div>
    );
  };

  const renderExpandedRow = (index: number, start: number, size: number, auto: boolean) => {
    const item = items[index];
    const id = trackBy(item);
    const regionId = `${baseId}-region-${id}`;
    const toggleId = `${baseId}-toggle-${id}`;
    return (
      <div
        key={'e:' + id}
        data-rowid={id}
        className={styles['expanded-row']}
        role="row"
        // The expanded region belongs to its data row: it shares that row's
        // aria-rowindex and is NOT added to aria-rowcount (design B1). aria-rowcount
        // therefore counts the header + data rows only, independent of how many rows
        // are currently expanded.
        aria-rowindex={index + 2}
        style={{ insetBlockStart: start, blockSize: auto ? undefined : size }}
      >
        {/* Full-width gridcell keeps a valid grid child model; the arbitrary,
            non-tabular content lives in a labeled region inside it (design B2). A
            div (not a span) is used because the expanded content is arbitrary and
            may include block-level elements, which are not permitted inside a span. */}
        <div className={styles['expanded-cell']} role="gridcell" aria-colindex={1} aria-colspan={columnCount}>
          <div
            id={regionId}
            ref={model.measureRef('e:' + id, auto)}
            className={styles['expanded-region']}
            role="region"
            aria-label={ariaLabels?.expandedRegionLabel?.(item)}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                document.getElementById(toggleId)?.focus();
              }
            }}
          >
            {getExpandedContent?.(item)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      {header && <div className={styles.header}>{header}</div>}

      {/*
        The grid owns only rowgroups; header and body rows sit in their own rowgroup
        (grid -> rowgroup -> row -> columnheader/gridcell). Non-row chrome — loading
        (role=status), empty state, and the live-append region — are siblings of the
        grid under .root, never grid-owned children.
      */}
      <div
        ref={scrollRef}
        className={clsx(styles['scroll-container'], stickyHeader && styles['sticky-header'])}
        role={role}
        // The scroll container is the single, always-present tab stop and drives an
        // active-descendant model, so the grid is Tab-reachable at any scroll offset,
        // including live-tail pinned-to-end (design B3). aria-rowcount counts the
        // header row + all data rows (design B1).
        tabIndex={0}
        aria-label={ariaLabels?.tableLabel}
        aria-rowcount={items.length + 1}
        aria-colcount={columnCount}
        aria-activedescendant={activeDescendantId}
        onKeyDown={onGridKeyDown}
      >
        <div className={styles['header-rowgroup']} role="rowgroup">
          <div className={styles['header-row']} role="row" aria-rowindex={1}>
            {hasDisclosureColumn && (
              // Materialised leading disclosure column: an accessible, visually hidden
              // columnheader counted at aria-colindex 1 so data columns start at 2 in
              // both header and body and the two never diverge (design B1 / F1-A2 B1).
              <span className={styles['disclosure-header']} role="columnheader" aria-colindex={1} />
            )}
            {columnDefinitions.map((column, columnIndex) => {
              const sorted = sortingColumn?.id === column.id;
              return (
                <span
                  key={column.id}
                  className={styles['header-cell']}
                  role="columnheader"
                  aria-colindex={dataColumnStart + columnIndex}
                  aria-sort={sorted ? (sortingDescending ? 'descending' : 'ascending') : undefined}
                  style={cellStyle(column, columnWidths, column.id === stretchColumnId)}
                >
                  {column.header}
                </span>
              );
            })}
          </div>
        </div>

        {!loading && !showEmpty && (
          <div className={styles.body} role="rowgroup" style={{ blockSize: model.totalSize }}>
            {model.slots.map(slot =>
              slot.type === 'data'
                ? renderDataRow(slot.index, slot.start, slot.size, slot.auto)
                : renderExpandedRow(slot.index, slot.start, slot.size, slot.auto)
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.loading} role="status">
          {loadingText}
        </div>
      )}

      {showEmpty && <div className={styles.empty}>{empty}</div>}

      {/* Polite, debounced live-append region (design: one summarized message per burst). */}
      <div className={styles['live-region']} aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
    </div>
  );
}

// Fixed-layout column sizing: an explicit width pins the column; the stretch column
// (CW-8, single last-wins target) fills remaining space; otherwise columns share space.
function cellStyle<T>(
  column: VirtualTableProps.ColumnDefinition<T>,
  columnWidths: Record<string, number> | undefined,
  stretch: boolean
): React.CSSProperties {
  const width = columnWidths?.[column.id] ?? column.width;
  if (stretch) {
    return { flex: '1 1 auto', minInlineSize: column.minWidth };
  }
  if (width !== undefined) {
    return { flex: `0 0 ${width}px`, minInlineSize: column.minWidth };
  }
  return { flex: '1 1 0', minInlineSize: column.minWidth ?? 0 };
}
