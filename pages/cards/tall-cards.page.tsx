// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Cards, { CardsProps } from '~components/cards';
import { Button, Header } from '~components';

interface Item {
  id: number;
  name: string;
  description: string;
}

const cardDefinition: CardsProps.CardDefinition<Item> = {
  header: item => `${item.name}`,
  sections: [
    {
      id: 'description',
      header: 'Description',
      content: item => (
        <div style={{ blockSize: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>{item.description}</div>
          <div>
            <Button id={`button-${item.id}`}>button-{item.id}</Button>
          </div>
        </div>
      ),
    },
  ],
};

export default () => {
  return (
    <>
      <h1>Sticky cards with long content</h1>
      <div
        id="overflow-parent"
        style={{
          overflow: 'auto',
          inlineSize: 600,
          blockSize: 800,
          padding: '0px 1px',
        }}
      >
        <Cards
          items={[
            {
              id: 1,
              name: `Name: ${1}`,
              description: `This is the description for the item with number ${1}`,
            },
            {
              id: 2,
              name: `Name: ${2}`,
              description: `This is the description for the item with number ${2}`,
            },
            {
              id: 3,
              name: `Name: ${3}`,
              description: `This is the description for the item with number ${3}`,
            },
            {
              id: 4,
              name: `Name: ${4}`,
              description: `This is the description for the item with number ${4}`,
            },
          ]}
          ariaLabels={{
            selectionGroupLabel: 'group label',
            itemSelectionLabel: ({ selectedItems }, item) =>
              `${item.name} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
          }}
          cardDefinition={cardDefinition}
          trackBy={item => item.name}
          stickyHeader={true}
          header={
            <Header variant="h2">
              Cards header <Button id={`button-0`}>button-0</Button>
            </Header>
          }
          cardsPerRow={[{ cards: 2 }]}
        ></Cards>
      </div>
    </>
  );
};
