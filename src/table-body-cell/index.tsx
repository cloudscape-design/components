// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableBodyCellProps } from './interfaces';
import { InternalTableBodyCell } from './internal';

export { TableBodyCellProps };

function TableBodyCell(props: TableBodyCellProps) {
  const baseComponentProps = useBaseComponent('TableBodyCell', {
    props: { disablePaddings: props.disablePaddings, isRowHeader: props.isRowHeader },
  });
  const mergedProps = { ...props, ...baseComponentProps };
  const { children, isRowHeader, disablePaddings, __internalRootRef } = mergedProps;
  const { className, ...restBaseProps } = getBaseProps(mergedProps);
  return (
    <InternalTableBodyCell
      tag={isRowHeader ? 'th' : 'td'}
      ref={__internalRootRef}
      className={className}
      disablePaddings={disablePaddings}
      nativeAttributes={restBaseProps}
    >
      {children}
    </InternalTableBodyCell>
  );
}

applyDisplayName(TableBodyCell, 'TableBodyCell');
export default TableBodyCell;
