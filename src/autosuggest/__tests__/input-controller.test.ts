// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useInputKeydownHandler } from '../input-controller';
import { renderHook } from '../../__tests__/render-hook';
import { fireCancelableEvent } from '../../internal/events';
import { KeyCode } from '../../internal/keycode';

describe('useInputKeydownHandler', () => {
  const onPressArrowDown = jest.fn();
  const onPressArrowUp = jest.fn();
  const onPressEnter = jest.fn();
  const onPressEsc = jest.fn();
  const onKeyDown = jest.fn();
  const keyDetail = {
    key: '',
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
  };

  function render(open = true) {
    return renderHook(useInputKeydownHandler, {
      initialProps: { open, onPressArrowDown, onPressArrowUp, onPressEnter, onPressEsc, onKeyDown },
    });
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('triggers respective key handlers', () => {
    const { result } = render();
    fireCancelableEvent(result.current, { keyCode: KeyCode.down, ...keyDetail });
    expect(onPressArrowDown).toBeCalled();
    fireCancelableEvent(result.current, { keyCode: KeyCode.up, ...keyDetail });
    expect(onPressArrowUp).toBeCalled();
    fireCancelableEvent(result.current, { keyCode: KeyCode.enter, ...keyDetail });
    expect(onPressEnter).toBeCalled();
  });

  test('does not proxy "arrowDown" and "arrowUp" key downs to customer`s handler', () => {
    const { result } = render();
    fireCancelableEvent(result.current, { keyCode: KeyCode.up, ...keyDetail });
    fireCancelableEvent(result.current, { keyCode: KeyCode.down, ...keyDetail });
    expect(onKeyDown).not.toBeCalled();
  });

  test("proxies every other key to the customer's handler", () => {
    const { result } = render();
    fireCancelableEvent(result.current, { keyCode: KeyCode.escape, ...keyDetail });
    fireCancelableEvent(result.current, { keyCode: KeyCode.enter, ...keyDetail });
    fireCancelableEvent(result.current, { keyCode: KeyCode.left, ...keyDetail });
    expect(onKeyDown).toBeCalledTimes(3);
  });

  test(`prevents default on "enter" key when dropdown is open`, () => {
    const { result } = render();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy = jest.spyOn(event, 'preventDefault');

    fireCancelableEvent(result.current, { keyCode: KeyCode.enter, ...keyDetail }, event);

    expect(spy).toBeCalled();
  });

  test(`does not prevent default on "enter" key when dropdown is closed`, () => {
    const { result } = render(false);
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy = jest.spyOn(event, 'preventDefault');

    fireCancelableEvent(result.current, { keyCode: KeyCode.enter, ...keyDetail }, event);

    expect(spy).not.toBeCalled();
    expect(onPressEnter).not.toBeCalled();
  });
});
