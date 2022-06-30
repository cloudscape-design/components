// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { S3ResourceSelectorProps } from '../interfaces';
import { getColumnAriaLabel, compareDates } from './table-utils';
import { TableProps } from '../../table/interfaces';
import { ForwardFocusRef } from '../../internal/hooks/forward-focus';
import { formatSize, formatDefault } from './column-formats';
import { BasicS3Table, getSharedI18Strings } from './basic-table';
import { joinObjectPath } from '../utils';

interface VersionsTableProps {
  forwardFocusRef: React.Ref<ForwardFocusRef>;
  pathSegments: ReadonlyArray<string>;
  visibleColumns: ReadonlyArray<string>;
  isItemDisabled: TableProps.IsItemDisabled<S3ResourceSelectorProps.Version> | undefined;
  fetchData: S3ResourceSelectorProps['fetchVersions'];
  i18nStrings: S3ResourceSelectorProps.I18nStrings | undefined;
  isVisualRefresh?: boolean;
  onSelect: (versionId: string) => void;
}

export function VersionsTable({
  forwardFocusRef,
  pathSegments,
  i18nStrings,
  isVisualRefresh,
  isItemDisabled,
  fetchData,
  visibleColumns,
  onSelect,
}: VersionsTableProps) {
  return (
    <BasicS3Table<S3ResourceSelectorProps.Version>
      forwardFocusRef={forwardFocusRef}
      trackBy="VersionId"
      fetchData={() => {
        const [bucketName, ...rest] = pathSegments;
        return fetchData(bucketName, joinObjectPath(rest));
      }}
      i18nStrings={{
        ...getSharedI18Strings(i18nStrings),
        header: i18nStrings?.selectionVersions,
        filteringAriaLabel: i18nStrings?.labelFiltering(i18nStrings?.selectionVersions),
        filteringPlaceholder: i18nStrings?.selectionVersionsSearchPlaceholder,
        loadingText: i18nStrings?.selectionVersionsLoading,
        emptyText: i18nStrings?.selectionVersionsNoItems,
        selectionLabels: i18nStrings?.labelsVersionsSelection,
      }}
      isVisualRefresh={isVisualRefresh}
      visibleColumns={visibleColumns}
      isItemDisabled={isItemDisabled}
      columnDefinitions={[
        {
          id: 'ID',
          header: i18nStrings?.columnVersionID,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnVersionID),
          sortingField: 'VersionId',
          cell: item => item.VersionId,
          minWidth: '250px',
        },
        {
          id: 'LastModified',
          header: i18nStrings?.columnVersionLastModified,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnVersionLastModified),
          sortingComparator: (a, b) => compareDates(a.LastModified, b.LastModified),
          cell: item => formatDefault(item.LastModified),
        },
        {
          id: 'Size',
          header: i18nStrings?.columnVersionSize,
          ariaLabel: getColumnAriaLabel(i18nStrings, i18nStrings?.columnVersionSize),
          sortingField: 'Size',
          cell: item => formatSize(item.Size),
        },
      ]}
      onSelect={item => onSelect(item?.VersionId ?? '')}
    />
  );
}
