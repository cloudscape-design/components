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

  test('ignores keys that were already handled by another handler', () => {
    const hook = renderHook(useTypeAhead, { initialProps });
    act(() => {
      hook.result.current({ key: ' ', defaultPrevented: true } as React.KeyboardEvent);
    });
    expect(highlightOption).not.toHaveBeenCalled();
    act(() => {
      hook.result.current({ key: 'o' } as React.KeyboardEvent);
    });
    expect(highlightOption).toHaveBeenCalledWith(options[0]);
  });

  describe('with groups', () => {
    const groupedOptions: DropdownOption[] = [
      { type: 'parent', option: { label: 'Compute', options: [] } },
      { type: 'child', option: { label: 'EC2', value: 'ec2' } },
      { type: 'child', option: { label: 'Lambda', value: 'lambda' } },
      { type: 'child', option: { label: 'Fargate', value: 'fargate' } },
      { type: 'parent', option: { label: 'Storage', options: [] } },
      { type: 'child', option: { label: 'S3', value: 's3' } },
    ];
    const renderGroupedHook = (highlightedOption: DropdownOption['option'] | null = null) =>
      renderHook(useTypeAhead, {
        initialProps: { ...initialProps, options: groupedOptions, highlightedOption, interactiveGroups: true },
      });

    test('with interactive groups, highlights the matching child rather than its non-matching group', () => {
      const hook = renderGroupedHook();
      act(() => {
        hook.result.current({ key: 'e' } as React.KeyboardEvent);
      });
      expect(highlightOption).toHaveBeenCalledTimes(1);
      expect(highlightOption).toHaveBeenCalledWith(groupedOptions[1]);
    });

    test('with interactive groups, highlights a group whose own label matches', () => {
      const hook = renderGroupedHook();
      act(() => {
        hook.result.current({ key: 'c' } as React.KeyboardEvent);
      });
      expect(highlightOption).toHaveBeenCalledWith(groupedOptions[0]);
    });

    test('with interactive groups, does not cycle into children of a matching group when their own labels do not match', () => {
      const hook = renderGroupedHook(groupedOptions[0].option);
      act(() => {
        hook.result.current({ key: 'c' } as React.KeyboardEvent);
      });
      act(() => {
        hook.result.current({ key: 'c' } as React.KeyboardEvent);
      });
      // Only the Compute group itself starts with "c", so repeating the key keeps it highlighted.
      expect(highlightOption).toHaveBeenCalledTimes(2);
      expect(highlightOption).toHaveBeenLastCalledWith(groupedOptions[0]);
    });

    test('with interactive groups, repeated key cycles only through matching options and skips disabled ones', () => {
      const options: DropdownOption[] = [
        { type: 'parent', option: { label: 'Compute', value: 'compute', options: [] } },
        { type: 'child', option: { label: 'EC2', value: 'ec2' } },
        { type: 'parent', option: { label: 'Databases', value: 'databases', options: [] }, disabled: true },
        { type: 'child', option: { label: 'Cassandra', value: 'cassandra' }, disabled: true },
        { option: { label: 'Cherry', value: 'cherry' } },
      ];
      const props = { ...initialProps, options, interactiveGroups: true };
      const hook = renderHook(useTypeAhead, { initialProps: props });
      // Feeds each highlighted option back into the hook, as the listbox does.
      ['c', 'c', 'c'].forEach(key => {
        act(() => {
          hook.result.current({ key } as React.KeyboardEvent);
        });
        hook.rerender({ ...props, highlightedOption: highlightOption.mock.lastCall[0].option });
      });
      expect(highlightOption.mock.calls.map(([option]) => option.option.label)).toEqual([
        'Compute',
        'Cherry',
        'Compute',
      ]);
    });

    test('without interactive groups, does not highlight children of a group whose label matches', () => {
      const hook = renderHook(useTypeAhead, {
        initialProps: { ...initialProps, options: groupedOptions },
      });
      act(() => {
        hook.result.current({ key: 'c' } as React.KeyboardEvent);
      });
      expect(highlightOption).not.toHaveBeenCalled();
    });
  });
});
