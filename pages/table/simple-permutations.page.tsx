// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import range from 'lodash/range';
import Box from '~components/box';
import Button from '~components/button';
import Header from '~components/header';
import Link from '~components/link';
import Table, { TableProps } from '~components/table';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

function createSimpleItems(count: number) {
  const texts = ['One', 'Two', 'Three', 'Four'];
  return range(count).map(number => ({ number, text: texts[number % texts.length] }));
}
const SELECTED_ITEMS: TableProps['selectedItems'] = [{ text: 'One' }, { text: 'Two' }, { text: 'Three' }];

const SIMPLE_COLUMNS: TableProps.ColumnDefinition<any>[] = [
  {
    id: 'text',
    cell: item => <Link>{item.text}</Link>,
    header: 'Text',
  },
  {
    id: 'number',
    cell: item => item.number,
    header: 'Number',
  },
];

const ARIA_LABELS: TableProps['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.text} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
};

/* eslint-disable react/jsx-key */
const permutations = createPermutations<TableProps>([
  {
    columnDefinitions: [SIMPLE_COLUMNS],
    loading: [true],
    loadingText: ['Loading items'],
    items: [[]],
  },
  {
    columnDefinitions: [SIMPLE_COLUMNS],
    empty: [
      'No data',
      <Box textAlign="center" color="inherit">
        <Box variant="strong" textAlign="center" color="inherit">
          No resources
        </Box>
        <Box variant="p" padding={{ bottom: 's' }} color="inherit">
          No resources to display.
        </Box>
        <Button>Create resource</Button>
      </Box>,
    ],
    items: [[]],
  },
  {
    columnDefinitions: [SIMPLE_COLUMNS],
    footer: [null, 'footer'],
    empty: [null, 'empty'],
    items: [[], createSimpleItems(3)],
  },
  {
    columnDefinitions: [SIMPLE_COLUMNS],
    header: [null, <Header variant="h2">Table header</Header>],
    pagination: [null, 'pagination'],
    filter: [null, 'filtering', 'property filtering'],
    preferences: [null, 'preferences'],
    items: [createSimpleItems(3)],
  },
  {
    columnDefinitions: [SIMPLE_COLUMNS],
    items: [createSimpleItems(3)],
    selectionType: ['single', 'multi'],
    selectedItems: [SELECTED_ITEMS, SELECTED_ITEMS.slice(0, 2)],
    trackBy: ['text'],
    isItemDisabled: [undefined, () => true],
    ariaLabels: [ARIA_LABELS],
  },
  {
    columnDefinitions: [SIMPLE_COLUMNS],
    header: [null, <Box>header</Box>],
    footer: [null, <Box>footer</Box>],
    items: [createSimpleItems(3)],
    variant: ['embedded', 'stacked', 'full-page'],
  },
  {
    columnDefinitions: [SIMPLE_COLUMNS],
    stripedRows: [true],
    items: [createSimpleItems(3)],
  },
]);
/* eslint-enable react/jsx-key */

export default function () {
  return (
    <>
      <h1>Table permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <Table {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
