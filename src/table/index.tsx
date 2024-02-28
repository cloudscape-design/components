// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TableForwardRefType, TableProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalTable, { InternalTableAsSubstep } from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';
import { useLatencyMetrics } from '../internal/hooks/use-latency-metrics';

export { TableProps };
const Table = React.forwardRef(
  <T,>(
    { items = [], selectedItems = [], variant = 'container', contentDensity = 'comfortable', ...props }: TableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Table', {
      props: {
        contentDensity,
        resizableColumns: props.resizableColumns,
        selectionType: props.selectionType,
        stickyHeader: props.stickyHeader,
        stripedRows: props.stripedRows,
        variant,
        wrapLines: props.wrapLines,
        enableKeyboardNavigation: props.enableKeyboardNavigation,
      },
    });

    const tableProps: Parameters<typeof InternalTable<T>>[0] = {
      items,
      selectedItems,
      variant,
      contentDensity,
      ...props,
      ...baseComponentProps,
      ref,
    };

    useLatencyMetrics({
      componentName: 'Table',
      elementRef: baseComponentProps.__internalRootRef,
      loading: props.loading,
      // TODO: Add the instanceId when it becomes available.
      instanceId: undefined,
    });

    if (variant === 'borderless' || variant === 'embedded') {
      return <InternalTable {...tableProps} />;
    }

    return (
      <AnalyticsFunnelSubStep>
        <InternalTableAsSubstep {...tableProps} />
      </AnalyticsFunnelSubStep>
    );
  }
) as TableForwardRefType;

applyDisplayName(Table, 'Table');
export default Table;
