// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createRef } from 'react';

import { act, renderHook } from '../../__tests__/render-hook';
import { flattenOptions } from '../../internal/components/option/utils/flatten-options';
import { getOptionId } from '../../internal/components/options-list/utils/use-ids';
import { BaseKeyDetail, createCustomEvent } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';
import { useSelect } from '../utils/use-select';

const createTestEvent = (keyCode: KeyCode): CustomEvent<BaseKeyDetail> =>
  createCustomEvent({
    cancelable: true,
    detail: {
      keyCode,
      key: '',
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      isComposing: false,
    },
  });

const optionChild31 = { value: 'child31', label: 'Child 3-1' };
const options = [
  {
    label: 'Group 1',
    options: [
      {
        label: 'Child 1',
        value: 'child1',
      },
      {
        label: 'Child 2',
        disabled: true,
      },
    ],
  },
  {
    label: 'Option 1',
    labelTag: 'bx',
  },
  {
    label: 'Group 2',
    disabled: true,
    options: [
      {
        label: 'Child 1',
      },
      {
        label: 'Child 2',
        disabled: true,
      },
    ],
  },
  {
    label: 'Group 3',
    options: [optionChild31],
  },
] as const;

const { flatOptions } = flattenOptions(options);
const updateSelectedOption = jest.fn();
const initialProps = {
  selectedOptions: [],
  updateSelectedOption,
  options: flatOptions,
  rootRef: createRef() as any,
  externalRef: createRef() as any,
  filteringType: 'auto',
  fireLoadItems: () => {},
  setFilteringValue: () => {},
  statusType: 'pending' as const,
};

