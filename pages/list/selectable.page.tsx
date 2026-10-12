// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, SpaceBetween } from '~components';
import List, { ListProps } from '~components/list';

import ScreenshotArea from '../utils/screenshot-area';

interface Item {
  id: string;
  content: string;
  description?: string;
  disabled?: boolean;
}

const items: Item[] = [
  { id: 'apples', content: 'Apples', description: 'Crisp and sweet' },
  { id: 'bananas', content: 'Bananas', description: 'Rich in potassium' },
  { id: 'cherries', content: 'Cherries', description: 'Currently out of stock', disabled: true },
  { id: 'dates', content: 'Dates', description: 'Naturally sweet' },
  { id: 'elderberries', content: 'Elderberries', description: 'Best cooked' },
];

const renderItem = (item: Item): ReturnType<ListProps<Item>['renderItem']> => ({
  id: item.id,
  content: item.content,
  secondaryContent: item.description && <Box variant="small">{item.description}</Box>,
});

export default function SelectableListPage() {
  const [singleSelected, setSingleSelected] = useState<ReadonlyArray<Item>>([items[0]]);
  const [multiSelected, setMultiSelected] = useState<ReadonlyArray<Item>>([items[1], items[3]]);

  return (
    <ScreenshotArea>
      <h1>Selectable list</h1>
      <SpaceBetween size="l">
        <div>
          <h2 id="single-heading">Single selection</h2>
          <List
            ariaLabelledby="single-heading"
            selectionType="single"
            items={items}
            renderItem={renderItem}
            isItemDisabled={item => !!item.disabled}
            selectedItems={singleSelected}
            onSelectionChange={({ detail }) => setSingleSelected(detail.selectedItems)}
          />
          <Box variant="small">Selected: {singleSelected.map(item => item.content).join(', ') || 'none'}</Box>
        </div>

        <div>
          <h2 id="multi-heading">Multi selection</h2>
          <List
            ariaLabelledby="multi-heading"
            selectionType="multi"
            items={items}
            renderItem={renderItem}
            isItemDisabled={item => !!item.disabled}
            selectedItems={multiSelected}
            onSelectionChange={({ detail }) => setMultiSelected(detail.selectedItems)}
          />
          <Box variant="small">Selected: {multiSelected.map(item => item.content).join(', ') || 'none'}</Box>
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
