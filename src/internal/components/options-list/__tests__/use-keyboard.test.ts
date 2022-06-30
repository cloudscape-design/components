// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook, act } from '../../../../__tests__/render-hook';
import { useTriggerKeyboard, useMenuKeyboard } from '../utils/use-keyboard';
import { KeyCode } from '../../../keycode';

const createKeyEventDetail = ([name, keyCode]: any) => {
  return { name, eventDetail: { detail: { keyCode }, preventDefault: jest.fn() } };
};

const triggerKeys = [
  ['up', KeyCode.up],
  ['down', KeyCode.down],
].map(createKeyEventDetail);

const menuKeys: any = [
  ['up', KeyCode.up],
  ['down', KeyCode.down],
  ['home', 36],
  ['end', 35],
  ['escape', KeyCode.escape],
  ['enter', KeyCode.enter],
  ['space', KeyCode.space],
].reduce<any>((acc, [name, keyCode]) => {
  acc[name] = { detail: { keyCode }, preventDefault: jest.fn() };
  return acc;
}, {});

const menuInitialProps = {
  moveHighlight: () => {},
  selectOption: () => {},
  goHome: () => {},
  goEnd: () => {},
  closeDropdown: () => {},
  isKeyboard: { current: false },
};

describe('useTriggerKeyboard', () => {
  triggerKeys.forEach(({ name, eventDetail }) => {
    test(`should call openDropdown and goHome when press ${name}`, () => {
      const openDropdown = jest.fn();
      const goHome = jest.fn();
      const isKeyboard = { current: false };
      const hook = renderHook(useTriggerKeyboard, {
        initialProps: {
          openDropdown,
          goHome,
          isKeyboard,
        },
      });
      act(() => hook.result.current(eventDetail as any));
      expect(openDropdown).toHaveBeenCalled();
      expect(goHome).toHaveBeenCalled();
      expect(isKeyboard.current).toBe(true);
      expect(eventDetail.preventDefault).toHaveBeenCalled();
    });
  });
});

describe('useMenuKeyboard', () => {
  test('should move highlight up when pressing up', () => {
    const moveHighlight = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, moveHighlight, isKeyboard, isSelectingUsingSpace },
    });
    act(() => hook.result.current(menuKeys.up));
    expect(moveHighlight).toHaveBeenCalledWith(-1);
    expect(menuKeys.up.preventDefault).toHaveBeenCalled();
    expect(isKeyboard.current).toBe(true);
  });

  test('should move highlight down when pressing down', () => {
    const moveHighlight = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, moveHighlight, isKeyboard, isSelectingUsingSpace },
    });
    act(() => hook.result.current(menuKeys.down));
    expect(moveHighlight).toHaveBeenCalledWith(1);
    expect(menuKeys.down.preventDefault).toHaveBeenCalled();
    expect(isKeyboard.current).toBe(true);
  });

  test('should go home when pressing home', () => {
    const goHome = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, goHome, isKeyboard, isSelectingUsingSpace },
    });
    act(() => hook.result.current(menuKeys.home));
    expect(goHome).toHaveBeenCalled();
    expect(menuKeys.home.preventDefault).not.toHaveBeenCalled();
    expect(isKeyboard.current).toBe(true);
  });

  test('should go to end when pressing end', () => {
    const goEnd = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, goEnd, isKeyboard, isSelectingUsingSpace },
    });
    act(() => hook.result.current(menuKeys.end));
    expect(goEnd).toHaveBeenCalled();
    expect(menuKeys.end.preventDefault).not.toHaveBeenCalled();
    expect(isKeyboard.current).toBe(true);
  });

  test('should close the dropdown when pressing escape', () => {
    const closeDropdown = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, closeDropdown, isKeyboard, isSelectingUsingSpace },
    });
    act(() => hook.result.current(menuKeys.escape));
    expect(closeDropdown).toHaveBeenCalled();
    expect(menuKeys.escape.preventDefault).not.toHaveBeenCalled();
    expect(isKeyboard.current).toBe(true);
  });

  test('should select option when pressing enter', () => {
    const selectOption = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, selectOption, isKeyboard, isSelectingUsingSpace },
    });
    act(() => hook.result.current(menuKeys.enter));
    expect(selectOption).toHaveBeenCalled();
    expect(menuKeys.enter.preventDefault).toHaveBeenCalled();
    expect(isKeyboard.current).toBe(true);
  });

  test('should not select option when pressing space when native space is in action (filtering enabled)', () => {
    const selectOption = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, selectOption, isKeyboard, isSelectingUsingSpace },
    });
    act(() => hook.result.current(menuKeys.space));
    expect(selectOption).not.toHaveBeenCalled();
    expect(menuKeys.space.preventDefault).not.toHaveBeenCalled();
    expect(isKeyboard.current).toBe(true);
  });

  test('should select option when pressing space when preventNativeSpace is enabled', () => {
    const selectOption = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, selectOption, isKeyboard, isSelectingUsingSpace, preventNativeSpace: true },
    });
    act(() => hook.result.current(menuKeys.space));
    expect(selectOption).toHaveBeenCalled();
    expect(menuKeys.space.preventDefault).toHaveBeenCalled();
    expect(isKeyboard.current).toBe(true);
  });

  test('should update `isSelectingUsingSpace` when selecting an item with space key', () => {
    const selectOption = jest.fn();
    const isKeyboard = { current: false };
    const isSelectingUsingSpace = { current: false };
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, selectOption, isKeyboard, isSelectingUsingSpace, preventNativeSpace: true },
    });
    act(() => hook.result.current(menuKeys.space));
    expect(isSelectingUsingSpace.current).toBe(true);
  });
});
