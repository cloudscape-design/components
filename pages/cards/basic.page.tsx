// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import range from 'lodash/range';

import { AutosuggestProps } from '~components/autosuggest/interfaces';
import Cards, { CardsProps } from '~components/cards/index';
import FormField from '~components/form-field/index';
import Header from '~components/header/index';
import Select from '~components/select/index';

interface Item {
  number: number;
  text: string;
}

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

const configs: CardsProps['cardsPerRow'][] = [
  undefined,
  [
    {
      cards: 1,
    },
    {
      minWidth: 400,
      cards: 2,
    },
  ],
  [
    {
      cards: 3,
      minWidth: 400,
    },
  ],
  [
    {
      cards: 7,
    },
  ],
];

const items = createSimpleItems(4);

export default function () {
  const [selectedOption, setSelectedOption] = useState<AutosuggestProps.Option>({ value: '0' });
  return (
    <>
      <h1>Basic Cards</h1>
      <FormField label="Cards per row selector">
        <Select
          id="cards_per_row"
          options={[{ value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }]}
          selectedOption={selectedOption}
          onChange={({ detail: { selectedOption } }) => setSelectedOption(selectedOption)}
        />
      </FormField>
      <Cards<Item>
        items={items}
        cardDefinition={cardDefinition}
        header={<Header>Cards header</Header>}
        cardsPerRow={configs[+(selectedOption.value as string)]}
      />
    </>
  );
}
