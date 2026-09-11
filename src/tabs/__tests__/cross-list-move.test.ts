// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { moveTabAcrossLists } from '../../../lib/components/tabs/cross-list-move';
import { TabsProps } from '../../../lib/components/tabs/interfaces';

function tabs(...ids: string[]): TabsProps.Tab[] {
  return ids.map(id => ({ id, label: id.toUpperCase() }));
}
function ids(list: readonly TabsProps.Tab[]): string[] {
  return list.map(tab => tab.id);
}

describe('moveTabAcrossLists', () => {
  test('returns null when the moved tab does not exist in the source', () => {
    expect(
      moveTabAcrossLists({ sourceTabs: tabs('a', 'b'), targetTabs: tabs('x'), movedTabId: 'zzz', desiredIndex: 0 })
    ).toBeNull();
  });

  test('moves a tab to the start of the target list', () => {
    const result = moveTabAcrossLists({
      sourceTabs: tabs('a', 'b', 'c'),
      targetTabs: tabs('x', 'y'),
      movedTabId: 'b',
      desiredIndex: 0,
    })!;
    expect(ids(result.sourceTabs)).toEqual(['a', 'c']);
    expect(ids(result.targetTabs)).toEqual(['b', 'x', 'y']);
    expect(result.targetIndex).toBe(0);
  });

  test('moves a tab to the middle of the target list', () => {
    const result = moveTabAcrossLists({
      sourceTabs: tabs('a', 'b', 'c'),
      targetTabs: tabs('x', 'y', 'z'),
      movedTabId: 'a',
      desiredIndex: 2,
    })!;
    expect(ids(result.sourceTabs)).toEqual(['b', 'c']);
    expect(ids(result.targetTabs)).toEqual(['x', 'y', 'a', 'z']);
    expect(result.targetIndex).toBe(2);
  });

  test('moves a tab to the end of the target list', () => {
    const result = moveTabAcrossLists({
      sourceTabs: tabs('a', 'b'),
      targetTabs: tabs('x', 'y'),
      movedTabId: 'a',
      desiredIndex: 99,
    })!;
    expect(ids(result.sourceTabs)).toEqual(['b']);
    expect(ids(result.targetTabs)).toEqual(['x', 'y', 'a']);
    expect(result.targetIndex).toBe(2);
  });

  test('preserves source order when removing from the middle', () => {
    const result = moveTabAcrossLists({
      sourceTabs: tabs('a', 'b', 'c', 'd'),
      targetTabs: tabs('x'),
      movedTabId: 'c',
      desiredIndex: 0,
    })!;
    expect(ids(result.sourceTabs)).toEqual(['a', 'b', 'd']);
  });

  test('locks a pinned tab at the start of the target so the moved tab lands after it', () => {
    const target: TabsProps.Tab[] = [
      { id: 'pin', label: 'PIN', disableReorder: true },
      { id: 'x', label: 'X' },
      { id: 'y', label: 'Y' },
    ];
    const result = moveTabAcrossLists({
      sourceTabs: tabs('a', 'b'),
      targetTabs: target,
      movedTabId: 'a',
      desiredIndex: 0, // tried to drop at the very start, but 'pin' is locked there
    })!;
    expect(ids(result.targetTabs)).toEqual(['pin', 'a', 'x', 'y']);
    expect(result.targetTabs[0].disableReorder).toBe(true);
    expect(result.targetIndex).toBe(1);
  });

  test('locks a pinned tab in the middle of the target', () => {
    const target: TabsProps.Tab[] = [
      { id: 'x', label: 'X' },
      { id: 'pin', label: 'PIN', disableReorder: true },
      { id: 'y', label: 'Y' },
    ];
    const result = moveTabAcrossLists({
      sourceTabs: tabs('a'),
      targetTabs: target,
      movedTabId: 'a',
      desiredIndex: 3, // drop at the end
    })!;
    // 'pin' must remain at index 1; the moved tab fills the last non-pinned slot.
    expect(ids(result.targetTabs)).toEqual(['x', 'pin', 'y', 'a']);
    expect(result.targetTabs[1].id).toBe('pin');
  });
});
