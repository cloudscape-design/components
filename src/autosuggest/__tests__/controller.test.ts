// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useKeyboardHandler } from '../controller';
import { useAutosuggestItems, UseAutosuggestItemsProps } from '../options-controller';
import { renderHook, act } from '../../__tests__/render-hook';
import { AutosuggestItem } from '../interfaces';
import { CancelableEventHandler, BaseKeyDetail, fireCancelableEvent, createCustomEvent } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';

const options = [{ value: 'Option 0' }, { label: 'Group 1', options: [{ value: 'Option 1' }, { value: 'Option 2' }] }];

function createKeyboardEvent(keyCode: number) {
  return createCustomEvent({
    detail: {
      keyCode,
      key: '?',
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    },
  });
}

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

    test('creates keydown interceptor', () => {
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

      expect(result.current[0].highlightedIndex).toBe(-1);

      result.current[1].interceptKeyDown(createKeyboardEvent(KeyCode.down));

      expect(result.current[0].highlightedIndex).toBe(0);

      result.current[1].interceptKeyDown(createKeyboardEvent(KeyCode.down));

      expect(result.current[0].highlightedIndex).toBe(2);

      result.current[1].interceptKeyDown(createKeyboardEvent(KeyCode.up));

      expect(result.current[0].highlightedIndex).toBe(0);

      result.current[1].interceptKeyDown(createKeyboardEvent(KeyCode.up));

      expect(result.current[0].highlightedIndex).toBe(0);

      result.current[1].interceptKeyDown(createKeyboardEvent(KeyCode.enter));

      expect(onSelectItem).toBeCalledWith(result.current[0].items[0]);
    });
  });

  describe('selectVisibleOption', () => {
    function render(onSelectItem: (option: AutosuggestItem) => void) {
      return renderHook(useAutosuggestItems, {
        initialProps: {
          options,
          filterValue: '',
          filterText: '',
          filteringType: 'auto',
          onSelectItem,
        },
      });
    }
    test('invokes the callback if the selected index is inside the options array and the corresponding option is interactive', () => {
      const selectOption = jest.fn();
      const { result } = render(selectOption);
      act(() => result.current[1].selectVisibleOptionWithMouse(2));
      expect(selectOption).toBeCalledWith(result.current[0].items[2]);
    });
    test('does not invoke the callback if the selected index is not in the options array', () => {
      const selectOption = jest.fn();
      const { result } = render(selectOption);
      act(() => result.current[1].selectVisibleOptionWithMouse(5));
      expect(selectOption).not.toBeCalled();
    });
    test('does not invoke the callback if the corresponding option is not interactive', () => {
      const selectOption = jest.fn();
      const { result } = render(selectOption);
      act(() => result.current[1].selectVisibleOptionWithMouse(1));
      expect(selectOption).not.toBeCalled();
    });
  });

  describe('useKeyboardHandler', () => {
    const interceptKeyDown: () => boolean = jest.fn();
    const open = true;
    const onKeyDown: CancelableEventHandler<BaseKeyDetail> = jest.fn();
    const openDropdown: () => void = jest.fn();
    const closeDropdown = () => undefined;
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
        initialProps: [open, openDropdown, closeDropdown, interceptKeyDown, onKeyDown],
      });
      handleKeyDown = result.current;
    });
    test('moves highlight on arrow keys', () => {
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.down, ...keyDetail });
      expect(interceptKeyDown).toBeCalled();
      expect(openDropdown).toBeCalled();
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.up, ...keyDetail });
      expect(interceptKeyDown).toBeCalled();
      expect(openDropdown).toBeCalled();
    });
    test('selects highlighted item on "enter" key', () => {
      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail });
      expect(interceptKeyDown).toBeCalled();
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
        initialProps: [false, openDropdown, closeDropdown, interceptKeyDown, onKeyDown],
      });
      handleKeyDown = result.current;

      fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail }, event);

      expect(spy).not.toBeCalled();
      expect(interceptKeyDown).not.toBeCalled();
    });
  });
});
