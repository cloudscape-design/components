// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Header from '~components/header';
import Table from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';
import { generateItems, Instance } from './generate-data';

const initialItems = generateItems(10);

const columnDefinitions = [
  { id: 'id', header: 'ID', cell: (item: Instance) => item.id },
  { id: 'state', header: 'State', cell: (item: Instance) => item.state },
  { id: 'type', header: 'Type', cell: (item: Instance) => item.type },
  { id: 'imageId', header: 'Image ID', cell: (item: Instance) => item.imageId },
];

export default function App() {
  const [items, setItems] = useState<Instance[]>(initialItems);

  return (
    <ScreenshotArea>
      <Table
        header={<Header>Table with row reordering</Header>}
        columnDefinitions={columnDefinitions}
        items={items}
        trackBy="id"
        rowReordering={{
          onRowReorder: ({ detail }) => setItems(detail.items),
          i18nStrings: {
            dragHandleAriaLabel: 'Drag handle',
            dragHandleAriaDescription:
              'Use Space or Enter to activate drag, arrow keys to reorder, Space or Enter to confirm, Escape to cancel.',
            liveAnnouncementDndStarted: (position, total) =>
              `Picked up item at position ${position} of ${total}. Use arrow keys to reorder.`,
            liveAnnouncementDndItemReordered: (initialPosition, currentPosition, total) =>
              `Moving item from position ${initialPosition} to position ${currentPosition} of ${total}.`,
            liveAnnouncementDndItemCommitted: (initialPosition, finalPosition, total) =>
              initialPosition !== finalPosition
                ? `Item moved from position ${initialPosition} to position ${finalPosition} of ${total}.`
                : `Reordering cancelled. Item returned to position ${initialPosition} of ${total}.`,
            liveAnnouncementDndDiscarded: 'Reordering cancelled.',
            dragHandleItemAriaLabel: item => `Drag handle for ${item.id}`,
          },
        }}
      />
    </ScreenshotArea>
  );
}
