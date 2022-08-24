// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import TokenGroup, { TokenGroupProps } from '~components/token-group';
import Box from '~components/box';

const unicodeCombiningCharactersTestString = 'L̷̡̧͔̖̥̱̲͓̘̳͉̤͍͛͗̋̃̈͐̈͘͘ơ̵̻͔̬̲̠̽̈́̏͊͑͒͘̕r̷̰͇̗̯̠̟̣̗̜̻̙̀̎̾̈͘̕͝ȩ̸͖̻͔͔̀̐̆̀̃m̵̬̗̮͍̙̦̗̮̯̽̕ ̸̟͖̩̼̲̓̇͊̊̓î̷̧̨̳̺̥̻̞̣̽͝p̷̞͊s̸̭̗͉̩̲̈̔̑͊́͆͝u̶͎̥̰̥͒̕m̶̨̛̟͚͖͉͉̘̯͓̜͚̎͂̌̽̄͐̕ͅ';

const generateItems = (numberOfItems: number) => {
  return [...new Array(numberOfItems)].map((_item, index) => ({
    label: index === 5 ? unicodeCombiningCharactersTestString : `Item ${index + 1}`,
    disabled: index === 1,
    dismissLabel: `Remove item ${index + 1}`,
  })) as TokenGroupProps.Item[];
};

const i18nStrings: TokenGroupProps.I18nStrings = {
  limitShowMore: 'Show more chosen options',
  limitShowFewer: 'Show fewer chosen options',
};

export default function TokenGroupPage() {
  const [items, setItems] = useState(generateItems(10));

  const onDismiss = (event: { detail: { itemIndex: number } }) => {
    const newItems = [...items];
    newItems.splice(event.detail.itemIndex, 1);
    setItems(newItems);
  };

  return (
    <Box padding="xl">
      <h1>Token Group</h1>
      <TokenGroup items={items} onDismiss={onDismiss} i18nStrings={i18nStrings} limit={6} />
    </Box>
  );
}
