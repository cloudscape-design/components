// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { HeaderRenderProps, VirtualGrid, VirtualGridConfig, VirtualRow } from './interfaces';
import { useLiveAnnouncement } from './use-live-announcement';
import { PositionedSlot, useVirtualModel } from './use-virtual-model';

// The headless data-grid CORE (cell F3-A2 seam). `useVirtualGrid` takes the dataset +
// configuration and returns plain props objects (gridProps, headerProps, per-row props,
// disclosure/expanded props, the live-region surface) plus an imperative handle, for a
// consumer to spread onto its own DOM. The compound skin (VirtualTable.*) is one such
// consumer; the SAME core can back a styled-default skin (F3-A3) or a bare-core consumer.
//
// impl-F3-A2-core: this is now the shipping engine. It owns a single inner scroll container
// (design B4) via `useVirtualModel`, windows the dataset (only the visible range + overscan
// are handed out as `rows`), measures 'auto' data rows + expanded regions on first window
// entry with incremental offset correction (design B5, no CW-3 drift), carries full-dataset
// aria-rowindex/aria-rowcount under windowing, keeps a single always-present tab stop with a
// roving `aria-activedescendant` that stays reachable at any scroll offset (incl. live-tail
// pinned-to-end), and coalesces streaming appends into one debounced polite announcement. It
// reads `scrollRef.current` for scroll anchoring; the skin gives it a callback ref through
// `gridProps.ref`. The row-granular keyboard model (arrows move an active ROW, Left/Right
// inert) matches the RESOLVED F1-A1/F1-A2/F2-A1 pinned APG deviation.

const DEFAULT_ESTIMATED_ROW_HEIGHT = 40;
const DEFAULT_OVERSCAN = 10;

