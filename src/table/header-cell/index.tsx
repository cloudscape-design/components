// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import InternalIcon from '../../icon/internal';
import { KeyCode } from '../../internal/keycode';
import { TableProps } from '../interfaces';
import { getSortingIconName, getSortingStatus, isSorted } from './utils';
import styles from '../body-cell/styles.css.js';
import { Resizer } from '../resizer';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { InteractiveComponent } from '../thead';
import { TableThElement, TableThElementProps } from './th-element';

interface TableHeaderCellProps<ItemType> extends Omit<TableThElementProps, 'children'> {
  column: TableProps.ColumnDefinition<ItemType>;
  activeSortingColumn?: TableProps.SortingColumn<ItemType>;
  tabIndex: number;
  wrapLines?: boolean;
  onClick(detail: TableProps.SortingState<any>): void;
  onResizeFinish: () => void;
  colIndex: number;
  updateColumn: (colIndex: number, newWidth: number) => void;
  isEditable?: boolean;
  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
}

export function TableHeaderCell<ItemType>({
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
  sticky,
  stuck,
  stripedRows,
  variant,
}: TableHeaderCellProps<ItemType>) {
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

  return (
    <TableThElement
      style={style}
      sortable={sortable}
      sorted={sorted}
      sortingDescending={sortingDescending}
      sortingDisabled={sortingDisabled}
      resizableColumns={resizableColumns}
      hidden={hidden}
      sticky={sticky}
      stuck={stuck}
      stripedRows={stripedRows}
      variant={variant}
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
            <span className={styles['edit-icon']} role="img" aria-label={column.editConfig?.editIconAriaLabel}>
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
            onDragMove={newWidth => updateColumn(colIndex, newWidth)}
            onFinish={onResizeFinish}
            ariaLabelledby={headerId}
            onFocus={() => onFocusedComponentChange?.({ type: 'resizer', col: colIndex })}
            onBlur={() => onFocusedComponentChange?.(null)}
            minWidth={typeof column.minWidth === 'string' ? parseInt(column.minWidth) : column.minWidth}
          />
        </>
      )}
    </TableThElement>
  );
}
