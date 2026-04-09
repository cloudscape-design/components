// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

jest.mock('../styles.css.js', () => ({}), { virtual: true });

import { act, renderHook } from '../../__tests__/render-hook';
import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { useMenuItems, useMenuLoadMore } from '../core/menu-state';
import { PromptInputProps } from '../interfaces';

function makeOption(value: string, overrides?: Partial<OptionDefinition>): OptionDefinition {
  return { value, label: value, ...overrides };
}

function makeGroup(label: string, children: OptionDefinition[], disabled?: boolean): OptionGroup {
  return { label, options: children, ...(disabled !== undefined && { disabled }) };
}

function makeMenu(
  options: (OptionDefinition | OptionGroup)[],
  overrides?: Partial<PromptInputProps.MenuDefinition>
): PromptInputProps.MenuDefinition {
  return { id: 'test-menu', trigger: '@', options: options as OptionDefinition[], ...overrides };
}

describe('isMenuItemHighlightable (via useMenuItems)', () => {
  test('parent items are not highlightable — keyboard skips them', () => {
    const group = makeGroup('Group', [makeOption('child')]);
    const menu = makeMenu([group]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    // First item is the parent group header
    expect(state.items[0].type).toBe('parent');
    expect(state.items[1].type).toBe('child');

    // Moving highlight down should skip the parent and land on the child
    act(() => {
      result.current[1].moveHighlightWithKeyboard(1);
    });

    const [updatedState] = result.current;
    expect(updatedState.highlightedOption?.type).toBe('child');
    expect(updatedState.highlightedIndex).toBe(1);
  });

  test('regular (non-parent) items are highlightable', () => {
    const menu = makeMenu([makeOption('opt1'), makeOption('opt2')]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    act(() => {
      result.current[1].moveHighlightWithKeyboard(1);
    });

    expect(result.current[0].highlightedOption?.value).toBe('opt1');
  });
});

describe('isMenuItemInteractive (via useMenuItems)', () => {
  test('disabled items are not interactive — keyboard select returns false', () => {
    const menu = makeMenu([makeOption('disabled-opt', { disabled: true }), makeOption('enabled-opt')]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    // Highlight the disabled item
    act(() => {
      result.current[1].moveHighlightWithKeyboard(1);
    });

    // The disabled item is highlightable but not interactive
    expect(result.current[0].highlightedOption?.value).toBe('disabled-opt');

    let selected: boolean = false;
    act(() => {
      selected = result.current[1].selectHighlightedOptionWithKeyboard();
    });

    expect(selected).toBe(false);
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('enabled items are interactive — keyboard select returns true', () => {
    const menu = makeMenu([makeOption('opt1')]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    act(() => {
      result.current[1].moveHighlightWithKeyboard(1);
    });

    let selected: boolean = false;
    act(() => {
      selected = result.current[1].selectHighlightedOptionWithKeyboard();
    });

    expect(selected).toBe(true);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'opt1' }));
  });
});

describe('createItems (via useMenuItems)', () => {
  test('flat options produce items with no type and correct option reference', () => {
    const options = [makeOption('a'), makeOption('b')];
    const menu = makeMenu(options);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    expect(state.items).toHaveLength(2);
    expect(state.items[0].type).toBeUndefined();
    expect(state.items[0].option).toEqual(options[0]);
    expect(state.items[1].option).toEqual(options[1]);
  });

  test('grouped options produce parent + child items', () => {
    const child1 = makeOption('c1');
    const child2 = makeOption('c2');
    const group = makeGroup('G1', [child1, child2]);
    const menu = makeMenu([group]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    // parent + 2 children
    expect(state.items).toHaveLength(3);
    expect(state.items[0].type).toBe('parent');
    expect(state.items[1].type).toBe('child');
    expect(state.items[2].type).toBe('child');
  });

  test('getItemGroup returns the parent group for child items', () => {
    const child = makeOption('c1');
    const group = makeGroup('G1', [child]);
    const menu = makeMenu([group]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    const childItem = state.items[1];
    const parentGroup = state.getItemGroup(childItem);
    expect(parentGroup).toBeDefined();
    expect(parentGroup!.label).toBe('G1');
  });

  test('getItemGroup returns undefined for flat items', () => {
    const menu = makeMenu([makeOption('flat')]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    expect(state.getItemGroup(state.items[0])).toBeUndefined();
  });

  test('child inherits disabled from parent group', () => {
    const child = makeOption('c1');
    const group = makeGroup('G1', [child], true);
    const menu = makeMenu([group]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    expect(state.items[1].disabled).toBe(true);
  });

  test('parent is marked disabled when all children are disabled', () => {
    const child1 = makeOption('c1', { disabled: true });
    const child2 = makeOption('c2', { disabled: true });
    const group = makeGroup('G1', [child1, child2]);
    const menu = makeMenu([group]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    expect(state.items[0].disabled).toBe(true);
  });

  test('parent is not marked disabled when at least one child is enabled', () => {
    const child1 = makeOption('c1', { disabled: true });
    const child2 = makeOption('c2');
    const group = makeGroup('G1', [child1, child2]);
    const menu = makeMenu([group]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    expect(state.items[0].disabled).not.toBe(true);
  });

  test('mixed flat and grouped options', () => {
    const flat = makeOption('flat');
    const child = makeOption('c1');
    const group = makeGroup('G1', [child]);
    const menu = makeMenu([flat, group]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    // flat + parent + child
    expect(state.items).toHaveLength(3);
    expect(state.items[0].type).toBeUndefined();
    expect(state.items[1].type).toBe('parent');
    expect(state.items[2].type).toBe('child');
  });
});

describe('isGroup (via useMenuItems)', () => {
  test('option with options property is treated as a group', () => {
    const group: OptionGroup = { label: 'G', options: [makeOption('c')] };
    const menu = makeMenu([group]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    expect(state.items[0].type).toBe('parent');
  });

  test('option without options property is treated as flat', () => {
    const menu = makeMenu([makeOption('flat')]);
    const onSelect = jest.fn();

    const { result } = renderHook(useMenuItems, {
      initialProps: { menu, filterText: '', onSelectItem: onSelect },
    });

    const [state] = result.current;
    expect(state.items[0].type).toBeUndefined();
  });
});

describe('useMenuItems handlers', () => {
  describe('selectHighlightedOptionWithKeyboard', () => {
    test('returns false when nothing is highlighted', () => {
      const menu = makeMenu([makeOption('opt1')]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      let selected: boolean = false;
      act(() => {
        selected = result.current[1].selectHighlightedOptionWithKeyboard();
      });

      expect(selected).toBe(false);
      expect(onSelect).not.toHaveBeenCalled();
    });

    test('returns true and calls onSelectItem when a valid option is highlighted', () => {
      const menu = makeMenu([makeOption('opt1'), makeOption('opt2')]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      // Highlight first option
      act(() => {
        result.current[1].moveHighlightWithKeyboard(1);
      });

      let selected: boolean = false;
      act(() => {
        selected = result.current[1].selectHighlightedOptionWithKeyboard();
      });

      expect(selected).toBe(true);
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'opt1' }));
    });

    test('returns false for disabled highlighted option', () => {
      const menu = makeMenu([makeOption('d', { disabled: true })]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].moveHighlightWithKeyboard(1);
      });

      let selected: boolean = false;
      act(() => {
        selected = result.current[1].selectHighlightedOptionWithKeyboard();
      });

      expect(selected).toBe(false);
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('highlightVisibleOptionWithMouse', () => {
    test('highlights a valid non-parent item by index', () => {
      const menu = makeMenu([makeOption('opt1'), makeOption('opt2')]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].highlightVisibleOptionWithMouse(1);
      });

      expect(result.current[0].highlightedIndex).toBe(1);
    });

    test('does not highlight a parent item', () => {
      const group = makeGroup('G', [makeOption('c')]);
      const menu = makeMenu([group]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].highlightVisibleOptionWithMouse(0); // parent
      });

      // Should remain at default (-1) since parent is not highlightable
      expect(result.current[0].highlightedIndex).toBe(-1);
    });

    test('does nothing for out-of-bounds index', () => {
      const menu = makeMenu([makeOption('opt1')]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].highlightVisibleOptionWithMouse(99);
      });

      expect(result.current[0].highlightedIndex).toBe(-1);
    });

    test('does nothing for negative index', () => {
      const menu = makeMenu([makeOption('opt1')]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].highlightVisibleOptionWithMouse(-1);
      });

      expect(result.current[0].highlightedIndex).toBe(-1);
    });
  });

  describe('selectVisibleOptionWithMouse', () => {
    test('selects a valid enabled item by index', () => {
      const menu = makeMenu([makeOption('opt1'), makeOption('opt2')]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].selectVisibleOptionWithMouse(0);
      });

      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'opt1' }));
    });

    test('does not select a disabled item', () => {
      const menu = makeMenu([makeOption('d', { disabled: true })]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].selectVisibleOptionWithMouse(0);
      });

      expect(onSelect).not.toHaveBeenCalled();
    });

    test('does not select a parent item', () => {
      const group = makeGroup('G', [makeOption('c')]);
      const menu = makeMenu([group]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].selectVisibleOptionWithMouse(0); // parent
      });

      expect(onSelect).not.toHaveBeenCalled();
    });

    test('does nothing for out-of-bounds index', () => {
      const menu = makeMenu([makeOption('opt1')]);
      const onSelect = jest.fn();

      const { result } = renderHook(useMenuItems, {
        initialProps: { menu, filterText: '', onSelectItem: onSelect },
      });

      act(() => {
        result.current[1].selectVisibleOptionWithMouse(99);
      });

      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});

