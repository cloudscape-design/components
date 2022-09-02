// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useAutosuggestInputController } from '../input-controller';
import { renderHook, act } from '../../__tests__/render-hook';
import { fireCancelableEvent } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';

describe('useAutosuggestInputController', () => {
  const onClose = jest.fn();
  const onBlur = jest.fn();
  const onKeyDown = jest.fn();
  const onPressArrowDown = jest.fn();
  const onPressArrowUp = jest.fn();
  const onPressEnter = jest.fn();
  const onPressEsc = jest.fn();
  const keyDetail = {
    key: '',
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
  };

  function render() {
    return renderHook(useAutosuggestInputController, {
      initialProps: {
        readOnly: false,
        onClose,
        onBlur,
        onKeyDown,
        onPressArrowDown,
        onPressArrowUp,
        onPressEnter,
        onPressEsc,
      },
    });
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleKeyDown', () => {
    test.each([
      [KeyCode.down, onPressArrowDown],
      [KeyCode.up, onPressArrowUp],
    ])('triggers respective arrow key handlers %s', (keyCode, handler) => {
      const { result } = render();
      fireCancelableEvent(result.current[1].handleKeyDown, { keyCode, ...keyDetail });
      expect(handler).toBeCalled();
      fireCancelableEvent(result.current[1].handleKeyDown, { keyCode, ...keyDetail });
      expect(handler).toBeCalled();
    });

    test('triggers onPressEsc handler when esc is called and dropdown is closed', () => {
      const { result } = render();
      fireCancelableEvent(result.current[1].handleKeyDown, { keyCode: KeyCode.escape, ...keyDetail });
      expect(onPressEsc).toBeCalledTimes(1);

      act(() => result.current[1].openDropdown());
      fireCancelableEvent(result.current[1].handleKeyDown, { keyCode: KeyCode.escape, ...keyDetail });
      expect(onPressEsc).toBeCalledTimes(1);
    });

    test.each([KeyCode.down, KeyCode.up])("does not proxy arrow keys to customer's handler %s", keyCode => {
      const { result } = render();
      fireCancelableEvent(result.current[1].handleKeyDown, { keyCode, ...keyDetail });
      expect(onKeyDown).not.toBeCalled();
    });

    test.each([KeyCode.escape, KeyCode.enter, KeyCode.left])(
      "proxies every other key to the customer's handler %s",
      keyCode => {
        const { result } = render();
        fireCancelableEvent(result.current[1].handleKeyDown, { keyCode, ...keyDetail });
        expect(onKeyDown).toBeCalledTimes(1);
      }
    );

    test.each([KeyCode.down, KeyCode.up])('opens dropdown when arrow key is pressed %s', keyCode => {
      const { result } = render();
      act(() => {
        fireCancelableEvent(result.current[1].handleKeyDown, { keyCode, ...keyDetail });
      });
      expect(result.current[0].open).toBe(true);
    });

    test.each([KeyCode.enter, KeyCode.escape])('closes dropdown when enter or esc is pressed %s', keyCode => {
      const { result } = render();
      act(() => result.current[1].openDropdown());
      act(() => {
        fireCancelableEvent(result.current[1].handleKeyDown, { keyCode, ...keyDetail });
      });
      expect(result.current[0].open).toBe(false);
    });

    test('prevents dropdown from closing if onPressEnter returns true', () => {
      onPressEnter.mockImplementation(() => true);
      const { result } = render();
      act(() => result.current[1].openDropdown());
      act(() => {
        fireCancelableEvent(result.current[1].handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail });
      });
      expect(result.current[0].open).toBe(true);
    });

    test('prevents default on "enter" key when dropdown is open', () => {
      const { result } = render();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const spy = jest.spyOn(event, 'preventDefault');
      act(() => result.current[1].openDropdown());
      fireCancelableEvent(result.current[1].handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail }, event);
      expect(spy).toBeCalled();
    });

    test('does not prevent default on "enter" key when dropdown is closed', () => {
      const { result } = render();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const spy = jest.spyOn(event, 'preventDefault');
      fireCancelableEvent(result.current[1].handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail }, event);
      expect(spy).not.toBeCalled();
    });
  });
});
