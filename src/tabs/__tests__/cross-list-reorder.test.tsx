// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

import Tabs, { TabsProps } from '../../../lib/components/tabs';
import createWrapper, { TabsWrapper } from '../../../lib/components/test-utils/dom';

// jsdom cannot derive CSS `direction` from the `dir` attribute, so RTL is simulated by
// controlling the toolkit's `getIsRtl` probe — the same approach the repo already uses in
// responsive-text.test.tsx. The default return (false) matches real jsdom behaviour, so the
// LTR tests exercise the unmocked code path; only the explicit RTL test overrides it.
jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  getIsRtl: jest.fn().mockReturnValue(false),
}));

const i18n: TabsProps.I18nStrings = {
  reorderDragHandleAriaLabel: 'Drag handle',
  reorderDragHandleAriaDescription: 'Use arrow keys to reorder',
  liveAnnouncementTabMovedAcrossLists: (targetPosition, targetTotal) =>
    `Moved to position ${targetPosition} of ${targetTotal}`,
};

function tab(id: string, extra: Partial<TabsProps.Tab> = {}): TabsProps.Tab {
  return { id, label: id.toUpperCase(), content: `${id} content`, ...extra };
}

interface HarnessProps {
  leftInitial: Array<TabsProps.Tab>;
  rightInitial: Array<TabsProps.Tab>;
  leftGroup?: string;
  rightGroup?: string;
  leftActive?: string;
  rightActive?: string;
  onLeftMove?: (detail: TabsProps.TabMoveDetail) => void;
  onRightMove?: (detail: TabsProps.TabMoveDetail) => void;
}

/**
 * A controlled two-list consumer that mirrors the intended provider-less API: two
 * `reorderable` Tabs sharing a `reorderGroup`, each owning its own `tabs`/`activeTabId`
 * state. `onTabMove` fires on both instances with the same detail, so either handler can
 * reconcile BOTH lists from the ids carried in the detail (idempotent when called twice).
 */
function TwoLists({
  leftInitial,
  rightInitial,
  leftGroup = 'group',
  rightGroup = 'group',
  leftActive: leftActiveInitial = leftInitial[0]?.id,
  rightActive: rightActiveInitial = rightInitial[0]?.id,
  onLeftMove,
  onRightMove,
}: HarnessProps) {
  const byId = useMemo(() => {
    const map = new Map<string, TabsProps.Tab>();
    [...leftInitial, ...rightInitial].forEach(item => map.set(item.id, item));
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [left, setLeft] = useState(leftInitial);
  const [right, setRight] = useState(rightInitial);
  const [leftActive, setLeftActive] = useState(leftActiveInitial);
  const [rightActive, setRightActive] = useState(rightActiveInitial);

  const reconcile = (detail: TabsProps.TabMoveDetail) => {
    const rebuild = (ids: Array<string>) => ids.map(id => byId.get(id)!);
    const leftIds =
      detail.sourceGroupTabsId === 'left'
        ? detail.sourceTabIds
        : detail.targetGroupTabsId === 'left'
          ? detail.targetTabIds
          : null;
    const rightIds =
      detail.sourceGroupTabsId === 'right'
        ? detail.sourceTabIds
        : detail.targetGroupTabsId === 'right'
          ? detail.targetTabIds
          : null;
    if (leftIds) {
      setLeft(rebuild(leftIds));
    }
    if (rightIds) {
      setRight(rebuild(rightIds));
    }
  };

  return (
    <>
      <Tabs
        id="left"
        tabs={left}
        activeTabId={leftActive}
        reorderable={true}
        reorderGroup={leftGroup}
        i18nStrings={i18n}
        onChange={event => setLeftActive(event.detail.activeTabId)}
        onReorder={({ detail }) => setLeft(detail.tabIds.map(id => byId.get(id)!))}
        onTabMove={({ detail }) => {
          onLeftMove?.(detail);
          reconcile(detail);
        }}
      />
      <Tabs
        id="right"
        tabs={right}
        activeTabId={rightActive}
        reorderable={true}
        reorderGroup={rightGroup}
        i18nStrings={i18n}
        onChange={event => setRightActive(event.detail.activeTabId)}
        onReorder={({ detail }) => setRight(detail.tabIds.map(id => byId.get(id)!))}
        onTabMove={({ detail }) => {
          onRightMove?.(detail);
          reconcile(detail);
        }}
      />
    </>
  );
}

function renderTwoLists(props: HarnessProps) {
  const result = render(<TwoLists {...props} />);
  const [leftWrapper, rightWrapper] = createWrapper(result.container).findAllTabs();
  return { ...result, leftWrapper, rightWrapper };
}

function dragHandleButton(wrapper: TabsWrapper, tabId: string): HTMLElement {
  const handle = wrapper.findTabDragHandleByTabId(tabId);
  if (!handle) {
    throw new Error(`No drag handle rendered for tab "${tabId}"`);
  }
  const button = handle.getElement().querySelector<HTMLElement>('[role="button"]');
  if (!button) {
    throw new Error(`No interactive drag handle inside the handle span for "${tabId}"`);
  }
  return button;
}

function ctrlArrow(el: HTMLElement, key: 'ArrowLeft' | 'ArrowRight') {
  fireEvent.keyDown(el, { key, code: key, ctrlKey: true });
}

// The moved tab's drag handle is focused inside requestAnimationFrame, after both lists have
// re-rendered; wait a frame's worth of time so the handoff completes.
async function flushFrame() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 30));
  });
}

