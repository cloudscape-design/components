// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import { useStickyState } from '../use-sticky-state';
import { getStickyClassNames, StickyColumnProperties } from '../use-sticky-columns';
import { useReaction } from '../../area-chart/model/async-store';

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
  stickyColumnProperties: StickyColumnProperties;
  tdRef?: React.Ref<HTMLTableCellElement>;
  colIndex: number;
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
  const ref = React.useRef();
  // We need to know which classes to add / remove
  const stickyClasses = [styles['sticky-cell'], styles['sticky-cell-last-left'], styles['sticky-cell-last-left']];

  useReaction(
    stickyState.store,
    state => state.cellStyles,
    styles => {
      if (ref && ref.current) {
        const classNames = styles[colIndex]?.classNames.td;

        if (classNames?.length) {
          const differences = stickyClasses.filter(el => !classNames.includes(el));
          differences.forEach(name => {
            ref.current.classList.remove(name);
          });
          classNames.forEach(name => {
            ref.current.classList.add(name);
          });
        }
        console.log('in td element', styles[colIndex]?.style);
        const cellStyle = styles[colIndex]?.style;
        for (const key in cellStyle) {
          if (cellStyle.hasOwnProperty(key) && cellStyle[key] !== undefined) {
            ref.current.style[key] = cellStyle[key];
          }
        }
      }
    }
  );
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
        hasFooter && styles['has-footer']
      )}
      onClick={onClick}
      ref={ref}
      {...nativeAttributes}
    >
      {children}
    </td>
  );
}

// Need some sort of style restore (when padding gets removed)
