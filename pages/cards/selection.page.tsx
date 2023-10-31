// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';
import Cards, { CardsProps } from '~components/cards';
import Header from '~components/header';
import Toggle from '~components/toggle';
import { EmptyState } from '../table/shared-configs';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Pagination from '~components/pagination';
import TextFilter from '~components/text-filter';

interface Item {
  number: number;
  text: string;
}

const renderAriaLive: CardsProps['renderAriaLive'] = ({ firstIndex, lastIndex, totalItemsCount }) =>
  `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`;

const getHeaderCounterText = (items: ReadonlyArray<unknown>, selectedItems: ReadonlyArray<unknown> | undefined) => {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items.length})` : `(${items.length})`;
};

const ariaLabels: CardsProps<Item>['ariaLabels'] = {
  selectionGroupLabel: 'Resource selection',
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.text} is ${!selectedItems.includes(item) ? 'not ' : ''}selected`,
};

function createSimpleItems(count: number) {
  const texts = ['One', 'Two', 'Three', 'Four'];
  return range(count).map(number => ({ number, text: texts[number % texts.length] }));
}

const cardDefinition: CardsProps.CardDefinition<Item> = {
  header: item => item.text,
  sections: [
    {
      id: 'description',
      header: 'Number',
      content: item => item.number,
    },
    {
      id: 'type',
      header: 'Text',
      content: item => item.text,
    },
  ],
};

const getTextFilterCounterText = (count: number) => `${count} ${count === 1 ? 'match' : 'matches'}`;

const allItems = createSimpleItems(50);

export default function () {
  const [selectionType, setSelectionType] = useState<CardsProps.SelectionType>('multi');
  const [entireCard, setEntireCard] = useState(false);
  const [someDisabled, setSomeDisabled] = useState(false);

  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(allItems, {
    filtering: {
      empty: <EmptyState title="No resources" subtitle="No resources to display." action={null} />,
      noMatch: <EmptyState title="No matches" subtitle="We can’t find a match." action={null} />,
    },
    pagination: { pageSize: 10 },
    selection: {},
  });

  return (
    <>
      <h1>Cards selection</h1>
      <Toggle checked={entireCard} onChange={event => setEntireCard(event.detail.checked)}>
        Allow clicking entire card to select
      </Toggle>
      <Toggle checked={someDisabled} onChange={event => setSomeDisabled(event.detail.checked)}>
        Make some card elements inactive
      </Toggle>
      <Toggle
        checked={selectionType === 'multi'}
        onChange={event => setSelectionType(event.detail.checked ? 'multi' : 'single')}
      >
        Use multi selection
      </Toggle>
      <Cards<Item>
        {...collectionProps}
        items={items}
        cardDefinition={cardDefinition}
        header={<Header counter={getHeaderCounterText(allItems, collectionProps.selectedItems)}>Resources</Header>}
        selectionType={selectionType}
        ariaLabels={ariaLabels}
        renderAriaLive={renderAriaLive}
        entireCardClickable={entireCard}
        isItemDisabled={item => someDisabled && !item.text.includes('o')}
        pagination={<Pagination {...paginationProps} />}
        filter={
          <TextFilter
            {...filterProps}
            filteringAriaLabel="Filter resources"
            filteringPlaceholder="Find resources"
            filteringClearAriaLabel="Clear"
            countText={getTextFilterCounterText(filteredItemsCount ?? 0)}
          />
        }
      />
    </>
  );
}
