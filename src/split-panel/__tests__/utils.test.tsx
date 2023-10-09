// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyCode } from '../../internal/keycode';
import { useKeyboardEvents } from '../../../lib/components/app-layout/utils/use-keyboard-events';

const sizeControlProps: any = {
  position: 'bottom',
  panelRef: { current: { clientHeight: 100, clientWidth: 100 } },
  onResize: jest.fn(),
};

describe('use-keyboard-events', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('bottom position, up key', () => {
    const onKeyDown = useKeyboardEvents(sizeControlProps);
    const event = new KeyboardEvent('keydown', { keyCode: KeyCode.up });
    onKeyDown(event as any);

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(110);
  });

  test('side position, right key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });
    const event = new KeyboardEvent('keydown', { keyCode: KeyCode.right });
    onKeyDown(event as any);

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(90);
  });

  test('bottom position, pageUp key', () => {
    const onKeyDown = useKeyboardEvents(sizeControlProps);
    const event = new KeyboardEvent('keydown', { keyCode: KeyCode.pageUp });
    onKeyDown(event as any);

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(160);
  });

  test('bottom position, pageDown key', () => {
    const onKeyDown = useKeyboardEvents(sizeControlProps);
    const event = new KeyboardEvent('keydown', { keyCode: KeyCode.pageDown });
    onKeyDown(event as any);

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(40);
  });

  test('side position, home key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });

    const event = new KeyboardEvent('keydown', { keyCode: KeyCode.home });
    onKeyDown(event as any);

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(1024);
  });

  test('side position, end key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });

    const event = new KeyboardEvent('keydown', { keyCode: KeyCode.end });
    onKeyDown(event as any);

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(0);
  });

  test('bottom position, unhandled key', () => {
    const onKeyDown = useKeyboardEvents(sizeControlProps);

    const event = new KeyboardEvent('keydown', { keyCode: KeyCode.space });
    onKeyDown(event as any);

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(0);
    expect(event.defaultPrevented).toBeFalsy();
  });
});
