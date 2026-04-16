// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Checkbox, Header, Pagination, SpaceBetween, Table, TextFilter } from '~components';
import { TableProps } from '~components/table';

import { SimplePage } from '../app/templates';
import { ariaLabels, Item } from './shared-configs';
import './css-style-api.css';

interface DemoItem extends Item {
  enabled: boolean;
}

const items: DemoItem[] = [
  { number: 0, text: 'One', enabled: true },
  { number: 1, text: 'Two', enabled: false },
  { number: 2, text: 'Three', enabled: true },
  { number: 3, text: 'Four', enabled: false },
];

const columnDefinitions: TableProps.ColumnDefinition<DemoItem>[] = [
  { id: 'text', header: 'Text', cell: item => item.text },
  {
    id: 'enabled',
    header: 'Enabled',
    cell: item => <Checkbox checked={item.enabled} onChange={() => {}} />,
  },
  { id: 'number', header: 'Number', cell: item => item.number },
];

export default function Page() {
  const [selectedItems, setSelectedItems] = useState([items[0], items[2]]);
  const [filterText, setFilterText] = useState('');

  const filteredItems = items.filter(
    item => !filterText || item.text.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <SimplePage title="CSS Style API — Table">
      <SpaceBetween size="l">
        <div>
          <h2>Custom themed table</h2>
          <p>
            This demo uses only CSS custom properties and class selectors from the table style API to restyle the table.
          </p>
        </div>

        <Table
          className="custom-table"
          columnDefinitions={columnDefinitions}
          items={filteredItems}
          selectionType="multi"
          selectedItems={selectedItems}
          trackBy="text"
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          ariaLabels={ariaLabels}
          header={<Header counter={`(${filteredItems.length})`}>Styled items</Header>}
          filter={
            <TextFilter filteringText={filterText} onChange={({ detail }) => setFilterText(detail.filteringText)} />
          }
          pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
          footer="Showing all items"
          resizableColumns={true}
        />
      </SpaceBetween>
    </SimplePage>
  );
}
