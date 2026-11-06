// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../../../__tests__/render-hook';
import { BaseKeyDetail } from '../../../../types/events';
import { OptionDefinition } from '../../../../types/option';
import { createCustomEvent } from '../../../events';
import { KeyCode } from '../../../keycode';
import { flattenOptions } from '../../option/utils/flatten-options';
import { getOptionId } from '../../options-list/utils/use-ids';
import { multiSelection } from '../selection/multi-selection';
import { singleSelection } from '../selection/single-selection';
import { useListbox, UseListboxProps } from '../use-listbox';

const HOME = 36;
const END = 35;

const createKeyEvent = (keyCode: number): CustomEvent<BaseKeyDetail> =>
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

const focusEvent = () => createCustomEvent({ detail: {} });
const blurEvent = () => createCustomEvent({ detail: { relatedTarget: null } });

// Flattened: 0 group header, 1 child a, 2 disabled child b, 3 option c, 4 option d.
const { flatOptions } = flattenOptions([
  {
    label: 'Group',
    options: [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ],
  },
  { value: 'c', label: 'C' },
  { value: 'd', label: 'D' },
]);

function renderListbox(props: Partial<UseListboxProps> = {}) {
  const onSelect = jest.fn();
  const hook = renderHook(useListbox, {
    initialProps: {
      options: flatOptions,
      selectedOptions: [],
      selection: singleSelection([]),
      onEscape: () => {},
      interactiveGroups: false,
      onSelect,
      spaceSelects: 'always',
      getParent: () => undefined,
      ...props,
    } as UseListboxProps,
  });
  const keyDown = (keyCode: number) => {
    const event = createKeyEvent(keyCode);
    act(() => hook.result.current.onKeyDown(event));
    return event;
  };
  return { hook, onSelect, keyDown };
}

