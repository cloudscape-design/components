// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import SpaceBetween from '~components/space-between';
import Token, { TokenProps } from '~components/token';

const generateItems = (numberOfItems: number) => {
  return [...new Array(numberOfItems)].map((_item, index) => ({
    id: index + '',
    label: `Item ${index + 1}`,
  })) as TokenProps[];
};

export default function TokenGroupToggleablePage() {
  const items = generateItems(12);
  const [pressedTokens, setPressedTokens] = useState(new Set<string>());

  return (
    <>
      <h1>Toggleable tokens</h1>
      <SpaceBetween size="s" direction="horizontal">
        {items.map((token, index) => (
          <Token
            key={index}
            variant="inline-toggle"
            label={token.label}
            pressed={pressedTokens.has(token.id!)}
            onChange={event => {
              setPressedTokens(prev => {
                const next = new Set(prev);
                if (event.detail.pressed) {
                  next.add(token.id!);
                } else {
                  next.delete(token.id!);
                }
                return next;
              });
            }}
          />
        ))}
      </SpaceBetween>
    </>
  );
}
