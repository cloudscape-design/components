// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';
import Cards, { CardsProps } from '~components/cards/index';
import Header from '~components/header/index';
import Toggle from '~components/toggle';

interface Item {
  number: number;
  text: string;
}

const ariaLabels: CardsProps<Item>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
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

const items = createSimpleItems(8);

export default function () {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [entireCard, setEntireCard] = useState(false);
  const [someDisabled, setSomeDisabled] = useState(false);

  return (
    <>
      <h1>Cards selection</h1>
      <Toggle checked={entireCard} onChange={event => setEntireCard(event.detail.checked)}>
        Allow clicking entire card to select
      </Toggle>
      <Toggle checked={someDisabled} onChange={event => setSomeDisabled(event.detail.checked)}>
        Make some card elements inactive
      </Toggle>
      <Cards<Item>
        items={items}
        cardDefinition={cardDefinition}
        header={<Header>Cards header</Header>}
        selectionType="multi"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        ariaLabels={ariaLabels}
        entireCardClickable={entireCard}
        isItemDisabled={item => someDisabled && !item.text.includes('o')}
      />
    </>
  );
}
