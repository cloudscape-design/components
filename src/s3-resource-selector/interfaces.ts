// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TableProps } from '../table/interfaces';
import { PaginationProps } from '../pagination/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface S3ResourceSelectorProps extends BaseComponentProps {
  /**
   * Specifies additional information about component status.
   */
  alert?: React.ReactNode;

  /**
   * Adds `aria-labelledby` to the component. If you're using this component within a form field,
   * don't set this property because the form field component automatically sets it.
   *
   * Use this property if the component isn't surrounded by a form field, or you want to override the value
   * automatically set by the form field (for example, if you have two components within a single form field).
   *
   * To use it correctly, define an ID for the element you want to use as label and set the property to that ID.
   */
  ariaLabelledby?: string;

  /**
   * Adds `aria-describedby` to the component. If you're using this component within a form field,
   * don't set this property because the form field component automatically sets it.
   *
   * Use this property if the component isn't surrounded by a form field, or you want to override the value
   * automatically set by the form field (for example, if you have two components within a single form field).
   *
   * To use it correctly, define an ID for each element that you want to use as a description
   * and set the property to a string of each ID separated by spaces (for example, `"id1 id2 id3"`).
   */
  ariaDescribedby?: string;

  /**
   * Adds `aria-label` to the component.
   */
  ariaLabel?: string;

  /**
   * Adds `aria-labelledby` to the S3 URI input. If you're using this component within a form field,
   * you do not need to set this property, as the form field component will set it automatically.
   *
   * Use this property if the component isn't surrounded by a form field, or you want to override the value
   * automatically set by the form field (for example, if you have two components within a single form field).
   *
   * To use it correctly, define an ID for the element you want to use as label and set the property to that ID.
   */
  inputAriaDescribedby?: string;

  /**
   * An array of the item types that are selectable in the table view. The array may contain the following items:
   * 'buckets', 'objects', or 'versions'. Example: ['buckets', 'objects']. By default, no items are selectable.
   * This property determines whether the component operates in Read mode or Write mode:
   * * Read mode - When 'objects' and 'versions' values are provided (folder selection should be disabled by
   * customizing `objectsIsItemDisabled` function).
   * * Write mode - When 'buckets' and 'objects' values are provided (file selection should be disabled by
   * customizing `objectsIsItemDisabled` function).
   */
  selectableItemsTypes?: ReadonlyArray<S3ResourceSelectorProps.SelectableItems>;

  /**
   * Href of the selected object that is applied to the View button.
   */
  viewHref?: string;

  /**
   * Whether the S3 URI input field is in invalid state.
   */
  invalid?: boolean;

  /**
   * Optionally overrides the set of visible columns in the Buckets view. Available columns: 'Name', 'CreationDate',
   * and 'Region'.
   */
  bucketsVisibleColumns?: ReadonlyArray<string>;

  /**
   * Optionally overrides the set of visible columns in the Objects view. Available columns: 'Key', 'LastModified',
   * and 'Size'.
   */
  objectsVisibleColumns?: ReadonlyArray<string>;

  /**
   * Optionally overrides the set of visible columns in the Versions view. Available columns: 'ID', 'CreationDate',
   * and 'Size'.
   */
  versionsVisibleColumns?: ReadonlyArray<string>;

  /**
   * Optionally overrides whether a bucket should be disabled for selection in the Buckets view or not.
   * It has higher priority than `selectableItemsTypes`. Example: if `selectableItemsTypes` has `['buckets']` value and
   * `bucketsIsItemDisabled` returns false for a bucket, then the bucket is disabled for selection.
   */
  bucketsIsItemDisabled?: (item: S3ResourceSelectorProps.Bucket) => boolean;

  /**
   * Optionally overrides whether an object should be disabled for selection in the Objects view or not. Similar to
   * `bucketsIsItemDisabled` this property takes precedence over the `selectableItemsTypes` property.
   */
  objectsIsItemDisabled?: (item: S3ResourceSelectorProps.Object) => boolean;

  /**
   * Optionally overrides whether a version should be disabled for selection in the Versions view or not. Similar to
   * `bucketsIsItemDisabled` this property takes precedence over the `selectableItemsTypes` property.
   */
  versionsIsItemDisabled?: (item: S3ResourceSelectorProps.Version) => boolean;

  /**
   * The current selected resource. Resource has the following properties:
   * - `uri` (string) - URI of the resource.
   * - `versionId` (string) - (Optional) Version ID of the selected resource.
   */
  resource: S3ResourceSelectorProps.Resource;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: S3ResourceSelectorProps.I18nStrings;

  /**
   * Specifies a function that returns all available buckets. The return type of the function should be a promise
   * that resolves to a list of objects with the following properties:
   * - `Name` (string) - Name of the bucket.
   * - `CreationDate` (string) - (Optional) Creation date of the bucket.
   * - `Region` (string) - (Optional) Region of the bucket.
   */
  fetchBuckets: () => Promise<ReadonlyArray<S3ResourceSelectorProps.Bucket>>;

  /**
   * Specifies a function that returns available objects and object prefixes for the given `bucketName` and `pathPrefix`.
   * The return type of the function should be a promise that resolves to a list of objects with the following properties:
   * - `Key` (string) - Name of the object or object prefix.
   * - `LastModified` (string) - (Optional) Date when this object was last modified.
   * - `Size` (number) - (Optional) Size of the object.
   * - `IsFolder` (boolean) - (Optional)  Determines whether the entry is an object prefix (folder).
   */
  fetchObjects: (bucketName: string, pathPrefix: string) => Promise<ReadonlyArray<S3ResourceSelectorProps.Object>>;

  /**
   * Specifies a function that returns available versions for the given `bucketName` and `pathPrefix`.
   * The return type of the function should be a promise that resolves to a list of versions with the following properties:
   * - `VersionId` (string) - Version ID of an object.
   * - `LastModified` (string) - (Optional) Date when this object was last modified.
   * - `Size` (number) - (Optional) Size of the object version.
   */
  fetchVersions: (bucketName: string, pathPrefix: string) => Promise<ReadonlyArray<S3ResourceSelectorProps.Version>>;

  /**
   * Fired when the resource selection is changed. The event detail object contains resource that represents the full
   * path of the selected resource and `errorText` that may contain a validation error.
   */
  onChange?: NonCancelableEventHandler<S3ResourceSelectorProps.ChangeDetail>;
}

