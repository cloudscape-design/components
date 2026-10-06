// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useTableContext } from '../table-root/context';
import { NativeAttributes } from '../types/native-attributes';
import { TableHeaderCellProps } from './interfaces';

import headerCellStyles from '../table/header-cell/styles.css.js';
import styles from './styles.css.js';

export type InternalTableHeaderCellProps = TableHeaderCellProps & {
  style?: React.CSSProperties;
  tabIndex?: number;
  // Non-base native attributes injected by internal callers (the existing Table's th-element): colSpan,
  // scope, role, aria-sort. Base props (className/id/data-*) flow directly and are read via getBaseProps.
  nativeAttributes?: NativeAttributes<React.ThHTMLAttributes<HTMLTableCellElement>>;
  disableContentWrapper?: boolean;
  disableDivider?: boolean;
};

export const InternalTableHeaderCell = React.forwardRef<HTMLTableCellElement, InternalTableHeaderCellProps>(
  (props, ref) => {
    const {
      ariaLabel,
      ariaLabelledby,
      ariaDescribedby,
      ariaSort,
      disablePaddings,
      style,
      tabIndex,
      nativeAttributes,
      disableContentWrapper,
      disableDivider,
      children,
    } = props;
    const { className, ...restBaseProps } = getBaseProps(props);
    const { isGrid } = useTableContext();
    const isVisualRefresh = useVisualRefresh();
    // `scope='col'` is the default for a public header cell; an internal caller's nativeAttributes (e.g. the
    // existing Table's `scope='colgroup'` and computed role/aria-sort) override it. Grid mode adds the role.
    const mergedNativeAttributes = {
      scope: 'col' as const,
      ...nativeAttributes,
      ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : undefined),
      ...(ariaLabelledby !== undefined ? { 'aria-labelledby': ariaLabelledby } : undefined),
      ...(ariaDescribedby !== undefined ? { 'aria-describedby': ariaDescribedby } : undefined),
      ...(ariaSort !== undefined ? { 'aria-sort': ariaSort } : undefined),
      ...(isGrid ? { role: 'columnheader' as const } : undefined),
    };
    return (
      <th
        ref={ref}
        {...restBaseProps}
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
