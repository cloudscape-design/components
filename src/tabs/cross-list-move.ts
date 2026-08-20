// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TabsProps } from './interfaces';

export interface CrossListMoveResult {
  /** Source list after the moved tab has been removed. */
  sourceTabs: TabsProps.Tab[];
  /** Target list after the moved tab has been inserted (pinned tabs stay locked). */
  targetTabs: TabsProps.Tab[];
  /** Final index of the moved tab inside `targetTabs`. */
  targetIndex: number;
}

/**
 * Rebuilds `sequence` so that every pinned (`disableReorder`) tab from `originalTarget`
 * is restored to its original absolute index, while all non-pinned tabs (including a
 * newly inserted one) fill the remaining slots in their current relative order.
 *
 * This is the cross-list analogue of `reorderWithPinnedLocked`, but the resulting array
 * may be one item longer than `originalTarget` because a tab was inserted.
 */
function relockPinned(originalTarget: readonly TabsProps.Tab[], sequence: readonly TabsProps.Tab[]): TabsProps.Tab[] {
  const pinnedByIndex = new Map<number, TabsProps.Tab>();
  originalTarget.forEach((tab, index) => {
    if (tab.disableReorder) {
      pinnedByIndex.set(index, tab);
    }
  });
  if (pinnedByIndex.size === 0) {
    return [...sequence];
  }
  const pinnedIds = new Set<string>();
  pinnedByIndex.forEach(tab => pinnedIds.add(tab.id));
  const nonPinnedSequence = sequence.filter(tab => !pinnedIds.has(tab.id));

  const result: TabsProps.Tab[] = new Array(sequence.length);
  let cursor = 0;
  for (let i = 0; i < result.length; i++) {
    const pinned = pinnedByIndex.get(i);
    if (pinned) {
      result[i] = pinned;
    } else {
      result[i] = nonPinnedSequence[cursor++];
    }
  }
  return result;
}

/**
 * Moves a tab from a source list into a target list at a desired insertion index.
 *
 * - The moved tab is removed from `sourceTabs` (pinned tabs are never draggable, so the
 *   moved tab is always non-pinned; source pinned tabs keep their positions).
 * - The moved tab is inserted into `targetTabs` at `desiredIndex`, then pinned tabs in the
 *   target are re-locked to their original indices so a pinned tab is never displaced and
 *   never acts as a drop slot.
 *
 * Both lists are returned as new arrays; the caller (a controlled consumer) updates the
 * corresponding `tabs` props. Returns `null` when the move is a no-op (moved tab not found).
 */
export function moveTabAcrossLists({
  sourceTabs,
  targetTabs,
  movedTabId,
  desiredIndex,
}: {
  sourceTabs: readonly TabsProps.Tab[];
  targetTabs: readonly TabsProps.Tab[];
  movedTabId: string;
  desiredIndex: number;
}): CrossListMoveResult | null {
  const movedTab = sourceTabs.find(tab => tab.id === movedTabId);
  if (!movedTab) {
    return null;
  }

  const sourceTabsAfter = sourceTabs.filter(tab => tab.id !== movedTabId);

  const clampedIndex = Math.max(0, Math.min(desiredIndex, targetTabs.length));
  const naiveInsertion = [...targetTabs.slice(0, clampedIndex), movedTab, ...targetTabs.slice(clampedIndex)];
  const targetTabsAfter = relockPinned(targetTabs, naiveInsertion);

  return {
    sourceTabs: sourceTabsAfter,
    targetTabs: targetTabsAfter,
    targetIndex: targetTabsAfter.findIndex(tab => tab.id === movedTabId),
  };
}
