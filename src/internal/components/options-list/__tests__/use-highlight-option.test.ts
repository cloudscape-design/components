// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook, act } from '../../../../__tests__/render-hook';
import { flattenOptions } from '../../option/utils/flatten-options';
import { useHighlightedOption } from '../utils/use-highlight-option';
import { DropdownOption } from '../../option/interfaces';

const isHighlightable = (option: DropdownOption) => option && option.type !== 'parent';

const options = [
  {
    label: 'Group 1',
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
];

const optionProp = flattenOptions(options).flatOptions;

describe('useHighlightedOption', () => {
  test('should move highlight and also highlight disabled options', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp, isHighlightable },
    });
    expect(hook.result.current[0].highlightedOption).toBe(undefined);
    act(() => hook.result.current[1].moveHighlightWithKeyboard(1));
    expect(hook.result.current[0].highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
    act(() => hook.result.current[1].moveHighlightWithKeyboard(1));
    act(() => hook.result.current[1].moveHighlightWithKeyboard(1));
    act(() => hook.result.current[1].moveHighlightWithKeyboard(1));
    expect(hook.result.current[0].highlightedOption).toEqual({
      option: { label: 'Child 1' },
      type: 'child',
      disabled: true,
    });
  });

  test('should go to the end and do not move further', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp, isHighlightable },
    });
    act(() => hook.result.current[1].goEndWithKeyboard());
    expect(hook.result.current[0].highlightedOption).toEqual({
      option: { label: 'Child 2', disabled: true },
      type: 'child',
      disabled: true,
    });
    act(() => hook.result.current[1].moveHighlightWithKeyboard(1));
    expect(hook.result.current[0].highlightedOption).toEqual({
      option: { label: 'Child 2', disabled: true },
      type: 'child',
      disabled: true,
    });
  });

  test('should move highlight to the beginning to do not go further', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp, isHighlightable },
    });
    expect(hook.result.current[0].highlightedOption).toBe(undefined);
    act(() => hook.result.current[1].moveHighlightWithKeyboard(1));
    expect(hook.result.current[0].highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
    act(() => hook.result.current[1].goHomeWithKeyboard());
    expect(hook.result.current[0].highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
    act(() => hook.result.current[1].moveHighlightWithKeyboard(-1));
    expect(hook.result.current[0].highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
  });

  test('should reset highlight', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp, isHighlightable },
    });
    expect(hook.result.current[0].highlightedOption).toBe(undefined);
    act(() => hook.result.current[1].moveHighlightWithKeyboard(1));
    expect(hook.result.current[0].highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
    act(() => hook.result.current[1].resetHighlightWithKeyboard());
    expect(hook.result.current[0].highlightedOption).toEqual(undefined);
  });

  test('should set highlighted index', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp, isHighlightable },
    });
    act(() => hook.result.current[1].setHighlightedIndexWithMouse(1));
    expect(hook.result.current[0].highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
  });

  test('should highlight option by value', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp, isHighlightable },
    });
    act(() => hook.result.current[1].highlightOptionWithKeyboard(optionProp[1]));
    expect(hook.result.current[0].highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
  });

  test('should update highlightType when highligh option', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp, isHighlightable },
    });
    act(() => hook.result.current[1].setHighlightedIndexWithMouse(1));
    expect(hook.result.current[0].highlightType).toEqual({ type: 'mouse', moveFocus: false });
    act(() => hook.result.current[1].highlightOptionWithKeyboard(optionProp[1]));
    expect(hook.result.current[0].highlightType).toEqual({ type: 'keyboard', moveFocus: true });
  });
});
