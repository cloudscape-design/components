// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import Header from '~components/header';
import Table from '~components/table';
import Box from '~components/box';
import { generateItems } from './generate-data';
import { columnsConfig as originalColumnsConfig } from './shared-configs';

const items = generateItems(50);

const columnsConfig = originalColumnsConfig.flatMap(column =>
  column.id !== 'type'
    ? [column]
    : [column, column, column, column, column, column, column, column, column, column].map((typeColumn, index) => ({
        ...typeColumn,
        id: typeColumn.id! + index,
        header: typeColumn.header + '-' + (index + 1),
      }))
);

export default function InContextLoaderPage() {
  const [loading, setLoading] = useState(false);
  const [loadedItems, setLoadedItems] = useState(items.slice(0, 20));

  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
        setLoadedItems(prev => items.slice(0, prev.length + 20));
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [loading]);

  return (
    <Box padding="s">
      <Table
        selectionType="multi"
        header={<Header headingTagOverride="h1">Table with loader rows</Header>}
        columnDefinitions={columnsConfig}
        items={loadedItems}
        variant="container"
        ariaLabels={{
          selectionGroupLabel: 'group label',
          allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
          itemSelectionLabel: ({ selectedItems }, item) =>
            `${item.id} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
          tableLabel: 'Items',
        }}
        inContextLoader={{
          state: loading ? 'loading' : loadedItems.length === items.length ? 'empty' : 'pending',
          loadingText: 'Loading more items',
          loadMoreText: 'Load more items',
          emptyText: 'No more items available',
          onLoadMore: () => {
            setLoading(true);
          },
        }}
      />
    </Box>
  );
}
