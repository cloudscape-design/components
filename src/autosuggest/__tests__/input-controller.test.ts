// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useKeyboardHandler } from '../controller';
import { renderHook } from '../../__tests__/render-hook';
import { CancelableEventHandler, BaseKeyDetail, fireCancelableEvent } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';

describe('useKeyboardHandler', () => {
  const open = true;
  const onPressArrowDown = jest.fn();
  const onPressArrowUp = jest.fn();
  const onPressEnter = jest.fn();
  const onKeyDown = jest.fn();
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
    const { result } = renderHook(useKeyboardHandler, {
      initialProps: { open, onPressArrowDown, onPressArrowUp, onPressEnter, onKeyDown },
    });
    handleKeyDown = result.current;
  });

  test('triggers respective key handlers', () => {
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.down, ...keyDetail });
    expect(onPressArrowDown).toBeCalled();
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.up, ...keyDetail });
    expect(onPressArrowUp).toBeCalled();
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail });
    expect(onPressEnter).toBeCalled();
  });

  test('does not proxy "arrowDown" and "arrowUp" key downs to customer`s handler', () => {
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.up, ...keyDetail });
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.down, ...keyDetail });
    expect(onKeyDown).not.toBeCalled();
  });

  test('proxies every other keys to the customer`s handler', () => {
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail });
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.left, ...keyDetail });
    expect(onKeyDown).toBeCalledTimes(2);
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
    const { result } = renderHook(useKeyboardHandler, {
      initialProps: { open: false, onPressArrowDown, onPressArrowUp, onPressEnter, onKeyDown },
    });
    handleKeyDown = result.current;

    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail }, event);

    expect(spy).not.toBeCalled();
    expect(onPressEnter).not.toBeCalled();
  });
});
