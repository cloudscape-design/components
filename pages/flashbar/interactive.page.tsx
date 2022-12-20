// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';
import { range } from 'lodash';
import { Button, SpaceBetween, Flashbar, FlashbarProps, Toggle } from '~components';

const RANDOM_NUMBER_RANGE = 1000;

function generateItem(
  type: FlashbarProps.Type,
  dismiss: (index: string) => void,
  hasHeader = false,
  initial = false
): FlashbarProps.MessageDefinition {
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
    ariaRole: initial ? undefined : type === 'error' ? 'alert' : 'status',
    ...(hasHeader && { header: 'Has Header Content' }),
  };
}

export default function FlashbarPermutations() {
  const dismiss = (index: string) => {
    setItems(items => items.filter(item => item.id !== index));
  };

  const add = (type: FlashbarProps.Type, hasHeader = false) => {
    setItems(items => [...items, generateItem(type, dismiss, hasHeader)]);
  };

  const addMultiple = (type: FlashbarProps.Type, hasHeader = false) => {
    add(type, hasHeader);
    setTimeout(() => add(type, hasHeader), 100);
    setTimeout(() => add(type, hasHeader), 200);
  };

  const addTop = (type: FlashbarProps.Type, hasHeader = false) => {
    setItems(items => [generateItem(type, dismiss, hasHeader), ...items]);
  };

  const removeLastAndAdd = (type: FlashbarProps.Type, hasHeader = false) => {
    setItems(items => [...items.slice(0, items.length - 1), generateItem(type, dismiss, hasHeader)]);
  };

  const [stackItems, setStackItems] = useState(false);
  const [items, setItems] = useState(() => [...range(5).map(() => generateItem('info', dismiss, false, true))]);

  const privateProps = stackItems
    ? {
        stackItems: true,
        i18nStrings: {
          collapseButtonAriaLabel: 'Show less notifications',
          expandButtonAriaLabel: (itemCount: number) => `Show all ${itemCount} notifications`,
          toggleButtonText: (itemCount: number) => `Notifications (${itemCount})`,
        },
      }
    : {};

  return (
    <>
      <h1>Flashbar dismissal test</h1>
      <SpaceBetween size="xs">
        <Toggle checked={stackItems} onChange={({ detail }) => setStackItems(detail.checked)}>
          Stack items
        </Toggle>
        <SpaceBetween direction="horizontal" size="xs">
          <Button data-id="add-info" onClick={() => add('info', true)}>
            Add Info Flash
          </Button>
          <Button onClick={() => add('success')}>Add Success Flash</Button>
          <Button data-id="add-error" onClick={() => add('error', true)}>
            Add Error Flash
          </Button>
          <Button data-id="add-multiple" onClick={() => addMultiple('error', true)}>
            Add Multiple Error Flashes
          </Button>
          <Button onClick={() => add('warning')}>Add Warning Flash</Button>
          <Button data-id="add-to-top" onClick={() => addTop('error')}>
            Add To Top
          </Button>
          <Button onClick={() => removeLastAndAdd('error')}>Add And Remove</Button>
        </SpaceBetween>
        <Flashbar items={items} {...(privateProps as any)} />
      </SpaceBetween>
    </>
  );
}
