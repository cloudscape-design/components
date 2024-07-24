// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';

import Header from '~components/header';
import { NonCancelableCustomEvent } from '~components/interfaces';
import Table, { TableProps } from '~components/table';

import { ariaLabels, Item } from './shared-configs';
const items = createSimpleItems(5);

function createSimpleItems(count: number): Item[] {
  const texts = ['One', 'Two', 'Three', 'Four', 'Five'];
  return range(count).map(number => ({ number, text: texts[number % texts.length] }));
}
export default function App() {
  const [clickDetails, setClickDetails] = useState<TableProps.OnRowClickDetail<Item> | null>(null);
  const [contextMenuDetails, setContextMenuDetails] = useState<TableProps.OnRowContextMenuDetail<Item> | null>(null);

  const [selectedItems, setSelectedItems] = useState([{ number: 2, text: 'Two' }]);
  const SIMPLE_COLUMNS: TableProps.ColumnDefinition<Item>[] = [
    {
      id: 'text',
      cell: item => item.text,
      header: 'Text',
    },
    {
      id: 'number',
      cell: item => item.number,
      header: 'Number',
    },
  ];
  return (
    <>
      <Table
        header={<Header headingTagOverride="h1">Row Events Example</Header>}
        columnDefinitions={SIMPLE_COLUMNS}
        selectionType={'multi'}
        selectedItems={selectedItems}
        trackBy={'text'}
        items={items}
        onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
        onRowClick={(event: NonCancelableCustomEvent<TableProps.OnRowClickDetail<Item>>) => {
          setContextMenuDetails(null);
          setClickDetails(event.detail);
        }}
        onRowContextMenu={(event: CustomEvent<TableProps.OnRowContextMenuDetail<Item>>) => {
          event.preventDefault();
          setClickDetails(null);
          setContextMenuDetails(event.detail);
        }}
        ariaLabels={ariaLabels}
      />
      <div>
        OnRowClick:<span>{JSON.stringify(clickDetails)}</span>
      </div>
      <div>
        onRowContextMenu:<span>{JSON.stringify(contextMenuDetails)}</span>
      </div>
    </>
  );
}