describe('useMenuLoadMore', () => {
  const baseMenu = makeMenu([makeOption('opt1')]);

  describe('fireLoadMoreOnScroll', () => {
    test('calls onLoadItems when options exist and statusType is pending', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'pending' as const, onLoadItems },
      });

      act(() => {
        result.current.fireLoadMoreOnScroll();
      });

      expect(onLoadItems).toHaveBeenCalledWith({
        menuId: 'test-menu',
        filteringText: '',
        firstPage: false,
        samePage: false,
      });
    });

    test('calls onLoadMoreItems instead of onLoadItems when provided', () => {
      const onLoadItems = jest.fn();
      const onLoadMoreItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'pending' as const, onLoadItems, onLoadMoreItems },
      });

      act(() => {
        result.current.fireLoadMoreOnScroll();
      });

      expect(onLoadMoreItems).toHaveBeenCalledTimes(1);
      expect(onLoadItems).not.toHaveBeenCalled();
    });

    test('does nothing when statusType is not pending', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'finished' as const, onLoadItems },
      });

      act(() => {
        result.current.fireLoadMoreOnScroll();
      });

      expect(onLoadItems).not.toHaveBeenCalled();
    });

    test('does nothing when options are empty', () => {
      const emptyMenu = makeMenu([]);
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: emptyMenu, statusType: 'pending' as const, onLoadItems },
      });

      act(() => {
        result.current.fireLoadMoreOnScroll();
      });

      expect(onLoadItems).not.toHaveBeenCalled();
    });
  });

  describe('fireLoadMoreOnRecoveryClick', () => {
    test('calls onLoadItems with samePage=true, firstPage=false', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'error' as const, onLoadItems },
      });

      act(() => {
        result.current.fireLoadMoreOnRecoveryClick();
      });

      expect(onLoadItems).toHaveBeenCalledWith({
        menuId: 'test-menu',
        filteringText: '',
        firstPage: false,
        samePage: true,
      });
    });
  });

  describe('fireLoadMoreOnMenuOpen', () => {
    test('stores filteringText for subsequent undefined-filteringText calls', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'pending' as const, onLoadItems },
      });

      // fireLoadMoreOnMenuOpen passes lastFilteringText.current ?? '' as filteringText.
      // Since lastFilteringText starts as null, it passes ''.
      // The fireLoadMore logic updates the ref but does not call onLoadItems
      // when filteringText is defined (dedup behavior).
      act(() => {
        result.current.fireLoadMoreOnMenuOpen();
      });

      // onLoadItems is not called because filteringText is defined and equals the updated ref
      expect(onLoadItems).not.toHaveBeenCalled();

      // But a subsequent scroll (undefined filteringText) uses the stored value
      act(() => {
        result.current.fireLoadMoreOnRecoveryClick();
      });

      expect(onLoadItems).toHaveBeenCalledWith({
        menuId: 'test-menu',
        filteringText: '',
        firstPage: false,
        samePage: true,
      });
    });
  });

  describe('fireLoadMoreOnInputChange', () => {
    test('stores filteringText in ref for subsequent calls', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'pending' as const, onLoadItems },
      });

      // fireLoadMoreOnInputChange passes a defined filteringText.
      // fireLoadMore updates the ref but does not call onLoadItems (dedup).
      act(() => {
        result.current.fireLoadMoreOnInputChange('search');
      });

      expect(onLoadItems).not.toHaveBeenCalled();

      // A subsequent recovery click (undefined filteringText) uses the stored text
      act(() => {
        result.current.fireLoadMoreOnRecoveryClick();
      });

      expect(onLoadItems).toHaveBeenCalledWith({
        menuId: 'test-menu',
        filteringText: 'search',
        firstPage: false,
        samePage: true,
      });
    });

    test('updates lastFilteringText when text changes', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'pending' as const, onLoadItems },
      });

      act(() => {
        result.current.fireLoadMoreOnInputChange('first');
      });

      act(() => {
        result.current.fireLoadMoreOnInputChange('second');
      });

      // Neither call fires onLoadItems directly (defined filteringText dedup)
      expect(onLoadItems).not.toHaveBeenCalled();

      // But recovery click uses the latest stored text
      act(() => {
        result.current.fireLoadMoreOnRecoveryClick();
      });

      expect(onLoadItems).toHaveBeenCalledWith(expect.objectContaining({ filteringText: 'second' }));
    });

    test('does not update ref when same text is passed again', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'pending' as const, onLoadItems },
      });

      act(() => {
        result.current.fireLoadMoreOnInputChange('abc');
      });

      act(() => {
        result.current.fireLoadMoreOnInputChange('abc');
      });

      // Verify stored text is still 'abc' via recovery click
      act(() => {
        result.current.fireLoadMoreOnRecoveryClick();
      });

      expect(onLoadItems).toHaveBeenCalledTimes(1);
      expect(onLoadItems).toHaveBeenCalledWith(expect.objectContaining({ filteringText: 'abc' }));
    });
  });

  describe('fireLoadMore lastFilteringText tracking', () => {
    test('fireLoadMoreOnMenuOpen deduplicates when text matches stored value', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'pending' as const, onLoadItems },
      });

      // Set filtering text via input change
      act(() => {
        result.current.fireLoadMoreOnInputChange('typed');
      });

      // Open menu — passes 'typed' as filteringText, which matches the ref → dedup
      act(() => {
        result.current.fireLoadMoreOnMenuOpen();
      });

      expect(onLoadItems).not.toHaveBeenCalled();
    });

    test('fireLoadMoreOnScroll fires with stored filteringText', () => {
      const onLoadItems = jest.fn();

      const { result } = renderHook(useMenuLoadMore, {
        initialProps: { menu: baseMenu, statusType: 'pending' as const, onLoadItems },
      });

      // Store a filtering text
      act(() => {
        result.current.fireLoadMoreOnInputChange('query');
      });

      // Scroll fires with undefined filteringText → uses stored value
      act(() => {
        result.current.fireLoadMoreOnScroll();
      });

      expect(onLoadItems).toHaveBeenCalledWith({
        menuId: 'test-menu',
        filteringText: 'query',
        firstPage: false,
        samePage: false,
      });
    });
  });
});
