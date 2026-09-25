// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableRowProps } from './interfaces';

import styles from './styles.css.js';

// Sanctioned data-* hooks: `data-awsui-selected` / `data-awsui-shaded` on the <tr> carry the row's visual
// state so CSS can key off it — sibling-adjacency (consecutive-selected merge, striped divider) and the
// selection ring, which a cell can't express from its own context. Inert for the existing Table. A selected
// row omits the shaded hook so selection styling wins outright (no shaded paint on a selected row).
export interface InternalTableRowProps extends TableRowProps, InternalBaseComponentProps {}

export default function InternalTableRow({
  selected,
  shaded,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ariaRowindex,
  children,
  positionStyle,
  __internalRootRef,
  ...rest
}: InternalTableRowProps) {
  const { isGrid, gridTemplateColumns } = useTableContext();
  const { className, ...restBaseProps } = getBaseProps(rest);

  return (
    <tr
      ref={__internalRootRef}
      className={clsx(className, styles.row, isGrid && styles['row-grid'])}
      {...restBaseProps}
      {...(selected ? { 'data-awsui-selected': true } : {})}
      {...(shaded && !selected ? { 'data-awsui-shaded': true } : {})}
      role={isGrid ? 'row' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-rowindex={ariaRowindex}
      style={(isGrid ? { gridTemplateColumns, ...positionStyle } : positionStyle) as React.CSSProperties}
    >
      {children}
    </tr>
  );
}
