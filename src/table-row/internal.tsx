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

// Sanctioned data-* hooks: `data-variant-selected` / `data-variant-shaded` on the <tr> let sibling-adjacency
// CSS (consecutive-selected merge, striped divider) work, which a cell can't do from context. Inert for the Table.
export interface InternalTableRowProps extends TableRowProps, InternalBaseComponentProps {}

export default function InternalTableRow({
  variant = 'default',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ariaRowindex,
  children,
  style,
  __internalRootRef,
  ...rest
}: InternalTableRowProps) {
  const { columnLayout, gridTemplateColumns } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const { className, ...restBaseProps } = getBaseProps(rest);
  // `variant` is the sole source of truth for these hooks: emit both unconditionally after the base-prop
  // spread (true|undefined) so a consumer-passed data-variant-* can't spoof the selection/shading paint.
  const reservedVariantAttributes = {
    'data-variant-selected': variant === 'selected' ? 'true' : undefined,
    'data-variant-shaded': variant === 'shaded' ? 'true' : undefined,
  };
  return (
    <tr
      ref={__internalRootRef}
      className={clsx(className, styles.row, isGrid && styles['row-grid'])}
      {...restBaseProps}
      {...reservedVariantAttributes}
      role={isGrid ? 'row' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-rowindex={ariaRowindex}
      style={(isGrid ? { gridTemplateColumns, ...style } : style) as React.CSSProperties}
    >
      <RowVariantContextProvider value={variant}>{children}</RowVariantContextProvider>
    </tr>
  );
}
