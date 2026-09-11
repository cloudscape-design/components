// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TabsProps } from '../../../lib/components/tabs/interfaces';
import {
  commitCrossListMove,
  getDragState,
  getGroupStore,
  getMembers,
  getSiblings,
  registerMember,
  ReorderGroupMember,
  setDragState,
} from '../../../lib/components/tabs/reorder-group-registry';

function tabs(...ids: string[]): TabsProps.Tab[] {
  return ids.map(id => ({ id, label: id.toUpperCase() }));
}

function makeMember(
  tabsId: string,
  tabList: TabsProps.Tab[],
  overrides: Partial<ReorderGroupMember> = {}
): ReorderGroupMember {
  return {
    tabsId,
    getTabs: () => tabList,
    getContainerRect: () => null,
    getDropIndex: () => 0,
    getOnTabMove: () => undefined,
    selectAdjacentAfterRemoval: () => {},
    focusDragHandle: () => {},
    announceReceived: () => {},
    ...overrides,
  };
}

describe('reorder-group-registry', () => {
  beforeEach(() => {
    // commitCrossListMove focuses the moved tab's handle inside requestAnimationFrame;
    // run it synchronously so the callback can be asserted.
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('registerMember creates the group store on first use and adds the member', () => {
    expect(getGroupStore('g-create')).toBeUndefined();

    const cleanup = registerMember('g-create', makeMember('t1', tabs('a', 'b')));

    expect(getGroupStore('g-create')).toBeDefined();
    expect(getMembers('g-create').map(member => member.tabsId)).toEqual(['t1']);

    cleanup();
  });

  test('deregistering the last member deletes the group store (no leak)', () => {
    const cleanup = registerMember('g-empty', makeMember('t1', tabs('a')));
    expect(getGroupStore('g-empty')).toBeDefined();

    cleanup();

    expect(getGroupStore('g-empty')).toBeUndefined();
    expect(getMembers('g-empty')).toEqual([]);
  });

  test('re-registering the same tabsId replaces (does not duplicate) the member', () => {
    const cleanup1 = registerMember('g-dup', makeMember('t1', tabs('a')));
    const cleanup2 = registerMember('g-dup', makeMember('t1', tabs('a', 'b')));

    expect(getMembers('g-dup').map(member => member.tabsId)).toEqual(['t1']);
    expect(
      getMembers('g-dup')[0]
        .getTabs()
        .map(tab => tab.id)
    ).toEqual(['a', 'b']);

    cleanup1();
    cleanup2();
  });

  test('two members in the same group share a single store; getSiblings excludes self', () => {
    const cleanup1 = registerMember('g-share', makeMember('left', tabs('a')));
    const store1 = getGroupStore('g-share');

    const cleanup2 = registerMember('g-share', makeMember('right', tabs('x')));
    const store2 = getGroupStore('g-share');

    expect(store1).toBe(store2);
    expect(getMembers('g-share').map(member => member.tabsId)).toEqual(['left', 'right']);
    expect(getSiblings('g-share', 'left').map(member => member.tabsId)).toEqual(['right']);
    expect(getSiblings('g-share', 'right').map(member => member.tabsId)).toEqual(['left']);

    // The group survives while one member remains, then is cleaned up.
    cleanup1();
    expect(getGroupStore('g-share')).toBeDefined();
    expect(getMembers('g-share').map(member => member.tabsId)).toEqual(['right']);

    cleanup2();
    expect(getGroupStore('g-share')).toBeUndefined();
  });

  test('setDragState / getDragState round-trip', () => {
    const cleanup1 = registerMember('g-drag', makeMember('left', tabs('a')));
    const cleanup2 = registerMember('g-drag', makeMember('right', tabs('x')));

    expect(getDragState('g-drag')).toBeNull();
    setDragState('g-drag', { sourceTabsId: 'left', draggedTabId: 'a', targetTabsId: 'right', targetIndex: 0 });
    expect(getDragState('g-drag')).toEqual({
      sourceTabsId: 'left',
      draggedTabId: 'a',
      targetTabsId: 'right',
      targetIndex: 0,
    });

    cleanup1();
    cleanup2();
  });

  test('deregistering a member referenced by an in-progress drag clears the drag state', () => {
    const cleanup1 = registerMember('g-drag-clear', makeMember('left', tabs('a')));
    const cleanup2 = registerMember('g-drag-clear', makeMember('right', tabs('x')));
    setDragState('g-drag-clear', { sourceTabsId: 'left', draggedTabId: 'a', targetTabsId: 'right', targetIndex: 0 });

    cleanup2(); // the drag target leaves mid-drag

    expect(getDragState('g-drag-clear')).toBeNull();
    cleanup1();
  });

  test('commitCrossListMove moves the tab, returns the detail, and fires source + target callbacks', () => {
    const onTabMoveSource = jest.fn();
    const onTabMoveTarget = jest.fn();
    const selectAdjacent = jest.fn();
    const focusHandle = jest.fn();
    const announce = jest.fn();

    const cleanup1 = registerMember(
      'g-commit',
      makeMember('src', tabs('a', 'b', 'c'), {
        getOnTabMove: () => onTabMoveSource,
        selectAdjacentAfterRemoval: selectAdjacent,
      })
    );
    const cleanup2 = registerMember(
      'g-commit',
      makeMember('dst', tabs('x', 'y'), {
        getOnTabMove: () => onTabMoveTarget,
        focusDragHandle: focusHandle,
        announceReceived: announce,
      })
    );

    const detail = commitCrossListMove('g-commit', {
      sourceTabsId: 'src',
      targetTabsId: 'dst',
      movedTabId: 'b',
      desiredIndex: 1,
    });

    expect(detail).not.toBeNull();
    expect(detail!.tabId).toBe('b');
    expect(detail!.sourceGroupTabsId).toBe('src');
    expect(detail!.targetGroupTabsId).toBe('dst');
    expect(detail!.sourceTabIds).toEqual(['a', 'c']);
    expect(detail!.targetTabIds).toEqual(['x', 'b', 'y']);
    expect(detail!.targetIndex).toBe(1);

    // onTabMove fires on BOTH instances with the same detail (controlled: consumer updates both lists).
    expect(onTabMoveSource).toHaveBeenCalledTimes(1);
    expect(onTabMoveTarget).toHaveBeenCalledTimes(1);
    expect(onTabMoveSource.mock.calls[0][0].detail).toEqual(detail);
    expect(onTabMoveTarget.mock.calls[0][0].detail).toEqual(detail);

    // Source selects an adjacent tab; target announces + focuses the moved tab's handle.
    expect(selectAdjacent).toHaveBeenCalledWith('b', ['a', 'c']);
    expect(announce).toHaveBeenCalledWith(2, 3); // targetIndex + 1, targetTotal
    expect(focusHandle).toHaveBeenCalledWith('b');

    cleanup1();
    cleanup2();
  });

  test('commitCrossListMove re-locks pinned tabs in the target list', () => {
    const target: TabsProps.Tab[] = [
      { id: 'x', label: 'X', disableReorder: true },
      { id: 'y', label: 'Y' },
    ];
    const cleanup1 = registerMember('g-pinned', makeMember('src', tabs('a', 'b')));
    const cleanup2 = registerMember('g-pinned', makeMember('dst', target));

    // Try to drop at index 0 — the pinned "x" must stay at index 0, so "a" lands at index 1.
    const detail = commitCrossListMove('g-pinned', {
      sourceTabsId: 'src',
      targetTabsId: 'dst',
      movedTabId: 'a',
      desiredIndex: 0,
    });

    expect(detail!.targetTabIds).toEqual(['x', 'a', 'y']);
    expect(detail!.targetIndex).toBe(1);

    cleanup1();
    cleanup2();
  });

  test('commitCrossListMove returns null when a member or tab is missing (no-op)', () => {
    const cleanup1 = registerMember('g-missing', makeMember('src', tabs('a')));

    // Unknown target member.
    expect(
      commitCrossListMove('g-missing', { sourceTabsId: 'src', targetTabsId: 'nope', movedTabId: 'a', desiredIndex: 0 })
    ).toBeNull();

    const cleanup2 = registerMember('g-missing', makeMember('dst', tabs('x')));
    // Moved tab not present in the source.
    expect(
      commitCrossListMove('g-missing', { sourceTabsId: 'src', targetTabsId: 'dst', movedTabId: 'zzz', desiredIndex: 0 })
    ).toBeNull();

    cleanup1();
    cleanup2();
  });
});
