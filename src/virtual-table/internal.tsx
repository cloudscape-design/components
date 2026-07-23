// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import { ExpandToggleButton } from '../internal/components/expand-toggle-button';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { VirtualTableProps } from './interfaces';
import { useExpansion } from './use-expansion';
import { INDICATOR_COL_WIDTH, useFilter } from './use-filter';
import { useLiveAnnouncement } from './use-live-announcement';
import { useLiveTail } from './use-live-tail';
import { useVirtualModel } from './use-virtual-model';

import styles from './styles.css.js';

interface InternalVirtualTableProps<T> extends VirtualTableProps<T>, InternalBaseComponentProps {}

// impl-F2-A1-core: the opinionated logs core. The `viewConfig.type` discriminant selects
// the built-in surface (standard / patterns / raw); the shared windowing engine, live
// tail, two-mode filter, R-EXPAND substrate, and full-dataset a11y are wired here per
// design-F2-A1.md (Chorus rfjLh1FFEJ0m). Override-seam throughout: the component owns the
// mechanism + a11y contract, the console owns policy (follow state, filter predicate,
// sort application, view swap).
export default function InternalVirtualTable<T>(props: InternalVirtualTableProps<T>) {
  const {
    items,
    viewConfig,
    trackBy,
    height,
    maxHeight,
    estimatedRowHeight = 23,
    getRowHeight,
    getExpandedContent,
    expandedContentPreset,
    getExpandedRowHeight,
    expandedItems,
    defaultExpandedItems,
    onExpandChange,
    follow = false,
    onFollowChange,
    renderAppendAnnouncement,
    filter,
    sortingColumn,
    sortingDescending = false,
    onSortingChange,
    stickyHeader = true,
    columnWidths,
    resizableColumns = false,
    onColumnWidthsChange,
    empty,
    loading = false,
    loadingText,
    ariaLabels,
    i18nStrings,
    imperativeRef,
    onVisibleRangeChange,
    __internalRootRef,
    ...rest
  } = props;
  const baseProps = getBaseProps(rest);
  const baseId = useUniqueId('virtual-table');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isRaw = viewConfig.type === 'raw';
  const columns = viewConfig.type === 'raw' ? [] : viewConfig.columnDefinitions;
  const renderLine = viewConfig.type === 'raw' ? viewConfig.renderLine : undefined;
  const overscan = props.overscan ?? (isRaw ? 40 : 20);

  // Two-mode filter: subset returns only matching rows (so the windowed dataset — and
  // aria-rowcount — is the filtered length); mark-in-place returns all rows + the match
  // set + a materialised indicator column.
  const filterModel = useFilter({ items, trackBy, filter });
  const visibleItems = filterModel.visibleItems;

  const hasDisclosureColumn = !isRaw && (!!getExpandedContent || !!expandedContentPreset);
  const hasIndicatorColumn = filterModel.hasIndicatorColumn;

  // Column-index accounting: disclosure = 1 (when present), match indicator = next (when
  // mark-in-place highlighting is active), data columns follow. columnCount and every
  // aria-colindex recompute coherently when the indicator column appears/disappears.
  let nextColIndex = 1;
  const disclosureColIndex = hasDisclosureColumn ? nextColIndex++ : undefined;
  const indicatorColIndex = hasIndicatorColumn ? nextColIndex++ : undefined;
  const dataColumnStart = nextColIndex;
  const dataColumnCount = isRaw ? 1 : columns.length;
  const columnCount = dataColumnCount + (hasDisclosureColumn ? 1 : 0) + (hasIndicatorColumn ? 1 : 0);

  // Single stretch target: if several columns set isStretch, the last-declared wins (CW-8).
  const stretchColumnId = [...columns].reverse().find(column => column.isStretch)?.id;

  // --- Shared column-track layout + resize (ported from F3-A2) ------------------------------
  // ONE grid-template-columns is computed from the active view's columns (+ the leading
  // disclosure track and the mark-in-place indicator track when present) and applied
  // identically to the header row and every body row, so columns align across rows
  // content-independently — the same template governs standard, patterns, and raw. Track
  // rules: disclosure = a leading `auto` track (resolves to the fixed disclosure inline-size);
  // indicator = a fixed px track (INDICATOR_COL_WIDTH); a resized/explicit-width data column =
  // `<w>px`; the stretch column and any width-less column = `minmax(<minWidth||0>px, 1fr)`. A
  // resize map entry takes precedence over a declared width.
  const isWidthControlled = columnWidths !== undefined;
  const [uncontrolledWidths, setUncontrolledWidths] = useState<Record<string, number>>({});
  const widths = isWidthControlled ? columnWidths! : uncontrolledWidths;

  const gridTemplateColumns = (() => {
    const tracks: string[] = [];
    if (hasDisclosureColumn) {
      tracks.push('auto');
    }
    if (hasIndicatorColumn) {
      tracks.push(`${INDICATOR_COL_WIDTH}px`);
    }
    if (isRaw) {
      tracks.push('minmax(0px, 1fr)');
    } else {
      for (const column of columns) {
        const resized = widths[column.id];
        if (resized !== undefined) {
          tracks.push(`${Math.max(resized, column.minWidth ?? 0)}px`);
        } else if (column.id === stretchColumnId) {
          tracks.push(`minmax(${column.minWidth ?? 0}px, 1fr)`);
        } else if (column.width !== undefined) {
          tracks.push(`${column.width}px`);
        } else {
          tracks.push(`minmax(${column.minWidth ?? 0}px, 1fr)`);
        }
      }
    }
    return tracks.join(' ');
  })();

  // Refs so the pointer-drag handlers always read the latest widths / minWidths / cell nodes
  // without re-subscribing listeners on every render.
  const headerCellRefs = useRef(new Map<string, HTMLElement>());
  const widthsRef = useRef(widths);
  widthsRef.current = widths;
  const minWidthByColumn = useRef(new Map<string, number | undefined>());
  minWidthByColumn.current = new Map(columns.map(column => [column.id, column.minWidth]));

  const registerHeaderCell = useCallback((columnId: string, node: HTMLElement | null) => {
    if (node) {
      headerCellRefs.current.set(columnId, node);
    } else {
      headerCellRefs.current.delete(columnId);
    }
  }, []);

  const applyWidths = useCallback(
    (next: Record<string, number>) => {
      if (!isWidthControlled) {
        setUncontrolledWidths(next);
      }
      if (onColumnWidthsChange) {
        fireNonCancelableEvent(onColumnWidthsChange, { widths: next });
      }
    },
    [isWidthControlled, onColumnWidthsChange]
  );

  const resizeState = useRef<{ columnId: string; startX: number; startWidth: number } | null>(null);
  const startColumnResize = useCallback(
    (columnId: string, event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      // Freeze-on-first-resize: snapshot the CURRENT rendered px width of every column so the
      // flexible (1fr) tracks become fixed px, making the drag predictable and alignment-safe.
      const frozen: Record<string, number> = { ...widthsRef.current };
      let needSnapshot = false;
      headerCellRefs.current.forEach((node, id) => {
        if (frozen[id] === undefined) {
          frozen[id] = Math.round(node.getBoundingClientRect().width);
          needSnapshot = true;
        }
      });
      const startWidth =
        frozen[columnId] ?? Math.round(headerCellRefs.current.get(columnId)?.getBoundingClientRect().width ?? 0);
      resizeState.current = { columnId, startX: event.clientX, startWidth };
      if (needSnapshot) {
        applyWidths(frozen);
      }
      const onMove = (moveEvent: PointerEvent) => {
        const state = resizeState.current;
        if (!state) {
          return;
        }
        const min = minWidthByColumn.current.get(state.columnId) ?? 0;
        const next = Math.max(min, Math.round(state.startWidth + (moveEvent.clientX - state.startX)));
        applyWidths({ ...widthsRef.current, [state.columnId]: next });
      };
      const onUp = () => {
        resizeState.current = null;
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    },
    [applyWidths]
  );

  // Component-owned expansion + shared windowing engine over the (possibly filtered) view.
  const expansion = useExpansion({ trackBy, expandedItems, defaultExpandedItems, onExpandChange });
  const model = useVirtualModel({
    items: visibleItems,
    trackBy,
    expandedIds: expansion.expandedIds,
    expandedSignature: expansion.expandedSignature,
    estimatedRowHeight,
    getRowHeight,
    getExpandedRowHeight,
    defaultExpandedEstimate: presetExpandedHeight(expandedContentPreset),
    overscan,
    scrollContainerRef,
  });

  // Fire the dataset-relative visible range for scroll-triggered prefetch (in an effect, never
  // during render). Held in a stable callback so a consumer passing a fresh inline handler each
  // render cannot re-run this effect (which would loop: fire -> setState -> re-render -> new
  // handler identity -> fire...). The effect depends only on the range indices.
  const fireVisibleRangeChange = useStableCallback((firstIndex: number, lastIndex: number) => {
    if (onVisibleRangeChange) {
      fireNonCancelableEvent(onVisibleRangeChange, { firstIndex, lastIndex });
    }
  });
  useEffect(() => {
    if (model.firstIndex >= 0) {
      fireVisibleRangeChange(model.firstIndex, model.lastIndex);
    }
  }, [model.firstIndex, model.lastIndex, fireVisibleRangeChange]);

  // Built-in live tail: pin-to-newest on append while following; release on scroll-away.
  useLiveTail({
    follow,
    itemCount: visibleItems.length,
    scrollContainerRef,
    scrollToEnd: model.scrollToEnd,
    isPinnedToEnd: model.isPinnedToEnd,
    onFollowChange,
  });

  // Debounced polite append announcement, keyed on the full dataset count.
  const appendMessage = useLiveAnnouncement(
    items.length,
    renderAppendAnnouncement
      ? detail => renderAppendAnnouncement({ appendedCount: detail.addedCount })
      : i18nStrings?.appendAnnouncementText
        ? detail => i18nStrings.appendAnnouncementText!(detail.addedCount)
        : undefined
  );

  // The resolved shared histogram y-scale for the patterns view: consumer-supplied peak
  // across the FULL dataset when given. NOTE (panel/-cw-patterns): a component-computed
  // default peak needs a histogram-value accessor the config does not yet expose, so the
  // core surfaces only the supplied value; -cw-patterns supplies it and this seam is
  // flagged for the panel rather than invented here.
  const histogramPeak = viewConfig.type === 'patterns' ? viewConfig.histogramPeak : undefined;

  // Active-descendant keyboard model: the scroll container is the single always-present
  // tab stop (reachable at any offset, incl. live-tail pinned-to-end); arrows move an
  // active ROW (row-granular grid, matching the F1 pinned deviation) and never steal keys
  // from interactive cell content or the expanded region (onGridKeyDown bails unless the
  // grid itself is focused).
  const idToIndex = useMemo(() => {
    const map = new Map<string, number>();
    visibleItems.forEach((item, index) => map.set(trackBy(item), index));
    return map;
  }, [visibleItems, trackBy]);

  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [hasFocus, setHasFocus] = useState(false);
  const windowedDataIds = new Set(
    model.slots.filter(slot => slot.type === 'data').map(slot => trackBy(visibleItems[slot.index]))
  );
  const effectiveActiveId =
    activeId && idToIndex.has(activeId) ? activeId : visibleItems.length ? trackBy(visibleItems[0]) : undefined;
  // F-ACTIVE: gate the active-row indication on the grid actually holding focus. This single
  // gate drives BOTH the visual .row-active outline and aria-activedescendant, so nothing is
  // advertised or painted before any interaction (a seeded first row otherwise shows a ring on
  // load). Keyboard nav still seeds from effectiveActiveId because it only fires while focused.
  const gatedActiveId = hasFocus ? effectiveActiveId : undefined;
  const activeDescendant =
    gatedActiveId && windowedDataIds.has(gatedActiveId) ? rowDomId(baseId, gatedActiveId) : undefined;

  const moveActive = useCallback(
    (delta: number | 'first' | 'last') => {
      if (!visibleItems.length) {
        return;
      }
      const currentIndex = effectiveActiveId ? (idToIndex.get(effectiveActiveId) ?? 0) : 0;
      let target: number;
      if (delta === 'first') {
        target = 0;
      } else if (delta === 'last') {
        target = visibleItems.length - 1;
      } else {
        target = Math.min(visibleItems.length - 1, Math.max(0, currentIndex + delta));
      }
      setActiveId(trackBy(visibleItems[target]));
      model.scrollToIndex(target);
    },
    [visibleItems, effectiveActiveId, idToIndex, trackBy, model]
  );

  const onGridKeyDown = (event: React.KeyboardEvent) => {
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
        moveActive('first');
        break;
      case 'End':
        event.preventDefault();
        moveActive('last');
        break;
    }
  };

  // Reflect-not-sort: the component reflects sort intent + fires onSortingChange; the
  // console applies the sort to `items`. Sort is a patterns-view capability (CW-9).
  const handleSort = (column: VirtualTableProps.ColumnDefinition<T>) => {
    const active = sortingColumn?.id === column.id;
    const nextDescending = active ? !sortingDescending : false;
    fireNonCancelableEvent(onSortingChange, { sortingColumn: column, sortingDescending: nextDescending });
  };
  const ariaSortOf = (
    column: VirtualTableProps.ColumnDefinition<T>
  ): 'ascending' | 'descending' | 'none' | undefined => {
    if (!column.sortingField) {
      return undefined;
    }
    if (sortingColumn?.id === column.id) {
      return sortingDescending ? 'descending' : 'ascending';
    }
    return 'none';
  };

  // Match navigation (mark-in-place): keyboard-operable next/previous-match reveal.
  const revealMatch = (visibleIndex: number) => {
    if (visibleIndex < 0) {
      return;
    }
    setActiveId(trackBy(visibleItems[visibleIndex]));
    model.scrollToIndex(visibleIndex);
    // Move keyboard focus to the grid so the revealed match becomes the active descendant
    // (under the F-ACTIVE focus gate) and arrow keys continue from it.
    scrollContainerRef.current?.focus();
  };

  useImperativeHandle(
    imperativeRef,
    () => ({
      scrollToEnd: () => model.scrollToEnd(),
      scrollToItem: (key: string) => {
        const index = idToIndex.get(key);
        if (index !== undefined) {
          model.scrollToIndex(index);
        }
      },
      // CW-13 reveal: expand + scroll a row into view. If a subset filter has hidden the
      // row it is not in visibleItems and cannot be scrolled to; clearing a
      // consumer-owned subset filter needs a console hook — flagged for the panel.
      revealItem: (key: string) => {
        const index = idToIndex.get(key);
        if (index === undefined) {
          return;
        }
        expansion.expand(visibleItems[index]);
        setActiveId(key);
        model.scrollToIndex(index);
      },
      isPinnedToEnd: () => model.isPinnedToEnd(),
    }),
    [model, idToIndex, visibleItems, expansion]
  );

  const showEmpty = !loading && visibleItems.length === 0;
  const regionLabel = (item: T) => i18nStrings?.expandedRegionLabel ?? ariaLabels?.expandRowLabel?.(item);

  const renderDataRow = (index: number, start: number, size: number, auto: boolean) => {
    const item = visibleItems[index];
    const id = trackBy(item);
    const expanded = expansion.isExpanded(id);
    const isFilterMatch = filterModel.isMatch(id);
    const toggleId = `${baseId}-toggle-${id}`;
    const regionId = `${baseId}-region-${id}`;
    const context: VirtualTableProps.CellContext = {
      rowIndex: index,
      totalItemCount: visibleItems.length,
      isExpanded: expanded,
      isFilterMatch,
      histogramPeak,
    };
    return (
      <div
        key={id}
        id={rowDomId(baseId, id)}
        className={clsx(styles.row, gatedActiveId === id && styles['row-active'])}
        role="row"
        aria-rowindex={index + 2}
        ref={auto ? model.measureRef('d:' + id, auto) : undefined}
        style={{
          position: 'absolute',
          insetBlockStart: start,
          insetInlineStart: 0,
          inlineSize: '100%',
          gridTemplateColumns,
          // F-ROWH: clamp a fixed (non-measured) row to its windowed pitch so a content-taller
          // row cannot overlap the next; measured ('auto') rows stay content-sized.
          blockSize: auto ? undefined : size,
        }}
      >
        {hasDisclosureColumn && (
          <span className={styles['disclosure-cell']} role="gridcell" aria-colindex={disclosureColIndex}>
            {/* Reuse the shared ExpandToggleButton — same rotating caret + button a11y as Table's
                expandable rows. The disclosure-button class is retained so test-utils
                findExpandToggle still resolves it; id + aria-controls tie it to the region. */}
            <ExpandToggleButton
              className={styles['disclosure-button']}
              isExpanded={expanded}
              onExpandableItemToggle={() => expansion.toggle(item)}
              expandButtonLabel={ariaLabels?.expandRowLabel?.(item)}
              collapseButtonLabel={ariaLabels?.collapseRowLabel?.(item)}
              id={toggleId}
              ariaControls={expanded ? regionId : undefined}
            />
          </span>
        )}
        {hasIndicatorColumn && (
          <span className={styles['indicator-cell']} role="gridcell" aria-colindex={indicatorColIndex}>
            {isFilterMatch && (
              // Non-visual match conveyance (WCAG 1.4.1): a visually-hidden text label
              // carries the match to assistive tech; the visible marker is decorative.
              <>
                <span className={styles['indicator-marker']} aria-hidden={true} />
                <span className={styles['visually-hidden']}>
                  {ariaLabels?.filterMatchLabel?.(item) ?? 'Filter match'}
                </span>
              </>
            )}
          </span>
        )}
        {isRaw ? (
          <span className={styles.cell} role="gridcell" aria-colindex={dataColumnStart}>
            {renderLine?.(item)}
          </span>
        ) : (
          columns.map((column, columnIndex) => (
            <span
              key={column.id}
              className={clsx(styles.cell, filterModel.isCellHighlighted(item, column.id) && styles['cell-highlight'])}
              role="gridcell"
              aria-colindex={dataColumnStart + columnIndex}
            >
              {column.cell(item, context)}
            </span>
          ))
        )}
      </div>
    );
  };

  const renderExpandedRow = (index: number, start: number, size: number, auto: boolean) => {
    const item = visibleItems[index];
    const id = trackBy(item);
    const toggleId = `${baseId}-toggle-${id}`;
    const regionId = `${baseId}-region-${id}`;
    return (
      <div
        key={'e:' + id}
        className={styles['expanded-row']}
        role="row"
        aria-rowindex={index + 2}
        ref={model.measureRef('e:' + id, auto)}
        style={{
          position: 'absolute',
          insetBlockStart: start,
          insetInlineStart: 0,
          inlineSize: '100%',
          gridTemplateColumns,
          // F-ROWH: a fixed-height expanded region clamps to its slot; measured regions stay auto.
          blockSize: auto ? undefined : size,
        }}
      >
        {/* Full-width gridcell keeps a valid grid child model; the arbitrary, non-tabular
            content lives in a labeled region inside it (design B2). A div (not a span)
            hosts content that may include block-level elements. */}
        <div className={styles['expanded-cell']} role="gridcell" aria-colindex={1} aria-colspan={columnCount}>
          <div
            id={regionId}
            className={styles['expanded-region']}
            role="region"
            aria-label={regionLabel(item)}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                document.getElementById(toggleId)?.focus();
              }
            }}
          >
            {getExpandedContent?.(item, { rowIndex: index, totalItemCount: visibleItems.length })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      {(onFollowChange || filter) && (
        <div className={styles.toolbar}>
          {onFollowChange && (
            <button
              type="button"
              className={styles['follow-toggle']}
              aria-pressed={follow}
              onClick={() => fireNonCancelableEvent(onFollowChange, { follow: !follow, reason: 'control' })}
            >
              {ariaLabels?.followToggleLabel}
            </button>
          )}
          {/* Total-vs-filtered count is shown for BOTH modes (subset uses the filtered
              length, mark-in-place the match count); match navigation is mark-in-place only. */}
          {filter && (
            <span className={styles['match-count']}>
              {i18nStrings?.filterCountText?.(filterModel.matchedCount, filterModel.totalCount)}
            </span>
          )}
          {filter && filterModel.hasIndicatorColumn && (
            <div className={styles['match-nav']} role="group" aria-label={ariaLabels?.matchNavigationLabel}>
              <button
                type="button"
                className={styles['match-nav-button']}
                aria-label={ariaLabels?.previousMatchLabel}
                onClick={() => revealMatch(filterModel.goToPreviousMatch())}
              >
                <span aria-hidden={true}>{'\u2039'}</span>
              </button>
              <button
                type="button"
                className={styles['match-nav-button']}
                aria-label={ariaLabels?.nextMatchLabel}
                onClick={() => revealMatch(filterModel.goToNextMatch())}
              >
                <span aria-hidden={true}>{'\u203a'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className={clsx(styles['scroll-container'], stickyHeader && styles['sticky-header'])}
        role="grid"
        tabIndex={0}
        aria-label={ariaLabels?.gridLabel}
        aria-rowcount={visibleItems.length + 1}
        aria-colcount={columnCount}
        aria-activedescendant={activeDescendant}
        style={{ blockSize: height, maxBlockSize: maxHeight }}
        onKeyDown={onGridKeyDown}
        onFocus={event => {
          // F-ACTIVE: only the grid container itself holding focus advertises an active row.
          // focusin bubbles, so guard against a descendant control (disclosure / expanded
          // content) false-activating the grid.
          if (event.target === event.currentTarget) {
            setHasFocus(true);
          }
        }}
        onBlur={event => {
          if (event.target === event.currentTarget) {
            setHasFocus(false);
          }
        }}
      >
        <div className={styles['header-rowgroup']} role="rowgroup">
          <div className={styles['header-row']} role="row" aria-rowindex={1} style={{ gridTemplateColumns }}>
            {hasDisclosureColumn && (
              <span className={styles['disclosure-header']} role="columnheader" aria-colindex={disclosureColIndex} />
            )}
            {hasIndicatorColumn && (
              <span className={styles['indicator-header']} role="columnheader" aria-colindex={indicatorColIndex} />
            )}
            {isRaw ? (
              <span className={styles['header-cell']} role="columnheader" aria-colindex={dataColumnStart} />
            ) : (
              columns.map((column, columnIndex) => {
                const sort = ariaSortOf(column);
                return (
                  <span
                    key={column.id}
                    className={styles['header-cell']}
                    role="columnheader"
                    aria-colindex={dataColumnStart + columnIndex}
                    aria-sort={sort}
                    ref={node => registerHeaderCell(column.id, node)}
                  >
                    {sort ? (
                      <button type="button" className={styles['sort-button']} onClick={() => handleSort(column)}>
                        {column.header}
                        {(sort === 'ascending' || sort === 'descending') && (
                          // B3: visible sort-direction indicator on the active column (decorative
                          // glyph; aria-sort on the columnheader carries the accessible cue).
                          <span className={styles['sorting-icon']}>
                            <InternalIcon name={sort === 'descending' ? 'caret-down-filled' : 'caret-up-filled'} />
                          </span>
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                    {resizableColumns && (
                      // Pointer-only resize affordance pinned to the header cell's inline-end edge
                      // (aria-hidden — the columnheader keeps its role); drives the shared template.
                      <span
                        aria-hidden="true"
                        className={styles['resize-handle']}
                        onPointerDown={event => startColumnResize(column.id, event)}
                      />
                    )}
                  </span>
                );
              })
            )}
          </div>
        </div>

        {!loading && !showEmpty && (
          <div className={styles.body} role="rowgroup" style={{ blockSize: model.totalSize, position: 'relative' }}>
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
          {loadingText ?? i18nStrings?.loadingText}
        </div>
      )}

      {showEmpty && empty !== undefined && empty !== null && <div className={styles.empty}>{empty}</div>}

      <div className={styles['live-region']} aria-live="polite" aria-atomic="true">
        {appendMessage}
      </div>
    </div>
  );
}

function rowDomId(baseId: string, id: string): string {
  return `${baseId}-row-${id}`;
}

// Default pre-measurement runway for an expanded region, seeded by the active preset
// (shape A log-record ~300, shape B pattern-detail ~150). The real height is measured.
function presetExpandedHeight(preset?: VirtualTableProps.ExpandedContentPreset): number {
  return preset === 'pattern-detail' ? 150 : 300;
}
