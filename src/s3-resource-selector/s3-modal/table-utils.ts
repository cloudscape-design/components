// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { S3ResourceSelectorProps } from '../interfaces';
import { TableProps } from '../../table/interfaces';
import { ComponentFormatFunction } from '../../i18n/context';

export function includes<T>(array: ReadonlyArray<T> | undefined, item: T) {
  return !!array && array.indexOf(item) > -1;
}

export const compareDates = (itemA: string | undefined, itemB: string | undefined) => {
  const timeA = itemA ? new Date(itemA).getTime() : 0;
  const timeB = itemB ? new Date(itemB).getTime() : 0;
  return timeA - timeB;
};

export function getColumnAriaLabel(
  i18n: ComponentFormatFunction<'s3-resource-selector'>,
  i18nStrings?: Pick<
    S3ResourceSelectorProps.I18nStrings,
    'labelNotSorted' | 'labelSortedDescending' | 'labelSortedAscending'
  >,
  columnName = ''
) {
  return ({ sorted, descending }: TableProps.LabelData) => {
    if (!sorted) {
      return (
        i18n('i18nStrings.labelNotSorted', i18nStrings?.labelNotSorted?.(columnName), format =>
          format({ columnName })
        ) ?? ''
      );
    }
    if (descending) {
      return (
        i18n('i18nStrings.labelSortedDescending', i18nStrings?.labelSortedDescending?.(columnName), format =>
          format({ columnName })
        ) ?? ''
      );
    }
    return (
      i18n('i18nStrings.labelSortedAscending', i18nStrings?.labelSortedAscending?.(columnName), format =>
        format({ columnName })
      ) ?? ''
    );
  };
}
