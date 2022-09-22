// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import Flashbar from '~components/flashbar';
import { useState } from 'react';
import { Box, Button, SpaceBetween } from '~components';
import { range } from 'lodash';
const RANDOM_NUMBER_RANGE = 1000;
export default function FlashbarPermutations(this: any) {
  const generateItem = (type: string, hasHeader = false) => {
    const randomKey = `key_${Math.floor(Math.random() * RANDOM_NUMBER_RANGE)}`;
    return {
      type,
      id: randomKey,
      dismissible: true,
      dismissLabel: 'Dismiss',
      onDismiss: () => dismiss(randomKey),
      buttonText: 'Do Action',
      statusIconAriaLabel: 'Info',
      content: `This is a flash item with key ${randomKey.split('_').join(' ')}`,
      ...(hasHeader && { header: 'Has Header Content' }),
    };
  };
  function generateArray<T>(count: number, func: (index: number) => T): Array<T> {
    return range(count).map((_, index) => func(index));
  }
  const [items, setItems] = useState([...generateArray(5, generateItem.bind(this as any, 'info', false))]);

  const dismiss = (index: string) => {
    setItems(items => items.filter(item => item.id !== index));
  };

  const add = (type: string, hasHeader = false) => {
    setItems(items => [...items, generateItem(type, hasHeader)]);
  };
  const addTop = (type: string, hasHeader = false) => {
    setItems(items => [generateItem(type, hasHeader), ...items]);
  };
  const removeLastAndAdd = (type: string, hasHeader = false) => {
    setItems(items => [...items.slice(0, items.length - 1)]);
    setItems(items => [...items, generateItem(type, hasHeader)]);
  };

  return (
    <>
      <h1>Flashbar dismissal test</h1>
      <Box margin={{ bottom: 'l', left: 'l' }}>
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={() => add('info', true)}>Add Info Flash</Button>
          <Button onClick={() => add('success')}>Add Success Flash</Button>
          <Button onClick={() => add('error', true)}>Add Error Flash</Button>
          <Button onClick={() => add('warning')}>Add Warning Flash</Button>
          <Button onClick={() => addTop('warning')}>Add To Top</Button>
          <Button onClick={() => removeLastAndAdd('error')}>Add And Remove</Button>
        </SpaceBetween>
      </Box>
      <Flashbar items={items as any} />
    </>
  );
}
