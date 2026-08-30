// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';

import Checkbox from '~components/checkbox';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';

interface Item {
  id: number;
  name: string;
  type: string;
}

const items: Item[] = range(5).map(i => ({
  id: i + 1,
  name: ['Coffee', 'Tea', 'Lemonade', 'Water', 'Juice'][i],
  type: ['Hot', 'Hot', 'Cold', 'Cold', 'Cold'][i],
}));

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'ID', cell: item => item.id },
  { id: 'name', header: 'Name', cell: item => item.name },
  { id: 'type', header: 'Type', cell: item => item.type },
];

const ariaLabels: TableProps['ariaLabels'] = {
  selectionGroupLabel: 'Items selection',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item(s) selected`,
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.name} is ${selectedItems.includes(item) ? '' : 'not '}selected`,
};

export default function App() {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [selectionType, setSelectionType] = useState<TableProps.SelectionType>('multi');
  const [clickToSelect, setClickToSelect] = useState(true);
  const [isItemDisabled, setIsItemDisabled] = useState(false);

  return (
    <SpaceBetween size="l">
      <SpaceBetween direction="horizontal" size="s">
        <Checkbox checked={clickToSelect} onChange={({ detail }) => setClickToSelect(detail.checked)}>
          clickToSelect
        </Checkbox>
        <Checkbox
          checked={selectionType === 'multi'}
          onChange={({ detail }) => setSelectionType(detail.checked ? 'multi' : 'single')}
        >
          multi-select (uncheck for single)
        </Checkbox>
        <Checkbox checked={isItemDisabled} onChange={({ detail }) => setIsItemDisabled(detail.checked)}>
          disable first item
        </Checkbox>
      </SpaceBetween>

      <Table
        header={<Header headingTagOverride="h1">Row click-to-select</Header>}
        columnDefinitions={columnDefinitions}
        items={items}
        selectionType={selectionType}
        selectedItems={selectedItems}
        trackBy="id"
        clickToSelect={clickToSelect}
        isItemDisabled={isItemDisabled ? item => item.id === 1 : undefined}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        ariaLabels={ariaLabels}
      />

      <div>
        <strong>Selected:</strong> {selectedItems.map(i => i.name).join(', ') || '(none)'}
      </div>
    </SpaceBetween>
  );
}
