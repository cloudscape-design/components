// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonDropdownProps } from '../../button-dropdown/interfaces';
import InternalButtonDropdown from '../../button-dropdown/internal';
import { useInternalI18n } from '../../i18n/context';
import { TableProps } from '../interfaces';

import styles from './styles.css.js';

export type SortMenuAction =
  | 'sort-ascending'
  | 'sort-descending'
  | 'add-to-sort-ascending'
  | 'add-to-sort-descending'
  | 'remove-from-sort';

export interface SortMenuProps<T> {
  column: TableProps.ColumnDefinition<T>;
  inSort: boolean;
  isSortedAscending: boolean;
  isSortedDescending: boolean;
  i18nStrings?: TableProps.I18nStrings;
  ariaLabel?: string;
  ariaDescribedby?: string;
  onAction: (action: SortMenuAction) => void;
}

export function SortMenu<T>({
  inSort,
  isSortedAscending,
  isSortedDescending,
  i18nStrings,
  ariaLabel,
  ariaDescribedby,
  onAction,
}: SortMenuProps<T>) {
  const i18n = useInternalI18n('table');

  const items: ButtonDropdownProps.ItemOrGroup[] = [
    {
      id: 'sort-ascending',
      itemType: 'checkbox',
      text: i18n('i18nStrings.sortDropdownSortAscending', i18nStrings?.sortDropdownSortAscending) ?? '',
      checked: isSortedAscending,
    },
    {
      id: 'sort-descending',
      itemType: 'checkbox',
      text: i18n('i18nStrings.sortDropdownSortDescending', i18nStrings?.sortDropdownSortDescending) ?? '',
      checked: isSortedDescending,
    },
    {
      id: 'multi-column-sort-group',
      itemType: 'group',
      text: i18n('i18nStrings.sortDropdownMultiColumnSortGroup', i18nStrings?.sortDropdownMultiColumnSortGroup) ?? '',
      items: [
        {
          id: 'add-to-sort-ascending',
          text: i18n('i18nStrings.sortDropdownAddToSortAscending', i18nStrings?.sortDropdownAddToSortAscending) ?? '',
          disabled: inSort,
          disabledReason: i18n(
            'i18nStrings.sortDropdownAddToSortDisabledReason',
            i18nStrings?.sortDropdownAddToSortDisabledReason
          ),
        },
        {
          id: 'add-to-sort-descending',
          text: i18n('i18nStrings.sortDropdownAddToSortDescending', i18nStrings?.sortDropdownAddToSortDescending) ?? '',
          disabled: inSort,
          disabledReason: i18n(
            'i18nStrings.sortDropdownAddToSortDisabledReason',
            i18nStrings?.sortDropdownAddToSortDisabledReason
          ),
        },
        {
          id: 'remove-from-sort',
          text: i18n('i18nStrings.sortDropdownRemoveFromSort', i18nStrings?.sortDropdownRemoveFromSort) ?? '',
          disabled: !inSort,
          disabledReason: i18n(
            'i18nStrings.sortDropdownRemoveFromSortDisabledReason',
            i18nStrings?.sortDropdownRemoveFromSortDisabledReason
          ),
        },
      ],
    },
  ];

  return (
    <span className={styles['sort-menu']} onClick={e => e.stopPropagation()}>
      <InternalButtonDropdown
        items={items}
        variant="icon"
        compactTrigger={true}
        expandToViewport={true}
        ariaLabel={i18n('ariaLabels.sortMenuTriggerLabel', ariaLabel) ?? ''}
        ariaDescribedby={ariaDescribedby}
        onItemClick={({ detail }) => onAction(detail.id as SortMenuAction)}
      />
    </span>
  );
}
