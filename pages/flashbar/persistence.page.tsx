// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import Button from '~components/button';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import { setPersistenceFunctionsForTesting } from '~components/internal/persistence';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import ScreenshotArea from '../utils/screenshot-area';

const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
setPersistenceFunctionsForTesting({
  retrieveFlashbarDismiss: async (persistenceConfig: FlashbarProps.PersistenceConfig) => {
    const dismissed = Boolean(params.get('dismissedKeys')?.includes(persistenceConfig.uniqueKey));
    const result = await new Promise<boolean>(resolve =>
      setTimeout(() => resolve(dismissed), Math.min(parseInt(params.get('mockRetrieveDelay') || '0'), 150))
    );
    return result;
  },
});

export default function FlashbarTest() {
  const [items, setItems] = useState<FlashbarProps.MessageDefinition[]>([
    {
      type: 'success',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      content: 'Success flash message without persistence',
      id: 'message_1',
      onDismiss: () => setItems(items => items.filter(item => item.id !== 'message_1')),
    },
    {
      type: 'warning',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      content: 'Warning flash message without persistence',
      id: 'message_2',
      onDismiss: () => setItems(items => items.filter(item => item.id !== 'message_2')),
    },
    {
      type: 'info',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      content: 'Notification flash message 1 with persistence',
      id: 'message_3',
      onDismiss: () => setItems(items => items.filter(item => item.id !== 'message_3')),
      persistenceConfig: {
        uniqueKey: 'persistence_1',
      },
    },
    {
      type: 'in-progress',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      content: 'Notification flash message 2 with persistence',
      id: 'message_4',
      onDismiss: () => setItems(items => items.filter(item => item.id !== 'message_4')),
      persistenceConfig: {
        uniqueKey: 'persistence_2',
      },
    },
  ]);
  const [stackItems, setStackItems] = useState(params.get('stackItems') === 'true');

  const addFlashItem = (withPersistence: boolean) => {
    const id = `message_${Date.now()}`;
    const newItem: FlashbarProps.MessageDefinition = {
      type: 'info',
      dismissible: true,
      dismissLabel: 'Dismiss message',
      content: `New flash message ${withPersistence ? 'with' : 'without'} persistence`,
      id,
      ariaRole: 'status',
      onDismiss: () => setItems(items => items.filter(item => item.id !== id)),
      ...(withPersistence && {
        persistenceConfig: {
          uniqueKey: `new_${id}`,
        },
      }),
    };
    setItems(items => [...items, newItem]);
  };

  return (
    <>
      <h1>Flashbar test with Persistence</h1>
      <SpaceBetween size="xs">
        <div>This page is to test Persistence with retrival delay (the maximum possible delay is 150ms)</div>
        <SpaceBetween direction="horizontal" size="xs">
          <Button data-id="add-no-persistence-item" onClick={() => addFlashItem(false)}>
            Add without persistence
          </Button>
          <Button data-id="add-persistence-item" onClick={() => addFlashItem(true)}>
            Add with persistence
          </Button>
          <Toggle
            data-id="stack-items"
            checked={stackItems}
            onChange={({ detail }) => {
              setStackItems(detail.checked);
              const url = new URL(window.location.href);
              const params = new URLSearchParams(url.hash.split('?')[1] || '');
              params.set('stackItems', detail.checked.toString());
              window.history.replaceState({}, '', `${url.pathname}${url.hash.split('?')[0]}?${params}`);
            }}
          >
            Stack items
          </Toggle>
        </SpaceBetween>
      </SpaceBetween>
      <ScreenshotArea>
        <Flashbar items={items} stackItems={stackItems} />
      </ScreenshotArea>
    </>
  );
}
