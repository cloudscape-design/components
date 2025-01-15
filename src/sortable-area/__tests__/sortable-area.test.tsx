// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import SortableArea, { SortableAreaProps } from '../../../lib/components/sortable-area';

interface Item {
  id: string;
  label: string;
}

const items: readonly Item[] = [
  { id: '1', label: 'First' },
  { id: '2', label: 'Second' },
];
const itemDefinition: SortableAreaProps.ItemDefinition<Item> = { id: item => item.id, label: item => item.label };

test('renders all items with correct attributes', () => {
  const renderItem = jest.fn();
  render(
    <SortableArea
      items={items}
      itemDefinition={itemDefinition}
      onItemsChange={() => {}}
      renderItem={renderItem}
      i18nStrings={{
        dragHandleAriaLabel: 'Drag handle',
        dragHandleAriaDescription: 'Use drag handle as follows...',
      }}
    />
  );
  expect(renderItem).toHaveBeenCalledTimes(2);
  for (let i = 0; i < items.length; i++) {
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: items[i],
        isDropPlaceholder: false,
        isDragGhost: false,
        isSortingActive: false,
        dragHandleProps: {
          ariaLabel: `Drag handle ${items[i].label}`,
          ariaDescribedby: expect.any(String),
          disabled: false,
          onPointerDown: expect.anything(),
          onKeyDown: expect.anything(),
        },
      })
    );
  }
});

test('adds disabled to every item drag handle when reordering is disabled', () => {
  const renderItem = jest.fn();
  render(
    <SortableArea
      items={items}
      itemDefinition={itemDefinition}
      onItemsChange={() => {}}
      renderItem={renderItem}
      disableReorder={true}
      i18nStrings={{}}
    />
  );
  for (let i = 0; i < items.length; i++) {
    expect(renderItem).toHaveBeenCalledWith(
      expect.objectContaining({
        item: items[i],
        dragHandleProps: expect.objectContaining({ disabled: true }),
      })
    );
  }
});