describe('useSelect', () => {
  describe('default props', () => {
    const hook = renderHook(useSelect, {
      initialProps,
    });

    const { isOpen, highlightedOption, getTriggerProps, getMenuProps, getFilterProps, getOptionProps } =
      hook.result.current;

    test('should return isOpen=false as the initial state', () => {
      expect(isOpen).toBe(false);
    });

    test('should return highlightedOption=undefined as the initial state', () => {
      expect(highlightedOption).toBe(undefined);
    });

    test('should return getTriggerProps that configures the trigger', () => {
      const triggerProps = getTriggerProps();
      expect(Object.keys(triggerProps)).toEqual([
        'ref',
        'onFocus',
        'autoFocus',
        'ariaHasPopup',
        'ariaControls',
        'onMouseDown',
        'onKeyDown',
      ]);
      expect(triggerProps.ref).toEqual({ current: null });
    });

    test('should return getMenuProps that configures the menu', () => {
      const { ref, open, nativeAttributes } = getMenuProps();
      expect({ ref, open, nativeAttributes }).toEqual({
        nativeAttributes: undefined,
        open: false,
        ref: { current: null },
      });
    });

    test('should return getFilterProps that configures the filter', () => {
      const { ref, __nativeAttributes } = getFilterProps();
      expect({ ref, __nativeAttributes }).toEqual({
        __nativeAttributes: {
          'aria-activedescendant': undefined,
          'aria-owns': __nativeAttributes!['aria-owns'],
          'aria-controls': __nativeAttributes!['aria-controls'],
        },
        ref: { current: null },
      });
    });

    test('should return getOptionProps that configures the options', () => {
      const optionProps = getOptionProps(flatOptions[1], 1);
      const { id: menuId } = getMenuProps();
      expect(optionProps).toEqual({
        'data-mouse-target': 1,
        highlighted: false,
        key: 1,
        option: { type: 'child', option: { label: 'Child 1', value: 'child1' } },
        selected: false,
        isNextSelected: false,
        indeterminate: false,
        id: getOptionId(menuId!, 1),
      });
    });
  });

  test('option group is not selected when its only option is selected', () => {
    const hook = renderHook(useSelect, { initialProps: { ...initialProps, selectedOptions: [optionChild31] } });
    const { getOptionProps, getMenuProps } = hook.result.current;
    const { id: menuId } = getMenuProps();

    const groupProps = getOptionProps(flatOptions[7], 7);
    expect(groupProps).toEqual({
      'data-mouse-target': -1,
      highlighted: false,
      key: 7,
      option: { type: 'parent', option: { label: 'Group 3', options: [{ value: 'child31', label: 'Child 3-1' }] } },
      selected: false,
      isNextSelected: true,
      indeterminate: false,
      id: getOptionId(menuId!, 7),
    });

    const optionProps = getOptionProps(flatOptions[8], 8);
    expect(optionProps).toEqual({
      'data-mouse-target': 8,
      highlighted: false,
      key: 8,
      option: { type: 'child', option: { value: 'child31', label: 'Child 3-1' } },
      selected: true,
      isNextSelected: false,
      indeterminate: false,
      id: getOptionId(menuId!, 8),
    });
  });

  test('should open and close the dropdown', () => {
    const hook = renderHook(useSelect, {
      initialProps,
    });

    const { getTriggerProps } = hook.result.current;
    const triggerProps = getTriggerProps();
    const testEvent = createCustomEvent<any>({ cancelable: true });
    act(() => triggerProps.onMouseDown && triggerProps.onMouseDown(testEvent));
    expect(hook.result.current.isOpen).toBe(true);
    expect(testEvent.defaultPrevented).toBe(true);
  });

  test('should open and navigate to the first option (keyboard:down)', () => {
    const hook = renderHook(useSelect, {
      initialProps,
    });

    const { getTriggerProps } = hook.result.current;
    const triggerProps = getTriggerProps();
    act(() => triggerProps.onKeyDown && triggerProps.onKeyDown(createTestEvent(KeyCode.down)));
    expect(hook.result.current.isOpen).toBe(true);
    expect(hook.result.current.highlightedOption).toEqual({
      type: 'child',
      option: {
        label: 'Child 1',
        value: 'child1',
      },
    });
    expect(hook.result.current.highlightType.type).toBe('keyboard');
    expect(hook.result.current.highlightType.moveFocus).toBe(true);
  });

  test('should navigate to the last option by triggering keyboard:up on first option', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps },
    });

    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.up)));
    expect(hook.result.current.highlightedOption).toEqual({ type: 'child', option: optionChild31 });
  });

  test('should navigate to the first parent option by triggering keyboard:up on second child option (interactive groups)', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, useInteractiveGroups: true },
    });

    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    expect(hook.result.current.highlightedOption).toEqual({
      option: { label: 'Child 1', value: 'child1' },
      type: 'child',
    });
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.up)));
    expect(hook.result.current.highlightedOption).toEqual({
      option: {
        label: 'Group 1',
        options: [
          {
            label: 'Child 1',
            value: 'child1',
          },
          {
            label: 'Child 2',
            disabled: true,
          },
        ],
      },
      type: 'parent',
    });
  });

  test('should navigate to the first option by triggering keyboard:down on last option', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps },
    });

    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.up)));
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    expect(hook.result.current.highlightedOption).toEqual({
      type: 'child',
      option: {
        label: 'Child 1',
        value: 'child1',
      },
    });
  });

  test('should open and highlight the selected option (keyboard:enter)', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, filteringType: 'none', selectedOptions: [initialProps.options[1].option] },
    });

    const { getTriggerProps } = hook.result.current;
    const triggerProps = getTriggerProps();
    act(() => triggerProps.onKeyDown && triggerProps.onKeyDown(createTestEvent(KeyCode.enter)));
    expect(hook.result.current.isOpen).toBe(true);
    expect(hook.result.current.highlightedOption).toEqual({
      type: 'child',
      option: {
        label: 'Child 1',
        value: 'child1',
      },
    });
    expect(hook.result.current.highlightType.type).toBe('keyboard');
    expect(hook.result.current.highlightType.moveFocus).toBe(true);
  });

  test('should open and highlight the selected option (mouse)', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, filteringType: 'none', selectedOptions: [initialProps.options[1].option] },
    });

    const { getTriggerProps } = hook.result.current;
    const triggerProps = getTriggerProps();
    act(() => triggerProps.onMouseDown && triggerProps.onMouseDown(createCustomEvent({})));
    expect(hook.result.current.isOpen).toBe(true);
    expect(hook.result.current.highlightedOption).toEqual({
      type: 'child',
      option: {
        label: 'Child 1',
        value: 'child1',
      },
    });
    expect(hook.result.current.highlightType.type).toBe('mouse');
    expect(hook.result.current.highlightType.moveFocus).toBe(true);
  });

  test('should open and navigate to the first option and select', () => {
    const hook = renderHook(useSelect, {
      initialProps,
    });

    const { getTriggerProps } = hook.result.current;
    const triggerProps = getTriggerProps();
    act(() => triggerProps.onKeyDown && triggerProps.onKeyDown(createTestEvent(KeyCode.down)));
    const { getFilterProps } = hook.result.current;
    act(() => getFilterProps().onKeyDown!(createTestEvent(KeyCode.enter)));
    expect(hook.result.current.isOpen).toBe(false);
    expect(updateSelectedOption).toHaveBeenCalledWith(
      {
        label: 'Child 1',
        value: 'child1',
      },
      false
    );
  });

  test('should open and navigate to the first option and select and keep open', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, keepOpen: true },
    });

    const { getTriggerProps } = hook.result.current;
    const triggerProps = getTriggerProps();
    act(() => triggerProps.onKeyDown && triggerProps.onKeyDown(createTestEvent(KeyCode.down)));
    const { getFilterProps } = hook.result.current;
    act(() => getFilterProps().onKeyDown!(createTestEvent(KeyCode.enter)));
    expect(hook.result.current.isOpen).toBe(true);
    expect(updateSelectedOption).toHaveBeenCalledWith(
      {
        label: 'Child 1',
        value: 'child1',
      },
      false
    );
  });

  test('should open and navigate to the second disabled option', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps },
    });

    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    expect(hook.result.current.highlightedOption).toEqual({
      disabled: true,
      option: { disabled: true, label: 'Child 2' },
      type: 'child',
    });
  });

  test('should open and navigate to the second disabled option [no filtering]', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, filteringType: 'none' },
    });
    act(() => {
      const onKeyDown = hook.result.current.getMenuProps().onKeyDown;
      if (onKeyDown) {
        onKeyDown(createTestEvent(KeyCode.down));
      }
    });
    act(() => {
      const onKeyDown = hook.result.current.getMenuProps().onKeyDown;
      if (onKeyDown) {
        onKeyDown(createTestEvent(KeyCode.down));
      }
    });
    expect(hook.result.current.highlightedOption).toEqual({
      disabled: true,
      option: { disabled: true, label: 'Child 2' },
      type: 'child',
    });
  });

  test('should navigate to disabled item but not select by enter', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, keepOpen: true },
    });
    updateSelectedOption.mockClear();
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.enter)));
    expect(updateSelectedOption).toHaveBeenCalledTimes(1);
    updateSelectedOption.mockClear();
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.down)));
    act(() => hook.result.current.getFilterProps().onKeyDown!(createTestEvent(KeyCode.enter)));
    expect(updateSelectedOption).not.toHaveBeenCalled();
  });

  test('should clear the highlight on the option when a key is typed into the filter', () => {
    const hook = renderHook(useSelect, { initialProps });
    const filterProps = hook.result.current.getFilterProps();
    // Select an option using the keyboard
    act(() => filterProps.onKeyDown!(createTestEvent(KeyCode.down)));
    expect(hook.result.current.highlightedOption).toBeTruthy();
    // Type in the letter "C"
    act(() => filterProps.onChange!(createCustomEvent({ detail: { value: 'C' } })));
    expect(hook.result.current.highlightedOption).toBeUndefined();
  });

  test('select without filter should open and navigate to selected option', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, filteringType: 'none', selectedOptions: [{ value: 'child1' }] },
    });
    const { getTriggerProps } = hook.result.current;
    const triggerProps = getTriggerProps();
    act(() => triggerProps.onKeyDown && triggerProps.onKeyDown(createTestEvent(KeyCode.space)));
    expect(hook.result.current.isOpen).toBe(true);
    expect(hook.result.current.highlightedOption).toEqual({
      type: 'child',
      option: {
        label: 'Child 1',
        value: 'child1',
      },
    });
  });

  test('select with filter should open and NOT navigate to selected option', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, selectedOptions: [{ value: 'child1' }] },
    });
    const { getTriggerProps } = hook.result.current;
    const triggerProps = getTriggerProps();
    act(() => triggerProps.onKeyDown && triggerProps.onKeyDown(createTestEvent(KeyCode.space)));
    expect(hook.result.current.isOpen).toBe(true);
    expect(hook.result.current.highlightedOption).toBeFalsy();
  });

  describe('calculates if the highlighted option is selected', () => {
    test('highlighted option is selected', () => {
      const hook = renderHook(useSelect, {
        initialProps: { ...initialProps, filteringType: 'none', selectedOptions: [{ value: 'child1' }] },
      });
      act(() => {
        const onKeyDown = hook.result.current.getMenuProps().onKeyDown;
        if (onKeyDown) {
          onKeyDown(createTestEvent(KeyCode.down));
        }
      });
      expect(hook.result.current.announceSelected).toEqual(true);
    });
    test('highlighted option is not selected', () => {
      const hook = renderHook(useSelect, {
        initialProps: { ...initialProps, filteringType: 'none' },
      });
      act(() => {
        const onKeyDown = hook.result.current.getMenuProps().onKeyDown;
        if (onKeyDown) {
          onKeyDown(createTestEvent(KeyCode.down));
        }
      });
      expect(hook.result.current.announceSelected).toEqual(false);
    });
  });

  test('should set aria-haspopup="listbox" on trigger for standard select', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, filteringType: 'none' },
    });
    expect(hook.result.current.getTriggerProps().ariaHasPopup).toBe('listbox');
  });

  test('should set aria-haspopup="dialog" on trigger for select with filtering', () => {
    const hook = renderHook(useSelect, {
      initialProps: { ...initialProps, filteringType: 'auto' },
    });
    expect(hook.result.current.getTriggerProps().ariaHasPopup).toBe('dialog');
  });
});
