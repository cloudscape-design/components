// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TableForwardRefType, TableProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalTable from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { TableProps };
const Table = React.forwardRef(
  <T,>(
    { items = [], selectedItems = [], variant = 'container', contentDensity = 'comfortable', ...props }: TableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Table', {
      loading: props.loading,
      selectionType: props.selectionType,
    });
    return (
      <InternalTable
        items={items}
        selectedItems={selectedItems}
        variant={variant}
        contentDensity={contentDensity}
        {...props}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
) as TableForwardRefType;

applyDisplayName(Table, 'Table');
export default Table;
