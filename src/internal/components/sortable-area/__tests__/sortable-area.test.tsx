// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import InternalDragHandle from '../../../../../lib/components/internal/components/drag-handle';
import SortableArea, { SortableAreaProps } from '../../../../../lib/components/internal/components/sortable-area';
import InternalDragHandleWrapper from '../../../../../lib/components/test-utils/dom/internal/drag-handle';

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
          active: false,
          ariaLabel: `Drag handle ${items[i].label}`,
          ariaDescribedby: expect.any(String),
          disabled: false,
          onPointerDown: expect.anything(),
          onKeyDown: expect.anything(),
          onDirectionClick: expect.anything(),
          onClick: expect.anything(),
          triggerMode: 'controlled',
          controlledShowButtons: false,
          ref: expect.anything(),
          directions: undefined,
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

describe('SortableArea - horizontal orientation', () => {
  const horizontalItems: readonly Item[] = [
    { id: '1', label: 'First' },
    { id: '2', label: 'Second' },
    { id: '3', label: 'Third' },
  ];

  function ControlledArea({
    onItemsChange,
    direction,
  }: {
    onItemsChange?: (detail: SortableAreaProps.ItemsChangeDetail<Item>) => void;
    direction?: SortableAreaProps.Direction;
  }) {
    const [current, setCurrent] = useState<readonly Item[]>(horizontalItems);
    return (
      <SortableArea
        items={current}
        direction={direction}
        itemDefinition={itemDefinition}
        i18nStrings={{ dragHandleAriaLabel: 'Drag handle' }}
        onItemsChange={({ detail }) => {
          setCurrent(detail.items);
          onItemsChange?.(detail);
        }}
        renderItem={({
          ref,
          item,
          id,
          style,
          className,
          dragHandleProps,
          isDragGhost,
        }: SortableAreaProps.RenderItemProps<Item>) => {
          const content = (
            <>
              <InternalDragHandle {...dragHandleProps} />
              <span>{item.label}</span>
            </>
          );
          if (isDragGhost) {
            return <div className={className}>{content}</div>;
          }
          return (
            <div ref={ref} className={className} style={style} data-testid={id}>
              {content}
            </div>
          );
        }}
      />
    );
  }

  function getDragHandle(itemLabel: string): HTMLElement {
    const el = document.querySelector<HTMLElement>(`[aria-label="Drag handle ${itemLabel}"]`);
    if (!el) {
      throw new Error(`Could not find drag handle for item "${itemLabel}"`);
    }
    return el;
  }

  function pressKey(element: HTMLElement, key: string) {
    fireEvent.keyDown(element, { key, code: key });
  }

  const tick = () => new Promise(resolve => setTimeout(resolve, 0));

  test('reorders items when pressing ArrowRight (LTR moves item toward the end)', async () => {
    const onItemsChange = jest.fn();
    render(<ControlledArea direction="horizontal" onItemsChange={onItemsChange} />);
    const handle = getDragHandle('First');

    pressKey(handle, 'Space');
    await tick(); // let the sensor attach its keydown listener
    pressKey(handle, 'ArrowRight');
    pressKey(handle, 'Space');

    expect(onItemsChange).toHaveBeenCalledTimes(1);
    const detail = onItemsChange.mock.calls[0][0];
    expect(detail.items.map((i: Item) => i.id)).toEqual(['2', '1', '3']);
    expect(detail.movedItem.id).toBe('1');
    // DOM order reflects the reorder (item id "1" is now the second child)
    const rendered = Array.from(document.querySelectorAll<HTMLElement>('[data-testid]')).map(el => el.dataset.testid);
    expect(rendered).toEqual(['2', '1', '3']);
  });

  test('reorders items when pressing ArrowLeft (LTR moves item toward the start)', async () => {
    const onItemsChange = jest.fn();
    render(<ControlledArea direction="horizontal" onItemsChange={onItemsChange} />);
    const handle = getDragHandle('Second');

    pressKey(handle, 'Space');
    await tick();
    pressKey(handle, 'ArrowLeft');
    pressKey(handle, 'Space');

    expect(onItemsChange).toHaveBeenCalledTimes(1);
    const detail = onItemsChange.mock.calls[0][0];
    expect(detail.items.map((i: Item) => i.id)).toEqual(['2', '1', '3']);
    expect(detail.movedItem.id).toBe('2');
  });

  test('does NOT reorder when pressing ArrowDown or ArrowUp in horizontal mode', async () => {
    const onItemsChange = jest.fn();
    render(<ControlledArea direction="horizontal" onItemsChange={onItemsChange} />);
    const handle = getDragHandle('First');

    pressKey(handle, 'Space');
    await tick();
    pressKey(handle, 'ArrowDown');
    pressKey(handle, 'ArrowUp');
    pressKey(handle, 'Space');

    expect(onItemsChange).not.toHaveBeenCalled();
  });

  test('shows logical inline-start / inline-end UAP direction buttons in horizontal mode', async () => {
    render(<ControlledArea direction="horizontal" />);
    const handle = getDragHandle('First');
    const dragWrapper = new InternalDragHandleWrapper(document.body);

    expect(dragWrapper.findVisibleDirectionButtonInlineEnd()).toBeFalsy();
    expect(dragWrapper.findVisibleDirectionButtonBlockEnd()).toBeFalsy();

    handle.click();
    await tick();

    expect(dragWrapper.findVisibleDirectionButtonInlineStart()).toBeTruthy();
    expect(dragWrapper.findVisibleDirectionButtonInlineEnd()).toBeTruthy();
    // Block (vertical) direction buttons must NOT appear when horizontal
    expect(dragWrapper.findVisibleDirectionButtonBlockStart()).toBeFalsy();
    expect(dragWrapper.findVisibleDirectionButtonBlockEnd()).toBeFalsy();
  });

  test('reorders via UAP inline-end button click (mirrors the vertical block-end pattern)', async () => {
    const onItemsChange = jest.fn();
    render(<ControlledArea direction="horizontal" onItemsChange={onItemsChange} />);
    const handle = getDragHandle('First');
    const dragWrapper = new InternalDragHandleWrapper(document.body);

    handle.click();
    await tick();
    dragWrapper.findVisibleDirectionButtonInlineEnd()!.click();
    pressKey(handle, 'Enter');

    expect(onItemsChange).toHaveBeenCalledTimes(1);
    const detail = onItemsChange.mock.calls[0][0];
    expect(detail.items.map((i: Item) => i.id)).toEqual(['2', '1', '3']);
    expect(detail.movedItem.id).toBe('1');
  });

  test('default direction (undefined) stays vertical: block-end button, ArrowDown reorders', async () => {
    // Regression guard: omitting `direction` must behave exactly like the pre-change vertical mode.
    const onItemsChange = jest.fn();
    render(<ControlledArea onItemsChange={onItemsChange} />);
    const handle = getDragHandle('First');
    const dragWrapper = new InternalDragHandleWrapper(document.body);

    handle.click();
    await tick();
    expect(dragWrapper.findVisibleDirectionButtonBlockEnd()).toBeTruthy();
    expect(dragWrapper.findVisibleDirectionButtonInlineEnd()).toBeFalsy();

    pressKey(handle, 'ArrowDown');
    pressKey(handle, 'Enter');

    expect(onItemsChange).toHaveBeenCalledTimes(1);
    const detail = onItemsChange.mock.calls[0][0];
    expect(detail.items.map((i: Item) => i.id)).toEqual(['2', '1', '3']);
  });
});
