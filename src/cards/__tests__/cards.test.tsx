// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Cards, { CardsProps } from '../../../lib/components/cards';
import Header from '../../../lib/components/header';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import { CardsWrapper, PaginationWrapper } from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/cards/styles.css.js';
import liveRegionStyles from '../../../lib/components/live-region/test-classes/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  useMobile: jest.fn(),
}));

interface Item {
  id: number;
  name: string;
}

function findFooterPagination(wrapper: CardsWrapper): PaginationWrapper | null {
  return wrapper.findComponent(`.${styles['footer-pagination']}`, PaginationWrapper);
}

const cardDefinition: CardsProps.CardDefinition<Item> = {
  header: item => `Header ${item.name}`,
  testId: item => `card-${item.id}`,
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

const defaultItems: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
];

function renderCards(jsx: React.ReactElement) {
  const { container, rerender, getByTestId, queryByTestId } = render(jsx);
  const wrapper = new CardsWrapper(container.querySelector<HTMLElement>(`.${CardsWrapper.rootSelector}`)!);
  return { wrapper, rerender, getByTestId, queryByTestId };
}

describe('Cards', () => {
  let wrapper: CardsWrapper;

  // index is 0-based
  const getCard = (index: number) => wrapper.findItems()[index];

  const getCardByTestId = (testId: string) => wrapper.findItemByTestId(testId)!;

  const getCardHeader = (index: number) => wrapper.findItems()[index]?.findCardHeader()?.getElement();

  // index is 0-based
  const getCardsSections = (index: number) => wrapper.findItems()[index].findSections();

  // cardIndex and sectionIndex are 0-based
  const getCardSection = (cardIndex: number, sectionIndex: number) => getCardsSections(cardIndex)[sectionIndex];

  const getCardSectionByTestId = (cardIndex: number, sectionTestId: string) =>
    getCard(cardIndex)!.findSectionByTestId(sectionTestId)!;

  const getCardSectionHeader = (cardIndex: number, sectionIndex: number) =>
    getCardSection(cardIndex, sectionIndex)?.findSectionHeader()?.getElement();

  const getCardSectionContent = (cardIndex: number, sectionIndex: number) =>
    getCardSection(cardIndex, sectionIndex)?.findContent()?.getElement();

  const getEmptyRegion = () => wrapper?.findEmptySlot();

  describe('items property', () => {
    it('renders as many cards as many defined', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={cardDefinition} items={defaultItems} />).wrapper;
      expect(wrapper.findItems()).toHaveLength(defaultItems.length);
    });

    it('uses correct role for cards list based on selectionType', () => {
      wrapper = renderCards(
        <Cards<Item> cardDefinition={cardDefinition} items={defaultItems} selectionType="single" />
      ).wrapper;
      const cardsOrderedList = getCardByTestId('card-1').getElement().parentElement;
      expect(cardsOrderedList).toHaveAttribute('role', 'group');
    });

    it('correctly renders card header', () => {
      defaultItems.forEach((item, idx) => {
        wrapper = renderCards(<Cards<Item> cardDefinition={cardDefinition} items={defaultItems} />).wrapper;
        expect(getCardHeader(idx)).toHaveTextContent(`Header ${item.name}`);
      });
    });

    it('correctly renders card sections', () => {
      defaultItems.forEach((item, idx) => {
        wrapper = renderCards(<Cards<Item> cardDefinition={cardDefinition} items={defaultItems} />).wrapper;
        expect(getCardsSections(idx)).toHaveLength(2);

        expect(getCardSectionHeader(idx, 0)).toHaveTextContent('Number');
        expect(getCardSectionContent(idx, 0)).toHaveTextContent('' + item.id);

        expect(getCardSectionHeader(idx, 1)).toHaveTextContent('Text');
        expect(getCardSectionContent(idx, 1)).toHaveTextContent(item.name);
      });
    });

    it('correctly renders card header when header is not provided', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={defaultItems} />).wrapper;
      defaultItems.forEach((_, idx) => {
        expect(getCardHeader(idx)).toBeEmptyDOMElement();
      });
    });

    it('does not render cards sections when not defined', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={defaultItems} />).wrapper;
      defaultItems.forEach((_, idx) => {
        expect(getCardsSections(idx)).toHaveLength(0);
      });
    });

    test('only renders sections with id in visibleSections', () => {
      wrapper = renderCards(
        <Cards<Item> cardDefinition={cardDefinition} items={defaultItems} visibleSections={['type']} />
      ).wrapper;
      defaultItems.forEach((item, idx) => {
        expect(getCardsSections(idx)).toHaveLength(1);
        expect(getCardSectionHeader(idx, 0)).toHaveTextContent('Text');
        expect(getCardSectionContent(idx, 0)).toHaveTextContent(item.name);
      });
    });

    it('does not render section header when not defined', () => {
      wrapper = renderCards(
        <Cards<Item>
          cardDefinition={{
            sections: [
              {
                content: item => item.name,
                testId: item => `card-${item.id}-content-section`,
              },
            ],
          }}
          items={defaultItems}
        />
      ).wrapper;
      defaultItems.forEach((item, idx) => {
        expect(getCardsSections(idx)).toHaveLength(1);

        const sectionTestId = `card-${idx + 1}-content-section`;
        expect(getCardSectionByTestId(idx, sectionTestId).findSectionHeader()).toBe(null);
        expect(getCardSectionContent(idx, 0)).toHaveTextContent(item.name);
      });
    });

    it('does not render section content when not defined', () => {
      wrapper = renderCards(
        <Cards<Item>
          cardDefinition={{
            sections: [
              {
                header: 'id',
              },
            ],
          }}
          items={defaultItems}
        />
      ).wrapper;
      defaultItems.forEach((item, idx) => {
        expect(getCardsSections(idx)).toHaveLength(1);

        expect(getCardSectionHeader(idx, 0)).toHaveTextContent('id');
        expect(getCardSection(idx, 0)?.findContent()).toBe(null);
      });
    });

    it('assigns test id attributes to the cards and sections', () => {
      const { wrapper } = renderCards(
        <Cards<Item>
          cardDefinition={{
            testId: item => `${item.name}-${item.id}`,
            sections: [
              {
                testId: item => `${item.name}-${item.id}-id-section`,
                header: 'id',
              },
              {
                testId: item => `${item.name}-${item.id}-name-section`,
                header: 'name',
              },
            ],
          }}
          items={defaultItems}
        />
      );

      const itemTestIds = wrapper.findItems().map(item => item.getElement()!.getAttribute('data-testid'));
      expect(itemTestIds).toEqual(['Apples-1', 'Oranges-2', 'Bananas-3']);

      const secondItemSectionTestIds = wrapper
        .findItems()[1]
        .findSections()
        .map(section => section.getElement()!.getAttribute('data-testid'));
      expect(secondItemSectionTestIds).toEqual(['Oranges-2-id-section', 'Oranges-2-name-section']);
    });
  });

  describe('header region', () => {
    it('is displayed', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={defaultItems} header="abcedefg" />).wrapper;
      expect(wrapper.findHeader()?.getElement()).toHaveTextContent('abcedefg');
    });

    it('maintains logical relationship between header and cards when header is a string', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={defaultItems} header="abcedefg" />).wrapper;
      const cardsOrderedList = getCard(0).getElement().parentElement;
      expect(cardsOrderedList).toHaveAccessibleName('abcedefg');
    });

    it('maintains logical relationship between header and cards when header is a component', () => {
      wrapper = renderCards(
        <Cards<Item> cardDefinition={{}} items={defaultItems} header={<Header>Cards header</Header>} />
      ).wrapper;
      const cardsOrderedList = getCard(0).getElement().parentElement;
      expect(cardsOrderedList).toHaveAccessibleName('Cards header');
    });

    it('allows label to be overridden', () => {
      wrapper = renderCards(
        <Cards<Item>
          cardDefinition={{}}
          items={defaultItems}
          header="abcedefg"
          ariaLabels={{ itemSelectionLabel: () => 'Item', selectionGroupLabel: 'Group', cardsLabel: 'Custom label' }}
        />
      ).wrapper;
      const cardsOrderedList = getCard(0).getElement().parentElement;
      expect(cardsOrderedList).toHaveAccessibleName('Custom label');
    });
  });

  describe('pagination region', () => {
    it('should render table with no pagination in the footer for default variant', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={defaultItems} pagination="pagination" />).wrapper;
      expect(wrapper.findPagination()?.getElement()).toHaveTextContent('pagination');
      expect(findFooterPagination(wrapper)).toBeNull();
    });

    it('is not displayed in the footer on full-page variant on desktop', () => {
      (useMobile as jest.Mock).mockReturnValue(false);
      wrapper = renderCards(
        <Cards<Item> variant="full-page" cardDefinition={{}} items={defaultItems} pagination="pagination" />
      ).wrapper;
      expect(wrapper.findPagination()?.getElement()).toHaveTextContent('pagination');
      expect(findFooterPagination(wrapper)).toBeNull();
      jest.resetAllMocks();
    });

    it('is displayed in the footer on full-page variant on mobile', () => {
      (useMobile as jest.Mock).mockReturnValue(true);
      wrapper = renderCards(
        <Cards<Item> variant="full-page" cardDefinition={{}} items={defaultItems} pagination="pagination" />
      ).wrapper;
      expect(wrapper.findPagination()?.getElement()).toHaveTextContent('pagination');
      expect(findFooterPagination(wrapper)?.getElement()).toHaveTextContent('pagination');
      jest.resetAllMocks();
    });
  });

  describe('empty region', () => {
    it('is displayed when no items', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={[]} empty="whatever" />).wrapper;
      expect(getEmptyRegion()?.getElement()).toHaveTextContent('whatever');
    });
    it('not displayed if there are items', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={defaultItems} empty="whatever" />).wrapper;
      expect(getEmptyRegion()).toBeNull();
    });
  });

  describe('loading property enabled', () => {
    it('renders a spinner with loadingText', () => {
      wrapper = renderCards(
        <Cards<Item> cardDefinition={{}} items={[]} loading={true} loadingText="Resources loading" />
      ).wrapper;
      expect(wrapper?.findLoadingText()?.getElement()).toHaveTextContent('Resources loading');
    });

    it('does not render cards', () => {
      wrapper = renderCards(
        <Cards<Item>
          cardDefinition={cardDefinition}
          items={defaultItems}
          loading={true}
          loadingText="Resources loading"
        />
      ).wrapper;
      expect(wrapper.findItems()).toHaveLength(0);
      expect(wrapper?.findLoadingText()?.getElement()).toHaveTextContent('Resources loading');
    });
  });
  describe('live region', () => {
    test.each([
      { firstIndex: 1, totalItemsCount: defaultItems.length },
      { firstIndex: undefined, totalItemsCount: undefined },
    ])(
      'Should render a live region when firstIndex="$firstIndex" and totalItemsCount="$totalItemsCount"',
      ({ firstIndex, totalItemsCount }) => {
        const expectedFirstIndex = firstIndex ?? 1;
        const lastIndex = expectedFirstIndex + defaultItems.length - 1;

        const wrapper = renderCards(
          <Cards<Item>
            cardDefinition={cardDefinition}
            items={defaultItems}
            firstIndex={firstIndex}
            totalItemsCount={totalItemsCount}
            renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
              `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`
            }
          />
        ).wrapper;

        expect(wrapper.find(`.${liveRegionStyles.root}`)?.getElement().textContent).toBe(
          `Displaying items from ${expectedFirstIndex} to ${lastIndex} of ${totalItemsCount} items`
        );
      }
    );
  });

  describe('i18n', () => {
    test('supports using selectionGroupLabel from i18n provider', () => {
      ({ wrapper } = renderCards(
        <TestI18nProvider messages={{ cards: { 'ariaLabels.selectionGroupLabel': 'Custom label' } }}>
          <Cards<Item> cardDefinition={cardDefinition} selectionType="multi" items={defaultItems} />
        </TestI18nProvider>
      ));
      expect(getCardByTestId('card-1').findSelectionArea()!.getElement()).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Custom label')
      );
    });
  });

  describe('test utils', () => {
    it('findItemByTestId returns the card by test id', () => {
      const { wrapper } = renderCards(
        <Cards<Item>
          cardDefinition={{
            testId: item => `card-${item.id}`,
            sections: [
              {
                content: item => item.name,
              },
            ],
          }}
          items={defaultItems}
        />
      );

      expect(wrapper.findItemByTestId('card-2')!.getElement()).toHaveTextContent('Orange');
    });

    it('findItemByTestId returns the card even if test id contains quotes', () => {
      const { wrapper } = renderCards(
        <Cards<Item>
          cardDefinition={{
            testId: item => `card-"${item.id}"`,
          }}
          items={defaultItems}
        />
      );

      expect(wrapper.findItemByTestId('card-"2"')).toBeTruthy();
    });

    it('findSectionByTestId returns the section by test id', () => {
      const { wrapper } = renderCards(
        <Cards<Item>
          cardDefinition={{
            sections: [
              {
                content: item => `Item ID: ${item.id}`,
                testId: item => `card-${item.id}-id`,
              },
              {
                content: item => `Item Name: ${item.name}`,
                testId: item => `card-${item.id}-name`,
              },
            ],
          }}
          items={defaultItems}
        />
      );

      const firstItem = wrapper.findItems()[0]!;
      expect(firstItem.findSectionByTestId('card-1-id')!.getElement()).toHaveTextContent('Item ID: 1');
      expect(firstItem.findSectionByTestId('card-1-name')!.getElement()).toHaveTextContent('Item Name: Apples');
    });

    it('findSectionByTestId returns the section even if test id contains quotes', () => {
      const { wrapper } = renderCards(
        <Cards<Item>
          cardDefinition={{
            sections: [
              {
                testId: item => `card-section-"${item.id}"`,
              },
            ],
          }}
          items={defaultItems}
        />
      );

      const firstItem = wrapper.findItems()[0]!;
      expect(firstItem.findSectionByTestId('card-section-"1"')).toBeTruthy();
    });
  });
});
