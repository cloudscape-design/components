// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { RowVariantContextProvider } from './context';
import { TableRowProps } from './interfaces';

import styles from './styles.css.js';

// Sanctioned data-* hooks: `data-awsui-variant-*` on the <tr> carry the row's variant so CSS can key off it —
// sibling-adjacency (consecutive-selected merge, striped divider) and the selection ring, which a cell can't
// express from context. Inert for the existing Table.
export interface InternalTableRowProps extends TableRowProps, InternalBaseComponentProps {}

export default function InternalTableRow({
  variant = 'default',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ariaRowindex,
  children,
  positionStyle,
  __internalRootRef,
  ...rest
}: InternalTableRowProps) {
  const { columnLayout, gridTemplateColumns } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const { className, ...restBaseProps } = getBaseProps(rest);

  // The active variant is stamped as its data-awsui-variant-* hook (dynamic — a new variant needs no change
  // here); the `default` variant carries none.
  return (
    <tr
      ref={__internalRootRef}
      className={clsx(className, styles.row, isGrid && styles['row-grid'])}
      {...restBaseProps}
      {...(variant !== 'default' ? { [`data-awsui-variant-${variant}`]: true } : {})}
      role={isGrid ? 'row' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-rowindex={ariaRowindex}
      style={(isGrid ? { gridTemplateColumns, ...positionStyle } : positionStyle) as React.CSSProperties}
    >
      <RowVariantContextProvider value={variant}>{children}</RowVariantContextProvider>
    </tr>
  );
}
