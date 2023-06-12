// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { KeyCode } from '../../internal/keycode';
import { useKeyboardEvents } from '../../app-layout/utils/use-keyboard-events';

const sizeControlProps: any = {
  position: 'bottom',
  panelRef: { current: { clientHeight: 100, clientWidth: 100 } },
  setBottomPanelHeight: jest.fn(),
  setSidePanelWidth: jest.fn(),
};

describe('use-keyboard-events', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('bottom position, up key', () => {
    const onKeyDown = useKeyboardEvents(sizeControlProps);
    const e = new KeyboardEvent('keydown', { keyCode: KeyCode.up });
    onKeyDown(e as any);

    expect(sizeControlProps.setBottomPanelHeight).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.setBottomPanelHeight).toHaveBeenCalledWith(110);
  });

  test('side position, right key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });
    const e = new KeyboardEvent('keydown', { keyCode: KeyCode.right });
    onKeyDown(e as any);

    expect(sizeControlProps.setSidePanelWidth).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.setSidePanelWidth).toHaveBeenCalledWith(90);
  });

  test('bottom position, pageDown key', () => {
    const onKeyDown = useKeyboardEvents(sizeControlProps);
    const e = new KeyboardEvent('keydown', { keyCode: KeyCode.pageDown });
    onKeyDown(e as any);

    expect(sizeControlProps.setBottomPanelHeight).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.setBottomPanelHeight).toHaveBeenCalledWith(40);
  });

  test('side position, end key', () => {
    const onKeyDown = useKeyboardEvents({ ...sizeControlProps, position: 'side' });

    const e = new KeyboardEvent('keydown', { keyCode: KeyCode.end });
    onKeyDown(e as any);

    expect(sizeControlProps.setSidePanelWidth).toHaveBeenCalledTimes(1);
    expect(sizeControlProps.setSidePanelWidth).toHaveBeenCalledWith(0);
  });

  test('bottom position, unhandled key', () => {
    const onKeyDown = useKeyboardEvents(sizeControlProps);

    const e = new KeyboardEvent('keydown', { keyCode: KeyCode.space });
    onKeyDown(e as any);

    expect(sizeControlProps.setSidePanelWidth).toHaveBeenCalledTimes(0);
    expect(e.defaultPrevented).toBeFalsy();
  });
});
