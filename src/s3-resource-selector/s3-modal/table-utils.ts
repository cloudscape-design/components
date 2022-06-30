// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { S3ResourceSelectorProps } from '../interfaces';
import { TableProps } from '../../table/interfaces';

const defaultLabels = {
  labelNotSorted: () => '',
  labelSortedDescending: () => '',
  labelSortedAscending: () => '',
};

export function includes<T>(array: ReadonlyArray<T> | undefined, item: T) {
  return !!array && array.indexOf(item) > -1;
}

export const compareDates = (itemA: string | undefined, itemB: string | undefined) => {
  const timeA = itemA ? new Date(itemA).getTime() : 0;
  const timeB = itemB ? new Date(itemB).getTime() : 0;
  return timeA - timeB;
};

export function getColumnAriaLabel(
  i18nStrings: Pick<
    S3ResourceSelectorProps.I18nStrings,
    'labelNotSorted' | 'labelSortedDescending' | 'labelSortedAscending'
  > = defaultLabels,
  columnName = ''
) {
  return ({ sorted, descending }: TableProps.LabelData) => {
    if (!sorted) {
      return i18nStrings?.labelNotSorted(columnName);
    }
    if (descending) {
      return i18nStrings?.labelSortedDescending(columnName);
    }
    return i18nStrings?.labelSortedAscending(columnName);
  };
}
