// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useTableContext } from '../table-root/context';

import headerCellStyles from '../table/header-cell/styles.css.js';
import styles from './styles.css.js';

export interface InternalTableHeaderCellProps {
  className?: string;
  style?: React.CSSProperties;
  nativeAttributes?: React.ThHTMLAttributes<HTMLTableCellElement> & {
    [key: `data-${string}`]: string | number | boolean | undefined;
  };
  tabIndex?: number;
  disablePaddings?: boolean;
  disableContentWrapper?: boolean;
  disableDivider?: boolean;
  children?: React.ReactNode;
}

export const InternalTableHeaderCell = React.forwardRef<HTMLTableCellElement, InternalTableHeaderCellProps>(
  (
    { className, style, nativeAttributes, tabIndex, disablePaddings, disableContentWrapper, disableDivider, children },
    ref
  ) => {
    const { columnLayout } = useTableContext();
    const isVisualRefresh = useVisualRefresh();
    const isGrid = columnLayout.type === 'grid';
    const mergedNativeAttributes = isGrid ? { ...nativeAttributes, role: 'columnheader' as const } : nativeAttributes;
    return (
      <th
        ref={ref}
        className={clsx(
          headerCellStyles['header-cell'],
          className,
          styles['header-cell'],
          isGrid && styles['header-cell-grid'],
          // Gated on runtime VR mode: this substrate is shared with the existing Table, which still supports
          // runtime classic visual mode (non-VR). Atomic tables render VR-only, so useVisualRefresh() is true there.
          isVisualRefresh && headerCellStyles['is-visual-refresh'],
          // Own is-visual-refresh marker keys the first-column content-offset reset (VR only).
          isVisualRefresh && styles['is-visual-refresh'],
          disablePaddings && styles['disable-paddings'],
          !disablePaddings && headerCellStyles['with-paddings'],
          disableDivider && styles['no-divider']
        )}
        style={style}
        tabIndex={tabIndex}
        {...mergedNativeAttributes}
      >
        {disableContentWrapper ? children : <div className={styles['header-cell-content']}>{children}</div>}
      </th>
    );
  }
);