export function useVirtualGrid<T>(config: VirtualGridConfig<T>): VirtualGrid<T> {
  const {
    items,
    trackBy,
    columns,
    hasExpandableRows = false,
    estimatedRowHeight = DEFAULT_ESTIMATED_ROW_HEIGHT,
    overscan = DEFAULT_OVERSCAN,
    getRowHeight,
    getExpandedRowHeight,
    defaultExpandedEstimate,
    role = 'grid',
    ariaLabel,
    expandedItems: controlledExpanded,
    defaultExpandedItems = [],
    onExpandChange,
    expandButtonLabel,
    expandedRegionLabel,
    sortingColumn,
    sortingDescending = false,
    onSortingChange,
    activateSortLabel,
    onVisibleRangeChange,
    renderAppendAnnouncement,
  } = config;

  const baseId = useUniqueId('virtual-grid');
  const scrollRef = useRef<HTMLElement | null>(null);

  // --- Expansion state (controlled/uncontrolled), core-owned per the design ----------------
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<ReadonlyArray<string>>(defaultExpandedItems);
  const isControlled = controlledExpanded !== undefined;
  const expandedIds = useMemo(
    () => new Set(isControlled ? controlledExpanded : uncontrolledExpanded),
    [isControlled, controlledExpanded, uncontrolledExpanded]
  );
  // Stable signature so the layout only recomputes when the expanded SET actually changes.
  const expandedSignature = useMemo(() => Array.from(expandedIds).sort().join('\u0000'), [expandedIds]);

  const itemById = useMemo(() => {
    const map = new Map<string, T>();
    for (const item of items) {
      map.set(trackBy(item), item);
    }
    return map;
  }, [items, trackBy]);

  // --- Windowing + measurement engine (single owned scroll container) ----------------------
  const model = useVirtualModel<T>({
    items,
    trackBy,
    expandedIds,
    expandedSignature,
    estimatedRowHeight,
    getRowHeight,
    getExpandedRowHeight,
    defaultExpandedEstimate,
    overscan,
    scrollContainerRef: scrollRef,
  });

  // --- aria-colindex accounting: the materialised disclosure column (when present) is
  // colindex 1, so data columns start at 2 in BOTH the header and every body row. --------
  const dataColumnStart = hasExpandableRows ? 2 : 1;
  const columnCount = columns.length + (hasExpandableRows ? 1 : 0);
  const columnIndexOf = useCallback(
    (columnId: string) => {
      const pos = columns.findIndex(c => c.columnId === columnId);
      return pos === -1 ? -1 : dataColumnStart + pos;
    },
    [columns, dataColumnStart]
  );

  const rowDomId = useCallback((id: string) => `${baseId}-row-${id}`, [baseId]);
  const regionId = useCallback((id: string) => `${baseId}-region-${id}`, [baseId]);
  const toggleId = useCallback((id: string) => `${baseId}-toggle-${id}`, [baseId]);

  const setExpanded = useCallback(
    (item: T, expanded: boolean) => {
      const id = trackBy(item);
      const next = new Set(expandedIds);
      if (expanded) {
        next.add(id);
      } else {
        next.delete(id);
      }
      const expandedList = Array.from(next);
      if (!isControlled) {
        setUncontrolledExpanded(expandedList);
      }
      onExpandChange?.({ item, expanded, expandedItems: expandedList });
    },
    [trackBy, expandedIds, isControlled, onExpandChange]
  );

  const ariaSortOf = useCallback(
    (columnId: string): 'ascending' | 'descending' | 'none' | undefined => {
      const col = columns.find(c => c.columnId === columnId);
      if (!col?.sortable) {
        return undefined;
      }
      if (sortingColumn?.columnId === columnId) {
        return sortingDescending ? 'descending' : 'ascending';
      }
      return 'none';
    },
    [columns, sortingColumn, sortingDescending]
  );

  const onSort = useCallback(
    (columnId: string) => {
      const active = sortingColumn?.columnId === columnId;
      onSortingChange?.({ columnId, sortingDescending: active ? !sortingDescending : false });
    },
    [sortingColumn, sortingDescending, onSortingChange]
  );

  // --- Header props ------------------------------------------------------------------------
  const headerProps: HeaderRenderProps = useMemo(
    () => ({
      rowProps: { role: 'row', 'aria-rowindex': 1 } as React.HTMLAttributes<HTMLElement>,
      cellProps: (columnId: string) => {
        const sort = ariaSortOf(columnId);
        const props: React.HTMLAttributes<HTMLElement> & {
          'aria-colindex': number;
          'aria-sort'?: 'ascending' | 'descending' | 'none';
        } = { role: 'columnheader', 'aria-colindex': columnIndexOf(columnId) };
        if (sort !== undefined) {
          props['aria-sort'] = sort;
        }
        return props;
      },
      sortButtonProps: (columnId: string) => {
        const col = columns.find(c => c.columnId === columnId);
        if (!col?.sortable) {
          return null;
        }
        return {
          type: 'button' as const,
          'aria-label': activateSortLabel?.(columnId),
          onClick: () => onSort(columnId),
        } as React.ButtonHTMLAttributes<HTMLButtonElement>;
      },
      ...(hasExpandableRows
        ? {
            disclosureHeaderProps: {
              role: 'columnheader',
              'aria-colindex': 1 as const,
            } as React.HTMLAttributes<HTMLElement> & { 'aria-colindex': 1 },
          }
        : {}),
    }),
    [ariaSortOf, columnIndexOf, hasExpandableRows, columns, activateSortLabel, onSort]
  );

  // --- Roving active-descendant focus (single always-present tab stop) ---------------------
  // The scroll container is the ONE tab stop (tabIndex 0), reachable at any scroll offset incl
  // live-tail pinned-to-end. Arrow/Home/End move an active ROW (row-granular grid: the active
  // descendant is a role=row, not a cell cursor); Left/Right are inert (pinned APG deviation).
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const effectiveActiveId =
    activeId && itemById.has(activeId) ? activeId : items.length > 0 ? trackBy(items[0]) : undefined;

  const moveActiveTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length) {
        return;
      }
      setActiveId(trackBy(items[index]));
      model.scrollToIndex(index);
    },
    [items, trackBy, model]
  );

  const onGridKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      // Only act when the grid container itself holds focus — never steal keys from the
      // expanded region's arbitrary content or interactive cell content (design B2, goal 6).
      if (event.target !== event.currentTarget) {
        return;
      }
      const current = effectiveActiveId ? items.findIndex(item => trackBy(item) === effectiveActiveId) : -1;
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          moveActiveTo(Math.min(items.length - 1, (current < 0 ? -1 : current) + 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          moveActiveTo(Math.max(0, (current < 0 ? 1 : current) - 1));
          break;
        case 'Home':
          event.preventDefault();
          moveActiveTo(0);
          break;
        case 'End':
          event.preventDefault();
          moveActiveTo(items.length - 1);
          break;
        // ArrowLeft/ArrowRight: intentionally inert (row-granular grid, not 2D cell nav).
        default:
          break;
      }
    },
    [effectiveActiveId, items, trackBy, moveActiveTo]
  );

  // --- Windowed rows (the shipping render path) --------------------------------------------
  // Only the visible range + overscan are emitted. Each data slot carries an absolute offset;
  // its expanded companion slot (if present) carries its own offset + the measured region ref.
  const expandedSlotByIndex = useMemo(() => {
    const map = new Map<number, PositionedSlot>();
    for (const slot of model.slots) {
      if (slot.type === 'expanded') {
        map.set(slot.index, slot);
      }
    }
    return map;
  }, [model.slots]);

  const rows: ReadonlyArray<VirtualRow<T>> = useMemo(
    () =>
      model.slots
        .filter(slot => slot.type === 'data')
        .map(slot => {
          const item = items[slot.index];
          const id = trackBy(item);
          const isExpanded = expandedIds.has(id);

          const rowProps: React.HTMLAttributes<HTMLElement> & { ref?: React.RefCallback<HTMLElement> } = {
            role: 'row',
            'aria-rowindex': slot.index + 2, // header counted as row 1
            id: rowDomId(id),
            style: { position: 'absolute', insetBlockStart: slot.start, insetInlineStart: 0, inlineSize: '100%' },
            // 'auto' data rows (wrapping raw lines, CW-15) measure themselves here; fixed rows
            // pay no observer cost (measureRef early-returns when !auto).
            ref: model.measureRef(slot.key, slot.auto),
          };

          const cellProps = (columnId: string) =>
            ({ role: 'gridcell', 'aria-colindex': columnIndexOf(columnId) }) as React.HTMLAttributes<HTMLElement> & {
              'aria-colindex': number;
            };

          const disclosure = hasExpandableRows
            ? {
                isExpanded,
                cellProps: { role: 'gridcell', 'aria-colindex': 1 as const } as React.HTMLAttributes<HTMLElement> & {
                  'aria-colindex': 1;
                },
                buttonProps: {
                  type: 'button' as const,
                  id: toggleId(id),
                  'aria-expanded': isExpanded,
                  'aria-controls': isExpanded ? regionId(id) : undefined,
                  'aria-label': expandButtonLabel?.(item, isExpanded),
                  onClick: () => setExpanded(item, !isExpanded),
                } as React.ButtonHTMLAttributes<HTMLButtonElement>,
              }
            : null;

          const expandedSlot = expandedSlotByIndex.get(slot.index);

          const row: VirtualRow<T> = {
            item,
            key: id,
            rowProps,
            cellProps,
            disclosure,
            measureRef: expandedSlot ? model.measureRef(expandedSlot.key, expandedSlot.auto) : () => {},
          };

          if (hasExpandableRows && isExpanded && expandedSlot) {
            // Valid grid child model: real role=row -> full-width role=gridcell (aria-colspan
            // over all columns incl. disclosure) -> labeled role=region holding arbitrary
            // content. The expanded row shares its data row's aria-rowindex and does NOT add
            // to aria-rowcount (design B1).
            row.expandedRowProps = {
              role: 'row',
              'aria-rowindex': slot.index + 2,
              style: {
                position: 'absolute',
                insetBlockStart: expandedSlot.start,
                insetInlineStart: 0,
                inlineSize: '100%',
              },
            };
            row.expandedGridcellProps = { role: 'gridcell', 'aria-colindex': 1, 'aria-colspan': columnCount };
            row.expandedRegionProps = {
              role: 'region',
              id: regionId(id),
              'aria-label': expandedRegionLabel?.(item),
              // Escape-out (Tab-in/Escape-out contract): return focus to the disclosure
              // trigger. onGridKeyDown bails on target !== currentTarget so arrow-exclusion
              // stays intact; this handler owns Escape originating inside the region.
              onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
                if (event.key === 'Escape') {
                  event.stopPropagation();
                  document.getElementById(toggleId(id))?.focus();
                }
              },
            };
          }

          return row;
        }),
    [
      model,
      items,
      trackBy,
      expandedIds,
      hasExpandableRows,
      columnCount,
      columnIndexOf,
      rowDomId,
      regionId,
      toggleId,
      expandButtonLabel,
      expandedRegionLabel,
      setExpanded,
      expandedSlotByIndex,
    ]
  );

  const windowedDataIds = useMemo(() => new Set(rows.map(r => r.key)), [rows]);

  const getRowContext = useCallback(
    (id: string) => {
      const index = items.findIndex(item => trackBy(item) === id);
      return {
        rowIndex: index === -1 ? -1 : index + 1,
        totalItemCount: items.length,
        isExpanded: expandedIds.has(id),
      };
    },
    [items, trackBy, expandedIds]
  );

  // --- Visible-range notification (index into items) ---------------------------------------
  useEffect(() => {
    if (model.firstIndex >= 0 && model.lastIndex >= 0) {
      onVisibleRangeChange?.({ firstIndex: model.firstIndex, lastIndex: model.lastIndex });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.firstIndex, model.lastIndex]);

  // --- Live append (coalesced, debounced, polite) ------------------------------------------
  const { message: liveMessage, announce } = useLiveAnnouncement({
    totalCount: items.length,
    renderAppendAnnouncement,
  });

  // --- Scroll container callback ref -------------------------------------------------------
  // Keeps the internal scrollRef populated (the engine reads scrollRef.current) while being
  // spreadable onto ANY element — a div in this skin, a bare-core consumer's own element.
  const setScrollContainer = useCallback((node: HTMLElement | null) => {
    scrollRef.current = node;
  }, []);

  const gridProps: React.HTMLAttributes<HTMLElement> & { ref: React.RefCallback<HTMLElement> } = {
    ref: setScrollContainer,
    role,
    tabIndex: 0,
    'aria-rowcount': items.length + 1,
    'aria-colcount': columnCount,
    'aria-label': ariaLabel,
    'aria-activedescendant':
      effectiveActiveId && windowedDataIds.has(effectiveActiveId) ? rowDomId(effectiveActiveId) : undefined,
    onKeyDown: onGridKeyDown,
  };

  // The body runway: a relative container sized to the full virtual height so the absolutely
  // positioned windowed rows land at their real offsets.
  const bodyProps: React.HTMLAttributes<HTMLElement> = {
    style: { position: 'relative', blockSize: model.totalSize },
  };

  const liveRegionProps: React.HTMLAttributes<HTMLElement> = { 'aria-live': 'polite', 'aria-atomic': true };

  const scrollToItem = useCallback(
    (id: string, options?: { reveal?: boolean }) => {
      const item = itemById.get(id);
      if (!item) {
        return;
      }
      if (options?.reveal && !expandedIds.has(id)) {
        setExpanded(item, true);
      }
      const index = items.findIndex(i => trackBy(i) === id);
      model.scrollToIndex(index);
    },
    [itemById, expandedIds, setExpanded, items, trackBy, model]
  );

  return {
    gridProps,
    bodyProps,
    headerProps,
    rows,
    getRowContext,
    liveRegionProps,
    liveMessage,
    announceAppend: announce,
    scrollToEnd: model.scrollToEnd,
    scrollToItem,
    isPinnedToEnd: model.isPinnedToEnd,
  };
}
