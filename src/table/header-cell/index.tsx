// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import InternalIcon from '../../icon/internal';
import { KeyCode } from '../../internal/keycode';
import { TableProps } from '../interfaces';
import { getSortingIconName, getSortingStatus, isSorted } from './utils';
import styles from './styles.css.js';
import { Resizer } from '../resizer';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { InteractiveComponent } from '../thead';
import { getStickyClassNames } from '../utils';
import { useInternalI18n } from '../../internal/i18n/context';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { TableRole } from '../table-role';

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
  onResizeFinish: () => void;
  colIndex: number;
  updateColumn: (columnId: PropertyKey, newWidth: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  resizableColumns?: boolean;
  isEditable?: boolean;
  columnId: PropertyKey;
  stickyState: StickyColumnsModel;
  cellRef: React.RefCallback<HTMLElement>;
  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
  tableRole: TableRole;
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
  onFocusedComponentChange,
  hidden,
  onClick,
  colIndex,
  updateColumn,
  resizableColumns,
  onResizeFinish,
  isEditable,
  columnId,
  stickyState,
  cellRef,
  tableRole,
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

  const stickyStyles = useStickyCellStyles({
    stickyColumns: stickyState,
    columnId,
    getClassName: props => getStickyClassNames(styles, props),
  });

  const mergedRef = useMergeRefs(stickyStyles.ref, cellRef);

  return (
    <th
      className={clsx(
        className,
        {
          [styles['header-cell-resizable']]: !!resizableColumns,
          [styles['header-cell-sortable']]: sortingStatus,
          [styles['header-cell-sorted']]: sortingStatus === 'ascending' || sortingStatus === 'descending',
          [styles['header-cell-disabled']]: sortingDisabled,
          [styles['header-cell-ascending']]: sortingStatus === 'ascending',
          [styles['header-cell-descending']]: sortingStatus === 'descending',
          [styles['header-cell-hidden']]: hidden,
        },
        stickyStyles.className
      )}
      style={{ ...style, ...stickyStyles.style }}
      ref={mergedRef}
      {...tableRole.getTableColHeaderProps({ sortingStatus })}
    >
      <div
        className={clsx(styles['header-cell-content'], {
          [styles['header-cell-fake-focus']]: focusedComponent?.type === 'column' && focusedComponent.col === colIndex,
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
              tabIndex: tabIndex,
              role: 'button',
              onClick: handleClick,
              onFocus: () => onFocusedComponentChange?.({ type: 'column', col: colIndex }),
              onBlur: () => onFocusedComponentChange?.(null),
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
      {resizableColumns && (
        <>
          <Resizer
            tabIndex={tabIndex}
            showFocusRing={focusedComponent?.type === 'resizer' && focusedComponent.col === colIndex}
            onDragMove={newWidth => updateColumn(columnId, newWidth)}
            onFinish={onResizeFinish}
            ariaLabelledby={headerId}
            onFocus={() => onFocusedComponentChange?.({ type: 'resizer', col: colIndex })}
            onBlur={() => onFocusedComponentChange?.(null)}
            minWidth={typeof column.minWidth === 'string' ? parseInt(column.minWidth) : column.minWidth}
          />
        </>
      )}
    </th>
  );
}
