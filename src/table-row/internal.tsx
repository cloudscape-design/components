// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableRowProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTableRowProps extends TableRowProps, InternalBaseComponentProps {
  nativeAttributes?: React.HTMLAttributes<HTMLTableRowElement>;
}

export default function InternalTableRow({
  variant,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  ariaSelected,
  ariaRowindex,
  children,
  style,
  nativeAttributes,
  __internalRootRef,
  ...rest
}: InternalTableRowProps) {
  const { columnLayout, gridTemplateColumns } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const baseProps = getBaseProps(rest);
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
      {children}
    </tr>
  );
}
