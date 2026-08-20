// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

import { SortableAreaProps } from '../internal/components/sortable-area';
import { TabsProps } from './interfaces';
import {
  commitCrossListMove,
  getDragState,
  getGroupStore,
  getMembers,
  getSiblings,
  registerMember,
  ReorderGroupMember,
  setDragState,
} from './reorder-group-registry';

interface UseCrossListReorderProps {
  reorderable: boolean;
  reorderGroup: string | undefined;
  tabsId: string;
  containerRef: React.RefObject<HTMLElement>;
  tabRefs: React.MutableRefObject<Map<string, HTMLElement>>;
  tabs: readonly TabsProps.Tab[];
  onTabMove: TabsProps['onTabMove'];
  /** Reused from tab-header-bar: after a tab leaves this (source) list, select an adjacent one. */
  selectAdjacentAfterRemoval: (removedTabId: string, remainingTabIds: string[]) => void;
  /** Reused from tab-header-bar: move focus to a tab's drag handle (target list after a move). */
  focusTabDragHandle: (tabId: string) => void;
  /** i18n-resolved cross-list announcement formatter. */
  formatMovedAcrossLists: (targetPosition: number, targetTotal: number) => string | undefined;
}

export interface UseCrossListReorderResult {
  /** Whether cross-list reordering is enabled for this instance (`reorderable` + a `reorderGroup`). */
  active: boolean;
  /** Inline-start offset (px, within the tab header scroll container) of the drop indicator, or null. */
  dropIndicatorOffset: number | null;
  /** Latest cross-list live-region message for screen readers. */
  liveMessage: string;
  onReorderStart: (draggedTabId: string) => void;
  onReorderMove: (draggedTabId: string, rect: SortableAreaProps.DragRect | null) => void;
  onReorderEnd: (draggedTabId: string) => boolean;
  onReorderCancel: () => void;
  /** Ctrl/Cmd+ArrowLeft/Right handler for a tab's drag handle (cross-list keyboard transfer). */
  handleDragHandleKeyDown: (tabId: string, event: React.KeyboardEvent) => void;
}

/**
 * Provider-less cross-list reordering for `Tabs`. Every `reorderable` Tabs that sets a
 * matching `reorderGroup` registers with a module-level registry; each keeps its own
 * `DndContext`. Pointer drags are coordinated by hit-testing the dragged rect against
 * sibling lists' rects (the source owns the drag; the target renders a drop indicator).
 * Keyboard transfer uses Ctrl/Cmd+Arrow to send the focused tab to the adjacent sibling.
 */
