// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { StickyStateModel, useStickySyles } from '../sticky-state-model';

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
  tdRef?: React.Ref<HTMLTableCellElement>;
  colIndex: number;
  stickyState: StickyStateModel;
}

export function TableTdElement({
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
  hasSelection,
  hasFooter,
  colIndex,
  stickyState,
}: TableTdElementProps) {
  const isVisualRefresh = useVisualRefresh();
  const ref = React.useRef<HTMLTableCellElement>(null);
  const stickyClassNames = useStickySyles({ stickyState, ref, colIndex, cellType: 'td' });
  return (
    <td
      style={{ ...style, ...stickyClassNames.style }}
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
        stickyClassNames.className
      )}
      onClick={onClick}
      ref={ref}
      {...nativeAttributes}
    >
      {children}
    </td>
  );
}
