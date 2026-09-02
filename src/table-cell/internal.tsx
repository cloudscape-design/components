// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableCellProps } from './interfaces';

import styles from './styles.css.js';

export function Cell(props: TableCellProps & InternalBaseComponentProps) {
  const { children, disablePaddings, __internalRootRef } = props;
  const { columnLayout } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const baseProps = getBaseProps(props);
  return (
    <td
      {...baseProps}
      role={isGrid ? 'cell' : undefined}
      ref={__internalRootRef}
      className={clsx(
        baseProps.className,
        styles.cell,
        isGrid && styles['cell-grid'],
        disablePaddings && styles['disable-paddings']
      )}
    >
      {children}
    </td>
  );
}
