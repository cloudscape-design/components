// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { S3ResourceSelectorProps } from '../interfaces';
import { compareDates, getColumnAriaLabel, includes } from './table-utils';
import InternalIcon from '../../icon/internal';
import InternalLink from '../../link/internal';
import { TableProps } from '../../table/interfaces';
import { ForwardFocusRef } from '../../internal/hooks/forward-focus';
import { formatSize, formatDefault } from './column-formats';
import { BasicS3Table, getSharedI18Strings } from './basic-table';
import { joinObjectPath } from '../utils';

interface ObjectsTableProps {
  forwardFocusRef: React.Ref<ForwardFocusRef>;
  pathSegments: ReadonlyArray<string>;
  visibleColumns: ReadonlyArray<string>;
  isItemDisabled: TableProps.IsItemDisabled<S3ResourceSelectorProps.Object> | undefined;
  selectableItemsTypes: S3ResourceSelectorProps['selectableItemsTypes'];
  fetchData: S3ResourceSelectorProps['fetchObjects'];
  i18nStrings: S3ResourceSelectorProps.I18nStrings | undefined;
  isVisualRefresh?: boolean;
  onDrilldown: (path: S3ResourceSelectorProps.Object) => void;
  onSelect: (uri: string) => void;
}

export function ObjectsTable({
  forwardFocusRef,
  pathSegments,
  i18nStrings,
  isVisualRefresh,
  isItemDisabled,
  selectableItemsTypes,
  fetchData,
  visibleColumns,
  onDrilldown,
  onSelect,
}: ObjectsTableProps) {
  return (
    <BasicS3Table<S3ResourceSelectorProps.Object>
      // remount fresh component every we change the path to reset the inner state (e.g. selection/filtering)
      key={pathSegments.join('/')}
      forwardFocusRef={forwardFocusRef}
      trackBy="Key"
      fetchData={() => {
        const [bucketName, ...rest] = pathSegments;
        return fetchData(bucketName, joinObjectPath(rest));
      }}
      i18nStrings={{
        ...getSharedI18Strings(i18nStrings),
        header: i18nStrings?.selectionObjects,
        filteringAriaLabel: i18nStrings?.labelFiltering(i18nStrings?.selectionObjects),
        filteringPlaceholder: i18nStrings?.selectionObjectsSearchPlaceholder,
        loadingText: i18nStrings?.selectionObjectsLoading,
        emptyText: i18nStrings?.selectionObjectsNoItems,
        selectionLabels: i18nStrings?.labelsObjectsSelection,
      }}
      isVisualRefresh={isVisualRefresh}
      visibleColumns={visibleColumns}
      isItemDisabled={isItemDisabled || (() => !includes(selectableItemsTypes, 'objects'))}
      columnDefinitions={[
        {
          id: 'Key',
          header: i18nStrings?.columnObjectKey,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnObjectKey),
          sortingField: 'Key',
          cell: item => {
            const isClickable = item.IsFolder || includes(selectableItemsTypes, 'versions');
            return (
              <>
                <InternalIcon name={item.IsFolder ? 'folder' : 'file'} />{' '}
                {isClickable ? (
                  <InternalLink onFollow={() => item.Key && onDrilldown(item)} variant="link">
                    {item.Key}
                  </InternalLink>
                ) : (
                  item.Key
                )}
              </>
            );
          },
          minWidth: '250px',
        },
        {
          id: 'LastModified',
          header: i18nStrings?.columnObjectLastModified,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnObjectLastModified),
          sortingComparator: (a, b) => compareDates(a.LastModified, b.LastModified),
          cell: item => formatDefault(item.LastModified),
        },
        {
          id: 'Size',
          header: i18nStrings?.columnObjectSize,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnObjectSize),
          sortingField: 'Size',
          cell: item => formatSize(item.Size),
        },
      ]}
      onSelect={item => onSelect(item?.Key ?? '')}
    />
  );
}
