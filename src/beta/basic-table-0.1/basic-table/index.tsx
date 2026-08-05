// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BasicTableProps } from './interfaces';
import { InternalRoot } from './internal';

// `BasicTable` is the base component: it takes the positional `columns` config, drives the headless
// `useBasicTable` hook, provides its instance to the self-rendering parts, and renders the grid shell
// around the declarative header + rows it is given.
function BasicTable({
  columnLayout = 'fixed',
  role = 'grid',
  loading = false,
  resizableColumns = false,
  ...props
}: BasicTableProps) {
  const baseComponentProps = useBaseComponent('BasicTable', {
    props: { columnLayout, role, resizableColumns },
  });
  return (
    <InternalRoot
      columnLayout={columnLayout}
      role={role}
      loading={loading}
      resizableColumns={resizableColumns}
      {...props}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(BasicTable, 'BasicTable');

export default BasicTable;

export { useBasicTable } from './use-basic-table';
export { useVirtualization } from '../use-virtualization/use-virtualization';
export { useColumnVirtualization } from '../use-virtualization/use-column-window';

// Root + headless types.
export type { BasicTableProps };
export type { UseBasicTableConfig, BasicTableGetters } from './interfaces';
export type { UseBasicTableResult } from './use-basic-table';
export type { StickyColumnsModel } from '../../../table/sticky-columns';

// Virtualization primitive types.
export type {
  VirtualizationConfig,
  VirtualizationResult,
  VirtualizationWindowItem,
  VirtualizationRowProps,
  VirtualizationVisibleRange,
  ColumnVirtualizationConfig,
  ColumnVirtualizationResult,
} from '../use-virtualization/interfaces';
