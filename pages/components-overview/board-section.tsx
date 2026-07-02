// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Board from '@cloudscape-design/board-components/board';
import BoardItem from '@cloudscape-design/board-components/board-item';

import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { Section } from './utils';

export default function BoardSection() {
  return (
    <Section header="Board components" level="h2" description="Imported from @cloudscape-design/board-components">
      <Board
        items={[
          { id: '1', columnSpan: 1, rowSpan: 2, data: { title: 'Widget 1', content: 'First board item content' } },
          { id: '2', columnSpan: 1, rowSpan: 2, data: { title: 'Widget 2', content: 'Second board item content' } },
          { id: '3', columnSpan: 1, rowSpan: 2, data: { title: 'Widget 3', content: 'Third board item content' } },
        ]}
        renderItem={item => (
          <BoardItem
            header={<Header variant="h3">{item.data.title}</Header>}
            i18nStrings={{
              dragHandleAriaLabel: 'Drag handle',
              dragHandleAriaDescription: 'Use arrow keys to move, space to confirm, escape to cancel',
              resizeHandleAriaLabel: 'Resize handle',
              resizeHandleAriaDescription: 'Use arrow keys to resize, space to confirm, escape to cancel',
            }}
          >
            <SpaceBetween size="s">{item.data.content}</SpaceBetween>
          </BoardItem>
        )}
        onItemsChange={() => {}}
        empty="No items"
        i18nStrings={{
          liveAnnouncementDndStarted: () => '',
          liveAnnouncementDndItemReordered: () => '',
          liveAnnouncementDndItemResized: () => '',
          liveAnnouncementDndItemInserted: () => '',
          liveAnnouncementDndCommitted: () => '',
          liveAnnouncementDndDiscarded: () => '',
          liveAnnouncementItemRemoved: () => '',
          navigationAriaLabel: 'Board navigation',
          navigationAriaDescription: 'Click on non-empty item to move focus',
          navigationItemAriaLabel: () => '',
        }}
      />
    </Section>
  );
}
