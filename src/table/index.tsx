// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataTableComponent } from './analytics-metadata/interfaces';
import { getSortingColumnId } from './header-cell/utils';
import { TableForwardRefType, TableProps } from './interfaces';
import InternalTable, { InternalTableAsSubstep } from './internal';

export { TableProps };
const Table = React.forwardRef(
  <T,>(
    {
      items = [],
      selectedItems = [],
      variant = 'container',
      contentDensity = 'comfortable',
      firstIndex = 1,
      ...props
    }: TableProps<T>,
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
      metadata: {
        expandableRows: !!props.expandableRows,
        progressiveLoading: !!props.getLoadingStatus,
        inlineEdit: props.columnDefinitions.some(def => !!def.editConfig),
        disabledInlineEdit: props.columnDefinitions.some(def => !!def.editConfig?.disabledReason),
      },
    });

    const analyticsComponentMetadata: GeneratedAnalyticsMetadataTableComponent = {
      name: 'awsui.Table',
      label: { root: 'self' },
      properties: {
        selectionType: props.selectionType || 'none',
        itemsCount: `${items.length}`,
        selectedItemsCount: `${selectedItems.length}`,
        variant,
      },
    };

    const sortingColumnId = getSortingColumnId(props.columnDefinitions, props.sortingColumn);
    if (sortingColumnId) {
      analyticsComponentMetadata.properties.sortingColumnId = sortingColumnId;
      analyticsComponentMetadata.properties.sortingDescending = `${props.sortingDescending || false}`;
    }

    const tableProps: Parameters<typeof InternalTable<T>>[0] = {
      items,
      selectedItems,
      variant,
      contentDensity,
      firstIndex,
      ...props,
      ...baseComponentProps,
      ref,
      ...getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata }),
    };

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
