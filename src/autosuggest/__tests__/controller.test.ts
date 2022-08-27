// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useSelectVisibleOption, useKeyboardHandler } from '../controller';
import { useAutosuggestItems, UseAutosuggestItemsProps } from '../options-controller';
import { renderHook, act } from '../../__tests__/render-hook';
import { AutosuggestItem } from '../interfaces';
import { CancelableEventHandler, BaseKeyDetail, fireCancelableEvent } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';

const options = [{ value: 'Option 0' }, { label: 'Group 1', options: [{ value: 'Option 1' }, { value: 'Option 2' }] }];

describe('Autosuggest controller', () => {
  describe('useAutosuggestItems', () => {
    const defaultProps: UseAutosuggestItemsProps = {
      options,
      filterValue: '',
      filterText: '',
      filteringType: 'auto',
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
        },
      });
      const firstResult = result.current;
      rerender({
        options,
        filterValue: '',
        filterText: '',
        filteringType: 'auto',
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
        },
      });
      const firstResult = result.current;
      rerender({
        options,
        filterValue: '1',
        filterText: '1',
        filteringType: 'auto',
      });
      expect(firstResult[0].items).toBe(result.current[0].items);
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

  describe('useKeyboardHandler', () => {
    const moveHighlight: (direction: -1 | 1) => void = jest.fn();
    const selectHighlighted: () => void = jest.fn();
    const open = true;
    const onKeyDown: CancelableEventHandler<BaseKeyDetail> = jest.fn();
    const openDropdown: () => void = jest.fn();
    const keyDetail = {
      key: '',
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    };
    let handleKeyDown: CancelableEventHandler<BaseKeyDetail>;
    beforeEach(() => {
      jest.resetAllMocks();
      const { result } = renderHook((args: Parameters<typeof useKeyboardHandler>) => useKeyboardHandler(...args), {
        initialProps: [moveHighlight, openDropdown, selectHighlighted, open, onKeyDown],
      });
      handleKeyDown = result.current;
    });
    test('moves highlight on arrow keys', () => {
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.down, ...keyDetail });
      expect(moveHighlight).toBeCalledWith(1);
      expect(openDropdown).toBeCalled();
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.up, ...keyDetail });
      expect(moveHighlight).toBeCalledWith(-1);
    });
    test('selects highlighted item on "enter" key', () => {
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail });
      expect(selectHighlighted).toBeCalled();
    });
    test('does not proxy "arrowDown" and "arrowUp" key downs to customer`s handler', () => {
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.up, ...keyDetail });
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.down, ...keyDetail });
      expect(onKeyDown).not.toBeCalled();
    });
    test('proxies every other keys to the customer`s handler', () => {
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.left, ...keyDetail });
      expect(onKeyDown).toBeCalled();
    });
    test(`proxies "enter" key to customer's handler`, () => {
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail });
      expect(onKeyDown).toBeCalled();
    });
    test(`prevents default on "enter" key when dropdown is open`, () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const spy = jest.spyOn(event, 'preventDefault');

      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail }, event);

      expect(spy).toBeCalled();
    });
    test(`does not prevent default on "enter" key when dropdown is closed`, () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const spy = jest.spyOn(event, 'preventDefault');
      const { result } = renderHook((args: Parameters<typeof useKeyboardHandler>) => useKeyboardHandler(...args), {
        initialProps: [moveHighlight, openDropdown, selectHighlighted, false, onKeyDown],
      });
      handleKeyDown = result.current;

      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail }, event);

      expect(spy).not.toBeCalled();
    });
  });
});
