// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableRowProps } from './interfaces';

import styles from './styles.css.js';

export function Row(props: TableRowProps & InternalBaseComponentProps) {
  const {
    variant,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaSelected,
    ariaRowindex,
    children,
    style,
    __internalRootRef,
  } = props;
  const { columnLayout, gridTemplateColumns } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const baseProps = getBaseProps(props);
  return (
    <tr
      {...baseProps}
      role={isGrid ? 'row' : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-selected={ariaSelected}
      aria-rowindex={ariaRowindex}
      ref={__internalRootRef}
      className={clsx(
        baseProps.className,
        styles.row,
        isGrid && styles['row-grid'],
        variant === 'selected' && styles['row-selected'],
        variant === 'shaded' && styles['row-shaded']
      )}
      style={isGrid ? { gridTemplateColumns, ...style } : style}
    >
      {children}
    </tr>
  );
}
