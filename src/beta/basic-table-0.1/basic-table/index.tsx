// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../../../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BasicTableProps } from './interfaces';
import { InternalRoot } from './internal';

// The root BasicTable component (the beta module's default export). Documented as `BasicTable` (this
// dir's basename). The parts (BasicTableRow, …) live in sibling dirs; the hooks + shared types are
// re-exported from the beta entry (../index), not here, so the documenter treats this dir as a single
// component with a single props type.
export type { BasicTableProps };

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
