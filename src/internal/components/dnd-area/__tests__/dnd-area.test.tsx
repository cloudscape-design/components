// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { DndArea } from '../../../../../lib/components/internal/components/dnd-area';

test('renders all items with correct attributes', () => {
  const items = [
    { id: '1', label: 'First', data: {} },
    { id: '2', label: 'Second', data: {} },
  ];
  const renderItem = jest.fn();
  render(
    <DndArea
      items={items}
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
        isDragging: false,
        isActive: false,
        isSorting: false,
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
  const items = [
    { id: '1', label: 'First', data: {} },
    { id: '2', label: 'Second', data: {} },
  ];
  const renderItem = jest.fn();
  render(
    <DndArea items={items} onItemsChange={() => {}} renderItem={renderItem} disableReorder={true} i18nStrings={{}} />
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
