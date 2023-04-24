// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';

export interface TableTdElementProps {
  className?: string;
  style?: React.CSSProperties;
  wrapLines: boolean | undefined;
  isFirstRow: boolean;
  isLastRow: boolean;
  isSelected: boolean;
  isNextSelected: boolean;
  isPrevSelected: boolean;
  nativeAttributes?: Omit<React.HTMLAttributes<HTMLTableCellElement>, 'style' | 'className' | 'onClick'>;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
  isEvenRow?: boolean;
  stripedRows?: boolean;
  hasFooter?: boolean;
  isVisualRefresh?: boolean;
}

export const TableTdElement = React.forwardRef<HTMLTableCellElement, TableTdElementProps>(
  (
    {
      className,
      style,
      children,
      wrapLines,
      isFirstRow,
      isLastRow,
      isSelected,
      isNextSelected,
      isPrevSelected,
      nativeAttributes,
      onClick,
      onMouseEnter,
      onMouseLeave,
      isEvenRow,
      stripedRows,
      isVisualRefresh,
      hasFooter,
    },
    ref
  ) => {
    return (
      <td
        ref={ref}
        style={style}
        className={clsx(
          className,
          getCellClassName({
            wrapLines,
            isFirstRow,
            isLastRow,
            isSelected,
            isNextSelected,
            isPrevSelected,
            isEvenRow,
            stripedRows,
            isVisualRefresh,
            hasFooter,
          })
        )}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...nativeAttributes}
      >
        {children}
      </td>
    );
  }
);

export function getCellClassName({
  wrapLines,
  isFirstRow,
  isLastRow,
  isSelected,
  isNextSelected,
  isPrevSelected,
  isEvenRow,
  stripedRows,
  isVisualRefresh,
  hasFooter,
  hasSelection,
}: {
  wrapLines?: boolean;
  isFirstRow?: boolean;
  isLastRow?: boolean;
  isSelected?: boolean;
  isNextSelected?: boolean;
  isPrevSelected?: boolean;
  isEvenRow?: boolean;
  stripedRows?: boolean;
  isVisualRefresh?: boolean;
  hasFooter?: boolean;
  hasSelection?: boolean;
}) {
  return clsx(
    styles['body-cell'],
    wrapLines && styles['body-cell-wrap'],
    isFirstRow && styles['body-cell-first-row'],
    isLastRow && styles['body-cell-last-row'],
    isSelected && styles['body-cell-selected'],
    isNextSelected && styles['body-cell-next-selected'],
    isPrevSelected && styles['body-cell-prev-selected'],
    !isEvenRow && stripedRows && styles['body-cell-shaded'],
    stripedRows && styles['has-striped-rows'],
    isVisualRefresh && styles['is-visual-refresh'],
    hasFooter && styles['has-footer'],
    hasSelection && styles['has-selection']
  );
}
