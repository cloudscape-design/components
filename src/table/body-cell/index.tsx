// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import styles from './styles.css.js';
import React from 'react';
import { TableProps } from '../interfaces';

interface TableBodyCellProps {
  className?: string;
  style?: React.CSSProperties;
  wrapLines: boolean | undefined;
  isFirstRow: boolean;
  isLastRow: boolean;
  isSelected: boolean;
  isNextSelected: boolean;
  isPrevSelected: boolean;
  children?: React.ReactNode;
  isSticky?: boolean;
}

export const TableBodyCell = React.forwardRef(function TableBodyCell(
  props: TableBodyCellProps,
  ref: React.Ref<HTMLTableCellElement>
) {
  const {
    className,
    style,
    children,
    wrapLines,
    isFirstRow,
    isLastRow,
    isSelected,
    isNextSelected,
    isPrevSelected,
    isSticky,
  } = props;

  return (
    <td
      ref={isFirstRow ? ref : undefined}
      style={style}
      className={clsx(
        className,
        styles['body-cell'],
        wrapLines && styles['body-cell-wrap'],
        isFirstRow && styles['body-cell-first-row'],
        isLastRow && styles['body-cell-last-row'],
        isSelected && styles['body-cell-selected'],
        isNextSelected && styles['body-cell-next-selected'],
        isPrevSelected && styles['body-cell-prev-selected'],
        isSticky && styles['body-cell-freeze']
      )}
    >
      {children}
    </td>
  );
});

interface TableBodyCellContentProps<ItemType> extends TableBodyCellProps {
  column: TableProps.ColumnDefinition<ItemType>;
  item: ItemType;
}

export const TableBodyCellContent = React.forwardRef(function TableBodyCellContent(
  props: TableBodyCellContentProps<any>,
  ref: React.Ref<HTMLTableCellElement>
) {
  return (
    <TableBodyCell {...props} ref={ref}>
      {props.column.cell(props.item)}
    </TableBodyCell>
  );
});
