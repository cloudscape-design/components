// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';
import Cards, { CardsProps } from '~components/cards/index';
import Header from '~components/header/index';

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

const items = createSimpleItems(4);

export default function () {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  return (
    <>
      <h1>Cards selection</h1>
      <Cards<Item>
        items={items}
        cardDefinition={cardDefinition}
        header={<Header>Cards header</Header>}
        selectionType="multi"
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        ariaLabels={ariaLabels}
      />
    </>
  );
}
