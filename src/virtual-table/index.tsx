// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { VirtualTableProps } from './interfaces';
import { Body, Cell, ExpandedContent, Header, HeaderCell, InternalRoot, Row } from './internal';

// Public API for cell F3-A2. Two layers ship:
//  - the compound Cloudscape SKIN, as the default export `VirtualTable.{Root,Header,...}`;
//  - the headless CORE, as the named export `useVirtualGrid`, so the same engine can back
//    this skin, a future styled-default skin, or a bare-core consumer (the F3 seam).
export { VirtualTableProps };
export { useVirtualGrid } from './use-virtual-grid';
export type { VirtualGrid, VirtualGridColumn, VirtualGridConfig, VirtualRow, HeaderRenderProps } from './interfaces';

// `VirtualTable.Root` is the base component and the only caller of the core; the
// sub-components are the exact references Root/Row compare children against by identity.
function VirtualTableRoot<T>({
  estimatedRowHeight = 40,
  overscan = 10,
  columnLayout = 'fixed',
  role = 'grid',
  loading = false,
  resizableColumns = false,
  ...props
}: VirtualTableProps<T>) {
  const baseComponentProps = useBaseComponent('VirtualTable', {
    props: { estimatedRowHeight, overscan, columnLayout, role, resizableColumns },
  });
  return (
    <InternalRoot
      estimatedRowHeight={estimatedRowHeight}
      overscan={overscan}
      columnLayout={columnLayout}
      role={role}
      loading={loading}
      resizableColumns={resizableColumns}
      {...props}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(VirtualTableRoot, 'VirtualTable.Root');
applyDisplayName(Header, 'VirtualTable.Header');
applyDisplayName(HeaderCell, 'VirtualTable.HeaderCell');
applyDisplayName(Body, 'VirtualTable.Body');
applyDisplayName(Row, 'VirtualTable.Row');
applyDisplayName(Cell, 'VirtualTable.Cell');
applyDisplayName(ExpandedContent, 'VirtualTable.ExpandedContent');

const VirtualTable = {
  Root: VirtualTableRoot,
  Header,
  HeaderCell,
  Body,
  Row,
  Cell,
  ExpandedContent,
};

export default VirtualTable;
