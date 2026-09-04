// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableHeaderRowProps } from './interfaces';

import styles from './styles.css.js';

export function HeaderRow(props: TableHeaderRowProps & InternalBaseComponentProps) {
  const { children, __internalRootRef } = props;
  const { columnLayout, gridTemplateColumns } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const baseProps = getBaseProps(props);
  return (
    <tr
      {...baseProps}
      role={isGrid ? 'row' : undefined}
      aria-rowindex={isGrid ? 1 : undefined}
      ref={__internalRootRef}
      className={clsx(baseProps.className, styles['header-row'], isGrid && styles['header-row-grid'])}
      style={isGrid ? { gridTemplateColumns } : undefined}
    >
      {children}
    </tr>
  );
}
