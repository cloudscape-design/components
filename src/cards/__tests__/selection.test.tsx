// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Cards, { CardsProps } from '../../../lib/components/cards';
import { CardsWrapper } from '../../../lib/components/test-utils/dom';
import range from 'lodash/range';

interface Item {
  description: string;
}

const cardDefinition: CardsProps.CardDefinition<Item> = {
  header: item => item.description,
};

const defaultItems: Item[] = range(5).map(index => ({
  description: '' + index,
}));

function renderCards(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId } = render(jsx);
  const wrapper = new CardsWrapper(container.querySelector<HTMLElement>(`.${CardsWrapper.rootSelector}`)!);
  return { wrapper, rerender, getByTestId, queryByTestId };
}

describe('Cards selection', () => {
  let wrapper: CardsWrapper;
  const handleSelectionChange = jest.fn();
  const props: CardsProps<Item> = {
    items: defaultItems,
    cardDefinition,
    onSelectionChange: handleSelectionChange,
  };
  const expectSelected = (arr: Item[]) => {
    const { selectedItems } = handleSelectionChange.mock.calls[0][0].detail;
    expect(selectedItems).toHaveLength(arr.length);
    expect(selectedItems).toEqual(expect.arrayContaining(arr));
  };

  // index is 0-based
  const getCard = (index: number) => wrapper.findItems()[index];
  const getCardSelectionArea = (cardIndex: number) => getCard(cardIndex).findSelectionArea();

  const getSelectedCardsText = () =>
    wrapper.findSelectedItems().map(cardWrapper => cardWrapper.findCardHeader()?.getElement()?.textContent);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe.each<CardsProps.SelectionType>(['single', 'multi'])('Common selection features "%s"', selectionType => {
    it('should select card upon click on the input', () => {
      wrapper = renderCards(<Cards<Item> {...props} selectionType={selectionType} />).wrapper;
      getCardSelectionArea(1)?.click();
      expectSelected([{ description: '1' }]);
    });

    it('should display items as selected even when you pass non-existing items along in the selectedItems array', () => {
      wrapper = renderCards(
        <Cards<Item>
          {...props}
          selectionType={selectionType}
          selectedItems={[defaultItems[0], { description: 'non-existing' }]}
        />
      ).wrapper;
      expect(getSelectedCardsText()).toEqual(['0']);
    });

    it('cannot select items by clicking anywhere on the card by default', () => {
      wrapper = renderCards(<Cards<Item> {...props} selectionType={selectionType} />).wrapper;
      getCard(1).findCardHeader()?.click();
      expect(handleSelectionChange).not.toHaveBeenCalled();
    });

    it('can select items by clicking anywhere on the card when entireCardClickable is enabled', () => {
      wrapper = renderCards(
        <Cards<Item> {...props} selectionType={selectionType} entireCardClickable={true} />
      ).wrapper;
      getCard(1).findCardHeader()?.click();
      expectSelected([{ description: '1' }]);
    });
  });

  describe('Single selection', () => {
    it('should display radios', () => {
      wrapper = renderCards(<Cards<Item> {...props} selectionType={'single'} />).wrapper;
      expect(getCard(0)?.findSelectionArea()?.find('input[type="radio"]')).toBeTruthy();
    });

    it('should deselect previous card on selection', () => {
      wrapper = renderCards(
        <Cards<Item> {...props} selectionType={'single'} selectedItems={[defaultItems[1]]} />
      ).wrapper;
      expect(getCardSelectionArea(1)!.find('input')!.getElement()).toBeChecked();
      expect(getSelectedCardsText()).toEqual(['1']);

      getCardSelectionArea(4)?.click();
      expectSelected([{ description: '4' }]);
    });

    it('should not deselect previously selected card when clicking again the same card', () => {
      wrapper = renderCards(
        <Cards<Item> {...props} selectionType={'single'} selectedItems={[defaultItems[2]]} />
      ).wrapper;
      expect(getSelectedCardsText()).toEqual(['2']);

      getCardSelectionArea(2)?.click();
      expect(handleSelectionChange).not.toHaveBeenCalled();
    });

    describe('radios are grouped on a component basis', function () {
      it('should use the same name for all radios inside a table', function () {
        wrapper = renderCards(<Cards<Item> {...props} selectionType={'single'} />).wrapper;
        const radioNames = wrapper.findAll('input').map(elWrapper => elWrapper?.getElement().getAttribute('name'));
        const firstName = radioNames[0];
        expect(radioNames.every(name => name === firstName)).toBeTruthy();
      });

      it('should use different name for the second cards', function () {
        wrapper = renderCards(<Cards<Item> {...props} selectionType={'single'} />).wrapper;
        const wrapper2: CardsWrapper = renderCards(<Cards<Item> {...props} selectionType={'single'} />).wrapper;
        const firstCardsName = wrapper.find('input')?.getElement().getAttribute('name');
        const secondCardsName = wrapper2.find('input')?.getElement().getAttribute('name');

        expect(firstCardsName).not.toEqual(secondCardsName);
      });
    });
  });
  describe('Matches `selectedItems` to `items` using `trackBy` property', () => {
    interface NestedItem {
      rootProp: string;
      nestedProp: {
        secondLevel: string;
      };
    }
    const nestedItems = [
      {
        rootProp: 'root 1',
        nestedProp: {
          secondLevel: 'nested 1',
        },
      },
      {
        rootProp: 'root 2',
        nestedProp: {
          secondLevel: 'nested 2',
        },
      },
    ];
    const nestedDefinitions: CardsProps.CardDefinition<NestedItem> = {
      header: item => item.rootProp,
    };
    it.each<[string, CardsProps.TrackBy<NestedItem>, string]>([
      ['with a root property name', 'rootProp', 'root 2'],
      ['with a function', (item: NestedItem) => item.nestedProp.secondLevel, 'root 1'],
    ])('%s', (_, trackBy, expected) => {
      wrapper = renderCards(
        <Cards<NestedItem>
          selectionType={'multi'}
          items={nestedItems}
          cardDefinition={nestedDefinitions}
          selectedItems={[
            {
              rootProp: 'root 2',
              nestedProp: {
                secondLevel: 'nested 1',
              },
            },
          ]}
          trackBy={trackBy}
        />
      ).wrapper;
      expect(getSelectedCardsText()).toEqual([expected]);
    });
  });
});
