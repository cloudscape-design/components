// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useInputKeydownHandler } from '../input-controller';
import { renderHook } from '../../__tests__/render-hook';
import { CancelableEventHandler, BaseKeyDetail, fireCancelableEvent } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';

describe('useInputKeydownHandler', () => {
  const open = true;
  const onArrowDown = jest.fn();
  const onArrowUp = jest.fn();
  const onEnter = jest.fn();
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
    const { result } = renderHook(useInputKeydownHandler, {
      initialProps: { open, onArrowDown, onArrowUp, onEnter, onKeyDown },
    });
    handleKeyDown = result.current;
  });

  test('triggers respective key handlers', () => {
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.down, ...keyDetail });
    expect(onArrowDown).toBeCalled();
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.up, ...keyDetail });
    expect(onArrowUp).toBeCalled();
    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail });
    expect(onEnter).toBeCalled();
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
    const { result } = renderHook(useInputKeydownHandler, {
      initialProps: { open: false, onArrowDown, onArrowUp, onEnter, onKeyDown },
    });
    handleKeyDown = result.current;

    fireCancelableEvent(handleKeyDown, { keyCode: KeyCode.enter, ...keyDetail }, event);

    expect(spy).not.toBeCalled();
    expect(onEnter).not.toBeCalled();
  });
});
