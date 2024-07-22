// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import clone from 'lodash/clone';

import Cards, { CardsProps } from '../../../lib/components/cards';
import createWrapper, { CardsWrapper } from '../../../lib/components/test-utils/dom';

interface Item {
  id: number;
  name: string;
}

const cardDefinition: CardsProps.CardDefinition<Item> = {
  header: item => `Header ${item.name}`,
  sections: [
    {
      id: 'description',
      header: 'Number',
      content: item => item.id,
    },
    {
      id: 'type',
      header: 'Text',
      content: item => item.name,
    },
  ],
};

const items: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
  { id: 4, name: 'Cherries' },
  { id: 5, name: 'Mangoes' },
  { id: 6, name: 'Pineapple' },
  { id: 7, name: 'Strawberries' },
  { id: 8, name: 'Tomatoes' },
  { id: 9, name: 'Blueberries' },
];

function renderCards(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = new CardsWrapper(container.querySelector<HTMLElement>(`.${CardsWrapper.rootSelector}`)!);
  return { wrapper, rerender, container };
}

const getSelectionInput = (wrapper: any, cardIndex: number) =>
  wrapper.findItems()[cardIndex].findSelectionArea()?.find('input');

function shiftClickItem(wrapper: any, index: number) {
  const input = getSelectionInput(wrapper, index);
  input!.fireEvent(new MouseEvent('mousedown', { shiftKey: true, bubbles: true }));
  input!.fireEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));
  input!.fireEvent(new MouseEvent('mouseup', { shiftKey: false, bubbles: true }));
}

describe('Shift selection', () => {
  let wrapper: CardsWrapper;
  const handleSelectionChange = jest.fn();
  const props: CardsProps<Item> = {
    selectionType: 'multi',
    items,
    cardDefinition,
    onSelectionChange: handleSelectionChange,
    trackBy: 'id',
  };
  const expectSelected = (index: number, arr: Item[]) => {
    const { selectedItems } = handleSelectionChange.mock.calls[index][0].detail;
    expect(selectedItems).toHaveLength(arr.length);
    expect(selectedItems).toEqual(expect.arrayContaining(arr));
  };

  beforeEach(() => {
    handleSelectionChange.mockReset();
  });

  it('should select six items', () => {
    wrapper = renderCards(<Cards<Item> {...props} selectedItems={[]} />).wrapper;
    handleSelectionChange.mockReset();
    getSelectionInput(wrapper, 2)!.click();
    shiftClickItem(wrapper, 7);
    expect(handleSelectionChange).toHaveBeenCalledTimes(2);
    expectSelected(0, [items[2]]);
    expectSelected(1, [items[2], items[3], items[4], items[5], items[6], items[7]]);
  });

  it('should deselect previously selected items', () => {
    wrapper = renderCards(<Cards<Item> {...props} selectedItems={[...items]} />).wrapper;
    getSelectionInput(wrapper, 2)!.click();
    shiftClickItem(wrapper, 6);
    expect(handleSelectionChange).toHaveBeenCalledTimes(2);
    expectSelected(
      0,
      items.filter(item => item.id !== 3)
    );
    expectSelected(1, [items[0], items[1], items[7], items[8]]);
  });

  it('should not select a disabled item', () => {
    wrapper = renderCards(
      <Cards<Item> {...props} selectedItems={[]} isItemDisabled={item => item === items[4]} />
    ).wrapper;
    getSelectionInput(wrapper, 1)!.click();
    shiftClickItem(wrapper, 5);
    expectSelected(1, [items[1], items[2], items[3], items[5]]);
  });
  it('should keep middle items selected', () => {
    wrapper = renderCards(<Cards<Item> {...props} selectedItems={[items[2], items[3]]} />).wrapper;
    getSelectionInput(wrapper, 0)!.click();
    shiftClickItem(wrapper, 5);
    expectSelected(1, [items[2], items[3], items[0], items[1], items[4], items[5]]);
  });
  it('should deselect partially selected', () => {
    wrapper = renderCards(<Cards<Item> {...props} selectedItems={[items[2], items[4]]} />).wrapper;
    getSelectionInput(wrapper, 0)!.click();
    shiftClickItem(wrapper, 4);
    expectSelected(1, []);
  });

  it('should respect trackBy property for bulk selection', () => {
    const selectionChangeWithDetails = {
      onSelectionChange: handleSelectionChange,
    };

    const { container, rerender } = renderCards(<Cards<Item> {...props} {...selectionChangeWithDetails} />);
    const wrapper = createWrapper(container).findCards()!;
    getSelectionInput(wrapper, 1)!.click();
    rerender(<Cards<Item> {...props} {...selectionChangeWithDetails} items={clone(items)} />);
    shiftClickItem(wrapper, 3);
    expectSelected(1, [items[1], items[2], items[3]]);
  });
});
