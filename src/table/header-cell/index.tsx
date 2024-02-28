// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import InternalIcon from '../../icon/internal';
import { KeyCode } from '../../internal/keycode';
import { TableProps } from '../interfaces';
import { getSortingIconName, getSortingStatus, isSorted } from './utils';
import styles from './styles.css.js';
import { Divider, Resizer } from '../resizer';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { useInternalI18n } from '../../i18n/context';
import { StickyColumnsModel } from '../sticky-columns';
import { TableRole } from '../table-role';
import { TableThElement } from './th-element';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';

interface TableHeaderCellProps<ItemType> {
  className?: string;
  style?: React.CSSProperties;
  tabIndex: number;
  column: TableProps.ColumnDefinition<ItemType>;
  activeSortingColumn?: TableProps.SortingColumn<ItemType>;
  sortingDescending?: boolean;
  sortingDisabled?: boolean;
  wrapLines?: boolean;
  hidden?: boolean;
  onClick(detail: TableProps.SortingState<any>): void;
  onClickCapture(): void;
  onResizeFinish: () => void;
  colIndex: number;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  resizableColumns?: boolean;
  isEditable?: boolean;
  columnId: PropertyKey;
  stickyState: StickyColumnsModel;
  cellRef: React.RefCallback<HTMLElement>;
  focusedComponent?: null | string;
  tableRole: TableRole;
  resizerRoleDescription?: string;
}

export function TableHeaderCell<ItemType>({
  className,
  style,
  tabIndex,
  column,
  activeSortingColumn,
  sortingDescending,
  sortingDisabled,
  wrapLines,
  focusedComponent,
  hidden,
  onClick,
  onClickCapture,
  colIndex,
  updateColumn,
  resizableColumns,
  onResizeFinish,
  isEditable,
  columnId,
  stickyState,
  cellRef,
  tableRole,
  resizerRoleDescription,
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
      onClickCapture();
      e.preventDefault();
      handleClick();
    }
  };

  const headerId = useUniqueId('table-header-');

  const clickableHeaderRef = useRef<HTMLDivElement>(null);
  const { tabIndex: clickableHeaderTabIndex } = useSingleTabStopNavigation(clickableHeaderRef, { tabIndex });

  return (
    <TableThElement
      className={className}
      style={style}
      cellRef={cellRef}
      sortingStatus={sortingStatus}
      sortingDisabled={sortingDisabled}
      focusedComponent={focusedComponent}
      hidden={hidden}
      colIndex={colIndex}
      columnId={columnId}
      stickyState={stickyState}
      tableRole={tableRole}
    >
      <div
        ref={clickableHeaderRef}
        data-focus-id={`sorting-control-${String(columnId)}`}
        className={clsx(styles['header-cell-content'], {
          [styles['header-cell-fake-focus']]: focusedComponent === `sorting-control-${String(columnId)}`,
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
              onClickCapture,
            }
          : {})}
      >
        <div className={clsx(styles['header-cell-text'], wrapLines && styles['header-cell-text-wrap'])} id={headerId}>
          {column.header}
          {isEditable ? (
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
