// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useSelectVisibleOption } from '../controller';
import { useAutosuggestItems, UseAutosuggestItemsProps } from '../options-controller';
import { renderHook, act } from '../../__tests__/render-hook';
import { AutosuggestItem, AutosuggestProps } from '../interfaces';

const options = [{ value: 'Option 0' }, { label: 'Group 1', options: [{ value: 'Option 1' }, { value: 'Option 2' }] }];

describe('Autosuggest controller', () => {
  describe('useAutosuggestItems', () => {
    const defaultProps: UseAutosuggestItemsProps = {
      options,
      filterValue: '',
      filterText: '',
      filteringType: 'auto',
      onSelectItem: () => undefined,
    };

    test('"flattens" the list of options, indenting group items', () => {
      const { result } = renderHook(useAutosuggestItems, { initialProps: defaultProps });
      expect(result.current[0].items.length).toEqual(4);
      expect(result.current[0].items[1].type).toEqual('parent');
      expect(result.current[0].items[2].type).toEqual('child');
      expect(result.current[0].items[3].type).toEqual('child');
    });

    test('disables options inside a disabled group', () => {
      const withDisabledGroup = [options[0], { disabled: true, ...options[1] }];
      const { result } = renderHook(useAutosuggestItems, {
        initialProps: { ...defaultProps, options: withDisabledGroup },
      });
      expect(result.current[0].items.length).toEqual(4);
      expect(result.current[0].items[2].disabled).toEqual(true);
      expect(result.current[0].items[3].disabled).toEqual(true);
    });

    test('disables group that only contains disabled options', () => {
      const withDisabledOptions = [
        { value: 'Option 0' },
        {
          label: 'Group 1',
          options: [
            { value: 'Option 1', disabled: true },
            { value: 'Option 2', disabled: true },
          ],
        },
      ];
      const { result } = renderHook(useAutosuggestItems, {
        initialProps: { ...defaultProps, options: withDisabledOptions },
      });
      expect(result.current[0].items.length).toEqual(4);
      expect(result.current[0].items[1].disabled).toEqual(true);
    });

    test('does not disable group with at least one enabled option', () => {
      const withDisabledOptions = [
        { value: 'Option 0' },
        {
          label: 'Group 1',
          options: [{ value: 'Option 1' }, { value: 'Option 2', disabled: true }],
        },
      ];
      const {
        result: { current },
      } = renderHook(useAutosuggestItems, {
        initialProps: { ...defaultProps, options: withDisabledOptions },
      });
      expect(current[0].items).toHaveLength(4);
      expect(current[0].items[1].disabled).toBeFalsy();
    });

    test('does not filter again, if called with the same list', () => {
      const { result, rerender } = renderHook(useAutosuggestItems, {
        initialProps: {
          options,
          filterValue: '',
          filterText: '',
          filteringType: 'auto',
          onSelectItem: () => undefined,
        },
      });
      const firstResult = result.current;
      rerender({
        options,
        filterValue: '',
        filterText: '',
        filteringType: 'auto',
        onSelectItem: () => undefined,
      });
      expect(result.current[0].items).toBe(firstResult[0].items);
    });

    test('filters passed items and generates a "use-entered" item', () => {
      const { result } = renderHook(useAutosuggestItems, {
        initialProps: {
          options,
          filterValue: '1',
          filterText: '1',
          filteringType: 'auto',
          onSelectItem: () => undefined,
        },
      });
      expect(result.current[0].items.length).toEqual(3);
      expect(result.current[0].items[0]).toEqual({ value: '1', type: 'use-entered', option: { value: '1' } });
    });

    test('does not filter items using "filteringType" "manual"', () => {
      const { result } = renderHook(useAutosuggestItems, {
        initialProps: {
          options,
          filterValue: '1',
          filterText: '1',
          filteringType: 'manual',
          onSelectItem: () => undefined,
        },
      });
      expect(result.current[0].items.length).toEqual(5);
    });

    test('does not filter items when "showAll" flag is set', () => {
      const { result } = renderHook(useAutosuggestItems, {
        initialProps: {
          options,
          filterValue: '1',
          filterText: '1',
          filteringType: 'auto',
          onSelectItem: () => undefined,
        },
      });
      act(() => result.current[1].setShowAll(true));
      expect(result.current[0].items.length).toEqual(5);
    });

    test('does not filter again when called with the same parameters', () => {
      const { result, rerender } = renderHook(useAutosuggestItems, {
        initialProps: {
          options,
          filterValue: '1',
          filterText: '1',
          filteringType: 'auto',
          onSelectItem: () => undefined,
        },
      });
      const firstResult = result.current;
      rerender({
        options,
        filterValue: '1',
        filterText: '1',
        filteringType: 'auto',
        onSelectItem: () => undefined,
      });
      expect(firstResult[0].items).toBe(result.current[0].items);
    });

    test('handles large amount of nested options', () => {
      const options: AutosuggestProps.Option[] = [];
      for (let i = 0; i < 200_000; i++) {
        options.push({ value: i + '' });
      }
      // Throws "RangeError: Maximum call stack size exceeded" if options are copied using destructuring into Array.prototype.push.
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply.
      renderHook(useAutosuggestItems, {
        initialProps: {
          options: [{ options: options }],
          filterValue: '',
          filterText: '',
          filteringType: 'auto',
          onSelectItem: () => undefined,
        },
      });
    });
  });

  describe('useSelectVisibleOption', () => {
    const flatItems: AutosuggestItem[] = [
      {
        value: 'Option 0',
        option: { value: 'Option 0' },
      },
      {
        label: 'Group 1',
        type: 'parent',
        disabled: true,
        option: { label: 'Group 1' },
      },
      {
        value: 'Option 1',
        type: 'child',
        option: { value: 'Option 1' },
      },
      {
        value: 'Option 2',
        type: 'child',
        option: { value: 'Option 2' },
      },
    ];

    const selectOption: (option: AutosuggestItem) => void = jest.fn();
    const isInteractive = jest.fn<boolean, [AutosuggestItem?]>();
    let selectVisible: (index: number) => void;
    beforeEach(() => {
      jest.resetAllMocks();
      isInteractive.mockReturnValue(true);
      const { result } = renderHook(
        (args: Parameters<typeof useSelectVisibleOption>) => useSelectVisibleOption(...args),
        {
          initialProps: [flatItems, selectOption, isInteractive],
        }
      );
      selectVisible = result.current;
    });
    test('invokes the callback if the selected index is inside the options array and the corresponding option is interactive', () => {
      act(() => selectVisible(2));
      expect(isInteractive).toBeCalledWith(flatItems[2]);
      expect(selectOption).toBeCalledWith(flatItems[2]);
    });
    test('does not invoke the callback if the selected index is not in the options array', () => {
      act(() => selectVisible(5));
      expect(selectOption).not.toBeCalled();
    });
    test('does not invoke the callback if the corresponding option is not interactive', () => {
      isInteractive.mockReturnValueOnce(false);
      act(() => selectVisible(1));
      expect(isInteractive).toBeCalledWith(flatItems[1]);
      expect(selectOption).not.toBeCalled();
    });
  });

  test('selectHighlightedOptionWithKeyboard', () => {
    const onSelectItem = jest.fn();
    const { result } = renderHook(useAutosuggestItems, {
      initialProps: {
        options,
        filterValue: '1',
        filterText: '1',
        filteringType: 'auto',
        onSelectItem,
      },
    });

    result.current[1].selectHighlightedOptionWithKeyboard();
    expect(onSelectItem).not.toBeCalled();

    result.current[1].moveHighlightWithKeyboard(1);
    result.current[1].selectHighlightedOptionWithKeyboard();
    expect(onSelectItem).toBeCalledWith(result.current[0].items[0]);
  });
});
