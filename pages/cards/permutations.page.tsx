// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import range from 'lodash/range';
import Box from '~components/box';
import Button from '~components/button';
import Header from '~components/header';
import Cards, { CardsProps } from '~components/cards/index';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { Link } from '~components';

interface Item {
  number: number;
  text: string;
}

const ariaLabels: CardsProps<Item>['ariaLabels'] = {
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.text} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
};

function createSimpleItems(count: number) {
  const texts = ['One', 'Two', 'Three', 'Four'];
  return range(count).map(number => ({ number, text: texts[number % texts.length] }));
}

const cardDefinition: CardsProps.CardDefinition<Item> = {
  header: item =>
    item.number === 2 ? (
      <Link href="#" fontSize="inherit">
        {item.text}
      </Link>
    ) : (
      item.text
    ),
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

const header = <Header>Cards header</Header>;

const empty = (
  <Box textAlign="center" color="inherit">
    <Box variant="strong" textAlign="center" color="inherit">
      No resources
    </Box>
    <Box variant="p" padding={{ bottom: 's' }} color="inherit">
      No resources to display.
    </Box>
    <Button>Create resource</Button>
  </Box>
);

/* eslint-disable react/jsx-key */
const permutations = createPermutations<CardsProps>([
  {
    cardDefinition: [cardDefinition],
    variant: ['container', 'full-page'],
    header: [header, undefined],
    items: [createSimpleItems(4)],
  },
  {
    cardDefinition: [cardDefinition],
    header: [header],
    items: [[]],
    empty: [empty, 'empty'],
  },
  {
    cardDefinition: [cardDefinition],
    header: [header],
    items: [[]],
    loading: [true],
    loadingText: ['loading'],
  },
  {
    cardDefinition: [cardDefinition],
    selectedItems: [[{ number: 2 }]],
    selectionType: ['multi', 'single'],
    isItemDisabled: [item => item.number === 1],
    trackBy: ['number'],
    items: [createSimpleItems(4)],
    ariaLabels: [ariaLabels],
  },
  {
    cardDefinition: [
      {
        header: item => item.text,
        sections: [],
      },
    ],
    items: [createSimpleItems(4)],
  },
  {
    cardDefinition: [cardDefinition],
    items: [createSimpleItems(3)],
    variant: [undefined, 'full-page'],
    pagination: [undefined, 'pagination'],
  },
]);
/* eslint-enable react/jsx-key */

export default () => {
  return (
    <>
      <h1>Cards permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <Cards {...permutation} />} />
      </ScreenshotArea>
    </>
  );
};
