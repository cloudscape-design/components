// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TableForwardRefType, TableProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalTable from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';

export { TableProps };
const Table = React.forwardRef(
  <T,>(
    { items = [], selectedItems = [], variant = 'container', contentDensity = 'comfortable', ...props }: TableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Table');

    const table = (
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
    if (variant === 'borderless' || variant === 'embedded') {
      return table;
    }

    return <AnalyticsFunnelSubStep>{table}</AnalyticsFunnelSubStep>;
  }
) as TableForwardRefType;

applyDisplayName(Table, 'Table');
export default Table;
