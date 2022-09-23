// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface S3ResourceSelectorI18n {
  i18nStrings: {
    clearFilterButtonText: string;
    columnBucketCreationDate: string;
    columnBucketName: string;
    columnBucketRegion: string;
    columnObjectKey: string;
    columnObjectLastModified: string;
    columnObjectSize: string;
    columnVersionID: string;
    columnVersionLastModified: string;
    columnVersionSize: string;
    filteringCantFindMatch: string;
    filteringCounterText: ({ count }: { count: string }) => string;
    filteringNoMatches: string;
    inContextBrowseButton: string;
    inContextInputPlaceholder: string;
    inContextLoadingText: string;
    inContextSelectPlaceholder: string;
    inContextUriLabel: string;
    inContextVersionSelectLabel: string;
    inContextViewButton: string;
    labelBreadcrumbs: string;
    labelModalDismiss: string;
    labelNotSorted: ({ columnName }: { columnName: string }) => string;
    labelRefresh: string;
    labelSortedAscending: ({ columnName }: { columnName: string }) => string;
    labelSortedDescending: ({ columnName }: { columnName: string }) => string;
    labelsBucketsSelection: {
      selectionGroupLabel: string;
    };
    labelsObjectsSelection: {
      selectionGroupLabel: string;
    };
    labelsPagination: {
      nextPageLabel: string;
      previousPageLabel: string;
      pageLabel: ({ pageNumber }: { pageNumber: string }) => string;
    };
    labelsVersionsSelection: {
      selectionGroupLabel: string;
    };
    modalBreadcrumbRootItem: string;
    modalCancelButton: string;
    modalSubmitButton: string;
    modalTitle: string;
    selectionBuckets: string;
    selectionBucketsLoading: string;
    selectionBucketsNoItems: string;
    selectionBucketsSearchPlaceholder: string;
    selectionObjects: string;
    selectionObjectsLoading: string;
    selectionObjectsNoItems: string;
    selectionObjectsSearchPlaceholder: string;
    selectionVersions: string;
    selectionVersionsLoading: string;
    selectionVersionsNoItems: string;
    selectionVersionsSearchPlaceholder: string;
    validationBucketLength: string;
    validationBucketLowerCase: string;
    validationBucketMustComplyDns: string;
    validationBucketMustNotContain: string;
    validationPathMustBegin: string;
  };
}