function tabIds(wrapper: TabsWrapper): Array<string> {
  return wrapper.findTabLinks().map(link => link.getElement().dataset.testid!);
}

describe('cross-list Tab reorder (provider-less, registry-coordinated)', () => {
  beforeEach(() => {
    jest.mocked(getIsRtl).mockReturnValue(false);
  });

  test('Ctrl+ArrowRight moves the tab from the left list into the start of the right list, firing onTabMove on both instances', () => {
    const onLeftMove = jest.fn();
    const onRightMove = jest.fn();
    const { leftWrapper, rightWrapper } = renderTwoLists({
      leftInitial: [tab('a'), tab('b'), tab('c')],
      rightInitial: [tab('x'), tab('y')],
      leftActive: 'c', // move a non-active tab, to isolate this from selection handoff
      onLeftMove,
      onRightMove,
    });

    ctrlArrow(dragHandleButton(leftWrapper, 'a'), 'ArrowRight');

    // onTabMove is a controlled event that fires on BOTH participating instances with the same detail.
    expect(onLeftMove).toHaveBeenCalledTimes(1);
    expect(onRightMove).toHaveBeenCalledTimes(1);
    const detail: TabsProps.TabMoveDetail = onLeftMove.mock.calls[0][0];
    expect(onRightMove.mock.calls[0][0]).toEqual(detail);
    expect(detail).toEqual({
      tabId: 'a',
      sourceGroupTabsId: 'left',
      targetGroupTabsId: 'right',
      targetIndex: 0,
      sourceTabIds: ['b', 'c'],
      targetTabIds: ['a', 'x', 'y'],
    });

    // Both controlled lists reflect the move.
    expect(tabIds(leftWrapper)).toEqual(['b', 'c']);
    expect(tabIds(rightWrapper)).toEqual(['a', 'x', 'y']);
  });

  test('hands focus to the moved tab’s drag handle in the target list', async () => {
    const { leftWrapper, rightWrapper } = renderTwoLists({
      leftInitial: [tab('a'), tab('b')],
      rightInitial: [tab('x')],
      leftActive: 'b',
    });

    ctrlArrow(dragHandleButton(leftWrapper, 'a'), 'ArrowRight');
    await flushFrame();

    expect(dragHandleButton(rightWrapper, 'a')).toHaveFocus();
  });

  test('selects an adjacent tab in the source list when its active tab is moved away', () => {
    const { leftWrapper } = renderTwoLists({
      leftInitial: [tab('a'), tab('b'), tab('c')],
      rightInitial: [tab('x')],
      leftActive: 'a', // the moved tab is the active one
    });

    ctrlArrow(dragHandleButton(leftWrapper, 'a'), 'ArrowRight');

    // Selection never lands on nothing: the source falls back to the next adjacent tab.
    expect(leftWrapper.findActiveTab()!.getElement().dataset.testid).toBe('b');
  });

  test('Ctrl+ArrowLeft moves a tab from the right list to the END of the left list', () => {
    const onLeftMove = jest.fn();
    const { leftWrapper, rightWrapper } = renderTwoLists({
      leftInitial: [tab('a'), tab('b')],
      rightInitial: [tab('x'), tab('y')],
      rightActive: 'y',
      onLeftMove,
    });

    ctrlArrow(dragHandleButton(rightWrapper, 'x'), 'ArrowLeft');

    const detail: TabsProps.TabMoveDetail = onLeftMove.mock.calls[0][0];
    expect(detail.sourceGroupTabsId).toBe('right');
    expect(detail.targetGroupTabsId).toBe('left');
    expect(detail.targetTabIds).toEqual(['a', 'b', 'x']); // entered at the far (inline-end) edge
    expect(detail.targetIndex).toBe(2);
    expect(tabIds(leftWrapper)).toEqual(['a', 'b', 'x']);
    expect(tabIds(rightWrapper)).toEqual(['y']);
  });

  test('re-locks a pinned tab in the target list so the moved tab lands after it', () => {
    const onRightMove = jest.fn();
    const { leftWrapper, rightWrapper } = renderTwoLists({
      leftInitial: [tab('a')],
      rightInitial: [tab('x', { disableReorder: true }), tab('y')],
      onRightMove,
    });

    ctrlArrow(dragHandleButton(leftWrapper, 'a'), 'ArrowRight');

    const detail: TabsProps.TabMoveDetail = onRightMove.mock.calls[0][0];
    // 'x' is pinned at index 0 and stays there; 'a' lands after it.
    expect(detail.targetTabIds).toEqual(['x', 'a', 'y']);
    expect(detail.targetIndex).toBe(1);
    expect(tabIds(rightWrapper)).toEqual(['x', 'a', 'y']);
  });

  test('plain ArrowRight without a modifier key does not cross lists', () => {
    const onLeftMove = jest.fn();
    const { leftWrapper } = renderTwoLists({
      leftInitial: [tab('a'), tab('b')],
      rightInitial: [tab('x')],
      onLeftMove,
    });

    fireEvent.keyDown(dragHandleButton(leftWrapper, 'a'), { key: 'ArrowRight', code: 'ArrowRight' });

    expect(onLeftMove).not.toHaveBeenCalled();
  });

  test('tabs in different reorder groups do not exchange', () => {
    const onLeftMove = jest.fn();
    const onRightMove = jest.fn();
    const { leftWrapper } = renderTwoLists({
      leftInitial: [tab('a'), tab('b')],
      rightInitial: [tab('x')],
      leftGroup: 'alpha',
      rightGroup: 'beta',
      onLeftMove,
      onRightMove,
    });

    ctrlArrow(dragHandleButton(leftWrapper, 'a'), 'ArrowRight');

    expect(onLeftMove).not.toHaveBeenCalled();
    expect(onRightMove).not.toHaveBeenCalled();
  });

  test('is RTL-aware: Ctrl+ArrowRight enters the sibling list at its inline-end', () => {
    jest.mocked(getIsRtl).mockReturnValue(true);
    const onRightMove = jest.fn();
    const { leftWrapper, rightWrapper } = renderTwoLists({
      leftInitial: [tab('a')],
      rightInitial: [tab('x'), tab('y')],
      onRightMove,
    });

    ctrlArrow(dragHandleButton(leftWrapper, 'a'), 'ArrowRight');

    // In RTL the near edge for a rightward move is the inline-end, so the tab lands at the end.
    const detail: TabsProps.TabMoveDetail = onRightMove.mock.calls[0][0];
    expect(detail.targetTabIds).toEqual(['x', 'y', 'a']);
    expect(detail.targetIndex).toBe(2);
    expect(tabIds(rightWrapper)).toEqual(['x', 'y', 'a']);
  });
});
