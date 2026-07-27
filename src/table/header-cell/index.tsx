// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useResizeObserver, useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useInternalI18n } from '../../i18n/context';
import InternalIcon from '../../icon/internal';
import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { fireNonCancelableEvent } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';
import { GeneratedAnalyticsMetadataTableSort } from '../analytics-metadata/interfaces';
import { TableProps } from '../interfaces';
import {
  appendSort,
  getSortIndex,
  removeSort,
  replaceSort,
  setDirection,
  toggleDirection,
} from '../multi-column-sort/utils';
import { Divider, Resizer } from '../resizer';
import { BaseHeaderCellProps } from './common-props';
import { SortMenu, SortMenuAction } from './sort-menu';
import { TableThElement } from './th-element';
import { getSortingIconName, getSortingStatus, isSorted } from './utils';

import analyticsSelectors from '../analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export interface TableHeaderCellProps<ItemType> extends BaseHeaderCellProps {
  column: TableProps.ColumnDefinition<ItemType>;
  activeSortingColumn?: TableProps.SortingColumn<ItemType>;
  sortingDescending?: boolean;
  sortingDisabled?: boolean;
  stuck?: boolean;
  onClick(detail: TableProps.SortingState<any>): void;
  multiColumnSort?: TableProps.MultiColumnSort<ItemType>;
  i18nStrings?: TableProps.I18nStrings;
  ariaLabels?: TableProps.AriaLabels<ItemType>;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  isEditable?: boolean;
  columnId: PropertyKey;
  isExpandable?: boolean;
  hasDynamicContent?: boolean;
  colSpan?: number;
  rowSpan?: number;
  columnGroupId?: string;
  isLastChildOfGroup?: boolean;
  isLast?: boolean;
}

