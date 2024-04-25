// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyCode } from '../../internal/keycode';
import { useKeyboardEvents } from '../../app-layout/utils/use-keyboard-events';
import { fireEvent } from '@testing-library/react';

const sizeControlProps: any = {
  panelRef: { current: { clientHeight: 100, clientWidth: 100 } },
  onResize: jest.fn(),
};

describe('use-keyboard-events, bottom position', () => {
  let div: HTMLDivElement;

  beforeEach(() => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'bottom' });
    div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('bottom position, up key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.up });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(110);
  });

  test('bottom position, down key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.down });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(90);
  });

  test('bottom position, pageUp key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.pageUp });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(160);
  });

  test('bottom position, pageDown key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.pageDown });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(40);
  });

  test('bottom position, unhandled key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.space });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(0);
    expect(event?.defaultPrevented).toBeFalsy();
  });
});

describe('use-keyboard-events, side position', () => {
  let div: HTMLDivElement;

  beforeEach(() => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });
    div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('side position, right key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.right });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(90);
  });

  test('side position, home key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.home });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(1024);
  });

  test('side position, end key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.end });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(0);
  });
});

describe('use-keyboard-events, side position, rtl', () => {
  let div: HTMLDivElement;

  beforeEach(() => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });
    div = document.createElement('div');
    div.addEventListener('keydown', event => onKeyDown(event as any));
    div.style.direction = 'rtl';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('side position, right key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.right });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(110);
  });

  test('side position, left key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.left });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(90);
  });

  test('side position, bottom key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.down });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.onResize).toHaveBeenCalledWith(110);
  });

  test('side position, unhandled key', () => {
    fireEvent.keyDown(div, { keyCode: KeyCode.tab });
    expect(sizeControlProps.onResize).toHaveBeenCalledTimes(0);
  });
});
