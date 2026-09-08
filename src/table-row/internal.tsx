// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableRowProps } from './interfaces';

import styles from './styles.css.js';

export function Row(
  props: TableRowProps &
    InternalBaseComponentProps & { nativeAttributes?: React.HTMLAttributes<HTMLTableRowElement>; __lastRow?: boolean }
) {
  const {
    variant,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaSelected,
    ariaRowindex,
    children,
    style,
    nativeAttributes,
    __lastRow,
    __internalRootRef,
  } = props;
  const { columnLayout, gridTemplateColumns } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const baseProps = getBaseProps(props);
  // Forward TableBody's last-row flag on to each cell so it drops the divider.
  const cells = __lastRow
    ? React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ __lastRow?: boolean }>, { __lastRow: true })
          : child
      )
    : children;
  return (
    <tr
      {...baseProps}
      role={isGrid ? 'row' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-selected={ariaSelected}
      aria-rowindex={ariaRowindex}
      {...nativeAttributes}
      ref={__internalRootRef}
      data-selected={variant === 'selected' || undefined}
      data-shaded={variant === 'shaded' || undefined}
      className={clsx(baseProps.className, styles.row, isGrid && styles['row-grid'])}
      // TableRowProps.Style is a hand-picked subset; widen to CSSProperties for the DOM attribute.
      style={(isGrid ? { gridTemplateColumns, ...style } : style) as React.CSSProperties}
    >
      {cells}
    </tr>
  );
}
