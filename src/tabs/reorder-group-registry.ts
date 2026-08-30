// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AsyncStore, { ReadonlyAsyncStore } from '../area-chart/async-store';
import { fireNonCancelableEvent } from '../internal/events';
import { moveTabAcrossLists } from './cross-list-move';
import { TabsProps } from './interfaces';

/**
 * State of an in-progress cross-list drag, shared between the source list (which owns
 * the pointer drag and its `DndContext`) and the target list (which renders a drop
 * indicator). `targetTabsId`/`targetIndex` are `null` while the dragged tab is not over
 * any sibling list.
 */
export interface CrossListDragState {
  sourceTabsId: string;
  draggedTabId: string;
  targetTabsId: string | null;
  targetIndex: number | null;
}

/**
 * A single `reorderable` Tabs instance participating in a cross-list reorder group.
 * All value accessors are functions so the registry always reads the instance's latest
 * props/DOM without the member needing to re-register on every render.
 */
export interface ReorderGroupMember {
  /** Stable id of the Tabs instance (its consumer id or generated namespace). */
  tabsId: string;
  /** Current tabs of this instance. */
  getTabs: () => readonly TabsProps.Tab[];
  /** Bounding rect of this instance's tab list container (viewport coords), or null. */
  getContainerRect: () => DOMRect | null;
  /** Given a viewport x-coordinate, the insertion index among this instance's tabs. */
  getDropIndex: (clientX: number) => number;
  /** The instance's current `onTabMove` handler (may be undefined). */
  getOnTabMove: () => TabsProps['onTabMove'];
  /** Fired on the SOURCE instance after one of its tabs leaves, so it can select an adjacent tab. */
  selectAdjacentAfterRemoval: (removedTabId: string, remainingTabIds: string[]) => void;
  /** Fired on the TARGET instance after a tab arrives, so it can move focus to that tab's drag handle. */
  focusDragHandle: (tabId: string) => void;
  /** Fired on the TARGET instance after a tab arrives, so it can announce the move to screen readers. */
  announceReceived: (targetPosition: number, targetTotal: number) => void;
}

export interface ReorderGroupState {
  /** Members in registration order (used as the left-to-right fallback when rects are unavailable). */
  members: readonly ReorderGroupMember[];
  drag: CrossListDragState | null;
}

const groups = new Map<string, AsyncStore<ReorderGroupState>>();

function createState(): ReorderGroupState {
  return { members: [], drag: null };
}

/** Exposed for tests: the number of live groups (a group is deleted once its last member leaves). */
export function getGroupCount(): number {
  return groups.size;
}

export function getGroupStore(reorderGroup: string): ReadonlyAsyncStore<ReorderGroupState> | undefined {
  return groups.get(reorderGroup);
}

export function getMembers(reorderGroup: string): readonly ReorderGroupMember[] {
  return groups.get(reorderGroup)?.get().members ?? [];
}

export function getSiblings(reorderGroup: string, excludeTabsId: string): ReorderGroupMember[] {
  return getMembers(reorderGroup).filter(member => member.tabsId !== excludeTabsId);
}

/**
 * Registers a member with its reorder group, creating the group's shared store on first use.
 * Returns a cleanup function that removes the member and deletes the group once it is empty,
 * so the module never leaks stores for unmounted Tabs.
 */
export function registerMember(reorderGroup: string, member: ReorderGroupMember): () => void {
  let store = groups.get(reorderGroup);
  if (!store) {
    store = new AsyncStore<ReorderGroupState>(createState());
    groups.set(reorderGroup, store);
  }
  const groupStore = store;
  groupStore.set(prev => ({
    ...prev,
    members: [...prev.members.filter(existing => existing.tabsId !== member.tabsId), member],
  }));

  return () => {
    groupStore.set(prev => {
      const members = prev.members.filter(existing => existing.tabsId !== member.tabsId);
      // Drop any in-progress drag that referenced the leaving member.
      const drag =
        prev.drag && (prev.drag.sourceTabsId === member.tabsId || prev.drag.targetTabsId === member.tabsId)
          ? null
          : prev.drag;
      return { members, drag };
    });
    if (groupStore.get().members.length === 0 && groups.get(reorderGroup) === groupStore) {
      groups.delete(reorderGroup);
    }
  };
}

export function setDragState(reorderGroup: string, drag: CrossListDragState | null): void {
  groups.get(reorderGroup)?.set(prev => ({ ...prev, drag }));
}

export function getDragState(reorderGroup: string): CrossListDragState | null {
  return groups.get(reorderGroup)?.get().drag ?? null;
}

/**
 * Commits a cross-list move: removes the tab from the source list and inserts it into the
 * target list at `desiredIndex` (pinned tabs stay locked). Fires `onTabMove` on both
 * instances (controlled — the app updates both `tabs` arrays), tells the source to select an
 * adjacent tab, announces the move on the target, and moves focus to the moved tab's drag
 * handle in the target once both lists have re-rendered. Returns the move detail, or `null`
 * when the move is a no-op (member missing or tab not found).
 */
export function commitCrossListMove(
  reorderGroup: string,
  {
    sourceTabsId,
    targetTabsId,
    movedTabId,
    desiredIndex,
  }: { sourceTabsId: string; targetTabsId: string; movedTabId: string; desiredIndex: number }
): TabsProps.TabMoveDetail | null {
  const members = getMembers(reorderGroup);
  const source = members.find(member => member.tabsId === sourceTabsId);
  const target = members.find(member => member.tabsId === targetTabsId);
  if (!source || !target || source.tabsId === target.tabsId) {
    return null;
  }
  const result = moveTabAcrossLists({
    sourceTabs: source.getTabs(),
    targetTabs: target.getTabs(),
    movedTabId,
    desiredIndex,
  });
  if (!result) {
    return null;
  }
  const detail: TabsProps.TabMoveDetail = {
    tabId: movedTabId,
    sourceGroupTabsId: sourceTabsId,
    targetGroupTabsId: targetTabsId,
    targetIndex: result.targetIndex,
    sourceTabIds: result.sourceTabs.map(tab => tab.id),
    targetTabIds: result.targetTabs.map(tab => tab.id),
  };
  fireNonCancelableEvent(source.getOnTabMove(), detail);
  fireNonCancelableEvent(target.getOnTabMove(), detail);
  source.selectAdjacentAfterRemoval(movedTabId, detail.sourceTabIds);
  target.announceReceived(detail.targetIndex + 1, detail.targetTabIds.length);
  // Focus the moved tab's drag handle in the target after both lists have re-rendered.
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => target.focusDragHandle(movedTabId));
  } else {
    target.focusDragHandle(movedTabId);
  }
  return detail;
}
