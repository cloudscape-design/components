// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableBodyProps } from './interfaces';

import styles from './styles.css.js';

export function Body(props: TableBodyProps & InternalBaseComponentProps) {
  const { children, style, __internalRootRef } = props;
  const { columnLayout } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const baseProps = getBaseProps(props);
  // Flag the last body row so its cells drop the divider (no row below). Rows are consumer-composed,
  // so the last one is detected here and threaded via __lastRow (TableRow forwards it to each cell).
  const childArray = React.Children.toArray(children);
  const lastIndex = childArray.length - 1;
  const rows = childArray.map((child, index) =>
    index === lastIndex && React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<{ __lastRow?: boolean }>, { __lastRow: true })
      : child
  );
  return (
    <tbody
      {...baseProps}
      role={isGrid ? 'rowgroup' : undefined}
      ref={__internalRootRef}
      className={clsx(baseProps.className, styles.body, isGrid && styles['body-grid'])}
      // TableBodyProps.Style is a hand-picked subset; widen to CSSProperties for the DOM attribute.
      style={style as React.CSSProperties}
    >
      {rows}
    </tbody>
  );
}
