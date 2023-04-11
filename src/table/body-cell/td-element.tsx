// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useStickyState } from '../use-sticky-state';
import { GetStickyColumnProperties } from '../use-sticky-columns';
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
  getStickyColumnProperties: () => GetStickyColumnProperties;
  tdRef: React.Ref<HTMLTableCellElement>;
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
  getStickyColumnProperties,
  tdRef,
}: TableTdElementProps) {
  const isVisualRefresh = useVisualRefresh();
  const { stickyStyles, isSticky, isLastStickyLeft, isLastStickyRight } = getStickyColumnProperties();
  const { isStuckToTheLeft, isStuckToTheRight } = useStickyState(isLastStickyLeft, isLastStickyRight);
  console.log({ isStuckToTheLeft });
  return (
    <td
      style={{ ...stickyStyles.sticky, ...(isStuckToTheLeft && stickyStyles.stuck), ...style }}
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
        isSticky && styles['body-cell-freeze'],
        isStuckToTheLeft && isLastStickyLeft && styles['body-cell-freeze-last-left'],
        isStuckToTheRight && isLastStickyRight && styles['body-cell-freeze-last-right']
      )}
      onClick={onClick}
      ref={tdRef}
      {...nativeAttributes}
    >
      {children}
    </td>
  );
}
