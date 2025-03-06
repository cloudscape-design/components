// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { CollectionPreferencesMetadata } from '../internal/context/collection-preferences-metadata-context';
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
      cellVerticalAlign = 'middle',
      firstIndex = 1,
      ...props
    }: TableProps<T>,
    ref: React.Ref<TableProps.Ref>
  ) => {
    const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
    const hasHiddenColumns =
      (props.visibleColumns && props.visibleColumns.length < props.columnDefinitions.length) ||
      props.columnDisplay?.some(col => !col.visible);
    const hasStickyColumns = !!props.stickyColumns?.first || !!props.stickyColumns?.last;
    const baseComponentProps = useBaseComponent(
      'Table',
      {
        props: {
          contentDensity,
          resizableColumns: props.resizableColumns,
          selectionType: props.selectionType,
          stickyHeader: props.stickyHeader,
          stripedRows: props.stripedRows,
          variant,
          wrapLines: props.wrapLines,
          enableKeyboardNavigation: props.enableKeyboardNavigation,
          totalItemsCount: props.totalItemsCount,
          flowType: analyticsMetadata.flowType,
          cellVerticalAlign,
        },
        metadata: {
          expandableRows: !!props.expandableRows,
          progressiveLoading: !!props.getLoadingStatus,
          inlineEdit: props.columnDefinitions.some(def => !!def.editConfig),
          disabledInlineEdit: props.columnDefinitions.some(def => !!def.editConfig?.disabledReason),
          hasSortableColumns: props.columnDefinitions.some(def => def.sortingField || def.sortingComparator),
          hasHiddenColumns,
          hasStickyColumns,
          hasFilterSlot: !!props.filter,
          hasPaginationSlot: !!props.pagination,
          itemsCount: items.length,
          hasInstanceIdentifier: Boolean(analyticsMetadata?.instanceIdentifier),
          usesVisibleColumns: !!props.visibleColumns,
          usesColumnDisplay: !!props.columnDisplay,
          usesColumnDefinitionsVerticalAlign: props.columnDefinitions.some(
            def => def.verticalAlign !== cellVerticalAlign
          ),
        },
      },
      analyticsMetadata
    );

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
      cellVerticalAlign,
      ...props,
      ...baseComponentProps,
      ref,
      ...getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata }),
    };

    const collectionPreferencesMetadata = {
      tableContentDensity: contentDensity,
      tableHasStripedRows: !!props.stripedRows,
      tableHasHiddenColumns: hasHiddenColumns,
      tableHasStickyColumns: hasStickyColumns,
    };

    if (variant === 'borderless' || variant === 'embedded') {
      return (
        <CollectionPreferencesMetadata.Provider value={collectionPreferencesMetadata}>
          <InternalTable {...tableProps} />
        </CollectionPreferencesMetadata.Provider>
      );
    }

    return (
      <CollectionPreferencesMetadata.Provider value={collectionPreferencesMetadata}>
        <AnalyticsFunnelSubStep>
          <InternalTableAsSubstep {...tableProps} />
        </AnalyticsFunnelSubStep>
      </CollectionPreferencesMetadata.Provider>
    );
  }
) as TableForwardRefType;

applyDisplayName(Table, 'Table');
export default Table;
