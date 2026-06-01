// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import clsx from 'clsx';

import { Box, Table, TextFilter } from '~components';
import { TableProps } from '~components/table';

import { SimplePage } from '../app/templates';
import * as tableProps from '../table/shared-configs';

import styles from './style-v2.scss';

const items = tableProps.createSimpleItems(6);

export default function TableStyleV2Page() {
  const [sortingColumn, setSortingColumn] = useState<TableProps.SortingColumn<tableProps.Item> | undefined>(undefined);
  const [sortDescending, setSortDescending] = useState(false);
  const [selectedItems, setSelectedItems] = useState<tableProps.Item[]>([items[1], items[3]]);
  const [filterText, setFilterText] = useState('');

  const sortedItems = [...items]
    .filter(i => !filterText || i.text.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      if (!sortingColumn) {
        return 0;
      }
      const field = sortingColumn.sortingField as keyof tableProps.Item;
      const cmp = String(a[field]).localeCompare(String(b[field]));
      return sortDescending ? -cmp : cmp;
    });

  const columns: TableProps.ColumnDefinition<tableProps.Item>[] = [
    { id: 'text', header: 'Text', cell: item => item.text, sortingField: 'text' },
    { id: 'number', header: 'Number', cell: item => item.number, sortingField: 'number' },
  ];

  return (
    <SimplePage title="Table with Style API v2" screenshotArea={{}}>
      <Table
        className={styles['styled-table']}
        columnDefinitions={columns}
        items={sortedItems}
        empty={
          <Box textAlign="center" color="inherit">
            No items to display
          </Box>
        }
        sortingColumn={sortingColumn}
        sortingDescending={sortDescending}
        onSortingChange={({ detail }) => {
          setSortingColumn(detail.sortingColumn);
          setSortDescending(detail.isDescending ?? false);
        }}
        selectionType="multi"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        ariaLabels={tableProps.ariaLabels}
        selectionClassName={({ item }) => {
          if (!item) {
            return styles['selection-header'];
          }
          switch (item.text) {
            case 'One':
              return clsx(styles['selection-base'], styles['selection-green']);
            case 'Two':
              return clsx(styles['selection-base'], styles['selection-blue']);
            default:
              return styles['selection-base'];
          }
        }}
        filter={
          <TextFilter
            filteringText={filterText}
            onChange={({ detail }) => setFilterText(detail.filteringText)}
            className={styles['styled-filter']}
          />
        }
      />
    </SimplePage>
  );
}
