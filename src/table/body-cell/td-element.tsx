// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';

export interface TableTdElementProps {
  className?: string;
  style?: React.CSSProperties;
  wrapLines: boolean | undefined;
  isRowHeader?: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
  isSelected: boolean;
  isNextSelected: boolean;
  isPrevSelected: boolean;
  nativeAttributes?: Omit<
    React.TdHTMLAttributes<HTMLTableCellElement> | React.ThHTMLAttributes<HTMLTableCellElement>,
    'style' | 'className' | 'onClick'
  >;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
  isEvenRow?: boolean;
  stripedRows?: boolean;
  hasSelection?: boolean;
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
      isRowHeader,
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
      hasSelection,
      hasFooter,
    },
    ref
  ) => {
    let Element: 'th' | 'td' = 'td';
    if (isRowHeader) {
      Element = 'th';
      nativeAttributes = {
        ...nativeAttributes,
        scope: 'row',
      };
    }
    return (
      <Element
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
          hasFooter && styles['has-footer']
        )}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={ref}
        {...nativeAttributes}
      >
        {children}
      </Element>
    );
  }
);
