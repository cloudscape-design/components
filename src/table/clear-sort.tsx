// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { fireNonCancelableEvent } from '../internal/events';
import { TableProps } from './interfaces';

interface ClearSortButtonProps<T> {
  multiColumnSort: TableProps.MultiColumnSort<T>;
  i18nStrings?: TableProps.I18nStrings;
  onClearSort?: () => void;
}

export function ClearSortButton<T>({ multiColumnSort, i18nStrings, onClearSort }: ClearSortButtonProps<T>) {
  const i18n = useInternalI18n('table');
  return (
    <InternalButton
      variant="inline-link"
      formAction="none"
      onClick={() => {
        fireNonCancelableEvent(multiColumnSort.onChange, { sortingColumns: [] });
        onClearSort?.();
      }}
    >
      {i18n('i18nStrings.clearSort', i18nStrings?.clearSort) ?? ''}
    </InternalButton>
  );
}
