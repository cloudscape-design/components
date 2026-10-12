// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { VirtualTableProps } from './interfaces';
import InternalVirtualTable from './internal';

export { VirtualTableProps };

export default function VirtualTable<T>({
  estimatedRowHeight = 40,
  overscan = 10,
  columnLayout = 'fixed',
  role = 'grid',
  loading = false,
  resizableColumns = false,
  stickyHeader = false,
  ...props
}: VirtualTableProps<T>) {
  const baseComponentProps = useBaseComponent('VirtualTable', {
    props: { estimatedRowHeight, overscan, columnLayout, role, resizableColumns, stickyHeader },
  });
  return (
    <InternalVirtualTable
      estimatedRowHeight={estimatedRowHeight}
      overscan={overscan}
      columnLayout={columnLayout}
      role={role}
      loading={loading}
      resizableColumns={resizableColumns}
      stickyHeader={stickyHeader}
      {...props}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(VirtualTable, 'VirtualTable');
