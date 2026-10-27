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

  describe('with groups', () => {
    const compute = { label: 'Compute', value: 'compute', options: [] };
    const databases = { label: 'Databases', value: 'databases', options: [] };
    const groupedOptions: DropdownOption[] = [
      { type: 'parent', option: compute },
      { type: 'child', option: { label: 'EC2', value: 'ec2' } },
      { type: 'child', option: { label: 'Lambda', value: 'lambda' } },
      { type: 'parent', option: databases, disabled: true },
      { type: 'child', option: { label: 'Cassandra', value: 'cassandra' }, disabled: true },
      { type: 'child', option: { label: 'DocumentDB', value: 'documentdb' }, disabled: true },
      { option: { label: 'Cherry', value: 'cherry' } },
    ];

    // Feeds each highlighted option back into the hook, as the listbox does.
    const renderGroupedHook = (interactiveGroups: boolean) => {
      const highlightOption = jest.fn();
      const props = { ...initialProps, options: groupedOptions, highlightOption, interactiveGroups };
      const hook = renderHook(useTypeAhead, { initialProps: props });
      const type = (key: string) => {
        act(() => hook.result.current({ key } as React.KeyboardEvent));
        const lastCall = highlightOption.mock.calls[highlightOption.mock.calls.length - 1];
        hook.rerender({ ...props, highlightedOption: lastCall?.[0].option ?? null });
      };
      const highlightedLabels = () =>
        highlightOption.mock.calls.map(([option]: [DropdownOption]) => option.option.label);
      return { type, highlightedLabels };
    };

    test('interactive groups: highlights the option whose label matches, not its group', () => {
      const { type, highlightedLabels } = renderGroupedHook(true);
      type('e');
      expect(highlightedLabels()).toEqual(['EC2']);
    });

    test('interactive groups: repeated key cycles only through matching options and skips disabled ones', () => {
      const { type, highlightedLabels } = renderGroupedHook(true);
      ['c', 'c', 'c'].forEach(type);
      expect(highlightedLabels()).toEqual(['Compute', 'Cherry', 'Compute']);
    });

    test('non-interactive groups: skips the options of a group whose label matches', () => {
      const { type, highlightedLabels } = renderGroupedHook(false);
      type('c');
      expect(highlightedLabels()).toEqual(['Cherry']);
    });
  });

  test('ignores a key event that was already handled', () => {
    const highlightOption = jest.fn();
    const hook = renderHook(useTypeAhead, { initialProps: { ...initialProps, highlightOption } });
    act(() => {
      hook.result.current({ key: ' ', defaultPrevented: true } as React.KeyboardEvent);
      hook.result.current({ key: 'o' } as React.KeyboardEvent);
    });
    expect(highlightOption).toHaveBeenCalledWith(options[0]);
  });
});