// Does not use TableProps.AriaLabels, because here we do not need "allItemsSelectionLabel"
// it is not applicable to single selection mode
interface SelectionLabels<T> {
  itemSelectionLabel: (data: TableProps.SelectionState<T>, row: T) => string;
  selectionGroupLabel: string;
}

type SortingColumnContainingString = (columnName: string) => string;

export namespace S3ResourceSelectorProps {
  export interface Bucket {
    Name?: string;
    CreationDate?: string;
    // artificial field, does not exist on the real s3 response
    Region?: string;
  }
  export interface Object {
    Key?: string;
    LastModified?: string;
    Size?: number;
    // artificial field, does not exist on the real s3 response
    IsFolder?: boolean;
  }
  export interface Version {
    VersionId?: string;
    LastModified?: string;
    Size?: number;
  }

  export interface Resource {
    uri: string;
    versionId?: string;
  }

  export type SelectableItems = 'buckets' | 'objects' | 'versions';

  export interface I18nStrings {
    inContextInputPlaceholder?: string;
    inContextInputClearAriaLabel?: string;
    inContextSelectPlaceholder?: string;
    inContextBrowseButton?: string;
    inContextViewButton?: string;
    inContextViewButtonAriaLabel?: string;
    inContextLoadingText?: string;
    inContextUriLabel?: string;
    inContextVersionSelectLabel?: string;

    modalTitle?: string;
    modalCancelButton?: string;
    modalSubmitButton?: string;
    modalBreadcrumbRootItem?: string;

    selectionBuckets?: string;
    selectionObjects?: string;
    selectionVersions?: string;
    selectionBucketsSearchPlaceholder?: string;
    selectionObjectsSearchPlaceholder?: string;
    selectionVersionsSearchPlaceholder?: string;
    selectionBucketsLoading?: string;
    selectionBucketsNoItems?: string;
    selectionObjectsLoading?: string;
    selectionObjectsNoItems?: string;
    selectionVersionsLoading?: string;
    selectionVersionsNoItems?: string;

    filteringCounterText?: (count: number) => string;
    filteringNoMatches?: string;
    filteringCantFindMatch?: string;
    clearFilterButtonText?: string;

    columnBucketName?: string;
    columnBucketCreationDate?: string;
    columnBucketRegion?: string;
    columnObjectKey?: string;
    columnObjectLastModified?: string;
    columnObjectSize?: string;
    columnVersionID?: string;
    columnVersionLastModified?: string;
    columnVersionSize?: string;

    validationPathMustBegin?: string;
    validationBucketLowerCase?: string;
    validationBucketMustNotContain?: string;
    validationBucketLength?: string;
    validationBucketMustComplyDns?: string;

    labelSortedDescending?: SortingColumnContainingString;
    labelSortedAscending?: SortingColumnContainingString;
    labelNotSorted?: SortingColumnContainingString;
    labelsPagination?: PaginationProps.Labels;
    labelsBucketsSelection?: SelectionLabels<Bucket>;
    labelsObjectsSelection?: SelectionLabels<S3ResourceSelectorProps.Object>;
    labelsVersionsSelection?: SelectionLabels<Version>;
    labelFiltering?: (itemsType: string) => string;
    labelRefresh?: string;
    labelModalDismiss?: string;
    labelBreadcrumbs?: string;
    labelExpandBreadcrumbs?: string;
    labelClearFilter?: string;
  }

  export interface ChangeDetail {
    resource: Resource;
    errorText?: string;
  }

  export interface Ref {
    /**
     * Focuses the S3 URI input field
     */
    focus(): void;
  }
}
