// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useResizeObserver, useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useInternalI18n } from '../../i18n/context';
import InternalIcon from '../../icon/internal';
import { IconOverride } from '../../icon-provider/icon-override';
import { KeyCode } from '../../internal/keycode';
import { GeneratedAnalyticsMetadataTableSort } from '../analytics-metadata/interfaces';
import { TableProps } from '../interfaces';
import { Divider, Resizer } from '../resizer';
import { BaseHeaderCellProps } from './common-props';
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
}: TableHeaderCellProps<ItemType>) {
  const i18n = useInternalI18n('table');
  const sortable = !!column.sortingComparator || !!column.sortingField;
  const sorted = !!activeSortingColumn && isSorted(column, activeSortingColumn);
  const sortingStatus = getSortingStatus(sortable, sorted, !!sortingDescending, !!sortingDisabled);
  const isGrouped = !!columnGroupId || (rowSpan ?? 1) > 1;
  const handleClick = () =>
    onClick({
      sortingColumn: column,
      isDescending: sorted ? !sortingDescending : false,
    });

  // Elements with role="button" do not have the default behavior of <button>, where pressing
  // Enter or Space will trigger a click event. Therefore we need to add this ourselves.
  // The native <button> element cannot be used due to a misaligned implementation in Firefox:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=843003
  const handleKeyPress = ({ nativeEvent: e }: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.enter || e.keyCode === KeyCode.space) {
      e.preventDefault();
      handleClick();
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
              sortingDescending: `${!sortingDescending}`,
            },
          } as GeneratedAnalyticsMetadataTableSort))}
    >
      <div
        ref={clickableHeaderRef}
        data-focus-id={`sorting-control-${String(columnId)}`}
        className={clsx(styles['header-cell-content'], {
          [styles['header-cell-fake-focus']]: focusedComponent === `sorting-control-${String(columnId)}`,
          [styles['header-cell-content-expandable']]: isExpandable,
        })}
        aria-label={
          column.ariaLabel
            ? column.ariaLabel({
                sorted: sorted,
                descending: sorted && !!sortingDescending,
                disabled: !!sortingDisabled,
              })
            : undefined
        }
        {...(sortingStatus && !sortingDisabled
          ? {
              onKeyPress: handleKeyPress,
              tabIndex: clickableHeaderTabIndex,
              role: 'button',
              onClick: handleClick,
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
                ariaLabel={i18n('columnDefinitions.editConfig.editIconAriaLabel', column.editConfig?.editIconAriaLabel)}
              />
            </span>
          ) : null}
        </div>
        {sortingStatus && (
          <span className={styles['sorting-icon']}>
            <IconOverride
              overrideName="sorting-indicator"
              state={{ sortingState: sortingStatus }}
              fallback={{ name: getSortingIconName(sortingStatus) }}
            />
          </span>
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