export function TableHeaderCell<ItemType>({
  tabIndex,
  column,
  activeSortingColumn,
  sortingDescending,
  sortingDisabled,
  wrapLines,
  focusedComponent,
  stuck,
  sticky,
  hidden,
  stripedRows,
  onClick,
  colIndex,
  updateColumn,
  resizableColumns,
  resizableStyle,
  onResizeFinish,
  isEditable,
  columnId,
  stickyState,
  cellRef,
  tableRole,
  resizerRoleDescription,
  resizerTooltipText,
  isExpandable,
  hasDynamicContent,
  variant,
  colSpan,
  rowSpan,
  columnGroupId,
  isLastChildOfGroup,
  isLast,
  tableVariant,
  multiColumnSort,
  i18nStrings,
  ariaLabels,
}: TableHeaderCellProps<ItemType>) {
  const i18n = useInternalI18n('table');
  const sortable = !!column.sortingComparator || !!column.sortingField;
  const isGrouped = !!columnGroupId || (rowSpan ?? 1) > 1;
  // The sort menu only renders for a sortable, enabled column under multi-column sort.
  const hasSortMenu = !!multiColumnSort && sortable && !sortingDisabled;

  // Multi-column sort context — derived from `multiColumnSort.sortingColumns` when present.
  const multiSortIndex = multiColumnSort ? getSortIndex(multiColumnSort.sortingColumns, column) : null;
  const multiSortEntry =
    multiSortIndex !== null && multiColumnSort ? multiColumnSort.sortingColumns[multiSortIndex - 1] : undefined;
  const inMultiSort = multiSortIndex !== null;
  const isPrimaryMultiSort = multiSortIndex === 1;
  // Priority badges are only meaningful when 2+ columns are sorted; with a single column, the position number adds no information.
  const showPriorityBadge = !!multiColumnSort && multiColumnSort.sortingColumns.length >= 2 && multiSortIndex !== null;

  // For multi-sort, derive sorted/descending from the matching entry; otherwise fall back to single-sort props.
  const sorted = multiColumnSort ? inMultiSort : !!activeSortingColumn && isSorted(column, activeSortingColumn);
  const descending = multiColumnSort ? !!multiSortEntry?.isDescending : !!sortingDescending;
  const sortingStatus = getSortingStatus(sortable, sorted, descending, !!sortingDisabled);
  // In multi-sort, only the primary column declares aria-sort (ARIA only allows one column sorted at a time).
  const suppressAriaSort = !!multiColumnSort && inMultiSort && !isPrimaryMultiSort;

  // Screen-reader-only text appended to a sorted column header. The visible header text supplies the column name;
  // this adds the sort direction (only when `aria-sort` is suppressed, i.e. secondary columns) and the sort priority.
  const sortDirectionLabel = descending
    ? i18n('ariaLabels.sortDescending', ariaLabels?.sortDescending)
    : i18n('ariaLabels.sortAscending', ariaLabels?.sortAscending);
  const sortPriorityLabel = i18n(
    'ariaLabels.sortPriority',
    ariaLabels?.sortPriority,
    format =>
      ({ priority }) =>
        format({ priority })
  );
  const sortAccessibleText = inMultiSort
    ? [
        suppressAriaSort ? sortDirectionLabel : undefined,
        showPriorityBadge ? sortPriorityLabel?.({ priority: multiSortIndex ?? 0 }) : undefined,
      ]
        .filter(Boolean)
        .join(' ')
    : '';
  const handleClick = (shiftKey = false) => {
    if (multiColumnSort) {
      const current = multiColumnSort.sortingColumns;
      let next: ReadonlyArray<TableProps.SortingState<ItemType>>;
      if (shiftKey && !inMultiSort) {
        next = appendSort(current, column, false);
      } else if (inMultiSort) {
        next = toggleDirection(current, column);
      } else {
        next = replaceSort(column, false);
      }
      fireNonCancelableEvent(multiColumnSort.onChange, { sortingColumns: next });
      return;
    }
    onClick({
      sortingColumn: column,
      isDescending: sorted ? !sortingDescending : false,
    });
  };

  const handleSortMenuAction = (action: SortMenuAction) => {
    // The sort menu is only rendered when `multiColumnSort` is set (see render below), so this guard
    // exists purely to narrow the type for the accesses that follow and is unreachable at runtime.
    /* istanbul ignore next */
    if (!multiColumnSort) {
      return;
    }
    const current = multiColumnSort.sortingColumns;
    let next: ReadonlyArray<TableProps.SortingState<ItemType>>;
    switch (action) {
      case 'sort-ascending':
        next = inMultiSort ? setDirection(current, column, false) : replaceSort(column, false);
        break;
      case 'sort-descending':
        next = inMultiSort ? setDirection(current, column, true) : replaceSort(column, true);
        break;
      case 'add-to-sort-ascending':
        next = appendSort(current, column, false);
        break;
      case 'add-to-sort-descending':
        next = appendSort(current, column, true);
        break;
      case 'remove-from-sort':
        next = removeSort(current, column);
        break;
    }
    fireNonCancelableEvent(multiColumnSort.onChange, { sortingColumns: next });
  };

  // Elements with role="button" do not have the default behavior of <button>, where pressing
  // Enter or Space will trigger a click event. Therefore we need to add this ourselves.
  // The native <button> element cannot be used due to a misaligned implementation in Firefox:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=843003
  const handleKeyPress = ({ nativeEvent: e }: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.enter || e.keyCode === KeyCode.space) {
      e.preventDefault();
      handleClick(e.shiftKey);
    }
  };

  const headerId = useUniqueId('table-header-');

  const clickableHeaderRef = useRef<HTMLDivElement>(null);
  const { tabIndex: clickableHeaderTabIndex } = useSingleTabStopNavigation(clickableHeaderRef, { tabIndex });

  const cellRefObject = useRef<HTMLElement>(null);
  const cellRefCombined = useMergeRefs(cellRef, cellRefObject);

  // Keep sticky and non-sticky headers in sync for dynamic cell
  // content changes. This is only needed when:
  // - Column has dynamic content
  // - This is the non-sticky version of a sticky header (hidden === true)
  // - Columns are not resizable
  useResizeObserver(hasDynamicContent ? cellRefObject : () => null, entry => {
    updateColumn(columnId, entry.borderBoxWidth);
  });

  return (
    <TableThElement
      resizableStyle={resizableStyle}
      cellRef={cellRefCombined}
      sortingStatus={sortingStatus}
      sortingDisabled={sortingDisabled}
      suppressAriaSort={suppressAriaSort}
      focusedComponent={focusedComponent}
      stuck={stuck}
      sticky={sticky}
      resizable={resizableColumns}
      hidden={hidden}
      stripedRows={stripedRows}
      colIndex={colIndex}
      columnId={columnId}
      stickyState={stickyState}
      tableRole={tableRole}
      variant={variant}
      tableVariant={tableVariant}
      colSpan={colSpan}
      rowSpan={rowSpan}
      columnGroupId={columnGroupId}
      isLast={isLast}
      {...(sortingDisabled
        ? {}
        : getAnalyticsMetadataAttribute({
            action: 'sort',
            detail: {
              position: `${colIndex + 1}`,
              columnId: column.id ? `${column.id}` : '',
              label: `.${analyticsSelectors['header-cell-text']}`,
              sortingDescending: `${!descending}`,
            },
          } as GeneratedAnalyticsMetadataTableSort))}
    >
      <div className={clsx(styles['header-cell-main'], hasSortMenu && styles['header-cell-main-with-menu'])}>
        <div
          ref={clickableHeaderRef}
          data-focus-id={`sorting-control-${String(columnId)}`}
          className={clsx(styles['header-cell-content'], {
            [styles['header-cell-fake-focus']]: focusedComponent === `sorting-control-${String(columnId)}`,
            [styles['header-cell-content-expandable']]: isExpandable,
            [styles['header-cell-content-multi-sorted']]: showPriorityBadge,
            [styles['header-cell-content-with-menu']]: hasSortMenu,
          })}
          aria-label={
            column.ariaLabel
              ? column.ariaLabel({
                  sorted: sorted,
                  descending: sorted && descending,
                  disabled: !!sortingDisabled,
                  sortIndex: multiSortIndex ?? undefined,
                })
              : undefined
          }
          {...(sortingStatus && !sortingDisabled
            ? {
                onKeyPress: handleKeyPress,
                tabIndex: clickableHeaderTabIndex,
                role: 'button',
                onClick: event => handleClick(event.shiftKey),
                // Prevent the browser from extending the text selection on Shift+click.
                onMouseDown: (event: React.MouseEvent) => {
                  if (event.shiftKey) {
                    event.preventDefault();
                  }
                },
              }
            : {})}
        >
          <div
            className={clsx(
              styles['header-cell-text'],
              analyticsSelectors['header-cell-text'],
              wrapLines && styles['header-cell-text-wrap']
            )}
            id={headerId}
          >
            {column.header}
            {isEditable ? (
              <span className={styles['edit-icon']}>
                <InternalIcon
                  name="edit"
                  ariaLabel={i18n(
                    'columnDefinitions.editConfig.editIconAriaLabel',
                    column.editConfig?.editIconAriaLabel
                  )}
                />
              </span>
            ) : null}
          </div>
          {sortAccessibleText && <ScreenreaderOnly>{sortAccessibleText}</ScreenreaderOnly>}
          {sortingStatus && (
            <span className={styles['sorting-icon']}>
              {showPriorityBadge && (
                <span className={styles['sort-priority-badge']} aria-hidden="true">
                  {multiSortIndex}
                </span>
              )}
              <InternalIcon name={getSortingIconName(sortingStatus)} />
            </span>
          )}
        </div>
        {hasSortMenu && (
          <SortMenu<ItemType>
            column={column}
            inSort={inMultiSort}
            isSortedAscending={inMultiSort && !descending}
            isSortedDescending={inMultiSort && descending}
            i18nStrings={i18nStrings}
            ariaLabel={ariaLabels?.sortMenuTriggerLabel}
            ariaDescribedby={headerId}
            onAction={handleSortMenuAction}
          />
        )}
      </div>
      {resizableColumns ? (
        <Resizer
          tabIndex={tabIndex}
          focusId={`resize-control-${String(columnId)}`}
          showFocusRing={focusedComponent === `resize-control-${String(columnId)}`}
          onWidthUpdate={newWidth => updateColumn(columnId, newWidth)}
          onWidthUpdateCommit={onResizeFinish}
          ariaLabelledby={headerId}
          minWidth={typeof column.minWidth === 'string' ? parseInt(column.minWidth) : column.minWidth}
          roleDescription={i18n('ariaLabels.resizerRoleDescription', resizerRoleDescription)}
          // TODO: Replace with this when strings are available
          // tooltipText={i18n('ariaLabels.resizerTooltipText', resizerTooltipText)}
          tooltipText={resizerTooltipText}
          isBorderless={variant === 'full-page' || variant === 'embedded' || variant === 'borderless'}
          isLast={isLast}
          isGrouped={isGrouped}
          dividerPosition={isLastChildOfGroup ? 'top' : undefined}
        />
      ) : (
        <Divider
          className={styles['resize-divider']}
          position={isLastChildOfGroup ? 'top' : undefined}
          isGrouped={isGrouped}
        />
      )}
    </TableThElement>
  );
}
