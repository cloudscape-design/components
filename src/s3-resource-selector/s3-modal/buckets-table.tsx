// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalLink from '../../link/internal';
import { TableProps } from '../../table/interfaces';
import { ForwardFocusRef } from '../../internal/hooks/forward-focus';
import { S3ResourceSelectorProps } from '../interfaces';
import { compareDates, getColumnAriaLabel, includes } from './table-utils';
import { formatDefault } from './column-formats';
import { BasicS3Table, getSharedI18Strings } from './basic-table';

interface BucketsTableProps {
  forwardFocusRef: React.Ref<ForwardFocusRef>;
  visibleColumns: ReadonlyArray<string>;
  isItemDisabled: TableProps.IsItemDisabled<S3ResourceSelectorProps.Bucket> | undefined;
  selectableItemsTypes: S3ResourceSelectorProps['selectableItemsTypes'];
  fetchData: S3ResourceSelectorProps['fetchBuckets'];
  i18nStrings: S3ResourceSelectorProps.I18nStrings | undefined;
  isVisualRefresh?: boolean;
  onDrilldown: (path: string) => void;
  onSelect: (uri: string) => void;
}

export function BucketsTable({
  forwardFocusRef,
  i18nStrings,
  isVisualRefresh,
  isItemDisabled,
  selectableItemsTypes,
  fetchData,
  visibleColumns,
  onDrilldown,
  onSelect,
}: BucketsTableProps) {
  return (
    <BasicS3Table<S3ResourceSelectorProps.Bucket>
      forwardFocusRef={forwardFocusRef}
      trackBy="Name"
      fetchData={fetchData}
      visibleColumns={visibleColumns}
      isItemDisabled={isItemDisabled || (() => !includes(selectableItemsTypes, 'buckets'))}
      i18nStrings={{
        ...getSharedI18Strings(i18nStrings),
        header: i18nStrings?.selectionBuckets,
        loadingText: i18nStrings?.selectionBucketsLoading,
        filteringAriaLabel: i18nStrings?.labelFiltering(i18nStrings?.selectionBuckets),
        filteringPlaceholder: i18nStrings?.selectionBucketsSearchPlaceholder,
        emptyText: i18nStrings?.selectionBucketsNoItems,
        selectionLabels: i18nStrings?.labelsBucketsSelection,
      }}
      isVisualRefresh={isVisualRefresh}
      columnDefinitions={[
        {
          id: 'Name',
          header: i18nStrings?.columnBucketName,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnBucketName),
          sortingField: 'Name',
          cell: item => {
            const isClickable = includes(selectableItemsTypes, 'objects') || includes(selectableItemsTypes, 'versions');
            return isClickable ? (
              <InternalLink onFollow={() => item.Name && onDrilldown(item.Name)} variant="link">
                {item.Name}
              </InternalLink>
            ) : (
              item.Name
            );
          },
          minWidth: '250px',
        },
        {
          id: 'CreationDate',
          header: i18nStrings?.columnBucketCreationDate,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnBucketCreationDate),
          sortingComparator: (a, b) => compareDates(a.CreationDate, b.CreationDate),
          cell: item => formatDefault(item.CreationDate),
        },
        {
          id: 'Region',
          header: i18nStrings?.columnBucketRegion,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnBucketRegion),
          sortingField: 'Region',
          cell: item => formatDefault(item.Region),
          minWidth: '150px',
        },
      ]}
      onSelect={item => onSelect(item?.Name ?? '')}
    />
  );
}
