// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from '@testing-library/react';

import { S3ResourceSelectorProps } from '../../../lib/components/s3-resource-selector';

export async function waitForFetch() {
  // wait out a tick to make the fetch promise resolved
  await act(() => Promise.resolve());
}

export const i18nStrings: S3ResourceSelectorProps.I18nStrings = {
  inContextInputPlaceholder: 's3://bucket/prefix/object',
  inContextSelectPlaceholder: 'Choose a version',
  inContextBrowseButton: 'Browse S3',
  inContextViewButton: 'View',
  inContextViewButtonAriaLabel: 'View (opens a new tab)',
  inContextLoadingText: 'Loading resource',
  inContextUriLabel: 'Resource URI',
  inContextVersionSelectLabel: 'Object version',

  modalTitle: 'Choose an object in S3',
  modalCancelButton: 'Cancel',
  modalSubmitButton: 'Choose',
  modalBreadcrumbRootItem: 'S3 buckets',

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
    itemSelectionLabel: (data, item) => `select ${item.Name}`,
    selectionGroupLabel: 'Buckets',
  },
  labelsObjectsSelection: {
    itemSelectionLabel: (data, item) => `select ${item.Key}`,
    selectionGroupLabel: 'Objects',
  },
  labelsVersionsSelection: {
    itemSelectionLabel: (data, item) => `select ${item.VersionId}`,
    selectionGroupLabel: 'Versions',
  },
  labelFiltering: itemsType => `Find ${itemsType}`,
  labelRefresh: 'Refresh the data',
  labelModalDismiss: 'Dismiss the modal',
  labelBreadcrumbs: 'S3 navigation',
};

export const buckets: ReadonlyArray<S3ResourceSelectorProps.Bucket> = [
  {
    Name: 'bucket-laborum',
    CreationDate: 'October 28, 2020, 07:12:21 (UTC+01:00)',
    Region: 'US East (N. Virginia)',
  },
  {
    Name: 'bucket-ea',
    CreationDate: 'June 12, 2020, 19:47:03 (UTC+02:00)',
    Region: 'US East (Ohio)',
  },
];

export const objects: ReadonlyArray<S3ResourceSelectorProps.Object> = [
  {
    Key: 'simulation-nano-2019',
    IsFolder: true,
  },
  {
    Key: 'black-hole-9ns.sim',
    LastModified: 'December 15, 2020, 15:45:42 (UTC+01:00)',
    Size: 14665468111759,
    IsFolder: false,
  },
  {
    Key: 'wave-function-4ns.sim',
    LastModified: 'April 18, 2020, 12:12:59 (UTC+02:00)',
    Size: 490020096014,
    IsFolder: false,
  },
];

export const versions: ReadonlyArray<S3ResourceSelectorProps.Version> = [
  {
    VersionId: '6036589969ec3d9b2db8faa7',
    LastModified: 'April 10, 2019, 21:21:10 (UTC+02:00)',
    Size: 25016305995260,
  },
  {
    VersionId: '60365899316a2bb778e29e82',
    LastModified: 'October 03, 2020, 03:49:20 (UTC+02:00)',
    Size: 61588133567883,
  },
];
