// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useTableContext } from '../table-root/context';
import { TableHeaderCellProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTableHeaderCellProps extends TableHeaderCellProps, InternalBaseComponentProps {}

export default function InternalTableHeaderCell({
  children,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ariaSort,
  disablePaddings,
  __internalRootRef,
  ...rest
}: InternalTableHeaderCellProps) {
  const { columnLayout } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const isVisualRefresh = useVisualRefresh();
  const baseProps = getBaseProps(rest);
  return (
    <th
      {...baseProps}
      role={isGrid ? 'columnheader' : undefined}
      scope="col"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-sort={ariaSort}
      ref={__internalRootRef}
      className={clsx(
        baseProps.className,
        styles['header-cell'],
        isGrid && styles['header-cell-grid'],
        isVisualRefresh && styles['is-visual-refresh'],
        disablePaddings && styles['disable-paddings']
      )}
    >
      {children}
    </th>
  );
}
