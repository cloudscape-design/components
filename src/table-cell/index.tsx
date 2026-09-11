// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableCellProps } from './interfaces';
import { InternalTableCell } from './internal';

export { TableCellProps };

function TableCell(props: TableCellProps) {
  const baseComponentProps = useBaseComponent('TableCell', { props: { disablePaddings: props.disablePaddings } });
  const mergedProps = { ...props, ...baseComponentProps };
  const { children, disablePaddings, __internalRootRef } = mergedProps;
  const { className, ...restBaseProps } = getBaseProps(mergedProps);
  return (
    <InternalTableCell
      tag="td"
      ref={__internalRootRef}
      className={className}
      disablePaddings={disablePaddings}
      nativeAttributes={restBaseProps}
    >
      {children}
    </InternalTableCell>
  );
}

applyDisplayName(TableCell, 'TableCell');
export default TableCell;
