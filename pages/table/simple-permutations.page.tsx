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
import { ARIA_LABELS } from './shared-configs';
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
  },
  {
    columnDefinitions: [SIMPLE_COLUMNS],
    header: [null, <Box>header</Box>],
    footer: [null, <Box>footer</Box>],
    items: [createSimpleItems(3)],
    variant: ['embedded', 'stacked', 'full-page', 'borderless'],
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
      <h1>Simple table permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => <Table {...permutation} ariaLabels={ARIA_LABELS} />}
        />
      </ScreenshotArea>
    </>
  );
}