describe('useListbox', () => {
  describe('Space', () => {
    test("chooses the highlighted option and prevents the native action when spaceSelects is 'always'", () => {
      const { hook, onSelect, keyDown } = renderListbox({ spaceSelects: 'always' });
      act(() => hook.result.current.highlight.setHighlightedIndexWithMouse(3));

      const event = keyDown(KeyCode.space);

      expect(event.defaultPrevented).toBe(true);
      expect(onSelect).toHaveBeenCalledWith(flatOptions[3]);
    });

    test("types when nothing is highlighted and spaceSelects is 'keyboard-highlight'", () => {
      const { onSelect, keyDown } = renderListbox({ spaceSelects: 'keyboard-highlight' });

      const event = keyDown(KeyCode.space);

      expect(event.defaultPrevented).toBe(false);
      expect(onSelect).not.toHaveBeenCalled();
    });

    test("types after a mouse highlight when spaceSelects is 'keyboard-highlight'", () => {
      const { hook, onSelect, keyDown } = renderListbox({ spaceSelects: 'keyboard-highlight' });
      act(() => hook.result.current.mouseHandlers.onMouseMove(3));

      const event = keyDown(KeyCode.space);

      expect(event.defaultPrevented).toBe(false);
      expect(onSelect).not.toHaveBeenCalled();
    });

    test("chooses after a keyboard highlight when spaceSelects is 'keyboard-highlight'", () => {
      const { onSelect, keyDown } = renderListbox({ spaceSelects: 'keyboard-highlight' });
      keyDown(KeyCode.down);

      const event = keyDown(KeyCode.space);

      expect(event.defaultPrevented).toBe(true);
      expect(onSelect).toHaveBeenCalledWith(flatOptions[1]);
    });
  });

  describe('Escape', () => {
    test('calls onEscape and stops propagation', () => {
      const onEscape = jest.fn();
      const { keyDown } = renderListbox({ onEscape });

      const event = keyDown(KeyCode.escape);

      expect(onEscape).toHaveBeenCalledTimes(1);
      expect(event.cancelBubble).toBe(true);
    });

    test('is not handled and keeps propagating without onEscape', () => {
      const { keyDown } = renderListbox({ onEscape: undefined });

      const event = keyDown(KeyCode.escape);

      expect(event.cancelBubble).toBe(false);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('Home and End', () => {
    test('move the highlight and keep the native action', () => {
      const { hook, keyDown } = renderListbox();

      const end = keyDown(END);
      expect(hook.result.current.highlightedIndex).toBe(4);
      expect(end.defaultPrevented).toBe(false);

      const home = keyDown(HOME);
      expect(hook.result.current.highlightedIndex).toBe(1);
      expect(home.defaultPrevented).toBe(false);
    });
  });

  describe('choosing', () => {
    test('ignores a disabled option', () => {
      const { hook, onSelect, keyDown } = renderListbox();
      act(() => hook.result.current.highlight.setHighlightedIndexWithMouse(2));

      keyDown(KeyCode.enter);
      act(() => hook.result.current.selectOption(flatOptions[2]));

      expect(onSelect).not.toHaveBeenCalled();
    });

    test('ignores a group header when groups are not interactive', () => {
      const { hook, onSelect } = renderListbox({ interactiveGroups: false });

      act(() => hook.result.current.selectOption(flatOptions[0]));

      expect(onSelect).not.toHaveBeenCalled();
    });

    test('chooses a group header when groups are interactive', () => {
      const { hook, onSelect, keyDown } = renderListbox({ interactiveGroups: true });
      keyDown(KeyCode.down);
      expect(hook.result.current.highlightedOption).toBe(flatOptions[0]);

      keyDown(KeyCode.enter);

      expect(onSelect).toHaveBeenCalledWith(flatOptions[0]);
    });

    test('chooses the highlighted option on Enter and prevents the native action', () => {
      const { onSelect, keyDown } = renderListbox();
      keyDown(KeyCode.down);

      const event = keyDown(KeyCode.enter);

      expect(event.defaultPrevented).toBe(true);
      expect(onSelect).toHaveBeenCalledWith(flatOptions[1]);
    });
  });

  describe('mouse', () => {
    test('onMouseMove highlights with mouse type and onMouseUp chooses', () => {
      const { hook, onSelect } = renderListbox();

      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
      expect(hook.result.current.highlightedOption).toBe(flatOptions[3]);
      expect(hook.result.current.highlightType.type).toBe('mouse');

      act(() => hook.result.current.mouseHandlers.onMouseUp(4));
      expect(onSelect).toHaveBeenCalledWith(flatOptions[4]);
    });

    test('ignore index -1', () => {
      const { hook, onSelect } = renderListbox();

      act(() => hook.result.current.mouseHandlers.onMouseMove(-1));
      act(() => hook.result.current.mouseHandlers.onMouseUp(-1));

      expect(hook.result.current.highlightedIndex).toBe(-1);
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('getOptionProps', () => {
    test('returns highlight, selection matched by value and the row id', () => {
      const selected: OptionDefinition = { value: 'c' };
      const { hook } = renderListbox({ selectedOptions: [selected], selection: singleSelection([selected]) });
      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
      const { listId, getOptionProps, selectedOptions } = hook.result.current;

      expect(selectedOptions).toEqual([flatOptions[3]]);
      expect(getOptionProps(flatOptions[3], 3)).toEqual(
        expect.objectContaining({
          option: flatOptions[3],
          highlighted: true,
          selected: true,
          id: getOptionId(listId, 3),
          'data-mouse-target': 3,
        })
      );
      expect(getOptionProps(flatOptions[4], 4)).toEqual(
        expect.objectContaining({ highlighted: false, selected: false, isPreviousSelected: true })
      );
    });

    test('gives a non-highlightable group header data-mouse-target -1', () => {
      const { hook } = renderListbox({ interactiveGroups: false });

      expect(hook.result.current.getOptionProps(flatOptions[0], 0)['data-mouse-target']).toBe(-1);
    });

    test('takes group state from the selection model', () => {
      const selectedOptions = [{ value: 'a' }];
      const { hook } = renderListbox({
        interactiveGroups: true,
        selectedOptions,
        selection: multiSelection(selectedOptions, { options: flatOptions, interactiveGroups: true }),
      });

      expect(hook.result.current.getOptionProps(flatOptions[0], 0)).toEqual(
        expect.objectContaining({ 'data-mouse-target': 0, selected: false, indeterminate: true })
      );
      expect(hook.result.current.getOptionProps(flatOptions[1], 1).selected).toBe(true);
    });
  });

  describe('activeDescendantId', () => {
    test('is the id of the highlighted row, and undefined when nothing is highlighted', () => {
      const { hook } = renderListbox();
      expect(hook.result.current.activeDescendantId).toBeUndefined();

      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
      expect(hook.result.current.activeDescendantId).toBe(getOptionId(hook.result.current.listId, 3));
    });
  });

  describe('getListProps', () => {
    test('returns the id, list ref and mouse handlers without keyboard props', () => {
      const { hook } = renderListbox();
      const { listId, listRef, mouseHandlers, getListProps } = hook.result.current;
      expect(getListProps({ withKeyboard: false })).toEqual({ id: listId, ref: listRef, ...mouseHandlers });
    });

    test('adds onKeyDown and aria-activedescendant with withKeyboard', () => {
      const { hook } = renderListbox();
      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
      const { listId, listRef, mouseHandlers, onKeyDown, getListProps } = hook.result.current;
      expect(getListProps({ withKeyboard: true })).toEqual({
        id: listId,
        ref: listRef,
        ...mouseHandlers,
        onKeyDown,
        nativeAttributes: { 'aria-activedescendant': getOptionId(listId, 3) },
      });
    });

    describe('embedded', () => {
      const getProps = (hook: ReturnType<typeof renderListbox>['hook']) =>
        hook.result.current.getListProps({ withKeyboard: true, embedded: true });

      test('adds onFocus and onBlur only with embedded', () => {
        const { hook } = renderListbox();
        const withoutEmbedded = hook.result.current.getListProps({ withKeyboard: true });
        expect(withoutEmbedded.onFocus).toBeUndefined();
        expect(withoutEmbedded.onBlur).toBeUndefined();
      });

      test('focus without a highlight highlights the first option with keyboard, and blur resets it', () => {
        const { hook } = renderListbox();
        act(() => getProps(hook).onFocus!(focusEvent()));
        expect(hook.result.current.highlightedIndex).toBe(1);
        expect(hook.result.current.highlightType.type).toBe('keyboard');

        act(() => getProps(hook).onBlur!(blurEvent()));
        expect(hook.result.current.highlightedIndex).toBe(-1);
      });

      test('focus keeps an existing highlight', () => {
        const { hook } = renderListbox();
        act(() => hook.result.current.mouseHandlers.onMouseMove(3));
        act(() => getProps(hook).onFocus!(focusEvent()));
        expect(hook.result.current.highlightedIndex).toBe(3);
      });
    });
  });

  describe('scrollToIndex', () => {
    test('is called with the highlighted index when the highlight changes', () => {
      const { hook, keyDown } = renderListbox();
      const scrollToIndex = jest.fn();
      (hook.result.current.scrollToIndex as { current: unknown }).current = scrollToIndex;

      keyDown(KeyCode.down);
      expect(scrollToIndex).toHaveBeenLastCalledWith(1);

      act(() => hook.result.current.mouseHandlers.onMouseMove(4));
      expect(scrollToIndex).toHaveBeenLastCalledWith(4);
      expect(scrollToIndex).toHaveBeenCalledTimes(2);
    });
  });

  describe('announceSelected', () => {
    test('is true only when the highlighted option is selected', () => {
      const { hook } = renderListbox({
        selectedOptions: [{ value: 'c' }],
        selection: singleSelection([{ value: 'c' }]),
      });

      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
      expect(hook.result.current.announceSelected).toBe(true);

      act(() => hook.result.current.mouseHandlers.onMouseMove(4));
      expect(hook.result.current.announceSelected).toBe(false);
    });
  });

  describe('announcement', () => {
    test('announces the highlighted option, with selectedAriaLabel when it is selected', () => {
      const { hook } = renderListbox({
        selectedOptions: [{ value: 'c' }],
        selection: singleSelection([{ value: 'c' }]),
        selectedAriaLabel: 'Selected',
      });
      expect(hook.result.current.announcement).toBe('');

      act(() => hook.result.current.mouseHandlers.onMouseMove(3));
      expect(hook.result.current.announcement).toBe('Selected C');

      act(() => hook.result.current.mouseHandlers.onMouseMove(4));
      expect(hook.result.current.announcement).toBe('D');
    });
  });
});
