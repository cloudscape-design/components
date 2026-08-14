// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { VirtualTableProps } from './interfaces';
import { Body, Cell, ExpandedContent, Header, HeaderCell, InternalRoot, Row } from './internal';

export { VirtualTableProps };

// Compound-component set (cell F1-A2). `VirtualTable.Root` is the base component and the
// owner of all grid state; the sub-components are the exact references Root compares its
// children against, so consumer `<VirtualTable.Row>` etc. are recognised by identity.
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
