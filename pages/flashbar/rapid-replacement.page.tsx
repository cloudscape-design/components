// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';

import { Box, Button, Flashbar, FlashbarProps, Header, SpaceBetween } from '~components';

import { i18nStrings } from './common';

/**
 * Reproduces the rapid item replacement bug where quickly replacing a flashbar
 * item (e.g. loading → success) with a different id causes both items to remain
 * visible because the exit animation's transitionend event never fires.
 */
export default function RapidReplacementPage() {
  const [items, setItems] = useState<FlashbarProps.MessageDefinition[]>([]);

  const simulateLoadingToSuccess = () => {
    setItems([
      {
        id: 'loading-flash',
        type: 'info',
        loading: true,
        content: 'Operation in progress...',
        header: 'Loading',
      },
    ]);

    setTimeout(() => {
      setItems([
        {
          id: 'success-flash',
          type: 'success',
          content: 'Operation completed successfully.',
          header: 'Success',
          dismissible: true,
          dismissLabel: 'Dismiss',
          onDismiss: () => setItems([]),
        },
      ]);
    }, 100);
  };

  const simulateRapidCycling = () => {
    setItems([{ id: 'step-1', type: 'info', content: 'Step 1: Initializing...', header: 'Step 1' }]);

    setTimeout(() => {
      setItems([{ id: 'step-2', type: 'info', loading: true, content: 'Step 2: Processing...', header: 'Step 2' }]);
    }, 100);

    setTimeout(() => {
      setItems([
        {
          id: 'step-3',
          type: 'success',
          content: 'Step 3: All done.',
          header: 'Complete',
          dismissible: true,
          dismissLabel: 'Dismiss',
          onDismiss: () => setItems([]),
        },
      ]);
    }, 200);
  };

  return (
    <>
      <Header variant="h1">Flashbar rapid item replacement</Header>
      <SpaceBetween size="m">
        <SpaceBetween direction="horizontal" size="xs">
          <Button data-id="loading-to-success" onClick={simulateLoadingToSuccess}>
            Loading → Success
          </Button>
          <Button data-id="rapid-cycle" onClick={simulateRapidCycling}>
            Rapid 3-step cycle
          </Button>
          <Button data-id="clear" onClick={() => setItems([])}>
            Clear
          </Button>
        </SpaceBetween>
        <Box>
          <div data-id="item-count">Visible items: {items.length}</div>
        </Box>
        <Flashbar items={items} i18nStrings={{ ariaLabel: i18nStrings.ariaLabel }} />
      </SpaceBetween>
    </>
  );
}
