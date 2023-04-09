// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useEffect } from 'react';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useIntersectionObserver } from '../use-intersection-observer';
import { LEFT_SENTINEL_ID, RIGHT_SENTINEL_ID } from '../utils';
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
  isStickyLeft?: boolean;
  isStickyRight?: boolean;
  isLastStickyLeft?: boolean;
  isLastStickyRight?: boolean;
  isStuckToTheRight?: boolean;
  isStuckToTheLeft?: boolean;
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
  isStickyLeft,
  isStickyRight,
  isLastStickyLeft,
  isLastStickyRight,
  tdRef,
}: TableTdElementProps) {
  const isVisualRefresh = useVisualRefresh();

  const [isStuckToTheLeft, setIsStuckToTheLeft] = React.useState(false);
  const [isStuckToTheRight, setIsStuckToTheRight] = React.useState(false);
  const leftCallback = useCallback(
    entry => {
      setIsStuckToTheLeft(!entry.isIntersecting);
    },
    [setIsStuckToTheLeft]
  );

  const rightCallback = useCallback(
    entry => {
      setIsStuckToTheRight(!entry.isIntersecting);
    },
    [setIsStuckToTheRight]
  );

  const { registerChildCallback, unregisterChildCallback } = useIntersectionObserver();

  useEffect(() => {
    if (isLastStickyLeft) {
      registerChildCallback?.(LEFT_SENTINEL_ID, leftCallback);
    } else if (isLastStickyRight) {
      registerChildCallback?.(RIGHT_SENTINEL_ID, rightCallback);
    }
    return () => {
      unregisterChildCallback?.(LEFT_SENTINEL_ID, leftCallback);
      unregisterChildCallback?.(RIGHT_SENTINEL_ID, rightCallback);
    };
  }, [
    isLastStickyLeft,
    isLastStickyRight,
    registerChildCallback,
    leftCallback,
    rightCallback,
    unregisterChildCallback,
  ]);

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
        (isStickyLeft || isStickyRight) && styles['body-cell-freeze'],
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
