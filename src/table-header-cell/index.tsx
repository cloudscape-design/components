// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableHeaderCellProps } from './interfaces';
import { InternalTableHeaderCell } from './internal';

export { TableHeaderCellProps };

function TableHeaderCell(props: TableHeaderCellProps) {
  const { __internalRootRef } = useBaseComponent('TableHeaderCell', {
    props: { disablePaddings: props.disablePaddings },
  });
  return <InternalTableHeaderCell {...props} ref={__internalRootRef} />;
}

applyDisplayName(TableHeaderCell, 'TableHeaderCell');
export default TableHeaderCell;
