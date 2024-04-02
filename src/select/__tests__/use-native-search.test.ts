// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { renderHook, act } from '../../__tests__/render-hook';
import type { DropdownOption } from '../../internal/components/option/interfaces';
import { useNativeSearch } from '../utils/use-native-search';

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

describe('useNativeSearch', () => {
  const hook = renderHook(useNativeSearch, {
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
    const hook = renderHook(useNativeSearch, {
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
});