export default function useCrossListReorder({
  reorderable,
  reorderGroup,
  tabsId,
  containerRef,
  tabRefs,
  tabs,
  onTabMove,
  selectAdjacentAfterRemoval,
  focusTabDragHandle,
  formatMovedAcrossLists,
}: UseCrossListReorderProps): UseCrossListReorderResult {
  const active = reorderable && !!reorderGroup;

  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dropIndicatorOffset, setDropIndicatorOffset] = useState<number | null>(null);
  const [liveMessage, setLiveMessage] = useState('');

  // Keep the latest props/callbacks available to the (stably-registered) member without
  // re-registering on every render.
  const latest = useRef({
    active,
    reorderGroup,
    tabs,
    onTabMove,
    selectAdjacentAfterRemoval,
    focusTabDragHandle,
    formatMovedAcrossLists,
  });
  latest.current = {
    active,
    reorderGroup,
    tabs,
    onTabMove,
    selectAdjacentAfterRemoval,
    focusTabDragHandle,
    formatMovedAcrossLists,
  };

  const computeDropIndex = useCallback(
    (clientX: number): number => {
      const currentTabs = latest.current.tabs;
      const rtl = getIsRtl(containerRef.current);
      for (let i = 0; i < currentTabs.length; i++) {
        const el = tabRefs.current.get(currentTabs[i].id);
        if (!el) {
          continue;
        }
        const rect = el.getBoundingClientRect();
        const midpoint = rect.left + rect.width / 2;
        if (rtl ? clientX > midpoint : clientX < midpoint) {
          return i;
        }
      }
      return currentTabs.length;
    },
    [containerRef, tabRefs]
  );

  // Register this instance with its group and subscribe to cross-list drag state so it can
  // render a drop indicator when it is the current drop target.
  useEffect(() => {
    if (!active || !reorderGroup) {
      return;
    }
    const member: ReorderGroupMember = {
      tabsId,
      getTabs: () => latest.current.tabs,
      getContainerRect: () => containerRef.current?.getBoundingClientRect() ?? null,
      getDropIndex: computeDropIndex,
      getOnTabMove: () => latest.current.onTabMove,
      selectAdjacentAfterRemoval: (removedTabId, remainingTabIds) =>
        latest.current.selectAdjacentAfterRemoval(removedTabId, remainingTabIds),
      focusDragHandle: tabId => latest.current.focusTabDragHandle(tabId),
      announceReceived: (targetPosition, targetTotal) => {
        const message = latest.current.formatMovedAcrossLists(targetPosition, targetTotal);
        if (message) {
          setLiveMessage(message);
        }
      },
    };
    const deregister = registerMember(reorderGroup, member);
    const store = getGroupStore(reorderGroup)!;
    const unsubscribe = store.subscribe(
      state => (state.drag && state.drag.targetTabsId === tabsId ? state.drag.targetIndex : null),
      state => setDropTargetIndex(state.drag && state.drag.targetTabsId === tabsId ? state.drag.targetIndex : null)
    );
    return () => {
      unsubscribe();
      deregister();
      setDropTargetIndex(null);
    };
  }, [active, reorderGroup, tabsId, containerRef, computeDropIndex]);

  // Convert the target slot index into a pixel offset for the drop indicator.
  useEffect(() => {
    if (dropTargetIndex === null || !containerRef.current) {
      setDropIndicatorOffset(null);
      return;
    }
    const currentTabs = latest.current.tabs;
    const containerRect = containerRef.current.getBoundingClientRect();
    const rtl = getIsRtl(containerRef.current);
    let offset = 0;
    if (dropTargetIndex >= currentTabs.length) {
      const lastTab = currentTabs[currentTabs.length - 1];
      const el = lastTab ? tabRefs.current.get(lastTab.id) : undefined;
      if (el) {
        const rect = el.getBoundingClientRect();
        offset = (rtl ? rect.left : rect.right) - containerRect.left;
      }
    } else {
      const el = tabRefs.current.get(currentTabs[dropTargetIndex].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        offset = (rtl ? rect.right : rect.left) - containerRect.left;
      }
    }
    setDropIndicatorOffset(offset);
  }, [dropTargetIndex, containerRef, tabRefs]);

  const onReorderStart = useCallback(
    (draggedTabId: string) => {
      const group = latest.current.reorderGroup;
      if (!latest.current.active || !group) {
        return;
      }
      setDragState(group, { sourceTabsId: tabsId, draggedTabId, targetTabsId: null, targetIndex: null });
    },
    [tabsId]
  );

  const onReorderMove = useCallback(
    (draggedTabId: string, rect: SortableAreaProps.DragRect | null) => {
      const group = latest.current.reorderGroup;
      if (!latest.current.active || !group || !rect) {
        return;
      }
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      let targetTabsId: string | null = null;
      let targetIndex: number | null = null;
      for (const sibling of getSiblings(group, tabsId)) {
        const siblingRect = sibling.getContainerRect();
        if (
          siblingRect &&
          centerX >= siblingRect.left &&
          centerX <= siblingRect.right &&
          centerY >= siblingRect.top &&
          centerY <= siblingRect.bottom
        ) {
          targetTabsId = sibling.tabsId;
          targetIndex = sibling.getDropIndex(centerX);
          break;
        }
      }
      setDragState(group, { sourceTabsId: tabsId, draggedTabId, targetTabsId, targetIndex });
    },
    [tabsId]
  );

  const onReorderEnd = useCallback(
    (draggedTabId: string): boolean => {
      const group = latest.current.reorderGroup;
      if (!latest.current.active || !group) {
        return false;
      }
      const drag = getDragState(group);
      let consumed = false;
      if (drag && drag.targetTabsId && drag.targetTabsId !== tabsId && drag.targetIndex !== null) {
        commitCrossListMove(group, {
          sourceTabsId: tabsId,
          targetTabsId: drag.targetTabsId,
          movedTabId: draggedTabId,
          desiredIndex: drag.targetIndex,
        });
        consumed = true;
      }
      setDragState(group, null);
      return consumed;
    },
    [tabsId]
  );

  const onReorderCancel = useCallback(() => {
    const group = latest.current.reorderGroup;
    if (group) {
      setDragState(group, null);
    }
  }, []);

  const handleDragHandleKeyDown = useCallback(
    (tabId: string, event: React.KeyboardEvent) => {
      const group = latest.current.reorderGroup;
      if (!latest.current.active || !group) {
        return;
      }
      if (!(event.ctrlKey || event.metaKey) || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) {
        return;
      }
      const ordered = getOrderedMembers(group);
      const myIndex = ordered.findIndex(member => member.tabsId === tabsId);
      if (myIndex === -1) {
        return;
      }
      const movingRight = event.key === 'ArrowRight';
      const target = ordered[movingRight ? myIndex + 1 : myIndex - 1];
      if (!target) {
        return;
      }
      // Consume the event so @dnd-kit's within-list keyboard handler does not also react.
      event.preventDefault();
      event.stopPropagation();
      const rtl = getIsRtl(containerRef.current);
      // Enter the target list at the edge nearest the source list.
      const nearEdgeIsStart = movingRight ? !rtl : rtl;
      const desiredIndex = nearEdgeIsStart ? 0 : target.getTabs().length;
      commitCrossListMove(group, {
        sourceTabsId: tabsId,
        targetTabsId: target.tabsId,
        movedTabId: tabId,
        desiredIndex,
      });
    },
    [tabsId, containerRef]
  );

  return {
    active,
    dropIndicatorOffset,
    liveMessage,
    onReorderStart,
    onReorderMove,
    onReorderEnd,
    onReorderCancel,
    handleDragHandleKeyDown,
  };
}

/**
 * Members ordered left-to-right: by tab-list container x when real layout is available,
 * otherwise by registration order (which matches mount/DOM order — used in jsdom, where
 * `getBoundingClientRect` returns zeroed rects).
 */
function getOrderedMembers(reorderGroup: string): ReorderGroupMember[] {
  const members = [...getMembers(reorderGroup)];
  const rects = members.map(member => member.getContainerRect());
  const positioned = rects.length > 0 && rects.every(rect => rect !== null && (rect.width > 0 || rect.left !== 0));
  if (positioned) {
    return members.sort((a, b) => a.getContainerRect()!.left - b.getContainerRect()!.left);
  }
  return members;
}
