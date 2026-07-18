// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
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

  // Fire the dataset-relative visible range for scroll-triggered prefetch (in an effect,
  // never during render).
  useEffect(() => {
    if (onVisibleRangeChange && model.firstIndex >= 0) {
      fireNonCancelableEvent(onVisibleRangeChange, { firstIndex: model.firstIndex, lastIndex: model.lastIndex });
    }
  }, [model.firstIndex, model.lastIndex, onVisibleRangeChange]);

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
  const windowedDataIds = new Set(
    model.slots.filter(slot => slot.type === 'data').map(slot => trackBy(visibleItems[slot.index]))
  );
  const effectiveActiveId =
    activeId && idToIndex.has(activeId) ? activeId : visibleItems.length ? trackBy(visibleItems[0]) : undefined;
  const activeDescendant =
    effectiveActiveId && windowedDataIds.has(effectiveActiveId) ? rowDomId(baseId, effectiveActiveId) : undefined;

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

  const renderDataRow = (index: number, start: number, auto: boolean) => {
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
        className={clsx(styles.row, effectiveActiveId === id && styles['row-active'])}
        role="row"
        aria-rowindex={index + 2}
        ref={auto ? model.measureRef('d:' + id, auto) : undefined}
        style={{ position: 'absolute', insetBlockStart: start, insetInlineStart: 0, inlineSize: '100%' }}
      >
        {hasDisclosureColumn && (
          <span className={styles['disclosure-cell']} role="gridcell" aria-colindex={disclosureColIndex}>
            <button
              id={toggleId}
              type="button"
              className={styles['disclosure-button']}
              aria-expanded={expanded}
              aria-controls={expanded ? regionId : undefined}
              aria-label={expanded ? ariaLabels?.collapseRowLabel?.(item) : ariaLabels?.expandRowLabel?.(item)}
              onClick={() => expansion.toggle(item)}
            />
          </span>
        )}
        {hasIndicatorColumn && (
          <span
            className={styles['indicator-cell']}
            role="gridcell"
            aria-colindex={indicatorColIndex}
            style={{ flex: `0 0 ${INDICATOR_COL_WIDTH}px` }}
          >
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
              style={cellStyle(column, columnWidths, column.id === stretchColumnId)}
            >
              {column.cell(item, context)}
            </span>
          ))
        )}
      </div>
    );
  };

  const renderExpandedRow = (index: number, start: number, auto: boolean) => {
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
        style={{ position: 'absolute', insetBlockStart: start, insetInlineStart: 0, inlineSize: '100%' }}
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
                aria-label={ariaLabels?.previousMatchLabel}
                onClick={() => revealMatch(filterModel.goToPreviousMatch())}
              >
                <span aria-hidden={true}>{'\u2039'}</span>
              </button>
              <button
                type="button"
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
        onKeyDown={onGridKeyDown}
      >
        <div className={styles['header-rowgroup']} role="rowgroup">
          <div className={styles['header-row']} role="row" aria-rowindex={1}>
            {hasDisclosureColumn && (
              <span className={styles['disclosure-header']} role="columnheader" aria-colindex={disclosureColIndex} />
            )}
            {hasIndicatorColumn && (
              <span
                className={styles['indicator-header']}
                role="columnheader"
                aria-colindex={indicatorColIndex}
                style={{ flex: `0 0 ${INDICATOR_COL_WIDTH}px` }}
              />
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
                    style={cellStyle(column, columnWidths, column.id === stretchColumnId)}
                  >
                    {sort ? (
                      <button type="button" className={styles['sort-button']} onClick={() => handleSort(column)}>
                        {column.header}
                      </button>
                    ) : (
                      column.header
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
                ? renderDataRow(slot.index, slot.start, slot.auto)
                : renderExpandedRow(slot.index, slot.start, slot.auto)
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.loading} role="status">
          {loadingText ?? i18nStrings?.loadingText}
        </div>
      )}

      {showEmpty && <div className={styles.empty}>{empty}</div>}

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
