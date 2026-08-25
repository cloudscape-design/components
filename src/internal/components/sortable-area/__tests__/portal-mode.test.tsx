// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import SortableArea, { SortableAreaProps } from '../../../../../lib/components/internal/components/sortable-area';
import useDragAndDropReorder from '../../../../../lib/components/internal/components/sortable-area/use-drag-and-drop-reorder';

import styles from '../../../../../lib/components/internal/components/sortable-area/styles.css.js';

jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DragOverlay: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

jest.mock('@dnd-kit/sortable', () => ({
  ...jest.requireActual('@dnd-kit/sortable'),
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSortable: () => ({
    isDragging: false,
    isSorting: false,
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    attributes: {
      'aria-describedby': 'drag-handle',
      'aria-disabled': false,
    },
  }),
}));

jest.mock('../../../../../lib/components/internal/components/sortable-area/use-drag-and-drop-reorder');

interface Item {
  id: string;
  label: string;
}

const items: readonly Item[] = [
  { id: '1', label: 'First' },
  { id: '2', label: 'Second' },
];
const itemDefinition: SortableAreaProps.ItemDefinition<Item> = { id: item => item.id, label: item => item.label };
const mockedUseDragAndDropReorder = useDragAndDropReorder as jest.MockedFunction<typeof useDragAndDropReorder>;

beforeEach(() => {
  mockedUseDragAndDropReorder.mockReturnValue({
    activeItemId: '1',
    setActiveItemId: jest.fn(),
    collisionDetection: jest.fn(),
    coordinateGetter: jest.fn(),
    handleKeyDown: jest.fn(),
    sensors: [],
    isKeyboard: { current: false },
  });
});

test('propagates one-theme class to the drag overlay when one theme is active', () => {
  const themeRoot = document.createElement('div');
  themeRoot.className = 'awsui-one-theme';
  document.body.appendChild(themeRoot);

  try {
    render(
      <SortableArea
        items={items}
        itemDefinition={itemDefinition}
        onItemsChange={() => {}}
        renderItem={({ item, className, ref }) => (
          <div ref={ref} className={className}>
            {item.label}
          </div>
        )}
        i18nStrings={{}}
      />
    );

    expect(document.querySelector(`.${styles['drag-overlay']}`)).toHaveClass('awsui-one-theme');
  } finally {
    themeRoot.remove();
  }
});

test('does not stamp one-theme class on the drag overlay when one theme is inactive', () => {
  render(
    <SortableArea
      items={items}
      itemDefinition={itemDefinition}
      onItemsChange={() => {}}
      renderItem={({ item, className, ref }) => (
        <div ref={ref} className={className}>
          {item.label}
        </div>
      )}
      i18nStrings={{}}
    />
  );

  expect(document.querySelector(`.${styles['drag-overlay']}`)).not.toHaveClass('awsui-one-theme');
});
