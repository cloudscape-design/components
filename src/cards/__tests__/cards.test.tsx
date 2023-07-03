// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import Cards, { CardsProps } from '../../../lib/components/cards';
import { CardsWrapper, PaginationWrapper } from '../../../lib/components/test-utils/dom';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.css.js';
import TestI18nProvider from '../../../lib/components/internal/i18n/testing';
import styles from '../../../lib/components/cards/styles.css.js';

interface Item {
  id: number;
  name: string;
}

function findFooterPagination(wrapper: CardsWrapper): PaginationWrapper | null {
  return wrapper.findComponent(`.${styles['footer-pagination']}`, PaginationWrapper);
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

  const getCardHeader = (index: number) => getCard(index)?.findCardHeader()?.getElement();

  // index is 0-based
  const getCardsSections = (index: number) => getCard(index).findSections();

  // cardIndex and sectionIndex are 0-based
  const getCardSection = (cardIndex: number, sectionIndex: number) => getCardsSections(cardIndex)[sectionIndex];

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

      const cardsOrderedList = getCard(0).getElement().parentElement;
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
              },
            ],
          }}
          items={defaultItems}
        />
      ).wrapper;
      defaultItems.forEach((item, idx) => {
        expect(getCardsSections(idx)).toHaveLength(1);

        expect(getCardSection(idx, 0).findSectionHeader()).toBe(null);
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
  });

  describe('header region', () => {
    it('is displayed', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={defaultItems} header="abcedefg" />).wrapper;
      expect(wrapper.findHeader()?.getElement()).toHaveTextContent('abcedefg');
    });

    it('maintains logical relationship between header and cards', () => {
      wrapper = renderCards(<Cards<Item> cardDefinition={{}} items={defaultItems} header="abcedefg" />).wrapper;
      const cardsOrderedList = getCard(0).getElement().parentElement;
      expect(cardsOrderedList).toHaveAccessibleName('abcedefg');
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

    it('is displayed in the footer on full-page variant', () => {
      wrapper = renderCards(
        <Cards<Item> variant="full-page" cardDefinition={{}} items={defaultItems} pagination="pagination" />
      ).wrapper;
      expect(wrapper.findPagination()?.getElement()).toHaveTextContent('pagination');
      expect(findFooterPagination(wrapper)?.getElement()).toHaveTextContent('pagination');
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
    test('Should render a live region with table total count and indices when renderAriaLive and firstIndex are available', () => {
      const firstIndex = 1;
      const totalItemsCount = defaultItems.length;
      const lastIndex = firstIndex + defaultItems.length - 1;

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
        `Displaying items from ${firstIndex} to ${lastIndex} of ${totalItemsCount} items`
      );
    });
  });

  describe('i18n', () => {
    test('supports using selectionGroupLabel from i18n provider', () => {
      ({ wrapper } = renderCards(
        <TestI18nProvider messages={{ cards: { 'ariaLabels.selectionGroupLabel': 'Custom label' } }}>
          <Cards<Item> cardDefinition={cardDefinition} selectionType="multi" items={defaultItems} />
        </TestI18nProvider>
      ));
      expect(getCard(0).findSelectionArea()!.getElement()).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Custom label')
      );
    });
  });
});
