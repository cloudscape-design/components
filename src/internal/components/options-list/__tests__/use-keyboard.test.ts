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
  acc[name] = { detail: { keyCode }, preventDefault: jest.fn(), stopPropagation: jest.fn() };
  return acc;
}, {});

const menuInitialProps = {
  goUp: () => {},
  goDown: () => {},
  selectOption: () => {},
  goHome: () => {},
  goEnd: () => {},
  closeDropdown: () => {},
};

describe('useTriggerKeyboard', () => {
  triggerKeys.forEach(({ name, eventDetail }) => {
    test(`should call openDropdown and goHome when press ${name}`, () => {
      const openDropdown = jest.fn();
      const goHome = jest.fn();
      const hook = renderHook(useTriggerKeyboard, {
        initialProps: {
          openDropdown,
          goHome,
        },
      });
      act(() => hook.result.current(eventDetail as any));
      expect(openDropdown).toHaveBeenCalled();
      expect(goHome).toHaveBeenCalled();
      expect(eventDetail.preventDefault).toHaveBeenCalled();
    });
  });
});

describe('useMenuKeyboard', () => {
  test('should go up when pressing up', () => {
    const goUp = jest.fn();
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, goUp },
    });
    act(() => hook.result.current(menuKeys.up));
    expect(goUp).toHaveBeenCalled();
    expect(menuKeys.up.preventDefault).toHaveBeenCalled();
  });

  test('should go down when pressing down', () => {
    const goDown = jest.fn();
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, goDown },
    });
    act(() => hook.result.current(menuKeys.down));
    expect(goDown).toHaveBeenCalled();
    expect(menuKeys.down.preventDefault).toHaveBeenCalled();
  });

  test('should go home when pressing home', () => {
    const goHome = jest.fn();
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, goHome },
    });
    act(() => hook.result.current(menuKeys.home));
    expect(goHome).toHaveBeenCalled();
    expect(menuKeys.home.preventDefault).not.toHaveBeenCalled();
  });

  test('should go to end when pressing end', () => {
    const goEnd = jest.fn();
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, goEnd },
    });
    act(() => hook.result.current(menuKeys.end));
    expect(goEnd).toHaveBeenCalled();
    expect(menuKeys.end.preventDefault).not.toHaveBeenCalled();
  });

  test('should close the dropdown when pressing escape', () => {
    const closeDropdown = jest.fn();
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, closeDropdown },
    });
    act(() => hook.result.current(menuKeys.escape));
    expect(closeDropdown).toHaveBeenCalled();
    expect(menuKeys.escape.preventDefault).not.toHaveBeenCalled();
  });

  test('should select option when pressing enter', () => {
    const selectOption = jest.fn();
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, selectOption },
    });
    act(() => hook.result.current(menuKeys.enter));
    expect(selectOption).toHaveBeenCalled();
    expect(menuKeys.enter.preventDefault).toHaveBeenCalled();
  });

  test('should not select option when pressing space when native space is in action (filtering enabled)', () => {
    const selectOption = jest.fn();
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, selectOption },
    });
    act(() => hook.result.current(menuKeys.space));
    expect(selectOption).not.toHaveBeenCalled();
    expect(menuKeys.space.preventDefault).not.toHaveBeenCalled();
  });

  test('should select option when pressing space when preventNativeSpace is enabled', () => {
    const selectOption = jest.fn();
    const hook = renderHook(useMenuKeyboard, {
      initialProps: { ...menuInitialProps, selectOption, preventNativeSpace: true },
    });
    act(() => hook.result.current(menuKeys.space));
    expect(selectOption).toHaveBeenCalled();
    expect(menuKeys.space.preventDefault).toHaveBeenCalled();
  });
});
