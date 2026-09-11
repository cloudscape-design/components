// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TableHeaderCellProps } from './interfaces';
import { InternalTableHeaderCell } from './internal';

export { TableHeaderCellProps };

function TableHeaderCell(props: TableHeaderCellProps) {
  const baseComponentProps = useBaseComponent('TableHeaderCell', {
    props: { disablePaddings: props.disablePaddings },
  });
  const mergedProps = { ...props, ...baseComponentProps };
  const { children, ariaLabel, ariaLabelledby, ariaDescribedby, ariaSort, disablePaddings, __internalRootRef } =
    mergedProps;
  const { className, ...restBaseProps } = getBaseProps(mergedProps);
  return (
    <InternalTableHeaderCell
      ref={__internalRootRef}
      className={className}
      disablePaddings={disablePaddings}
      nativeAttributes={{
        ...restBaseProps,
        scope: 'col',
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaDescribedby,
        'aria-sort': ariaSort,
      }}
    >
      {children}
    </InternalTableHeaderCell>
  );
}

applyDisplayName(TableHeaderCell, 'TableHeaderCell');
export default TableHeaderCell;
