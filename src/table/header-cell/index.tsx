// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useInternalI18n } from '../../i18n/context.js';
import InternalIcon from '../../icon/internal.js';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context.js';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs/index.js';
import { useUniqueId } from '../../internal/hooks/use-unique-id/index.js';
import { KeyCode } from '../../internal/keycode.js';
import { GeneratedAnalyticsMetadataTableSort } from '../analytics-metadata/interfaces.js';
import { ColumnWidthStyle } from '../column-widths-utils.js';
import { TableProps } from '../interfaces.js';
import { Divider, Resizer } from '../resizer/index.js';
import { StickyColumnsModel } from '../sticky-columns/index.js';
import { TableRole } from '../table-role/index.js';
import { TableThElement } from './th-element.js';
import { getSortingIconName, getSortingStatus, isSorted } from './utils.js';

import analyticsSelectors from '../analytics-metadata/styles.css.js';
import styles from './styles.css.js';

export interface TableHeaderCellProps<ItemType> {
  tabIndex: number;
  column: TableProps.ColumnDefinition<ItemType>;
  activeSortingColumn?: TableProps.SortingColumn<ItemType>;
  sortingDescending?: boolean;
  sortingDisabled?: boolean;
  wrapLines?: boolean;
  stuck?: boolean;
  sticky?: boolean;
  hidden?: boolean;
  stripedRows?: boolean;
  onClick(detail: TableProps.SortingState<any>): void;
  onResizeFinish: () => void;
  colIndex: number;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  resizableColumns?: boolean;
  resizableStyle?: ColumnWidthStyle;
  isEditable?: boolean;
  columnId: PropertyKey;
  stickyState: StickyColumnsModel;
  cellRef: React.RefCallback<HTMLElement>;
  focusedComponent?: null | string;
  tableRole: TableRole;
  resizerRoleDescription?: string;
  isExpandable?: boolean;
  hasDynamicContent?: boolean;
  variant: TableProps.Variant;
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
  isExpandable,
  hasDynamicContent,
  variant,
}: TableHeaderCellProps<ItemType>) {
  const i18n = useInternalI18n('table');
  const sortable = !!column.sortingComparator || !!column.sortingField;
  const sorted = !!activeSortingColumn && isSorted(column, activeSortingColumn);
  const sortingStatus = getSortingStatus(sortable, sorted, !!sortingDescending, !!sortingDisabled);
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
      hidden={hidden}
      stripedRows={stripedRows}
      colIndex={colIndex}
      columnId={columnId}
      stickyState={stickyState}
      tableRole={tableRole}
      variant={variant}
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
            <InternalIcon name={getSortingIconName(sortingStatus)} />
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
        />
      ) : (
        <Divider className={styles['resize-divider']} />
      )}
    </TableThElement>
  );
}
