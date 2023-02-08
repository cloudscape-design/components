// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';
import { range } from 'lodash';
import { Button, SpaceBetween, Flashbar, FlashbarProps, Toggle } from '~components';
import { generateItem, i18nStrings } from './common';

export default function InteractiveFlashbar() {
  const dismiss = (index: string) => {
    setItems(items => items.filter(item => item.id !== index));
  };

  const add = (type: FlashbarProps.Type, hasHeader = false) => {
    setItems(items => [generateItem(type, dismiss, hasHeader), ...items]);
  };

  const addMultiple = (type: FlashbarProps.Type, hasHeader = false) => {
    add(type, hasHeader);
    setTimeout(() => add(type, hasHeader), 100);
    setTimeout(() => add(type, hasHeader), 200);
  };

  const addToBottom = (type: FlashbarProps.Type, hasHeader = false) => {
    setItems(items => [...items, generateItem(type, dismiss, hasHeader)]);
  };

  const removeAndAddToBottom = (type: FlashbarProps.Type, hasHeader = false) => {
    setItems(items => [generateItem(type, dismiss, hasHeader), ...items.slice(1, items.length)]);
  };

  const [collapsible, setCollapsible] = useState(false);
  const [items, setItems] = useState(() => [...range(5).map(() => generateItem('info', dismiss, false, true))]);

  const restProps = collapsible
    ? {
        stackItems: true,
        i18nStrings,
      }
    : {
        i18nStrings: {
          ariaLabel: i18nStrings.ariaLabel,
        },
      };

  return (
    <>
      <h1>Flashbar interactions test</h1>
      <SpaceBetween size="xs">
        <Toggle checked={collapsible} onChange={({ detail }) => setCollapsible(detail.checked)}>
          <span data-id="stack-items">Stack items</span>
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
          <Button data-id="add-error-to-bottom" onClick={() => addToBottom('error')}>
            Add To Bottom
          </Button>
          <Button onClick={() => removeAndAddToBottom('error')}>Add And Remove</Button>
        </SpaceBetween>
        <Flashbar items={items} {...restProps} />
      </SpaceBetween>
    </>
  );
}
