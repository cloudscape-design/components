// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import range from 'lodash/range';
import Cards, { CardsProps } from '~components/cards';
import { Header, TextFilter } from '~components';
import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  id: number;
  name: string;
  description: string;
}

function generateItems(count: number): Item[] {
  return range(0, count).map(num => ({
    id: num,
    name: `Name: ${num}`,
    description: `This is the description for the item with number ${num}`,
  }));
}

const cardDefinition: CardsProps.CardDefinition<Item> = {
  header: item => `${item.name}`,
  sections: [
    {
      id: 'description',
      header: 'Description',
      content: item => item.description,
    },
  ],
};

export default () => {
  const allItems = generateItems(30);
  const cardsRef = useRef<CardsProps.Ref>(null);
  const [sticky, setSticky] = useState<boolean>(true);
  const [verticalOffset, setVerticalOffset] = useState<boolean>(false);
  const { filterProps, collectionProps, items } = useCollection(allItems, {
    filtering: {},
  });
  const ariaLabels: CardsProps.AriaLabels<Item> = {
    selectionGroupLabel: 'group label',
    itemSelectionLabel: ({ selectedItems }, item) =>
      `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
  };
  const cardProps: CardsProps<Item> = {
    items,
    selectionType: 'single',
    ariaLabels,
    cardDefinition,
    trackBy: item => item.name,
    stickyHeader: sticky,
    stickyHeaderVerticalOffset: verticalOffset ? 50 : 0,
    header: <Header variant="h2">Cards header</Header>,
    filter: <TextFilter {...filterProps} filteringPlaceholder={'Find by Text'} filteringAriaLabel={'Find instances'} />,
    ...collectionProps,
    cardsPerRow: [{ cards: 2 }, { cards: 4, minWidth: 800 }],
  };

  const overflowParentStyle = {
    overflow: 'auto',
    inlineSize: 600,
    height: 400,
    padding: '0px 1px',
  };

  return (
    <>
      <h1>Cards with Sticky Header</h1>
      <ScreenshotArea>
        <div id="overflow-parent" style={overflowParentStyle}>
          <p id="paragraph-above">This paragraph should not be visible after scrollToTop</p>
          <Cards {...cardProps} ref={cardsRef}></Cards>
        </div>
      </ScreenshotArea>
      <button id="scroll-to-top-btn" onClick={() => cardsRef.current?.scrollToTop()}>
        Scroll to Top
      </button>
      <button id="toggle-stickiness-btn" onClick={() => setSticky(!sticky)}>
        Toggle Stickiness
      </button>
      <button id="toggle-vertical-offset-btn" onClick={() => setVerticalOffset(!verticalOffset)}>
        Toggle Vertical Offset
      </button>
    </>
  );
};
