// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableBodyCellProps } from './interfaces';
import { InternalTableBodyCell } from './internal';

export { TableBodyCellProps };

function TableBodyCell(props: TableBodyCellProps) {
  const { __internalRootRef } = useBaseComponent('TableBodyCell', {
    props: { disablePaddings: props.disablePaddings, isRowHeader: props.isRowHeader },
  });
  const { isRowHeader, ...rest } = props;
  return <InternalTableBodyCell {...rest} tag={isRowHeader ? 'th' : 'td'} ref={__internalRootRef} />;
}

applyDisplayName(TableBodyCell, 'TableBodyCell');
export default TableBodyCell;
