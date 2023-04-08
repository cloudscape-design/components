// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useEffect } from 'react';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useIntersectionObserver } from '../intersection-observer-context';

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
      hasSelection,
      hasFooter,
      isStickyLeft,
      isStickyRight,
      isLastStickyLeft,
      isLastStickyRight,
      //isStuckToTheRight,
      // isStuckToTheLeft,
    },
    ref
  ) => {
    const isVisualRefresh = useVisualRefresh();

    const [isStuck, setIsStuck] = React.useState(false);

    const childCallback = useCallback(
      entry => {
        setIsStuck(!entry.isIntersecting);
      },
      [setIsStuck]
    );

    const { registerChildCallback, unregisterChildCallback } = useIntersectionObserver();

    useEffect(() => {
      if (isLastStickyLeft) {
        console.log('isStickyLeft');
        registerChildCallback(childCallback);
      }
      return () => {
        unregisterChildCallback(childCallback);
      };
    }, [registerChildCallback, unregisterChildCallback, childCallback, isLastStickyLeft]);

    console.log('Rendering');
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
          isStuck && styles['body-cell-freeze-last-left'],
          isStickyRight && isLastStickyRight && styles['body-cell-freeze-last-right']
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
