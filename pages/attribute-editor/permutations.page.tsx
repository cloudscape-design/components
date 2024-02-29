// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import AttributeEditor, { AttributeEditorProps } from '~components/attribute-editor';
import Box from '~components/box';
import Input from '~components/input';
import StatusIndicator from '~components/status-indicator';

interface Item {
  key: string;
  value: string;
}

const definition4 = [
  {
    label: 'Key label',
    control: (item: Item) => <Input value={item.key} placeholder="Enter key" onChange={() => {}} />,
  },
  {
    label: 'Value label',
    control: (item: Item) => <Input value={item.value} placeholder="Enter value" onChange={() => {}} />,
  },
  {
    label: 'Value label 2',
    control: (item: Item) => <Input value={item.value} placeholder="Enter value" onChange={() => {}} />,
  },
  {
    label: 'Value label 3',
    control: (item: Item) => <Input value={item.value} placeholder="Enter value" onChange={() => {}} />,
  },
];
const definition2 = definition4.slice(0, 2);
const definition3 = definition4.slice(0, 3);

const validationDefinitions = [
  {
    label: 'Key label',
    control: (item: Item) => <Input value={item.key} placeholder="Enter key" onChange={() => {}} />,
    warningText: (item: Item) => (item.key.includes(' ') ? 'Key contains empty characters' : null),
    errorText: (item: Item) => (item.key.length < 10 ? 'Key should be longer than 10 characters' : null),
  },
  {
    label: 'Value label 4',
    control: (item: Item) => <Input value={item.value} placeholder="Enter value" onChange={() => {}} />,
    warningText: (item: Item) => (item.value.includes(' ') ? 'Value contains empty characters' : null),
    errorText: (item: Item) => (item.value.length < 10 ? 'Value should be longer than 10 characters' : null),
  },
];

const defaultItems: Item[] = [
  {
    key: '',
    value: '',
  },
  {
    key: 'attr1',
    value: 'The first value',
  },
  {
    key: 'attr2 ',
    value: 'The second value',
  },
  {
    key: 'Quite a long key name that might be longer than the input',
    value: 'An even longer attribute value that should overflow text boxes',
  },
];

export const permutations = createPermutations<AttributeEditorProps<Item>>([
  {
    definition: [definition2],
    items: [[]],
    empty: ['No items'],
    addButtonText: ['Add item'],
    removeButtonText: ['Remove item'],
  },
  {
    definition: [definition2],
    items: [defaultItems],
    addButtonText: ['Add item'],
    isItemRemovable: [() => true, item => item.key !== 'attr1'],
    removeButtonText: ['Remove item'],
  },
  {
    definition: [definition2],
    items: [defaultItems],
    addButtonText: ['Longer add item text with more characters than the others so that it might wrap'],
    removeButtonText: ['Longer delete item text so that it wraps'],
    isItemRemovable: [() => true, item => item.key !== 'attr1'],
  },
  {
    definition: [definition2],
    items: [defaultItems],
    addButtonText: ['Add item'],
    removeButtonText: ['Remove item'],
    disableAddButton: [false, true],
  },
  {
    definition: [definition2],
    items: [defaultItems],
    addButtonText: ['Add item'],
    removeButtonText: ['Remove item'],
    additionalInfo: [
      'You have reached your maximum',
      <StatusIndicator key={0} type="error">
        You have reached your maximum
      </StatusIndicator>,
    ],
  },
  {
    definition: [definition3, definition4],
    items: [defaultItems],
    addButtonText: ['Add item'],
    removeButtonText: ['Remove item'],
  },
  {
    definition: [validationDefinitions],
    items: [defaultItems],
    addButtonText: ['Add item'],
    removeButtonText: ['Remove item'],
  },
]);

export default function AttributeEditorPermutations() {
  return (
    <Box padding="l">
      <h1>Attribute Editor permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <AttributeEditor {...permutation} />} />
      </ScreenshotArea>
    </Box>
  );
}
