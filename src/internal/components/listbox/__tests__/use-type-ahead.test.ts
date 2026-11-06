// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { act, renderHook } from '../../../../__tests__/render-hook';
import type { DropdownOption } from '../../option/interfaces';
import { useTypeAhead } from '../use-type-ahead';

const options: DropdownOption[] = [
  { option: { label: 'option 1', value: 'option1' } },
  { option: { label: 'option 2', value: 'option2' } },
];

const highlightOption = jest.fn();

const initialProps = {
  isEnabled: true,
  options,
  highlightOption,
  highlightedOption: null,
};

describe('useTypeAhead', () => {
  const hook = renderHook(useTypeAhead, {
    initialProps: initialProps,
  });

  beforeEach(() => {
    highlightOption.mockClear();
  });

  test('should highlight the correct option when a key is pressed', () => {
    act(() => {
      const event = { key: 'o' } as React.KeyboardEvent;
      hook.result.current(event);
    });

    expect(highlightOption).toHaveBeenCalledWith(options[0]);
  });

  test('should not highlight an option when a non-character key is pressed', () => {
    act(() => {
      const event = { key: 'Enter' } as React.KeyboardEvent;
      hook.result.current(event);
    });

    expect(highlightOption).not.toHaveBeenCalled();
  });

  test('should not highlight an option when isEnabled is false', () => {
    const hook = renderHook(useTypeAhead, {
      initialProps: {
        ...initialProps,
        isEnabled: false,
      },
    });

    act(() => {
      const event = { key: 'o' } as React.KeyboardEvent;
      hook.result.current(event);
    });

    expect(highlightOption).not.toHaveBeenCalled();
  });

  describe('disabled options', () => {
    // "beta" is disabled, so "b" matches it first, then "bravo".
    const withDisabled: DropdownOption[] = [
      { option: { label: 'alpha', value: 'alpha' } },
      { option: { label: 'beta', value: 'beta' }, disabled: true },
      { option: { label: 'bravo', value: 'bravo' } },
    ];

    test('reaches a disabled option, like Up and Down', () => {
      const highlightOption = jest.fn();
      const hook = renderHook(useTypeAhead, {
        initialProps: { ...initialProps, options: withDisabled, highlightOption },
      });
      act(() => hook.result.current({ key: 'b' } as React.KeyboardEvent));
      expect(highlightOption).toHaveBeenCalledWith(withDisabled[1]);
    });

    test('skips a disabled option with skipDisabled', () => {
      const highlightOption = jest.fn();
      const hook = renderHook(useTypeAhead, {
        initialProps: { ...initialProps, options: withDisabled, highlightOption, skipDisabled: true },
      });
      act(() => hook.result.current({ key: 'b' } as React.KeyboardEvent));
      expect(highlightOption).toHaveBeenCalledWith(withDisabled[2]);
    });
  });
});
