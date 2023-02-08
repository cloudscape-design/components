// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';
import { range } from 'lodash';
import { Box, Button, SpaceBetween, Flashbar, FlashbarProps, Toggle } from '~components';
import { generateItem, i18nStrings } from './common';
import ScreenshotArea from '../utils/screenshot-area';

export default function InteractiveFlashbar() {
  const dismiss = (index: string) => {
    setItems(items => items.filter(item => item.id !== index));
  };

  const add = (type: FlashbarProps.Type, hasHeader = false) => {
    setNextId(id => {
      setItems(items => [generateItem({ type, id: id.toString(), dismiss, hasHeader }), ...items]);
      return id + 1;
    });
  };

  const addMultiple = (type: FlashbarProps.Type, hasHeader = false, amount: number) => {
    const id = nextId;
    for (const i of range(amount)) {
      setTimeout(() => {
        setItems(items => [generateItem({ type, id: (id + i).toString(), dismiss, hasHeader }), ...items]);
      }, i * 100);
    }
    setNextId(id + amount);
  };

  const addToBottom = (type: FlashbarProps.Type, hasHeader = false) => {
    setNextId(id => {
      setItems(items => [...items, generateItem({ type, dismiss, hasHeader, id: id.toString() })]);
      return id + 1;
    });
  };

  const removeAndAddToBottom = (type: FlashbarProps.Type, hasHeader = false) => {
    setNextId(id => {
      setItems(items => [
        generateItem({ type, dismiss, hasHeader, id: id.toString() }),
        ...items.slice(1, items.length),
      ]);
      return id + 1;
    });
  };

  const initialItems = [
    generateItem({ type: 'success', dismiss, hasHeader: true, initial: true, id: '4' }),
    generateItem({ type: 'info', dismiss, hasHeader: true, initial: false, id: '3' }),
    generateItem({ type: 'error', dismiss, hasHeader: true, initial: false, id: '2' }),
    generateItem({ type: 'info', dismiss, hasHeader: false, initial: false, id: '1' }),
    generateItem({ type: 'info', dismiss, hasHeader: false, initial: false, id: '0' }),
  ];

  const [collapsible, setCollapsible] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [nextId, setNextId] = useState(initialItems.length);

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
          <Button data-id="add-multiple" onClick={() => addMultiple('error', true, 3)}>
            Add Multiple Error Flashes
          </Button>
          <Button onClick={() => add('warning')}>Add Warning Flash</Button>
          <Button data-id="add-error-to-bottom" onClick={() => addToBottom('error')}>
            Add To Bottom
          </Button>
          <Button onClick={() => removeAndAddToBottom('error')}>Add And Remove</Button>
        </SpaceBetween>
        <ScreenshotArea>
          <Box padding="xxl">
            <Flashbar items={items} {...restProps} />
          </Box>
        </ScreenshotArea>
      </SpaceBetween>
    </>
  );
}
