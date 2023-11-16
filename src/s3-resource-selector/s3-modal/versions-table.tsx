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
import { useInternalI18n } from '../../i18n/context';

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
  const i18n = useInternalI18n('s3-resource-selector');

  return (
    <BasicS3Table<S3ResourceSelectorProps.Version>
      forwardFocusRef={forwardFocusRef}
      trackBy="VersionId"
      fetchData={() => {
        const [bucketName, ...rest] = pathSegments;
        return fetchData(bucketName, joinObjectPath(rest));
      }}
      i18nStrings={{
        ...getSharedI18Strings(i18n, i18nStrings),
        header: i18n('i18nStrings.selectionVersions', i18nStrings?.selectionVersions),
        loadingText: i18n('i18nStrings.selectionVersionsLoading', i18nStrings?.selectionVersionsLoading),
        filteringAriaLabel: i18n(
          'i18nStrings.labelFiltering',
          i18nStrings?.labelFiltering,
          format => itemsType => format({ itemsType })
        )?.(i18n('i18nStrings.selectionVersions', i18nStrings?.selectionVersions) ?? ''),
        filteringPlaceholder: i18n(
          'i18nStrings.selectionVersionsSearchPlaceholder',
          i18nStrings?.selectionVersionsSearchPlaceholder
        ),
        emptyText: i18n('i18nStrings.selectionVersionsNoItems', i18nStrings?.selectionVersionsNoItems),
        selectionLabels: {
          ...i18nStrings?.labelsVersionsSelection,
          selectionGroupLabel: i18n(
            'i18nStrings.labelsVersionsSelection.selectionGroupLabel',
            i18nStrings?.labelsVersionsSelection?.selectionGroupLabel
          ),
          itemSelectionLabel: i18n(
            'i18nStrings.labelsVersionsSelection.itemSelectionLabel',
            i18nStrings?.labelsVersionsSelection?.itemSelectionLabel,
            format => (data, item) => format({ item__VersionId: item.VersionId ?? '' })
          ),
        },
      }}
      isVisualRefresh={isVisualRefresh}
      visibleColumns={visibleColumns}
      isItemDisabled={isItemDisabled}
      columnDefinitions={[
        {
          id: 'ID',
          header: i18n('i18nStrings.columnVersionID', i18nStrings?.columnVersionID),
          ariaLabel: getColumnAriaLabel(
            i18n,
            i18nStrings,
            i18n('i18nStrings.columnVersionID', i18nStrings?.columnVersionID)
          ),
          sortingField: 'VersionId',
          cell: item => item.VersionId,
          minWidth: '250px',
        },
        {
          id: 'LastModified',
          header: i18n('i18nStrings.columnVersionLastModified', i18nStrings?.columnVersionLastModified),
          ariaLabel: getColumnAriaLabel(
            i18n,
            i18nStrings,
            i18n('i18nStrings.columnVersionLastModified', i18nStrings?.columnVersionLastModified)
          ),
          sortingComparator: (a, b) => compareDates(a.LastModified, b.LastModified),
          cell: item => formatDefault(item.LastModified),
        },
        {
          id: 'Size',
          header: i18n('i18nStrings.columnVersionSize', i18nStrings?.columnVersionSize),
          ariaLabel: getColumnAriaLabel(
            i18n,
            i18nStrings,
            i18n('i18nStrings.columnVersionSize', i18nStrings?.columnVersionSize)
          ),
          sortingField: 'Size',
          cell: item => formatSize(item.Size),
        },
      ]}
      onSelect={item => onSelect(item?.VersionId ?? '')}
    />
  );
}
