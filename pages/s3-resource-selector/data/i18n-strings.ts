// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { S3ResourceSelectorProps } from '~components/s3-resource-selector';

export const i18nStrings: S3ResourceSelectorProps.I18nStrings = {
  inContextInputPlaceholder: 's3://bucket/prefix/object',
  inContextInputClearAriaLabel: 'Clear',
  inContextSelectPlaceholder: 'Choose a version',
  inContextBrowseButton: 'Browse S3',
  inContextViewButton: 'View',
  inContextViewButtonAriaLabel: 'View (opens a new tab)',
  inContextLoadingText: 'Loading resource',
  inContextUriLabel: 'Resource URI',
  inContextVersionSelectLabel: 'Object version',

  modalTitle: 'Choose audio file in S3',
  modalCancelButton: 'Cancel',
  modalSubmitButton: 'Choose',
  modalBreadcrumbRootItem: 'S3 buckets',
  modalLastUpdatedText: 'Last updated',

  selectionBuckets: 'Buckets',
  selectionObjects: 'Objects',
  selectionVersions: 'Versions',
  selectionBucketsSearchPlaceholder: 'Find bucket',
  selectionObjectsSearchPlaceholder: 'Find object by prefix',
  selectionVersionsSearchPlaceholder: 'Find version',
  selectionBucketsLoading: 'Loading buckets',
  selectionBucketsNoItems: 'No buckets',
  selectionObjectsLoading: 'Loading objects',
  selectionObjectsNoItems: 'No objects',
  selectionVersionsLoading: 'Loading versions',
  selectionVersionsNoItems: 'No versions',

  filteringCounterText: count => `${count} ${count === 1 ? 'match' : 'matches'}`,
  filteringNoMatches: 'No matches',
  filteringCantFindMatch: "We can't find a match.",
  clearFilterButtonText: 'Clear filter',

  columnBucketName: 'Name',
  columnBucketCreationDate: 'Creation date',
  columnBucketRegion: 'Region',
  columnObjectKey: 'Key',
  columnObjectLastModified: 'Last modified',
  columnObjectSize: 'Size',
  columnVersionID: 'Version ID',
  columnVersionLastModified: 'Last modified',
  columnVersionSize: 'Size',

  validationPathMustBegin: 'The path must begin with s3://',
  validationBucketLowerCase: 'The bucket name must start with a lowercase character or number.',
  validationBucketMustNotContain: 'The bucket name must not contain uppercase characters.',
  validationBucketMustComplyDns: 'The bucket name must comply with DNS naming conventions',
  validationBucketLength: 'The bucket name must be from 3 to 63 characters.',

  labelSortedDescending: columnName => `${columnName}, sorted descending`,
  labelSortedAscending: columnName => `${columnName}, sorted ascending`,
  labelNotSorted: columnName => `${columnName}, not sorted`,
  labelsPagination: {
    nextPageLabel: 'Next page',
    previousPageLabel: 'Previous page',
    pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
  },
  labelsBucketsSelection: {
    itemSelectionLabel: (data, item) => `${item.Name}`,
    selectionGroupLabel: 'Buckets',
  },
  labelsObjectsSelection: {
    itemSelectionLabel: (data, item) => `${item.Key}`,
    selectionGroupLabel: 'Objects',
  },
  labelsVersionsSelection: {
    itemSelectionLabel: (data, item) => `${item.LastModified}`,
    selectionGroupLabel: 'Versions',
  },
  labelFiltering: itemsType => `Find ${itemsType}`,
  labelRefresh: 'Refresh the data',
  labelModalDismiss: 'Dismiss the modal',
  labelBreadcrumbs: 'S3 navigation',
};
