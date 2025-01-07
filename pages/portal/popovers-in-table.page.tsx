// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';

import { Box, Button, FormField, Popover, SpaceBetween } from '~components';
import Header from '~components/header';
import Table, { TableProps } from '~components/table';

import { ariaLabels, Item } from '../table/shared-configs';

const items = range(250).map(index => ({ number: index, text: index.toString() }));

const columnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  {
    id: 'number',
    cell: item => item.number,
    header: 'Number',
  },
  {
    id: 'details',
    cell: item => (
      <FormField>
        <Popover content={<PopoverContent />} renderWithPortal={true}>
          Show details for {item.text}
        </Popover>
      </FormField>
    ),
    header: 'Details',
  },
];

function PopoverContent() {
  return (
    <SpaceBetween size="m">
      <Header>Header</Header>
      <Box>Text</Box>
      <Button>Action</Button>
    </SpaceBetween>
  );
}

export default function PopoversInTableTest() {
  const [isActive, setIsActive] = useState(false);
  const [selectedItems, setSelectedItems] = useState([{ number: 2, text: 'Two' }]);
  return (
    <Box margin="m">
      <SpaceBetween size="m">
        <Header headingTagOverride="h1">Popovers with portal in table</Header>

        {isActive ? (
          <Table
            columnDefinitions={columnDefinitions}
            selectionType="multi"
            selectedItems={selectedItems}
            trackBy="number"
            resizableColumns={true}
            items={items}
            onSelectionChange={({ detail: { selectedItems } }) => setSelectedItems(selectedItems)}
            ariaLabels={ariaLabels}
            variant="borderless"
          />
        ) : (
          <Button
            onClick={() => {
              setIsActive(true);
              console.time('render');
              requestAnimationFrame(() => console.timeEnd('render'));
            }}
          >
            Render Table
          </Button>
        )}
      </SpaceBetween>
    </Box>
  );
}
