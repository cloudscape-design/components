// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import TokenGroup, { TokenGroupProps } from '~components/token-group';

const generateItems = (numberOfItems: number) => {
  return [...new Array(numberOfItems)].map((item, index) => ({
    label: `Item ${index + 1}`,
    description: `Description ${index + 1}`,
    iconName: 'settings',
    labelTag: '128Gb',
    tags: ['2-CPU', '2Gb RAM', 'Stuff', 'More stuff', 'A lot'],
    disabled: index === 1,
    dismissLabel: `Remove item ${index + 1}`,
  })) as TokenGroupProps.Item[];
};

export default function TokenGroupPage() {
  const [items, setItems] = useState(generateItems(3));

  const onDismiss = (event: { detail: { itemIndex: number } }) => {
    const newItems = [...items];
    newItems.splice(event.detail.itemIndex, 1);
    setItems(newItems);
  };

  return (
    <>
      <h1>Token Group integration test page</h1>
      <input className="focus-element" aria-label="focus element" />
      <TokenGroup alignment="vertical" items={items} onDismiss={onDismiss} id="test" />
      <h2>Token group without outer padding</h2>
      <TokenGroup items={items} disableOuterPadding={true} onDismiss={() => {}} />
    </>
  );
}
