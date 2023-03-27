// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { GetStickyColumn } from '../use-sticky-columns.js';
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
  children?: React.ReactNode;
  isEvenRow?: boolean;
  stripedRows?: boolean;
  hasSelection?: boolean;
  hasFooter?: boolean;
  isVisualRefresh?: boolean;
  isStickyColumn?: boolean;
  stickyColumn?: GetStickyColumn;
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
      isEvenRow,
      stripedRows,
      isVisualRefresh,
      hasSelection,
      hasFooter,
      isStickyColumn,
      stickyColumn,
    },
    ref
  ) => {
    const { isLastStart, isLastEnd } = stickyColumn || {};
    const isLastStickyColumn = isLastStart ? 'start' : isLastEnd ? 'end' : undefined;
    const lastStickyColumnStyles =
      isLastStickyColumn === 'start'
        ? styles['body-cell-freeze-last-start']
        : isLastStickyColumn === 'end'
        ? styles['body-cell-freeze-last-end']
        : undefined;
    return (
      <td
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
          !isEvenRow && stripedRows && styles['body-cell-shaded'],
          stripedRows && styles['has-striped-rows'],
          isVisualRefresh && styles['is-visual-refresh'],
          hasSelection && styles['has-selection'],
          hasFooter && styles['has-footer'],
          isStickyColumn && styles['body-cell-freeze'],
          isLastStickyColumn && lastStickyColumnStyles
        )}
        onClick={onClick}
        ref={ref}
        {...nativeAttributes}
      >
        {children}
      </td>
    );
  }
);
