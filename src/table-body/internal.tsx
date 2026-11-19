// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableBodyProps } from './interfaces';

import styles from './styles.css.js';

interface InternalTableBodyProps extends TableBodyProps, InternalBaseComponentProps {}

export default function InternalTableBody({
  children,
  positionStyle,
  __internalRootRef,
  ...rest
}: InternalTableBodyProps) {
  const { isGrid } = useTableContext();
  const { className, ...restBaseProps } = getBaseProps(rest);
  return (
    <tbody
      ref={__internalRootRef}
      className={clsx(className, styles.body, isGrid && styles['body-grid'])}
      {...restBaseProps}
      role={isGrid ? 'rowgroup' : undefined}
      style={positionStyle as React.CSSProperties}
    >
      {children}
    </tbody>
  );
}
