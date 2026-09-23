// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useTableContext } from '../table-root/context';
import { NativeAttributes } from '../types/native-attributes';
import { TableBodyCellProps } from './interfaces';

import bodyCellStyles from '../table/body-cell/styles.css.js';
import styles from './styles.css.js';

export type InternalTableBodyCellProps = Omit<TableBodyCellProps, 'isRowHeader'> & {
  tag: 'td' | 'th';
  style?: React.CSSProperties;
  wrapLines?: boolean;
  // Non-base native attributes injected by internal callers (the existing Table's td-element): role and
  // sizing. Base props (className/id/data-*) flow directly and are read via getBaseProps.
  nativeAttributes?: NativeAttributes<React.ThHTMLAttributes<HTMLTableCellElement>>;
  tabIndex?: number;
  onClick?: React.MouseEventHandler<HTMLTableCellElement>;
  onFocus?: React.FocusEventHandler<HTMLTableCellElement>;
  onBlur?: React.FocusEventHandler<HTMLTableCellElement>;
  beforeContent?: React.ReactNode;
};

export const InternalTableBodyCell = React.forwardRef<HTMLTableCellElement, InternalTableBodyCellProps>(
  (props, ref) => {
    const {
      tag,
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
    } = props;
    const { className, ...restBaseProps } = getBaseProps(props);
    const { isGrid } = useTableContext();
    const isVisualRefresh = useVisualRefresh();
    // Within a body cell a `<th>` is always a row header (column headers use InternalTableHeaderCell).
    const isRowHeader = tag === 'th';
    const mergedNativeAttributes = {
      ...nativeAttributes,
      // A row header is a `<th scope="row">` in either layout mode.
      ...(isRowHeader ? { scope: 'row' as const } : undefined),
      // Grid mode drops the implicit cell role, so set it explicitly; a role from nativeAttributes wins.
      ...(isGrid ? { role: nativeAttributes?.role ?? (isRowHeader ? 'rowheader' : 'cell') } : undefined),
    };
    const Element = tag;
    return (
      <Element
        ref={ref}
        {...restBaseProps}
        style={style}
        className={clsx(
          bodyCellStyles['body-cell'],
          className,
          styles.cell,
          isGrid && styles['cell-grid'],
          // Gated on runtime VR mode: this substrate is shared with the existing Table, which still supports
          // runtime classic visual mode (non-VR). Atomic tables render VR-only, so useVisualRefresh() is true there.
          isVisualRefresh && bodyCellStyles['is-visual-refresh']
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
