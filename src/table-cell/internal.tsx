// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useTableContext } from '../table-root/context';
import { useRowVariant } from '../table-row/context';

import bodyCellStyles from '../table/body-cell/styles.css.js';
import styles from './styles.css.js';

export interface InternalTableCellProps {
  tag: 'td' | 'th';
  className?: string;
  style?: React.CSSProperties;
  wrapLines?: boolean;
  disablePaddings?: boolean;
  suppressBlockStartPlaceholder?: boolean;
  suppressBlockEndPlaceholder?: boolean;
  nativeAttributes?: Omit<
    React.TdHTMLAttributes<HTMLTableCellElement> | React.ThHTMLAttributes<HTMLTableCellElement>,
    'style' | 'className' | 'onClick'
  >;
  tabIndex?: number;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  beforeContent?: React.ReactNode;
  children?: React.ReactNode;
}

export const InternalTableCell = React.forwardRef<HTMLTableCellElement, InternalTableCellProps>(
  (
    {
      tag,
      className,
      style,
      wrapLines,
      disablePaddings,
      suppressBlockStartPlaceholder,
      suppressBlockEndPlaceholder,
      nativeAttributes,
      tabIndex,
      onClick,
      onFocus,
      onBlur,
      beforeContent,
      children,
    },
    ref
  ) => {
    const { columnLayout } = useTableContext();
    const variant = useRowVariant();
    const isVisualRefresh = useVisualRefresh();
    const isGrid = columnLayout.type === 'grid';
    const Element = tag;
    const mergedNativeAttributes = isGrid ? { ...nativeAttributes, role: 'cell' as const } : nativeAttributes;
    return (
      <Element
        ref={ref}
        style={style}
        className={clsx(
          bodyCellStyles['body-cell'],
          className,
          styles.cell,
          isGrid && styles['cell-grid'],
          suppressBlockStartPlaceholder && styles['no-block-start-placeholder'],
          suppressBlockEndPlaceholder && styles['no-block-end-placeholder'],
          isVisualRefresh && bodyCellStyles['is-visual-refresh'],
          variant === 'selected' && bodyCellStyles['body-cell-selected'],
          // Not redundant with body-cell-selected: without has-selection the first cell drops its selection border.
          variant === 'selected' && bodyCellStyles['has-selection'],
          variant === 'shaded' && bodyCellStyles['body-cell-shaded']
        )}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        {...mergedNativeAttributes}
        tabIndex={tabIndex}
      >
        {beforeContent}
        <div
          className={clsx(
            bodyCellStyles['body-cell-content'],
            wrapLines && bodyCellStyles['body-cell-wrap'],
            disablePaddings && bodyCellStyles['disable-paddings']
          )}
        >
          {children}
        </div>
      </Element>
    );
  }
);
