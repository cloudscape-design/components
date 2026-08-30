// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button } from '~components';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import Tabs, { TabsProps } from '~components/tabs';

const GROUP_ID = 'cross-list-demo-group';
const LEFT_ID = 'cross-list-left';
const RIGHT_ID = 'cross-list-right';

const crossListI18n: TabsProps.I18nStrings = {
  scrollLeftAriaLabel: 'Scroll left',
  scrollRightAriaLabel: 'Scroll right',
  tabsWithActionsAriaRoleDescription: 'Reorderable tabs',
  reorderDragHandleAriaLabel: 'Drag handle',
  reorderDragHandleAriaDescription:
    "Use Space or Enter to activate drag for a tab, then use the arrow keys to move the tab's position. Hold Ctrl (or Command) with the arrow keys at a list edge to move the tab into the neighboring list. To complete the move, use Space or Enter; to discard it, use Escape.",
  liveAnnouncementReorderStarted: (position, total) => `Picked up tab at position ${position} of ${total}`,
  liveAnnouncementReorderMoved: (from, to, total) =>
    from === to ? `Moving tab back to position ${to} of ${total}` : `Moving tab to position ${to} of ${total}`,
  liveAnnouncementReorderCommitted: (from, to, total) =>
    from === to
      ? `Tab returned to its original position ${to} of ${total}`
      : `Tab moved from position ${from} to position ${to} of ${total}`,
  liveAnnouncementReorderDiscarded: 'Reordering canceled',
  liveAnnouncementTabMovedAcrossLists: (targetPosition, targetTotal) =>
    `Tab moved to position ${targetPosition} of ${targetTotal} in the destination tab list`,
};

function makeLeftTabs(): Array<TabsProps.Tab> {
  return [
    { id: 'l-overview', label: 'Overview', disableReorder: true, content: <p>Overview (pinned in list A)</p> },
    { id: 'l-alpha', label: 'Alpha', content: <p>Alpha content</p> },
    {
      id: 'l-beta',
      label: 'Beta',
      dismissible: true,
      dismissLabel: 'Dismiss Beta',
      content: <p>Beta content (dismissible)</p>,
    },
    { id: 'l-gamma', label: 'Gamma', content: <p>Gamma content</p> },
  ];
}

function makeRightTabs(): Array<TabsProps.Tab> {
  return [
    { id: 'r-summary', label: 'Summary', disableReorder: true, content: <p>Summary (pinned in list B)</p> },
    { id: 'r-delta', label: 'Delta', content: <p>Delta content</p> },
    {
      id: 'r-epsilon',
      label: 'Epsilon',
      dismissible: true,
      dismissLabel: 'Dismiss Epsilon',
      content: <p>Epsilon content (dismissible)</p>,
    },
  ];
}

export default function CrossListTabsPage() {
  const [tabsByList, setTabsByList] = useState<Record<string, Array<TabsProps.Tab>>>({
    [LEFT_ID]: makeLeftTabs(),
    [RIGHT_ID]: makeRightTabs(),
  });
  const [activeByList, setActiveByList] = useState<Record<string, string>>({
    [LEFT_ID]: 'l-alpha',
    [RIGHT_ID]: 'r-delta',
  });

  const orderById = (source: Array<TabsProps.Tab>, tabIds: string[]): Array<TabsProps.Tab> => {
    const byId = new Map(source.map(tab => [tab.id, tab]));
    return tabIds.map(id => byId.get(id)!).filter(Boolean);
  };

  const handleReorder =
    (listId: string) =>
    ({ detail }: { detail: TabsProps.ReorderDetail }) =>
      setTabsByList(prev => ({ ...prev, [listId]: orderById(prev[listId], detail.tabIds) }));

  // A single controlled handler for both lists: it rebuilds BOTH lists from the moved
  // detail. `onTabMove` fires on the source and the target instance, but the rebuild is
  // idempotent so applying it more than once is safe.
  const handleTabMove = ({ detail }: { detail: TabsProps.TabMoveDetail }) =>
    setTabsByList(prev => {
      const byId = new Map<string, TabsProps.Tab>();
      Object.values(prev).forEach(list => list.forEach(tab => byId.set(tab.id, tab)));
      const build = (ids: string[]) => ids.map(id => byId.get(id)).filter((tab): tab is TabsProps.Tab => !!tab);
      return {
        ...prev,
        [detail.sourceGroupTabsId]: build(detail.sourceTabIds),
        [detail.targetGroupTabsId]: build(detail.targetTabIds),
      };
    });

  const handleChange =
    (listId: string) =>
    ({ detail }: { detail: TabsProps.ChangeDetail }) =>
      setActiveByList(prev => ({ ...prev, [listId]: detail.activeTabId }));

  const handleDismiss = (listId: string, tabId: string) => () =>
    setTabsByList(prev => ({ ...prev, [listId]: prev[listId].filter(tab => tab.id !== tabId) }));

  const decorate = (listId: string): Array<TabsProps.Tab> =>
    tabsByList[listId].map(tab => (tab.dismissible ? { ...tab, onDismiss: handleDismiss(listId, tab.id) } : tab));

  return (
    <>
      <h1>Cross-list reorderable tabs</h1>
      <Box variant="p">
        Two independent <code>Tabs</code> instances that share one <code>reorderGroup</code> value — no wrapper or
        provider. Drag a tab (or lift it with the keyboard and use Ctrl/Command + arrow at a list edge) to move it
        between the lists. Pinned tabs (Overview, Summary) stay put; dismissible tabs can still be removed.
      </Box>
      <SpaceBetween size="xl" direction="horizontal">
        <div style={{ minInlineSize: 360 }}>
          <h2>List A</h2>
          <Tabs
            id={LEFT_ID}
            reorderable={true}
            reorderGroup={GROUP_ID}
            tabs={decorate(LEFT_ID)}
            activeTabId={activeByList[LEFT_ID]}
            onChange={handleChange(LEFT_ID)}
            onReorder={handleReorder(LEFT_ID)}
            onTabMove={handleTabMove}
            i18nStrings={crossListI18n}
          />
          <Box variant="small" padding={{ top: 's' }}>
            Order: {tabsByList[LEFT_ID].map(tab => tab.id).join(', ') || '(empty)'}
          </Box>
        </div>
        <div style={{ minInlineSize: 360 }}>
          <h2>List B</h2>
          <Tabs
            id={RIGHT_ID}
            reorderable={true}
            reorderGroup={GROUP_ID}
            tabs={decorate(RIGHT_ID)}
            activeTabId={activeByList[RIGHT_ID]}
            onChange={handleChange(RIGHT_ID)}
            onReorder={handleReorder(RIGHT_ID)}
            onTabMove={handleTabMove}
            i18nStrings={crossListI18n}
          />
          <Box variant="small" padding={{ top: 's' }}>
            Order: {tabsByList[RIGHT_ID].map(tab => tab.id).join(', ') || '(empty)'}
          </Box>
        </div>
      </SpaceBetween>
      <Box padding={{ top: 'l' }}>
        <Button
          onClick={() => {
            setTabsByList({ [LEFT_ID]: makeLeftTabs(), [RIGHT_ID]: makeRightTabs() });
            setActiveByList({ [LEFT_ID]: 'l-alpha', [RIGHT_ID]: 'r-delta' });
          }}
        >
          Reset lists
        </Button>
      </Box>
    </>
  );
}
