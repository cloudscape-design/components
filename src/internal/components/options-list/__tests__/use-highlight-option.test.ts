// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook, act } from '../../../../__tests__/render-hook';
import { flattenOptions } from '../../option/utils/flatten-options';
import { createHighlightedOptionHook } from '../utils/use-highlight-option';
import { DropdownOption } from '../../option/interfaces';

const useHighlightedOption = createHighlightedOptionHook({
  isHighlightable: (option: DropdownOption) => option && option.type !== 'parent',
});

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
      initialProps: { options: optionProp },
    });
    expect(hook.result.current.highlightedOption).toBe(undefined);
    act(() => hook.result.current.moveHighlight(1));
    expect(hook.result.current.highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
    act(() => hook.result.current.moveHighlight(1));
    act(() => hook.result.current.moveHighlight(1));
    act(() => hook.result.current.moveHighlight(1));
    expect(hook.result.current.highlightedOption).toEqual({
      option: { label: 'Child 1' },
      type: 'child',
      disabled: true,
    });
  });

  test('should go to the end and do not move further', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp },
    });
    act(() => hook.result.current.goEnd());
    expect(hook.result.current.highlightedOption).toEqual({
      option: { label: 'Child 2', disabled: true },
      type: 'child',
      disabled: true,
    });
    act(() => hook.result.current.moveHighlight(1));
    expect(hook.result.current.highlightedOption).toEqual({
      option: { label: 'Child 2', disabled: true },
      type: 'child',
      disabled: true,
    });
  });

  test('should move highlight to the beginning to do not go further', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp },
    });
    expect(hook.result.current.highlightedOption).toBe(undefined);
    act(() => hook.result.current.moveHighlight(1));
    expect(hook.result.current.highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
    act(() => hook.result.current.goHome());
    expect(hook.result.current.highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
    act(() => hook.result.current.moveHighlight(-1));
    expect(hook.result.current.highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
  });

  test('should reset highlight', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp },
    });
    expect(hook.result.current.highlightedOption).toBe(undefined);
    act(() => hook.result.current.moveHighlight(1));
    expect(hook.result.current.highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
    act(() => hook.result.current.resetHighlight());
    expect(hook.result.current.highlightedOption).toEqual(undefined);
  });

  test('should set highlighted index', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp },
    });
    act(() => hook.result.current.setHighlightedIndex(1));
    expect(hook.result.current.highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
  });

  test('should highlight option by value', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp },
    });
    act(() => hook.result.current.highlightOption(optionProp[1]));
    expect(hook.result.current.highlightedOption).toEqual({ option: { label: 'Child 1' }, type: 'child' });
  });

  test('should update highlightType when highligh option', () => {
    const hook = renderHook(useHighlightedOption, {
      initialProps: { options: optionProp },
    });
    act(() => hook.result.current.setHighlightedIndex(1));
    expect(hook.result.current.highlightType).toEqual('mouse');
    act(() => hook.result.current.highlightOption(optionProp[1]));
    expect(hook.result.current.highlightType).toEqual('keyboard');
  });
});
