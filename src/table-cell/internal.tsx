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
  nativeAttributes?: Omit<
    React.TdHTMLAttributes<HTMLTableCellElement> | React.ThHTMLAttributes<HTMLTableCellElement>,
    'style' | 'className' | 'onClick'
  >;
  tabIndex?: number;
  onClick?: React.MouseEventHandler<HTMLTableCellElement>;
  onFocus?: React.FocusEventHandler<HTMLTableCellElement>;
  onBlur?: React.FocusEventHandler<HTMLTableCellElement>;
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
    // Grid mode drops the table's implicit cell role, so default to 'cell' — but let a consumer that
    // computes a more specific role (e.g. 'rowheader') via nativeAttributes keep it rather than overriding.
    const mergedNativeAttributes = isGrid
      ? { ...nativeAttributes, role: nativeAttributes?.role ?? 'cell' }
      : nativeAttributes;
    return (
      <Element
        ref={ref}
        style={style}
        className={clsx(
          bodyCellStyles['body-cell'],
          className,
          styles.cell,
          isGrid && styles['cell-grid'],
          // Gated on runtime VR mode: this substrate is shared with the existing Table, which still supports
          // runtime classic visual mode (non-VR). Atomic tables render VR-only, so useVisualRefresh() is true there.
          isVisualRefresh && bodyCellStyles['is-visual-refresh'],
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
            disablePaddings ? bodyCellStyles['disable-paddings'] : bodyCellStyles['with-paddings']
          )}
        >
          {children}
        </div>
      </Element>
    );
  }
);
