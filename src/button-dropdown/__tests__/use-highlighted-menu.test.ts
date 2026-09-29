// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../__tests__/render-hook';
import { ButtonDropdownProps } from '../interfaces';
import useHighlightedMenu from '../utils/use-highlighted-menu';
import { isItemGroup } from '../utils/utils';

const itemGroup1: ButtonDropdownProps.ItemGroup = {
  text: 'category1',
  items: [
    { id: 'i2', text: 'cat 1 item1' },
    { id: 'i3', text: 'cat 1 item2' },
  ],
};
const itemGroup2: ButtonDropdownProps.ItemGroup = {
  text: 'category2',
  items: [
    { id: 'i5', text: 'cat 2 item1' },
    { id: 'i6', text: 'cat 2 item2' },
  ],
};
const testItems: ButtonDropdownProps.Items = [
  { id: 'i0', text: 'item', disabled: true },
  { id: 'i1', text: 'item1' },
  itemGroup1,
  { id: 'i4', text: 'item4' },
  itemGroup2,
];
const testItems2: ButtonDropdownProps.Items = [
  { id: 'i1', text: 'item1' },
  { ...itemGroup1, disabled: true },
  { id: 'i4', text: 'item4' },
];

function render({
  items = testItems,
  hasExpandableGroups = false,
  isInRestrictedView = false,
  isExpandable,
}: {
  items?: ButtonDropdownProps.Items;
  hasExpandableGroups?: boolean;
  isInRestrictedView?: boolean;
  isExpandable?: (item: ButtonDropdownProps.ItemOrGroup) => boolean;
}) {
  const resolveExpandable =
    isExpandable ?? ((item: ButtonDropdownProps.ItemOrGroup) => hasExpandableGroups && isItemGroup(item));
  return renderHook(useHighlightedMenu, {
    initialProps: { items, isExpandable: resolveExpandable, isInRestrictedView },
  });
}

describe('use-highlighted-menu util', () => {
  test('highlights given item', () => {
    const { result } = render({});
    expect(result.current.targetItem).toBe(null);

    act(() => result.current.highlightItem(itemGroup1));
    expect(result.current.targetItem).toBe(itemGroup1);
  });

  test('checks if the item is highlighted', () => {
    const { result } = render({});

    act(() => result.current.highlightItem(itemGroup1.items[1]));
    expect(result.current.isHighlighted(itemGroup1)).toBe(true);
    expect(result.current.isHighlighted(itemGroup2)).toBe(false);
    expect(result.current.isHighlighted(itemGroup1.items[0])).toBe(false);
    expect(result.current.isHighlighted(itemGroup1.items[1])).toBe(true);
  });

  test('checks if the item is expanded', () => {
    const { result } = render({});

    act(() => result.current.expandGroup(itemGroup1));
    expect(result.current.isExpanded(itemGroup1)).toBe(true);
    expect(result.current.isExpanded(itemGroup2)).toBe(false);
  });

  test('moves highlight one step', () => {
    const { result } = render({});

    act(() => result.current.highlightItem(itemGroup1.items[0]));
    act(() => result.current.moveHighlight(1));
    expect(result.current.targetItem).toBe(itemGroup1.items[1]);
  });

  test('skips disabled nested groups', () => {
    const { result } = render({ items: testItems2 });
    act(() => result.current.highlightItem(testItems2[0]));
    act(() => result.current.moveHighlight(1));
    act(() => result.current.highlightItem(testItems2[2]));
  });

  test('expands current group', () => {
    const { result } = render({});

    act(() => result.current.highlightItem(itemGroup1));
    act(() => result.current.expandGroup());
    expect(result.current.targetItem).toBe(itemGroup1.items[0]);
  });

  test('expands given group', () => {
    const { result } = render({});

    act(() => result.current.expandGroup(itemGroup2));
    expect(result.current.targetItem).toBe(itemGroup2.items[0]);
  });

  test('expands given group but not the first children if restricted', () => {
    const { result } = render({ isInRestrictedView: true });

    act(() => result.current.expandGroup(itemGroup2));
    expect(result.current.targetItem).toBe(itemGroup2);
  });

  test('collapses current group', () => {
    const { result } = render({});

    act(() => result.current.expandGroup(itemGroup1));
    expect(result.current.targetItem).toBe(itemGroup1.items[0]);
    act(() => result.current.collapseGroup());
    expect(result.current.targetItem).toBe(itemGroup1);
  });

  test('resets state', () => {
    const { result } = render({});

    act(() => result.current.highlightItem(itemGroup1.items[1]));
    act(() => result.current.reset());
    expect(result.current.targetItem).toBe(null);
  });
});

const flatGroup: ButtonDropdownProps.ItemGroup = {
  text: 'flat category',
  items: [
    { id: 'f1', text: 'flat item 1' },
    { id: 'f2', text: 'flat item 2' },
  ],
};
const expandableGroup: ButtonDropdownProps.ItemGroup = {
  text: 'expandable category',
  items: [
    { id: 'e1', text: 'expandable item 1' },
    { id: 'e2', text: 'expandable item 2' },
  ],
};
const mixedItems: ButtonDropdownProps.Items = [
  { id: 'top1', text: 'top item 1' },
  flatGroup,
  expandableGroup,
  { id: 'top2', text: 'top item 2' },
];
const onlyExpandableGroupIsExpandable = (item: ButtonDropdownProps.ItemOrGroup) => item === expandableGroup;

describe('use-highlighted-menu util with mixed expandable and flat groups', () => {
  test('steps through a flat group inline and onto the next expandable header', () => {
    const { result } = render({ items: mixedItems, isExpandable: onlyExpandableGroupIsExpandable });

    act(() => result.current.highlightItem(mixedItems[0]));
    act(() => result.current.moveHighlight(1));
    expect(result.current.targetItem).toBe(flatGroup.items[0]);
    act(() => result.current.moveHighlight(1));
    expect(result.current.targetItem).toBe(flatGroup.items[1]);
    act(() => result.current.moveHighlight(1));
    expect(result.current.targetItem).toBe(expandableGroup);
  });

  test('skips the collapsed expandable group children and confines navigation once expanded', () => {
    const { result } = render({ items: mixedItems, isExpandable: onlyExpandableGroupIsExpandable });

    act(() => result.current.highlightItem(expandableGroup));
    act(() => result.current.moveHighlight(1));
    expect(result.current.targetItem).toBe(mixedItems[3]);

    act(() => result.current.expandGroup(expandableGroup));
    expect(result.current.targetItem).toBe(expandableGroup.items[0]);
    act(() => result.current.moveHighlight(1));
    expect(result.current.targetItem).toBe(expandableGroup.items[1]);
    act(() => result.current.moveHighlight(1));
    expect(result.current.targetItem).toBe(expandableGroup.items[1]);
  });
});
