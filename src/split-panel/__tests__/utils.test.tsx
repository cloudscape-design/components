// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyCode } from '../../internal/keycode';
import { useKeyboardEvents } from '../../app-layout/utils/use-keyboard-events';
import { fireEvent } from '@testing-library/react';

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
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps });
    const div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
    fireEvent.keyDown(div, { keyCode: KeyCode.up });

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(110);
  });

  test('side position, right key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });
    const div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
    fireEvent.keyDown(div, { keyCode: KeyCode.right });

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(90);
  });

  test('bottom position, pageUp key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps });
    const div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
    fireEvent.keyDown(div, { keyCode: KeyCode.pageUp });

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(160);
  });

  test('bottom position, pageDown key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps });
    const div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
    fireEvent.keyDown(div, { keyCode: KeyCode.pageDown });

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(40);
  });

  test('side position, home key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });
    const div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
    fireEvent.keyDown(div, { keyCode: KeyCode.home });

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(1024);
  });

  test('side position, end key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });
    const div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
    fireEvent.keyDown(div, { keyCode: KeyCode.end });

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(0);
  });

  test('bottom position, unhandled key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps });
    const div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
    fireEvent.keyDown(div, { keyCode: KeyCode.space });

    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(0);
    expect(event?.defaultPrevented).toBeFalsy();
  });
});
