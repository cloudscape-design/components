// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useInternalI18n } from '../../i18n/context';
import InternalIcon from '../../icon/internal';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { KeyCode } from '../../internal/keycode';
import { GeneratedAnalyticsMetadataTableSort } from '../analytics-metadata/interfaces';
import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces';
import { Divider, Resizer } from '../resizer';
import { StickyColumnsModel } from '../sticky-columns';
import { TableRole } from '../table-role';
import { TableThElement } from './th-element';
import { getSortingIconName, getSortingStatus, isSorted } from './utils';

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
      ariaLabelledby={headerId}
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
        {...(sortingStatus && !sortingDisabled
          ? {
              onKeyPress: handleKeyPress,
              tabIndex: clickableHeaderTabIndex,
              role: 'button',
              onClick: handleClick,
              'aria-label': column.ariaLabel
                ? column.ariaLabel({
                    sorted: sorted,
                    descending: sorted && !!sortingDescending,
                    disabled: !!sortingDisabled,
                  })
                : undefined,
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
          {isEditable && !isExpandable ? (
            <span
              className={styles['edit-icon']}
              role="img"
              aria-label={i18n('columnDefinitions.editConfig.editIconAriaLabel', column.editConfig?.editIconAriaLabel)}
            >
              <InternalIcon name="edit" />
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
