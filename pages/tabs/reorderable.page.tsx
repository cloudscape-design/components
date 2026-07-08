// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button } from '~components';
import SpaceBetween from '~components/space-between';
import Tabs, { TabsProps } from '~components/tabs';

const reorderI18n: TabsProps.I18nStrings = {
  scrollLeftAriaLabel: 'Scroll left',
  scrollRightAriaLabel: 'Scroll right',
  tabsWithActionsAriaRoleDescription: 'Reorderable tabs',
  reorderDragHandleAriaLabel: 'Drag handle',
  reorderDragHandleAriaDescription:
    "Use Space or Enter to activate drag for a tab, then use the arrow keys to move the tab's position. To complete the position move, use Space or Enter, or to discard the move, use Escape.",
  liveAnnouncementReorderStarted: (position, total) => `Picked up tab at position ${position} of ${total}`,
  liveAnnouncementReorderMoved: (from, to, total) =>
    from === to ? `Moving tab back to position ${to} of ${total}` : `Moving tab to position ${to} of ${total}`,
  liveAnnouncementReorderCommitted: (from, to, total) =>
    from === to
      ? `Tab returned to its original position ${to} of ${total}`
      : `Tab moved from position ${from} to position ${to} of ${total}`,
  liveAnnouncementReorderDiscarded: 'Reordering canceled',
  addTabAriaLabel: 'Add new tab',
};

function makeInitialTabs(): Array<TabsProps.Tab> {
  return [
    { id: 'home', label: 'Home', disableReorder: true, content: <p>Home content (pinned)</p> },
    { id: 'first', label: 'First tab', content: <p>First content</p> },
    {
      id: 'second',
      label: 'Second tab',
      dismissible: true,
      dismissLabel: 'Dismiss second tab',
      content: <p>Second content (dismissible)</p>,
    },
    {
      id: 'third',
      label: 'Third tab',
      action: <Button iconName="copy" variant="icon" ariaLabel="Third tab action" />,
      content: <p>Third content (has action)</p>,
    },
    { id: 'fourth', label: 'Fourth tab', content: <p>Fourth content</p> },
  ];
}

export default function ReorderableTabsPage() {
  const [defaultTabs, setDefaultTabs] = useState<Array<TabsProps.Tab>>(makeInitialTabs);
  const [containerTabs, setContainerTabs] = useState<Array<TabsProps.Tab>>(makeInitialTabs);
  const [stackedTabs, setStackedTabs] = useState<Array<TabsProps.Tab>>(makeInitialTabs);

  const orderById = (source: Array<TabsProps.Tab>, tabIds: string[]): Array<TabsProps.Tab> => {
    const byId = new Map(source.map(tab => [tab.id, tab]));
    return tabIds.map(id => byId.get(id)!).filter(Boolean);
  };

  const nextTabId = (source: Array<TabsProps.Tab>): string => `tab-${source.length + 1}-${Date.now()}`;

  const handleAdd = (setter: React.Dispatch<React.SetStateAction<Array<TabsProps.Tab>>>) => () => {
    setter(prev => [
      ...prev,
      {
        id: nextTabId(prev),
        label: `New tab ${prev.length + 1}`,
        dismissible: true,
        dismissLabel: 'Dismiss new tab',
        content: <p>Newly added tab</p>,
      },
    ]);
  };

  const handleDismiss = (setter: React.Dispatch<React.SetStateAction<Array<TabsProps.Tab>>>, tabId: string) => () => {
    setter(prev => prev.filter(tab => tab.id !== tabId));
  };

  const decorateHandlers = (
    source: Array<TabsProps.Tab>,
    setter: React.Dispatch<React.SetStateAction<Array<TabsProps.Tab>>>
  ) =>
    source.map(tab =>
      tab.dismissible
        ? {
            ...tab,
            onDismiss: handleDismiss(setter, tab.id),
          }
        : tab
    );

  return (
    <>
      <h1>Reorderable tabs</h1>
      <SpaceBetween size="l">
        <div>
          <h2>Default variant — reorderable + pinned + add-tab</h2>
          <Tabs
            tabs={decorateHandlers(defaultTabs, setDefaultTabs)}
            reorderable={true}
            addTabButton={true}
            onReorder={({ detail }) => setDefaultTabs(prev => orderById(prev, detail.tabIds))}
            onAddTab={handleAdd(setDefaultTabs)}
            i18nStrings={reorderI18n}
          />
        </div>
        <div>
          <h2>Container variant — reorderable + pinned + add-tab</h2>
          <Tabs
            variant="container"
            tabs={decorateHandlers(containerTabs, setContainerTabs)}
            reorderable={true}
            addTabButton={true}
            onReorder={({ detail }) => setContainerTabs(prev => orderById(prev, detail.tabIds))}
            onAddTab={handleAdd(setContainerTabs)}
            i18nStrings={reorderI18n}
          />
        </div>
        <div>
          <h2>Stacked variant — reorderable + pinned + add-tab</h2>
          <Tabs
            variant="stacked"
            tabs={decorateHandlers(stackedTabs, setStackedTabs)}
            reorderable={true}
            addTabButton={true}
            onReorder={({ detail }) => setStackedTabs(prev => orderById(prev, detail.tabIds))}
            onAddTab={handleAdd(setStackedTabs)}
            i18nStrings={reorderI18n}
          />
        </div>
      </SpaceBetween>
    </>
  );
}
