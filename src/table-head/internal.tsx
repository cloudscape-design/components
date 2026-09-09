// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useTableContext } from '../table-root/context';
import { TableHeadProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTableHeadProps extends TableHeadProps, InternalBaseComponentProps {}

export default function InternalTableHead({ children, __internalRootRef, ...rest }: InternalTableHeadProps) {
  const { columnLayout } = useTableContext();
  const isGrid = columnLayout.type === 'grid';
  const baseProps = getBaseProps(rest);
  return (
    <thead
      {...baseProps}
      role={isGrid ? 'rowgroup' : undefined}
      ref={__internalRootRef}
      className={clsx(baseProps.className, styles.head, isGrid && styles['head-grid'])}
    >
      {children}
    </thead>
  );
}
