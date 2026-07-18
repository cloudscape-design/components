// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { VirtualTableProps } from './interfaces';
import InternalVirtualTable from './internal';

export { VirtualTableProps };

// Config-driven, logs-specialized VirtualTable (cell F2-A1). One component driven by a
// required `viewConfig` whose `type` discriminant selects the surface. The raw view
// defaults its overscan
// to FILE_VIEW_OVERSCAN (40) when the consumer does not set it; the grid views default
// to TABLE_VIEW_OVERSCAN (20).
export default function VirtualTable<T>({
  estimatedRowHeight = 23,
  follow = false,
  resizableColumns = false,
  stickyHeader = true,
  sortingDescending = false,
  loading = false,
  ...props
}: VirtualTableProps<T>) {
  const overscan = props.overscan ?? (props.viewConfig.type === 'raw' ? 40 : 20);
  const baseComponentProps = useBaseComponent('VirtualTable', {
    props: { view: props.viewConfig.type, estimatedRowHeight, overscan, follow, resizableColumns, stickyHeader },
  });
  return (
    <InternalVirtualTable
      estimatedRowHeight={estimatedRowHeight}
      follow={follow}
      resizableColumns={resizableColumns}
      stickyHeader={stickyHeader}
      sortingDescending={sortingDescending}
      loading={loading}
      {...props}
      overscan={overscan}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(VirtualTable, 'VirtualTable');
