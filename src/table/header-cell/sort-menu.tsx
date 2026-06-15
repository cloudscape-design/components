// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonDropdownProps } from '../../button-dropdown/interfaces';
import InternalButtonDropdown from '../../button-dropdown/internal';
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
  onAction: (action: SortMenuAction) => void;
}

export function SortMenu<T>({
  inSort,
  isSortedAscending,
  isSortedDescending,
  i18nStrings,
  ariaLabel,
  onAction,
}: SortMenuProps<T>) {
  const strings = i18nStrings?.sortDropdown;

  const items: ButtonDropdownProps.ItemOrGroup[] = [
    {
      id: 'sort-ascending',
      text: strings?.sortAscending ?? 'Sort ascending',
      disabled: isSortedAscending,
    },
    {
      id: 'sort-descending',
      text: strings?.sortDescending ?? 'Sort descending',
      disabled: isSortedDescending,
    },
    {
      id: 'multi-column-sort-group',
      itemType: 'group',
      text: strings?.multiColumnSortGroup ?? 'Multi-column sort',
      items: [
        {
          id: 'add-to-sort-ascending',
          text: strings?.addToSortAscending ?? 'Add to sort (ascending)',
          disabled: inSort,
        },
        {
          id: 'add-to-sort-descending',
          text: strings?.addToSortDescending ?? 'Add to sort (descending)',
          disabled: inSort,
        },
        {
          id: 'remove-from-sort',
          text: strings?.removeFromSort ?? 'Remove from sort',
          disabled: !inSort,
        },
      ],
    },
  ];

  return (
    <span className={styles['sort-menu']} onClick={e => e.stopPropagation()}>
      <InternalButtonDropdown
        items={items}
        variant="inline-icon"
        ariaLabel={ariaLabel ?? 'Sort options'}
        onItemClick={({ detail }) => onAction(detail.id as SortMenuAction)}
      />
    </span>
  );
}
